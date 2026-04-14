<template>
  <div class="w-full overflow-hidden" style="background-color: var(--yt-bg-primary);">
    <!-- Banner with bottom fade -->
    <div class="relative w-full overflow-hidden" style="height: 180px;">
      <img
        v-if="channel?.banner"
        :src="channel.banner + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj'"
        alt="Channel banner"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full"
        style="background: linear-gradient(135deg, #1a0000 0%, #0f0000 50%, var(--yt-bg-primary) 100%);"
      />
      <!-- Gradient fade to page bg -->
      <div
        class="absolute inset-x-0 bottom-0"
        style="height: 80px; background: linear-gradient(to bottom, transparent, var(--yt-bg-primary));"
      />
    </div>

    <!-- Channel info -->
    <div class="px-4 sm:px-8 pb-4 flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
      <!-- Avatar -->
      <div class="shrink-0 relative z-10">
        <img
          v-if="channel?.avatar"
          :src="channel.avatar"
          :alt="channel?.name"
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          style="box-shadow: 0 0 0 3px var(--yt-bg-primary), 0 0 0 5px rgba(255,255,255,0.08);"
          referrerpolicy="no-referrer"
        />
        <div
          v-else
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
          style="background: var(--feldup-accent); box-shadow: 0 0 0 3px var(--yt-bg-primary), 0 0 0 5px rgba(255,255,255,0.08);"
        >
          F
        </div>
      </div>

      <!-- Text + actions -->
      <div class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold truncate" style="color: var(--yt-text-primary); letter-spacing: -0.02em;">
            {{ channel?.name ?? 'Feldup' }}
          </h1>
          <div class="flex flex-wrap items-center gap-1.5 mt-1 text-[13px]" style="color: var(--yt-text-secondary);">
            <span v-if="channel?.customUrl">@{{ channel.customUrl.replace('@', '') }}</span>
            <span v-if="channel?.subscriberCount !== undefined">
              <span class="opacity-40 mx-1">·</span>
              {{ formatSubscribers(channel.subscriberCount) }}
            </span>
            <span v-if="channel?.videoCount">
              <span class="opacity-40 mx-1">·</span>
              {{ formatCount(channel.videoCount) }} videos
            </span>
          </div>
        </div>

        <a
          href="https://www.youtube.com/channel/UCQVaKQcp4OxSg1eC6SF3NTw?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 hover:opacity-85"
          style="background-color: var(--feldup-accent); color: #fff;"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
          </svg>
          Subscribe
        </a>
      </div>
    </div>

    <!-- Tab strip -->
    <div
      class="flex border-t px-4 sm:px-8 overflow-x-auto"
      style="border-color: var(--yt-border);"
    >
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="relative px-4 py-3 text-sm font-medium whitespace-nowrap"
        :style="$route.path === tab.to
          ? 'color: var(--yt-text-primary);'
          : hoveredTab === tab.to
            ? 'color: var(--yt-text-primary);'
            : 'color: var(--yt-text-secondary);'"
        @mouseenter="hoveredTab = tab.to"
        @mouseleave="hoveredTab = ''"
      >
        {{ tab.label }}
        <span
          class="absolute inset-x-0 bottom-0 h-0.5 rounded-t"
          :style="$route.path === tab.to
            ? 'background-color: var(--feldup-accent); opacity: 1;'
            : 'opacity: 0;'"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatSubscribers, formatCount } from '~/utils/formatters'

defineProps<{
  channel?: {
    name?: string
    avatar?: string | null
    banner?: string | null
    customUrl?: string | null
    subscriberCount?: number | null
    videoCount?: number
  } | null
}>()

const hoveredTab = ref('')

const tabs = [
  { label: 'Home', to: '/' },
  { label: 'Videos', to: '/videos' },
  { label: 'Posts', to: '/posts' },
]
</script>
