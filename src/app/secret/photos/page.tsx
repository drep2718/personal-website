import type { Metadata } from "next";
import { SecretHeader } from "@/components/secret/SecretHeader";
import { PhotoGrid } from "@/components/secret/PhotoGrid";
import { getPhotos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Photographs — Aiden Drepaniotis",
  robots: { index: false, follow: false },
};

export default function PhotosPage() {
  const photos = getPhotos();

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)]">
      <SecretHeader crumb="Gallery" />
      <div className="mx-auto max-w-5xl px-6 md:px-8 pt-28 pb-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Through the lens
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-[var(--color-text-primary)]">
            Photographs
          </h1>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
            A rolling gallery of frames I&apos;m proud of. It grows whenever I do.
          </p>
        </div>

        {photos.length > 0 ? (
          <PhotoGrid photos={photos} />
        ) : (
          <div className="content-panel text-center px-8 py-16 max-w-xl mx-auto">
            <p className="text-4xl mb-4">📷</p>
            <p className="text-[var(--color-text-primary)] font-medium mb-2">No photos yet</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Drop images into{" "}
              <code className="text-[var(--color-accent-red)]">public/photos/</code>, commit, and
              they&apos;ll show up here automatically.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
