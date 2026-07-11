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

  const containerClass = `${className} inline-flex flex-wrap gap-x-[0.25em]`.trim();

  if (!mounted) {
    // Render the exact structural fallback representation matching server HTML output
    return <span className={containerClass}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span className={containerClass}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: delay + i * 0.04,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1] // cubic-bezier transition curve
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </span>
  );
}
