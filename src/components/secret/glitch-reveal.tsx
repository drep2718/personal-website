"use client";
import { useEffect, useRef } from "react";

const GLITCH_CHARS = "アイウエオABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!?█▓▒░▄▀";

const LINES = [
  { text: "// CLASSIFIED", size: "clamp(13px,1.8vw,18px)", weight: "400", color: "#555", spacing: "0.5em" },
  { text: "AIDEN", size: "clamp(48px,8vw,112px)", weight: "800", color: "#C41E3A", spacing: "0.06em" },
  { text: "DREPANIOTIS", size: "clamp(22px,3.8vw,56px)", weight: "700", color: "#fff", spacing: "0.18em" },
];

export function GlitchReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    let running = true;

    const run = async () => {
      const { animate, stagger } = await import("animejs");
      if (!running) return;

      root.innerHTML = "";
      const allSpans: { span: HTMLSpanElement; target: string }[] = [];

      LINES.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.style.cssText = `
          display:block;
          font-family:'JetBrains Mono',monospace;
          font-size:${line.size};
          font-weight:${line.weight};
          letter-spacing:${line.spacing};
          color:${line.color};
          line-height:1.15;
          margin:4px 0;
        `;
        root.appendChild(lineEl);

        line.text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.style.cssText = "display:inline-block;opacity:0;";
          span.textContent =
            char === " "
              ? "\u00A0"
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          lineEl.appendChild(span);
          allSpans.push({ span, target: char });
        });
      });

      // Continuously glitch visible chars
      let glitching = true;
      const lockedIndices = new Set<number>();
      const glitchLoop = setInterval(() => {
        if (!glitching) return;
        allSpans.forEach(({ span, target }, i) => {
          if (lockedIndices.has(i)) return;
          if (target !== " " && parseFloat(span.style.opacity || "0") > 0.1) {
            span.textContent =
              GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        });
      }, 55);

      // Animate chars in
      animate(
        allSpans.map((s) => s.span),
        {
          opacity: [0, 1],
          y: [24, 0],
          duration: 700,
          delay: stagger(35),
          easing: "easeOutExpo",
          onComplete: () => {
            // Lock in real chars one by one
            allSpans.forEach(({ span, target }, i) => {
              setTimeout(() => {
                if (!running) return;
                lockedIndices.add(i);
                span.textContent = target === " " ? "\u00A0" : target;
                // Flash white
                span.style.color = "#fff";
                setTimeout(() => {
                  span.style.color = "";
                  span.style.transition = "color 0.3s";
                }, 80);
              }, i * 28);
            });

            // Restart loop
            setTimeout(
              () => {
                glitching = false;
                clearInterval(glitchLoop);
                if (running) {
                  animate(
                    allSpans.map((s) => s.span),
                    {
                      opacity: [1, 0],
                      y: [0, -24],
                      duration: 500,
                      delay: stagger(20, { from: "last" }),
                      easing: "easeInExpo",
                      onComplete: () => {
                        if (running) setTimeout(run, 600);
                      },
                    }
                  );
                }
              },
              allSpans.length * 28 + 2800
            );
          },
        }
      );

      return () => {
        glitching = false;
        clearInterval(glitchLoop);
      };
    };

    let cleanupInner: (() => void) | undefined;
    run().then((fn) => { cleanupInner = fn; });

    return () => {
      running = false;
      if (cleanupInner) cleanupInner();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        textAlign: "center",
      }}
    />
  );
}
