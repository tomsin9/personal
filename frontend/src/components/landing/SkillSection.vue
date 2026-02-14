<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'
import { Badge } from '@/components/ui/badge'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SkillGroupConfig {
  key: string
  skills: string
}

const getSkills = (skills: string) =>
  skills.split(',').map((s) => s.trim()).filter(Boolean)

const { t } = useI18n()

const skillGroups = (siteConfig.skills ?? []) as SkillGroupConfig[]


gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!containerRef.value) return

  const groups = containerRef.value.querySelectorAll('.skill-group')

  groups.forEach((group) => {
    const header = group.querySelector('.skill-group-header')
    const badges = group.querySelectorAll('.skill-badge')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })

    // header and separator first in
    tl.from(header, {
      opacity: 0,
      y: 12,
      duration: 0.45,
      ease: 'power2.out'
    })

    // badges stagger in
    tl.from(badges, {
      opacity: 0,
      y: 10,
      scale: 0.92,
      duration: 0.5,
      stagger: {
        amount: 0.3,        // total stagger time for the group
        from: 'start',
        ease: 'power2.out'
      },
      ease: 'power2.out'
    }, '-=0.15')
  })
})

</script>

<template>
    <section id="skills" class="container py-24 px-4 md:px-8">
      <div class="mb-16">
        <h2 class="text-3xl font-bold tracking-tight mb-4">{{ t('skills.title') }}</h2>
        <!-- <div class="h-[3px] w-16 bg-destructive rounded-full mb-4"></div> -->
        <p class="text-muted-foreground">
          {{ t('skills.description') }}
        </p>
      </div>
  
      <div ref="containerRef" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
        
        <div v-for="group in skillGroups" :key="group.key" class="skill-group space-y-6">
          <div class="skill-group-header space-y-2">
            <h3 class="text-sm uppercase font-bold text-primary/60">
              {{ t(`skills.groups.${group.key}`) }}
            </h3>
            <div class="h-[1px] w-full bg-primary/10"></div>
          </div>
  
          <ul class="flex flex-wrap gap-2">
            <li 
              v-for="skill in getSkills(group.skills)" 
              :key="skill"
              class="skill-badge group flex items-center justify-between gap-2" 
            >
              <Badge variant="secondary" class="text-[10px] px-1.5 h-5 whitespace-nowrap transition-colors">
                {{ skill }}
              </Badge>
            </li>
          </ul>
        </div>
  
      </div>
    </section>
</template>