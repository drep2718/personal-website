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

  {
    id: "mattie-milo-me",
    title: "Mattie, Milo, and Me",
    category: "books",
    cover: "/covers/mattie-milo-me.png",
    coverColor: "#5B9EA0",
    year: 2022,
    genre: "Memoir",
    status: "completed",
    rating: 4,
    notes: "A quiet, honest memoir about healing through the unexpected bond with two dogs.",
  },
  {
    id: "warbreaker",
    title: "Warbreaker",
    category: "books",
    cover: "/covers/warbreaker.png",
    coverColor: "#0D1A3A",
    year: 2009,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "Sanderson at his most playful. The magic of Breath and color is endlessly clever.",
  },
  {
    id: "sixth-of-the-dusk",
    title: "Sixth of the Dusk",
    category: "books",
    cover: "/covers/sixth-of-the-dusk.png",
    coverColor: "#1A3A4A",
    year: 2014,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "A tight Cosmere novella — deceptively small in scope, vast in implication.",
  },
  {
    id: "shadows-for-silence",
    title: "Shadows for Silence in the Forests of Hell",
    category: "books",
    cover: "/covers/shadows-for-silence.png",
    coverColor: "#0D0D1A",
    year: 2013,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "Dark, tense, and brilliant. One of the best Cosmere novellas.",
  },
  {
    id: "emperors-soul",
    title: "The Emperor's Soul",
    category: "books",
    cover: "/covers/emperors-soul.png",
    coverColor: "#3A2A1A",
    year: 2012,
    genre: "Fantasy",
    status: "completed",
    rating: 5,
    notes: "Perfect novella. The Forging magic is Sanderson's most intimate and elegant system.",
  },
  {
    id: "elantris",
    title: "Elantris",
    category: "books",
    cover: "/covers/elantris.png",
    coverColor: "#2A2010",
    year: 2005,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "Sanderson's debut still holds up — a city of fallen gods and a mystery worth solving.",
  },
  {
    id: "blood-over-bright-haven",
    title: "Blood Over Bright Haven",
    category: "books",
    cover: "/covers/blood-over-bright-haven.png",
    coverColor: "#1A0808",
    year: 2023,
    genre: "Fantasy",
    status: "completed",
    rating: 5,
    notes: "A brutal, brilliant gut-punch. M.L. Wang writes darkness with surgical precision.",
  },
  {
    id: "metamorphoses",
    title: "Metamorphoses",
    category: "books",
    cover: "/covers/metamorphoses.png",
    coverColor: "#0A0A0A",
    year: 8,
    genre: "Classic / Poetry",
    status: "completed",
    rating: 5,
    notes: "Two thousand years old and still the most alive thing on any shelf.",
  },
  {
    id: "water-moon",
    title: "Water Moon",
    category: "books",
    cover: "/covers/water-moon.png",
    coverColor: "#3A4A7A",
    year: 2024,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "Dreamy and melancholic. A pawnshop at the edge of the world.",
  },
  {
    id: "sword-of-kaigen",
    title: "The Sword of Kaigen",
    category: "books",
    cover: "/covers/sword-of-kaigen.png",
    coverColor: "#1A2A3A",
    year: 2019,
    genre: "Fantasy",
    status: "completed",
    rating: 5,
    notes: "The most emotionally devastating fantasy novel I have ever read.",
  },
  {
    id: "the-martian",
    title: "The Martian",
    category: "books",
    cover: "/covers/the-martian.png",
    coverColor: "#8A3A10",
    year: 2011,
    genre: "Sci-Fi",
    status: "completed",
    rating: 5,
    notes: "Pure problem-solving joy. Watney is one of fiction's great protagonists.",
  },
  {
    id: "mistborn-final-empire",
    title: "Mistborn: The Final Empire",
    category: "books",
    cover: "/covers/mistborn-final-empire.png",
    coverColor: "#3A2A4A",
    year: 2006,
    genre: "Fantasy",
    status: "completed",
    rating: 5,
    notes: "The heist that became an epic. Allomancy is the gold standard of hard magic.",
  },
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    category: "books",
    cover: "/covers/project-hail-mary.png",
    coverColor: "#1A1A0A",
    year: 2021,
    genre: "Sci-Fi",
    status: "completed",
    rating: 5,
    notes: "The best first-contact story ever written. Rocky alone is worth the price.",
  },
  {
    id: "well-of-ascension",
    title: "The Well of Ascension",
    category: "books",
    cover: "/covers/well-of-ascension.png",
    coverColor: "#3A2A18",
    year: 2007,
    genre: "Fantasy",
    status: "completed",
    rating: 4,
    notes: "The difficult middle book that earns its ending. Vin's arc deepens beautifully.",
  },
  {
    id: "hero-of-ages",
    title: "The Hero of Ages",
    category: "books",
    cover: "/covers/hero-of-ages.png",
    coverColor: "#3A2A3A",
    year: 2008,
    genre: "Fantasy",
    status: "completed",
    rating: 5,
    notes: "The ending that recontextualizes everything. Sanderson at his most ambitious.",
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
