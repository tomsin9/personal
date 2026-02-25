<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ProjectImageUpload from '@/components/ProjectImageUpload.vue'
import { Plus, X } from 'lucide-vue-next'
import { apiBaseUrl } from '@/config/site'
import { auth } from '@/store/auth'

import type { Project } from '@/types/project'

type ProjectFormData = {
  id?: number
  title: string
  description: string
  category: string
  image: string
  tags: string[]
  github_url: string
  live_url: string
  order: string
}

const { t } = useI18n()
const props = defineProps<{
  project: Project | null
  open: boolean
}>()
const emit = defineEmits(['close', 'saved'])

const emptyForm = (): ProjectFormData => ({
  title: '',
  description: '',
  category: 'Web',
  image: '',
  tags: [],
  github_url: '',
  live_url: '',
  order: '0'
})

const toFormData = (p: Project): ProjectFormData => ({
  id: p.id,
  title: p.title ?? '',
  description: p.description ?? '',
  category: p.category ?? 'Web',
  image: p.image ?? '',
  tags: p.tags ?? [],
  github_url: p.github_url ?? '',
  live_url: p.live_url ?? '',
  order: p.order ?? '0'
})

const formData = ref<ProjectFormData>(props.project ? toFormData(props.project) : emptyForm())

watch(() => props.project, (newVal) => {
  formData.value = newVal ? toFormData(newVal) : emptyForm()
}, { immediate: true })

const isCreateMode = computed(() => formData.value.id == null || formData.value.id === undefined)
const isSaving = ref(false)
const newTag = ref('')

const addTag = () => {
  const tag = newTag.value.trim()
  if (!tag) return
  if (formData.value.tags.includes(tag)) {
    newTag.value = ''
    return
  }
  formData.value.tags.push(tag)
  newTag.value = ''
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handleSubmit = async () => {
  isSaving.value = true
  try {
    const payload = {
      title: formData.value.title ?? '',
      description: formData.value.description ?? '',
      category: formData.value.category ?? 'Web',
      image: formData.value.image || null,
      tags: formData.value.tags ?? [],
      github_url: formData.value.github_url || null,
      live_url: formData.value.live_url || null,
      order: String(formData.value.order ?? '0')
    }
    if (isCreateMode.value) {
      await axios.post(
        `${apiBaseUrl}/api/v1/projects/`,
        payload,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      toast.success(t('projects.createSuccess'))
    } else {
      await axios.patch(
        `${apiBaseUrl}/api/v1/projects/${formData.value.id}`,
        payload,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      toast.success(t('projects.updateSuccess'))
    }
    emit('saved')
    emit('close')
  } catch (err: unknown) {
    console.error(err)
    const msg =
      axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : axios.isAxiosError(err) && err.response?.status === 401
          ? t('auth.pleaseLogInAgain')
          : isCreateMode.value
            ? 'Failed to create project'
            : 'Failed to update project'
    toast.error(msg)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="max-w-[425px] md:max-w-[600px] h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ isCreateMode ? t('projects.addProject') : t('projects.editProject') }}</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <Label for="title">{{ t('projects.titleLabel') }}</Label>
          <Input id="title" v-model="formData.title" />
        </div>

        <div class="space-y-2">
          <Label for="desc">{{ t('projects.descriptionLabel') }}</Label>
          <Textarea id="desc" v-model="formData.description" class="h-20" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="category">{{ t('projects.categoryLabel') }}</Label>
            <Input id="category" v-model="formData.category" />
          </div>
          <div class="space-y-2">
            <Label for="order">{{ t('projects.orderLabel') }}</Label>
            <Input id="order" v-model="formData.order" type="number" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="tags">{{ t('projects.tagsLabel') }}</Label>
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-for="(tag, index) in formData.tags"
              :key="`${tag}-${index}`"
              class="inline-flex items-center gap-1 text-[10px] pl-2 pr-1 py-0.5 bg-secondary text-secondary-foreground rounded"
            >
              {{ tag }}
              <button
                type="button"
                :aria-label="t('projects.removeTag')"
                class="rounded hover:bg-secondary-foreground/20 p-0.5"
                @click="removeTag(index)"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
            <div class="inline-flex items-center gap-1">
              <Input
                v-model="newTag"
                type="text"
                class="h-7 w-28 text-[10px] uppercase tracking-widest"
                :placeholder="t('projects.addTag')"
                @keydown.enter.prevent="addTag"
              />
              <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="addTag">
                <Plus class="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <Label>{{ t('projects.coverImageLabel') }}</Label>
          <ProjectImageUpload v-model="formData.image" />
        </div>
      </div>

      <DialogFooter>
        <Button @click="handleSubmit" :disabled="isSaving">
          {{ isCreateMode ? t('projects.addProject') : t('projects.saveChanges') }}
        </Button>
        <Button variant="ghost" @click="emit('close')">{{ t('system.cancel') }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>