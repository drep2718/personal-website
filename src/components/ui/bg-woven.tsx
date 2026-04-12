"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Particle torus-knot that reacts to mouse — red palette
export function BgWoven() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };

    // ── geometry ──────────────────────────────────────────────────────────────
    const COUNT = 14000;
    const positions        = new Float32Array(COUNT * 3);
    const originalPositions = new Float32Array(COUNT * 3);
    const colors            = new Float32Array(COUNT * 3);
    const velocities        = new Float32Array(COUNT * 3);

    const knot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const knotCount = knot.attributes.position.count;

    const tmp = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const vi = i % knotCount;
      const x = knot.attributes.position.getX(vi);
      const y = knot.attributes.position.getY(vi);
      const z = knot.attributes.position.getZ(vi);
      positions[i*3]   = originalPositions[i*3]   = x;
      positions[i*3+1] = originalPositions[i*3+1] = y;
      positions[i*3+2] = originalPositions[i*3+2] = z;
      // Red spectrum: hue 0.92–1.0 (crimson → deep red)
      tmp.setHSL(0.94 + (Math.random() - 0.5) * 0.06, 0.85, 0.42 + Math.random() * 0.28);
      colors[i*3] = tmp.r; colors[i*3+1] = tmp.g; colors[i*3+2] = tmp.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.028, vertexColors: true,
      blending: THREE.NormalBlending, transparent: true, depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── mouse ────────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    // ── animate (no per-frame Vector3 alloc) ──────────────────────────────────
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const mwx = mouse.x * 3, mwy = mouse.y * 3;

      for (let i = 0; i < COUNT; i++) {
        const ix = i*3, iy = ix+1, iz = ix+2;
        const cx = positions[ix], cy = positions[iy], cz = positions[iz];
        let vx = velocities[ix], vy = velocities[iy], vz = velocities[iz];

        const dx = cx - mwx, dy = cy - mwy, dz = cz;
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < 2.25) {
          const inv = (1.5 - Math.sqrt(d2)) * 0.012 / (Math.sqrt(d2) + 0.001);
          vx += dx * inv; vy += dy * inv;
        }
        vx += (originalPositions[ix] - cx) * 0.001;
        vy += (originalPositions[iy] - cy) * 0.001;
        vz += (originalPositions[iz] - cz) * 0.001;
        vx *= 0.95; vy *= 0.95; vz *= 0.95;

        positions[ix] = cx + vx; positions[iy] = cy + vy; positions[iz] = cz + vz;
        velocities[ix] = vx; velocities[iy] = vy; velocities[iz] = vz;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); knot.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.45 }}
    />
  );
}
