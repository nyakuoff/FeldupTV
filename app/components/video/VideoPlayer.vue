<template>
  <div>
    <!-- 16:9 iframe wrapper -->
    <div class="w-full relative overflow-hidden rounded-xl bg-black" style="aspect-ratio: 16/9;">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`"
        class="absolute inset-0 w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        :title="title"
      />
    </div>

    <!-- Title -->
    <h1 class="mt-4 text-lg sm:text-xl font-semibold leading-snug" style="color: var(--yt-text-primary);">
      {{ title }}
    </h1>

    <!-- Stats row -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 mt-2 pb-3"
      style="border-bottom: 1px solid var(--yt-border);"
    >
      <div class="text-sm" style="color: var(--yt-text-secondary);">
        <span v-if="viewCount">{{ formatViews(viewCount) }}</span>
        <span v-if="publishedAt"> · {{ formatFullDate(publishedAt) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <a
          :href="`https://www.youtube.com/watch?v=${videoId}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary);"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color: var(--yt-red);">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
          </svg>
          Watch on YouTube
        </a>
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
        class="mt-2 text-sm font-semibold transition-colors"
        style="color: var(--yt-text-primary);"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Show less' : 'Show more' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatViews, formatFullDate } from '~/utils/formatters'

defineProps<{
  videoId: string
  title: string
  description?: string
  viewCount?: number
  publishedAt?: string
}>()

const expanded = ref(false)
</script>
