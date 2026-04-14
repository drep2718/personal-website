"use client";
import { useEffect, useRef } from "react";

function smoothPolygon(
  cx: number,
  cy: number,
  r: number,
  sides: number,
  rotation: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rotation;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function MorphingPortal() {
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
      const maxR = Math.min(w, h) * 0.42;

      // Smoothly oscillate side count between 3 and ~80 (circle)
      const raw = (Math.sin(t * 0.28) + 1) / 2; // 0→1
      const easedSides = 3 + Math.pow(raw, 0.6) * 77; // 3→80

      // Hue cycle
      const hue = (t * 18) % 360;

      // 5 concentric rings, each slightly offset in rotation and size
      for (let ring = 4; ring >= 0; ring--) {
        const ringFrac = ring / 4;
        const r = maxR * (0.22 + ringFrac * 0.78);
        const rotOffset = ring * 0.4;
        const rot = t * (ring % 2 === 0 ? 0.4 : -0.25) + rotOffset;
        const ringHue = (hue + ring * 22) % 360;
        const alpha = 0.15 + (1 - ringFrac) * 0.55;
        const lineW = 1.5 + (1 - ringFrac) * 2;

        ctx.save();
        ctx.shadowColor = `hsl(${ringHue},100%,60%)`;
        ctx.shadowBlur = 18 + ring * 6;
        ctx.strokeStyle = `hsla(${ringHue},100%,60%,${alpha})`;
        ctx.lineWidth = lineW;
        smoothPolygon(cx, cy, r, easedSides, rot, ctx);
        ctx.stroke();
        ctx.restore();
      }

      // Bright inner fill dot
      const dotR = maxR * 0.05 * (0.8 + 0.2 * Math.sin(t * 2.1));
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, dotR * 3);
      grd.addColorStop(0, `hsla(${hue},100%,90%,0.9)`);
      grd.addColorStop(1, `hsla(${hue},100%,60%,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, dotR * 3, 0, Math.PI * 2);
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
