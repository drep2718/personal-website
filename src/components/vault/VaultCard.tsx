"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { VaultItem } from "@/data/vault";
import { STATUS_META } from "@/data/vault";

interface Props {
  item: VaultItem;
  onSelect: (item: VaultItem) => void;
}

export function VaultCard({ item, onSelect }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0–1
      const y = (e.clientY - rect.top) / rect.height; // 0–1
      const rx = (0.5 - y) * 22;
      const ry = (x - 0.5) * 22;

      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;

      // Holographic shimmer follows cursor
      if (shimmerRef.current) {
        shimmerRef.current.style.setProperty("--mx", `${x * 100}%`);
        shimmerRef.current.style.setProperty("--my", `${y * 100}%`);
      }

      // Sweep highlight angle from mouse position
      if (sweepRef.current) {
        const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 90;
        sweepRef.current.style.setProperty("--angle", `${angle}deg`);
        const dist = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
        sweepRef.current.style.opacity = `${0.3 + dist * 0.7}`;
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(async () => {
    setHovered(false);
    const card = cardRef.current;
    if (!card) return;
    const { animate } = await import("animejs");
    animate(card, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 800,
      ease: "spring(1, 80, 10, 0)",
    });
    if (sweepRef.current) sweepRef.current.style.opacity = "0";
  }, []);

  const status = STATUS_META[item.status];
  const stars = Array.from({ length: 5 }, (_, i) => i < item.rating);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(item)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "2 / 3",
        borderRadius: "3px",
        overflow: "hidden",
        cursor: "pointer",
        background: item.coverColor,
        border: `1px solid rgba(201,168,76,${hovered ? 0.3 : 0.1})`,
        boxShadow: hovered
          ? "0 24px 64px rgba(0,0,0,0.85), 0 0 40px rgba(201,168,76,0.12), inset 0 1px 0 rgba(255,235,180,0.08)"
          : "0 6px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,235,180,0.03)",
        transition: "box-shadow 0.3s, border-color 0.3s",
        willChange: "transform",
      }}
    >
      {/* Cover image */}
      <Image
        src={item.cover}
        alt={item.title}
        fill
        style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 200px"
      />

      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          opacity: 0.6,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Bottom gradient — text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,5,3,0.98) 0%, rgba(8,5,3,0.65) 35%, rgba(8,5,3,0.1) 60%, transparent 80%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Holographic shimmer — color-dodge blend, follows cursor */}
      <div
        ref={shimmerRef}
        style={
          {
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
            background:
              "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(201,168,76,0.55) 0%, rgba(180,100,40,0.25) 30%, rgba(80,40,20,0.1) 55%, transparent 72%)",
            mixBlendMode: "color-dodge",
            pointerEvents: "none",
          } as React.CSSProperties
        }
      />

      {/* Sweep highlight — angular shine */}
      <div
        ref={sweepRef}
        style={
          {
            position: "absolute",
            inset: 0,
            zIndex: 4,
            opacity: 0,
            transition: "opacity 0.2s",
            background:
              "linear-gradient(var(--angle, 105deg), transparent 38%, rgba(255,240,200,0.1) 50%, transparent 62%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          } as React.CSSProperties
        }
      />

      {/* Metadata — slides up on hover */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 12px 12px",
          zIndex: 5,
          transform: hovered ? "translateY(0)" : "translateY(5px)",
          transition: "transform 0.35s ease",
        }}
      >
        {/* Status dot + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: status.color,
              boxShadow: `0 0 6px ${status.color}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.18em",
              color: status.color,
              opacity: 0.9,
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#E8DCC8",
            lineHeight: 1.25,
            marginBottom: "4px",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          {item.title}
        </div>

        {/* Year · Genre */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "#6A5A4A",
            letterSpacing: "0.1em",
            marginBottom: "7px",
          }}
        >
          {item.year}&nbsp;·&nbsp;{item.genre}
        </div>

        {/* Rating dots */}
        <div style={{ display: "flex", gap: "4px" }}>
          {stars.map((filled, i) => (
            <div
              key={i}
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: filled ? "#C9A84C" : "transparent",
                border: filled
                  ? "none"
                  : "1px solid rgba(201,168,76,0.25)",
                boxShadow: filled ? "0 0 4px rgba(201,168,76,0.5)" : "none",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top-right corner ornament on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 5,
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            color: "rgba(201,168,76,0.5)",
            letterSpacing: "0.1em",
          }}
        >
          VIEW ↗
        </div>
      )}
    </div>
  );
}
