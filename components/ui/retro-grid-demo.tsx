"use client";

import { RetroGrid } from "@/components/ui/retro-grid";

export function RetroGridDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-primary-400 via-primary-600 to-primary-800 bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Retro Grid
      </span>
      <RetroGrid />
    </div>
  );
}