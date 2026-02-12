<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { auth } from '@/store/auth'
  import { useRouter } from 'vue-router'
  import { apiBaseUrl } from '@/config/site'
  import { toast } from 'vue-sonner'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  
  const username = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const router = useRouter()

  const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      // OAuth2 expects application/x-www-form-urlencoded
      const params = new URLSearchParams()
      params.set('username', username.value)
      params.set('password', password.value)

      const res = await axios.post(`${apiBaseUrl || ''}/api/v1/login/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      auth.login(res.data.access_token)

      toast.success(t('auth.loginSuccess'), {
        description: t('auth.loginSuccessDescription'),
        })

      router.push('/')
    } catch (err) {
      const detail = err.response?.data?.detail
      const status = err.response?.status
      let msg
      if (status === 401 || status === 400) {
        msg = t('auth.incorrectUsernameOrPassword')
      } else if (typeof detail === 'string') {
        msg = detail.toLowerCase().includes('password') || detail.toLowerCase().includes('username')
          ? t('auth.incorrectUsernameOrPassword')
          : detail
      } else if (Array.isArray(detail)) {
        msg = detail.map((d) => d.msg).filter(Boolean).join(', ') || t('auth.loginFailed')
      } else {
        msg = err.response ? t('auth.loginFailed') : t('auth.loginFailedDescription')
      }
      errorMessage.value = msg

      toast.error(t('auth.loginFailed'), {
        description: msg,
      })
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div class="w-full max-w-md space-y-8">
        <div class="rounded-xl border border-border bg-card p-8 shadow-lg">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight text-foreground">{{ t('auth.adminLogin') }}</h1>
            <p v-if="errorMessage" class="text-sm text-destructive">
              {{ errorMessage }}
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="username" class="text-sm font-medium leading-none text-foreground">{{ t('auth.username') }}</label>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  required
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
  
              <div class="space-y-2">
                <label for="password" class="text-sm font-medium leading-none text-foreground">{{ t('auth.password') }}</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
  
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
            >
              <span v-if="isLoading">{{ t('auth.loggingIn') }}</span>
              <span v-else>{{ t('auth.login') }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
</template>