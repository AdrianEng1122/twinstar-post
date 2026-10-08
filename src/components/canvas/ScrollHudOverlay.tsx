"use client";

import React from "react";
import { AiModel } from "@/lib/models/types";
import { Move, Sparkles, ArrowUpRight } from "lucide-react";

interface ScrollHudOverlayProps {
  scrollProgress: number; // 0 to 1
  models: AiModel[];
  selectedModel: AiModel | null;
  onSelectModel: (model: AiModel) => void;
  onJumpToPhase?: (phaseTargetProgress: number) => void;
}

export function ScrollHudOverlay({
  models,
  selectedModel,
  onSelectModel,
}: ScrollHudOverlayProps) {
  // Top 5 models shown in bottom switcher matching image
  const displayModels = models.slice(0, 5);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-7 select-none font-mono">
      {/* 1. Four Corner Sci-Fi Telemetry Brackets (Exact Replica of Reference Image) */}
      {/* Top Left */}
      <div className="absolute top-16 left-6 flex flex-col gap-0.5 text-[9px] text-zinc-500 hidden sm:flex">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <div className="w-1.5 h-1.5 border-t border-l border-zinc-500" />
          <span>SYS_CONFIG // L7_A</span>
        </div>
        <div className="pl-2 text-[8px] text-zinc-600">LAT // 37.7749° N</div>
      </div>

      {/* Top Right */}
      <div className="absolute top-16 right-6 flex flex-col items-end gap-0.5 text-[9px] text-zinc-500 hidden sm:flex">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span>SEC_LEVEL // CHESA</span>
          <div className="w-1.5 h-1.5 border-t border-r border-zinc-500" />
        </div>
        <div className="pr-2 text-[8px] text-zinc-600">NODE: TO-P030781</div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-0.5 text-[9px] text-zinc-500 hidden sm:flex">
        <div className="pl-2 text-[8px] text-zinc-600">SYS_CONFIG // L7_A</div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <div className="w-1.5 h-1.5 border-b border-l border-zinc-500" />
          <span>NEURAL // ARCHIVE 2026</span>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 text-[9px] text-zinc-400 hidden sm:flex">
        <div className="pr-2 text-[8px] text-emerald-400">ORBITAL CONTROL // ACTIVE</div>
        <div className="flex items-center gap-1.5 text-cyan-electric">
          <Move className="w-3 h-3 animate-pulse" />
          <span className="tracking-wider">DRAG TO ROTATE 360°</span>
          <div className="w-1.5 h-1.5 border-b border-r border-cyan-electric" />
        </div>
      </div>

      {/* 2. Sub-Header Action Pills Bar (Direct from reference image) */}
      <div className="w-full flex flex-col items-center gap-3 pt-12 sm:pt-14 pointer-events-auto">
        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-zinc-400 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric animate-pulse" />
          <span className="text-white font-semibold">PHASE 3 // ACTIVE</span>
          <span className="text-white/20">•</span>
          <span className="text-zinc-400">FRONTIER CORES & DEEP NEURAL TRACKING</span>
        </div>

        {/* Action Button Pair (Exact from reference image) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const el = document.getElementById("quantum-experience-stage");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-electric bg-cyan-electric/10 hover:bg-cyan-electric/20 border border-cyan-electric/50 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all flex items-center gap-1.5 group"
          >
            <span>INTERACT WITH 3D VIEWPORT</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <a
            href="/api/models?limit=12"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>EXPLORE RESEARCH SPECS</span>
          </a>
        </div>
      </div>

      {/* 3. Bottom Model Switcher Pill Strip (Exact from reference image) */}
      <div className="w-full flex flex-col items-center gap-2 pb-2 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          <span className="text-[10px] text-zinc-500 px-2.5 py-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-electric" />
            <span>ACTIVE:</span>
          </span>

          {displayModels.map((m) => {
            const isActive = selectedModel?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModel(m)}
                className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-cyan-electric/20 border border-cyan-electric/60 text-cyan-electric shadow-[0_0_15px_rgba(0,240,255,0.3)] font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
