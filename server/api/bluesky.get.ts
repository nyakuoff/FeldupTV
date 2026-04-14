const BLUESKY_HANDLE = 'feldup-official.bsky.social'
const BLUESKY_API = 'https://public.api.bsky.app/xrpc'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit ?? 20), 50)
  const cursor = (query.cursor as string) || undefined

  const url = new URL(`${BLUESKY_API}/app.bsky.feed.getAuthorFeed`)
  url.searchParams.set('actor', BLUESKY_HANDLE)
  url.searchParams.set('limit', String(limit))
  if (cursor) url.searchParams.set('cursor', cursor)

  try {
    const data = await $fetch<Record<string, any>>(url.toString())

    const posts: any[] = (data.feed ?? [])
      .filter((item: any) => {
        // Filter out reposts - only show Feldup's own posts
        return item.post?.author?.handle === BLUESKY_HANDLE
      })
      .map((item: any) => {
        const post = item.post
        const record = post.record
        const embed = post.embed

        const images: string[] = []
        if (embed?.$type === 'app.bsky.embed.images#view') {
          for (const img of embed.images ?? []) {
            if (img.thumb) images.push(img.thumb)
          }
        } else if (embed?.$type === 'app.bsky.embed.recordWithMedia#view') {
          for (const img of embed.media?.images ?? []) {
            if (img.thumb) images.push(img.thumb)
          }
        }

        return {
          uri: post.uri,
          cid: post.cid,
          text: record?.text ?? '',
          images,
          likeCount: post.likeCount ?? 0,
          replyCount: post.replyCount ?? 0,
          repostCount: post.repostCount ?? 0,
          indexedAt: post.indexedAt,
          createdAt: record?.createdAt ?? post.indexedAt,
          url: `https://bsky.app/profile/${BLUESKY_HANDLE}/post/${post.uri.split('/').at(-1)}`,
          authorName: post.author?.displayName ?? 'Feldup',
          authorAvatar: post.author?.avatar ?? null,
          authorHandle: post.author?.handle ?? BLUESKY_HANDLE,
        }
      })

    return { posts, cursor: data.cursor ?? null }
  } catch (err: any) {
    console.error('[bluesky] Error:', err?.message ?? err)
    throw createError({ statusCode: 502, message: 'Failed to fetch Bluesky posts' })
  }
})
