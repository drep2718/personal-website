"use client";
import { useRef, useCallback } from "react";
import Image from "next/image";
import type { VaultItem } from "@/data/vault";

interface Props {
  item: VaultItem;
  onSelect: (item: VaultItem) => void;
  onHover: (item: VaultItem | null) => void;
  dimmed: boolean;
}

const COVER_DEPTH = 135;

const TRANSFORM_ON  = "rotateY(-22deg) translateZ(68px) translateY(-18px)";
const TRANSFORM_OFF = "rotateY(0deg) translateZ(0px) translateY(0px)";

export function Book3D({ item, onSelect, onHover, dimmed }: Props) {
  const bookRef = useRef<HTMLDivElement>(null);

  // Deterministic size — stable across renders
  const seed = item.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const SPINE_W = 20 + (seed % 14);
  const HEIGHT  = 172 + (seed % 46);

  // Direct DOM mutation — no setState, no re-render, no animation interrupt
  const handleEnter = useCallback(() => {
    if (dimmed) return;
    if (bookRef.current) bookRef.current.style.transform = TRANSFORM_ON;
    onHover(item);
  }, [dimmed, item, onHover]);

  const handleLeave = useCallback(() => {
    if (bookRef.current) bookRef.current.style.transform = TRANSFORM_OFF;
    onHover(null);
  }, [onHover]);

  return (
    <div
      ref={bookRef}
      onClick={() => !dimmed && onSelect(item)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: SPINE_W,
        height: HEIGHT,
        flexShrink: 0,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: TRANSFORM_OFF,
        transition: "transform 0.42s cubic-bezier(0.34, 1.48, 0.64, 1)",
        cursor: dimmed ? "default" : "pointer",
      }}
    >
      {/* ── SPINE ─────────────────────────────────────────── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to right,
            ${darken(item.coverColor, 0.7)},
            ${item.coverColor} 30%,
            ${lighten(item.coverColor, 1.3)} 70%,
            ${item.coverColor}
          )`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 2px",
          overflow: "hidden",
          boxShadow:
            "inset 2px 0 4px rgba(255,255,255,0.06), inset -2px 0 6px rgba(0,0,0,0.5)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ width: "55%", height: 1, background: "rgba(201,168,76,0.5)", flexShrink: 0, marginBottom: 5 }} />
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontSize: Math.max(9, SPINE_W - 11) + "px",
            fontWeight: 600,
            color: "rgba(232,220,200,0.92)",
            letterSpacing: "0.07em",
            lineHeight: 1,
            overflow: "hidden",
            flex: 1,
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            maxHeight: HEIGHT - 34,
          }}
        >
          {item.title}
        </span>
        <div style={{ width: "55%", height: 1, background: "rgba(201,168,76,0.5)", flexShrink: 0, marginTop: 5 }} />

        {/* Dimmed overlay — no opacity on 3D container */}
        {dimmed && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,5,3,0.82)", pointerEvents: "none" }} />
        )}
      </div>

      {/* ── COVER face ────────────────────────────────────── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          width: COVER_DEPTH,
          height: HEIGHT,
          top: 0,
          left: SPINE_W,
          transformOrigin: "0 50%",
          transform: "rotateY(90deg)",
          background: item.coverColor,
          overflow: "hidden",
          backfaceVisibility: "hidden",
          boxShadow: "inset 6px 0 16px rgba(0,0,0,0.6)",
        }}
      >
        <Image src={item.cover} alt={item.title} fill style={{ objectFit: "cover", pointerEvents: "none" }} sizes="135px" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 40%)", pointerEvents: "none" }} />
      </div>

      {/* ── PAGES face ────────────────────────────────────── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          width: COVER_DEPTH,
          height: HEIGHT,
          top: 0,
          right: 0,
          transformOrigin: "100% 50%",
          transform: "rotateY(-90deg)",
          background: "linear-gradient(to right, #A89878, #D4C9A8 20%, #E8DCC8 80%, #D4C9A8)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* ── TOP face ──────────────────────────────────────── */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          width: SPINE_W,
          height: COVER_DEPTH,
          top: 0,
          left: 0,
          transformOrigin: "50% 0%",
          transform: "rotateX(90deg)",
          background: `linear-gradient(to bottom, ${lighten(item.coverColor, 1.1)}, ${item.coverColor})`,
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16)||20, parseInt(h.slice(2,4),16)||14, parseInt(h.slice(4,6),16)||8];
}
function lighten(hex: string, f = 1.4): string {
  try { const [r,g,b] = parseHex(hex); return `rgb(${Math.min(255,Math.round(r*f))},${Math.min(255,Math.round(g*f))},${Math.min(255,Math.round(b*f))})`; } catch { return hex; }
}
function darken(hex: string, f = 0.65): string {
  try { const [r,g,b] = parseHex(hex); return `rgb(${Math.round(r*f)},${Math.round(g*f)},${Math.round(b*f)})`; } catch { return hex; }
}
