"use client";

import { MatrixRain } from "@/components/secret/matrix-rain";
import { GlitchReveal } from "@/components/secret/glitch-reveal";

export default function SecretPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Matrix rain fills the background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <MatrixRain />
      </div>

      {/* Glitch reveal sits centered on top */}
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
    </div>
  );
}
