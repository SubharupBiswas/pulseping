import React from "react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-sky-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/10 selection:text-emerald-500 font-sans antialiased relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[440px] bg-gradient-to-tr from-emerald-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Sticky Header Outline */}
      <header className="sticky top-0 z-50 bg-sky-50/80 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-850 backdrop-blur-xl h-14 flex items-center">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
            <div className="w-20 h-4 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
            <div className="w-24 h-6 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
            <div className="w-8 h-8 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
          </div>
        </div>
      </header>

      {/* Main Skeleton */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-8">
        
        {/* Page Title Placeholder */}
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
          <div className="h-4 w-72 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
        </div>

        {/* Metric Ribbon Block Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[90px] p-4 flex flex-col justify-between">
            <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
            <div className="h-6 w-12 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
          </div>
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[90px] p-4 flex flex-col justify-between">
            <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
            <div className="h-6 w-8 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
          </div>
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[90px] p-4 flex flex-col justify-between">
            <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
            <div className="h-6 w-16 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
          </div>
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[90px] p-4 flex flex-col justify-between">
            <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
            <div className="h-6 w-10 bg-zinc-300 dark:bg-zinc-700/80 rounded" />
          </div>
        </div>

        {/* Tab Nav Outline */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-850 pb-px">
          <div className="h-8 w-20 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
          <div className="h-8 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
          <div className="h-8 w-20 animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl" />
        </div>

        {/* Grid Panels */}
        <div className="space-y-4">
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[140px]" />
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[140px]" />
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-xl min-h-[140px]" />
        </div>
      </main>
    </div>
  );
}
