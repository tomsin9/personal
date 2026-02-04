<script setup lang="ts">
import type { Component } from 'vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import { Home, Briefcase, BookOpen, Mail, Sun, Moon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { t, locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)

export interface FloatingNavItem {
  label: string
  icon: Component
  href: string
  section?: string
}

const navItems: FloatingNavItem[] = [
  { label: 'Home', icon: Home, href: '#', section: '' },
  { label: 'Projects', icon: Briefcase, href: '#projects', section: 'projects' },
  { label: 'Blog', icon: BookOpen, href: '#blog', section: 'blog' },
  { label: 'Contact', icon: Mail, href: '#contact', section: 'contact' },
]

const currentHash = ref('')

function getHash() {
  return window.location.hash.slice(1) || ''
}

function isActive(item: FloatingNavItem): boolean {
  const section = item.section ?? item.href.replace('#', '')
  if (!section) return !currentHash.value
  return currentHash.value === section
}

function updateHash() {
  currentHash.value = getHash()
}

function handleNavClick(e: Event, item: FloatingNavItem) {
  if (item.href === '#') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    history.replaceState(null, '', ' ')
    currentHash.value = ''
  }
}

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const themeLabel = computed(() =>
  isDark.value ? t('system.toggleTheme') : t('system.toggleTheme')
)

onMounted(() => {
  currentHash.value = getHash()
  window.addEventListener('hashchange', updateHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})
</script>

<template>
  <nav
    aria-label="Floating navigation"
    class="floating-navbar fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
  >
    <div
      :class="cn(
        'flex items-center gap-0.5 rounded-full border px-2 py-1.5',
        'bg-background/95 border-border shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80'
      )"
    >
      <template v-for="(item, index) in navItems" :key="index">
        <a
          :href="item.href"
          :aria-label="item.label"
          :aria-current="isActive(item) ? 'page' : undefined"
          :title="item.label"
          @click="handleNavClick($event, item)"
          :class="cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 sm:size-10',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            isActive(item) && 'text-primary'
          )"
        >
          <component :is="item.icon" class="size-[1.125rem] sm:size-5" aria-hidden />
        </a>
      </template>

      <div class="mx-1 w-px self-stretch bg-border" aria-hidden />

      <Button
        variant="ghost"
        size="icon"
        :aria-label="locale === 'en' ? '中文' : 'English'"
        class="size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10"
        :title="locale === 'en' ? '中文' : 'English'"
        @click="toggleLocale()"
      >
        <span class="text-xs font-medium sm:text-sm">{{ locale === 'en' ? '中' : 'EN' }}</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        :aria-label="themeLabel"
        class="size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10"
        :title="themeLabel"
        @click="toggleDark()"
      >
        <Sun class="size-[1.125rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 sm:size-5" />
        <Moon class="absolute size-[1.125rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sm:size-5" />
      </Button>
    </div>
  </nav>
</template>

<style scoped>
.floating-navbar a {
  color: hsl(var(--foreground));
}
.floating-navbar a:hover {
  background-color: transparent;
}
.floating-navbar button:focus-visible {
  outline-color: hsl(var(--border));
}
</style>
