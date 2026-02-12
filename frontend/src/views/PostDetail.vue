<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { apiBaseUrl } from '@/config/site'
import axios from 'axios'
import { marked } from 'marked'
import { useI18n } from 'vue-i18n'
import { auth } from '@/store/auth'
import { formatDate, formatDateTime } from '@/lib/formatDate'
import { ArrowLeftIcon, PencilIcon, SaveIcon, XIcon, PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { Post } from '@/types/blog'
import { toast } from 'vue-sonner'
import Editor from '@/components/Editor.vue'

const { t, locale } = useI18n()
const props = defineProps(['id'])

const post = ref<Post | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)
const newTag = ref('')

const editForm = reactive({
  title: '',
  excerpt: '',
  content: '',
  tags: [] as string[],
  is_published: false
})

onMounted(async () => {
  const response = await axios.get(`${apiBaseUrl}/api/v1/blog/${props.id}`)
  post.value = response.data
})

const startEditing = () => {
  if (!post.value) return
  editForm.title = post.value.title
  editForm.excerpt = post.value.excerpt ?? ''
  editForm.content = post.value.content ?? ''
  editForm.tags = [...(post.value.tags ?? [])]
  editForm.is_published = post.value.is_published ?? false
  isEditing.value = true
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (!tag) return
  if (editForm.tags.includes(tag)) {
    newTag.value = ''
    return
  }
  editForm.tags.push(tag)
  newTag.value = ''
}

const removeTag = (index: number) => {
  editForm.tags.splice(index, 1)
}

const saveEdit = async () => {
  if (!post.value) return
  isSaving.value = true

  try {
    const response = await axios.patch(
      `${apiBaseUrl}/api/v1/blog/${props.id}`,
      {
        title: editForm.title,
        excerpt: editForm.excerpt,
        content: editForm.content,
        tags: editForm.tags,
        is_published: editForm.is_published
      },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    )

    post.value.title = response.data.title
    post.value.excerpt = response.data.excerpt ?? ''
    post.value.content = response.data.content
    post.value.tags = response.data.tags ?? []
    post.value.is_published = response.data.is_published ?? false
    post.value.updated_at = response.data.updated_at
    isEditing.value = false
    toast.success('Post updated successfully!')
  } catch (err: unknown) {
    console.error(err)
    const msg =
      axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : axios.isAxiosError(err) && err.response?.status === 401
          ? t('auth.pleaseLogInAgain')
          : 'Failed to update post'
    toast.error(msg)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="post" class="container pt-12 pb-32 lg:pt-20 lg:pb-40 animate-in fade-in duration-700">

    <div class="flex justify-between items-center mb-4">
      <Button as="a" href="/" variant="link" class="p-0 h-auto mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon class="w-4 h-4" />
        {{ t('system.backToHome') }}
      </Button>
  
      <div v-if="auth.isAdmin" class="flex gap-2 mb-4">
        <Button v-if="!isEditing" @click="startEditing" variant="outline" size="sm">
          <PencilIcon class="w-4 h-4 mr-2" />
          {{ t('blog.editPost') }}
        </Button>
        <div v-else class="flex gap-2">
          <Button @click="saveEdit" :disabled="isSaving" variant="default" size="sm">
            <SaveIcon class="w-4 h-4 mr-2" />
            {{ isSaving ? t('system.saving') : t('system.save') }}
          </Button>
          <Button @click="isEditing = false" variant="ghost" size="sm">
            <XIcon class="w-4 h-4 mr-2" />
            {{ t('system.cancel') }}
          </Button>
        </div>
      </div>
    </div>
  
    <hr class="my-4" />
    <p class="text-xs md:text-sm text-muted-foreground mb-4">
      {{ formatDate(post.created_at, locale) }}
      <template v-if="post.updated_at">
        · {{ t('blog.updatedAt') }} {{ formatDateTime(post.updated_at, locale) }}
      </template>
    </p>

    <!-- Tags: view or edit -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <template v-if="!isEditing">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-secondary text-secondary-foreground rounded"
        >
          {{ tag }}
        </span>
        <span
          v-if="post.is_published === false"
          class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border border-amber-500 text-amber-600 dark:text-amber-400 rounded"
        >
          {{ t('blog.draft') }}
        </span>
      </template>
      <template v-else>
        <span
          v-for="(tag, index) in editForm.tags"
          :key="`${tag}-${index}`"
          class="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold pl-2 pr-1 py-0.5 bg-secondary text-secondary-foreground rounded"
        >
          {{ tag }}
          <button
            type="button"
            aria-label="Remove tag"
            class="rounded hover:bg-secondary-foreground/20 p-0.5"
            @click="removeTag(index)"
          >
            <XIcon class="w-3 h-3" />
          </button>
        </span>
        <div class="inline-flex items-center gap-1">
          <input
            v-model="newTag"
            type="text"
            class="h-6 w-24 rounded border border-input bg-background px-2 text-[10px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-ring"
            :placeholder="t('blog.addTag')"
            @keydown.enter.prevent="addTag"
          />
          <Button type="button" variant="ghost" size="sm" class="h-6 w-6 p-0" @click="addTag">
            <PlusIcon class="w-3 h-3" />
          </Button>
        </div>
        <label class="inline-flex items-center gap-2 ml-2 text-sm text-muted-foreground">
          <input
            v-model="editForm.is_published"
            type="checkbox"
            class="rounded border-input text-primary focus:ring-ring"
          />
          {{ t('blog.published') }}
        </label>
      </template>
    </div>

    <div class="mb-4">
      <h1 v-if="!isEditing" class="text-2xl md:text-4xl font-bold tracking-tight">{{ post.title }}</h1>
      <input
        v-else
        v-model="editForm.title"
        class="text-2xl md:text-4xl font-bold tracking-tight w-full bg-transparent border-b border-primary focus:outline-none py-1"
        :placeholder="t('blog.titlePlaceholder')"
      />
    </div>

    <div v-if="isEditing" class="mb-4">
      <label class="block text-sm font-medium text-muted-foreground mb-1">{{ t('blog.excerpt') }}</label>
      <textarea
        v-model="editForm.excerpt"
        rows="2"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        :placeholder="t('blog.excerptPlaceholder')"
      />
    </div>
    <p v-else-if="post.excerpt" class="text-lg text-muted-foreground mb-4">{{ post.excerpt }}</p>

    <div class="mt-12">
      <article 
        v-if="!isEditing"
        class="prose dark:prose-invert prose-headings:font-semibold prose-pre:border max-w-none"
        v-html="marked(post.content ?? '')"
      ></article>

      <div v-else class="animate-in zoom-in-95 duration-200">
        <Editor v-model="editForm.content" />
      </div>
    </div>

  </div>
</template>