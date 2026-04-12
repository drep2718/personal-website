"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";

const EXPERIENCES = [
  {
    id: "exp-1",
    role: "Software Engineer",
    company: "Company Name",
    location: "City, State",
    start: "Jan 2024",
    end: "Present",
    bullets: [
      "Built and shipped features used by thousands of users.",
      "Collaborated with cross-functional teams to define and implement product requirements.",
      "Improved system performance by optimizing critical data pipelines.",
    ],
    tags: ["TypeScript", "React", "Node.js"],
  },
  {
    id: "exp-2",
    role: "Software Engineer Intern",
    company: "Company Name",
    location: "City, State",
    start: "May 2023",
    end: "Aug 2023",
    bullets: [
      "Developed internal tooling that reduced manual workflows by 40%.",
      "Wrote unit and integration tests that increased code coverage across the team.",
      "Presented technical findings to engineering leadership.",
    ],
    tags: ["Python", "AWS", "PostgreSQL"],
  },
] as const;

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <FadeIn direction="up">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Career
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Experience
          </h2>
        </div>
      </FadeIn>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-border)] hidden md:block" />

        <div className="space-y-12">
          {EXPERIENCES.map((exp, i) => (
            <FadeIn key={exp.id} direction="up" delay={i * 0.1}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="md:pl-10 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-4.5px] top-2 w-2.5 h-2.5 rounded-full bg-[var(--color-accent-red)] hidden md:block" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-[var(--color-accent-red)] font-medium mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[var(--color-text-muted)] tracking-wide">
                      {exp.start} — {exp.end}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {exp.location}
                    </p>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      <span className="text-[var(--color-accent-red)] flex-shrink-0 mt-0.5">–</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
