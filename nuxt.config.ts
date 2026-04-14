// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],



  runtimeConfig: {
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    // public values are exposed to the client - keep empty here
    public: {},
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  nitro: {
    routeRules: {
      '/api/channel': { cache: { maxAge: 3600 } },
      '/api/videos': { cache: { maxAge: 1800 } },
      '/api/community': { cache: { maxAge: 1800 } },
      '/api/bluesky': { cache: { maxAge: 300 } },
      // /api/summary uses globalThis in-process caching — no Nitro cache needed
    },
  },
})
