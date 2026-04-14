"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SecretPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => router.replace("/");
    video.addEventListener("ended", onEnded);
    video.play();

    return () => video.removeEventListener("ended", onEnded);
  }, [router]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <video
        ref={videoRef}
        src="/FINALFINAL.mp4"
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
