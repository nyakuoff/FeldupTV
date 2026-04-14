<template>
  <NuxtLink
    :to="`/watch/${video.id}`"
    class="flex gap-3 group no-underline rounded-xl p-2 -m-2"
    :style="{
      color: 'var(--yt-text-primary)',
      backgroundColor: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
      transition: 'background-color 0.15s ease',
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Thumbnail -->
    <div class="relative shrink-0 rounded-lg overflow-hidden" style="width: 160px; aspect-ratio: 16/9;">
      <img
        v-if="video.thumbnail"
        :src="video.thumbnail"
        :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full" style="background-color: var(--yt-bg-tertiary);" />
      <span
        v-if="video.durationText"
        class="absolute bottom-1 right-1 px-1 py-0.5 rounded text-xs font-semibold"
        style="background-color: rgba(0,0,0,0.85); color: #fff; font-size: 11px;"
      >
        {{ video.durationText }}
      </span>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium line-clamp-2 leading-snug" style="color: var(--yt-text-primary);">
        {{ video.title }}
      </p>
      <p class="text-xs mt-1" style="color: var(--yt-text-secondary);">Feldup</p>
      <p class="text-xs" style="color: var(--yt-text-secondary);">
        {{ formatViews(video.viewCount) }} · {{ formatRelativeDate(video.publishedAt) }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatViews, formatRelativeDate } from '~/utils/formatters'

const hovered = ref(false)

defineProps<{
  video: {
    id: string
    title: string
    thumbnail: string | null
    publishedAt: string
    durationText: string
    viewCount: number
  }
}>()
</script>
