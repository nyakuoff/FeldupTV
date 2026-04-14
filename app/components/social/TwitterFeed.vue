<template>
  <div class="flex flex-col items-center justify-center gap-6 py-16 px-4 rounded-2xl text-center"
    style="background-color: var(--yt-bg-secondary); border: 1px solid var(--yt-border);"
  >
    <!-- Avatar + name -->
    <div class="flex flex-col items-center gap-2">
      <img
        v-if="channelAvatar"
        :src="channelAvatar"
        alt="Feldup"
        class="w-16 h-16 rounded-full object-cover ring-2"
        referrerpolicy="no-referrer"
        style="--tw-ring-color: var(--feldup-accent);"
      />
      <div
        v-else
        class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
        style="background-color: var(--feldup-accent);"
      >
        F
      </div>
      <p class="text-base font-semibold" style="color: var(--yt-text-primary);">Feldup</p>
      <p class="text-sm" style="color: var(--yt-text-secondary);">@Feldup_official</p>
    </div>

    <p class="text-sm max-w-xs" style="color: var(--yt-text-secondary);">
      X/Twitter no longer allows free embedding of posts. Follow Feldup directly on X to see the latest tweets.
    </p>

    <a
      href="https://x.com/Feldup_official"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
      style="background-color: #000; color: #fff; border: 1px solid #333;"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      Follow on X
    </a>
  </div>
</template>

<script setup lang="ts">
const { data: channel } = useNuxtData<any>('channel')
const channelAvatar = computed(() => channel.value?.avatar ?? null)
</script>



