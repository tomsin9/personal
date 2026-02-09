export interface Project {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    tags: string[];
    github_url?: string;
    live_url?: string;
    updated_at: string;
    order: string;
}