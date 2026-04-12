"use client";

import { useEffect, useRef } from "react";

// Kaleidoscope — polar mirror folding, multi-layer wave synthesis, rotating coord systems, red palette
export function BgKaleidoscope() {
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

      #define PI  3.14159265359
      #define TAU 6.28318530718

      // ── rotation matrix ───────────────────────────────────────────────────
      mat2 rot2(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

      // ── polar mirror fold — creates N-fold kaleidoscope symmetry ──────────
      vec2 kfold(vec2 p, float n){
        float angle = atan(p.y, p.x);
        float sector = TAU / n;
        // Fold into one sector, then mirror
        angle = mod(angle, sector);
        if(angle > sector * 0.5) angle = sector - angle;
        float r = length(p);
        return vec2(cos(angle), sin(angle)) * r;
      }

      // ── wave pattern in folded space ──────────────────────────────────────
      float wavePat(vec2 p, float freq, float speed, float phase){
        return 0.5 + 0.5 * sin(p.x * freq + time * speed + phase)
                        * sin(p.y * freq * 0.7 + time * speed * 0.8 + phase + 1.1);
      }

      // ── layered kaleidoscope ──────────────────────────────────────────────
      // Each layer rotates independently and uses a different fold count
      float layer(vec2 uv, float folds, float rotSpeed, float rotOffset,
                  float waveFreq, float waveSpeed, float wavePhase){
        // Rotate the input space over time
        vec2 p = rot2(time * rotSpeed + rotOffset) * uv;
        // Apply fold symmetry
        p = kfold(p, folds);
        // Additional inner fold for finer detail
        p = kfold(p * 1.8 + vec2(0.3, 0.1), folds * 0.5);
        // Wave synthesis in the folded coordinate space
        float w = wavePat(p, waveFreq, waveSpeed, wavePhase);
        // Radial attenuation — brighter toward centre
        float r = length(uv);
        w *= exp(-r * 0.6);
        return w;
      }

      // ── red/crimson palette ───────────────────────────────────────────────
      vec3 kColor(float t, float hueShift){
        t = clamp(t, 0., 1.);
        // Oscillate between deep crimson and bright orange-red
        float h = hueShift;
        vec3 dark  = vec3(0.12 + h*0.05, 0.01, 0.02);
        vec3 mid   = vec3(0.65 + h*0.15, 0.06 + h*0.04, 0.08);
        vec3 vivid = vec3(0.92 + h*0.08, 0.22 + h*0.18, 0.08);
        vec3 hot   = vec3(1.00,           0.65 + h*0.20, 0.20 + h*0.15);
        vec3 c = mix(dark, mid,   smoothstep(0.,  .35, t));
        c = mix(c, vivid,         smoothstep(.30, .68, t));
        c = mix(c, hot,           smoothstep(.63, 1.0, t));
        return c;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / res) * 2. - 1.;
        uv.x *= res.x / res.y;

        // Slow global zoom breath
        float zoom = 1.0 + 0.08 * sin(time * 0.17);
        uv *= zoom;

        // ── six independent layers ────────────────────────────────────────
        // (folds, rotSpeed, rotOffset, waveFreq, waveSpeed, wavePhase)
        float l1 = layer(uv,  6., 0.12,  0.00, 4.5, 0.8, 0.0);
        float l2 = layer(uv,  8., -0.09, 1.05, 6.2, 1.1, 2.1);
        float l3 = layer(uv,  4., 0.07,  2.30, 3.8, 0.6, 4.3);
        float l4 = layer(uv, 12., -0.15, 0.70, 8.0, 1.4, 1.7);
        float l5 = layer(uv,  6., 0.10,  3.50, 5.5, 0.9, 3.0);
        float l6 = layer(uv,  3., -0.06, 1.80, 2.9, 0.5, 5.5);

        // Blend layers with slight hue variation per layer
        float cycle = sin(time * 0.08) * 0.5 + 0.5; // slow global colour cycle
        vec3 col = kColor(l1, cycle * 0.0)       * l1 * 1.20
                 + kColor(l2, cycle * 0.05)       * l2 * 1.00
                 + kColor(l3, cycle * 0.10)       * l3 * 0.90
                 + kColor(l4, cycle * 0.02)       * l4 * 0.80
                 + kColor(l5, cycle * 0.07)       * l5 * 0.85
                 + kColor(l6, cycle * 0.12)       * l6 * 0.70;

        // ── central bright core ───────────────────────────────────────────
        float core = exp(-length(uv) * 2.5) * 0.8;
        col += kColor(0.9, cycle * 0.05) * core;

        // ── tone map ─────────────────────────────────────────────────────
        vec3 e = exp(2. * col); col = (e - 1.) / (e + 1.);

        // ── vignette ─────────────────────────────────────────────────────
        col *= 1. - 0.5 * dot(uv * 0.55, uv * 0.55);

        gl_FragColor = vec4(col, 1.);
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.80 }} />
  );
}
