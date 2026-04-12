export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: number; // minutes
  url?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Building Interactive Canvas Animations with TypeScript",
    excerpt: "A deep dive into Canvas2D API — how I built the black hole effect on this site from scratch.",
    date: "2024-12-01",
    category: "Engineering",
    readTime: 8,
  },
  {
    id: "post-2",
    title: "Why I Switched to Rust for Performance-Critical Services",
    excerpt: "After rewriting a Python service in Rust, latency dropped 10x. Here's the full story.",
    date: "2024-10-15",
    category: "Engineering",
    readTime: 12,
  },
  {
    id: "post-3",
    title: "The Minimal Tech Stack",
    excerpt: "Fighting the urge to over-engineer. Choosing boring technology on purpose and loving it.",
    date: "2024-09-03",
    category: "Philosophy",
    readTime: 5,
  },
];
