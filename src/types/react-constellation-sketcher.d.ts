declare module "react-constellation-sketcher" {
  import * as React from "react";

  interface ConstellationSketcherProps {
    width?: number;
    height?: number;
    constellation?: string;
    slideshow?: boolean;
    animated?: boolean;
    drawLines?: boolean;
    crossFade?: boolean;
    crossFadeTime?: number;
    fadeIn?: boolean;
    fadeInTime?: number;
    weights?: {
      all?: number;
      popular?: number;
      striking?: number;
      medium?: number;
      small?: number;
    };
    style?: React.CSSProperties;
    className?: string;
  }

  const ConstellationSketcher: React.FC<ConstellationSketcherProps>;
  export default ConstellationSketcher;
  export const constellationNames: string[];
  export const categories: Record<string, string[]>;
}
