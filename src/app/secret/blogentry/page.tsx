import type { Metadata } from "next";
import { SecretHeader } from "@/components/secret/SecretHeader";
import { BlogComposer } from "@/components/secret/BlogComposer";

export const metadata: Metadata = {
  title: "Composer — Aiden Drepaniotis",
  robots: { index: false, follow: false, nocache: true },
};

export default function BlogEntryPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <SecretHeader crumb="Composer" />
      <BlogComposer />
    </main>
  );
}
