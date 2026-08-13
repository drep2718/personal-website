import type { Metadata } from "next";
import Link from "next/link";
import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { getPostsByCategory, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Aiden Drepaniotis",
  description: "Coffee, code, climbing, and whatever else I'm thinking about.",
};

export default function BlogPage() {
  const groups = getPostsByCategory();
  const hasPosts = groups.length > 0;

  return (
    <>
      <PageNavbar />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-16">
        <div className="mx-auto max-w-3xl px-6 md:px-8 pt-12 pb-24">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
              Notes &amp; tangents
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-[var(--color-text-primary)]">
              The Journal
            </h1>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Coffee, code, climbing, and whatever else I&apos;m thinking about.
            </p>
          </div>

          {hasPosts ? (
            <div className="space-y-14">
              {groups.map((group) => (
                <section key={group.category}>
                  <h2 className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-5 pb-2 border-b border-[var(--color-border)]">
                    {group.category}
                  </h2>
                  <div className="space-y-4">
                    {group.posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block content-panel p-6 hover:border-[var(--color-border-highlight)] transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <h3 className="text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-red)] transition-colors">
                            {post.title}
                          </h3>
                          {post.date && (
                            <span className="flex-shrink-0 text-xs text-[var(--color-text-muted)] tracking-wide">
                              {formatDate(post.date)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          {post.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="content-panel text-center px-8 py-16 max-w-xl mx-auto">
              <p className="text-4xl mb-4">✍️</p>
              <p className="text-[var(--color-text-primary)] font-medium mb-2">No entries yet</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Add a markdown file to{" "}
                <code className="text-[var(--color-accent-red)]">content/blog/</code> — or write one
                in the composer.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
