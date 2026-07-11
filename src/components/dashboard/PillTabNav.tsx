"use client";

import React from "react";
import { motion, LayoutGroup } from "framer-motion";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

/**
 * PillTabNav — hover.dev sliding pill indicator pattern.
 * The active background pill uses Framer Motion layoutId to glide
 * underneath tab labels as the user switches. Spring config:
 * stiffness 380, damping 30 (fast, subtle overshoot).
 */
export default function PillTabNav({ tabs, active, onChange }: Props) {
  return (
    <LayoutGroup id="dashboard-nav-group">
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
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className="relative z-10 px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-150"
              style={{ position: "relative" }}
            >
              {/* Sliding pill renders underneath all labels — stays mounted always */}
              {isActive && (
                <motion.div
                  layoutId="pill-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200/60 dark:border-zinc-700/60"
                  style={{ zIndex: -1, position: "absolute" }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={`relative transition-colors duration-150 ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
