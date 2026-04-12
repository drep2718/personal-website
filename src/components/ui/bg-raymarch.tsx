"use client";

import { useEffect, useRef } from "react";

// WebGL raymarching — SDF metaballs, red palette
export function BgRaymarch() {
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

    const vert = `
      attribute vec2 position;
      void main(){ gl_Position=vec4(position,0.,1.); }
    `;

    const frag = `
      precision highp float;
      uniform vec2  resolution;
      uniform float time;

      #define MAX_STEPS 80
      #define MAX_DIST  100.
      #define SURF_DIST .01

      float sdSphere(vec3 p,float r){ return length(p)-r; }

      float smin(float a,float b,float k){
        float h=clamp(.5+.5*(b-a)/k,0.,1.);
        return mix(b,a,h)-k*h*(1.-h);
      }

      float scene(vec3 p){
        float s1=sdSphere(p-vec3(sin(time*.5)*1.5,0.,0.),.8);
        float s2=sdSphere(p-vec3(cos(time*.7)*1.5,sin(time*.3)*.5,0.),.6);
        float s3=sdSphere(p-vec3(0.,cos(time*.4)*1.5,0.),.7);
        float bx=length(max(abs(p-vec3(cos(time*.2)*.5,sin(time*.6)*.5,0.))-vec3(.4),0.));
        return smin(smin(smin(s1,s2,.5),s3,.4),bx,.3);
      }

      float march(vec3 ro,vec3 rd){
        float d=0.;
        for(int i=0;i<MAX_STEPS;i++){
          vec3 p=ro+rd*d;
          float s=scene(p);
          d+=s;
          if(d>MAX_DIST||s<SURF_DIST) break;
        }
        return d;
      }

      vec3 normal(vec3 p){
        float d=scene(p);
        vec2 e=vec2(.01,0.);
        return normalize(d-vec3(scene(p-e.xyy),scene(p-e.yxy),scene(p-e.yyx)));
      }

      vec3 shade(vec3 p,vec3 rd){
        vec3 lp=vec3(3.*sin(time*.5),3.,3.*cos(time*.5));
        vec3 l=normalize(lp-p);
        vec3 n=normal(p);
        float diff=max(dot(n,l),0.);
        float shadow=march(p+n*SURF_DIST*2.,l);
        if(shadow<length(lp-p)) diff*=.1;
        vec3 h=normalize(l-rd);
        float spec=pow(max(dot(n,h),0.),32.);
        // #C41E3A
        return vec3(.769,.118,.227)*diff+vec3(1.)*spec*.3;
      }

      void main(){
        vec2 uv=(gl_FragCoord.xy-resolution*.5)/resolution.y;
        vec3 ro=vec3(0.,0.,5.);
        vec3 rd=normalize(vec3(uv,-1.));
        float d=march(ro,rd);
        vec3 col=vec3(0.);
        if(d<MAX_DIST){ col=shade(ro+rd*d,rd); }
        col=pow(col,vec3(.4545));
        gl_FragColor=vec4(col,1.);
      }
    `;

    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, "resolution");
    const uTime = gl.getUniformLocation(prog, "time");

    let raf: number;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }}
    />
  );
}
