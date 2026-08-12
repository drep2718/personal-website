import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAGI // Terminal",
  description:
    "NERV MAGI Terminal — personal command dashboard: classes, LeetCode sync trials, internship deployment tracker, pilot log, and calendar.",
  robots: { index: false, follow: false },
};

/**
 * /secret/magi
 *
 * Personal command dashboard. The terminal itself is a self-contained,
 * dependency-free document served from /public/magi.html (own CSS/JS/state via
 * localStorage). We mount it full-screen in a same-origin iframe so its styling
 * stays fully isolated from the site's global theme, while its localStorage
 * still lives under the aidendrepaniotis.com origin.
 */
export default function MagiPage() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "#0000F2",
        overflow: "hidden",
      }}
    >
      <iframe
        src="/magi.html"
        title="MAGI // NERV Terminal"
        style={{
          border: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </main>
  );
}
