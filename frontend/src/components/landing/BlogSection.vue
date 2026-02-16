<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { apiBaseUrl } from '@/config/site'
import { auth } from '@/store/auth'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/BlogCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Post } from '@/types/blog'

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const latestPosts = ref<Post[]>([])
const isLoading = ref(true)
const blogSectionRef = ref<HTMLElement | null>(null)
const scrollTriggerRef = ref<ScrollTrigger | null>(null)
let scrollTriggerDone = false

const fetchPosts = async () => {
  isLoading.value = true
  latestPosts.value = []
  try {
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    const response = await axios.get(`${apiBaseUrl}/api/v1/blog/`, {
      params: { page: 1, size: 2, published_only: true },
      headers
    })
    latestPosts.value = response.data?.items || []
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  } finally {
    isLoading.value = false
  }
}

const setupBlogAnimation = () => {
  if (!blogSectionRef.value || scrollTriggerDone) return
  const header = blogSectionRef.value.querySelector('.blog-section-header')
  const cards = blogSectionRef.value.querySelectorAll('.blog-post-card')
  if (!header || !cards.length) return
  scrollTriggerDone = true

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: blogSectionRef.value,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  })
  scrollTriggerRef.value = tl.scrollTrigger ?? null
  tl.from(header, {
    opacity: 0,
    y: 12,
    duration: 0.45,
    ease: 'power2.out'
  })
  tl.from(cards, {
    opacity: 0,
    y: 14,
    scale: 0.96,
    duration: 0.5,
    stagger: { amount: 0.5, from: 'start', ease: 'power2.out' },
    ease: 'power2.out'
  }, '-=0.12')
}

watch(() => latestPosts.value.length, (len) => {
  if (len > 0) nextTick(() => setupBlogAnimation())
})

onMounted(() => {
  fetchPosts()
})

onUnmounted(() => {
  if (scrollTriggerRef.value) {
    scrollTriggerRef.value.kill()
    scrollTriggerRef.value = null
  }
  scrollTriggerDone = false
})
</script>

<template>
  <section ref="blogSectionRef" id="blog" class="container py-20 px-4 md:px-8">
    <div class="blog-section-header flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight mb-4">
          {{ t('blog.recentPosts') }}
        </h2>
        <!-- <div class="h-[3px] w-16 bg-destructive rounded-full mb-4"></div> -->
        <p class="text-muted-foreground">
          {{ t('blog.sectionDescription') }}
        </p>
      </div>
      <router-link to="/blog">
        <Button variant="ghost" class="text-muted-foreground hover:text-foreground">
          {{ t('blog.viewAllPosts') }} →
        </Button>
      </router-link>
    </div>

    <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      <Card v-for="i in 2" :key="i" class="animate-pulse h-[200px]">
        <CardHeader class="space-y-3">
          <div class="h-4 w-1/4 bg-muted rounded"></div>
          <div class="h-8 w-3/4 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div class="h-4 w-full bg-muted rounded mb-2"></div>
          <div class="h-4 w-5/6 bg-muted rounded"></div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="latestPosts.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      <router-link 
        v-for="post in latestPosts" 
        :key="post.id" 
        :to="{ name: 'post-detail', params: { id: post.id } }"
        class="blog-post-card block"
      >
        <BlogCard :post="post" />
      </router-link>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-full py-12">
      <p class="text-muted-foreground text-sm">
        {{ t('blog.noPosts') }}
      </p>
    </div>

  </section>
</template>