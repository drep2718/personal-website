"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SKILLS } from "@/data/skills";

const TIERS = [
  {
    level: 3 as const,
    name: "Core",
    blurb: "Daily drivers — deepest experience (inner orbit)",
    color: "var(--color-accent-red)",
  },
  {
    level: 2 as const,
    name: "Proficient",
    blurb: "Shipped production work (middle orbit)",
    color: "var(--color-accent-blue)",
  },
  {
    level: 1 as const,
    name: "Familiar",
    blurb: "Built projects, still exploring (outer orbit)",
    color: "var(--color-text-muted)",
  },
];

const tierColor = (level: 1 | 2 | 3) =>
  TIERS.find((t) => t.level === level)!.color;

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

  // Shared animation controls — all labels share one counter-rotation controller
  const ringControls  = useAnimation();
  const labelControls = useAnimation();

  useEffect(() => {
    ringControls.start({
      rotate: reverse ? -360 : 360,
      transition: { duration, repeat: Infinity, ease: "linear" },
    });
    labelControls.start({
      rotate: reverse ? 360 : -360,
      transition: { duration, repeat: Infinity, ease: "linear" },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleHoverStart = () => {
    ringControls.stop();
    labelControls.stop();
  };

  const handleHoverEnd = () => {
    ringControls.start({
      rotate: reverse ? -360 : 360,
      transition: { duration, repeat: Infinity, ease: "linear" },
    });
    labelControls.start({
      rotate: reverse ? 360 : -360,
      transition: { duration, repeat: Infinity, ease: "linear" },
    });
  };

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
        animate={ringControls}
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
              animate={labelControls}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            >
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap cursor-default"
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border-highlight)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: tierColor(skill.level) }}
                />
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function SkillsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {SKILLS.map((skill) => (
        <div
          key={skill.name}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]"
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: tierColor(skill.level) }}
          />
          <span className="text-sm text-[var(--color-text-secondary)]">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

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
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Skills &amp; Technologies
          </h2>
        </div>
      </FadeIn>

      {/* Tier legend — explains what each orbit means */}
      <FadeIn direction="up" delay={0.1}>
        <div className="content-panel flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-center gap-x-10 gap-y-3 px-6 py-5 mb-14 max-w-3xl mx-auto">
          {TIERS.map((tier) => (
            <div key={tier.name} className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: tier.color, boxShadow: `0 0 8px ${tier.color}` }}
              />
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">{tier.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]"> — {tier.blurb}</span>
              </p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Orbital display — desktop only, skipped for reduced motion */}
      {!reducedMotion && (
        <div className="hidden lg:flex justify-center" ref={ref}>
          {show && (
            <div
              className="relative flex items-center justify-center"
              style={{ width: orbitSize + 260, height: orbitSize + 260 }}
            >
              {/* Innermost: level 3 — wider radius to fit the core ring */}
              <OrbitRing skills={SKILLS} level={3} radius={175} duration={40} />
              {/* Middle: level 2 */}
              <OrbitRing skills={SKILLS} level={2} radius={280} duration={55} reverse />
              {/* Outer: level 1 — pulled in since it's a leaner ring now */}
              <OrbitRing skills={SKILLS} level={1} radius={370} duration={70} />

              {/* Center dot */}
              <div
                className="absolute w-4 h-4 rounded-full bg-[var(--color-accent-red)]"
                style={{ boxShadow: "0 0 16px 4px rgba(196,30,58,0.5)" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Grid — mobile always, desktop when the user prefers reduced motion */}
      <div className={reducedMotion ? "" : "lg:hidden"}>
        <SkillsGrid />
      </div>
    </SectionWrapper>
  );
}
