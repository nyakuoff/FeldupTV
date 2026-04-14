<template>
  <!-- Mobile overlay -->
  <Transition name="fade">
    <div
      v-if="open && !isWide"
      class="fixed inset-0 z-40 bg-black/60"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-40 flex flex-col overflow-hidden transition-all duration-200"
    :style="sidebarStyle"
    style="background-color: var(--yt-bg-primary); border-right: 1px solid var(--yt-border);"
  >
    <!-- Spacer for header -->
    <div style="height: var(--header-height);" class="shrink-0" />

    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-3">
      <!-- Main nav -->
      <LayoutSidebarItem to="/" icon="home" label="Home" :collapsed="!showLabels" />
      <LayoutSidebarItem to="/videos" icon="videos" label="Videos" :collapsed="!showLabels" />
      <LayoutSidebarItem to="/posts" icon="posts" label="Posts" :collapsed="!showLabels" />

      <div class="my-3" style="border-top: 1px solid var(--yt-border);" />

      <!-- External links -->
      <LayoutSidebarItem
        href="https://www.youtube.com/channel/UCQVaKQcp4OxSg1eC6SF3NTw"
        icon="youtube"
        label="YouTube"
        :collapsed="!showLabels"
        external
      />
      <LayoutSidebarItem
        href="https://x.com/Feldup_official"
        icon="twitter"
        label="Twitter / X"
        :collapsed="!showLabels"
        external
      />
      <LayoutSidebarItem
        href="https://bsky.app/profile/feldup-official.bsky.social"
        icon="bluesky"
        label="Bluesky"
        :collapsed="!showLabels"
        external
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const isWide = ref(false)

onMounted(() => {
  const check = () => { isWide.value = window.innerWidth >= 1024 }
  check()
  window.addEventListener('resize', check)
  onUnmounted(() => window.removeEventListener('resize', check))
})

const showLabels = computed(() => {
  if (!isWide.value) return true // mobile drawer always shows labels
  return props.open
})

const sidebarStyle = computed(() => {
  const height = '100vh'
  if (!isWide.value) {
    return {
      width: '210px',
      height,
      transform: props.open ? 'translateX(0)' : 'translateX(-100%)',
    }
  }
  return {
    width: props.open ? '210px' : '64px',
    height,
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
