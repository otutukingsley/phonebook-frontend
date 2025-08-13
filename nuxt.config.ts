// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  features: { inlineStyles: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || "",
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "",
      maxAge: 60 * 60 * 24 * 7
    }
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
    '@nuxt/ui',
    'nuxt-auth-utils'
  ],

  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
})