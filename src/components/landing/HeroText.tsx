"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function HeroText({ text, className = "", delay = 0 }: Props) {
  return (
    <motion.span
      style={{ display: "inline-block", willChange: "transform" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className={className}>
        {text}
      </span>
    </motion.span>
  );
}
