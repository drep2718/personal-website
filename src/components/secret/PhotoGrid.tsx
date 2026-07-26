"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/photos";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  return (
    <>
      {/* Masonry grid via CSS columns */}
      <div className="[column-gap:1rem] columns-1 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActive(i)}
            className="group mb-4 block w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-red)]"
            aria-label={`View ${photo.name || "photo"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.name || "Photograph"}
              loading="lazy"
              className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
          >
            <X size={26} />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
                className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
                className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}
          <figure className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[active].src}
              alt={photos[active].name || "Photograph"}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg"
            />
            {photos[active].name && (
              <figcaption className="text-xs tracking-[0.15em] uppercase text-white/50">
                {photos[active].name}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
