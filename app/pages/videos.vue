<template>
  <div>
    <LayoutChannelBanner :channel="channel" />

    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Filter chips + sort -->
      <div class="flex flex-wrap items-center gap-2 mb-5">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          @click="activeFilter = chip.value"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          :style="activeFilter === chip.value
            ? 'background-color: var(--yt-text-primary); color: var(--yt-bg-primary);'
            : hoveredFilter === chip.value
              ? 'background-color: rgba(255,255,255,0.1); color: var(--yt-text-primary);'
              : 'background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary);'"
          @mouseenter="hoveredFilter = chip.value"
          @mouseleave="hoveredFilter = ''"
        >
          {{ chip.label }}
        </button>

        <div class="ml-auto flex items-center gap-2">
          <select
            v-model="sortBy"
            class="px-3 py-1.5 rounded-lg text-sm border outline-none"
            style="background-color: var(--yt-bg-secondary); border-color: var(--yt-border); color: var(--yt-text-primary);"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
      </div>

      <!-- Search filter display -->
      <div v-if="searchQuery" class="mb-4 text-sm" style="color: var(--yt-text-secondary);">
        Searching for: <span class="font-semibold" style="color: var(--yt-text-primary);">{{ searchQuery }}</span>
        <button class="ml-2 underline" @click="clearSearch">Clear</button>
      </div>

      <VideoGrid
        :videos="filteredVideos"
        :loading="pending && !videos.length"
        :skeleton-count="24"
        :channel-avatar="channel?.avatar"
      />

      <!-- Load more -->
      <div class="flex justify-center mt-8" v-if="nextPageToken && !pending">
        <button
          @click="loadMore"
          class="px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
          :style="loadMoreHovered
            ? 'background-color: var(--yt-bg-hover); color: var(--yt-text-primary); border: 1px solid rgba(255,255,255,0.15);'
            : 'background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary); border: 1px solid var(--yt-border);'"
          :disabled="loadingMore"
          @mouseenter="loadMoreHovered = true"
          @mouseleave="loadMoreHovered = false"
        >
          <span v-if="loadingMore" class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Loading…
          </span>
          <span v-else>Load more videos</span>
        </button>
      </div>

      <!-- End of results -->
      <div v-if="!nextPageToken && videos.length" class="text-center py-8 text-sm" style="color: var(--yt-text-muted);">
        That's all {{ videos.length }} videos!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ pageTransition: false })
const route = useRoute()
const { data: channelData } = await useChannel()
const channel = computed(() => channelData.value)

const filterChips = [
  { label: 'All', value: 'all' },
  { label: 'Videos', value: 'long' },
  { label: 'Shorts', value: 'shorts' },
]

const activeFilter = ref('all')
const sortBy = ref('newest')
const videos = ref<any[]>([])
const nextPageToken = ref<string | null>(null)
const loadingMore = ref(false)
const hoveredFilter = ref('')
const loadMoreHovered = ref(false)
const searchQuery = ref((route.query.q as string) ?? '')

const { data, pending } = await useAsyncData(
  'videos-page',
  () => $fetch<any>('/api/videos'),
  { server: true }
)

watch(data, (val) => {
  if (val) {
    videos.value = val.videos ?? []
    nextPageToken.value = val.nextPageToken ?? null
  }
}, { immediate: true })

// Watch for query param changes
watch(() => route.query.q, (q) => {
  searchQuery.value = (q as string) ?? ''
})

async function loadMore() {
  if (!nextPageToken.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const result = await $fetch<any>(`/api/videos?pageToken=${nextPageToken.value}`)
    videos.value = [...videos.value, ...(result.videos ?? [])]
    nextPageToken.value = result.nextPageToken ?? null
  } finally {
    loadingMore.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
  navigateTo('/videos')
}

const filteredVideos = computed(() => {
  let list = videos.value

  // Apply filter chip
  if (activeFilter.value === 'shorts') list = list.filter((v) => v.isShort)
  else if (activeFilter.value === 'long') list = list.filter((v) => !v.isShort)

  // Apply search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((v) => v.title.toLowerCase().includes(q))
  }

  // Apply sort
  if (sortBy.value === 'oldest') list = [...list].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
  else if (sortBy.value === 'popular') list = [...list].sort((a, b) => b.viewCount - a.viewCount)

  return list
})

useSeoMeta({
  title: 'Videos - FeldupTV',
  description: 'Browse all of Feldup\'s YouTube videos. Filter by Shorts or long-form content.',
})
</script>
