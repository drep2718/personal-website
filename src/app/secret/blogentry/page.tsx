import type { Metadata } from "next";
import { SecretHeader } from "@/components/secret/SecretHeader";
import { BlogComposer } from "@/components/secret/BlogComposer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Composer — Aiden Drepaniotis",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default function BlogEntryPage() {
  const posts = getAllPosts();
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <SecretHeader crumb="Composer" />
      <BlogComposer posts={posts} />
    </main>
  );
}
