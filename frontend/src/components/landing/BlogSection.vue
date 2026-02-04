<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const { t } = useI18n()

// 暫時 Mock 住先，之後喺呢度 call FastAPI
const latestPosts = [
  {
    id: 1,
    title: "Building a Modern Portfolio with FastAPI and Vue 3",
    date: "2026-02-04",
    excerpt: "Discover the architectural decisions behind this minimal, high-performance portfolio template.",
    tags: ["Tech"]
  },
  {
    id: 2,
    title: "The Art of Zinc Design System",
    date: "2026-02-01",
    excerpt: "Exploring why the Shadcn 'New York' style is dominating modern web aesthetics.",
    tags: ["Design"]
  }
]
</script>

<template>
  <section id="blog" class="container py-24 px-4 md:px-8">
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">
          {{ t('blog.recentPosts') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('blog.sectionDescription') }}
        </p>
      </div>
      <Button variant="ghost" class="text-muted-foreground hover:text-foreground">
        {{ t('blog.viewAllPosts') }} →
      </Button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      <Card 
        v-for="post in latestPosts" 
        :key="post.id" 
        class="flex flex-col justify-between transition-all hover:border-zinc-500/50"
      >
        <CardHeader>
          <div class="flex justify-between items-start mb-2">
            <span class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
                {{ post.tags[0] }}
            </span>
            <time class="text-xs text-muted-foreground">{{ post.date }}</time>
          </div>
          <CardTitle class="text-2xl font-bold leading-tight tracking-tight">
            {{ post.title }}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {{ post.excerpt }}
          </p>
        </CardContent>

        <CardFooter>
          <Button variant="link" class="p-0 h-auto text-foreground font-bold decoration-2 underline-offset-4">
            {{ t('blog.readMore') }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>