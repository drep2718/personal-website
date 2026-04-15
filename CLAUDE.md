@AGENTS.md

# Aiden's Personal Website

## Stack
- **Framework**: Next.js 16.2.3 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Inline styles (no CSS modules, no Tailwind)
- **Animations**: anime.js v4
- **Fonts**: Playfair Display (`--font-playfair`), JetBrains Mono (`--font-mono`) via `next/font/google`
- **Images**: `next/image` for all cover art

## Aesthetic
Dark academia — `#0A0703` backgrounds, `#C9A84C` gold accents, `#E8DCC8` cream text, warm browns throughout.

## Key Routes
- `/` — Main portfolio (hero, about, projects, etc.)
- `/secret` — Hidden entry: plays `/public/FINALFINAL.mp4` intro → matrix rain + glitch reveal → "ENTER THE VAULT" link
- `/secret/vault` — The Vault: `VaultHero` + `BookShelf`

## Vault Architecture (`src/components/vault/`)
- **`BookShelf.tsx`** — Main shelf component. Two rows: `books` and `anime`. Each row is a `ShelfRow`.
- **`Book3D.tsx`** — 3D book spine that tilts on hover. Used for books and manga.
- **`CD3D.tsx`** — 3D jewel case that tilts on hover. Used for anime shows (non-manga entries in the anime category).
- **`VaultModal.tsx`** — Click-to-expand full detail panel with anime.js entrance.
- **`VaultHero.tsx`** — Particle canvas hero with "THE VAULT" title.
- **`VaultLibrary.tsx`** — Tab-based grid view (alternative layout, currently unused in the vault page).

## Vault Data (`src/data/vault.ts`)
- `VaultCategory`: `"books" | "anime"` — **no games category**
- `VaultStatus`: `"completed" | "reading" | "watching" | "dropped" | "on-hold" | "plan-to"` — **no "playing"**
- `VAULT_ITEMS` — ordered by author last name alphabetically within the books section
- `CATEGORY_META` — accent colors per category
- `STATUS_META` — must have an entry for every value in `VaultStatus`

## Shelf Rendering Rules
- `category === "books"` → always `Book3D`
- `category === "anime" && genre === "Manga"` → `Book3D`
- `category === "anime" && genre !== "Manga"` → `CD3D`

## Cover Images
Stored in `/public/covers/`. Add new covers there before adding vault entries.

## Before Pushing
**Always run `npm run build` and confirm it passes before committing.** Type errors in `vault.ts` (missing STATUS_META entries, wrong VaultCategory/VaultStatus values) will fail the Vercel build silently until deployed.
