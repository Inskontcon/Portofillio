"use client";

import { useEffect, useRef, ReactNode } from "react";

interface MouseParallaxProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function MouseParallax({ children, intensity = 20, className = "" }: MouseParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      
      const layers = container.querySelectorAll<HTMLElement>('[data-parallax]');
      
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.parallax || "1");
        const moveX = x * intensity * depth;
        const moveY = y * intensity * depth;
        
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
