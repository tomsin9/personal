<script setup lang="ts">
import { ref, watch, onMounted, provide } from 'vue'
import { useDark } from '@vueuse/core'
import { themeOptions } from '@/lib/theme'
import FloatingNavbar from './components/FloatingNavbar.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

import SeasonsFalling from 'vue-seasons-falling'

gsap.registerPlugin(ScrollTrigger)

const SEASONS_EFFECT_STORAGE_KEY = 'seasons-effect-on'

function getStoredSeasonsEffect(): boolean {
  try {
    const stored = localStorage.getItem(SEASONS_EFFECT_STORAGE_KEY)
    // Default off; only on if user has previously turned it on (stored 'true')
    return stored === 'true'
  } catch {
    return false
  }
}

const isDark = useDark(themeOptions)
const seasonsEffectOn = ref(false)

function toggleSeason() {
  seasonsEffectOn.value = !seasonsEffectOn.value
}

watch(seasonsEffectOn, (on) => {
  try {
    localStorage.setItem(SEASONS_EFFECT_STORAGE_KEY, String(on))
  } catch {}
})

provide('toggleSeason', toggleSeason)
provide('seasonsEffectOn', seasonsEffectOn)

onMounted(() => {
  seasonsEffectOn.value = getStoredSeasonsEffect()
})
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground antialiased transition-colors duration-300 relative overflow-hidden"
    :class="{ dark: isDark }"
  >
    <!-- Seasons falling effect (site-wide when on, can be toggled off) -->
    <SeasonsFalling
      v-if="seasonsEffectOn"
      :theme="isDark ? 'dark' : 'light'"
      :amount="200"
      autoSeason
      fullScreen
      mouseInteraction
    />

    <div class="relative z-10">
      <FloatingNavbar />

      <main>
        <router-view />
      </main>
      
      <!-- <footer class="border-t border-border py-8">
        <div class="container text-center text-sm text-muted-foreground">
          © 2026. Built with FastAPI, Vue 3, Tailwind CSS and shadcn/vue.
        </div>
      </footer> -->
    </div>
    
    <Toaster position="top-center" />
  </div>
</template>