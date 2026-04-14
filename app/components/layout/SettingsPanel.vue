<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="sf-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60]"
        style="background-color: rgba(0,0,0,0.5); backdrop-filter: blur(2px);"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="sf-slide">
      <div
        v-if="open"
        class="fixed top-0 right-0 bottom-0 z-[61] flex flex-col"
        style="
          width: 300px;
          background-color: var(--yt-bg-secondary);
          border-left: 1px solid var(--yt-border);
        "
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 shrink-0"
          style="border-bottom: 1px solid var(--yt-border);"
        >
          <div class="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--feldup-accent);">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <h2 class="text-[15px] font-semibold" style="color: var(--yt-text-primary); letter-spacing: -0.02em;">Settings</h2>
          </div>
          <button
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style="color: var(--yt-text-secondary);"
            @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable body -->
        <div class="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">

          <!-- Accent Color -->
          <section class="flex flex-col gap-3">
            <p class="text-[11px] font-semibold uppercase tracking-widest" style="color: var(--yt-text-muted);">Accent Color</p>
            <div class="flex gap-3 flex-wrap">
              <button
                v-for="preset in ACCENT_PRESETS"
                :key="preset.value"
                @click="setAccent(preset)"
                class="w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center"
                :style="{
                  backgroundColor: preset.value,
                  boxShadow: settings.accent === preset.value
                    ? `0 0 0 2px var(--yt-bg-secondary), 0 0 0 4px ${preset.value}`
                    : 'none',
                  transform: settings.accent === preset.value ? 'scale(1.18)' : 'scale(1)',
                }"
                :title="preset.label"
              >
                <svg
                  v-if="settings.accent === preset.value"
                  width="14" height="14" viewBox="0 0 24 24" fill="white"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </button>
            </div>
          </section>

          <!-- Background -->
          <section class="flex flex-col gap-3">
            <p class="text-[11px] font-semibold uppercase tracking-widest" style="color: var(--yt-text-muted);">Background</p>
            <div class="flex flex-col gap-2">
              <button
                v-for="t in themeOptions"
                :key="t.value"
                @click="setTheme(t.value)"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                :style="settings.theme === t.value
                  ? 'background-color: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);'
                  : hoveredTheme === t.value
                    ? 'background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);'
                    : 'background-color: transparent; border: 1px solid var(--yt-border);'"
                @mouseenter="hoveredTheme = t.value"
                @mouseleave="hoveredTheme = ''"
              >
                <span
                  class="w-7 h-7 rounded-lg shrink-0"
                  :style="{ backgroundColor: t.bg, border: '1px solid rgba(255,255,255,0.12)' }"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium" style="color: var(--yt-text-primary);">{{ t.label }}</p>
                  <p class="text-xs" style="color: var(--yt-text-secondary);">{{ t.description }}</p>
                </div>
                <span
                  v-if="settings.theme === t.value"
                  class="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: 'var(--feldup-accent)' }"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </span>
              </button>
            </div>
          </section>

          <!-- Density -->
          <section class="flex flex-col gap-3">
            <p class="text-[11px] font-semibold uppercase tracking-widest" style="color: var(--yt-text-muted);">Layout Density</p>
            <div class="flex flex-col gap-2">
              <button
                v-for="d in densityOptions"
                :key="d.value"
                @click="setDensity(d.value)"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                :style="settings.density === d.value
                  ? 'background-color: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);'
                  : hoveredDensity === d.value
                    ? 'background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);'
                    : 'background-color: transparent; border: 1px solid var(--yt-border);'"
                @mouseenter="hoveredDensity = d.value"
                @mouseleave="hoveredDensity = ''"
              >
                <svg width="28" height="20" viewBox="0 0 32 22" fill="none" class="shrink-0" style="color: var(--yt-text-secondary);">
                  <template v-if="d.value === 'spacious'">
                    <rect x="0" y="0"    width="32" height="4" rx="2" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="10"   width="22" height="4" rx="2" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="20"   width="28" height="4" rx="2" fill="currentColor" opacity="0.5"/>
                  </template>
                  <template v-else-if="d.value === 'comfortable'">
                    <rect x="0" y="0"    width="32" height="3.5" rx="1.75" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="7.5"  width="22" height="3.5" rx="1.75" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="15"   width="28" height="3.5" rx="1.75" fill="currentColor" opacity="0.5"/>
                  </template>
                  <template v-else>
                    <rect x="0" y="0"   width="32" height="2.5" rx="1.25" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="6"   width="22" height="2.5" rx="1.25" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="12"  width="28" height="2.5" rx="1.25" fill="currentColor" opacity="0.5"/>
                    <rect x="0" y="18"  width="18" height="2.5" rx="1.25" fill="currentColor" opacity="0.5"/>
                  </template>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium" style="color: var(--yt-text-primary);">{{ d.label }}</p>
                  <p class="text-xs" style="color: var(--yt-text-secondary);">{{ d.description }}</p>
                </div>
                <span
                  v-if="settings.density === d.value"
                  class="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: 'var(--feldup-accent)' }"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </span>
              </button>
            </div>
          </section>

        </div>

        <!-- Footer -->
        <div class="px-5 py-3 shrink-0" style="border-top: 1px solid var(--yt-border);">
          <p class="text-xs text-center" style="color: var(--yt-text-muted);">Changes are saved automatically</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ACCENT_PRESETS, useSettings } from '~/composables/useSettings'

defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { settings, setAccent, setTheme, setDensity } = useSettings()

const hoveredTheme = ref('')
const hoveredDensity = ref('')

const themeOptions = [
  { value: 'dark'   as const, label: 'Dark',   description: 'Default dark theme',    bg: '#0a0a0a' },
  { value: 'amoled' as const, label: 'AMOLED', description: 'Pure black for OLED',   bg: '#000000' },
  { value: 'dim'    as const, label: 'Dim',    description: 'Slightly lighter darks', bg: '#141414' },
]

const densityOptions = [
  { value: 'comfortable'  as const, label: 'Comfortable', description: 'Balanced default'      },
  { value: 'spacious'     as const, label: 'Spacious',    description: 'Extra breathing room'   },
  { value: 'compact'      as const, label: 'Compact',     description: 'Tighter layout'         },
]
</script>

<style scoped>
.sf-fade-enter-active, .sf-fade-leave-active { transition: opacity 0.2s ease; }
.sf-fade-enter-from,  .sf-fade-leave-to      { opacity: 0; }

.sf-slide-enter-active { transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease; }
.sf-slide-leave-active { transition: transform 0.2s ease, opacity 0.15s ease; }
.sf-slide-enter-from,
.sf-slide-leave-to     { transform: translateX(100%); opacity: 0; }
</style>
