<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Github, Linkedin, Mail, Instagram } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { siteConfig } from '@/config/site'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
const scrollTriggerRef = ref<ScrollTrigger | null>(null)

const iconMap = {
    email: Mail,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram
} as const

const labelMap: Record<keyof typeof iconMap, string> = {
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    instagram: 'Instagram'
}

type SocialKey = keyof typeof iconMap
const socialKeys = Object.keys(iconMap) as SocialKey[]
const socialMedia = (Object.entries(siteConfig.socials) as [string, string][])
  .filter(([key]) => socialKeys.includes(key as SocialKey))
  .map(([key, url]) => {
    const k = key as SocialKey
    return { key: k, name: labelMap[k], icon: iconMap[k], url }
  })

const socialGroups = computed(() => [
  {
    title: t('contact.devTitle'),
    items: [
      { key: 'github', name: t('contact.github'), icon: Github, url: siteConfig.socials.github },
      { key: 'linkedin', name: t('contact.linkedin'), icon: Linkedin, url: siteConfig.socials.linkedin },
      { key: 'email', name: t('contact.email'), icon: Mail, url: siteConfig.socials.email },
    ]
  },
  {
    title: t('contact.photoTitle'),
    items: [
      { key: 'instagram', name: t('contact.instagram'), icon: Instagram, url: siteConfig.socials.instagram }
    ]
  }
])

onMounted(() => {
  if (!sectionRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
  scrollTriggerRef.value = tl.scrollTrigger ?? null

  tl.from('.animate-text', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  tl.from(sectionRef.value.querySelectorAll('.social-btn'), {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
  }, '-=0.4')
})

onUnmounted(() => {
  if (scrollTriggerRef.value) {
    scrollTriggerRef.value.kill()
    scrollTriggerRef.value = null
  }
})
</script>

<template>
  <section
    ref="sectionRef" 
    id="contact"
    class="contact-section relative py-20 px-6 overflow-hidden scroll-mt-16 scroll-mb-24">

    <div class="max-w-4xl mx-auto text-center relative z-10">
        <h2 class="text-4xl font-bold tracking-tight lg:text-5xl mb-6 animate-text">
            {{ t('contact.title') }}
        </h2>
        
        <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-text">
            {{ t('contact.description') }}
        </p>

        <div class="flex flex-col md:flex-row justify-center items-center gap-8 min-h-[150px] my-12">
          <TooltipProvider :delay-duration="0">
            <template v-for="(group, index) in socialGroups" :key="index">
              
              <div class="flex flex-col items-center gap-4">
                <span class="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  {{ group.title }}
                </span>
                
                <div class="flex gap-4">
                  <div v-for="social in group.items" :key="social.key" class="social-btn">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          as="a"
                          :href="social.url"
                          :data-social="social.key"
                          target="_blank"
                          rel="noopener noreferrer"
                          size="icon"
                          variant="outline"
                          class="social-link size-12 rounded-full p-0 border-zinc-300 dark:border-zinc-400/50
                                  bg-white dark:bg-zinc-900 backdrop-blur-md transition-all duration-300
                                  hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]
                                  active:scale-95 [&_svg]:size-5 text-zinc-700 dark:text-white"
                        >
                          <component :is="social.icon" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" :side-offset="10" class="font-medium text-xs">
                        {{ social.name }}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div v-if="index === 0" class="hidden md:block w-[1px] h-12 bg-zinc-200 dark:bg-zinc-800 mx-4"></div>
            </template>
          </TooltipProvider>
        </div>
    </div>
  </section>
</template>