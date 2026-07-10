"use client";

import React from "react";
import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

/**
 * HeroText — hover.dev spring word-cascade reveal.
 * Splits text into individual words, each springs in with blur-to-sharp,
 * opacity 0→1, and a subtle upward translate.
 * Spring config: stiffness 260, damping 20 (slightly bouncy, premium feel).
 */
export default function HeroText({ text, className = "", delay = 0 }: Props) {
  const words = text.split(" ");

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariant = {
    hidden: {
      opacity: 0,
      y: 22,
      filter: "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.span
      className={`inline ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
