"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { NAV_PAGES } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

// ─── Helpers ─────────────────────────���─────────────────────────────────���──────

function spawnParticle(R: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const radius = R * (0.48 + Math.random() * 0.52);
  return {
    angle,
    radius,
    speed: (0.003 + Math.random() * 0.007) * (Math.random() > 0.5 ? 1 : -1),
    size: 0.7 + Math.random() * 2.2,
    opacity: 0,
    hue: Math.random(),
    life: 0,
    maxLife: 100 + Math.random() * 200,
  };
}

// ─── Canvas hook — single RAF, reads mouse from refs ─────────────────��───────

function useBlackHoleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  mousePosRef: React.RefObject<{ x: number; y: number }>,
  isHoveredRef: React.RefObject<boolean>
) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const rotSpeedRef = useRef(0.002);
  const canvasSizeRef = useRef(600);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Size setup ────────────────────────────────────────────────────────
    const syncSize = () => {
      const s = canvas.offsetWidth;
      canvas.width = s;
      canvas.height = s;
      canvasSizeRef.current = s;

      // Respawn particles at correct scale
      particlesRef.current = Array.from({ length: 120 }, () => {
        const p = spawnParticle(s / 2);
        p.life = Math.floor(Math.random() * p.maxLife);
        return p;
      });
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    // ── Draw loop ─────────────────────────────────────────────────────────
    const draw = () => {
      const { width: w, height: h } = canvas;
      if (w === 0 || h === 0) { rafRef.current = requestAnimationFrame(draw); return; }

      const cx = w / 2;
      const cy = h / 2;
      const R = w / 2;

      const hovered = isHoveredRef.current;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // ── Rotation lerp ─────────��──────────────────────────────────────
      const targetSpeed = hovered ? 0.014 : 0.0025;
      rotSpeedRef.current += (targetSpeed - rotSpeedRef.current) * 0.04;

      // ── Clear ───────────────────────────────────────────────���────────
      ctx.clearRect(0, 0, w, h);

      // ── Background void gradient ─────────────────��───────────────────
      const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
      bgGrad.addColorStop(0, "rgba(26,0,8,0.35)");
      bgGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Glow ring helper ───────────────────────────���─────────────────
      const ring = (r: number, color: string, alpha: number, lw: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lw;
        ctx.stroke();
        ctx.restore();
      };

      const pulse = 0.88 + 0.12 * Math.sin(Date.now() * 0.0016);
      const hoverPulse = hovered ? 1 + 0.08 * Math.sin(Date.now() * 0.004) : 1;

      // Outer blue ring
      ring(R * 0.56,       "#4A6FA5", 0.05, 24);
      ring(R * 0.56,       "#4A6FA5", 0.10, 5);
      ring(R * 0.56,       "#6B9FDF", 0.20, 1);
      // Inner red ring (pulsing)
      ring(R * 0.44 * pulse * hoverPulse, "#C41E3A", 0.07, 28);
      ring(R * 0.44 * pulse * hoverPulse, "#C41E3A", 0.18, 7);
      ring(R * 0.44 * pulse * hoverPulse, "#FF3355", 0.40, 1.5);

      // ── Accretion disk particles ─────────────────────────────��────────
      const pullStrength = hovered ? 0.022 : 0;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.angle += p.speed + rotSpeedRef.current * 0.4;

        // Inward gravitational drift
        p.radius -= 0.1 + (1 - p.radius / R) * 0.07;

        // Mouse gravitational pull
        if (hovered) {
          const px = Math.cos(p.angle) * p.radius + cx;
          const py = Math.sin(p.angle) * p.radius + cy;
          const ddx = (mx - px) / R;
          const ddy = (my - py) / R;
          p.angle += Math.atan2(ddy, ddx) * pullStrength * 0.12;
          p.radius -= Math.sqrt(ddx * ddx + ddy * ddy) * pullStrength * 0.6;
        }

        // Fade in/out
        const t = p.life / p.maxLife;
        p.opacity = t < 0.12 ? t / 0.12 : t > 0.72 ? 1 - (t - 0.72) / 0.28 : 1;

        const sx = Math.cos(p.angle) * p.radius + cx;
        const sy = Math.sin(p.angle) * p.radius + cy;

        // Red → Blue color gradient based on hue
        const r = Math.round(196 + (74 - 196) * p.hue);
        const g = Math.round(30 + (111 - 30) * p.hue);
        const b = Math.round(58 + (165 - 58) * p.hue);

        // Elongated motion blur trail
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.7;
        const trailLen = p.size * 3;
        const trailAngle = p.angle + Math.PI / 2 * Math.sign(p.speed);
        const grd = ctx.createLinearGradient(
          sx, sy,
          sx + Math.cos(trailAngle) * trailLen,
          sy + Math.sin(trailAngle) * trailLen
        );
        grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + Math.cos(trailAngle) * trailLen,
          sy + Math.sin(trailAngle) * trailLen
        );
        ctx.strokeStyle = grd;
        ctx.lineWidth = p.size * 0.8;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();

        if (p.radius < R * 0.1 || p.life >= p.maxLife) {
          particlesRef.current[i] = spawnParticle(R);
        }
      }

      // ── Event horizon ─────────────────────────────────────────────────
      const ehR = R * 0.3;
      // Subtle mouse lensing offset
      const lensX = cx + ((mx - cx) / R) * ehR * 0.06;
      const lensY = cy + ((my - cy) / R) * ehR * 0.06;

      const ehGrad = ctx.createRadialGradient(lensX, lensY, 0, cx, cy, ehR);
      ehGrad.addColorStop(0,   "rgba(0,0,0,1)");
      ehGrad.addColorStop(0.75,"rgba(0,0,0,1)");
      ehGrad.addColorStop(1,   "rgba(5,0,2,0.9)");

      ctx.beginPath();
      ctx.arc(cx, cy, ehR, 0, Math.PI * 2);
      ctx.fillStyle = ehGrad;
      ctx.fill();

      // ── Event horizon rim glow ───────────────────────────���────────────
      const rimGrad = ctx.createRadialGradient(cx, cy, ehR * 0.88, cx, cy, ehR * 1.08);
      rimGrad.addColorStop(0, "rgba(196,30,58,0)");
      rimGrad.addColorStop(0.5, `rgba(196,30,58,${hovered ? 0.18 : 0.08})`);
      rimGrad.addColorStop(1, "rgba(196,30,58,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, ehR * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // Thin photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, ehR * 1.01, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${hovered ? 0.08 : 0.03})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // Intentionally empty deps — runs once, reads live values via refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ─── Nav label ────────────────────────────────────────────────────────────────

interface NavLabelProps {
  label: string;
  angle: number;  // degrees
  radius: number; // px from center
  active: boolean;
  onClick: () => void;
}

function NavLabel({ label, angle, radius, active, onClick }: NavLabelProps) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.button
      onClick={onClick}
      className="absolute z-10"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.93 }}
    >
      <span
        className={`
          text-[11px] md:text-sm font-medium tracking-[0.12em] uppercase
          px-3 py-1.5 rounded-full border whitespace-nowrap
          transition-all duration-300 block
          ${active
            ? "border-[var(--color-accent-red)] text-[var(--color-accent-red)] shadow-[0_0_12px_rgba(196,30,58,0.3)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[rgba(10,10,10,0.6)] backdrop-blur-sm hover:border-[var(--color-border-highlight)] hover:text-[var(--color-text-primary)]"
          }
        `}
      >
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main component ─────────────────────────────��────────────────────────────��

export function BlackHoleNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live refs — read by the draw loop without causing re-renders
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // State only for nav labels (low frequency)
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [discSize, setDiscSize] = useState(640);

  // Resize disc to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(el.offsetWidth, 760);
      setDiscSize(s);
    });
    ro.observe(el);
    setDiscSize(Math.min(el.offsetWidth, 760));
    return () => ro.disconnect();
  }, []);

  useBlackHoleCanvas(canvasRef, mousePosRef, isHoveredRef);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Translate to canvas-local coordinates (canvas is centred in container)
    const containerCx = rect.width / 2;
    const containerCy = rect.height / 2;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    // Map into canvas space (canvas is discSize × discSize, centred)
    mousePosRef.current = {
      x: localX - containerCx + discSize / 2,
      y: localY - containerCy + discSize / 2,
    };
  };

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = NAV_PAGES;
  const labelRadius = discSize * 0.50;
  const angleStep = 360 / navItems.length;
  const startAngle = -90;

  return (
    <SectionWrapper id="navigate" fullWidth>
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Navigate
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Where do you want to go?
          </h2>
        </div>

        {/* Disc container */}
        <div
          ref={containerRef}
          className="relative mx-auto select-none"
          style={{ width: "100%", height: discSize }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            mousePosRef.current = { x: discSize / 2, y: discSize / 2 };
          }}
        >
          {/* Canvas — centred */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: discSize,
              height: discSize,
              transform: "translate(-50%, -50%)",
              display: "block",
            }}
          />

          {/* Nav labels */}
          {navItems.map((section, i) => (
            <NavLabel
              key={section.id}
              label={section.label}
              angle={startAngle + angleStep * i}
              radius={labelRadius}
              active={activeNav === section.id}
              onClick={() => scrollTo(section.id)}
            />
          ))}

          {/* Centre text */}
          <motion.p
            className="absolute pointer-events-none text-[10px] tracking-[0.28em] text-[var(--color-text-muted)] uppercase"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{ opacity: [0.25, 0.65, 0.25] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Explore
          </motion.p>
        </div>

        <p className="text-center mt-8 text-xs text-[var(--color-text-muted)] tracking-wide">
          Hover to disturb the singularity · Click to travel
        </p>
      </div>
    </SectionWrapper>
  );
}
