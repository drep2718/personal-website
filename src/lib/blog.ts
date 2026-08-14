import fs from "fs";
import path from "path";
export { formatDate } from "./date";

// Blog posts are plain markdown files in /content/blog with simple frontmatter:
//
//   ---
//   title: Dialing in the perfect shot
//   date: 2026-07-20
//   category: Coffee
//   excerpt: A short one-line teaser.
//   ---
//   Body goes here in markdown...
//
// Drop a new .md file in that folder, commit, and it shows up on /blog.

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, body: normalized };
  }
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) {
    return { data: {}, body: normalized };
  }
  const fm = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n+/, "");
  const data: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return { data, body };
}

export function getAllPosts(): BlogPost[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR);
  } catch {
    return [];
  }
  const posts = files
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md" && !f.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/i, "");
      const excerpt =
        data.excerpt ||
        body
          .replace(/[#>*_`\-]/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 150);
      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        category: data.category || "Uncategorized",
        excerpt,
        body,
      };
    });
  // Newest first by date, then by slug as a tiebreaker
  posts.sort((a, b) => (a.date === b.date ? b.slug.localeCompare(a.slug) : a.date < b.date ? 1 : -1));
  return posts;
}

export function getPost(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export interface CategoryGroup {
  category: string;
  posts: BlogPost[];
}

export function getPostsByCategory(): CategoryGroup[] {
  const groups = new Map<string, BlogPost[]>();
  for (const post of getAllPosts()) {
    const list = groups.get(post.category) ?? [];
    list.push(post);
    groups.set(post.category, list);
  }
  return [...groups.entries()]
    .map(([category, posts]) => ({ category, posts }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
