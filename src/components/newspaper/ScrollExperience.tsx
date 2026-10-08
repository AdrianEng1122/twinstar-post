"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { NewsArticle, NewsSource } from "@/lib/news/types";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mockData";
import { PaperThemeId } from "@/lib/theme/paperTheme";
import { useSpring } from "framer-motion";
import {
  Compass,
  BookOpen,
  ArrowDown,
  Layers,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Flame,
} from "lucide-react";

// Dynamically import Three.js scene with ssr: false to prevent WebGL hydration mismatches
const NewspaperScene = dynamic(
  () => import("@/components/canvas/NewspaperScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0C] text-[#F4EFEA]">
        <div className="w-12 h-12 border-2 border-[#b91c1c] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif-sc text-sm tracking-widest uppercase text-[#999]">
          载入 3D 报刊物理渲染视口...
        </p>
      </div>
    ),
  }
);

interface ScrollExperienceProps {
  articles?: NewsArticle[];
  activeSource?: NewsSource | "all";
  theme?: PaperThemeId;
  onSourceChange?: (source: NewsSource | "all") => void;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const ScrollExperience: React.FC<ScrollExperienceProps> = ({
  articles: propArticles,
  activeSource = "all",
  theme = "vintage",
  onSourceChange,
  onSelectArticle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const [internalArticles, setInternalArticles] = useState<NewsArticle[]>(MOCK_NEWS_ARTICLES);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const activeArticles = propArticles && propArticles.length > 0 ? propArticles : internalArticles;

  // Framer Motion physical spring with tight responsive tracking (low mass, no sluggish delay)
  const spring = useSpring(0, { damping: 28, stiffness: 180, mass: 0.25 });

  useEffect(() => {
    return spring.on("change", (latest) => {
      setSmoothedProgress(Math.min(Math.max(latest, 0), 1));
    });
  }, [spring]);

  // Fetch real-time news data if not passed by parent
  useEffect(() => {
    if (propArticles && propArticles.length > 0) return;
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (data && data.articles && data.articles.length > 0) {
            setInternalArticles(data.articles);
          }
        }
      } catch (err) {
        console.warn("Using fallback news data for 3D broadsheet:", err);
      }
    }
    loadNews();
  }, [propArticles]);

  // Track scroll progress across the 300vh container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
      spring.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [spring]);

  // Quick jump helper to scroll directly to timeline phases
  const scrollToPhase = (targetProgress: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const clamped = Math.min(Math.max(targetProgress, 0), 1);
    const targetY = containerTop + clamped * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  const sinChewArticles = activeArticles.filter((a) => a.source === "sinchew");
  const chinaPressArticles = activeArticles.filter((a) => a.source === "chinapress");

  // Determine current timeline label
  let phaseNumber = "01";
  let phaseTitle = "折叠头版 · 影室光影";
  let phaseEn = "HERO ISOMETRIC STAGE";

  if (scrollProgress > 0.25 && scrollProgress <= 0.6) {
    phaseNumber = "02";
    phaseTitle = "中缝对开 · 动态展开";
    phaseEn = "BROADSHEET UNFOLDING";
  } else if (scrollProgress > 0.6) {
    phaseNumber = "03";
    phaseTitle = "专栏特焦 · 深度阅读";
    phaseEn = "EDITORIAL COLUMN ZOOM";
  }

  const percentage = Math.round(scrollProgress * 100);

  return (
    <section
      id="newspaper-experience"
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#0A0A0C]"
    >
      {/* Sticky Pinned 100vh Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0A0A0C]">
        {/* Subtle Ambient Grain & Vignette */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,7,0.85)_100%)]" />

        {/* 3D WebGL Canvas Viewport */}
        <div className="w-full h-full">
          <NewspaperScene
            scrollProgress={smoothedProgress}
            focusMode={activeSource}
            sinChewArticles={
              sinChewArticles.length > 0 ? sinChewArticles : MOCK_NEWS_ARTICLES
            }
            chinaPressArticles={
              chinaPressArticles.length > 0
                ? chinaPressArticles
                : MOCK_NEWS_ARTICLES
            }
            theme={theme}
            onSelectArticle={onSelectArticle}
          />
        </div>

        {/* ================= AWWWARDS EDITORIAL HUD OVERLAY ================= */}
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 py-6 pointer-events-none text-white/80">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c] animate-pulse" />
            <div className="pointer-events-auto">
              <span className="font-serif-sc font-bold tracking-wider text-sm text-white">
                星洲日报 × 中国报
              </span>
              <span className="ml-2 text-[10px] font-mono tracking-widest text-white/40 uppercase hidden sm:inline">
                / 3D REAL-TIME BROADSHEET
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono pointer-events-auto">
            <button
              onClick={() => setIsAudioActive(!isAudioActive)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#ffd8a8]" />
                  <span className="text-[11px]">AMBIENT ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[11px]">AMBIENT OFF</span>
                </>
              )}
            </button>

            <span className="hidden md:inline px-3 py-1 border border-white/10 bg-white/5 text-[11px] text-white/60">
              FPS: 60 · THREE.JS R169
            </span>
          </div>
        </div>

        {/* Phase Indicator Watermark (Left Side) */}
        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col text-white/70 pointer-events-none select-none">
          <span className="text-[10px] font-mono tracking-widest text-[#ffd8a8] mb-1">
            PHASE {phaseNumber}
          </span>
          <h3 className="font-serif-sc text-xl font-bold tracking-wide text-white">
            {phaseTitle}
          </h3>
          <span className="text-[10px] font-mono tracking-widest text-white/40 mt-0.5">
            {phaseEn}
          </span>

          <div className="mt-6 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => scrollToPhase(0)}
              className={`text-left text-xs font-serif-sc transition-colors ${
                scrollProgress <= 0.25
                  ? "text-[#ffd8a8] font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              01 · 折叠封面 (Hero)
            </button>
            <button
              onClick={() => scrollToPhase(0.45)}
              className={`text-left text-xs font-serif-sc transition-colors ${
                scrollProgress > 0.25 && scrollProgress <= 0.6
                  ? "text-[#ffd8a8] font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              02 · 翻页展开 (Unfold)
            </button>
            <button
              onClick={() => scrollToPhase(0.85)}
              className={`text-left text-xs font-serif-sc transition-colors ${
                scrollProgress > 0.6
                  ? "text-[#ffd8a8] font-bold"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              03 · 特写阅读 (Read)
            </button>
          </div>
        </div>

        {/* Bottom Control Dock & Scroll Timeline Progress */}
        <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-10 pb-8 pt-6 pointer-events-none flex flex-col gap-3">
          {/* Timeline progress line */}
          <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#b91c1c] via-[#ffd8a8] to-white transition-all duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-white/70 font-mono">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white tracking-widest">
                {String(percentage).padStart(2, "0")}%
              </span>
              <span className="text-white/30">/</span>
              <span className="font-serif-sc text-white/90">
                {phaseTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="hidden sm:inline text-white/40 text-[11px]">
                SCROLL PROGRESSION:
              </span>
              <button
                onClick={() => scrollToPhase(0)}
                className={`px-3 py-1 rounded text-[11px] border transition-all ${
                  scrollProgress <= 0.25
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
                }`}
              >
                封面
              </button>
              <button
                onClick={() => scrollToPhase(0.45)}
                className={`px-3 py-1 rounded text-[11px] border transition-all ${
                  scrollProgress > 0.25 && scrollProgress <= 0.6
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
                }`}
              >
                展开
              </button>
              <button
                onClick={() => scrollToPhase(0.85)}
                className={`px-3 py-1 rounded text-[11px] border transition-all ${
                  scrollProgress > 0.6
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"
                }`}
              >
                阅读
              </button>
            </div>
          </div>
        </div>

        {/* Center Floating Scroll Prompt (Visible in phase 1) */}
        {scrollProgress < 0.15 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 text-white/60 animate-bounce">
            <span className="font-serif-sc text-xs tracking-widest uppercase">
              向下滚动 · 翻阅报刊
            </span>
            <ArrowDown className="w-4 h-4 text-[#ffd8a8]" />
          </div>
        )}

        {/* Interactive Focus Switcher Dock (Visible in phase 3) */}
        {scrollProgress > 0.55 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2 transition-all duration-300">
            <div className="flex items-center p-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl">
              <button
                onClick={() => onSourceChange?.("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
                  activeSource === "all"
                    ? "bg-white text-black shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>📖 双版全览</span>
              </button>
              <button
                onClick={() => onSourceChange?.("sinchew")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
                  activeSource === "sinchew"
                    ? "bg-[#b91c1c] text-white shadow-md"
                    : "text-white/70 hover:text-[#ff8080] hover:bg-white/10"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>📕 聚焦星洲 (大字特写)</span>
              </button>
              <button
                onClick={() => onSourceChange?.("chinapress")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc font-bold transition-all flex items-center gap-1.5 ${
                  activeSource === "chinapress"
                    ? "bg-[#1e3a5f] text-white shadow-md"
                    : "text-white/70 hover:text-[#90caf9] hover:bg-white/10"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>📘 聚焦中国报 (大字特写)</span>
              </button>
            </div>

            <div className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 text-[11px] text-[#ffd8a8] font-serif-sc flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3 h-3 text-[#ffd8a8] shrink-0" />
              <span>
                {activeSource === "all"
                  ? "当前为双版全览视角 · 点击上方按钮可单版满屏放大（字号翻倍），或点击任意文章展开抽屉速读"
                  : activeSource === "sinchew"
                  ? "当前已锁定【星洲日报】满屏特写 · 字号已显著放大，可清晰精读各项要闻"
                  : "当前已锁定【中国报】满屏特写 · 字号已显著放大，可清晰精读即时风云榜"}
              </span>
            </div>
          </div>
        )}

        {/* Scroll down prompt to Weekly Radar when in reading view */}
        {scrollProgress > 0.75 && (
          <button
            onClick={() => {
              const radar = document.getElementById("weekly-heat-radar");
              if (radar) {
                radar.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="absolute bottom-16 right-6 sm:right-10 z-30 pointer-events-auto px-4 py-2 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md border border-[#b91c1c]/50 text-[#ffd8a8] hover:text-white text-xs font-serif-sc flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
          >
            <Flame className="w-3.5 h-3.5 text-[#ff6b6b] animate-bounce" />
            <span>浏览本周热度专栏 ↓</span>
          </button>
        )}
      </div>
    </section>
  );
};
