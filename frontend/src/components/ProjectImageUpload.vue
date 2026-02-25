<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-vue-next'
import { apiBaseUrl } from '@/config/site'
import { auth } from '@/store/auth'

const { t } = useI18n()
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await axios.post<{ image_url: string }>(
      `${apiBaseUrl}/api/v1/projects/upload`,
      formData,
      { headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {} }
    )
    emit('update:modelValue', data.image_url)
  } catch (err: unknown) {
    console.error(err)
    const msg =
      axios.isAxiosError(err) && err.response?.data?.detail
        ? String(err.response.data.detail)
        : axios.isAxiosError(err) && err.response?.status === 401
          ? t('auth.pleaseLogInAgain')
          : 'Upload failed'
    toast.error(msg)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <div 
      class="relative aspect-video w-full max-w-[50%] overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center group"
    >
      <img v-if="modelValue" :src="modelValue" class="h-full w-full object-cover" />
      
      <div v-else class="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon class="h-8 w-8 opacity-40" />
        <span class="text-xs">{{ t('projects.maxWidthLabel') }}</span>
      </div>

      <div v-if="isUploading" class="absolute inset-0 bg-background/60 flex items-center justify-center">
        <Loader2 class="h-6 w-6 animate-spin" />
      </div>

      <Button 
        v-if="modelValue && !isUploading"
        type="button"
        variant="destructive"
        size="icon"
        class="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        @click="emit('update:modelValue', '')"
      >
        <X class="h-3 w-3" />
      </Button>
    </div>

    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleUpload" />
    
    <Button 
      type="button" 
      variant="outline" 
      class="w-full max-w-[50%] text-xs h-8" 
      :disabled="isUploading"
      @click="fileInput?.click()"
    >
      <Upload class="mr-2 h-3 w-3" />
      {{ modelValue ? t('projects.changeImage') : t('projects.uploadImage') }}
    </Button>
  </div>
</template>