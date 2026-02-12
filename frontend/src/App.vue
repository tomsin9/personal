<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDark } from '@vueuse/core'
import FloatingNavbar from './components/FloatingNavbar.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

gsap.registerPlugin(ScrollTrigger)

const isDark = useDark({ initialValue: 'dark' })

const mouseX = ref(50)
const mouseY = ref(50)

function onMouseMove(e: MouseEvent) {
  mouseX.value = (e.clientX / window.innerWidth) * 100
  mouseY.value = (e.clientY / window.innerHeight) * 100
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground antialiased transition-colors duration-300 relative overflow-hidden"
    :class="{ dark: isDark }"
  >
    <!-- Mouse-following glow (stronger in light mode so it's visible on white) -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      :style="{
        background: `radial-gradient(
          circle 40vmax at ${mouseX}% ${mouseY}%,
          hsl(var(--primary) / ${isDark ? 0.04 : 0}),
          transparent 60%
        )`,
      }"
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