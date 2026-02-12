<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { apiBaseUrl } from '@/config/site'
import { useI18n } from 'vue-i18n'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, Github, ChevronDown, ChevronUp, Code } from 'lucide-vue-next'

import type { Project } from '@/types/project'

const { t } = useI18n()

const projects = ref<Project[]>([])
const isLoading = ref(true)
const isExpanded = ref(false)

const fetchProjects = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`${apiBaseUrl}/api/v1/projects/`)
    projects.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  } finally {
    isLoading.value = false
  }
}

const displayedProjects = computed(() => {
  return isExpanded.value ? projects.value : projects.value.slice(0, 3)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value

  // if (!isExpanded.value) {
  //   const el = document.getElementById('projects-title')
  //   el?.scrollIntoView({ behavior: 'smooth' })
  // }
}

onMounted(() => {
  fetchProjects()
})

</script>

<template>
  <section id="projects" class="container py-20 px-4 md:px-8">
    <div class="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
      <div class="space-y-2">
        <h2 id="projects-title" class="text-3xl font-bold tracking-tight">
          {{ t('projects.title') }}
        </h2>
        <p class="text-muted-foreground">
          {{ t('projects.description') }}
        </p>
      </div>
      <!-- <router-link to="/projects">
        <Button variant="ghost" class="text-muted-foreground hover:text-foreground">
          {{ t('projects.viewAllProjects') }} →
        </Button>
      </router-link> -->
    </div>

    <template v-if="isLoading">
      <ItemGroup class="space-y-4">
        <Item
          v-for="i in displayedProjects.length"
          :key="i"
          variant="outline"
          class="p-4 bg-card border border-zinc-500/20"
        >
          <div class="w-full flex items-start md:items-center gap-4">
            <Skeleton class="size-20 md:w-32 md:h-20 shrink-0 rounded-md" />
            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex flex-wrap gap-2">
                <Skeleton class="h-6 w-32" />
                <Skeleton class="h-5 w-12" />
                <Skeleton class="h-5 w-16" />
              </div>
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-3/4" />
              <div class="flex gap-4 pt-2">
                <Skeleton class="h-3 w-16" />
                <Skeleton class="h-3 w-20" />
              </div>
            </div>
          </div>
        </Item>
      </ItemGroup>
    </template>
    <ItemGroup v-else class="space-y-4">
      <Item
        v-for="project in displayedProjects"
        :key="project.id"
        variant="outline"
        class="group p-4 transition-colors bg-card border hover:border-zinc-500/50"
      >
        <div class="w-full flex items-start md:items-center gap-4">
          <ItemMedia variant="image" class="size-20 md:w-auto md:h-20 md:aspect-[16/9] shrink-0 overflow-hidden rounded-md border flex items-center justify-center">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            >
            <Code v-else class="size-6 text-muted-foreground dark:text-muted" />
          </ItemMedia>

          <ItemContent class="min-w-0 flex-1">
            <div class="flex flex-wrap flex-col md:flex-row justify-between items-start gap-2">
              <ItemTitle class="min-w-0 flex-1 text-lg font-semibold break-words">
                {{ project.title }}
              </ItemTitle>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="tag in project.tags" :key="tag" variant="secondary" class="text-[10px] px-1.5 h-5 whitespace-nowrap">
                  {{ tag }}
                </Badge>
              </div>
            </div>
            
            <ItemDescription class="mt-1 line-clamp-6">
              {{ project.description }}
            </ItemDescription>

            <div class="mt-3 flex gap-4">
              <a v-if="project.github_url" :href="project.github_url" target="_blank" rel="noopener noreferrer" class="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Github class="size-3" /> {{ t('contact.github') }}
              </a>
              <a v-if="project.live_url" :href="project.live_url" target="_blank" rel="noopener noreferrer" class="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink class="size-3" /> {{ t('projects.liveDemo') }}
              </a>
            </div>
          </ItemContent>
        </div>
      </Item>
    </ItemGroup>

    <div v-if="!isLoading && projects.length > 3" class="mt-10 flex justify-center">
      <Button 
        variant="ghost" 
        @click="toggleExpand"
        class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
      >
        <template v-if="!isExpanded">
          <span>{{ t('projects.showMore') }}</span>
          <ChevronDown class="size-4" />
        </template>
        <template v-else>
          <span>{{ t('projects.showLess') }}</span>
          <ChevronUp class="size-4" />
        </template>
      </Button>
    </div>
  </section>
</template>