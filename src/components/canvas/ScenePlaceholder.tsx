"use client";

import React, { useState } from "react";
import { Eye, Layers, Rotate3d, Sparkles, BookOpen } from "lucide-react";

export const ScenePlaceholder: React.FC = () => {
  const [activeView, setActiveView] = useState<"front" | "spread" | "archive">("front");

  return (
    <div className="relative w-full aspect-[16/10] max-h-[700px] min-h-[460px] bg-paper-100 border border-ink/30 shadow-paper-lift rounded-none flex flex-col items-center justify-center p-8 text-center overflow-hidden bg-newsprint">
      {/* Editorial Decorative Corner Marks */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-ink" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-ink" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-ink" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-ink" />

      {/* Grid watermark */}
      <div className="absolute inset-0 bg-paper-grain pointer-events-none" />

      {/* Top stage header */}
      <div className="absolute top-5 inset-x-8 flex items-center justify-between text-xs text-ink-muted border-b border-ink/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-press-red animate-pulse" />
          <span className="font-mono uppercase tracking-widest text-[11px]">
            WebGL Stage: R3F Canvas Mount Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("front")}
            className={`px-2.5 py-1 font-serif-sc text-xs transition-colors border ${
              activeView === "front"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-ink border-ink/20 hover:border-ink"
            }`}
          >
            头版折叠
          </button>
          <button
            onClick={() => setActiveView("spread")}
            className={`px-2.5 py-1 font-serif-sc text-xs transition-colors border ${
              activeView === "spread"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-ink border-ink/20 hover:border-ink"
            }`}
          >
            中缝对开
          </button>
          <button
            onClick={() => setActiveView("archive")}
            className={`px-2.5 py-1 font-serif-sc text-xs transition-colors border ${
              activeView === "archive"
                ? "bg-ink text-paper border-ink font-semibold"
                : "bg-paper text-ink border-ink/20 hover:border-ink"
            }`}
          >
            多期合订
          </button>
        </div>
      </div>

      {/* Center 3D Newspaper Canvas Mount Spec */}
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-paper-200 border border-ink/30 flex items-center justify-center mb-4 shadow-paper-flat">
          <Rotate3d className="w-8 h-8 text-ink animate-[spin_10s_linear_infinite]" />
        </div>

        <span className="text-xs uppercase font-serif-sc tracking-[0.25em] text-press-red font-semibold mb-1">
          Awwwards 3D Architecture Baseline
        </span>
        <h2 className="font-serif-sc text-2xl sm:text-3xl font-bold text-ink mb-3 tracking-tight">
          3D 交互式折叠翻页视口
        </h2>
        <p className="text-sm font-sans-sc text-ink-muted leading-relaxed mb-6 max-w-md">
          基于 React Three Fiber & Three.js 驱动的拟真报纸物理几何体，支持平滑滚轮翻页、阻尼展开动效以及动态将星洲日报与中国报的实时新闻投射至报纸纹理。
        </p>

        {/* Feature Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
          <div className="p-3 bg-paper border border-ink/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink font-bold text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-press-red" />
              <span>双面折叠</span>
            </div>
            <p className="text-[11px] text-ink-light leading-snug">
              Bending & Curvature 物理卷曲
            </p>
          </div>

          <div className="p-3 bg-paper border border-ink/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-press-gold" />
              <span>动态纹理</span>
            </div>
            <p className="text-[11px] text-ink-light leading-snug">
              CanvasTexture 动态字符投射
            </p>
          </div>

          <div className="p-3 bg-paper border border-ink/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink font-bold text-xs mb-1">
              <Eye className="w-3.5 h-3.5 text-press-navy" />
              <span>景深光影</span>
            </div>
            <p className="text-[11px] text-ink-light leading-snug">
              Newsprint 漫反射微阴影
            </p>
          </div>

          <div className="p-3 bg-paper border border-ink/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink font-bold text-xs mb-1">
              <BookOpen className="w-3.5 h-3.5 text-ink" />
              <span>逐页阅读</span>
            </div>
            <p className="text-[11px] text-ink-light leading-snug">
              Scroll-driven 交互式进度映射
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Stage Footnote */}
      <div className="absolute bottom-4 inset-x-8 flex items-center justify-between text-[11px] text-ink-light border-t border-ink/10 pt-2 font-mono">
        <span>FRAMEWORK: THREE.JS R169 + @REACT-THREE/FIBER V8</span>
        <span>STATUS: 3D RIG & TEXTURE SHADERS READY FOR STEP 2</span>
      </div>
    </div>
  );
};
