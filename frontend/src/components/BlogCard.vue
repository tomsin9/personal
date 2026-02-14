<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/lib/formatDate'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import type { Post } from '@/types/blog'

defineProps<{
  post: Post
}>()

const { t, locale } = useI18n()
</script>

<template>
  <Card class="flex flex-col h-full justify-between transition-all hover:border-zinc-500/50 bg-card/40 backdrop-blur border-border/60">
    <CardHeader>
      <div class="flex justify-between items-start mb-2">
        <div v-if="post.tags && post.tags.length > 0 || post.is_published === false" class="flex items-center gap-2">
          <span v-if="post.tags && post.tags.length > 0" class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
            {{ post.tags[0] }}
          </span>
          <span v-if="post.is_published === false" class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border border-amber-500 text-amber-600 dark:text-amber-400 rounded">
            {{ t('blog.draft') }}
          </span>
        </div>
        <time class="text-xs text-muted-foreground" :datetime="post.created_at">
          {{ formatDate(post.created_at, locale) }}
        </time>
      </div>
      <CardTitle class="text-xl font-bold leading-tight tracking-tight">
        {{ post.title }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
        {{ post.excerpt || post.content?.substring(0, 100) + '...' }}
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="link" class="p-0 h-auto text-foreground font-bold decoration-2 underline-offset-4">
        {{ t('blog.readMore') }}
      </Button>
    </CardFooter>
  </Card>
</template>
