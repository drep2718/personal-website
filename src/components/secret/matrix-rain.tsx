"use client";
import { useEffect, useRef } from "react";

const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const CHARS = (KATAKANA + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!?").split("");

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const fontSize = 14;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cols = Math.floor(w / fontSize);
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50);

    let frame: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;

        // Bright lead character
        if (drops[i] > 0) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00ff41";
          ctx.shadowBlur = 8;
          ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
          ctx.fillText(char, i * fontSize, y);
          ctx.shadowBlur = 0;
        }

        // Green trail
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        const brightness = Math.floor(Math.random() * 80 + 120);
        ctx.fillStyle = `rgba(0, ${brightness}, 40, 0.9)`;
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(trailChar, i * fontSize, y - fontSize);

        drops[i]++;
        if (y > h && Math.random() > 0.975) {
          drops[i] = Math.random() * -20;
        }
      }

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
