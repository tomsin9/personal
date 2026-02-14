<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Hero from '../components/landing/Hero.vue'
import AboutSection from '../components/landing/AboutSection.vue'
import SkillsSection from '../components/landing/SkillSection.vue'
import BlogSection from '../components/landing/BlogSection.vue'
import ProjectsSection from '../components/landing/ProjectsSection.vue'
import ContactSection from '../components/landing/ContactSection.vue'

const route = useRoute()

onMounted(() => {
  if (route.hash) {
    const target = route.hash.slice(1)
    setTimeout(() => {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }
})
</script>

<template>
  <Hero />
  <AboutSection />
  <SkillsSection />
  <BlogSection />
  <ProjectsSection />
  <ContactSection />
</template>