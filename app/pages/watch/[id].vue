<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-[1700px]">
    <div v-if="pending" class="grid lg:grid-cols-[1fr_380px] gap-6">
      <!-- Player skeleton -->
      <div class="flex flex-col gap-4">
        <div class="w-full rounded-xl skeleton" style="aspect-ratio: 16/9;" />
        <div class="h-8 w-3/4 skeleton rounded" />
        <div class="h-4 w-1/3 skeleton rounded" />
      </div>
    </div>

    <div v-else-if="video" class="grid lg:grid-cols-[1fr_380px] gap-6">
      <!-- Left: Player + description -->
      <div>
        <VideoPlayer
          :video-id="video.id"
          :title="video.title"
          :description="video.description"
          :view-count="video.viewCount"
          :published-at="video.publishedAt"
          :channel="channel"
        />
      </div>

      <!-- Right: Related videos -->
      <aside class="flex flex-col gap-1">
        <h2 class="text-sm font-semibold mb-3 px-1" style="color: var(--yt-text-secondary);">More from Feldup</h2>
        <div class="flex flex-col gap-3">
          <VideoRelatedCard
            v-for="v in relatedVideos"
            :key="v.id"
            :video="v"
          />
        </div>
      </aside>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-24 gap-4" style="color: var(--yt-text-secondary);">
      <p class="text-lg">Video not found</p>
      <NuxtLink to="/" class="text-sm underline" style="color: var(--feldup-accent-light);">Go home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const videoId = computed(() => route.params.id as string)

const { data: channelData } = await useChannel()
const channel = computed(() => channelData.value)

const { data, pending } = await useAsyncData(
  `watch-${videoId.value}`,
  () => $fetch<any>('/api/videos'),
  { server: true }
)

const allVideos = computed(() => data.value?.videos ?? [])
const video = computed(() => allVideos.value.find((v: any) => v.id === videoId.value) ?? null)
const relatedVideos = computed(() => allVideos.value.filter((v: any) => v.id !== videoId.value).slice(0, 15))

useSeoMeta({
  title: computed(() => video.value ? `${video.value.title} - FeldupTV` : 'Watch - FeldupTV'),
  description: computed(() => video.value?.description?.slice(0, 160) ?? 'Watch Feldup\'s videos on FeldupTV.'),
})
</script>
