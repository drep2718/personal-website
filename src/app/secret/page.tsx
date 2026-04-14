"use client";

import { useState, useRef, useEffect } from "react";
import { MatrixRain } from "@/components/secret/matrix-rain";
import { GlitchReveal } from "@/components/secret/glitch-reveal";

export default function SecretPage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      {/* Video intro */}
      {!videoEnded && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <video
            ref={videoRef}
            src="/FINALFINAL.mp4"
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GlitchReveal />
          </div>
        </>
      )}
    </div>
  );
}
