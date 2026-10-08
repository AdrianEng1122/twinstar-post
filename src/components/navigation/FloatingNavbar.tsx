"use client";

import React, { useEffect, useState } from "react";
import {
  Radio,
  Newspaper,
  Box,
  BookOpen,
  Clock,
  Flame,
  Search,
  Palette,
  Check,
} from "lucide-react";
import { NewsSource } from "@/lib/news/types";
import { PaperThemeId, PAPER_THEMES } from "@/lib/theme/paperTheme";

interface FloatingNavbarProps {
  activeSource: NewsSource | "all";
  onSourceChange: (source: NewsSource | "all") => void;
  viewMode: "3d" | "reader";
  onViewModeToggle: () => void;
  onOpenSearch: () => void;
  theme: PaperThemeId;
  onThemeChange: (theme: PaperThemeId) => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  activeSource,
  onSourceChange,
  viewMode,
  onViewModeToggle,
  onOpenSearch,
  theme,
  onThemeChange,
}) => {
  const [timeString, setTimeString] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);

  // Live real-time clock (UTC+8 / Malaysia Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("zh-MY", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateString(
        now.toLocaleDateString("zh-Hans-CN", {
          month: "numeric",
          day: "numeric",
          weekday: "short",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/10 text-white select-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Live Digital Edition Badge & Real-Time Clock */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b91c1c] text-white font-serif-sc text-[11px] font-bold tracking-wider shadow-sm">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>双星时报 // EXTRA</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/60">
            <span>{dateString}</span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-[#ffd8a8] font-bold">
              <Clock className="w-3 h-3" />
              <span>{timeString || "12:00:00"}</span>
              <span className="text-[10px] text-white/40">KL</span>
            </span>
          </div>
        </div>

        {/* Center: Source Filter Tabs */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-full text-xs font-serif-sc">
          <button
            onClick={() => onSourceChange("all")}
            className={`px-3 sm:px-4 py-1 rounded-full transition-all ${
              activeSource === "all"
                ? "bg-white/20 text-white font-bold shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            全部 All
          </button>
          <button
            onClick={() => onSourceChange("sinchew")}
            className={`px-3 sm:px-4 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              activeSource === "sinchew"
                ? "bg-[#b91c1c] text-white font-bold shadow-sm"
                : "text-white/60 hover:text-[#ff8080]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] hidden sm:inline-block" />
            <span>星洲日报</span>
          </button>
          <button
            onClick={() => onSourceChange("chinapress")}
            className={`px-3 sm:px-4 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              activeSource === "chinapress"
                ? "bg-[#1e3a5f] text-white font-bold shadow-sm"
                : "text-white/60 hover:text-[#90caf9]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#90caf9] hidden sm:inline-block" />
            <span>中国报</span>
          </button>
        </div>

        {/* Right: Search, Theme Switcher, Weekly Radar & View Mode Switch */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Spotlight Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-xs font-serif-sc font-medium text-white/80 hover:text-white transition-all shadow-sm"
            title="全局即时搜索 (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-[#ffd8a8]" />
            <span className="hidden lg:inline">搜索</span>
            <span className="hidden sm:inline text-[10px] font-mono text-white/40 bg-white/10 px-1 py-0.2 rounded">
              ⌘K
            </span>
          </button>

          {/* 3D Paper Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-xs font-serif-sc font-medium text-white/80 hover:text-white transition-all shadow-sm"
              title="切换 3D 报纸材质与色调"
            >
              <Palette className="w-3.5 h-3.5 text-[#ffd8a8]" />
              <span className="hidden sm:inline">{PAPER_THEMES[theme]?.name || "纸张"}</span>
            </button>

            {isThemeOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsThemeOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#121216]/95 border border-white/20 p-2 shadow-2xl z-50 backdrop-blur-xl text-white flex flex-col gap-1 font-serif-sc">
                  <div className="px-2.5 py-1 text-[11px] font-mono text-white/40 border-b border-white/10 mb-1">
                    选择 3D 报纸材质与色调
                  </div>
                  {(["vintage", "sepia", "monochrome", "modern"] as const).map((tKey) => {
                    const cfg = PAPER_THEMES[tKey];
                    const isSelected = theme === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          onThemeChange(tKey);
                          setIsThemeOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          isSelected
                            ? "bg-white/20 text-white font-bold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cfg.icon}</span>
                          <span>{cfg.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ffd8a8]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Weekly Heat Radar Shortcut */}
          <button
            onClick={() => {
              const radar = document.getElementById("weekly-heat-radar");
              if (radar) {
                radar.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#b91c1c]/40 bg-[#b91c1c]/20 hover:bg-[#b91c1c]/30 text-xs font-serif-sc font-medium text-[#ffd8a8] transition-all shadow-sm"
            title="直达本周热度风云榜"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff6b6b] animate-pulse" />
            <span className="hidden sm:inline">本周热榜</span>
          </button>

          <button
            onClick={onViewModeToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 text-xs font-serif-sc font-medium text-white transition-all shadow-sm"
            title="切换阅读模式"
          >
            {viewMode === "3d" ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#ffd8a8]" />
                <span className="hidden md:inline">切至 极简阅读器</span>
                <span className="md:hidden">极简版</span>
              </>
            ) : (
              <>
                <Box className="w-3.5 h-3.5 text-[#ffd8a8]" />
                <span className="hidden md:inline">切至 3D 报章视效</span>
                <span className="md:hidden">3D 版</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
