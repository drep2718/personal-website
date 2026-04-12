"use client";

import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, ScrollControls, useScroll, Html, Float, useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { NAV_PAGES } from "@/lib/constants";

// ─── Atmosphere Fresnel shader ────────────────────────────────────────────────
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mv  = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3  glowColor;
  uniform float falloff;
  uniform float intensity;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  void main() {
    float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    rim = pow(rim, falloff);
    gl_FragColor = vec4(glowColor, rim * intensity);
  }
`;

function Atmosphere({
  size,
  color,
  scale   = 1.22,
  falloff = 3.2,
  intensity = 0.72,
}: {
  size: number; color: string; scale?: number; falloff?: number; intensity?: number;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          falloff:   { value: falloff },
          intensity: { value: intensity },
        },
        vertexShader:   ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        transparent:    true,
        depthWrite:     false,
        blending:       THREE.AdditiveBlending,
      }),
    [color, falloff, intensity]
  );
  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[size, 32, 32]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ─── Earth cloud layer ─────────────────────────────────────────────────────────
function CloudLayer({ size, cloudTex }: { size: number; cloudTex: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.025; });
  return (
    <mesh ref={ref} scale={[1.018, 1.018, 1.018]}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        map={cloudTex}
        alphaMap={cloudTex}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Saturn/Jupiter rings — custom geometry for correct UV (inner→outer) ─────
function usePlanetRingGeo(innerR: number, outerR: number) {
  return useMemo(() => {
    const SEG = 256;
    const pos: number[] = [], uvs: number[] = [], idx: number[] = [];
    for (let i = 0; i <= SEG; i++) {
      const θ = (i / SEG) * Math.PI * 2;
      const c = Math.cos(θ), s = Math.sin(θ), v = i / SEG;
      pos.push(innerR * c, 0, innerR * s); uvs.push(0, v);
      pos.push(outerR * c, 0, outerR * s); uvs.push(1, v);
    }
    for (let i = 0; i < SEG; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, d, a, d, c, d, b, a, c, d, a); // both sides
    }
    const geo = new THREE.BufferGeometry();
    geo.setIndex(idx);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv",       new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, [innerR, outerR]);
}

function SaturnRings({ size, ringTex }: { size: number; ringTex: THREE.Texture }) {
  const geo = usePlanetRingGeo(size * 1.35, size * 2.65);
  const mat = useMemo(() => {
    const t = ringTex.clone();
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return new THREE.MeshBasicMaterial({
      map:         t,
      side:        THREE.DoubleSide,
      transparent: true,
      depthWrite:  false,
      alphaTest:   0.005,
    });
  }, [ringTex]);

  return (
    // Tilt ~26° so rings are clearly visible from camera
    <group rotation={[0.0, 0.0, 0.0]}>
      <mesh geometry={geo} material={mat} rotation={[-0.42, 0, 0.18]} />
    </group>
  );
}

// ─── Tiny faint Jupiter rings ─────────────────────────────────────────────────
function JupiterRings({ size }: { size: number }) {
  const geo = usePlanetRingGeo(size * 1.4, size * 1.95);
  return (
    <mesh geometry={geo} rotation={[-0.12, 0, 0.05]}>
      <meshBasicMaterial color="#705030" side={THREE.DoubleSide} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  );
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
function Sun({ sunTex }: { sunTex: THREE.Texture }) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.05;
      // Animate texture offset for flowing solar surface
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        2.2 + Math.sin(state.clock.elapsedTime * 1.1) * 0.2;
    }
  });

  return (
    <group>
      <pointLight intensity={160} distance={320} color="#FFA040" decay={1.5} />

      {/* Outer corona — Fresnel glow layers */}
      <Atmosphere size={2.0} color="#FF9020" scale={2.0} falloff={1.5} intensity={0.14} />
      <Atmosphere size={2.0} color="#FF7000" scale={1.55} falloff={2.2} intensity={0.22} />
      <Atmosphere size={2.0} color="#FFB040" scale={1.30} falloff={3.0} intensity={0.40} />

      {/* Sun body */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={sunTex}
          emissive="#FF7800"
          emissiveIntensity={2.2}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      <Html position={[0, 2.9, 0]} center style={{ pointerEvents: "none" }}>
        <div style={{ color: "rgba(255,175,80,0.6)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 500, textShadow: "0 0 12px rgba(255,100,0,0.5)", whiteSpace: "nowrap" }}>
          Home
        </div>
      </Html>
    </group>
  );
}

// ─── Planet configs ───────────────────────────────────────────────────────────
// Indexed in the same order as NAV_PAGES: about, skills, projects, blog, interests, resume
const PLANET_STYLES = [
  { size: 2.0, atmoColor: "#4A8FD9", atmoFalloff: 3.5, atmoI: 0.70, clouds: true,  rings: false, jupRings: false, rotSpeed: 0.45 }, // Earth
  { size: 1.6, atmoColor: "#C8A830", atmoFalloff: 2.5, atmoI: 0.55, clouds: false, rings: false, jupRings: false, rotSpeed: 0.25 }, // Venus
  { size: 1.4, atmoColor: "#C05028", atmoFalloff: 4.0, atmoI: 0.30, clouds: false, rings: false, jupRings: false, rotSpeed: 0.85 }, // Mars
  { size: 1.0, atmoColor: null,       atmoFalloff: 0,   atmoI: 0,    clouds: false, rings: false, jupRings: false, rotSpeed: 0.18 }, // Mercury
  { size: 3.2, atmoColor: "#C87830", atmoFalloff: 2.8, atmoI: 0.38, clouds: false, rings: false, jupRings: true,  rotSpeed: 2.40 }, // Jupiter
  { size: 2.5, atmoColor: "#C8A870", atmoFalloff: 3.2, atmoI: 0.35, clouds: false, rings: true,  jupRings: false, rotSpeed: 2.20 }, // Saturn
] as const;

const SPACING = 24;
const TOTAL_Z  = (NAV_PAGES.length + 1) * SPACING;

// ─── Planet ───────────────────────────────────────────────────────────────────
function Planet({
  page, position, style, tex, cloudTex, ringTex,
}: {
  page:     (typeof NAV_PAGES)[number];
  position: [number, number, number];
  style:    (typeof PLANET_STYLES)[number];
  tex:      THREE.Texture;
  cloudTex?: THREE.Texture;
  ringTex?:  THREE.Texture;
}) {
  const groupRef  = useRef<THREE.Group>(null);
  const meshRef   = useRef<THREE.Mesh>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const wpRef     = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);
  const router    = useRouter();

  useFrame((state, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * style.rotSpeed * 0.05;
    if (groupRef.current && labelRef.current) {
      groupRef.current.getWorldPosition(wpRef.current);
      const dist   = Math.abs(wpRef.current.z - state.camera.position.z);
      const opacity = Math.max(0, Math.min(1, 1 - (dist - 14) / 18));
      labelRef.current.style.opacity       = String(opacity);
      labelRef.current.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={0.9} floatIntensity={0.28} rotationIntensity={0.04}>
        <mesh
          ref={meshRef}
          onClick={() => router.push(page.path)}
          onPointerOver={() => { setHovered(true);  document.body.style.cursor = "pointer"; }}
          onPointerOut ={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[style.size, 64, 64]} />
          <meshStandardMaterial
            map={tex}
            emissiveIntensity={hovered ? 0.35 : 0.0}
            roughness={0.75}
            metalness={0.04}
          />
        </mesh>

        {/* Atmosphere rim glow */}
        {style.atmoColor && (
          <Atmosphere
            size={style.size}
            color={style.atmoColor}
            falloff={style.atmoFalloff}
            intensity={style.atmoI}
          />
        )}

        {/* Earth clouds */}
        {style.clouds && cloudTex && <CloudLayer size={style.size} cloudTex={cloudTex} />}

        {/* Saturn rings */}
        {style.rings && ringTex && <SaturnRings size={style.size} ringTex={ringTex} />}

        {/* Jupiter faint rings */}
        {style.jupRings && <JupiterRings size={style.size} />}

        {/* Hover glow bloom */}
        {hovered && style.atmoColor && (
          <Atmosphere size={style.size} color={style.atmoColor} scale={1.35} falloff={2.0} intensity={0.5} />
        )}

        {/* Label — fades in/out via ref DOM mutation */}
        <Html position={[0, style.size + 2.1, 0]} center occlude={false}>
          <div ref={labelRef} style={{ opacity: 0, transition: "color 0.25s" }}>
            <button
              onClick={() => router.push(page.path)}
              style={{
                color: hovered ? "#ff7070" : "rgba(255,255,255,0.9)",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                textShadow: hovered ? "0 0 14px rgba(220,60,60,0.7)" : "0 0 8px rgba(0,0,0,0.95)",
                background: "none",
                border:     "none",
                cursor:     "pointer",
                padding:     0,
                fontFamily:  "inherit",
              }}
            >
              {page.label}
            </button>
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ─── Scene (all textures loaded here so one Suspense catches everything) ──────
function SceneContent({ onLoaded }: { onLoaded: () => void }) {
  const textures = useTexture([
    "/textures/sun.jpg",
    "/textures/earth_day.jpg",
    "/textures/earth_clouds.jpg",
    "/textures/venus.jpg",
    "/textures/mars.jpg",
    "/textures/mercury.jpg",
    "/textures/jupiter.jpg",
    "/textures/saturn.jpg",
    "/textures/saturn_ring.png",
  ]) as THREE.Texture[];
  const [sunT, earthT, cloudsT, venusT, marsT, mercuryT, jupiterT, saturnT, ringT] = textures;

  const groupRef = useRef<THREE.Group>(null);
  const scroll   = useScroll();

  useEffect(() => { onLoaded(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    if (!groupRef.current) return;
    const target = scroll.offset * TOTAL_Z;
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z, target, 0.058
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(state.clock.elapsedTime * 0.11) * 0.5,
      0.018
    );
  });

  const texByIndex = [earthT, venusT, marsT, mercuryT, jupiterT, saturnT];

  return (
    <>
      <color attach="background" args={["#000008"]} />
      <Stars radius={180} depth={80} count={7000} factor={4} fade speed={0.3} />
      <ambientLight intensity={0.08} />
      <directionalLight position={[-30, 10, -80]} intensity={0.25} color="#7070FF" />

      <group ref={groupRef}>
        <Sun sunTex={sunT} />

        {NAV_PAGES.map((page, i) => (
          <Planet
            key={page.id}
            page={page}
            style={PLANET_STYLES[i]}
            tex={texByIndex[i]}
            cloudTex={i === 0 ? cloudsT : undefined}
            ringTex={i === 5 ? ringT   : undefined}
            position={[
              Math.sin(i * 1.05) * 2.5,
              Math.cos(i * 0.80) * 1.0,
              -(i + 1) * SPACING,
            ]}
          />
        ))}
      </group>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function Landing() {
  const [ready, setReady] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>

      {/* Loading overlay */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          zIndex:     20,
          background: "#000008",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          transition: "opacity 0.6s ease",
          opacity:    ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "inherit" }}>
          Loading Solar System
        </p>
        <div style={{ width: 120, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "rgba(196,30,58,0.7)", animation: "loadbar 1.8s ease-in-out infinite", borderRadius: 1 }} />
        </div>
        <style>{`@keyframes loadbar { 0%{width:0%;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0%;margin-left:100%} }`}</style>
      </div>

      {/* Name / tagline */}
      <div style={{ position: "absolute", top: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.44em", color: "rgba(255,255,255,0.36)", textTransform: "uppercase", marginBottom: "10px", fontFamily: "inherit" }}>
          Software Engineer
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 300, letterSpacing: "-0.03em", margin: 0, color: "#ffffff", fontFamily: "inherit" }}>
          Aiden{" "}
          <span style={{ fontWeight: 700, background: "linear-gradient(135deg, #C41E3A 20%, #ff6b8a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Drep
          </span>
        </h1>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "rgba(255,255,255,0.26)", fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", pointerEvents: "none" }}>
        Scroll to explore · Click to enter
      </div>

      <Canvas
        camera={{ position: [0, 2, 18], fov: 50, near: 0.1, far: 600 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={NAV_PAGES.length + 1} damping={0.16} distance={1}>
            <SceneContent onLoaded={() => setReady(true)} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
