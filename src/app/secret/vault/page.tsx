import type { Metadata } from "next";
import { VaultHero } from "@/components/vault/VaultHero";
import { BookShelf } from "@/components/vault/BookShelf";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <main style={{ background: "#0A0703" }}>
      <VaultHero />
      <BookShelf />
    </main>
  );
}
