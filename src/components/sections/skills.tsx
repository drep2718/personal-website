"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { SKILLS } from "@/data/skills";

interface OrbitProps {
  skills: typeof SKILLS;
  level: 1 | 2 | 3;
  radius: number;
  duration: number;
  reverse?: boolean;
}

function OrbitRing({ skills, level, radius, duration, reverse = false }: OrbitProps) {
  const filtered = skills.filter((s) => s.level === level);
  const angleStep = 360 / filtered.length;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ pointerEvents: "none" }}
    >
      {/* Ring */}
      <div
        className="absolute rounded-full border border-[var(--color-border)]"
        style={{ width: radius * 2, height: radius * 2, opacity: 0.4 }}
      />

      {/* Rotating wrapper */}
      <motion.div
        className="absolute"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {filtered.map((skill, i) => {
          const angle = ((angleStep * i - 90) * Math.PI) / 180;
          const x = Math.cos(angle) * radius + radius;
          const y = Math.sin(angle) * radius + radius;

          return (
            <motion.div
              key={skill.name}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
              }}
              // Counter-rotate the label so it stays upright
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              <span
                className="block px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap cursor-default"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border-highlight)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function Skills() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const orbitSize = 500; // center area size in px

  return (
    <SectionWrapper id="skills">
      <FadeIn direction="up">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Skills &amp; Technologies
          </h2>
        </div>
      </FadeIn>

      {/* Orbital display — desktop only */}
      <div className="hidden lg:flex justify-center" ref={ref}>
        {show && (
          <div
            className="relative flex items-center justify-center"
            style={{ width: orbitSize + 260, height: orbitSize + 260 }}
          >
            {/* Innermost: level 3 */}
            <OrbitRing skills={SKILLS} level={3} radius={150} duration={28} />
            {/* Middle: level 2 */}
            <OrbitRing skills={SKILLS} level={2} radius={270} duration={40} reverse />
            {/* Outer: level 1 */}
            <OrbitRing skills={SKILLS} level={1} radius={390} duration={55} />

            {/* Center dot */}
            <div
              className="absolute w-4 h-4 rounded-full bg-[var(--color-accent-red)]"
              style={{ boxShadow: "0 0 16px 4px rgba(196,30,58,0.5)" }}
            />
          </div>
        )}
      </div>

      {/* Mobile fallback grid */}
      <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background:
                  skill.level === 3
                    ? "var(--color-accent-red)"
                    : skill.level === 2
                    ? "var(--color-accent-blue)"
                    : "var(--color-text-muted)",
              }}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">{skill.name}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
