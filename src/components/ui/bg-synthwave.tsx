"use client";

import { useEffect, useRef } from "react";

// Synthwave canyon — neon grid floor, scanlined sun, FBM canyon walls, red palette
export function BgSynthwave() {
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

      // ── noise ──────────────────────────────────────────────────────────────
      float hash(vec2 p){
        p = fract(p * vec2(127.1,311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.-2.*f);
        return mix(mix(hash(i),          hash(i+vec2(1,0)),u.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.,a=.5;
        for(int i=0;i<5;i++){
          v+=a*noise(p); p=p*2.+vec2(5.2,1.3); a*=.5;
        }
        return v;
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy/res)*2.-1.;
        uv.x *= res.x/res.y;
        float t=time*.45;

        // ── sky ──────────────────────────────────────────────────────────────
        vec3 col=mix(vec3(.20,.02,.05), vec3(.01,.00,.015), smoothstep(-.05,.7,uv.y));

        // ── sun ──────────────────────────────────────────────────────────────
        vec2 sp=uv-vec2(0.,.05);
        float sd=length(sp);
        float sr=.21;
        // horizontal scanlines that cut through the lower half of the sun
        float scan=step(.5, fract(-sp.y*13.));
        float lowerHalf=step(0.,-sp.y);
        float inSun=smoothstep(sr+.003,sr-.003,sd)*mix(1.,scan,lowerHalf);
        col=mix(col, vec3(.96,.16,.09), inSun);
        // glow rings
        col+=vec3(.55,.04,.06)*smoothstep(.55,.00,sd)*.20;
        col+=vec3(.30,.01,.02)*smoothstep(.90,.00,sd)*.10;

        // ── canyon walls (FBM silhouettes left+right) ─────────────────────────
        // wall height increases toward screen edges
        float ax=abs(uv.x);
        float edge=max(ax-.35,0.);
        float mh=fbm(vec2(uv.x*.75,.40))*.22 + edge*.30 + .05;
        // in mountain: above horizon AND below mountain top
        float inMtn=smoothstep(mh+.012,mh-.012,uv.y)*step(0.,uv.y);
        col=mix(col, vec3(.025,.00,.008), inMtn);
        // neon rim along mountain edge
        float rim=smoothstep(mh+.025,mh+.005,uv.y)*smoothstep(mh-.008,mh+.005,uv.y)*step(0.,uv.y);
        col+=vec3(.75,.05,.12)*rim*.5;

        // ── perspective grid floor ─────────────────────────────────────────────
        float fy=.02-uv.y; // depth from horizon (positive below)
        if(fy>0.){
          float k=.09;
          float wz=k/max(fy,.0005) - t*2.8;
          float wx=uv.x*(wz/k)*0.50;
          vec2 gp=vec2(wx,wz);
          vec2 gf=abs(fract(gp)-.5);
          float lw=.028;
          float gline=max(smoothstep(.5-lw,.5,gf.x), smoothstep(.5-lw,.5,gf.y));
          vec3 gc=vec3(.769,.118,.227); // #C41E3A
          float fog=exp(-fy*6.5);
          float fadeIn=smoothstep(.02,.00,uv.y-.02);
          col=mix(col, mix(vec3(.02,.0,.01), gc*1.35, gline), fog*fadeIn);
        }

        // ── vignette ──────────────────────────────────────────────────────────
        col*=1.-.55*pow(length(uv*vec2(.85,1.05)),2.);

        // ── CRT scanlines ─────────────────────────────────────────────────────
        col*=.93+.07*sin(gl_FragCoord.y*3.14159*1.5);

        gl_FragColor=vec4(pow(max(col,vec3(0.)),.75*vec3(1.)),1.);
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
    gl.enableVertexAttribArray(pl);
    gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);

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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.88 }} />
  );
}
