<template>
  <div>
    <LayoutChannelBanner :channel="channel" />

    <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-lg mx-auto">
      <!-- Tab strip -->
      <div
        class="flex gap-1 mb-6 rounded-xl p-1"
        style="background-color: var(--yt-bg-secondary);"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :style="activeTab === tab.id
            ? 'background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary);'
            : 'color: var(--yt-text-secondary);'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Community tab -->
      <div v-if="activeTab === 'community'">
        <ClientOnly>
          <div v-if="communityPending" class="flex flex-col gap-4">
            <div v-for="n in 5" :key="n" class="h-40 rounded-xl skeleton" />
          </div>
          <div v-else-if="communityError || !communityPosts.length" class="text-center py-16" style="color: var(--yt-text-secondary);">
            <p>Community posts are temporarily unavailable.</p>
            <a
              href="https://www.youtube.com/channel/UCQVaKQcp4OxSg1eC6SF3NTw/community"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-block text-sm underline"
              style="color: var(--feldup-accent-light);"
            >
              View on YouTube →
            </a>
          </div>
          <div v-else class="flex flex-col gap-4">
            <SocialCommunityPost v-for="post in communityPosts" :key="post.id" :post="post" />
          </div>
          <template #fallback>
            <div class="flex flex-col gap-4">
              <div v-for="n in 5" :key="n" class="h-40 rounded-xl skeleton" />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Bluesky tab -->
      <div v-else-if="activeTab === 'bluesky'">
        <ClientOnly>
          <div v-if="bskyPending" class="flex flex-col gap-4">
            <div v-for="n in 5" :key="n" class="h-36 rounded-xl skeleton" />
          </div>
          <div v-else-if="!bskyPosts.length" class="text-center py-16" style="color: var(--yt-text-secondary);">
            No Bluesky posts found.
          </div>
          <div v-else class="flex flex-col gap-4">
            <SocialBlueskyPost v-for="post in bskyPosts" :key="post.uri" :post="post" />
            <div v-if="bskyCursor" class="flex justify-center mt-4">
              <button
                @click="loadMoreBsky"
                :disabled="loadingMoreBsky"
                class="px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
                style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary); border: 1px solid var(--yt-border);"
              >
                <span v-if="loadingMoreBsky" class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Loading…
                </span>
                <span v-else>Load more</span>
              </button>
            </div>
          </div>
          <template #fallback>
            <div class="flex flex-col gap-4">
              <div v-for="n in 5" :key="n" class="h-36 rounded-xl skeleton" />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Twitter tab -->
      <div v-else-if="activeTab === 'twitter'">
        <SocialTwitterFeed />
        <div class="mt-4 text-center">
          <a
            href="https://x.com/Feldup_official"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm underline"
            style="color: var(--yt-text-secondary);"
          >
            View @Feldup_official on X/Twitter →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ pageTransition: false })
import { defineComponent, h } from 'vue'

const route = useRoute()
const { data: channelData } = await useChannel()
const channel = computed(() => channelData.value)

// Resolve initial tab from ?tab= query param
const defaultTab = (['community', 'bluesky', 'twitter'] as const).includes(route.query.tab as any)
  ? (route.query.tab as string)
  : 'community'

const activeTab = ref(defaultTab)

const tabs = [
  {
    id: 'community',
    label: 'Community',
    icon: defineComponent({
      render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor' },
        [h('path', { d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z' })]
      ),
    }),
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    icon: defineComponent({
      render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: '#0085ff' },
        [h('path', { d: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.689-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z' })]
      ),
    }),
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    icon: defineComponent({
      render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor' },
        [h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })]
      ),
    }),
  },
]

// Lazy-load each tab on first activation
const communityLoaded = ref(false)
const bskyLoaded = ref(false)

watch(activeTab, (tab) => {
  if (tab === 'community') communityLoaded.value = true
  if (tab === 'bluesky') bskyLoaded.value = true
}, { immediate: true })

// Community posts
const {
  data: communityData,
  pending: communityPending,
  error: communityError,
} = await useAsyncData(
  'posts-community',
  () => $fetch<any>('/api/community'),
  { server: false, lazy: true }
)
const communityPosts = computed(() => communityData.value?.posts ?? [])

// Bluesky posts
const {
  data: bskyData,
  pending: bskyPending,
} = await useAsyncData(
  'posts-bluesky',
  () => $fetch<any>('/api/bluesky?limit=20'),
  { server: false, lazy: true }
)
const bskyPosts = ref<any[]>([])
const bskyCursor = ref<string | null>(null)
const loadingMoreBsky = ref(false)

watch(bskyData, (val) => {
  if (val) {
    bskyPosts.value = val.posts ?? []
    bskyCursor.value = val.cursor ?? null
  }
}, { immediate: true })

async function loadMoreBsky() {
  if (!bskyCursor.value || loadingMoreBsky.value) return
  loadingMoreBsky.value = true
  try {
    const result = await $fetch<any>(`/api/bluesky?limit=20&cursor=${encodeURIComponent(bskyCursor.value)}`)
    bskyPosts.value = [...bskyPosts.value, ...(result.posts ?? [])]
    bskyCursor.value = result.cursor ?? null
  } finally {
    loadingMoreBsky.value = false
  }
}

useSeoMeta({
  title: 'Posts — FeldupTV',
  description: 'Feldup\'s community posts, Bluesky updates, and Twitter feed all in one place.',
})
</script>
