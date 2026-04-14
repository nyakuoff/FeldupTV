import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './server/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          bg: '#0f0f0f',
          'bg-2': '#181818',
          'bg-3': '#272727',
          hover: '#3d3d3d',
          text: '#f1f1f1',
          'text-2': '#aaaaaa',
          muted: '#717171',
          border: '#303030',
          red: '#ff0000',
        },
        feldup: {
          DEFAULT: '#ff0000',
          light: '#ff4444',
          dark: '#cc0000',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        header: '56px',
        sidebar: '240px',
        'sidebar-mini': '72px',
      },
      screens: {
        'xs': '480px',
      },
      transitionTimingFunction: {
        'yt': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
