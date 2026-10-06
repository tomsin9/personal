<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

const { locale, t } = useI18n()

const personalInfo = computed(() => siteConfig.personal[locale.value as keyof typeof siteConfig.personal])
</script>

<template>
  <section id="about" class="container py-20 px-4 md:px-8">
    <div class="flex flex-col mb-8">
        <h2 class="text-3xl font-semibold tracking-tight mb-3">{{ t('about.title') }}</h2>
        <div class="h-[2px] w-10 bg-primary"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div class="md:col-span-3 lg:col-span-2 flex items-start justify-start">
        <img :src="siteConfig.aboutMeImage" :alt="siteConfig.author" class="w-full h-full max-w-[140px] object-cover rounded-sm border border-border">
      </div>
      <ol class="md:col-span-9 lg:col-span-10 space-y-4 list-none p-0 m-0">
        <li
          v-for="(fact, index) in personalInfo.aboutFacts"
          :key="index"
          class="grid grid-cols-[2.5rem_1fr] gap-3 items-start text-[15px] leading-relaxed text-foreground"
        >
          <span class="font-serif text-sm text-primary pt-0.5 tabular-nums">{{ String(index + 1).padStart(2, '0') }}</span>
          <span>{{ fact }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>
