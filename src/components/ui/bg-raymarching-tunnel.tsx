"use client";

import { useEffect, useRef } from "react";

// Raymarching tunnel — Frostbyte_ technique, ACES tonemapping, XorDev dot noise, red palette
export function BgRaymarchingTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vert = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;

    const frag = `
      precision highp float;
      uniform vec2  res;
      uniform float time;

      // ── ACES Filmic Tonemapping ────────────────────────────────────────────
      // http://www.oscars.org/science-technology/sci-tech-projects/aces
      vec3 aces(vec3 color){
        mat3 M1 = mat3(
           0.59719,  0.07600,  0.02840,
           0.35458,  0.90834,  0.13383,
           0.04823,  0.01566,  0.83777
        );
        mat3 M2 = mat3(
           1.60475, -0.10208, -0.00327,
          -0.53108,  1.10813, -0.07276,
          -0.07367, -0.00605,  1.07602
        );
        vec3 v = M1 * color;
        vec3 a = v * (v + 0.0245786) - 0.000090537;
        vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
        return clamp(M2 * (a / b), 0., 1.);
      }

      // ── XorDev dot noise — irrational gyroid field ─────────────────────────
      // https://mini.gmshaders.com/p/phi
      float dot_noise(vec3 p){
        float PHI = 1.618033988;
        mat3 GOLD = mat3(
          -0.571464913,  0.814921382,  0.096597072,
          -0.278044873, -0.303026659,  0.911518454,
           0.772087367,  0.494042493,  0.399753815
        );
        return dot(cos(GOLD * p), sin(PHI * p * GOLD));
      }

      mat2 rot(float a){
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      void main(){
        float t = -time * 0.8 - 500.0;

        vec2 fc = gl_FragCoord.xy;

        // Aspect-corrected UV (used for orb distance)
        vec2 uv = (fc / res) * 2.0 - 1.0;
        uv.x *= res.x / res.y;

        // Perspective ray direction
        vec3 d = normalize(vec3(2.0 * fc - res.xy, -res.y));
        vec3 p = vec3(0.0, 0.0, t);
        vec3 l = vec3(0.0);

        for(int i = 0; i < 120; i++){
          vec3 rp = p;
          // Slow helical twist along z
          p.xy = rot(p.z * 0.0001) * p.xy;

          // Step distance from dot-noise field
          float s = abs(dot_noise(rp) + p.y) * 0.1 + 0.015;
          p += d * s;

          // ── field glow — red-dominant phase offsets ──────────────────────
          // Phase vec3(0.0, 1.8, 3.2) keeps red near sin-peak while G/B are offset
          vec3 phase = sin(p.z * 0.5 - vec3(0.0, 1.8, 3.2));
          // Tint: red channel full, green/blue heavily suppressed
          vec3 fieldColor = phase * vec3(1.0, 0.10, 0.04) + vec3(0.55, 0.04, 0.01);
          l += fieldColor / (abs(s * 0.001) + 1e-6);

          // ── moving red orb ────────────────────────────────────────────────
          vec2 orbPos = vec2(
            -1.0 + 2.0 * smoothstep(-1.0, 1.0, sin(t * 0.50)),
            -0.4 + sin(t * 0.25) * 0.3
          );
          float orbDist = length(uv + orbPos) * (1e-3 * abs(sin(t * 0.4) * 0.5 + 2.0));
          l += 0.3 * vec3(7.0, 1.2, 0.2) / max(orbDist, 1e-6);
        }

        // ── ACES tonemap + gamma 2.2 ──────────────────────────────────────
        vec3 col = pow(aces(l * l / 3e12), vec3(1.0 / 2.2));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pl = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pl); gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "res");
    const uTime = gl.getUniformLocation(prog, "time");

    let raf: number;
    const draw = (ms: number) => {
      raf = requestAnimationFrame(draw);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ms * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.82 }} />
  );
}
