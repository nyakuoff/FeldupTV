<template>
  <NuxtLink
    :to="`/watch/${video.id}`"
    class="group flex flex-col gap-2.5 no-underline"
    :style="{ color: 'var(--yt-text-primary)' }"
  >
    <!-- Thumbnail -->
    <div class="relative w-full overflow-hidden" style="aspect-ratio: 16/9; border-radius: 10px;">
      <img
        v-if="video.thumbnail"
        :src="video.thumbnail"
        :alt="video.title"
        class="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="background-color: var(--yt-bg-tertiary);"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style="color: var(--yt-text-muted);">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>

      <!-- Duration pill -->
      <span
        v-if="video.durationText"
        class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-xs font-semibold"
        style="background-color: rgba(0,0,0,0.8); color: #fff; letter-spacing: 0.01em;"
      >
        {{ video.durationText }}
      </span>

      <!-- Shorts badge -->
      <span
        v-if="video.isShort"
        class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-xs font-bold"
        style="background-color: var(--yt-red); color: #fff;"
      >
        #Shorts
      </span>
    </div>

    <!-- Info -->
    <div class="flex gap-2.5">
      <img
        v-if="channelAvatar"
        :src="channelAvatar"
        alt="Feldup"
        class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
        referrerpolicy="no-referrer"
        loading="lazy"
      />
      <div
        v-else
        class="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
        style="background: var(--feldup-accent);"
      >
        F
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-medium line-clamp-2 leading-snug" style="color: var(--yt-text-primary);">
          {{ video.title }}
        </p>
        <p class="text-xs mt-1 font-medium" style="color: var(--yt-text-secondary);">Feldup</p>
        <p class="text-xs" style="color: var(--yt-text-muted);">
          {{ formatViews(video.viewCount) }} · {{ formatRelativeDate(video.publishedAt) }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatViews, formatRelativeDate } from '~/utils/formatters'

defineProps<{
  video: {
    id: string
    title: string
    thumbnail: string | null
    publishedAt: string
    durationText: string
    isShort: boolean
    viewCount: number
  }
  channelAvatar?: string | null
}>()
</script>
