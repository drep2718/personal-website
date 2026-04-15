"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { VaultItem } from "@/data/vault";
import { STATUS_META } from "@/data/vault";

interface Props {
  item: VaultItem;
  onClose: () => void;
}

export function VaultModal({ item, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const status = STATUS_META[item.status];
  const stars  = Array.from({ length: 5 }, (_, i) => i < item.rating);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel   = panelRef.current;
    if (!overlay || !panel) return;

    // Set initial states directly — no React state, no flicker
    overlay.style.opacity = "0";
    panel.style.opacity   = "0";
    panel.style.transform = "scale(0.9) translateY(24px)";

    let cancelled = false;
    import("animejs").then(({ animate }) => {
      if (cancelled) return;
      animate(overlay, { opacity: [0, 1], duration: 300, ease: "easeOutQuad" });
      animate(panel,   { opacity: [0, 1], scale: [0.9, 1], translateY: [24, 0], duration: 480, delay: 60, ease: "easeOutExpo" });
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(5,3,1,0.95)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div
        ref={panelRef}
        style={{
          display: "flex",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "center",
          maxWidth: "1000px",
          width: "100%",
          position: "relative",
        }}
      >
        {/* ── Cover — large portrait ───────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            width: "clamp(220px, 32vw, 400px)",
            aspectRatio: "2 / 3",
            position: "relative",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: [
              "0 60px 120px rgba(0,0,0,0.95)",
              "0 20px 60px rgba(0,0,0,0.8)",
              "0 0 0 1px rgba(201,168,76,0.14)",
              "28px 28px 80px rgba(0,0,0,0.7)",
            ].join(", "),
          }}
        >
          <Image
            src={item.cover}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 220px, 400px"
            priority
          />
          {/* Inner edge shadow for depth */}
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 50px rgba(0,0,0,0.25)", pointerEvents: "none" }} />
        </div>

        {/* ── Details ─────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.35em", color: "#2A1A0A", marginBottom: "18px" }}>
            // {item.category.toUpperCase()} · {item.genre.toUpperCase()}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "clamp(30px, 4.5vw, 58px)",
              fontWeight: 700,
              color: "#E8DCC8",
              lineHeight: 1.05,
              margin: "0 0 10px",
              letterSpacing: "0.01em",
              wordBreak: "break-word",
            }}
          >
            {item.title}
          </h2>

          <p style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "#4A3A28", marginBottom: "28px" }}>
            {item.year}
          </p>

          <div style={{ height: 1, background: "linear-gradient(to right, rgba(201,168,76,0.3), transparent)", marginBottom: "28px" }} />

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: status.color, boxShadow: `0 0 12px ${status.color}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.22em", color: status.color }}>
              {status.label}
            </span>
          </div>

          {/* Stars */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {stars.map((filled, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: filled ? "#C9A84C" : "transparent",
                border: filled ? "none" : "1px solid rgba(201,168,76,0.2)",
                boxShadow: filled ? "0 0 10px rgba(201,168,76,0.7)" : "none",
              }} />
            ))}
          </div>

          {item.notes && (
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "15px",
              color: "#6A5A48",
              lineHeight: 1.8,
              borderLeft: "2px solid rgba(201,168,76,0.2)",
              paddingLeft: 18,
              margin: 0,
            }}>
              &ldquo;{item.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 0, right: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", color: "#3A2A1A", padding: "4px 8px" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C9A84C"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#3A2A1A"; }}
        >
          ESC ✕
        </button>
      </div>
    </div>
  );
}
