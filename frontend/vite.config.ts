import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { createHtmlPlugin } from 'vite-plugin-html'
import { siteConfig } from './src/config/site'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const gaMeasurementId = env.VITE_GA_MEASUREMENT_ID ?? ''

  return {
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: siteConfig.siteTitle,
          description: siteConfig.description,
          author: siteConfig.author,
          keywords: siteConfig.keywords,
          ogImage: siteConfig.ogImage,
          gaMeasurementId,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  }
})
