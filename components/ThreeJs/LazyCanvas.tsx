"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";

// A WebGL failure (blocked HDR, lost context, bad model) must never blank the page.
class CanvasBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[LazyCanvas] 3D scene failed, hiding it:", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface LazyCanvasProps extends CanvasProps {
  /** Classes for the wrapper div that observes visibility. */
  wrapperClassName?: string;
  /** Inline style for the wrapper div. */
  wrapperStyle?: React.CSSProperties;
  /** How far outside the viewport (px) to start mounting. */
  rootMargin?: number;
  /** Optional ref to the wrapper div (e.g. so GSAP can animate it). */
  wrapperRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Mounts the <Canvas> only when its wrapper is near the viewport, then keeps it
 * mounted (so GLB models/textures don't reload and flicker) but PAUSES rendering
 * (frameloop="never") whenever it is scrolled away.
 */
export default function LazyCanvas({
  wrapperClassName = "absolute inset-0 w-full h-full",
  wrapperStyle,
  rootMargin = 300,
  wrapperRef,
  frameloop = "always",
  dpr = [1, 1.5],
  children,
  ...canvasProps
}: LazyCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [everVisible, setEverVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { rootMargin: `${rootMargin}px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (wrapperRef) wrapperRef.current = node;
      }}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {everVisible && (
        <CanvasBoundary>
          <Canvas
            {...canvasProps}
            dpr={dpr}
            frameloop={visible ? frameloop : "never"}
          >
            {children}
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}