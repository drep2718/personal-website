"use client";

import { useEffect, useRef, useState } from "react";
import { MatrixRain } from "@/components/secret/matrix-rain";
import { ParticleGalaxy } from "@/components/secret/particle-galaxy";
import { GlitchReveal } from "@/components/secret/glitch-reveal";
import { MorphingPortal } from "@/components/secret/morphing-portal";
import { TypewriterDecrypt } from "@/components/secret/typewriter-decrypt";
import { OrbitalOrrery } from "@/components/secret/orbital-orrery";

const SECTIONS = [
  { id: "intro",   num: "00", name: "INTRO VIDEO" },
  { id: "matrix",  num: "01", name: "MATRIX RAIN" },
  { id: "galaxy",  num: "02", name: "PARTICLE GALAXY" },
  { id: "glitch",  num: "03", name: "GLITCH REVEAL" },
  { id: "portal",  num: "04", name: "MORPHING PORTAL" },
  { id: "decrypt", num: "05", name: "TYPEWRITER DECRYPT" },
  { id: "orrery",  num: "06", name: "ORBITAL ORRERY" },
];

export default function SecretPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Play video on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onEnd = () => setVideoEnded(true);
    v.addEventListener("ended", onEnd);
    return () => v.removeEventListener("ended", onEnd);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll("[data-section]"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const sections = container.querySelectorAll("[data-section]");
    sections[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={scrollRef}
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#000",
        scrollbarWidth: "none",
      }}
    >
      {/* --- 00 VIDEO --- */}
      <section
        data-section
        style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", overflow: "hidden" }}
      >
        <video
          ref={videoRef}
          src="/FINALFINAL.mp4"
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        {videoEnded && (
          <button
            onClick={() => scrollTo(1)}
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              background: "none",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.4em",
              padding: "10px 24px",
              cursor: "pointer",
              animation: "secretFade 1.2s ease forwards",
            }}
          >
            EXPLORE ↓
          </button>
        )}
      </section>

      {/* --- 01 MATRIX RAIN --- */}
      <section data-section style={sectionStyle("#001a0a")}>
        <SectionLabel num="01" name="MATRIX RAIN" />
        <MatrixRain />
      </section>

      {/* --- 02 PARTICLE GALAXY --- */}
      <section data-section style={sectionStyle("#05010f")}>
        <SectionLabel num="02" name="PARTICLE GALAXY" />
        <ParticleGalaxy />
      </section>

      {/* --- 03 GLITCH REVEAL --- */}
      <section data-section style={sectionStyle("#0a0000")}>
        <SectionLabel num="03" name="GLITCH REVEAL" />
        <GlitchReveal />
      </section>

      {/* --- 04 MORPHING PORTAL --- */}
      <section data-section style={sectionStyle("#00030f")}>
        <SectionLabel num="04" name="MORPHING PORTAL" />
        <MorphingPortal />
      </section>

      {/* --- 05 TYPEWRITER DECRYPT --- */}
      <section data-section style={sectionStyle("#050505")}>
        <SectionLabel num="05" name="TYPEWRITER DECRYPT" />
        <TypewriterDecrypt />
      </section>

      {/* --- 06 ORBITAL ORRERY --- */}
      <section data-section style={sectionStyle("#000508")}>
        <SectionLabel num="06" name="ORBITAL ORRERY" />
        <OrbitalOrrery />
      </section>

      {/* Dot navigation */}
      <nav
        style={{
          position: "fixed",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 100,
        }}
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(i)}
            title={s.name}
            style={{
              width: active === i ? 10 : 6,
              height: active === i ? 10 : 6,
              borderRadius: "50%",
              background: active === i ? "#C41E3A" : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s ease",
              padding: 0,
            }}
          />
        ))}
      </nav>

      <style>{`
        @keyframes secretFade { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        [data-section]::-webkit-scrollbar { display:none; }
        div::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}

const sectionStyle = (bg: string): React.CSSProperties => ({
  height: "100vh",
  scrollSnapAlign: "start",
  position: "relative",
  overflow: "hidden",
  background: bg,
});

function SectionLabel({ num, name }: { num: string; name: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 28,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span style={{ fontSize: 11, color: "#C41E3A", letterSpacing: "0.1em" }}>{num}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3em" }}>
        {name}
      </span>
    </div>
  );
}
