"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { SectionWrapper } from "@/components/layout/section-wrapper";

const STATS = [
  { value: "40+", label: "Tickets shipped" },
  { value: "60+", label: "Students mentored" },
  { value: "∞",   label: "Tabs open", isInfinity: true },
];

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
          </div>
        </FadeIn>
      </div>

      {/* Stats — centered, figures front and center */}
      <FadeIn direction="up" delay={0.2}>
        <div className="content-panel mt-16 px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && (
                  <div className="hidden sm:block w-px h-14 bg-[var(--color-border)] mx-10 md:mx-14" />
                )}
                <div className="text-center">
                  <p
                    className={
                      stat.isInfinity
                        ? "text-6xl md:text-7xl font-light leading-none text-[var(--color-accent-red)] text-glow-red"
                        : "text-4xl md:text-5xl font-light leading-none text-[var(--color-text-primary)]"
                    }
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] tracking-[0.2em] uppercase mt-3">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
