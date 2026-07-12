"use client";
import React from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function HeroText({ text, className = "", delay = 0 }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        willChange: "transform",
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
      className="animate-fade-up"
    >
      <span className={className}>
        {text}
      </span>
    </span>
  );
}
