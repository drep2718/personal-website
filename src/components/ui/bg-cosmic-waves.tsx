"use client";

import { useEffect, useRef } from "react";

// Cosmic waves — multi-layer wave synthesis with fractal noise, starfield overlay, red palette
export function BgCosmicWaves() {
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

      // ── David Hoskins hash without sine ───────────────────────────────────
      float hash12(vec2 p){
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }
      vec2 hash22(vec2 p){
        vec3 p3 = fract(vec3(p.xyx) * vec3(.1031,.1030,.0973));
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.xx + p3.yz) * p3.zy);
      }

      // ── value noise ────────────────────────────────────────────────────────
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.-2.*f);
        return mix(mix(hash12(i),           hash12(i+vec2(1,0)), u.x),
                   mix(hash12(i+vec2(0,1)), hash12(i+vec2(1,1)), u.x), u.y);
      }

      // ── FBM ───────────────────────────────────────────────────────────────
      float fbm(vec2 p){
        float v = 0., a = .5;
        mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
        for(int i = 0; i < 5; i++){ v += a*vnoise(p); p = rot*p; a *= .5; }
        return v;
      }

      // ── red color palette ─────────────────────────────────────────────────
      vec3 waveColor(float t){
        t = clamp(t, 0., 1.);
        vec3 a = vec3(.10, .01, .02);
        vec3 b = vec3(.55, .04, .08);
        vec3 c = vec3(.85, .18, .10);
        vec3 d = vec3(1.00, .55, .20);
        vec3 col = mix(a, b, smoothstep(0., .35, t));
        col = mix(col, c, smoothstep(.30, .65, t));
        col = mix(col, d, smoothstep(.60, 1.0, t));
        return col;
      }

      // ── single wave layer ─────────────────────────────────────────────────
      // Returns brightness contribution at uv for a wave band
      float waveBand(vec2 uv, float freq, float amp, float speed,
                     float phase, float thickness, float noiseMix){
        // Horizontal travelling wave distorted by FBM noise
        float n = fbm(uv * vec2(1.2, 0.8) + vec2(time * 0.07, 0.));
        float waveY = amp * sin(uv.x * freq + time * speed + phase)
                    + amp * 0.4 * sin(uv.x * freq * 1.7 + time * speed * 1.3 + phase * 0.6)
                    + noiseMix * (n - 0.5) * amp * 2.;
        float dist = abs(uv.y - waveY);
        return exp(-dist * dist / (thickness * thickness));
      }

      // ── star field ────────────────────────────────────────────────────────
      float stars(vec2 uv, float density, float size){
        vec2 grid = floor(uv * density);
        vec2 local = fract(uv * density) - .5;
        vec2 jitter = hash22(grid) - .5;
        float d = length(local - jitter * .6);
        float brightness = hash12(grid + vec2(7.3, 1.9));
        // Twinkle
        float twinkle = .6 + .4 * sin(time * (1.5 + brightness * 3.) + brightness * TAU);
        return smoothstep(size, 0., d) * brightness * brightness * twinkle;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / res) * 2. - 1.;
        uv.x *= res.x / res.y;

        float t = time;

        // ── wave layers (varying freq, amp, speed, phase, thickness) ──────
        float w1 = waveBand(uv,  3.2, 0.30, 0.40, 0.00, 0.045, 0.6);
        float w2 = waveBand(uv,  5.1, 0.22, -0.30, 1.57, 0.035, 0.5);
        float w3 = waveBand(uv,  7.8, 0.16, 0.55, 2.80, 0.028, 0.4);
        float w4 = waveBand(uv,  2.4, 0.38, -0.20, 0.90, 0.060, 0.7);
        float w5 = waveBand(uv, 11.0, 0.10, 0.70, 4.20, 0.020, 0.3);
        float w6 = waveBand(uv,  4.5, 0.28, -0.45, 3.50, 0.038, 0.55);

        // Layer colours shift slightly per wave using slow cycling
        float cycle = sin(t * 0.12) * .5 + .5;
        float totalWave = w1*1.2 + w2*1.0 + w3*0.9 + w4*1.1 + w5*0.7 + w6*0.95;

        // Each wave tinted slightly differently along the palette
        vec3 col = waveColor(w1 * .9 + cycle * .1) * w1 * 1.1
                 + waveColor(w2 * .8 + .1)          * w2 * 0.95
                 + waveColor(w3 * .7 + .2)           * w3 * 0.85
                 + waveColor(w4 * 1.0)               * w4 * 1.05
                 + waveColor(w5 * .6 + .3)           * w5 * 0.70
                 + waveColor(w6 * .85 + .05)         * w6 * 0.90;

        // ── domain-warped background haze ─────────────────────────────────
        vec2 q = vec2(fbm(uv + t * 0.04), fbm(uv + vec2(1.7, 9.2)));
        float haze = fbm(uv * 0.8 + q * 0.6 + t * 0.02);
        col += waveColor(haze * .5) * haze * 0.12;

        // ── star field overlay ────────────────────────────────────────────
        float s  = stars(uv, 28., 0.025);
        float s2 = stars(uv, 60., 0.018);
        float s3 = stars(uv,  9., 0.040);
        vec3 starCol = vec3(.95, .30, .18) * s
                     + vec3(.80, .15, .08) * s2
                     + vec3(1.0, .60, .30) * s3;
        col += starCol * 0.65;

        // ── tone map ──────────────────────────────────────────────────────
        vec3 e = exp(2. * col); col = (e - 1.) / (e + 1.);

        // ── vignette ─────────────────────────────────────────────────────
        col *= 1. - .45 * dot(uv * .55, uv * .55);

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
