import type { Metadata } from "next";
import { VaultHero } from "@/components/vault/VaultHero";
import { VaultLibrary } from "@/components/vault/VaultLibrary";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <main style={{ background: "#0C0906" }}>
      <VaultHero />
      <VaultLibrary />
    </main>
  );
}
