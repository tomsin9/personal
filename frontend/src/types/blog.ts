export interface Post {
    id: number
    title: string
    excerpt: string
    content?: string
    tags: string[]
    is_published?: boolean
    created_at?: string
    updated_at?: string
}