"use client";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  VAULT_ITEMS,
  CATEGORY_META,
  STATUS_META,
  type VaultItem,
  type VaultCategory,
} from "@/data/vault";
import { Book3D } from "./Book3D";
import { VaultModal } from "./VaultModal";

// ── Decorative filler books ───────────────────────────────────────
const FILLERS: { w: number; h: number; color: string }[] = [
  { w: 13, h: 183, color: "#1A0808" },
  { w: 22, h: 197, color: "#081408" },
  { w: 17, h: 188, color: "#080818" },
  { w: 26, h: 207, color: "#180808" },
  { w: 15, h: 191, color: "#081414" },
  { w: 20, h: 178, color: "#181408" },
  { w: 24, h: 202, color: "#080C18" },
  { w: 14, h: 194, color: "#100808" },
  { w: 19, h: 186, color: "#081010" },
  { w: 23, h: 199, color: "#140814" },
  { w: 16, h: 180, color: "#141008" },
  { w: 21, h: 210, color: "#080A14" },
  { w: 18, h: 175, color: "#1A1408" },
  { w: 25, h: 196, color: "#0A1A0A" },
  { w: 12, h: 189, color: "#1A0A14" },
  { w: 27, h: 204, color: "#08140A" },
];

function FillerBook({ filler }: { filler: (typeof FILLERS)[0] }) {
  const seed = filler.w * 7 + filler.h;
  return (
    <div
      style={{
        width: filler.w,
        height: filler.h,
        flexShrink: 0,
        background: `linear-gradient(to right, ${darken(filler.color)}, ${filler.color} 40%, ${lighten(filler.color)} 70%, ${filler.color})`,
        boxShadow:
          "inset 2px 0 3px rgba(255,255,255,0.04), inset -2px 0 5px rgba(0,0,0,0.5)",
        borderLeft: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
        alignSelf: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Subtle spine texture line */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "1px",
          background: "rgba(150,120,80,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "1px",
          background: "rgba(150,120,80,0.2)",
        }}
      />
    </div>
  );
}

// ── Shelf row ─────────────────────────────────────────────────────
interface ShelfRowProps {
  category: VaultCategory;
  items: VaultItem[];
  search: string;
  onSelect: (item: VaultItem) => void;
  onHover: (item: VaultItem | null) => void;
}

function ShelfRow({ category, items, search, onSelect, onHover }: ShelfRowProps) {
  const meta = CATEGORY_META[category];

  const matches = useCallback(
    (item: VaultItem) =>
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.genre.toLowerCase().includes(search.toLowerCase()),
    [search]
  );

  // Interleave fillers and real books for a natural look
  const shelfItems = useMemo(() => {
    const result: Array<
      | { type: "book"; item: VaultItem }
      | { type: "filler"; filler: (typeof FILLERS)[0] }
    > = [];

    // 2–3 fillers at the start
    result.push({ type: "filler", filler: FILLERS[0] });
    result.push({ type: "filler", filler: FILLERS[1] });

    items.forEach((item, i) => {
      result.push({ type: "book", item });
      // 2–4 fillers between/after real books
      const count = 2 + (i % 3);
      for (let j = 0; j < count; j++) {
        const fi = (i * 3 + j + 2) % FILLERS.length;
        result.push({ type: "filler", filler: FILLERS[fi] });
      }
    });

    // Pad to ~20 items total
    while (result.length < 20) {
      result.push({ type: "filler", filler: FILLERS[result.length % FILLERS.length] });
    }

    return result;
  }, [items]);

  return (
    <div style={{ marginBottom: 0, position: "relative" }}>
      {/* Category label tab */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 clamp(24px, 6vw, 80px)",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.35em",
            color: meta.accent,
            opacity: 0.7,
          }}
        >
          {meta.label}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(to right, ${meta.accent}30, transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "8px",
            letterSpacing: "0.15em",
            color: meta.accent,
            opacity: 0.35,
          }}
        >
          {items.length} {items.length === 1 ? "TITLE" : "TITLES"}
        </span>
      </div>

      {/* Books container — perspective applied here */}
      <div
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% -40px",
          padding: "0 clamp(24px, 6vw, 80px)",
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "2px",
            minHeight: "240px",
            paddingBottom: "6px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {shelfItems.map((entry, idx) =>
            entry.type === "book" ? (
              <Book3D
                key={entry.item.id}
                item={entry.item}
                onSelect={onSelect}
                onHover={onHover}
                dimmed={search.trim() !== "" && !matches(entry.item)}
              />
            ) : (
              <FillerBook key={`filler-${category}-${idx}`} filler={entry.filler} />
            )
          )}
        </div>
      </div>

      {/* Wooden shelf plank */}
      <div
        style={{
          height: "20px",
          background:
            "linear-gradient(to bottom, #4A2C14 0%, #3A2010 30%, #2A1608 70%, #1E0F05 100%)",
          borderTop: "2px solid #5A3820",
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.85), 0 2px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      />

      {/* Shadow below shelf */}
      <div
        style={{
          height: "40px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          marginBottom: "32px",
        }}
      />
    </div>
  );
}

// ── Main BookShelf ────────────────────────────────────────────────
const CATEGORIES: VaultCategory[] = ["books", "games", "anime"];

export function BookShelf() {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<VaultItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleHover = useCallback((item: VaultItem | null) => {
    setHoveredItem(item);
  }, []);

  // Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categorisedItems = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((c) => [c, VAULT_ITEMS.filter((i) => i.category === c)])
      ) as Record<VaultCategory, VaultItem[]>,
    []
  );

  const status = hoveredItem ? STATUS_META[hoveredItem.status] : null;

  return (
    <>
      <section
        ref={sectionRef}
        id="vault-library"
        onMouseMove={handleMouseMove}
        style={{
          minHeight: "100vh",
          background: "#0A0703",
          paddingTop: "64px",
          paddingBottom: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Back wall texture — vertical panel lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 119px, rgba(201,168,76,0.02) 120px)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
            padding: "0 24px",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: "#2A1A0A",
              marginBottom: "18px",
            }}
          >
            // PERSONAL ARCHIVE
          </p>

          <h2
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 700,
              color: "#E8DCC8",
              letterSpacing: "0.06em",
              margin: "0 0 8px",
              textShadow: "0 0 80px rgba(201,168,76,0.08)",
            }}
          >
            The Collection
          </h2>

          <p
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(13px, 1.5vw, 16px)",
              color: "#4A3A2A",
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
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                height: "1px",
                width: 80,
                background:
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.3))",
              }}
            />
            <span style={{ color: "rgba(201,168,76,0.4)", fontSize: 10 }}>◆</span>
            <div
              style={{
                height: "1px",
                width: 120,
                background:
                  "linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.6), rgba(201,168,76,0.3))",
              }}
            />
            <span style={{ color: "rgba(201,168,76,0.4)", fontSize: 10 }}>◆</span>
            <div
              style={{
                height: "1px",
                width: 80,
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.3))",
              }}
            />
          </div>

          {/* Search bar */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(20,12,6,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: "3px",
              padding: "10px 18px",
              width: "min(480px, 90vw)",
            }}
          >
            {/* Search icon */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              style={{ flexShrink: 0, opacity: 0.4 }}
            >
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#C9A84C" strokeWidth="1.2" />
              <path d="M9 9L12 12" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the collection..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontStyle: search ? "normal" : "italic",
                fontSize: "14px",
                color: "#C9A84C",
                caretColor: "#C9A84C",
              }}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "rgba(201,168,76,0.4)",
                  padding: "2px 4px",
                  letterSpacing: "0.1em",
                }}
              >
                ✕
              </button>
            )}

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: "rgba(201,168,76,0.2)",
                flexShrink: 0,
              }}
            >
              ⌘K
            </span>
          </div>
        </div>

        {/* Shelf rows */}
        <div style={{ position: "relative" }}>
          {CATEGORIES.map((cat) => (
            <ShelfRow
              key={cat}
              category={cat}
              items={categorisedItems[cat]}
              search={search}
              onSelect={setSelectedItem}
              onHover={handleHover}
            />
          ))}
        </div>
      </section>

      {/* Hover tooltip — floats near cursor */}
      {hoveredItem && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x + 16,
            top: mousePos.y - 72,
            zIndex: 300,
            pointerEvents: "none",
            background: "rgba(10,7,3,0.96)",
            border: "1px solid rgba(201,168,76,0.22)",
            borderRadius: "3px",
            padding: "10px 14px",
            minWidth: "160px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#E8DCC8",
              marginBottom: "4px",
            }}
          >
            {hoveredItem.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.15em",
              color: hoveredItem.year ? "#5A4A3A" : "transparent",
              marginBottom: "6px",
            }}
          >
            {hoveredItem.year} · {hoveredItem.genre}
          </div>
          {status && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: status.color,
                  boxShadow: `0 0 5px ${status.color}`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  letterSpacing: "0.15em",
                  color: status.color,
                }}
              >
                {status.label}
              </span>
            </div>
          )}
          <div
            style={{
              marginTop: "7px",
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.15em",
              color: "rgba(201,168,76,0.35)",
            }}
          >
            CLICK TO VIEW ↗
          </div>
        </div>
      )}

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

// ── Color helpers ─────────────────────────────────────────────────
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) || 20,
    parseInt(h.slice(2, 4), 16) || 14,
    parseInt(h.slice(4, 6), 16) || 8,
  ];
}

function lighten(hex: string, f = 1.35): string {
  try {
    const [r, g, b] = parseHex(hex);
    return `rgb(${Math.min(255, Math.round(r * f))},${Math.min(255, Math.round(g * f))},${Math.min(255, Math.round(b * f))})`;
  } catch {
    return hex;
  }
}

function darken(hex: string, f = 0.6): string {
  try {
    const [r, g, b] = parseHex(hex);
    return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
  } catch {
    return hex;
  }
}
