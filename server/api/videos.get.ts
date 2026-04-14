// Feldup's uploads playlist = replace UC with UU in channel ID
const UPLOADS_PLAYLIST_ID = 'UUQVaKQcp4OxSg1eC6SF3NTw'
const CHANNEL_ID = 'UCQVaKQcp4OxSg1eC6SF3NTw'
const MAX_RESULTS = 24

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.youtubeApiKey
  const query = getQuery(event)
  const pageToken = (query.pageToken as string) || undefined
  const filter = (query.filter as string) || 'all'

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'YouTube API key not configured' })
  }

  // Step 1: Get video IDs from the uploads playlist (1 quota unit)
  const listUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  listUrl.searchParams.set('playlistId', UPLOADS_PLAYLIST_ID)
  listUrl.searchParams.set('part', 'snippet')
  listUrl.searchParams.set('maxResults', String(MAX_RESULTS))
  listUrl.searchParams.set('key', apiKey)
  if (pageToken) listUrl.searchParams.set('pageToken', pageToken)

  const listData = await $fetch<Record<string, any>>(listUrl.toString())

  const videoIds: string[] = listData.items
    ?.map((item: any) => item.snippet?.resourceId?.videoId)
    .filter(Boolean) ?? []

  if (!videoIds.length) {
    return { videos: [], nextPageToken: null, totalResults: 0 }
  }

  // Step 2: Get full video details (contentDetails for duration, statistics) (1 quota unit)
  const videoUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
  videoUrl.searchParams.set('id', videoIds.join(','))
  videoUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
  videoUrl.searchParams.set('key', apiKey)

  const videoData = await $fetch<Record<string, any>>(videoUrl.toString())

  const videos: any[] = (videoData.items ?? []).map((v: any) => {
    const duration = parseDurationSeconds(v.contentDetails?.duration ?? 'PT0S')
    return {
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      thumbnail:
        v.snippet.thumbnails?.maxres?.url ??
        v.snippet.thumbnails?.high?.url ??
        v.snippet.thumbnails?.medium?.url,
      publishedAt: v.snippet.publishedAt,
      duration,
      durationText: formatDuration(duration),
      isShort: duration > 0 && duration <= 60,
      viewCount: Number(v.statistics?.viewCount ?? 0),
      likeCount: Number(v.statistics?.likeCount ?? 0),
      channelId: CHANNEL_ID,
    }
  })

  // Apply filter
  const filtered: any[] =
    filter === 'shorts'
      ? videos.filter((v: any) => v.isShort)
      : filter === 'long'
        ? videos.filter((v: any) => !v.isShort)
        : videos

  return {
    videos: filtered,
    nextPageToken: listData.nextPageToken ?? null,
    totalResults: listData.pageInfo?.totalResults ?? 0,
  }
})

function parseDurationSeconds(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = Number(match[1] ?? 0)
  const m = Number(match[2] ?? 0)
  const s = Number(match[3] ?? 0)
  return h * 3600 + m * 60 + s
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
