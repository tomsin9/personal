<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="max-w-[600px] w-full text-center">
      <div class="p-8">
        <div class="text-6xl md:text-9xl font-bold leading-none text-foreground mb-4">404</div>
        <h1 class="text-2xl md:text-4xl font-semibold mb-4 text-foreground">{{ t('errors.notFound.title') }}</h1>
        <p class="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">{{ t('errors.notFound.message') }}</p>
        <div class="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
          <Button as-child class="w-full md:w-auto">
            <router-link to="/">{{ t('system.backToHome') }}</router-link>
          </Button>
          <button
            type="button"
            :class="cn(buttonVariants({ variant: 'outline' }), 'w-full md:w-auto')"
            @click="goBack"
          >
            {{ t('errors.goBack') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
