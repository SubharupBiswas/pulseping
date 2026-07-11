"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function HeroText({ text, className = "", delay = 0 }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render the exact structural fallback representation matching server HTML output
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.35,
            ease: "easeOut"
          }}
          className="mr-1 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
