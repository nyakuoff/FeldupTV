export interface ChannelInfo {
  id: string
  name: string
  description: string
  customUrl: string | null
  avatar: string | null
  banner: string | null
  country: string | null
  subscriberCount: number | null
  videoCount: number
  viewCount: number
  publishedAt: string
}

export const useChannel = () => {
  return useAsyncData<ChannelInfo>('channel', () => $fetch('/api/channel'), {
    server: true,
    lazy: false,
  })
}
