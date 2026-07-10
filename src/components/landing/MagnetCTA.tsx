"use client";

import React, { useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Max pixel translation toward cursor. Default: 18 */
  strength?: number;
};

/**
 * MagnetCTA — hover.dev magnetic button pattern.
 * When cursor enters proximity, element springs toward pointer position.
 * On mouse leave, springs back to origin with natural physics.
 *
 * Spring config: stiffness 350, damping 20 (fast, slightly springy).
 */
export default function MagnetCTA({ children, className = "", strength = 18 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness: 350, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      // Scale: map to ±strength px, clamped
      const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
      x.set(clamp(deltaX * 0.35, strength));
      y.set(clamp(deltaY * 0.35, strength));
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnet-btn ${className}`}
    >
      {children}
    </motion.div>
  );
}
