"use client";

import { useEffect, useRef } from "react";

// Animated Julia set — Íñigo Quílez IFS + color palette, red/crimson
export function BgFractals() {
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

      // ── Íñigo Quílez cosine color palette ─────────────────────────────────
      // https://iquilezles.org/articles/palettes/  (MIT)
      vec3 palette(float t){
        vec3 a=vec3(.45,.02,.08);
        vec3 b=vec3(.50,.10,.12);
        vec3 c=vec3(1.00,.80,.60);
        vec3 d=vec3(.00,.33,.67);
        return a + b*cos(6.28318*(c*t+d));
      }

      // ── smooth Julia iteration count ───────────────────────────────────────
      float julia(vec2 uv, vec2 c){
        vec2 z=uv;
        float n=0.;
        for(int i=0;i<128;i++){
          z=vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y)+c;
          if(dot(z,z)>64.) break;
          n+=1.;
        }
        // Smooth escape — removes banding
        return n - log2(log2(dot(z,z))) + 4.;
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy/res)*2.-1.;
        uv.x*=res.x/res.y;

        float t=time*.08;

        // Animate c along a figure-8 path for endless variety
        vec2 c=vec2(
          .7885*cos(t),
          .7885*sin(t*1.618)  // golden ratio for non-repeating orbit
        );

        // Zoom — kept tight so fractal fills the screen behind cards
        float zoom=0.65+.15*sin(time*.04);
        uv*=zoom;

        float n=julia(uv, c);

        // Interior = black, exterior = palette
        float escaped=(dot(uv+vec2(c),uv+vec2(c))>64.) ? 0. : 1.;
        vec3 col=palette(n*.03 + time*.05);

        // Dark interior
        float interior=step(128., n);
        col=mix(col, vec3(.0), interior);

        // Subtle glow on boundary
        float boundary=exp(-abs(n - floor(n) - .5)*4.)*.3;
        col+=vec3(.8,.05,.1)*boundary;

        // Vignette
        col*=1.-.5*dot(uv/zoom, uv/zoom)*.3;

        gl_FragColor=vec4(pow(max(col,vec3(0.)), vec3(.8)), 1.);
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.95 }} />
  );
}
