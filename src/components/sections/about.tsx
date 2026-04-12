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
                I&apos;m a Computer Science &amp; Mathematics student at Purdue University,
                building at the intersection of systems, machine learning, and quantitative
                finance. I care about craft — both in the code I write and the problems I choose to solve.
              </p>
              <p>
                Currently interning at Wealth.com, where I ship full-stack features for
                estate-planning tools used by 10,000+ monthly users. Outside of work I lead
                quant education at Boiler Quant Finance and a robotics team at Purdue&apos;s
                Autonomous Robotics Club.
              </p>
              <p>
                I gravitate toward hard problems — from FPGA hardware acceleration and
                real-time arbitrage engines to neural network-based computer vision. If
                it runs fast or thinks for itself, I&apos;m interested.
              </p>
            </div>

            <div className="mt-8 flex gap-6">
              <div>
                <p className="text-2xl font-light text-[var(--color-text-primary)]">40+</p>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide mt-1">Tickets shipped</p>
              </div>
              <div className="w-px bg-[var(--color-border)]" />
              <div>
                <p className="text-2xl font-light text-[var(--color-text-primary)]">60+</p>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide mt-1">Students mentored</p>
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
