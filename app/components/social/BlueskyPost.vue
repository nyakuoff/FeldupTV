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
        v-if="post.authorAvatar"
        :src="post.authorAvatar"
        :alt="post.authorName"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div
        v-else
        class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style="background: #0085ff;"
      >
        F
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold" style="color: var(--yt-text-primary);">{{ post.authorName }}</p>
        <p class="text-xs" style="color: var(--yt-text-secondary);">@{{ post.authorHandle }} · {{ formatRelativeDate(post.createdAt) }}</p>
      </div>
      <a
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 p-1.5 rounded-full transition-colors"
        aria-label="View on Bluesky"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0085ff">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.689-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
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

    <!-- Engagement -->
    <div class="flex items-center gap-4 text-xs" style="color: var(--yt-text-secondary);">
      <span class="flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        {{ post.replyCount }}
      </span>
      <span class="flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        {{ post.repostCount }}
      </span>
      <span class="flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
        </svg>
        {{ post.likeCount }}
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { formatRelativeDate } from '~/utils/formatters'
import { parsePostText } from '~/utils/parsePostText'

const props = defineProps<{
  post: {
    authorName: string
    authorAvatar: string | null
    authorHandle: string
    createdAt: string
    url: string
    text: string
    images: string[]
    likeCount: number
    replyCount: number
    repostCount: number
  }
}>()

const parsedText = computed(() => parsePostText(props.post.text || ''))
</script>
