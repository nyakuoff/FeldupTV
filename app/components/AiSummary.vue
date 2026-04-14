<template>
  <div
    class="rounded-2xl overflow-hidden"
    style="background-color: var(--yt-bg-secondary); border: 1px solid var(--yt-border);"
  >
    <!-- Header row — always visible, acts as toggle -->
    <button
      class="w-full flex items-center gap-2.5 px-4 py-3 text-left"
      :class="{ 'border-b': open && !pending && !error && summary }"
      style="border-color: var(--yt-border);"
      @click="open = !open"
    >
      <!-- Spark icon -->
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" :style="{ color: 'var(--feldup-accent)' }">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>

      <span class="text-xs font-semibold tracking-wide uppercase flex-1" style="color: var(--yt-text-muted);">AI Summary</span>

      <!-- Timestamp -->
      <span
        v-if="!pending && !error && generatedAt"
        class="text-xs mr-2"
        style="color: var(--yt-text-muted);"
        :title="new Date(generatedAt).toLocaleString()"
      >
        {{ timeAgo(generatedAt) }}
      </span>

      <!-- Chevron -->
      <svg
        v-if="!pending && !error && summary"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        class="shrink-0 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        style="color: var(--yt-text-muted);"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <!-- Collapsible body -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="open" class="px-4 pb-4 pt-3 overflow-hidden">
        <!-- Loading skeleton -->
        <div v-if="pending" class="flex flex-col gap-2">
          <div class="h-3 rounded skeleton w-full" />
          <div class="h-3 rounded skeleton w-4/5" />
          <div class="h-3 rounded skeleton w-3/5" />
        </div>

        <!-- Error -->
        <p v-else-if="error" class="text-sm italic" style="color: var(--yt-text-muted);">
          Summary unavailable right now.
        </p>

        <!-- Summary — split into sentences for readability -->
        <div v-else class="flex flex-col gap-2">
          <p
            v-for="(sentence, i) in sentences"
            :key="i"
            class="text-sm leading-relaxed"
            style="color: var(--yt-text-primary);"
          >
            {{ sentence }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error } = await useAsyncData(
  'ai-summary',
  () => $fetch<{ summary: string; generatedAt: string }>('/api/summary'),
  { server: false, lazy: true }
)

const open = ref(true)

const summary = computed(() => data.value?.summary ?? '')
const generatedAt = computed(() => data.value?.generatedAt ?? '')

// Split into individual sentences for visual breathing room
const sentences = computed(() =>
  summary.value
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
)

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>
