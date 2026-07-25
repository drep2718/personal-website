"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren, staggerItem } from "@/components/animations/stagger-children";
import { INTERESTS, type Interest } from "@/data/interests";
import { cn } from "@/lib/utils";

function InterestCard({ interest }: { interest: Interest }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-border-highlight)] transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`interest-${interest.id}`}
        className="w-full text-left p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-2xl mb-3 block">{interest.emoji}</span>
          <ChevronDown
            size={16}
            className={cn(
              "mt-1 flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-300",
              open && "rotate-180 text-[var(--color-accent-red)]"
            )}
          />
        </div>
        <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-2">
          {interest.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {interest.tagline}
        </p>
        <span className="mt-3 block text-[11px] tracking-[0.18em] uppercase text-[var(--color-text-muted)]">
          {open ? "Show less" : "Read more"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`interest-${interest.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-4 space-y-3 border-t border-[var(--color-border)]">
              {interest.details.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              {interest.link && (
                <Link
                  href={interest.link.href}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent-red)] hover:gap-2.5 transition-all"
                >
                  {interest.link.label} <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Interests() {
  return (
    <SectionWrapper id="interests">
      <FadeIn direction="up">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Beyond Code
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Interests
          </h2>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            Click a card to read the full story.
          </p>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {INTERESTS.map((interest) => (
          <InterestCard key={interest.id} interest={interest} />
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
