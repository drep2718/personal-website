"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { NAV_PAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PageNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Background is always on — some pages don't scroll, and copy must never
          sit directly on the animated backdrops */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 md:px-8 h-16">
          {/* Back to home */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-semibold tracking-tight text-lg text-[var(--color-text-primary)]">
              AD
            </span>
          </button>

          {/* Desktop page links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_PAGES.map((page) => (
              <li key={page.id}>
                <button
                  onClick={() => router.push(page.path)}
                  className={cn(
                    "text-sm tracking-wide transition-colors duration-200",
                    pathname === page.path
                      ? "text-[var(--color-accent-red)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {page.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md"
          >
            <ul className="flex flex-col py-4">
              {NAV_PAGES.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => { setMenuOpen(false); router.push(page.path); }}
                    className={cn(
                      "w-full text-left px-6 py-3 text-sm transition-colors",
                      pathname === page.path
                        ? "text-[var(--color-accent-red)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    {page.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
