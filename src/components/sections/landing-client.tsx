"use client";

import dynamic from "next/dynamic";

const LandingScene = dynamic(
  () => import("./landing").then((m) => ({ default: m.Landing })),
  { ssr: false }
);

export default function LandingClient() {
  return <LandingScene />;
}
