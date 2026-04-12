"use client";

import { Download } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { RESUME_DATA } from "@/data/resume-data";
import { cn } from "@/lib/utils";

function formatPeriod(start: string, end: string | null) {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    return `${new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short" })} ${y}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function Resume() {
  const experience = RESUME_DATA.filter((e) => e.type === "experience");
  const education = RESUME_DATA.filter((e) => e.type === "education");

  return (
    <SectionWrapper id="resume">
      <FadeIn direction="up">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
              Background
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
              Résumé
            </h2>
          </div>
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-highlight)] transition-colors"
          >
            <Download size={14} /> PDF
          </a>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Experience */}
        <FadeIn direction="right" delay={0.1}>
          <h3 className="text-sm tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-8">
            Experience
          </h3>
          <div className="relative">
            {/* Timeline spine */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-border)]" />

            <div className="space-y-8 pl-6">
              {experience.map((entry, i) => (
                <FadeIn key={entry.id} direction="up" delay={0.1 + i * 0.1}>
                  <div className="relative">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute -left-[25px] top-1.5 w-2 h-2 rounded-full border",
                        entry.endDate === null
                          ? "bg-[var(--color-accent-red)] border-[var(--color-accent-red)]"
                          : "bg-[var(--color-bg-primary)] border-[var(--color-border-highlight)]"
                      )}
                    />
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                      {formatPeriod(entry.startDate, entry.endDate)}
                    </p>
                    <h4 className="text-base font-medium text-[var(--color-text-primary)]">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-[var(--color-accent-red)] mb-2">
                      {entry.organization}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {entry.description}
                    </p>
                    {entry.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Education */}
        <FadeIn direction="left" delay={0.2}>
          <h3 className="text-sm tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-8">
            Education
          </h3>
          <div className="relative">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-border)]" />
            <div className="space-y-8 pl-6">
              {education.map((entry, i) => (
                <FadeIn key={entry.id} direction="up" delay={0.2 + i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full border bg-[var(--color-bg-primary)] border-[var(--color-border-highlight)]" />
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                      {formatPeriod(entry.startDate, entry.endDate)}
                    </p>
                    <h4 className="text-base font-medium text-[var(--color-text-primary)]">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-[var(--color-accent-blue)] mb-2">
                      {entry.organization}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
