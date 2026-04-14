"use client";
import { useEffect, useRef } from "react";

const RINGS = [
  { n: 5,  r: 0.07, speed: 1.1,  dir:  1, hue: 210, dotR: 5 },
  { n: 9,  r: 0.13, speed: 0.65, dir: -1, hue: 340, dotR: 3.5 },
  { n: 14, r: 0.20, speed: 0.42, dir:  1, hue: 270, dotR: 3 },
  { n: 20, r: 0.28, speed: 0.28, dir: -1, hue: 170, dotR: 2.5 },
  { n: 28, r: 0.37, speed: 0.18, dir:  1, hue: 50,  dotR: 2 },
  { n: 38, r: 0.47, speed: 0.10, dir: -1, hue: 195, dotR: 1.5 },
];

export function OrbitalOrrery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let frame: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h);

      // Faint orbit rings
      RINGS.forEach(({ r, hue }) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue},80%,60%,0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Connective web — draw lines between nearby dots across rings
      // (only between adjacent rings to avoid chaos)
      const dotPositions: { x: number; y: number; hue: number }[][] = RINGS.map(
        ({ n, r, speed, dir, hue }) =>
          Array.from({ length: n }, (_, i) => {
            const angle = (i / n) * Math.PI * 2 + t * speed * dir;
            return {
              x: cx + r * scale * Math.cos(angle),
              y: cy + r * scale * Math.sin(angle),
              hue,
            };
          })
      );

      // Draw dots
      dotPositions.forEach((ring, ri) => {
        ring.forEach(({ x, y, hue }, di) => {
          const pulse = (Math.sin(t * 2.5 + ri * 1.3 + di * 0.4) + 1) / 2;
          const alpha = 0.45 + pulse * 0.55;
          const r2 = RINGS[ri].dotR * (0.7 + pulse * 0.3);

          ctx.beginPath();
          ctx.arc(x, y, r2, 0, Math.PI * 2);
          ctx.shadowColor = `hsl(${hue},100%,65%)`;
          ctx.shadowBlur = 8 + pulse * 6;
          ctx.fillStyle = `hsla(${hue},100%,70%,${alpha})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      // Center star
      const centralPulse = (Math.sin(t * 3) + 1) / 2;
      const cR = 6 + centralPulse * 3;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR * 4);
      grd.addColorStop(0, "rgba(255,255,255,0.95)");
      grd.addColorStop(0.4, "rgba(200,220,255,0.4)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, cR * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      t += 0.016;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
