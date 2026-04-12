"use client";

import { PaperTexture } from "@paper-design/shaders-react";

// Paper texture shader — red/dark-red palette
export function BgPaper() {
  return (
    <PaperTexture
      colorFront="#C41E3A"
      colorBack="#1a0008"
      contrast={0.55}
      roughness={0.5}
      fiber={0.35}
      fiberSize={0.18}
      crumples={0.4}
      crumpleSize={0.3}
      folds={0.5}
      foldCount={6}
      drops={0.15}
      seed={3.2}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        opacity:       0.45,
        width:         "100%",
        height:        "100%",
      }}
    />
  );
}
