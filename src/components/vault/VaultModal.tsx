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
  const coverRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const status = STATUS_META[item.status];
  const stars = Array.from({ length: 5 }, (_, i) => i < item.rating);

  // Entrance
  useEffect(() => {
    const run = async () => {
      const { animate } = await import("animejs");
      animate(overlayRef.current!, {
        opacity: [0, 1],
        duration: 350,
        ease: "easeOutQuad",
      });
      animate(coverRef.current!, {
        opacity: [0, 1],
        scale: [0.88, 1],
        translateY: [24, 0],
        duration: 550,
        delay: 80,
        ease: "easeOutExpo",
      });
      animate(detailsRef.current!, {
        opacity: [0, 1],
        translateX: [28, 0],
        duration: 500,
        delay: 200,
        ease: "easeOutExpo",
      });
    };
    run();
  }, []);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(6,4,2,0.94)",
        backdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        opacity: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "clamp(28px, 5vw, 56px)",
          alignItems: "center",
          maxWidth: "900px",
          width: "100%",
          position: "relative",
        }}
      >
        {/* ── Large cover ─────────────────────────────────── */}
        <div
          ref={coverRef}
          style={{
            flexShrink: 0,
            width: "clamp(200px, 28vw, 320px)",
            aspectRatio: "2 / 3",
            position: "relative",
            borderRadius: "3px",
            overflow: "hidden",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,168,76,0.12), 20px 20px 60px rgba(0,0,0,0.6)",
            opacity: 0,
          }}
        >
          <Image
            src={item.cover}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 200px, 320px"
            priority
          />
          {/* Subtle inner edge shadow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.3)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Details ─────────────────────────────────────── */}
        <div
          ref={detailsRef}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            opacity: 0,
          }}
        >
          {/* Category + genre */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "#3A2A1A",
              marginBottom: "16px",
            }}
          >
            // {item.category.toUpperCase()} · {item.genre.toUpperCase()}
          </p>

          {/* Title */}
          <h2
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 700,
              color: "#E8DCC8",
              lineHeight: 1.05,
              margin: "0 0 8px",
              letterSpacing: "0.01em",
            }}
          >
            {item.title}
          </h2>

          {/* Year */}
          <p
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "#5A4A38",
              marginBottom: "28px",
            }}
          >
            {item.year}
          </p>

          {/* Rule */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, rgba(201,168,76,0.35), transparent)",
              marginBottom: "28px",
            }}
          />

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: status.color,
                boxShadow: `0 0 10px ${status.color}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: status.color,
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Rating */}
          <div
            style={{ display: "flex", gap: "7px", marginBottom: "28px" }}
          >
            {stars.map((filled, i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: filled ? "#C9A84C" : "transparent",
                  border: filled ? "none" : "1px solid rgba(201,168,76,0.2)",
                  boxShadow: filled
                    ? "0 0 8px rgba(201,168,76,0.7)"
                    : "none",
                }}
              />
            ))}
          </div>

          {/* Notes */}
          {item.notes && (
            <p
              style={{
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "15px",
                color: "#7A6A58",
                lineHeight: 1.75,
                borderLeft: "2px solid rgba(201,168,76,0.22)",
                paddingLeft: "18px",
                margin: 0,
              }}
            >
              &ldquo;{item.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "#3A2A1A",
            padding: "4px 8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#C9A84C")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#3A2A1A")
          }
        >
          ESC ✕
        </button>
      </div>
    </div>
  );
}
