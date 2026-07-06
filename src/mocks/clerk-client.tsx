"use client";

import React from "react";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function UserButton({ appearance }: { appearance?: any }) {
  return (
    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-400 select-none">
      U
    </div>
  );
}
