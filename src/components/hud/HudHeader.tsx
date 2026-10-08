"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Search, ShieldCheck, Activity } from "lucide-react";
import { useCategory } from "@/lib/context/CategoryContext";

export function HudHeader() {
  const { activeCategory, setActiveCategory } = useCategory();
  const [timeStr, setTimeStr] = useState("");
  const [fps, setFps] = useState(60);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(" ")[0] + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle FPS simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(59 + Math.random() * 2));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "All", num: "01", label: "MODELS INDEX", badge: "1.66U" },
    { id: "Reasoning", num: "02", label: "RESEARCH PAPERS", badge: "NET" },
    { id: "Daily Chat", num: "03", label: "BENCHMARK MATRIX", badge: "GOVT" },
    { id: "Open Source", num: "04", label: "NEURAL RADAR", badge: "REALTIME" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-[1440px] mx-auto">
        <div className="glass-hud rounded-2xl px-4 sm:px-6 py-2 flex items-center justify-between relative backdrop-blur-2xl border border-white/10 bg-[#060810]/85 shadow-2xl">
          {/* Subtle Top Neon Highlight */}
          <div className="absolute top-0 left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-electric/40 to-transparent pointer-events-none" />

          {/* Left: Brand Identity & Live Status (Direct from reference image) */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-white">
                  NEURAL <span className="text-zinc-500">/</span> ARCHIVE
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-600/30 border border-violet-500/40 text-violet-300">
                  v4.1.0-STABLE
                </span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 tracking-widest hidden sm:inline-block">
                FRONTIER AI INTELLIGENCE SYSTEM
              </span>
            </div>

            {/* Live Status Pill */}
            <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-white/10 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="text-zinc-400">{timeStr || "13:32:03 UTC"}</span>
            </div>
          </div>

          {/* Center: Monospace Nav Tabs (Direct from reference image) */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 group relative ${
                    isActive
                      ? "text-white bg-white/[0.08] border border-cyan-electric/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-zinc-500">{item.num} //</span>
                  <span className="tracking-wide text-[11px]">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                        isActive
                          ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                          : "bg-white/[0.05] text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Telemetry & Actions (Direct from reference image) */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            {/* Live Metrics Widget */}
            <div className="hidden md:flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06] text-[10px]">
              <div className="flex items-center gap-1 text-cyan-electric">
                <Activity className="w-3 h-3 animate-pulse" />
                <span className="text-zinc-500">FPS</span>
                <span className="font-bold">{fps}</span>
              </div>
              <div className="w-[1px] h-2.5 bg-white/10" />
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="text-zinc-500">LAT</span>
                <span className="font-bold">14ms</span>
              </div>
            </div>

            {/* Search Pill */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] text-zinc-400 hover:text-white transition-colors">
              <Search className="w-3 h-3 text-zinc-400" />
              <span>Search</span>
              <span className="text-zinc-600">&gt;&gt;</span>
            </button>

            {/* Cyber Terminal Button */}
            <button className="px-3 py-1.5 rounded-lg bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:bg-violet-600/50 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-glow-violet">
              <Terminal className="w-3 h-3" />
              <span>&gt;_ CONNECT</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
