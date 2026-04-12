"use client";

import { useEffect, useRef } from "react";

// Domain-warped FBM noise — David Hoskins hash-without-sine, red palette
export function BgNoise() {
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

      // ── David Hoskins hash without sine ───────────────────────────────────
      // https://www.shadertoy.com/view/4djSRW  (MIT)
      float hash12(vec2 p){
        vec3 p3=fract(vec3(p.xyx)*.1031);
        p3+=dot(p3,p3.yzx+33.33);
        return fract((p3.x+p3.y)*p3.z);
      }
      vec2 hash22(vec2 p){
        vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));
        p3+=dot(p3,p3.yzx+33.33);
        return fract((p3.xx+p3.yz)*p3.zy);
      }

      // ── value noise ────────────────────────────────────────────────────────
      float vnoise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.-2.*f);
        return mix(mix(hash12(i),          hash12(i+vec2(1,0)),u.x),
                   mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x),u.y);
      }

      // ── domain-warped FBM (Íñigo Quílez technique) ─────────────────────────
      float fbm(vec2 p){
        float v=0.,a=.5;
        mat2 rot=mat2(1.6,1.2,-1.2,1.6); // scale+rotate each octave
        for(int i=0;i<6;i++){
          v+=a*vnoise(p); p=rot*p; a*=.5;
        }
        return v;
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/res;
        float t=time*.18;

        // First warp pass
        vec2 q=vec2(fbm(uv + t),
                    fbm(uv + vec2(1.0)));

        // Second warp pass
        vec2 r=vec2(fbm(uv + 1.0*q + vec2(1.7,9.2) + .15*t),
                    fbm(uv + 1.0*q + vec2(8.3,2.8) + .126*t));

        float f=fbm(uv + r);

        // Red/crimson colour map
        vec3 col=mix(
          vec3(.45,.02,.06),   // deep crimson
          vec3(.20,.01,.03),   // dark red
          clamp(f*f*4.,0.,1.)
        );
        col=mix(col,
          vec3(.80,.10,.18),   // bright red highlight
          clamp(length(r)*.8,0.,1.)
        );
        col=mix(col,
          vec3(.96,.22,.14),   // orange-red peak
          clamp(f*f*f*1.5,0.,1.)
        );

        // Brightness modulated by noise layers
        float brightness=f*f*f+.55*f*f+.45*f;
        col*=brightness;

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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }} />
  );
}
