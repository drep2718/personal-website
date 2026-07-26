import fs from "fs";
import path from "path";

// Photos live in /public/photos so they're served directly at /photos/<file>.
// Drop new images into that folder, commit, and they appear in the gallery.
const PHOTO_DIR = path.join(process.cwd(), "public", "photos");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

export interface Photo {
  src: string;
  name: string;
}

export function getPhotos(): Photo[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PHOTO_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => b.localeCompare(a)) // newest-named first
    .map((f) => ({
      src: `/photos/${encodeURIComponent(f)}`,
      name: f.replace(IMAGE_EXT, "").replace(/[-_]+/g, " "),
    }));
}
