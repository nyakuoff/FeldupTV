<template>
  <article
    class="rounded-xl p-4 flex flex-col gap-3"
    :style="{
      backgroundColor: 'var(--yt-bg-secondary)',
      border: '1px solid var(--yt-border)',
    }"
  >
    <!-- Author row -->
    <div class="flex items-center gap-3">
      <img
        v-if="channelAvatar"
        :src="channelAvatar"
        alt="Feldup"
        class="w-10 h-10 rounded-full object-cover shrink-0"
        referrerpolicy="no-referrer"
      />
      <div
        v-else
        class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style="background: var(--yt-red);"
      >
        F
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold" style="color: var(--yt-text-primary);">{{ post.authorName }}</p>
        <p class="text-xs" style="color: var(--yt-text-secondary);">{{ post.publishedAt }}</p>
      </div>
      <a
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 p-1.5 rounded-full transition-colors"
        style="color: var(--yt-text-secondary);"
        aria-label="View on YouTube"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#ff0000" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816z"/>
          <path fill="#ffffff" d="M9 16V8l8 3.993L9 16z"/>
        </svg>
      </a>
    </div>

    <!-- Text -->
    <p
      v-if="post.text"
      class="text-sm leading-relaxed whitespace-pre-wrap"
      style="color: var(--yt-text-primary);"
    >
      <template v-for="(seg, i) in parsedText" :key="i">
        <a
          v-if="seg.type === 'url'"
          :href="seg.href"
          target="_blank"
          rel="noopener noreferrer"
          class="underline break-all hover:opacity-80 transition-opacity"
          :style="{ color: 'var(--feldup-accent-light)' }"
        >{{ seg.value }}</a>
        <span v-else>{{ seg.value }}</span>
      </template>
    </p>

    <!-- Images -->
    <div v-if="post.images?.length" class="grid gap-2" :class="post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
      <img
        v-for="(img, i) in post.images"
        :key="i"
        :src="img"
        alt="Post image"
        class="w-full h-48 object-cover rounded-lg"
        loading="lazy"
      />
    </div>

    <!-- Likes -->
    <div v-if="post.likeCount" class="flex items-center gap-1 text-xs" style="color: var(--yt-text-secondary);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
      </svg>
      {{ post.likeCount }}
    </div>
  </article>
</template>

<script setup lang="ts">
import { parsePostText } from '~/utils/parsePostText'

const props = defineProps<{
  post: {
    authorName: string
    authorAvatar: string | null
    publishedAt: string | null
    url: string
    text: string
    images: string[]
    likeCount: string | null
  }
}>()

const { data: channelData } = useNuxtData('channel')
const channelAvatar = computed(() => (channelData.value as any)?.avatar ?? null)
const parsedText = computed(() => parsePostText(props.post.text || ''))
</script>
