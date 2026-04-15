export type VaultCategory = "books" | "games" | "anime";
export type VaultStatus =
  | "completed"
  | "reading"
  | "playing"
  | "watching"
  | "dropped"
  | "on-hold"
  | "plan-to";

export interface VaultItem {
  id: string;
  title: string;
  category: VaultCategory;
  cover: string;
  coverColor: string;
  year: number;
  genre: string;
  status: VaultStatus;
  rating: number; // 1–5
  notes?: string;
}

export const VAULT_ITEMS: VaultItem[] = [
  // ── BOOKS ────────────────────────────────────────────────
  {
    id: "dune",
    title: "Dune",
    category: "books",
    cover: "/covers/dune.png",
    coverColor: "#4A2C0A",
    year: 1965,
    genre: "Sci-Fi",
    status: "completed",
    rating: 5,
    notes: "The greatest science fiction novel ever written. A complete world.",
  },

  // ── GAMES ────────────────────────────────────────────────
  {
    id: "elden-ring",
    title: "Elden Ring",
    category: "games",
    cover: "/covers/elden-ring.png",
    coverColor: "#0D1520",
    year: 2022,
    genre: "Action RPG",
    status: "completed",
    rating: 5,
    notes: "FromSoftware at their absolute peak. The open world changed everything.",
  },

  // ── ANIME ────────────────────────────────────────────────
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    category: "anime",
    cover: "/covers/vinland-saga.jpg",
    coverColor: "#1E2D1A",
    year: 2019,
    genre: "Historical",
    status: "completed",
    rating: 5,
    notes: "A meditation on violence, purpose, and what it means to live.",
  },
];

export const CATEGORY_META: Record<
  VaultCategory,
  { label: string; accent: string; dim: string }
> = {
  books: { label: "BOOKS", accent: "#C9A84C", dim: "rgba(201,168,76,0.12)" },
  games: { label: "GAMES", accent: "#4A9A8A", dim: "rgba(74,154,138,0.12)" },
  anime: { label: "ANIME", accent: "#9A6AAA", dim: "rgba(154,106,170,0.12)" },
};

export const STATUS_META: Record<
  VaultStatus,
  { label: string; color: string }
> = {
  completed: { label: "COMPLETED", color: "#C9A84C" },
  reading: { label: "READING", color: "#4A9A6A" },
  playing: { label: "PLAYING", color: "#4A8A9A" },
  watching: { label: "WATCHING", color: "#7A6AAA" },
  dropped: { label: "DROPPED", color: "#8A3A3A" },
  "on-hold": { label: "ON HOLD", color: "#6A6A5A" },
  "plan-to": { label: "QUEUED", color: "#5A6A7A" },
};
