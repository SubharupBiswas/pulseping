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

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={mounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.05,
            duration: 0.4,
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
