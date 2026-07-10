"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export default function PillTabNav({ tabs, active, onChange }: Props) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  return (
    <div
      className="relative flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 w-fit"
      role="tablist"
      aria-label="Dashboard navigation"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-150 ${
              isActive
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="pill-indicator"
                className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200/60 dark:border-zinc-700/60"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
