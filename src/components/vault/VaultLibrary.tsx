"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  VAULT_ITEMS,
  CATEGORY_META,
  type VaultCategory,
  type VaultItem,
} from "@/data/vault";
import { VaultCard } from "./VaultCard";
import { VaultModal } from "./VaultModal";

const CATEGORIES: VaultCategory[] = ["books", "anime"];

export function VaultLibrary() {
  const [active, setActive] = useState<VaultCategory>("books");
  const [items, setItems] = useState<VaultItem[]>(
    VAULT_ITEMS.filter((i) => i.category === "books")
  );
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);

  // Stagger entrance when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEnteredRef.current) {
          hasEnteredRef.current = true;
          const run = async () => {
            const { animate, stagger } = await import("animejs");
            const cards = Array.from(
              gridRef.current?.children ?? []
            ) as HTMLElement[];
            cards.forEach((c) => {
              c.style.opacity = "0";
              c.style.transform = "translateY(28px) scale(0.96)";
            });
            animate(cards, {
              translateY: [28, 0],
              opacity: [0, 1],
              scale: [0.96, 1],
              duration: 600,
              delay: stagger(70, { from: "first" }),
              ease: "easeOutExpo",
            });
          };
          run();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const switchCategory = useCallback(
    async (cat: VaultCategory) => {
      if (cat === active || transitioning) return;
      setTransitioning(true);
      hasEnteredRef.current = true;

      const { animate, stagger } = await import("animejs");
      const grid = gridRef.current;
      if (!grid) return;
      const cards = Array.from(grid.children) as HTMLElement[];

      // Exit — scatter upward with slight rotation
      await new Promise<void>((resolve) => {
        animate(cards, {
          translateY: [0, -28],
          opacity: [1, 0],
          scale: [1, 0.94],
          rotateX: [0, 8],
          duration: 320,
          delay: stagger(18),
          ease: "easeInQuart",
          onComplete: () => resolve(),
        });
      });

      setActive(cat);
      const newItems = VAULT_ITEMS.filter((i) => i.category === cat);
      setItems(newItems);

      // Enter — after React re-renders
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          const newCards = Array.from(
            gridRef.current?.children ?? []
          ) as HTMLElement[];
          newCards.forEach((c) => {
            c.style.opacity = "0";
            c.style.transform = "translateY(32px) scale(0.95) rotateX(-6deg)";
          });
          animate(newCards, {
            translateY: [32, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            rotateX: [-6, 0],
            duration: 520,
            delay: stagger(65, { from: "center" }),
            ease: "easeOutExpo",
            onComplete: () => setTransitioning(false),
          });
        });
      });
    },
    [active, transitioning]
  );

  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [
      c,
      VAULT_ITEMS.filter((i) => i.category === c).length,
    ])
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="vault-library"
        style={{
          minHeight: "100vh",
          background: "#0C0906",
          padding: "80px clamp(20px, 5vw, 80px) 120px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle shelf-line texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent, transparent 119px, rgba(201,168,76,0.04) 120px)",
            backgroundSize: "100% 120px",
            pointerEvents: "none",
          }}
        />

        {/* Section header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "56px",
            position: "relative",
          }}
        >
          {/* Overline */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "#3A2A1A",
              marginBottom: "20px",
            }}
          >
            // PERSONAL ARCHIVE
          </p>

          {/* Main title */}
          <h2
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              color: "#E8DCC8",
              letterSpacing: "0.04em",
              margin: "0 0 8px",
              textShadow: "0 0 80px rgba(201,168,76,0.08)",
            }}
          >
            The Collection
          </h2>

          {/* Subtitle italic */}
          <p
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(13px, 1.6vw, 17px)",
              color: "#5A4A3A",
              marginBottom: "32px",
            }}
          >
            Curated works that shaped the mind
          </p>

          {/* Ornamental rule */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "80px",
                background:
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.35))",
              }}
            />
            <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "10px" }}>
              ◆
            </span>
            <div
              style={{
                height: "1px",
                width: "140px",
                background:
                  "linear-gradient(90deg, rgba(201,168,76,0.35), rgba(201,168,76,0.6), rgba(201,168,76,0.35))",
              }}
            />
            <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "10px" }}>
              ◆
            </span>
            <div
              style={{
                height: "1px",
                width: "80px",
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.35))",
              }}
            />
          </div>

          {/* Category tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => switchCategory(cat)}
                  style={{
                    padding: "10px 28px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    border: `1px solid ${
                      isActive ? meta.accent : "rgba(201,168,76,0.1)"
                    }`,
                    background: isActive ? meta.dim : "transparent",
                    color: isActive ? meta.accent : "#4A3A2A",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color =
                        meta.accent;
                      (e.currentTarget as HTMLElement).style.borderColor =
                        meta.accent + "60";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "#4A3A2A";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(201,168,76,0.1)";
                    }
                  }}
                >
                  {meta.label}
                  <span
                    style={{
                      marginLeft: "8px",
                      opacity: 0.5,
                      fontSize: "8px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {counts[cat]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(130px, 14vw, 190px), 1fr))",
            gap: "clamp(12px, 2vw, 24px)",
            maxWidth: "1300px",
            margin: "0 auto",
            perspective: "1200px",
          }}
        >
          {items.map((item) => (
            <VaultCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))}

          {/* Empty state */}
          {items.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 0",
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "18px",
                color: "#3A2A1A",
              }}
            >
              The shelves await...
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selectedItem && (
        <VaultModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
