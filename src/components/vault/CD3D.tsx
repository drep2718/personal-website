"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import type { VaultItem } from "@/data/vault";

interface Props {
  item: VaultItem;
  onSelect: (item: VaultItem) => void;
  onHover: (item: VaultItem | null) => void;
  dimmed: boolean;
}

const DISC_D  = 152; // CD disc diameter
const HEIGHT  = 170; // spine height (slightly taller than disc for case look)
const SPINE_W = 16;  // CD case spine
const DISC_TOP = Math.round((HEIGHT - DISC_D) / 2); // center disc on spine

const T_ON  = "rotateY(-30deg) translateZ(76px) translateY(-12px)";
const T_OFF = "rotateY(0deg)   translateZ(0px)  translateY(0px)";

export function CD3D({ item, onSelect, onHover, dimmed }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caseRef    = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);

  // Set initial transform via DOM — keeps React from resetting it on re-renders
  useEffect(() => {
    if (caseRef.current) caseRef.current.style.transform = T_OFF;
  }, []);

  const handleEnter = useCallback(() => {
    if (dimmed) return;
    if (wrapperRef.current) wrapperRef.current.style.zIndex = "100";
    if (caseRef.current)    caseRef.current.style.transform = T_ON;
    setShowImage(true);
    onHover(item);
  }, [dimmed, item, onHover]);

  const handleLeave = useCallback(() => {
    if (wrapperRef.current) wrapperRef.current.style.zIndex = "1";
    if (caseRef.current)    caseRef.current.style.transform = T_OFF;
    onHover(null);
  }, [onHover]);

  return (
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
      <div
        ref={caseRef}
        style={{
          position:       "absolute",
          inset:          0,
          pointerEvents:  "none",
          transformStyle: "preserve-3d",
          transition:     "transform 0.40s cubic-bezier(0.34, 1.48, 0.64, 1)",
        }}
      >
        {/* ── Spine — slim CD case edge ────────────────────── */}
        <div style={{
          pointerEvents:  "none",
          position:       "absolute",
          inset:          0,
          background:     "linear-gradient(to right, #030303, #111 30%, #1c1c1c 60%, #0a0a0a)",
          boxShadow:      "inset 1px 0 2px rgba(255,255,255,0.08), inset -1px 0 3px rgba(0,0,0,0.9)",
          borderLeft:     "1px solid rgba(255,255,255,0.07)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          overflow:       "hidden",
        }}>
          {/* Iridescent sheen on spine */}
          <div style={{
            position:      "absolute",
            inset:         0,
            background:    "linear-gradient(180deg, rgba(120,80,200,0.08) 0%, rgba(80,200,200,0.06) 40%, rgba(200,80,80,0.06) 70%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <span style={{
            writingMode:   "vertical-rl",
            transform:     "rotate(180deg)",
            fontFamily:    "var(--font-mono), monospace",
            fontSize:      "7px",
            fontWeight:    600,
            color:         "rgba(200,200,200,0.5)",
            letterSpacing: "0.08em",
            overflow:      "hidden",
            flex:          1,
            maxHeight:     HEIGHT - 16,
            textShadow:    "none",
          }}>
            {item.title}
          </span>
          {dimmed && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(5,3,1,0.85)", pointerEvents: "none" }} />
          )}
        </div>

        {/* ── CD Disc face ─────────────────────────────────── */}
        {/*
         * Circular disc that pivots from the spine's right edge.
         * At rest: rotateY(90deg) = edge-on, invisible.
         * When parent tilts back: sweeps into partial view as a disc.
         */}
        <div style={{
          pointerEvents:      "none",
          position:           "absolute",
          width:              DISC_D,
          height:             DISC_D,
          top:                DISC_TOP,
          left:               SPINE_W,
          borderRadius:       "50%",
          overflow:           "hidden",
          transformOrigin:    "0 50%",
          transform:          "rotateY(90deg)",
          backfaceVisibility: "hidden",
          boxShadow:          "-8px 0 24px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        }}>
          {/* Cover art — fills the disc (deferred until first hover) */}
          {showImage && (
            <Image
              src={item.cover}
              alt={item.title}
              fill
              style={{ objectFit: "contain", pointerEvents: "none" }}
              sizes="152px"
            />
          )}

          {/* Outer ring — polycarbonate / data area (dark ring at edge) */}
          <div style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "50%",
            background:    "radial-gradient(circle, transparent 68%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.75) 100%)",
            pointerEvents: "none",
          }} />

          {/* Iridescent conic shimmer */}
          <div style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "50%",
            background:    [
              "conic-gradient(from 0deg,",
              "  rgba(255,80,80,0.22),",
              "  rgba(255,200,0,0.18),",
              "  rgba(80,255,80,0.18),",
              "  rgba(0,200,255,0.22),",
              "  rgba(120,0,255,0.22),",
              "  rgba(255,0,200,0.18),",
              "  rgba(255,80,80,0.22)",
              ")",
            ].join(" "),
            mixBlendMode:  "color-dodge" as const,
            opacity:       0.7,
            pointerEvents: "none",
          }} />

          {/* Radial gloss — top-left highlight */}
          <div style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "50%",
            background:    "radial-gradient(ellipse at 35% 28%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)",
            mixBlendMode:  "overlay" as const,
            pointerEvents: "none",
          }} />

          {/* Slight overall darkening so art reads through shimmer */}
          <div style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "50%",
            background:    "rgba(0,0,0,0.12)",
            pointerEvents: "none",
          }} />

          {/* Center hub hole */}
          <div style={{
            position:     "absolute",
            width:        18,
            height:       18,
            borderRadius: "50%",
            background:   "#050303",
            top:          "50%",
            left:         "50%",
            transform:    "translate(-50%, -50%)",
            boxShadow:    "0 0 0 2px rgba(255,255,255,0.1), inset 0 0 4px rgba(0,0,0,0.8)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Top edge of case ─────────────────────────────── */}
        <div style={{
          pointerEvents:      "none",
          position:           "absolute",
          width:              SPINE_W,
          height:             DISC_D * 0.6,
          top:                0,
          left:               0,
          transformOrigin:    "50% 0%",
          transform:          "rotateX(90deg)",
          background:         "linear-gradient(to bottom, #1c1c1c, #080808)",
          backfaceVisibility: "hidden",
        }} />
      </div>
    </div>
  );
}
