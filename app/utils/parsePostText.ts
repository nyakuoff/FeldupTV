export interface TextSegment {
  type: 'text' | 'url'
  value: string
  href?: string
}

const URL_REGEX = /https?:\/\/[^\s\u200B\u00A0]+/g

export function parsePostText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  URL_REGEX.lastIndex = 0
  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    // Strip trailing punctuation that is likely not part of the URL
    const url = match[0].replace(/[.,;:!?)»]+$/, '')
    segments.push({ type: 'url', value: url, href: url })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments
}
