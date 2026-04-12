"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";

const EXPERIENCES = [
  {
    id: "exp-1",
    role: "Software Engineering Intern",
    company: "Wealth.com",
    location: "Remote",
    start: "June 2025",
    end: "Present",
    bullets: [
      "Assisted in developing the Family Office Suite, delivering estate-planning solutions to 10,000+ monthly users.",
      "Built and maintained backend GraphQL and REST APIs and managed frontend state using Jotai.",
      "Delivered 40+ production tickets using React, C#, TypeScript, Node.js, AWS, and Docker.",
    ],
    tags: ["JavaScript", "TypeScript", "AWS", "Node.js", "React", "GraphQL", "Docker"],
  },
  {
    id: "exp-2",
    role: "Developer Teaching Assistant",
    company: "Purdue University CS Bridge Program",
    location: "West Lafayette, IN",
    start: "Summer 2025",
    end: "Summer 2025",
    bullets: [
      "Guided 60+ new students through accelerated CS fundamentals, strengthening skills in coding and problem-solving.",
      "Provided individualized guidance on core concepts in object-oriented programming, algorithms, and debugging.",
      "Facilitated daily lab sessions, led lecture reviews, and organized collaborative learning and team-building activities.",
    ],
    tags: ["Teaching", "Algorithms", "OOP", "Problem Solving"],
  },
  {
    id: "org-1",
    role: "Director of Quantitative Development Education",
    company: "Boiler Quantitative Finance Group",
    location: "West Lafayette, IN",
    start: "Fall 2024",
    end: "Present",
    bullets: [
      "Lead weekly educational sessions on quantitative development, covering algorithmic problem solving, competitive programming techniques, and technical interview preparation.",
      "Teach core quantitative topics including options pricing, trading fundamentals, and practical implementation of financial models.",
      "Developed learning materials and mentor members in competitive programming and quantitative finance concepts.",
    ],
    tags: ["Quant Finance", "Options Pricing", "Competitive Programming", "Teaching"],
  },
  {
    id: "org-2",
    role: "Team Lead",
    company: "Purdue University Autonomous Robotics Club",
    location: "West Lafayette, IN",
    start: "Fall 2024",
    end: "Present",
    bullets: [
      "Lead a team of 5 on system design and development using Sphero Robots to simulate polymerization.",
      "Improved and designed an open-source API for control and precision of the Sphero Robots.",
      "Diagnosed and resolved hardware-software inefficiencies for improved performance.",
    ],
    tags: ["Robotics", "System Design", "Python", "Open Source"],
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
