import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { trackPageView } from '@/lib/analytics'
import { siteConfig } from '@/config/site'
import { i18n } from '@/i18n'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/AdminLogin.vue'
import BlogView from '../views/BlogView.vue'
import PostDetail from '../views/PostDetail.vue'
import PostCreate from '../views/PostCreate.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/secret/login', name: 'admin-login', component: AdminLogin },
    { path: '/blog', name: 'post-list', component: BlogView, meta: { titleKey: 'navbar.blog' } },
    { path: '/blog/post/new', name: 'post-create', component: PostCreate },
    { path: '/blog/post/:id', name: 'post-detail', component: PostDetail, props: true, meta: { title: 'Post' } },
    { path: '/404', name: 'not-found', component: NotFound },
    { path: '/:pathMatch(.*)*', name: 'catch-all', redirect: '/404' }
]

/** Set document.title from route meta. Use titleKey (i18n key) or title (static string). */
export function setDocumentTitle(to: RouteLocationNormalizedLoaded): void {
    const key = to.meta.titleKey as string | undefined
    const prefix = key ? i18n.global.t(key) : ((to.meta.title as string) ?? '')
    document.title = prefix ? `${prefix} | ${siteConfig.siteTitle}` : siteConfig.siteTitle
}

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.afterEach((to) => {
    trackPageView(to.fullPath)
    setDocumentTitle(to)
})

export default router