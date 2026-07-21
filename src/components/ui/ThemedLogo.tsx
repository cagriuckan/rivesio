"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Renders the Rivesio wordmark logo, automatically switching between
 * `/logo-light.png` (for dark theme) and `/logo-dark.png` (for light theme)
 * based on the current `data-theme` attribute on the root element.
 */
export default function ThemedLogo({
  width = 100,
  height = 36,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    function sync() {
      setIsDark(root.getAttribute("data-theme") === "dark");
    }

    sync();

    // Watch for theme changes via attribute mutation
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <Image
      src={isDark ? "/logo-dark.png" : "/logo-light.png"}
      alt="Rivesio"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
