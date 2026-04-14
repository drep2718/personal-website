"use client";
import { useEffect, useRef } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?<>[]{}/\\|~";

const LINES = [
  { text: "> INITIALIZING SECURE CHANNEL...", color: "#444" },
  { text: "> IDENTITY: AIDEN DREPANIOTIS", color: "#C41E3A" },
  { text: "> ROLE: SOFTWARE ENGINEER", color: "#C41E3A" },
  { text: "> COMPANY: WEALTH.COM", color: "#C41E3A" },
  { text: "> CLEARANCE: LEVEL ██████", color: "#C41E3A" },
  { text: "> STATUS: ████████████", color: "#C41E3A" },
  { text: "> LOCATION: [REDACTED]", color: "#888" },
  { text: "> ACCESS GRANTED. WELCOME.", color: "#00ff88" },
];

export function TypewriterDecrypt() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    let running = true;

    const decodeChar = (
      span: HTMLSpanElement,
      final: string,
      delay: number,
      decodeDuration: number
    ): Promise<void> =>
      new Promise((resolve) => {
        if (final === " " || final === "\u00A0") {
          span.textContent = "\u00A0";
          resolve();
          return;
        }

        let timer: ReturnType<typeof setTimeout> | undefined;

        const startAt = Date.now() + delay;
        const endAt = startAt + decodeDuration;

        const tick = () => {
          if (!running) { resolve(); return; }
          const now = Date.now();
          if (now < startAt) { timer = setTimeout(tick, 16); return; }
          if (now >= endAt) { span.textContent = final; resolve(); return; }
          span.textContent = CHARSET[Math.floor(Math.random() * CHARSET.length)];
          timer = setTimeout(tick, 45);
        };

        tick();

        // Store timer for cleanup
        (span as HTMLElement & { _timer?: ReturnType<typeof setTimeout> })._timer = timer;
      });

    const runLoop = async () => {
      root.innerHTML = "";

      for (let li = 0; li < LINES.length; li++) {
        if (!running) break;
        const { text, color } = LINES[li];

        const lineEl = document.createElement("div");
        lineEl.style.cssText = `
          margin:5px 0;
          min-height:1.4em;
          opacity:0;
          transition:opacity 0.15s;
        `;
        root.appendChild(lineEl);
        requestAnimationFrame(() => { lineEl.style.opacity = "1"; });

        const promises: Promise<void>[] = [];
        text.split("").forEach((char, ci) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : "?";
          span.style.color = color;
          lineEl.appendChild(span);
          promises.push(decodeChar(span, char, ci * 22, 320));
        });

        await Promise.all(promises);
        await new Promise((r) => setTimeout(r, 90));
      }

      await new Promise((r) => setTimeout(r, 3500));
      if (running) runLoop();
    };

    runLoop();
    return () => { running = false; };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "clamp(11px,1.9vw,17px)",
        letterSpacing: "0.07em",
        lineHeight: 1.7,
        padding: "0 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        maxWidth: 700,
        margin: "0 auto",
      }}
    />
  );
}
