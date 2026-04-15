"use client";
import dynamic from "next/dynamic";

const BookShelf = dynamic(
  () => import("./BookShelf").then((m) => ({ default: m.BookShelf })),
  { ssr: false, loading: () => <div style={{ minHeight: "100vh", background: "#0A0703" }} /> }
);

export function VaultClient() {
  return <BookShelf />;
}
