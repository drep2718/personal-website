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
  const panelRef = useRef<HTMLDivElement>(null);
  const status = STATUS_META[item.status];
  const stars = Array.from({ length: 5 }, (_, i) => i < item.rating);

  // Entrance animation
  useEffect(() => {
    const run = async () => {
      const { animate } = await import("animejs");
      animate(overlayRef.current!, {
        opacity: [0, 1],
        duration: 300,
        ease: "easeOutQuad",
      });
      animate(panelRef.current!, {
        opacity: [0, 1],
        translateY: [32, 0],
        scale: [0.96, 1],
        duration: 450,
        ease: "easeOutExpo",
      });
    };
    run();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(8,5,3,0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        opacity: 0,
      }}
    >
      <div
        ref={panelRef}
        style={{
          display: "flex",
          gap: "40px",
          maxWidth: "800px",
          width: "100%",
          background: "#120D09",
          border: "1px solid rgba(201,168,76,0.18)",
          borderRadius: "4px",
          padding: "40px",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(201,168,76,0.06)",
          opacity: 0,
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "#5A4A3A",
            padding: "4px 8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "#C9A84C")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "#5A4A3A")
          }
        >
          ESC ✕
        </button>

        {/* Cover */}
        <div
          style={{
            flexShrink: 0,
            width: "180px",
            aspectRatio: "2/3",
            borderRadius: "3px",
            overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.15)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            position: "relative",
            background: item.coverColor,
          }}
        >
          <Image
            src={item.cover}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="180px"
          />
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0" }}>
          {/* Overline */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#4A3A2A",
              marginBottom: "12px",
            }}
          >
            // {item.category.toUpperCase()} · {item.genre.toUpperCase()}
          </p>

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(24px, 3.5vw, 42px)",
              fontWeight: 700,
              color: "#E8DCC8",
              lineHeight: 1.1,
              margin: "0 0 6px",
              letterSpacing: "0.01em",
            }}
          >
            {item.title}
          </h2>

          {/* Year */}
          <p
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "15px",
              color: "#7A6A5A",
              marginBottom: "24px",
            }}
          >
            {item.year}
          </p>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, rgba(201,168,76,0.3), transparent)",
              marginBottom: "24px",
            }}
          />

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: status.color,
                boxShadow: `0 0 8px ${status.color}`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: status.color,
              }}
            >
              {status.label}
            </span>
          </div>

          {/* Star rating */}
          <div
            style={{ display: "flex", gap: "6px", marginBottom: "24px" }}
          >
            {stars.map((filled, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: filled ? "#C9A84C" : "transparent",
                  border: filled
                    ? "none"
                    : "1px solid rgba(201,168,76,0.2)",
                  boxShadow: filled ? "0 0 6px rgba(201,168,76,0.6)" : "none",
                }}
              />
            ))}
          </div>

          {/* Notes */}
          {item.notes && (
            <p
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "15px",
                color: "#8A7A6A",
                lineHeight: 1.7,
                borderLeft: "2px solid rgba(201,168,76,0.25)",
                paddingLeft: "16px",
                margin: 0,
              }}
            >
              &ldquo;{item.notes}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
