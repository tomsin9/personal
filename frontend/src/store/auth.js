import { reactive } from 'vue'
import { toast } from 'vue-sonner'
import { i18n } from '@/i18n'

export const auth = reactive({
  // check if there is an old token in localStorage
  token: localStorage.getItem('admin_token') || null,

  // this computed property is used to do v-if in template
  get isAdmin() {
    return !!this.token
  },

  // after login, call: store token
  login(token) {
    this.token = token
    localStorage.setItem('admin_token', token)
  },

  // after logout, call: clear token and show toast (no redirect)
  logout() {
    this.token = null
    localStorage.removeItem('admin_token')
    const t = i18n.global.t.bind(i18n.global)
    toast.info(t('auth.logoutSuccess'), {
      description: t('auth.logoutSuccessDescription'),
    })
  },
})