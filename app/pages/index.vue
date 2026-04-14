<template>
  <div>
    <LayoutChannelBanner :channel="channel" />

    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Quick keep-up section -->
      <div class="mb-8 grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <!-- Latest video hero -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold" style="color: var(--yt-text-primary);">Latest Video</h2>
            <NuxtLink to="/videos" class="text-sm" style="color: var(--feldup-accent-light);">All videos →</NuxtLink>
          </div>

          <div v-if="videoPending" class="h-[260px] rounded-2xl skeleton" />

          <NuxtLink
            v-else-if="latestVideo"
            :to="`/watch/${latestVideo.id}`"
            class="group block rounded-2xl overflow-hidden no-underline"
            style="border: 1px solid var(--yt-border); background-color: var(--yt-bg-secondary);"
          >
            <div class="relative w-full" style="aspect-ratio: 16 / 9;">
              <img
                v-if="latestVideo.thumbnail"
                :src="latestVideo.thumbnail"
                :alt="latestVideo.title"
                class="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-105"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                style="background-color: var(--yt-bg-tertiary);"
              >
                <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" style="color: var(--yt-text-muted);">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>

              <span
                v-if="latestVideo.durationText"
                class="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-semibold"
                style="background-color: rgba(0,0,0,0.8); color: #fff;"
              >
                {{ latestVideo.durationText }}
              </span>
            </div>

            <div class="p-3">
              <p class="text-lg font-semibold leading-snug" style="color: var(--yt-text-primary);">
                {{ latestVideo.title }}
              </p>
              <p class="text-xs mt-1.5" style="color: var(--yt-text-secondary);">
                {{ formatViews(latestVideo.viewCount) }} · {{ formatRelativeDate(latestVideo.publishedAt) }}
              </p>
            </div>
          </NuxtLink>
        </section>

        <!-- Latest community post -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold" style="color: var(--yt-text-primary);">Latest Community Post</h2>
            <NuxtLink to="/posts?tab=community" class="text-sm" style="color: var(--feldup-accent-light);">See all →</NuxtLink>
          </div>

          <div v-if="communityPending" class="h-[260px] rounded-2xl skeleton" />

          <div v-else-if="latestCommunityPost" class="max-h-[420px] overflow-auto pr-1">
            <SocialCommunityPost :post="latestCommunityPost" />
          </div>

          <div v-else class="rounded-xl p-4 text-sm" style="color: var(--yt-text-secondary); border: 1px solid var(--yt-border); background-color: var(--yt-bg-secondary);">
            No recent community post available.
          </div>
        </section>
      </div>

      <!-- Section header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold" style="color: var(--yt-text-primary);">Recent Videos</h2>
        <NuxtLink to="/videos" class="text-sm transition-colors" style="color: var(--feldup-accent-light);">
          View all →
        </NuxtLink>
      </div>

      <VideoGrid :videos="recentVideos" :loading="videoPending" :skeleton-count="12" :channel-avatar="channel?.avatar" />

      <!-- Social preview strip -->
      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <!-- Bluesky preview -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold flex items-center gap-2" style="color: var(--yt-text-primary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0085ff">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.689-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
              </svg>
              Latest from Bluesky
            </h2>
            <NuxtLink to="/posts?tab=bluesky" class="text-sm" style="color: var(--feldup-accent-light);">
              See all →
            </NuxtLink>
          </div>
          <div v-if="bskyPending" class="flex flex-col gap-3">
            <div v-for="n in 2" :key="n" class="h-32 rounded-xl skeleton" />
          </div>
          <div v-else-if="bskyPosts.length" class="flex flex-col gap-3">
            <SocialBlueskyPost v-for="post in bskyPosts.slice(0, 3)" :key="post.uri" :post="post" />
          </div>
        </div>

        <!-- Community preview -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold flex items-center gap-2" style="color: var(--yt-text-primary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--yt-red);">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
              </svg>
              Community Posts
            </h2>
            <NuxtLink to="/posts?tab=community" class="text-sm" style="color: var(--feldup-accent-light);">
              See all →
            </NuxtLink>
          </div>
          <div v-if="communityPending" class="flex flex-col gap-3">
            <div v-for="n in 2" :key="n" class="h-32 rounded-xl skeleton" />
          </div>
          <div v-else-if="communityPosts.length" class="flex flex-col gap-3">
            <SocialCommunityPost v-for="post in communityPosts.slice(0, 3)" :key="post.id" :post="post" />
          </div>
          <div v-else-if="communityError" class="text-sm py-4 text-center" style="color: var(--yt-text-secondary);">
            Community posts temporarily unavailable
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ pageTransition: false })
import { formatViews, formatRelativeDate } from '~/utils/formatters'

const { data: channelData } = await useChannel()
const channel = computed(() => channelData.value)

const { data: videoData, pending: videoPending } = await useAsyncData(
  'home-videos',
  () => $fetch<any>('/api/videos'),
  { server: true }
)
const videos = computed(() => videoData.value?.videos ?? [])
const latestVideo = computed(() => videos.value[0] ?? null)
const recentVideos = computed(() => videos.value.slice(1))

const { data: bskyData, pending: bskyPending } = await useAsyncData(
  'home-bluesky',
  () => $fetch<any>('/api/bluesky?limit=5'),
  { server: true, lazy: true }
)
const bskyPosts = computed(() => bskyData.value?.posts ?? [])

const { data: communityData, pending: communityPending, error: communityError } = await useAsyncData(
  'home-community',
  () => $fetch<any>('/api/community'),
  { server: true, lazy: true }
)
const communityPosts = computed(() => communityData.value?.posts ?? [])
const latestCommunityPost = computed(() => communityPosts.value[0] ?? null)

useSeoMeta({
  title: 'FeldupTV — Feldup\'s Content Hub',
  description: 'Watch Feldup\'s YouTube videos, see Bluesky & Twitter updates, and browse community posts — all in one place.',
})
</script>
