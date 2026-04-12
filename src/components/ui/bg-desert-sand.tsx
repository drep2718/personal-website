"use client";

import { useEffect, useRef } from "react";

// Desert sand — raymarched dune terrain, Shane-style FBM heightmap + ripple texture, red palette
export function BgDesertSand() {
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

      #define PI    3.14159265359
      #define FAR   60.0
      #define STEPS 80

      // ── hash / noise ──────────────────────────────────────────────────────
      float hash(vec2 p){
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }
      float hash1(float n){ return fract(sin(n) * 43758.5453); }

      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.-2.*f);
        return mix(mix(hash(i),          hash(i+vec2(1,0)), u.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)), u.x), u.y);
      }

      // ── FBM terrain heightmap ─────────────────────────────────────────────
      float fbmTerrain(vec2 p){
        float v = 0., a = .5;
        vec2 shift = vec2(100.);
        mat2 rot = mat2(cos(.5), sin(.5), -sin(.5), cos(.5));
        for(int i = 0; i < 6; i++){
          v += a * noise(p);
          p = rot * p * 2.1 + shift;
          a *= .47;
        }
        return v;
      }

      // ── sand ripple texture ───────────────────────────────────────────────
      // Small-scale directional ripples like wind-blown sand
      float sandRipple(vec2 p){
        float r = 0.;
        // Primary ripple direction (slight diagonal)
        float p1 = noise(p * vec2(18., 6.) + vec2(time * 0.04, 0.));
        float p2 = noise(p * vec2(6., 20.) + vec2(0., time * 0.03));
        // Cross-hatch gives the characteristic sand texture
        r = p1 * 0.6 + p2 * 0.4;
        // Fine grain detail
        r += noise(p * 42.) * 0.15;
        return r;
      }

      // ── terrain height at xz ──────────────────────────────────────────────
      float terrainH(vec2 xz){
        // Slow drift gives sense of camera moving over dunes
        vec2 p = xz * 0.18 + vec2(time * 0.025, 0.);
        float h = fbmTerrain(p);
        // Sharpen into dune shapes (ridges)
        h = h * h * 2.2 - 0.1;
        return h;
      }

      // ── ray-terrain intersection ──────────────────────────────────────────
      float castRay(vec3 ro, vec3 rd){
        float t = 0.05;
        for(int i = 0; i < STEPS; i++){
          vec3 p = ro + rd * t;
          float h = terrainH(p.xz);
          float diff = p.y - h;
          if(diff < 0.002 * t) return t;
          // Adaptive step: step closer to surface
          t += max(0.02, diff * 0.55);
          if(t > FAR) break;
        }
        return FAR;
      }

      // ── terrain normal ────────────────────────────────────────────────────
      vec3 terrainNormal(vec3 p){
        float eps = 0.05;
        float hL = terrainH(p.xz - vec2(eps, 0.));
        float hR = terrainH(p.xz + vec2(eps, 0.));
        float hD = terrainH(p.xz - vec2(0., eps));
        float hU = terrainH(p.xz + vec2(0., eps));
        return normalize(vec3(hL - hR, 2. * eps, hD - hU));
      }

      // ── red/crimson sand palette ──────────────────────────────────────────
      vec3 sandColor(float t){
        t = clamp(t, 0., 1.);
        vec3 shadow = vec3(0.18, 0.03, 0.04);
        vec3 mid    = vec3(0.55, 0.08, 0.10);
        vec3 lit    = vec3(0.82, 0.18, 0.12);
        vec3 peak   = vec3(0.96, 0.38, 0.16);
        vec3 c = mix(shadow, mid,  smoothstep(0.,  .35, t));
        c = mix(c, lit,            smoothstep(.30, .65, t));
        c = mix(c, peak,           smoothstep(.60, 1.0, t));
        return c;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / res) * 2. - 1.;
        uv.x *= res.x / res.y;

        // ── camera ────────────────────────────────────────────────────────
        // Looking slightly down at the dunes with a slow pan
        vec3 ro = vec3(0., 1.0, 0.);
        // Ray direction: wide FOV, slight downward tilt
        vec3 rd = normalize(vec3(uv.x, uv.y * 0.7 - 0.30, 1.0));

        float t = castRay(ro, rd);

        vec3 col;

        if(t < FAR){
          vec3 pos = ro + rd * t;
          vec3 nor = terrainNormal(pos);

          // ── sun direction (low-angle, dramatic side light) ──────────────
          vec3 sun = normalize(vec3(.6, .35, .5));
          float diff = max(dot(nor, sun), 0.);
          float amb  = 0.3 + 0.2 * nor.y;

          // Sand texture
          float ripple = sandRipple(pos.xz);
          float rippleDetail = sandRipple(pos.xz * 3.7 + vec2(1.3, 4.1));

          // Blend ripple into diffuse
          float texVal = ripple * 0.7 + rippleDetail * 0.3;

          // Base sand colour from lighting + texture
          float brightness = diff * 0.8 + amb * 0.55 + texVal * 0.35;
          col = sandColor(brightness);

          // ── specular highlight from low sun ────────────────────────────
          vec3 ref = reflect(-sun, nor);
          float spec = pow(max(dot(ref, -rd), 0.), 12.) * 0.4;
          col += vec3(.9, .35, .15) * spec;

          // ── shadow-side darkening ───────────────────────────────────────
          float shadow = smoothstep(-.05, .15, diff);
          col = mix(col * 0.35, col, shadow);

          // ── distance fog ───────────────────────────────────────────────
          float fogT = 1. - exp(-t * t * 0.004);
          vec3 fogCol = vec3(0.22, 0.03, 0.05);
          col = mix(col, fogCol, fogT);

        } else {
          // ── sky: dark crimson haze near horizon ───────────────────────
          float skyT = clamp((uv.y + 0.30) / 0.9, 0., 1.);
          col = mix(vec3(0.28, 0.04, 0.06), vec3(0.06, 0.01, 0.02), skyT);
          // Subtle sun disc glow at horizon
          float sunAngle = dot(rd, normalize(vec3(.6,.35,.5)));
          col += vec3(.7,.15,.05) * pow(max(sunAngle, 0.), 8.) * .8;
          col += vec3(.9,.30,.10) * pow(max(sunAngle, 0.), 40.) * .5;
        }

        // ── vignette ─────────────────────────────────────────────────────
        col *= 1. - .35 * dot(uv * .55, uv * .55);

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
