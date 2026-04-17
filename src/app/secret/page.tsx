"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MatrixRain } from "@/components/secret/matrix-rain";
import { GlitchReveal } from "@/components/secret/glitch-reveal";

export default function SecretPage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const vaultLinkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    // Prefetch vault page JS while the video is playing so navigation is instant
    router.prefetch("/secret/vault");
  }, [router]);

  // Animate vault link in after reveal completes
  useEffect(() => {
    if (!revealDone || !vaultLinkRef.current) return;
    const run = async () => {
      const { animate } = await import("animejs");
      animate(vaultLinkRef.current!, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 800,
        ease: "easeOutExpo",
        delay: 300,
      });
    };
    run();
  }, [revealDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Video intro */}
      {!videoEnded && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <video
            ref={videoRef}
            src="/FINALFINAL_web.mp4"
            playsInline
            muted
            onEnded={() => setVideoEnded(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Matrix rain + glitch reveal (shown after video ends) */}
      {videoEnded && (
        <>
          <div style={{ position: "absolute", inset: 0 }}>
            <MatrixRain />
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
            }}
          >
            <GlitchReveal onComplete={() => setRevealDone(true)} />

            {/* Vault entry link — fades in after name locks */}
            <a
              ref={vaultLinkRef}
              href="/secret/vault"
              onClick={(e) => {
                e.preventDefault();
                router.push("/secret/vault");
              }}
              style={{
                opacity: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.35em",
                  color: "rgba(201,168,76,0.6)",
                }}
              >
                // ACCESS GRANTED
              </span>
              <span
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(15px, 2vw, 20px)",
                  letterSpacing: "0.15em",
                  color: "#C9A84C",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.textShadow =
                    "0 0 20px rgba(201,168,76,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.textShadow = "none";
                }}
              >
                ENTER THE VAULT
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12L12 2M12 2H5M12 2V9"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
