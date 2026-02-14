<script setup lang="ts">
import type { Component } from 'vue'
import { ref, computed, watch, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from '@/i18n'
import { useDark, useToggle } from '@vueuse/core'
import { Home, Briefcase, BookOpen, Mail, Sun, Moon, LogOut, SunSnow } from 'lucide-vue-next'
import { auth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const { t, locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const route = useRoute()
const router = useRouter()

export interface FloatingNavItem {
  label: string
  icon: Component
  href: string
  section?: string
}

const navItems: FloatingNavItem[] = [
  { label: 'navbar.home', icon: Home, href: '/', section: '' },
  { label: 'navbar.blog', icon: BookOpen, href: '/blog', section: 'blog' },
  { label: 'navbar.projects', icon: Briefcase, href: '/#projects', section: 'projects' },
  { label: 'navbar.contact', icon: Mail, href: '/#contact', section: 'contact' },
]

const currentHash = ref('')

function getHashFromHref(href: string): string {
  const idx = href.indexOf('#')
  return idx === -1 ? '' : href.slice(idx + 1)
}

function getHash() {
  return window.location.hash.slice(1) || ''
}

function isActive(item: FloatingNavItem): boolean {
  const section = item.section ?? getHashFromHref(item.href)
  if (!section) return !currentHash.value
  return currentHash.value === section
}

function updateHash() {
  currentHash.value = getHash()
}

function scrollToSection(sectionId: string) {
  if (!sectionId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    currentHash.value = sectionId
  }
}

async function handleNavClick(e: Event, item: FloatingNavItem) {
  const targetSection = getHashFromHref(item.href)
  const isHashLink = item.href.includes('#')

  if (isHashLink) {
    e.preventDefault()
    if (route.path !== '/') {
      await router.push(`/#${targetSection}`)
      await nextTick()
      scrollToSection(targetSection)
    } else {
      if (!targetSection) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        history.replaceState(null, '', route.path)
        currentHash.value = ''
      } else {
        scrollToSection(targetSection)
      }
    }
  }
}

const toggleSeason = inject<() => void>('toggleSeason', () => {})
const seasonsEffectOn = inject<import('vue').Ref<boolean>>('seasonsEffectOn', ref(true))

function onToggleSeason() {
  toggleSeason()
}

function toggleLocale() {
  const next = locale.value === 'en' ? 'zh' : 'en'
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch (_) {}
}

function isRouteActive(item: FloatingNavItem) {
  if (item.href.includes('#')) {
    // Hash sections (e.g. #projects, #contact) only active when on home page with that hash
    return route.path === '/' && currentHash.value === (item.section ?? getHashFromHref(item.href))
  }
  // Home is only active when on / with no hash (so projects/contact don't also highlight home)
  if (item.href === '/') {
    return route.path === '/' && !currentHash.value
  }
  return route.path === item.href
}

const themeLabel = computed(() =>
  isDark.value ? t('system.toggleTheme') : t('system.toggleTheme')
)

// Keep currentHash in sync with route so active state is correct after navigation
watch(
  () => ({ path: route.path, hash: route.hash }),
  ({ hash }) => {
    currentHash.value = hash ? hash.replace(/^#/, '') : ''
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('hashchange', updateHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})
</script>

<template>
  <TooltipProvider :delay-duration="200" :skip-delay-duration="0">
    <nav
      aria-label="Floating navigation"
      class="floating-navbar fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        :class="cn(
          'flex items-center gap-0.5 rounded-full border px-2 py-1.5 lg:gap-1',
          'bg-background/95 border-border shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80'
        )"
      >
        <template v-for="(item, index) in navItems" :key="index">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :class="cn(
                  'size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10',
                  isRouteActive(item) && 'text-primary bg-accent/50'
                )"
                @click="item.href.includes('#') ? handleNavClick($event, item) : router.push(item.href)"
              >
                <component :is="item.icon" class="size-[1.125rem] shrink-0 sm:size-5" :stroke-width="1.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" :side-offset="15" class="font-medium text-xs">
              {{ t(item.label) }}
            </TooltipContent>
          </Tooltip>
        </template>

        <div class="mx-1 w-px self-stretch bg-border" aria-hidden />

        <Tooltip ignore-non-keyboard-focus>
          <TooltipTrigger as-child @focus.stop @pointerdown.prevent>
            <Button
              variant="ghost"
              size="icon"
              class="size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10"
              @click="toggleLocale()"
            >
              <span class="text-xs font-medium sm:text-sm">{{ locale === 'en' ? '中' : 'EN' }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="15" class="font-medium text-xs">
            {{ t('system.switchLanguage') }}
          </TooltipContent>
        </Tooltip>

        <Tooltip ignore-non-keyboard-focus>
          <TooltipTrigger as-child @focus.stop @pointerdown.prevent>
            <Button
              variant="ghost"
              size="icon"
              :class="cn(
                'size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10'
              )"
              @click="onToggleSeason()"
            >
              <SunSnow class="size-[1.125rem] sm:size-5" :stroke-width="1.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="15" class="font-medium text-xs">
            {{ t('system.toggleSeason') }}
          </TooltipContent>
        </Tooltip>

        <Tooltip ignore-non-keyboard-focus>
          <TooltipTrigger as-child @focus.stop @pointerdown.prevent>
            <Button
              variant="ghost"
              size="icon"
              class="size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10"
              @click="toggleDark()"
            >
              <Sun class="size-[1.125rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 sm:size-5" :stroke-width="1.5" />
              <Moon class="absolute size-[1.125rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sm:size-5" :stroke-width="1.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="15" class="font-medium text-xs">
            {{ isDark ? t('system.lightMode') : t('system.darkMode') }}
          </TooltipContent>
        </Tooltip>

        <div v-if="auth.isAdmin" class="mx-1 w-px self-stretch bg-border" aria-hidden />

        <Tooltip v-if="auth.isAdmin" ignore-non-keyboard-focus>
          <TooltipTrigger as-child @focus.stop @pointerdown.prevent>
            <Button
              variant="ghost"
              size="icon"
              class="size-9 rounded-full transition-all duration-200 hover:scale-110 sm:size-10"
              @click="auth.logout()"
            >
              <LogOut class="size-[1.125rem] sm:size-5" :stroke-width="1.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="15" class="font-medium text-xs">
            {{ t('system.logout') }}
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  </TooltipProvider>
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
