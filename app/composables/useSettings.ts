export interface Settings {
  accent: string
  accentLight: string
  theme: 'dark' | 'amoled' | 'dim'
  density: 'spacious' | 'comfortable' | 'compact'
}

export const ACCENT_PRESETS: { label: string; value: string; light: string }[] = [
  { label: 'Green',  value: '#22c55e', light: '#4ade80' },
  { label: 'Red',    value: '#ff0000', light: '#ff4444' },
  { label: 'Blue',   value: '#3b82f6', light: '#60a5fa' },
  { label: 'Purple', value: '#a855f7', light: '#c084fc' },
  { label: 'Orange', value: '#f97316', light: '#fb923c' },
]

const THEMES = {
  dark:   { bg: '#0a0a0a', bg2: '#111111', bg3: '#1c1c1c', bg4: '#252525' },
  amoled: { bg: '#000000', bg2: '#0a0a0a', bg3: '#111111', bg4: '#1a1a1a' },
  dim:    { bg: '#141414', bg2: '#1c1c1c', bg3: '#252525', bg4: '#2e2e2e' },
}

const DEFAULTS: Settings = {
  accent: '#22c55e',
  accentLight: '#4ade80',
  theme: 'dark',
  density: 'comfortable',
}

const SETTINGS_VERSION = 3

export function useSettings() {
  const settings = useState<Settings>('settings', () => ({ ...DEFAULTS }))

  function apply() {
    if (!import.meta.client) return
    const r = document.documentElement.style
    r.setProperty('--feldup-accent',       settings.value.accent)
    r.setProperty('--feldup-accent-light', settings.value.accentLight)
    r.setProperty('--yt-red',              settings.value.accent)
    r.setProperty('--yt-red-hover',        settings.value.accentLight)

    const t = THEMES[settings.value.theme]
    r.setProperty('--yt-bg-primary',   t.bg)
    r.setProperty('--yt-bg-secondary', t.bg2)
    r.setProperty('--yt-bg-tertiary',  t.bg3)
    r.setProperty('--yt-bg-hover',     t.bg4)

    document.documentElement.classList.remove('density-compact', 'density-spacious')
    if (settings.value.density === 'compact') {
      document.documentElement.classList.add('density-compact')
    } else if (settings.value.density === 'spacious') {
      document.documentElement.classList.add('density-spacious')
    }
  }

  function save() {
    if (!import.meta.client) return
    localStorage.setItem('felduptv-settings', JSON.stringify({ ...settings.value, _v: SETTINGS_VERSION }))
    apply()
  }

  function load() {
    if (!import.meta.client) return
    try {
      const stored = localStorage.getItem('felduptv-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Only restore if version matches; otherwise fall through to fresh defaults
        if (parsed._v === SETTINGS_VERSION) {
          Object.assign(settings.value, parsed)
        }
      }
    } catch { /* ignore */ }
    apply()
  }

  function setAccent(preset: (typeof ACCENT_PRESETS)[number]) {
    settings.value.accent = preset.value
    settings.value.accentLight = preset.light
    save()
  }

  function setTheme(theme: Settings['theme']) {
    settings.value.theme = theme
    save()
  }

  function setDensity(density: Settings['density']) {
    settings.value.density = density
    save()
  }

  return { settings, load, apply, setAccent, setTheme, setDensity }
}
