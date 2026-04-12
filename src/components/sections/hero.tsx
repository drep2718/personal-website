"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Starfield } from "@/components/starfield";

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[600px] flex-col items-center justify-center overflow-hidden"
    >
      {/* Starfield background */}
      <div className="absolute inset-0">
        <Starfield className="h-full w-full" />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="mb-4 text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase">
            Software Engineer
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tight text-[var(--color-text-primary)]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Aiden{" "}
            <span className="gradient-text-accent font-semibold">Drep</span>
          </h1>
        </motion.div>

        <motion.p
          className="mt-6 max-w-md text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Building things at the intersection of performance, design, and
          curiosity.
        </motion.p>

        <motion.div
          className="mt-10 flex gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 rounded-full bg-[var(--color-accent-red)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity glow-red"
          >
            View Work
          </button>
          <button
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 rounded-full border border-[var(--color-border-highlight)] text-[var(--color-text-secondary)] text-sm font-medium tracking-wide hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors"
          >
            About Me
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
