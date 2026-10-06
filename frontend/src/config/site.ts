// src/config/site.ts

/** API base URL (no trailing slash). Empty = same origin (nginx proxy in production). */
const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
const raw = env?.VITE_API_URL

export const apiBaseUrl =
  raw !== undefined && raw !== "" 
    ? raw 
    : (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? "http://127.0.0.1:8000" 
        : ""); // Production environment forces empty string, uses relative path

export const siteConfig = {
    siteUrl: "https://tomsinp.com",
    siteTitle: "Tom Sin - Full-Stack Web Developer",
    author: "Tom SIN",
    keywords: "Tom Sin, Full-Stack Web Developer, Django, Vue.js, Python, Stripe, Docker, Hong Kong",
    description: "Hong Kong full-stack developer. Django + Vue, Stripe, Docker. Built production platforms and on-site backend for BCON Shenzhen 2025.",
    ogImage: "/sin/og-image-square.png",
    aboutMeImage: "/sin/about-me/portrait.png",
    socials: {
        github: "https://github.com/tomsin9/",
        linkedin: "https://linkedin.com/in/tom-sin/",
        instagram: "https://instagram.com/sinp9_",
        email: "mailto:contact@tomsinp.com"
    },
    personal: {
        en: {
            heroTitle: "Tom <span class='text-muted-foreground'>SIN</span>",
            heroDescription: "A developer based in Hong Kong. I specialize in building clean, functional websites and web applications from scratch.",
            location: "Hong Kong",
            role: "Full-stack · Django / Vue",
            aboutFacts: [
                "3+ years shipping production web apps: Python/Django backends, Vue frontends, Docker deploys, API integrations.",
                "On-site backend for BCON Shenzhen 2025 (IAICC 2025), Asia’s first Blender Conference — hundreds of international attendees.",
                "Built a self-hosted AI studio on in-house servers, wired to the ComfyUI API: SSO login, credit deduction, and a queuing system — covering LLM chat, video, image and audio generation, TTS, and STT.",
                "Built Stripe-integrated business platforms and community products for 3D / AIGC.",
            ],
        },
        zh: {
            heroTitle: "Tom <span class='text-muted-foreground'>SIN</span>",
            heroDescription: "一位來自香港的開發者，擅長於從零開始構建簡潔且實用的網站及網頁應用程式。",
            location: "香港",
            role: "全端 · Django / Vue",
            aboutFacts: [
                "3+ 年交付線上系統：Python/Django 後端、Vue 前端、Docker 部署、API 整合。",
                "BCON Shenzhen 2025（IAICC 2025）亞洲首屆 Blender 大會：現場後端支援，服務數百名國際與會者。",
                "曾在內部伺服器建立 AI Studio，並接駁 ComfyUI API：單一登入（SSO）、扣除 credit 及排隊機制；涵蓋 LLM chat、video & image & audio 生成、TTS 及 STT。",
                "曾開發整合 Stripe 收款的企業平台，以及 3D／AIGC 社群產品。",
            ],
        }
    },
    /** Skill groups: key used for i18n (skills.groups.<key>), skills = comma-separated list */
    skills: [
        { key: 'frontend', skills: 'Vue.js, Next.js, TypeScript, Tailwind CSS, Bootstrap' },
        { key: 'backend', skills: 'Python, Django, FastAPI, PostgreSQL' },
        { key: 'devops', skills: 'Docker, Git, CI/CD Pipelines' },
        { key: 'aiWorkflow', skills: 'ComfyUI, Cursor, LiteLLM, Open WebUI' },
        { key: 'design', skills: 'Photoshop, Illustrator, Lightroom, InDesign' },
    ],
}
