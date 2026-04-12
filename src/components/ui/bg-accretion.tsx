"use client";

import { useEffect, useRef } from "react";

// Accretion disk around a black hole
// Polar coordinate approach, Keplerian rotation, tanh tone mapping
// Inspired by XorDev's ShaderToy WcKXDV — red plasma palette
export function BgAccretion() {
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

      // ── hash / noise ──────────────────────────────────────────────────────
      float hash(vec2 p){
        p=fract(p*vec2(127.1,311.7));
        p+=dot(p,p+19.19);
        return fract(p.x*p.y);
      }
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        vec2 u=f*f*(3.-2.*f);
        return mix(mix(hash(i),          hash(i+vec2(1,0)),u.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.,a=.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.1+vec2(3.1,1.7); a*=.5; }
        return v;
      }

      // ── disk helpers ──────────────────────────────────────────────────────
      // Keplerian angular velocity: ω ∝ r^(-3/2)
      float omega(float r){ return pow(max(r,.01), -1.5)*0.35; }

      // Hot plasma colour: black → deep red → orange → bright yellow-white
      vec3 plasmaColor(float t){
        t=clamp(t,0.,1.);
        vec3 c=vec3(0.);
        c=mix(c,         vec3(.5,.01,.02), smoothstep(0.,.20,t));
        c=mix(c,         vec3(.8,.05,.05), smoothstep(.15,.35,t));
        c=mix(c,         vec3(.9,.20,.05), smoothstep(.30,.55,t));
        c=mix(c,         vec3(.95,.55,.10),smoothstep(.50,.72,t));
        c=mix(c,         vec3(1.,.85,.40), smoothstep(.68,.90,t));
        c=mix(c,         vec3(1.,1.,.90),  smoothstep(.85,1.,t));
        return c;
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy/res)*2.-1.;
        uv.x*=res.x/res.y;
        float t=time;

        // ── slight perspective tilt so disk has depth ──────────────────────
        // squish y to simulate looking slightly down at the disk
        uv.y*=1.35;

        float r=length(uv);
        float angle=atan(uv.y,uv.x);

        // ── event horizon + photon sphere ──────────────────────────────────
        float rBH=.12;          // event horizon radius
        float rPS=rBH*1.5;      // photon sphere
        // photon sphere lensing glow
        float lensGlow=smoothstep(rPS+.04,rPS,r)*smoothstep(rBH,rPS,r);

        // ── disk density ───────────────────────────────────────────────────
        float rInner=.18, rOuter=.72;
        // Radial profile: sharp inner edge, exponential outer fall-off
        float radial=smoothstep(rInner*.95,rInner*1.2,r)*exp(-max(r-rInner,0.)*2.8);

        // Keplerian winding: inner parts lap outer parts
        float w=omega(r);
        float phi=angle - w*t;    // co-rotating coordinate

        // Turbulent disk structure in polar space
        vec2 diskUV=vec2(phi/TAU+.5, (r-rInner)/(rOuter-rInner));
        float turb=fbm(diskUV*vec2(8.,4.) + vec2(0.,t*.12));

        // Thin filaments / gas streams
        float streams=abs(sin(phi*6. - r*18. + t*w*12.))*
                      abs(cos(phi*3. + r*9.  + t*w*6.));
        streams=pow(streams,.6);

        float density=radial*(turb*.6+streams*.4+.3);

        // ── Doppler beaming ────────────────────────────────────────────────
        // Prograde orbit: left side approaches (angle ≈ +π/2 from x-axis)
        // Doppler factor: d = 1 ± v*cos(θ_obs), v ≈ sqrt(1/r) for Keplerian
        float v=clamp(sqrt(1./max(r,.05))*.45,0.,.85);
        // Velocity direction is tangential; project onto line-of-sight (≈ uv.x / r)
        float cosTheta= uv.x / max(r,.001);
        float doppler=1./(1. - v*cosTheta);
        doppler=pow(doppler,3.5); // intensity ∝ δ^(3+α), α≈1

        density*=doppler;
        density=clamp(density,0.,8.);

        // ── colour ─────────────────────────────────────────────────────────
        vec3 diskCol=plasmaColor(density*.18)*density*.35;

        // Inner edge is hottest
        float innerEdge=smoothstep(rInner*1.3,rInner,r)*smoothstep(rBH,rInner,r);
        diskCol+=plasmaColor(.9)*innerEdge*2.5;

        // Photon sphere arc glow
        diskCol+=vec3(.9,.15,.05)*lensGlow*3.;

        // ── background ─────────────────────────────────────────────────────
        vec3 col=vec3(0.);
        col+=diskCol;

        // ── tanh tone mapping (XorDev's technique) ─────────────────────────
        // WebGL 1.0 has no vec3 tanh — manual implementation
        vec3 _e=exp(2.*col*1.2); col=(_e-1.)/(_e+1.);

        // Black hole shadow
        float shadow=1.-smoothstep(rBH*.85,rBH*1.0,r);
        col*=1.-shadow;

        // ── vignette ───────────────────────────────────────────────────────
        col*=1.-.35*dot(uv*.6,uv*.6);

        gl_FragColor=vec4(col,1.);
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.85 }} />
  );
}
