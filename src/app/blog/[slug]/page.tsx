import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post
      ? post.title
        ? `${post.title} — Aiden Drepaniotis`
        : "Note — Aiden Drepaniotis"
      : "Blog — Aiden Drepaniotis",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.body);

  return (
    <>
      <PageNavbar />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-16">
        <article className="mx-auto max-w-2xl px-6 md:px-8 pt-12 pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs tracking-wide text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors mb-8"
          >
            <ArrowLeft size={13} /> All entries
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-accent-red-dim)] text-[var(--color-accent-red)]">
              {post.category}
            </span>
            {post.date && (
              <span className="text-xs text-[var(--color-text-muted)] tracking-wide">
                {formatDate(post.date)}
              </span>
            )}
          </div>

          {post.title && (
            <h1 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)] mb-8 leading-tight">
              {post.title}
            </h1>
          )}

          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
