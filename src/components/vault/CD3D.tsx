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

// Jewel case dimensions
const CASE_W   = 135; // front face width (same depth as book cover)
const HEIGHT   = 190; // standard CD case height
const SPINE_W  = 10;  // thin spine

const T_ON  = "rotateY(-28deg) translateZ(68px) translateY(-14px)";
const T_OFF = "rotateY(0deg)   translateZ(0px)  translateY(0px)";

export function CD3D({ item, onSelect, onHover, dimmed }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caseRef    = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (dimmed) return;
    if (wrapperRef.current) wrapperRef.current.style.zIndex = "100";
    if (caseRef.current)    caseRef.current.style.transform  = T_ON;
    onHover(item);
  }, [dimmed, item, onHover]);

  const handleLeave = useCallback(() => {
    if (wrapperRef.current) wrapperRef.current.style.zIndex = "1";
    if (caseRef.current)    caseRef.current.style.transform  = T_OFF;
    onHover(null);
  }, [onHover]);

  return (
    /*
     * FLAT WRAPPER — stable hit target, exactly SPINE_W × HEIGHT.
     * The 3D case extends outside visually but is pointer-events:none.
     */
    <div
      ref={wrapperRef}
      onClick={() => !dimmed && onSelect(item)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position:   "relative",
        width:      SPINE_W,
        height:     HEIGHT,
        flexShrink: 0,
        cursor:     dimmed ? "default" : "pointer",
        zIndex:     1,
      }}
    >
      {/* 3D VISUAL — purely decorative */}
      <div
        ref={caseRef}
        style={{
          position:       "absolute",
          inset:          0,
          pointerEvents:  "none",
          transformStyle: "preserve-3d",
          transform:      T_OFF,
          transition:     "transform 0.38s cubic-bezier(0.34, 1.48, 0.64, 1)",
        }}
      >
        {/* ── Spine ───────────────────────────────────────── */}
        <div style={{
          pointerEvents: "none",
          position: "absolute", inset: 0,
          background: `linear-gradient(to right,
            rgba(0,0,0,0.9),
            ${item.coverColor} 25%,
            ${lighten(item.coverColor, 1.4)} 60%,
            ${item.coverColor} 85%,
            rgba(0,0,0,0.7))`,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "6px 1px",
          overflow:       "hidden",
          boxShadow:      "inset 1px 0 3px rgba(255,255,255,0.12), inset -1px 0 4px rgba(0,0,0,0.8)",
          borderLeft:     "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Glossy sheen strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "40%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)",
            pointerEvents: "none",
          }} />

          <span style={{
            writingMode:    "vertical-rl",
            transform:      "rotate(180deg)",
            fontFamily:     "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize:       "6px",
            fontWeight:     600,
            color:          "rgba(232,220,200,0.85)",
            letterSpacing:  "0.06em",
            lineHeight:     1,
            overflow:       "hidden",
            flex:           1,
            textShadow:     "0 1px 3px rgba(0,0,0,0.95)",
            maxHeight:      HEIGHT - 24,
          }}>
            {item.title}
          </span>

          {dimmed && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,5,3,0.82)", pointerEvents: "none" }} />
          )}
        </div>

        {/* ── Front face (cover art) ───────────────────────── */}
        <div style={{
          pointerEvents:      "none",
          position:           "absolute",
          width:              CASE_W,
          height:             HEIGHT,
          top:                0,
          left:               SPINE_W,
          transformOrigin:    "0 50%",
          transform:          "rotateY(90deg)",
          background:         item.coverColor,
          overflow:           "hidden",
          backfaceVisibility: "hidden",
          boxShadow:          "inset 6px 0 16px rgba(0,0,0,0.5)",
        }}>
          <Image
            src={item.cover}
            alt={item.title}
            fill
            style={{ objectFit: "cover", pointerEvents: "none" }}
            sizes="135px"
          />
          {/* Glossy overlay — jewel case reflection */}
          <div style={{
            position:      "absolute",
            inset:         0,
            pointerEvents: "none",
            background:    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(255,255,255,0.04) 100%)",
          }} />
          {/* Left edge shadow */}
          <div style={{
            position:      "absolute",
            inset:         0,
            pointerEvents: "none",
            background:    "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 30%)",
          }} />
        </div>

        {/* ── Back face (fore-edge) ────────────────────────── */}
        <div style={{
          pointerEvents:      "none",
          position:           "absolute",
          width:              CASE_W,
          height:             HEIGHT,
          top:                0,
          right:              0,
          transformOrigin:    "100% 50%",
          transform:          "rotateY(-90deg)",
          background:         "linear-gradient(to right, #0A0A0A, #1A1A1A 20%, #242424 80%, #1A1A1A)",
          backfaceVisibility: "hidden",
        }} />

        {/* ── Top face ────────────────────────────────────── */}
        <div style={{
          pointerEvents:      "none",
          position:           "absolute",
          width:              SPINE_W,
          height:             CASE_W,
          top:                0,
          left:               0,
          transformOrigin:    "50% 0%",
          transform:          "rotateX(90deg)",
          background:         `linear-gradient(to bottom, ${lighten(item.coverColor, 1.2)}, ${item.coverColor})`,
          backfaceVisibility: "hidden",
        }} />
      </div>
    </div>
  );
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16)||20, parseInt(h.slice(2,4),16)||14, parseInt(h.slice(4,6),16)||8];
}
function lighten(hex: string, f = 1.4): string {
  try { const [r,g,b] = parseHex(hex); return `rgb(${Math.min(255,Math.round(r*f))},${Math.min(255,Math.round(g*f))},${Math.min(255,Math.round(b*f))})`; }
  catch { return hex; }
}
