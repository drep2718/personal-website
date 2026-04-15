"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function VaultHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  // Floating amber dust particles
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    type Particle = {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
      phase: number;
    };

    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.25 + 0.08,
      opacity: Math.random() * 0.35 + 0.04,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let t = 0;
    let running = true;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift + Math.sin(t + p.phase) * 0.15;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
      }

      if (running) frame = requestAnimationFrame(draw);
    };
    draw();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else {
        running = true;
        draw();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", setSize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Entrance animations — anime.js is statically imported so it is
  // already parsed and ready the moment this effect fires.
  useEffect(() => {
    const els = [titleRef.current!, subtitleRef.current!, ruleRef.current!];

    // Prime GPU compositor layers before animating
    for (const el of els) el.style.willChange = "opacity, transform";

    animate(els, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: stagger(150, { start: 400 }),
      ease: "easeOutExpo",
      complete: () => {
        // Release compositor layers — no longer needed after animation
        for (const el of els) el.style.willChange = "auto";
      },
    });

    // Arrow bounce loop
    if (arrowRef.current) {
      arrowRef.current.style.willChange = "opacity, transform";
      animate(arrowRef.current, {
        translateY: [-7, 7],
        opacity: [0.45, 0.85],
        duration: 1600,
        loop: true,
        alternate: true,
        ease: "easeInOutSine",
      });
    }
  }, []);

  const scrollDown = () => {
    document.getElementById("vault-library")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0C0906",
        overflow: "hidden",
      }}
    >
      {/* Animated dust canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at center, transparent 30%, rgba(6,4,2,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* CRT scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Overline */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.45em",
            color: "#3A2A18",
            marginBottom: "24px",
            opacity: 0,
          }}
          ref={undefined}
        >
          // CLASSIFIED · PERSONAL ARCHIVE
        </p>

        {/* Large serif title */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(64px, 12vw, 160px)",
            fontWeight: 700,
            color: "#E8DCC8",
            letterSpacing: "0.08em",
            lineHeight: 1,
            margin: "0 0 6px",
            textShadow:
              "0 0 80px rgba(201,168,76,0.12), 0 2px 4px rgba(0,0,0,0.8)",
            opacity: 0,
          }}
        >
          THE VAULT
        </h1>

        {/* Italic subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(14px, 2vw, 20px)",
            color: "#5A4A38",
            letterSpacing: "0.12em",
            marginBottom: "40px",
            opacity: 0,
          }}
        >
          Books · Games · Anime
        </p>

        {/* Ornamental rule */}
        <div
          ref={ruleRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: 0,
          }}
        >
          <div
            style={{
              height: "1px",
              width: "clamp(40px, 8vw, 100px)",
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.3))",
            }}
          />
          <span style={{ color: "rgba(201,168,76,0.4)", fontSize: "11px" }}>
            ◆
          </span>
          <div
            style={{
              height: "1px",
              width: "clamp(60px, 14vw, 180px)",
              background:
                "linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.65), rgba(201,168,76,0.3))",
            }}
          />
          <span style={{ color: "rgba(201,168,76,0.4)", fontSize: "11px" }}>
            ◆
          </span>
          <div
            style={{
              height: "1px",
              width: "clamp(40px, 8vw, 100px)",
              background:
                "linear-gradient(to left, transparent, rgba(201,168,76,0.3))",
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        onClick={scrollDown}
        style={{
          position: "absolute",
          bottom: "44px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          zIndex: 1,
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.3em",
            color: "#3A2A18",
          }}
        >
          ENTER
        </span>

        {/* Double chevron */}
        <svg
          width="22"
          height="18"
          viewBox="0 0 22 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L11 10L21 1"
            stroke="#C9A84C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <path
            d="M1 8L11 17L21 8"
            stroke="#C9A84C"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
        </svg>
      </div>
    </section>
  );
}
