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
        istock: "https://www.istockphoto.com/portfolio/TomSinP",
        email: "mailto:contact@tomsinp.com"
    },
    personal: {
        en: {
            heroTitle: "Tom <span class='text-zinc-500'>SIN</span>",
            heroDescription: "A developer based in Hong Kong. I specialize in building clean, functional websites and web applications from scratch.",
            location: "Hong Kong",
            aboutMe: `
    Full-Stack Web Developer with 2+ years of professional experience, specializing in <strong>Python/Django</strong> backend development and scalable web architectures. I have a proven track record of building complex platforms, from Stripe-integrated corporate systems to interactive communities dedicated to 3D and AIGC. I am proficient in Docker deployment, API integrations, and modern full-stack development practices.
    <br><br>
    I also contributed on-site technical and backend support for <strong>BCON Shenzhen 2025 (IAICC 2025)</strong>, Asia's first Blender Conference, ensuring seamless services for hundreds of international attendees.
    <br><br>
    Beyond core development, I specialize in augmenting web applications with generative AI capabilities. This includes optimizing FLUX.1 and Stable Diffusion models through ComfyUI workflows, and implementing RAG (Retrieval-Augmented Generation) frameworks via Dify to deliver intelligent, context-aware user experiences.
    <br><br>
    Outside of my professional work, I am a passionate photographer and football player.`
        },
        zh: {
            heroTitle: "Tom <span class='text-zinc-500'>SIN</span>",
            heroDescription: "一位來自香港的開發者，擅長於從零開始構建簡潔且實用的網站及網頁應用程式。",
            location: "香港",
            aboutMe: `
    Full-Stack Web Developer，擁有 2 年以上專業經驗，專精於 <strong>Python/Django</strong> 後端開發與可擴展架構。我具備豐富的平台構建經驗，曾開發整合 Stripe 支付系統的企業級平台，以及專為 3D 與 AIGC 愛好者而設的互動社區。我熟練掌握 Docker 部署、API 系統整合及現代全棧開發實踐。
    <br><br>
    我曾參與 <strong>BCON Shenzhen 2025 (IAICC 2025)</strong> 亞洲首屆 Blender 大會的技術架構工作，並在活動期間提供現場後端支援，確保數百名國際與會者的系統運作順暢。
    <br><br>
    在核心開發以外，我擅長為網頁應用引入 Generative AI 技術。這包括透過 ComfyUI 工作流優化 FLUX.1 與 Stable Diffusion 模型，並利用 Dify 實作 RAG（檢索增強生成）架構，為用戶提供更智能、具備語境感知能力的交互體驗。
    <br><br>
    在專業工作之外，我熱衷於攝影和足球。`
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
