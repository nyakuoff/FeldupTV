// Attach cache to globalThis so it survives Nitro hot reloads in dev
const g = globalThis as any
const MEM_TTL_MS = 60 * 60 * 1000 // 1 hour

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const groqKey = config.groqApiKey

  if (!groqKey) {
    throw createError({ statusCode: 500, message: 'Groq API key not configured' })
  }

  // Return cached result if still fresh
  if (g.__felduptv_summary__ && Date.now() - g.__felduptv_summary_at__ < MEM_TTL_MS) {
    return g.__felduptv_summary__
  }

  // Gemini rate-limited us recently — return stale cache or gentle fallback
  if (g.__felduptv_summary_backoff__ && Date.now() < g.__felduptv_summary_backoff__) {
    if (g.__felduptv_summary__) return g.__felduptv_summary__
    return { summary: 'Check back soon for an AI summary of the latest from Feldup!', generatedAt: null }
  }

  // Prevent concurrent requests all hitting Gemini simultaneously
  if (g.__felduptv_summary_pending__) {
    await new Promise<void>(resolve => {
      const check = setInterval(() => {
        if (!g.__felduptv_summary_pending__) { clearInterval(check); resolve() }
      }, 200)
    })
    if (g.__felduptv_summary__) return g.__felduptv_summary__
  }

  g.__felduptv_summary_pending__ = true

  const origin = getRequestURL(event).origin

  // Fetch data in parallel
  const [videoData, communityData, bskyData] = await Promise.allSettled([
    $fetch<any>('/api/videos', { baseURL: origin }),
    $fetch<any>('/api/community', { baseURL: origin }),
    $fetch<any>('/api/bluesky?limit=10', { baseURL: origin }),
  ])

  const videos: any[] = videoData.status === 'fulfilled' ? (videoData.value?.videos ?? []) : []
  const community: any[] = communityData.status === 'fulfilled' ? (communityData.value?.posts ?? []) : []
  const bluesky: any[] = bskyData.status === 'fulfilled' ? (bskyData.value?.posts ?? []) : []

  // Build context for the prompt
  const recentVideos = videos.slice(0, 8).map((v: any) =>
    `- "${v.title}" (${v.publishedAt?.slice(0, 10) ?? 'unknown date'}) — ${v.viewCount?.toLocaleString() ?? '?'} views`
  ).join('\n')

  const recentPosts = community.slice(0, 5).map((p: any) =>
    `- [${p.publishedAt?.slice(0, 10) ?? '?'}] ${p.text?.slice(0, 200) ?? '(no text)'}`
  ).join('\n')

  const recentBsky = bluesky.slice(0, 5).map((p: any) =>
    `- [${p.indexedAt?.slice(0, 10) ?? '?'}] ${p.text?.slice(0, 200) ?? '(no text)'}`
  ).join('\n')

  const today = new Date().toISOString().slice(0, 10)

  const prompt = `Tu es un assistant qui résume l'actualité du créateur YouTube français Feldup (UCQVaKQcp4OxSg1eC6SF3NTw). Sa série phare s'appelle "Findings" — des épisodes numérotés où il traite de l'actualité et du lore du jeu vidéo. Les fans veulent savoir : quoi de neuf en ce moment, et c'est pour quand le prochain Findings ?

Date d'aujourd'hui : ${today}

Vidéos récentes (de la plus récente à la plus ancienne) :
${recentVideos || 'aucune'}

Posts communautaires YouTube récents :
${recentPosts || 'aucun'}

Posts Bluesky récents :
${recentBsky || 'aucun'}

Écris un résumé court et sympa de 2–3 phrases en français pour les fans qui visitent le site. Concentre-toi sur :
1. Le numéro et la date du dernier épisode de Findings
2. Les indices ou annonces sur le prochain épisode
3. Toute autre activité récente notable

Sois concis. N'utilise pas de puces ni de titres. Ne commence pas par "Feldup". Ne mentionne pas que c'est généré par une IA.`

  const apiUrl = `https://api.groq.com/openai/v1/chat/completions`

  let response: any
  try {
    response = await $fetch<any>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.4,
      },
    })
  } catch (err: any) {
    g.__felduptv_summary_pending__ = false
    const status = err?.response?.status ?? err?.statusCode ?? err?.status
    if (status === 429) {
      g.__felduptv_summary_backoff__ = Date.now() + 10 * 60 * 1000
      if (g.__felduptv_summary__) return g.__felduptv_summary__
      return { summary: 'Check back soon for an AI summary of the latest from Feldup!', generatedAt: null }
    }
    throw err
  }

  const text: string = response?.choices?.[0]?.message?.content?.trim() ?? ''

  if (!text) {
    g.__felduptv_summary_pending__ = false
    throw createError({ statusCode: 502, message: 'Empty response from Groq' })
  }

  const result = { summary: text, generatedAt: new Date().toISOString() }
  g.__felduptv_summary__ = result
  g.__felduptv_summary_at__ = Date.now()
  g.__felduptv_summary_pending__ = false
  return result
})
