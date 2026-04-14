<template>
  <div class="min-h-screen" style="background-color: var(--yt-bg-primary); color: var(--yt-text-primary);">
    <NuxtRouteAnnouncer />
    <LayoutAppHeader
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
      @open-settings="settingsPanelOpen = true"
    />
    <div class="flex" style="padding-top: var(--header-height);">
      <LayoutAppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main
        class="flex-1 min-w-0 transition-all duration-200"
        :style="isWide ? { marginLeft: sidebarOpen ? '210px' : '64px' } : {}"
      >
        <NuxtPage />
      </main>
    </div>
    <LayoutSettingsPanel :open="settingsPanelOpen" @close="settingsPanelOpen = false" />
  </div>
</template>

<script setup lang="ts">
await useChannel()

const { load } = useSettings()

const sidebarOpen = ref(false)
const isWide = ref(false)
const settingsPanelOpen = ref(false)

onMounted(() => {
  load()
  const checkWidth = () => {
    isWide.value = window.innerWidth >= 1024
    if (window.innerWidth < 1024) sidebarOpen.value = false
  }
  checkWidth()
  window.addEventListener('resize', checkWidth)
  onUnmounted(() => window.removeEventListener('resize', checkWidth))
})
</script>
