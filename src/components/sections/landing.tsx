"use client";

import { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Html, Float, useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { NAV_PAGES } from "@/lib/constants";
import * as THREE from "three";
import { ConstellationBackground } from "@/components/ui/constellation-background";

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
  const geo = usePlanetRingGeo(size * 1.38, size * 2.38);
  const mat = useMemo(() => {
    const t = ringTex.clone();
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return new THREE.MeshBasicMaterial({
      map:         t,
      side:        THREE.DoubleSide,
      transparent: true,
      depthWrite:  false,
      // No alphaTest — proper transparent pass so depth-tests against opaque planets
    });
  }, [ringTex]);

  return (
    // renderOrder -1 → renders before atmospheres in transparent pass;
    // depthTest (default true) ensures it's occluded by any closer opaque mesh
    <mesh geometry={geo} material={mat} rotation={[-0.38, 0, 0.14]} renderOrder={-1} />
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
// Indexed in the same order as NAV_PAGES: about, projects, experience, skills, interests, resume
const PLANET_STYLES = [
  { size: 2.0, atmoColor: "#4A8FD9", atmoFalloff: 3.5, atmoI: 0.70, clouds: true,  rings: false, rotSpeed: 0.45 }, // Earth
  { size: 1.6, atmoColor: "#C8A830", atmoFalloff: 2.5, atmoI: 0.55, clouds: false, rings: false, rotSpeed: 0.25 }, // Venus
  { size: 1.4, atmoColor: "#C05028", atmoFalloff: 4.0, atmoI: 0.30, clouds: false, rings: false, rotSpeed: 0.85 }, // Mars
  { size: 1.0, atmoColor: null,      atmoFalloff: 0,   atmoI: 0,    clouds: false, rings: false, rotSpeed: 0.18 }, // Mercury
  { size: 3.2, atmoColor: "#C87830", atmoFalloff: 2.8, atmoI: 0.38, clouds: false, rings: false, rotSpeed: 2.40 }, // Jupiter
  { size: 2.5, atmoColor: "#C8A870", atmoFalloff: 3.2, atmoI: 0.35, clouds: false, rings: true,  rotSpeed: 2.20 }, // Saturn
] as const;

const SPACING = 30;

// Fixed world positions — planets never move, camera flies to them
const PLANET_POS = NAV_PAGES.map((_, i): [number, number, number] => [
  Math.sin(i * 1.1) * 2.0,
  Math.cos(i * 0.75) * 0.9,
  -(i + 1) * SPACING,
]);

// One camera stop per scroll page: [sun, planet0 … planet5]
const NUM_STOPS = NAV_PAGES.length + 1;
const CAM_STOPS = [
  { pos: new THREE.Vector3(0, 1.5, 16),  look: new THREE.Vector3(0, 0, 0) },
  ...PLANET_POS.map(([px, py, pz], i) => {
    const dist = PLANET_STYLES[i].size * 5.2 + 5; // scale viewing distance to planet size
    return {
      pos:  new THREE.Vector3(px * 0.25, py + 2.0, pz + dist),
      look: new THREE.Vector3(px, py, pz),
    };
  }),
];

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
  const meshRef   = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const router    = useRouter();

  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * style.rotSpeed * 0.05;
  });

  return (
    <group position={position}>
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
            emissive={"#ffffff"}
            emissiveMap={tex}
            emissiveIntensity={hovered ? 0.90 : 0.65}
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

        {/* Hover glow bloom */}
        {hovered && style.atmoColor && (
          <Atmosphere size={style.size} color={style.atmoColor} scale={1.35} falloff={2.0} intensity={0.5} />
        )}

      </Float>
    </group>
  );
}

// ─── Scene (all textures loaded here so one Suspense catches everything) ──────
function SceneContent({ onLoaded, onSectionChange, onScrollReady }: { onLoaded: () => void; onSectionChange: (idx: number) => void; onScrollReady: (el: HTMLElement) => void }) {
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

  const scroll    = useScroll();
  // Cached vectors — no allocation per frame
  const camPos    = useRef(new THREE.Vector3(0, 1.5, 16));
  const lookPos   = useRef(new THREE.Vector3(0, 0, 0));
  const tmpCam    = useRef(new THREE.Vector3());
  const tmpLook   = useRef(new THREE.Vector3());
  const lastSection = useRef(-2);

  useEffect(() => {
    onLoaded();
    if (scroll.el) onScrollReady(scroll.el as HTMLElement);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    // Map scroll 0→1 across all stops
    const raw  = scroll.offset * (NUM_STOPS - 1);
    const i0   = Math.min(Math.floor(raw), NUM_STOPS - 2);
    const i1   = i0 + 1;
    const t    = raw - i0;
    // Smoothstep easing so each planet "snaps" into focus with ease-in-out
    const ease = t * t * (3 - 2 * t);

    tmpCam.current.lerpVectors(CAM_STOPS[i0].pos,  CAM_STOPS[i1].pos,  ease);
    tmpLook.current.lerpVectors(CAM_STOPS[i0].look, CAM_STOPS[i1].look, ease);

    // Damp toward target — feels like flying through space
    camPos.current.lerp(tmpCam.current, 0.072);
    lookPos.current.lerp(tmpLook.current, 0.072);

    state.camera.position.copy(camPos.current);
    state.camera.lookAt(lookPos.current);

    // Notify active section — only fires on change, no per-frame React re-render
    const section = Math.max(-1, Math.min(NAV_PAGES.length - 1, Math.round(raw) - 1));
    if (section !== lastSection.current) {
      lastSection.current = section;
      onSectionChange(section);
    }
  });

  const texByIndex = [earthT, venusT, marsT, mercuryT, jupiterT, saturnT];

  return (
    <>
      <ambientLight intensity={0.80} />
      <directionalLight position={[-30, 10, -80]} intensity={1.10} color="#8090FF" />
      <directionalLight position={[30, 5, -40]}   intensity={0.55} color="#FFD0A0" />
      <directionalLight position={[0, 20, -20]}   intensity={0.40} color="#ffffff" />

      {/* Planets are STATIC — camera moves to them */}
      <Sun sunTex={sunT} />

      {NAV_PAGES.map((page, i) => (
        <Planet
          key={page.id}
          page={page}
          style={PLANET_STYLES[i]}
          tex={texByIndex[i]}
          cloudTex={i === 0 ? cloudsT : undefined}
          ringTex={i === 5 ? ringT   : undefined}
          position={PLANET_POS[i]}
        />
      ))}
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function Landing() {
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1=sun, 0-5=planets
  const scrollElRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const activePage = activeIndex >= 0 ? NAV_PAGES[activeIndex] : null;

  const scrollToSection = useCallback((index: number) => {
    const el = scrollElRef.current;
    if (!el) { router.push(NAV_PAGES[index].path); return; }
    const maxScroll = el.scrollHeight - el.clientHeight;
    const targetOffset = (index + 1) / (NUM_STOPS - 1);
    el.scrollTo({ top: targetOffset * maxScroll, behavior: "smooth" });
    // Navigate after camera has time to fly to the planet
    setTimeout(() => router.push(NAV_PAGES[index].path), 2200);
  }, [router]);

  return (
    <div className="landing-scene" style={{ width: "100vw", height: "100vh", position: "relative", background: "#000008", overflow: "hidden" }}>

      {/* Constellation background — scattered star patterns forming in a loop */}
      <ConstellationBackground />

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
          Loading
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
        <h1 style={{
          fontSize:      "clamp(2.0rem, 5.5vw, 4.5rem)",
          fontWeight:    200,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin:        0,
          color:         "#ffffff",
          fontFamily:    "inherit",
          textShadow:    "0 0 40px rgba(255,255,255,0.18), 0 0 80px rgba(196,30,58,0.15)",
        }}>
          Aiden Drepaniotis
        </h1>
      </div>

      {/* Planet label — simple text above the planet */}
      <div
        style={{
          position:      "absolute",
          top:           "30%",
          left:          "50%",
          transform:     "translateX(-50%)",
          zIndex:        15,
          textAlign:     "center",
          pointerEvents: "none",
          opacity:       activePage ? 1 : 0,
          transition:    "opacity 0.45s ease",
        }}
      >
        <p style={{
          margin:        0,
          fontSize:      "11px",
          fontWeight:    500,
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.55)",
          fontFamily:    "inherit",
          whiteSpace:    "nowrap",
        }}>
          {activePage?.label}
        </p>
      </div>

      {/* Scroll hint — above the sun */}
      <div style={{ position: "absolute", top: "68%", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none", transition: "opacity 0.5s ease", opacity: ready && !activePage ? 1 : 0 }}>
        <p style={{ margin: 0, marginBottom: "10px", color: "rgba(255,255,255,0.55)", fontSize: "10px", letterSpacing: "0.36em", textTransform: "uppercase", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          Scroll to explore · Click to enter
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.25)", borderRadius: 1, animation: "scrollpulse 1.6s ease-in-out infinite" }} />
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid rgba(255,255,255,0.35)", animation: "scrollpulse 1.6s ease-in-out infinite 0.15s" }} />
        </div>
        <style>{`
          @keyframes scrollpulse {
            0%, 100% { opacity: 0.25; transform: translateY(0); }
            50%       { opacity: 0.80; transform: translateY(5px); }
          }
        `}</style>
      </div>

      {/* Sidebar nav — left side (desktop only) */}
      <nav
        className="landing-nav-desktop"
        style={{
          position:      "absolute",
          left:          "2rem",
          top:           "50%",
          transform:     "translateY(-50%)",
          zIndex:        15,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-start",
          gap:           "3rem",
          opacity:       ready ? 1 : 0,
          transition:    "opacity 0.6s ease",
        }}
      >
        {NAV_PAGES.map((page, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={page.id}
              onClick={() => scrollToSection(i)}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "1.25rem",
                background: "none",
                border:     "none",
                padding:    0,
                cursor:     "pointer",
              }}
            >
              <span
                style={{
                  width:        isActive ? "18px" : "10px",
                  height:       isActive ? "18px" : "10px",
                  borderRadius: "50%",
                  background:   isActive ? "#C41E3A" : "rgba(255,255,255,0.35)",
                  boxShadow:    isActive ? "0 0 16px rgba(196,30,58,0.9)" : "none",
                  transition:   "all 0.3s ease",
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontSize:      "20px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color:         isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                  transition:    "color 0.3s ease",
                  fontFamily:    "inherit",
                  fontWeight:    isActive ? 600 : 300,
                  whiteSpace:    "nowrap",
                }}
              >
                {page.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom nav — mobile only */}
      <nav
        className="landing-nav-mobile"
        style={{
          position:       "absolute",
          bottom:         "2rem",
          left:           0,
          right:          0,
          zIndex:         15,
          display:        "flex",
          flexDirection:  "row",
          justifyContent: "center",
          alignItems:     "flex-end",
          gap:            "0",
          opacity:        ready ? 1 : 0,
          transition:     "opacity 0.6s ease",
          padding:        "0 1rem",
        }}
      >
        {NAV_PAGES.map((page, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={page.id}
              onClick={() => scrollToSection(i)}
              style={{
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                gap:            "6px",
                background:     "none",
                border:         "none",
                padding:        "8px 0",
                cursor:         "pointer",
                flex:           1,
                minWidth:       0,
              }}
            >
              <span
                style={{
                  width:        isActive ? "10px" : "6px",
                  height:       isActive ? "10px" : "6px",
                  borderRadius: "50%",
                  background:   isActive ? "#C41E3A" : "rgba(255,255,255,0.35)",
                  boxShadow:    isActive ? "0 0 10px rgba(196,30,58,0.9)" : "none",
                  transition:   "all 0.3s ease",
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontSize:      "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                  transition:    "color 0.3s ease",
                  fontFamily:    "inherit",
                  fontWeight:    isActive ? 600 : 300,
                  whiteSpace:    "nowrap",
                  overflow:      "hidden",
                  textOverflow:  "ellipsis",
                  maxWidth:      "100%",
                }}
              >
                {page.label}
              </span>
            </button>
          );
        })}
      </nav>

      <Canvas
        camera={{ position: [0, 2, 18], fov: 50, near: 0.1, far: 600 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        className="solar-canvas"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={NAV_PAGES.length * 2} damping={0.22} distance={1}>
            <SceneContent
              onLoaded={() => setReady(true)}
              onSectionChange={setActiveIndex}
              onScrollReady={(el) => { scrollElRef.current = el; }}
            />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
