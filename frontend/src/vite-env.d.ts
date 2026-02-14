/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '@/store/auth';
declare module '@/i18n';
declare module './i18n';
declare module 'vue-seasons-falling';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_TURNSTILE_SITEKEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
