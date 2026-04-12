"use client";

import { useEffect, useRef } from "react";

// Cosmic discs — concentric rings with arc masking, radial attenuation, red palette
export function BgCosmicDiscs() {
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

      // ── hash / value noise ────────────────────────────────────────────────
      float hash(float n){ return fract(sin(n)*43758.5453123); }
      float hash2(vec2 p){
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.-2.*f);
        return mix(mix(hash2(i),          hash2(i+vec2(1,0)), u.x),
                   mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)), u.x), u.y);
      }

      // ── red palette ────────────────────────────────────────────────────────
      vec3 discColor(float t){
        t = clamp(t, 0., 1.);
        vec3 dark   = vec3(0.20, 0.01, 0.02);
        vec3 mid    = vec3(0.72, 0.06, 0.10);
        vec3 bright = vec3(0.98, 0.30, 0.12);
        vec3 hot    = vec3(1.00, 0.80, 0.50);
        vec3 c = mix(dark, mid, smoothstep(0., .4, t));
        c = mix(c, bright, smoothstep(.35, .70, t));
        c = mix(c, hot,    smoothstep(.65, 1.0, t));
        return c;
      }

      // ── single ring contribution ───────────────────────────────────────────
      // center: disc center in UV space
      // radius, ringW: ring radius and half-width
      // arcPhase: rotation offset for arc masking
      // arcDuty: fraction of ring that is "on" (0–1)
      // speed: angular rotation speed
      float ring(vec2 uv, vec2 center, float radius, float ringW,
                 float arcPhase, float arcDuty, float speed){
        vec2 d = uv - center;
        float r = length(d);
        float angle = atan(d.y, d.x); // -PI..PI

        // Radial attenuation: soft ring at given radius
        float radial = exp(-abs(r - radius) / max(ringW, 0.001));

        // Arc masking: use animated angle threshold with soft edges
        float a = mod(angle + PI + arcPhase + time * speed, TAU) / TAU; // 0..1
        // Add a bit of noise to arc boundary for organic feel
        float noiseVal = noise(vec2(angle * 2.5, time * 0.3 + arcPhase)) * 0.08;
        float arcMask = smoothstep(arcDuty + noiseVal + 0.04, arcDuty + noiseVal, a);

        return radial * arcMask;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / res) * 2. - 1.;
        uv.x *= res.x / res.y;

        float t = time;

        // Slowly drift the main centre
        vec2 c0 = vec2(sin(t * 0.07) * 0.10, cos(t * 0.05) * 0.08);

        vec3 col = vec3(0.);

        // ── single large centred disc system ──────────────────────────────
        // 7 concentric rings, each with different arc duty & speed
        float r1 = ring(uv, c0, 0.22, 0.013, 0.0,  0.72, 0.18);
        float r2 = ring(uv, c0, 0.38, 0.018, 1.1,  0.60, -0.13);
        float r3 = ring(uv, c0, 0.55, 0.014, 2.3,  0.80, 0.09);
        float r4 = ring(uv, c0, 0.72, 0.022, 0.8,  0.55, -0.07);
        float r5 = ring(uv, c0, 0.90, 0.016, 3.5,  0.75, 0.11);
        float r6 = ring(uv, c0, 1.08, 0.020, 1.9,  0.65, -0.15);
        float r7 = ring(uv, c0, 1.28, 0.014, 0.4,  0.70, 0.08);

        // Accumulate with brightness weighting
        float sum = r1*1.5 + r2*1.3 + r3*1.2 + r4*1.0 + r5*0.9 + r6*0.8 + r7*0.7;

        // Map to colour — brighter rings get hotter
        col = discColor(sum * 0.50) * sum * 0.9;

        // ── inner glow at disc centre ──────────────────────────────────────
        float glow0 = exp(-length(uv - c0) * 3.0) * 0.7;
        col += discColor(0.85) * glow0;

        // ── thin bright rim on inner ring boundaries ──────────────────────
        float rimR1 = exp(-abs(length(uv-c0)-0.22)*90.) * 0.30;
        float rimR3 = exp(-abs(length(uv-c0)-0.55)*90.) * 0.20;
        col += vec3(1.,.4,.1) * rimR1;
        col += vec3(.9,.15,.05) * rimR3;

        // ── tone mapping ──────────────────────────────────────────────────
        vec3 e = exp(2. * col); col = (e - 1.) / (e + 1.); // tanh

        // ── vignette ──────────────────────────────────────────────────────
        col *= 1. - 0.4 * dot(uv * 0.55, uv * 0.55);

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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.50 }} />
  );
}
