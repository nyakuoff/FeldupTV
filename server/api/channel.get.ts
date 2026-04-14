const CHANNEL_ID = 'UCQVaKQcp4OxSg1eC6SF3NTw'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.youtubeApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'YouTube API key not configured' })
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('id', CHANNEL_ID)
  url.searchParams.set('part', 'snippet,statistics,brandingSettings')
  url.searchParams.set('key', apiKey)

  const data = await $fetch<Record<string, any>>(url.toString())

  if (!data.items?.length) {
    throw createError({ statusCode: 404, message: 'Channel not found' })
  }

  const ch: Record<string, any> = data.items[0]
  const stats: Record<string, any> = ch.statistics
  const snippet: Record<string, any> = ch.snippet
  const branding: Record<string, any> = ch.brandingSettings

  return {
    id: CHANNEL_ID,
    name: snippet.title,
    description: snippet.description,
    customUrl: snippet.customUrl,
    avatar: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url,
    banner: branding?.image?.bannerExternalUrl ?? null,
    country: snippet.country ?? null,
    subscriberCount: stats.hiddenSubscriberCount ? null : Number(stats.subscriberCount),
    videoCount: Number(stats.videoCount),
    viewCount: Number(stats.viewCount),
    publishedAt: snippet.publishedAt,
  }
})
