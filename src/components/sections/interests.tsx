"use client";

import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren, staggerItem } from "@/components/animations/stagger-children";
import { INTERESTS } from "@/data/interests";
import { motion } from "framer-motion";

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
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTERESTS.map((interest) => (
          <motion.div
            key={interest.id}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 hover:border-[var(--color-border-highlight)] transition-colors"
          >
            <span className="text-2xl mb-3 block">{interest.emoji}</span>
            <h3 className="text-base font-medium text-[var(--color-text-primary)] mb-2">
              {interest.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {interest.description}
            </p>
          </motion.div>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
