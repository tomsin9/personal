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
  Instagram 
} from 'lucide-vue-next'

const { locale, t } = useI18n()
const personalInfo = computed(() => siteConfig.personal[locale.value as keyof typeof siteConfig.personal])

// Icon 映射表
const icons = {
  github: Github,
  linkedin: Linkedin,
  // instagram: Instagram,
  email: Mail
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function scrollToProjects() {
  const el = document.getElementById('projects')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="relative w-full flex items-center justify-center overflow-hidden py-16 md:py-32 min-h-[100vh] md:min-h-[50vh] lg:min-h-[90vh]">
    <!-- <div class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)]"></div> -->

    <div class="container relative z-10 mx-auto px-6">
      <div class="flex flex-col items-center text-center">
        
        <div class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <Code class="mr-2 h-3.5 w-3.5" />
          <span class="tracking-wide uppercase">Full Stack Web Developer</span>
        </div>

        <h1 
          class="max-w-4xl text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 antialiased"
          v-html="personalInfo.heroTitle"
        ></h1>
        
        <p class="mx-auto max-w-[600px] text-muted-foreground text-base md:text-xl leading-relaxed mb-10 px-4">
            {{ personalInfo.heroDescription }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-lg">
          
          <Button 
            size="lg" 
            class="font-bold tracking-wide w-fit px-10 h-12 text-base rounded-full shadow-md shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-95"
            as="a" 
            href="#projects" 
            @click.prevent="scrollToProjects"
          >
            {{ t('system.viewProjects') }}
            <ArrowRight class="ml-2 h-5 w-5" />
          </Button>

          <div class="flex items-center gap-3">
            <template v-for="(url, key) in siteConfig.socials" :key="key">
              <Button
                v-if="icons[key as keyof typeof icons]"
                variant="outline"
                size="icon"
                :aria-label="key"
                :data-social="key"
                class="social-link size-12 rounded-full p-0 border-zinc-300 dark:border-zinc-400/50
                                  bg-white dark:bg-zinc-900 backdrop-blur-md transition-all duration-300
                                  hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]
                                  active:scale-95 [&_svg]:size-5 text-zinc-700 dark:text-white"
                @click="openInNewTab(url)"
              >
                <component :is="icons[key as keyof typeof icons]" class="h-5 w-5" />
                <span class="sr-only">{{ key }}</span>
              </Button>
            </template>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>