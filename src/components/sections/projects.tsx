"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";

function GitHubIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren, staggerItem } from "@/components/animations/stagger-children";
import { PROJECTS, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

function SpotlightCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, show: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight((s) => ({ ...s, show: false }))}
      className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 overflow-hidden transition-border duration-300 hover:border-[var(--color-border-highlight)]"
    >
      {/* Spotlight glow */}
      {spotlight.show && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(196,30,58,0.08) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Featured badge */}
      {project.featured && (
        <span className="inline-block mb-4 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-accent-red-dim)] text-[var(--color-accent-red)]">
          Featured
        </span>
      )}

      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-red)] transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors"
          >
            <ExternalLink size={13} /> Live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <GitHubIcon size={13} /> Source
          </a>
        )}
        <span className="ml-auto text-xs text-[var(--color-text-muted)]">
          {project.year}
        </span>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects">
      <FadeIn direction="up">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
              Work
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
              Selected Projects
            </h2>
          </div>
          <a
            href="https://github.com/aidendrep"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-red)] transition-colors"
          >
            View all <ArrowUpRight size={14} />
          </a>
        </div>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <SpotlightCard key={project.id} project={project} />
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}
