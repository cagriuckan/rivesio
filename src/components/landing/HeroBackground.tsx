"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrapper for the Antigravity particle field (WebGL / three.js).
 * Loaded without SSR since it renders a <canvas> and needs the DOM.
 */
const Antigravity = dynamic(() => import("./Antigravity"), { ssr: false });

export default function HeroBackground() {
  return (
    <Antigravity
      count={200}
      magnetRadius={6}
      ringRadius={7}
      waveSpeed={0.4}
      waveAmplitude={1}
      particleSize={1}
      lerpSpeed={0.05}
      color="#9f8bf6"
      autoAnimate={true}
      particleVariance={1}
      rotationSpeed={0}
      depthFactor={1}
      pulseSpeed={3}
      particleShape="capsule"
      fieldStrength={1}
    />
  );
}
