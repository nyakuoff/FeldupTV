<template>
  <div>
    <!-- Skeleton grid -->
    <div
      v-if="loading"
      class="grid gap-4"
      :class="gridClass"
    >
      <VideoCardSkeleton v-for="n in skeletonCount" :key="n" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!videos.length"
      class="flex flex-col items-center justify-center py-24 gap-4"
      style="color: var(--yt-text-secondary);"
    >
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" class="opacity-30">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <p class="text-lg">No videos found</p>
    </div>

    <!-- Video grid -->
    <div
      v-else
      class="grid gap-4"
      :class="gridClass"
    >
      <VideoCard v-for="video in videos" :key="video.id" :video="video" :channel-avatar="props.channelAvatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  videos: any[]
  loading?: boolean
  skeletonCount?: number
  compact?: boolean
  channelAvatar?: string | null
}>(), {
  loading: false,
  skeletonCount: 12,
  compact: false,
})

const gridClass = computed(() =>
  props.compact
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
)
</script>
