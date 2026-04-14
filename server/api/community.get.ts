const CHANNEL_ID = 'UCQVaKQcp4OxSg1eC6SF3NTw'

export default defineEventHandler(async () => {
  try {
    const { Innertube } = await import('youtubei.js')
    const innertube = await Innertube.create({ generate_session_locally: true })

    const channel = await innertube.getChannel(CHANNEL_ID)

    if (!channel.has_community) {
      return { posts: [] }
    }

    const community = await channel.getCommunity()
    const rawPosts = community.posts ?? []

    const posts = rawPosts.map((post: any) => {
      // Extract text content
      const text =
        post.content?.runs?.map((r: any) => r.text).join('') ??
        post.content?.text ??
        ''

      // Extract images
      const images: string[] = []
      if (post.attachment) {
        const att = post.attachment
        if (att.type === 'BackstageImageAttachment') {
          const thumb = att.image?.thumbnails?.at(-1)
          if (thumb?.url) images.push(thumb.url)
        } else if (att.type === 'PostMultiImage') {
          for (const img of att.images ?? []) {
            const t = img.thumbnails?.at(-1)
            if (t?.url) images.push(t.url)
          }
        }
      }

      return {
        id: post.id ?? post.post_id ?? null,
        text,
        images,
        likeCount: post.vote_count?.text ?? null,
        publishedAt: post.published_time_text?.text ?? null,
        url: post.id
          ? `https://www.youtube.com/post/${post.id}`
          : `https://www.youtube.com/channel/${CHANNEL_ID}/community`,
        authorName: post.author?.name ?? 'Feldup',
        authorAvatar:
          post.author?.thumbnails?.at(-1)?.url ?? null,
      }
    })

    return { posts }
  } catch (err: any) {
    // Graceful fallback — community posts may be temporarily unavailable
    console.error('[community] Error:', err?.message ?? err)
    return { posts: [], error: 'Community posts temporarily unavailable' }
  }
})
