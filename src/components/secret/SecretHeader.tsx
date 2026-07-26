import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SecretHeader({ crumb }: { crumb?: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 md:px-8 h-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span className="font-semibold tracking-tight text-lg text-[var(--color-text-primary)]">AD</span>
        </Link>
        {crumb && (
          <span className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-muted)]">
            {crumb}
          </span>
        )}
      </nav>
    </header>
  );
}
