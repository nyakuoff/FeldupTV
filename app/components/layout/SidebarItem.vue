<template>
  <component
    :is="external ? 'a' : NuxtLink"
    v-bind="linkProps"
    class="flex items-center gap-3 mx-2 my-0.5 rounded-xl transition-all duration-150 group relative overflow-hidden"
    :class="collapsed ? 'justify-center px-0 mx-0 rounded-none py-3' : 'px-3 py-2.5'"
    :style="isActive
      ? 'background-color: rgba(255,255,255,0.07); color: var(--yt-text-primary);'
      : hovered
        ? 'background-color: rgba(255,255,255,0.05); color: var(--yt-text-secondary);'
        : 'color: var(--yt-text-secondary);'"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Active left accent bar -->
    <span
      class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r transition-all duration-200"
      :style="isActive
        ? 'height: 60%; background-color: var(--feldup-accent); opacity: 1;'
        : 'height: 0%; opacity: 0;'"
    />

    <span
      class="flex items-center justify-center shrink-0 transition-colors"
      :class="collapsed ? 'w-full' : 'w-5 h-5'"
    >
      <LayoutSidebarIcon :name="icon" />
    </span>

    <span
      v-if="!collapsed"
      class="text-sm font-medium whitespace-nowrap overflow-hidden"
      :style="isActive ? 'color: var(--yt-text-primary);' : ''"
    >
      {{ label }}
    </span>

    <!-- Tooltip for collapsed -->
    <div
      v-if="collapsed"
      class="absolute left-full ml-3 px-2.5 py-1.5 text-xs rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg"
      style="background-color: var(--yt-bg-tertiary); color: var(--yt-text-primary); border: 1px solid var(--yt-border);"
    >
      {{ label }}
    </div>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  to?: string
  href?: string
  icon: string
  label: string
  collapsed: boolean
  external?: boolean
}>()

const route = useRoute()
const hovered = ref(false)
const isActive = computed(() => {
  if (!props.to) return false
  if (props.to === '/') return route.path === '/'
  return route.path.startsWith(props.to)
})

const linkProps = computed(() => {
  if (props.external) {
    return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
  }
  return { to: props.to }
})
</script>
