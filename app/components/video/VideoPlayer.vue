<template>
  <div>
    <!-- Native YouTube embed -->
    <div class="w-full overflow-hidden rounded-xl" style="aspect-ratio: 16/9;">
      <iframe
        :src="`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&vq=hd1080`"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
        :title="title"
      />
    </div>

    <!-- Title -->
    <h1 class="mt-3 text-base sm:text-xl font-semibold leading-snug" style="color: var(--yt-text-primary);">
      {{ title }}
    </h1>

    <!-- Stats + watch on YT -->
    <div class="flex flex-wrap items-center justify-between gap-2 mt-1.5">
      <p class="text-xs" style="color: var(--yt-text-secondary);">
        <span v-if="viewCount">{{ formatViews(viewCount) }}</span>
        <span v-if="publishedAt"> · {{ formatFullDate(publishedAt) }}</span>
      </p>
      <a
        :href="`https://www.youtube.com/watch?v=${videoId}`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
        style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary);"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="color: var(--yt-red);">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
        </svg>
        Watch on YouTube
      </a>
    </div>

    <!-- Channel row -->
    <div
      class="flex items-center gap-3 mt-3 pb-3"
      style="border-bottom: 1px solid var(--yt-border);"
    >
      <img
        v-if="channelAvatar"
        :src="channelAvatar"
        alt="Feldup"
        class="w-9 h-9 rounded-full object-cover shrink-0"
        referrerpolicy="no-referrer"
      />
      <div
        v-else
        class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style="background: var(--feldup-accent);"
      >F</div>
      <div>
        <p class="text-sm font-semibold" style="color: var(--yt-text-primary);">{{ channelName }}</p>
        <p v-if="channelSubs" class="text-xs" style="color: var(--yt-text-secondary);">{{ channelSubs }} subscribers</p>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-3 rounded-xl p-3" style="background-color: var(--yt-bg-secondary);">
      <div
        class="text-sm whitespace-pre-wrap"
        style="color: var(--yt-text-primary);"
        :class="expanded ? '' : 'line-clamp-3'"
      >
        {{ description || 'No description.' }}
      </div>
      <button
        v-if="description && description.length > 200"
        class="mt-2 text-xs font-semibold"
        style="color: var(--yt-text-secondary);"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Show less' : 'Show more' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatViews, formatFullDate } from '~/utils/formatters'
import type { ChannelInfo } from '~/composables/useChannel'

const props = defineProps<{
  videoId: string
  title: string
  description?: string
  viewCount?: number
  publishedAt?: string
  channel?: ChannelInfo | null
}>()

const expanded = ref(false)

const channelAvatar = computed(() => props.channel?.avatar ?? null)
const channelName = computed(() => props.channel?.name ?? 'Feldup')
const channelSubs = computed(() => {
  const n = props.channel?.subscriberCount
  if (!n) return null
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${n}`
})
</script>


