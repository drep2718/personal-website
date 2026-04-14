"use client";
import { useEffect, useRef } from "react";

const N = 180;

export function ParticleGalaxy() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    let running = true;

    const init = async () => {
      const { animate, stagger } = await import("animejs");
      if (!running) return;

      const particles: HTMLDivElement[] = [];
      for (let i = 0; i < N; i++) {
        const p = document.createElement("div");
        const size = Math.random() * 5 + 1;
        const hue = Math.random() * 80 + 180; // blue → purple → pink
        p.style.cssText = `
          position:absolute;
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:hsl(${hue},100%,70%);
          box-shadow:0 0 ${size * 3}px hsl(${hue},100%,70%);
          left:50%;top:50%;
          transform:translate(-50%,-50%);
          opacity:0;
          will-change:transform,opacity;
        `;
        root.appendChild(p);
        particles.push(p);
      }

      const explode = () => {
        if (!running) return;
        const w = root.clientWidth;
        const h = root.clientHeight;
        const r = Math.min(w, h) * 0.44;

        animate(particles, {
          translateX: () => (Math.random() - 0.5) * r * 2,
          translateY: () => (Math.random() - 0.5) * r * 2,
          scale: [{ to: 0 }, { to: () => Math.random() * 2.5 + 0.5 }],
          opacity: [0, () => Math.random() * 0.7 + 0.3],
          duration: 1600,
          easing: "spring(1, 90, 12, 0)",
          delay: stagger(7, { from: "center" }),
          onComplete: collapse,
        });
      };

      const collapse = () => {
        if (!running) return;
        setTimeout(() => {
          if (!running) return;
          animate(particles, {
            translateX: 0,
            translateY: 0,
            scale: 0,
            opacity: 0,
            duration: 1300,
            easing: "easeInExpo",
            delay: stagger(5, { from: "random" }),
            onComplete: () => { if (running) setTimeout(explode, 700); },
          });
        }, 1400);
      };

      setTimeout(explode, 400);

      return () => {
        running = false;
        particles.forEach((p) => p.remove());
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });

    return () => {
      running = false;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
}
