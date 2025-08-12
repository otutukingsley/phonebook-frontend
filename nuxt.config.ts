// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  features: { inlineStyles: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preload', as: 'style', href: '/assets/css/main.css' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:5500/api',
    },
  },
  typescript: {
    strict: true,
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui'
  ],

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
})