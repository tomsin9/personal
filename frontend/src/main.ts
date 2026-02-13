import { createApp, watch } from 'vue'
import App from './App.vue'
import router, { setDocumentTitle } from './router'
import { i18n } from './i18n'
import { initGoogleAnalytics } from './lib/analytics'
import 'vue-sonner/style.css'
import './style.css'

initGoogleAnalytics()

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')