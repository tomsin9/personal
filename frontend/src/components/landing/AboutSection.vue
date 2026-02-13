<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

const { locale, t } = useI18n()

const personalInfo = computed(() => siteConfig.personal[locale.value as keyof typeof siteConfig.personal])

</script>

<template>
  <section id="about" class="container py-20 px-4 md:px-8">
    <div class="flex flex-col mb-8">
        <h2 class="text-3xl font-bold tracking-tight mb-4">{{ t('about.title') }}</h2>
        <!-- <div class="h-[3px] w-16 bg-destructive rounded-full"></div> -->
    </div>
    <div class="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 lg:gap-8 items-start mb-12">
      <div class="md:col-span-7 lg:col-span-8">
        <p class="text-muted-foreground" v-html="personalInfo.aboutMe"></p>
      </div>
      <div class="md:col-span-5 lg:col-span-4 pt-10 lg:pt-0">
        <img :src="siteConfig.aboutMeImage" :alt="siteConfig.author" class="w-full h-full max-w-[250px] object-cover rounded-md mx-auto">
      </div>
    </div>
  </section>
</template>