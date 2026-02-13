<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { apiBaseUrl } from '@/config/site'
import { auth } from '@/store/auth'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/BlogCard.vue'

import type { Post } from '@/types/blog'

const { t, locale } = useI18n()

const latestPosts = ref<Post[]>([])
const isLoading = ref(true)

const fetchPosts = async () => {
  try {
    isLoading.value = true
    const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    const response = await axios.get(`${apiBaseUrl}/api/v1/blog/`, {
      params: { page: 1, size: 2 },
      headers
    })
    latestPosts.value = response.data?.items || []
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <section id="blog" class="container py-20 px-4 md:px-8">
    <div class="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">
          {{ t('blog.recentPosts') }}
        </h2>
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
        class="block"
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