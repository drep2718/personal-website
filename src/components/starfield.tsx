"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  size: number;
  opacity: number;
}

const STAR_COUNT = 180;
const SPEED = 0.0003;
const MAX_DEPTH = 1;

function initStar(w: number, h: number): Star {
  const x = (Math.random() - 0.5) * w;
  const y = (Math.random() - 0.5) * h;
  const z = Math.random() * MAX_DEPTH;
  return { x, y, z, prevX: x, prevY: y, size: 0, opacity: 0 };
}

export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = Array.from({ length: STAR_COUNT }, () =>
        initStar(canvas.width, canvas.height)
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const { width: w, height: h } = canvas;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = "rgba(10,10,10,0.25)";
      ctx.fillRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.prevX = (star.x / star.z) * w + cx;
        star.prevY = (star.y / star.z) * h + cy;

        star.z -= SPEED * w;

        if (star.z <= 0) {
          Object.assign(star, initStar(w, h));
          star.z = MAX_DEPTH;
          continue;
        }

        const sx = (star.x / star.z) * w + cx;
        const sy = (star.y / star.z) * h + cy;

        if (sx < 0 || sx > w || sy < 0 || sy > h) {
          Object.assign(star, initStar(w, h));
          star.z = MAX_DEPTH;
          continue;
        }

        const progress = 1 - star.z / MAX_DEPTH;
        const size = Math.max(0.3, progress * 2.5);
        const opacity = Math.min(1, progress * 2);

        // Trail
        ctx.beginPath();
        ctx.moveTo(star.prevX, star.prevY);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(245,245,245,${opacity * 0.4})`;
        ctx.lineWidth = size * 0.5;
        ctx.stroke();

        // Star dot
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,245,245,${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
