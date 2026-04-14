<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex items-center px-3 gap-2"
    style="
      height: var(--header-height);
      background-color: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border-bottom: 1px solid var(--yt-border);
    "
  >
    <!-- Left: hamburger + logo -->
    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="$emit('toggle-sidebar')"
        class="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
        style="color: var(--yt-text-secondary);"
        aria-label="Toggle sidebar"
        @mouseenter="(e) => ((e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)')"
        @mouseleave="(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      <NuxtLink to="/" class="flex items-center gap-2 no-underline select-none ml-4">
        <img
          v-if="channelAvatar"
          :src="channelAvatar"
          alt="Feldup"
          class="w-7 h-7 rounded-lg object-cover"
          referrerpolicy="no-referrer"
        />
        <div
          v-else
          class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          style="background: var(--feldup-accent);"
        >
          F
        </div>
        <span class="text-[18px] font-semibold tracking-tight hidden sm:block" style="color: var(--yt-text-primary); letter-spacing: -0.02em;">
          Feldup<span style="color: var(--feldup-accent);">TV</span>
        </span>
      </NuxtLink>
    </div>

    <!-- Center: search -->
    <div class="flex-1 flex justify-center">
      <div
        class="flex w-full max-w-[600px] items-center rounded-full overflow-hidden transition-all duration-150"
        :style="searchFocused
          ? 'box-shadow: 0 0 0 2px var(--feldup-accent);'
          : 'box-shadow: 0 0 0 1px var(--yt-border);'"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search videos…"
          class="flex-1 px-4 py-2.5 text-sm outline-none transition-colors"
          style="
            background-color: var(--yt-bg-secondary);
            color: var(--yt-text-primary);
            border: none;
          "
          @keydown.enter="onSearch"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
        <button
          @click="onSearch"
          class="px-4 py-2.5 transition-colors flex items-center justify-center shrink-0"
          style="
            background-color: var(--yt-bg-tertiary);
            color: var(--yt-text-secondary);
            min-width: 44px;
            border: none;
          "
          @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--yt-bg-hover)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--yt-bg-tertiary)')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Right: settings button -->
    <div class="flex items-center shrink-0 pr-3">
      <button
        @click="$emit('open-settings')"
        class="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
        style="color: var(--yt-text-secondary);"
        aria-label="Settings"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ sidebarOpen: boolean }>()
defineEmits<{ (e: 'toggle-sidebar'): void; (e: 'open-settings'): void }>()

const router = useRouter()
const searchQuery = ref('')
const searchFocused = ref(false)

const { data: channelData } = useNuxtData('channel')
const channelAvatar = computed(() => (channelData.value as any)?.avatar ?? null)

function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/videos', query: { q: searchQuery.value.trim() } })
  }
}
</script>
