"use client";

import { useEffect, useRef } from "react";

// Ray-marched ocean — red/crimson palette, adapted from TDM sea (MIT)
export function BgSea() {
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

    const vert = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.,1.); }`;

    // All functions declared before their callers — GLSL ES 1.0 requirement
    const frag = `
      precision highp float;
      uniform vec2  resolution;
      uniform float time;

      #define NUM_STEPS 8
      #define ITER_GEO  3
      #define ITER_FRAG 5
      #define SEA_HEIGHT  0.6
      #define SEA_CHOPPY  4.0
      #define SEA_SPEED   1.4
      #define SEA_FREQ    0.16
      #define SEA_BASE    vec3(0.10, 0.01, 0.03)
      #define SEA_WATER   vec3(0.72, 0.08, 0.16)
      #define OCT_M       mat2(1.6, 1.2, -1.2, 1.6)

      // ── helpers ──────────────────────────────────────────────────────────────
      float hash(vec2 p){
        float h=dot(p,vec2(127.1,311.7));
        return fract(sin(h)*43758.5453123);
      }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.-2.*f);
        return -1.+2.*mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                          mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
      }
      float seaOctave(vec2 uv, float choppy){
        uv+=noise(uv);
        vec2 wv=1.-abs(sin(uv)), swv=abs(cos(uv));
        wv=mix(wv,swv,wv);
        return pow(1.-pow(wv.x*wv.y,.65),choppy);
      }

      // ── sea height maps ───────────────────────────────────────────────────────
      float mapSea(vec3 p){
        float freq=SEA_FREQ, amp=SEA_HEIGHT, choppy=SEA_CHOPPY, h=0.;
        vec2 uv=p.xz; uv.x*=.75;
        float t=time*SEA_SPEED;
        for(int i=0;i<ITER_GEO;i++){
          float d=seaOctave((uv+t)*freq,choppy)+seaOctave((uv-t)*freq,choppy);
          h+=d*amp; uv*=OCT_M; freq*=1.9; amp*=.22; choppy=mix(choppy,1.,.2);
        }
        return p.y-h;
      }
      float mapDetailed(vec3 p){
        float freq=SEA_FREQ, amp=SEA_HEIGHT, choppy=SEA_CHOPPY, h=0.;
        vec2 uv=p.xz; uv.x*=.75;
        float t=time*SEA_SPEED;
        for(int i=0;i<ITER_FRAG;i++){
          float d=seaOctave((uv+t)*freq,choppy)+seaOctave((uv-t)*freq,choppy);
          h+=d*amp; uv*=OCT_M; freq*=1.9; amp*=.22; choppy=mix(choppy,1.,.2);
        }
        return p.y-h;
      }
      vec3 seaNormal(vec3 p, float eps){
        vec3 n;
        n.y=mapDetailed(p);
        n.x=mapDetailed(vec3(p.x+eps,p.y,p.z))-n.y;
        n.z=mapDetailed(vec3(p.x,p.y,p.z+eps))-n.y;
        n.y=eps;
        return normalize(n);
      }

      // ── tracing ───────────────────────────────────────────────────────────────
      float traceHeight(vec3 ori, vec3 dir, out vec3 p){
        float tm=0., tx=1000., hx=mapSea(ori+dir*tx);
        if(hx>0.){ p=ori+dir*tx; return tx; }
        float hm=mapSea(ori+dir*tm), tmid=0.;
        for(int i=0;i<NUM_STEPS;i++){
          tmid=mix(tm,tx,hm/(hm-hx));
          p=ori+dir*tmid;
          float hmid=mapSea(p);
          if(hmid<0.){ tx=tmid; hx=hmid; } else { tm=tmid; hm=hmid; }
        }
        return tmid;
      }

      // ── shading ───────────────────────────────────────────────────────────────
      vec3 skyColor(vec3 e){
        e.y=max(e.y,0.);
        return mix(vec3(.05,.01,.02), vec3(.20,.03,.05), pow(1.-e.y,2.));
      }
      float diffuse(vec3 n, vec3 l, float p){ return pow(dot(n,l)*.4+.6,p); }
      float specular(vec3 n, vec3 l, vec3 e, float s){
        float nrm=(s+8.)/(3.14159*8.);
        return pow(max(dot(reflect(e,n),l),0.),s)*nrm;
      }
      vec3 seaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist){
        float fresnel=clamp(1.-dot(n,-eye),0.,1.);
        fresnel=min(pow(fresnel,3.),.5);
        vec3 refl=skyColor(reflect(eye,n));
        vec3 refr=SEA_BASE+diffuse(n,l,80.)*SEA_WATER*.12;
        vec3 col=mix(refr,refl,fresnel);
        float atten=max(1.-dot(dist,dist)*.001,0.);
        col+=SEA_WATER*(p.y-SEA_HEIGHT)*.18*atten;
        col+=vec3(specular(n,l,eye,60.));
        return col;
      }

      // ── camera ────────────────────────────────────────────────────────────────
      mat3 rotY(float a){
        return mat3(cos(a),0.,sin(a), 0.,1.,0., -sin(a),0.,cos(a));
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy/resolution.xy)*2.-1.;
        uv.x*=resolution.x/resolution.y;
        float t=time*.25;

        vec3 ori=vec3(0.,3.5,t*5.);
        vec3 dir=normalize(vec3(uv,-2.));
        dir.z+=length(uv)*.14;
        dir=normalize(rotY(sin(t*.3)*.15)*dir);

        vec3 p;
        traceHeight(ori,dir,p);
        vec3 dist=p-ori;
        vec3 n=seaNormal(p,dot(dist,dist)*.00015);
        vec3 light=normalize(vec3(0.,1.,.8));

        float blend=pow(smoothstep(0.,-.02,dir.y),.2);
        vec3 col=mix(skyColor(dir), seaColor(p,n,light,normalize(dir),dist), blend);
        col=pow(col,vec3(.65));
        gl_FragColor=vec4(col,1.);
      }
    `;

    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "resolution");
    const uTime = gl.getUniformLocation(prog, "time");

    let raf: number;
    const draw = (ms: number) => {
      raf = requestAnimationFrame(draw);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ms * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.95 }}
    />
  );
}
