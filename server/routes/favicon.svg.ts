export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  try {
    const origin = getRequestURL(event).origin
    const channel = await $fetch<{ avatar: string | null }>('/api/channel', { baseURL: origin })

    if (!channel.avatar) throw new Error('no avatar')

    const res = await $fetch.raw(channel.avatar, { responseType: 'arrayBuffer' })
    const buf = Buffer.from(res._data as ArrayBuffer)
    const mime = (res.headers.get('content-type') ?? 'image/jpeg').split(';')[0]
    const dataUrl = `data:${mime};base64,${buf.toString('base64')}`

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs><clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath></defs>
  <image href="${dataUrl}" width="100" height="100" clip-path="url(#c)"/>
</svg>`
  } catch {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#22c55e"/>
  <text x="50" y="66" text-anchor="middle" font-size="52" font-family="sans-serif" font-weight="bold" fill="white">F</text>
</svg>`
  }
})
