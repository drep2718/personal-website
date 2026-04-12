"use client";

import { Download } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { RESUME_DATA, CERTIFICATIONS, type ResumeEntry } from "@/data/resume-data";
import { cn } from "@/lib/utils";

function formatPeriod(start: string, end: string | null) {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    return `${new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short" })} ${y}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

function TimelineEntry({ entry, accentClass }: { entry: ResumeEntry; accentClass: string }) {
  const isCurrent = entry.endDate === null;
  return (
    <div className="relative pl-6">
      {/* Dot */}
      <div
        className={cn(
          "absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 -translate-x-[5px]",
          isCurrent
            ? "bg-[var(--color-accent-red)] border-[var(--color-accent-red)]"
            : "bg-[var(--color-bg-primary)] border-[var(--color-border-highlight)]"
        )}
      />
      <p className="text-xs text-[var(--color-text-muted)] mb-1 tracking-wide">
        {formatPeriod(entry.startDate, entry.endDate)}
        <span className="ml-2 text-[var(--color-text-muted)] opacity-60">{entry.location}</span>
      </p>
      <h4 className="text-base font-semibold text-[var(--color-text-primary)] leading-snug">
        {entry.title}
      </h4>
      <p className={cn("text-sm font-medium mb-2", accentClass)}>
        {entry.organization}
      </p>
      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <span className="text-[var(--color-accent-red)] flex-shrink-0 mt-0.5">–</span>
              {b}
            </li>
          ))}
        </ul>
      )}
      {entry.tags && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-6 pb-2 border-b border-[var(--color-border)]">
        {title}
      </h3>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border)]" />
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Resume() {
  const experience  = RESUME_DATA.filter((e) => e.type === "experience");
  const education   = RESUME_DATA.filter((e) => e.type === "education");
  const leadership  = RESUME_DATA.filter((e) => e.type === "leadership");

  return (
    <SectionWrapper id="resume">
      {/* Header + download */}
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
            download="Aiden_Drepaniotis_Resume.pdf"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent-red)] hover:text-[var(--color-accent-red)] transition-colors"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
      </FadeIn>

      <div className="space-y-14">
        {/* Experience + Education — two columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <FadeIn direction="right" delay={0.1}>
            <Section title="Experience">
              {experience.map((entry, i) => (
                <FadeIn key={entry.id} direction="up" delay={0.1 + i * 0.08}>
                  <TimelineEntry entry={entry} accentClass="text-[var(--color-accent-red)]" />
                </FadeIn>
              ))}
            </Section>
          </FadeIn>

          <FadeIn direction="left" delay={0.15}>
            <Section title="Education">
              {education.map((entry, i) => (
                <FadeIn key={entry.id} direction="up" delay={0.15 + i * 0.08}>
                  <TimelineEntry entry={entry} accentClass="text-[var(--color-accent-blue)]" />
                </FadeIn>
              ))}
            </Section>
          </FadeIn>
        </div>

        {/* Leadership — full width */}
        <FadeIn direction="up" delay={0.2}>
          <Section title="Organizations &amp; Leadership">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadership.map((entry, i) => (
                <FadeIn key={entry.id} direction="up" delay={0.2 + i * 0.08}>
                  <TimelineEntry entry={entry} accentClass="text-[var(--color-accent-red)]" />
                </FadeIn>
              ))}
            </div>
          </Section>
        </FadeIn>

        {/* Certifications — full width */}
        <FadeIn direction="up" delay={0.3}>
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-muted)] mb-6 pb-2 border-b border-[var(--color-border)]">
              Certifications
            </h3>
            <div className="flex flex-wrap gap-3">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--color-accent-red)]"
                    style={{ boxShadow: "0 0 6px rgba(196,30,58,0.5)" }}
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{cert.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
