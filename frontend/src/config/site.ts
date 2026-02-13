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
    keywords: "Tom Sin, Full-Stack Web Developer, Django, Vue.js, Python, web development, portfolio",
    description: "Tom Sin is a full-stack web developer specializing in modern web technologies. Explore my portfolio, blog, and projects.",
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
            heroTitle: "Tom <span class='text-zinc-500'>SIN</span>",
            heroDescription: "A developer based in Hong Kong. I specialize in building clean, functional websites and web applications from scratch.",
            location: "Hong Kong",
            aboutMe: "Full-Stack Web Developer with 2+ years of professional experience specializing in Python/Django backend development and full-stack web applications. Proven track record building scalable platforms including corporate websites, event management systems with Stripe payment integration, job portals, and interactive 3D/AI community sites. Led backend development and provided on-site technical support for BCON Shenzhen 2025 and IAICC 2025, Asia's first Blender Conference serving hundreds of international attendees. Proficient in Docker deployment, API integrations, and cutting-edge AI generative tools (Stable Diffusion, FLUX.1, ComfyUI, RAG).<br><br>Outside of my professional work, I am passionate about photography and football."
        },
        zh: {
            heroTitle: "Tom <span class='text-zinc-500'>SIN</span>",
            heroDescription: "一位來自香港的開發者，擅長於從零開始構建簡潔且實用的網站及網頁應用程式。",
            location: "香港",
            aboutMe: "全端網站開發人員，擁有兩年以上專業經驗，專注於 Python/Django 後端開發及全端網站應用建構。具備豐富實績，曾開發可擴展的平台，包括企業網站、結合 Stripe 支付功能的活動管理系統、求職平台，以及具互動性的 3D／AI 社群網站。曾主導後端開發並為亞洲首個 Blender 官方大會－深圳 BCON 2025 暨 國際人工智能及創意大會 IAICC 2025 提供現場技術支援，這兩項活動共吸引數百名國際參與者。熟練掌握 Docker 部署、API 整合，以及各類先進 AI 生成工具（如 Stable Diffusion、FLUX.1、ComfyUI、RAG）。<br><br>工作以外，我熱衷於攝影及足球。"
        }
    },
    /** Skill groups: key used for i18n (skills.groups.<key>), skills = comma-separated list */
    skills: [
        { key: 'frontend', skills: 'Vue.js, TypeScript, Tailwind CSS, Bootstrap' },
        { key: 'backend', skills: 'Python, Django (DRF), FastAPI, PostgreSQL' },
        { key: 'devops', skills: 'Docker, Git, CI/CD Pipelines' },
        { key: 'aiWorkflow', skills: 'Dify, ComfyUI, SD WebUI' },
        { key: 'design', skills: 'Photoshop, Illustrator, Lightroom, InDesign' },
    ],
}
