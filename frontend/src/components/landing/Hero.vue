<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Mail, 
  Code, 
  Github, 
  Linkedin, 
} from 'lucide-vue-next'

const { locale, t } = useI18n()
const personalInfo = computed(() => siteConfig.personal[locale.value as keyof typeof siteConfig.personal])

const icons = {
  github: Github,
  linkedin: Linkedin,
  email: Mail
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="relative w-full flex items-center justify-center overflow-hidden py-20 md:py-28 min-h-[100vh] md:min-h-[50vh] lg:min-h-[88vh]">
    <div class="container relative z-10 mx-auto px-6">
      <div class="flex flex-col items-center text-center">
        
        <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
          <Code class="mr-2 h-3.5 w-3.5" />
          <span class="tracking-wide uppercase">Full Stack Web Developer</span>
        </div>

        <h1 
          class="max-w-4xl text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] mb-6 antialiased"
          v-html="personalInfo.heroTitle"
        ></h1>
        
        <p class="mx-auto max-w-[560px] text-muted-foreground text-base md:text-lg leading-relaxed mb-10 px-4">
            {{ personalInfo.heroDescription }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg mb-6">
          <Button 
            size="lg" 
            class="font-semibold tracking-wide w-fit px-8 h-12 text-base rounded-sm shadow-none transition-colors active:scale-[0.98]"
            as="a" 
            href="#projects" 
            @click.prevent="scrollToId('projects')"
          >
            {{ t('system.viewProjects') }}
            <ArrowRight class="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            class="font-semibold tracking-wide w-fit px-8 h-12 text-base rounded-sm"
            as="a"
            href="#contact"
            @click.prevent="scrollToId('contact')"
          >
            {{ t('system.contactMe') }}
          </Button>
        </div>
        <div class="flex items-center gap-3">
            <template v-for="(url, key) in siteConfig.socials" :key="key">
              <Button
                v-if="icons[key as keyof typeof icons]"
                variant="outline"
                size="icon"
                :aria-label="key"
                :data-social="key"
                class="social-link size-12 rounded-sm p-0 border-border
                                  bg-card transition-colors duration-200
                                  active:scale-95 [&_svg]:size-5 text-foreground"
                @click="openInNewTab(url)"
              >
                <component :is="icons[key as keyof typeof icons]" class="h-5 w-5" />
                <span class="sr-only">{{ key }}</span>
              </Button>
            </template>
        </div>

      </div>
    </div>
  </section>
</template>
