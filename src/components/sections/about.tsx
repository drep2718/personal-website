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

        {/* Bio — panel keeps the copy legible over the animated backdrop */}
        <FadeIn direction="left" delay={0.1}>
          <div className="content-panel p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-4">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)] mb-6">
              Builder. Thinker.{" "}
              <span className="gradient-text-accent">Perpetually curious.</span>
            </h2>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                Hey, I&apos;m Aiden — a Computer Science &amp; Mathematics student at
                Purdue. Mostly I just like building things and figuring out how they work.
              </p>
              <p>
                A lot of what I&apos;m into lives around computer science, hardware, quant
                finance, and robotics — anything that&apos;s a little tricky and lets me
                learn something along the way.
              </p>
              <p>
                When I&apos;m away from a screen you&apos;ll usually find me with a good
                book or on a climbing wall. I read a lot, I climb whenever I can, and
                I&apos;m always chasing whatever catches my curiosity next.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
