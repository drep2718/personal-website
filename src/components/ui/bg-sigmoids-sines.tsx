"use client";

import { useEffect, useRef } from "react";

// Sigmoids × Sines — iterative sigmoid(sin()) coordinate warping + motion blur, red palette
// Technique: victor_shepardson style — each iteration feeds sigmoid(sin(coord)) back into itself
export function BgSigmoidsSines() {
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

      // ── fast sigmoid: 1/(1+e^-x) ─────────────────────────────────────────
      float sig(float x){ return 1. / (1. + exp(-x)); }
      vec2  sig2(vec2 x){ return vec2(sig(x.x), sig(x.y)); }

      // ── red/crimson palette ───────────────────────────────────────────────
      vec3 redPal(float t){
        t = clamp(t, 0., 1.);
        // Íñigo Quílez cosine palette — tuned for deep red → orange-white
        vec3 a = vec3(.50, .02, .05);
        vec3 b = vec3(.50, .10, .10);
        vec3 c = vec3(1.00, .70, .50);
        vec3 d = vec3(.00, .25, .50);
        return a + b * cos(6.28318 * (c * t + d));
      }

      // ── core render at time t ─────────────────────────────────────────────
      vec3 render(vec2 uv, float t){
        // Starting coordinate — scale gives good iteration coverage
        vec2 p = uv * 1.8;

        // Iterative sigmoid × sine warp
        // Each step: p = sig(sin(A*p + phase)) remapped to [-2,2]
        for(int i = 0; i < 7; i++){
          float fi = float(i);
          float freq = 1.0 + fi * 0.38;
          float spd  = 0.28 + fi * 0.07;
          float cross = 0.30 + fi * 0.05; // cross-coupling between x and y

          vec2 arg = vec2(
            p.x * freq + t * spd        + p.y * cross + fi * 0.9,
            p.y * freq + t * spd * 0.73 + p.x * cross + fi * 1.4
          );
          // sigmoid maps to (0,1) → remap to (-2,2) for next iteration
          p = sig2(sin(arg)) * 4.0 - 2.0;
        }

        // Build colour from the final warped coordinate
        float r   = length(p);
        float ang = atan(p.y, p.x) / 6.28318 + 0.5; // 0..1

        // Combine radius and angle into a single value
        float v = fract(r * 0.35 + ang * 0.5 + t * 0.04);

        // Extra brightness from coordinate magnitude
        float bright = exp(-r * 0.4);

        return redPal(v) * (0.5 + 1.2 * bright);
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / res) * 2. - 1.;
        uv.x *= res.x / res.y;

        // ── motion blur: accumulate 8 time-offset samples ─────────────────
        // Each sample is ~1/60 s apart → blurs over roughly one frame
        vec3 col = vec3(0.);
        float blurSpread = 0.020; // seconds of blur window
        for(int i = 0; i < 8; i++){
          float dt = float(i) / 8.0 * blurSpread;
          col += render(uv, time + dt);
        }
        col /= 8.0;

        // ── tone map (tanh-style) ─────────────────────────────────────────
        vec3 e = exp(2. * col); col = (e - 1.) / (e + 1.);

        // ── vignette ─────────────────────────────────────────────────────
        col *= 1. - 0.45 * dot(uv * 0.55, uv * 0.55);

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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.82 }} />
  );
}
