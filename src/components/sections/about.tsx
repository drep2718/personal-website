"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export function About() {
  return (
    <SectionWrapper id="about">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Photo placeholder */}
        <FadeIn direction="right">
          <div className="relative mx-auto md:mx-0 w-64 h-64 md:w-80 md:h-80">
            <div
              className="absolute inset-0 rounded-2xl border border-[var(--color-border)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg-elevated) 100%)",
              }}
            />
            {/* Glow corner accent */}
            <div
              className="absolute -top-px -left-px w-16 h-16 rounded-tl-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-red) 0%, transparent 70%)",
                opacity: 0.3,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-[var(--color-text-muted)]">AD</span>
            </div>
          </div>
        </FadeIn>

        {/* Bio */}
        <FadeIn direction="left" delay={0.1}>
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-4">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)] mb-6">
              Builder. Thinker.{" "}
              <span className="gradient-text-accent">Perpetually curious.</span>
            </h2>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                I&apos;m a software engineer who cares deeply about craft — both in the
                code I write and the experiences I build. I work at the intersection
                of performance, design, and elegant problem-solving.
              </p>
              <p>
                When I&apos;m not shipping features, I&apos;m exploring the edges of what&apos;s
                possible: experimenting with generative visuals, optimizing systems
                until they feel frictionless, and chasing that rare moment when
                something just <em>works.</em>
              </p>
              <p>
                Based wherever my laptop is. Currently drinking too much coffee and
                building in public.
              </p>
            </div>

            <div className="mt-8 flex gap-6">
              <div>
                <p className="text-2xl font-light text-[var(--color-text-primary)]">4+</p>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide mt-1">Years building</p>
              </div>
              <div className="w-px bg-[var(--color-border)]" />
              <div>
                <p className="text-2xl font-light text-[var(--color-text-primary)]">20+</p>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide mt-1">Projects shipped</p>
              </div>
              <div className="w-px bg-[var(--color-border)]" />
              <div>
                <p className="text-2xl font-light text-[var(--color-text-primary)]">∞</p>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide mt-1">Tabs open</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
