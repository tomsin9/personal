import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { createHtmlPlugin } from 'vite-plugin-html'
import { siteConfig } from './src/config/site'

// https://vite.dev/config/
export default defineConfig({
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
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // handle API requests
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      // handle static resource requests
      '/static': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
