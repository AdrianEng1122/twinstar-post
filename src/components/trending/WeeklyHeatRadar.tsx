"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  TrendingUp,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { NewsArticle } from "@/lib/news/types";
import {
  WEEKLY_TRENDING_ARTICLES,
  WeeklyHotArticle,
} from "@/lib/news/weeklyTrendingData";

interface WeeklyHeatRadarProps {
  onSelectArticle: (article: NewsArticle) => void;
}

type FilterTab = "all" | "surging" | "nation" | "business" | "tech";

export const WeeklyHeatRadar: React.FC<WeeklyHeatRadarProps> = ({
  onSelectArticle,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);

  // Filtered list
  const filteredArticles = useMemo(() => {
    if (activeFilter === "all") return WEEKLY_TRENDING_ARTICLES;
    if (activeFilter === "surging") {
      return WEEKLY_TRENDING_ARTICLES.filter(
        (a) => a.trendStatus === "surging" || a.rank <= 3
      );
    }
    if (activeFilter === "nation") {
      return WEEKLY_TRENDING_ARTICLES.filter(
        (a) => a.category === "nation"
      );
    }
    if (activeFilter === "business") {
      return WEEKLY_TRENDING_ARTICLES.filter(
        (a) => a.category === "business"
      );
    }
    if (activeFilter === "tech") {
      return WEEKLY_TRENDING_ARTICLES.filter(
        (a) => a.category === "tech" || a.category === "international"
      );
    }
    return WEEKLY_TRENDING_ARTICLES;
  }, [activeFilter]);

  const top1Article = WEEKLY_TRENDING_ARTICLES[0];
  const listArticles = filteredArticles.filter((a) =>
    activeFilter === "all" ? a.rank !== 1 : true
  );

  return (
    <section
      id="weekly-heat-radar"
      className="w-full bg-[#0A0A0C] text-white border-t border-white/10 relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-12 selection:bg-[#b91c1c] selection:text-white"
    >
      {/* Background Ambience Highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#b91c1c]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#1e3a5f]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-12">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b91c1c]/20 border border-[#b91c1c]/40 text-[#ffd8a8] text-xs font-mono tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-[#ff6b6b] animate-bounce" />
              <span>7-DAY VIRAL RADAR · 本周热度专栏</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif-sc tracking-tight text-white flex items-center gap-3">
              <span>本周热度风云榜</span>
              <span className="text-xs font-mono text-white/40 border border-white/15 px-2.5 py-1 rounded-full font-normal hidden sm:inline-block">
                过去 7 天重大事件回溯
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/60 font-serif-sc max-w-2xl leading-relaxed">
              专为两三天浏览一次的读者打造。算法综合全网讨论度、发酵周期与双报深度报道，即使报纸实时轮换，本周最具影响力的爆炸性议题绝不遗漏。
            </p>
          </div>

          {/* Quick Catchup Pill Stats */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-[#ffd8a8]" />
              <span>覆盖周期：本周一至今 · 算法持续加权</span>
            </div>
            <div className="text-[11px] font-mono text-[#ffd8a8]/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>已聚合星洲日报 & 中国报 7 天全网最高热议</span>
            </div>
          </div>
        </div>

        {/* Quick Topic Keyword Tags (3-Minute Catchup Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-serif-sc">
          <span className="text-white/40 shrink-0 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#ffd8a8]" />
            本周速览热词：
          </span>
          {[
            "🔥 #AI算力20亿总纲",
            "📈 #林吉特破4.20",
            "🛡️ #平抑物价守护行动",
            "🚇 #轻轨3期新枢纽",
            "🌏 #东盟二维码互通",
            "🏸 #羽球男双冲冠",
            "🎨 #华小文化长卷",
          ].map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 whitespace-nowrap cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ================= FILTER TABS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-full text-xs font-serif-sc">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeFilter === "all"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>全周总榜 All</span>
            </button>
            <button
              onClick={() => setActiveFilter("surging")}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeFilter === "surging"
                  ? "bg-[#b91c1c] text-white font-bold shadow-md"
                  : "text-white/60 hover:text-[#ff8080]"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>持续发酵 3天+</span>
            </button>
            <button
              onClick={() => setActiveFilter("nation")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeFilter === "nation"
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              民生与政治
            </button>
            <button
              onClick={() => setActiveFilter("business")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeFilter === "business"
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              财经商业
            </button>
            <button
              onClick={() => setActiveFilter("tech")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeFilter === "tech"
                  ? "bg-white/20 text-white font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              科技与国际
            </button>
          </div>

          <div className="text-xs font-mono text-white/40 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>实时统计 {filteredArticles.length} 条本周核心热点</span>
          </div>
        </div>

        {/* ================= HERO SPOTLIGHT: TOP #01 PHENOMENON STORY ================= */}
        {activeFilter === "all" && top1Article && (
          <div className="relative group rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl transition-all hover:border-[#b91c1c]/50">
            {/* Corner Rank Ribbon */}
            <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 rounded-tr-2xl pointer-events-none">
              <div className="absolute transform rotate-45 bg-[#b91c1c] text-white text-center font-black font-mono text-xs py-1 right-[-35px] top-[24px] w-[140px] shadow-lg tracking-widest">
                TOP 1 焦点
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Visual & Heat Metadata (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover:shadow-2xl transition-all">
                  <img
                    src={top1Article.imageUrl}
                    alt={top1Article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#b91c1c] text-white font-mono text-xs font-black tracking-wider flex items-center gap-1 shadow-md">
                      <Flame className="w-3.5 h-3.5" />
                      {top1Article.heatScoreFormatted} 热度
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[#ffd8a8] font-mono text-xs border border-white/10">
                      {top1Article.timeAgoLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-mono text-white/80">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ffd8a8]" />
                      {top1Article.trendBadge}
                    </span>
                    <span className="text-white/60">{top1Article.discussionCount}</span>
                  </div>
                </div>

                {/* Heat Index Meter Bar */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">全周综合热度指数</span>
                    <span className="text-[#ff6b6b] font-bold">99.8 / 100 MAX</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#b91c1c] via-[#ff6b6b] to-[#ffd8a8] rounded-full animate-pulse"
                      style={{ width: "99.8%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Perspectives & Timeline (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/10 text-white/80 border border-white/15">
                    {top1Article.categoryLabel}
                  </span>
                  <span className="text-xs font-mono text-[#ffd8a8]">
                    本周全网第一现象级议题
                  </span>
                </div>

                <h3
                  onClick={() => onSelectArticle(top1Article)}
                  className="text-2xl sm:text-3xl font-serif-sc font-black text-white hover:text-[#ffd8a8] transition-colors cursor-pointer leading-snug"
                >
                  {top1Article.title}
                </h3>

                <p className="text-sm sm:text-base text-white/70 font-serif-sc leading-relaxed">
                  {top1Article.summary}
                </p>

                {/* Dual-Paper Perspective Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {top1Article.sinChewPerspective && (
                    <div className="p-3.5 rounded-lg bg-[#b91c1c]/10 border border-[#b91c1c]/30 text-xs font-serif-sc leading-relaxed">
                      <div className="font-bold text-[#ff8080] mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff8080]" />
                        <span>星洲日报社论切角</span>
                      </div>
                      <p className="text-white/80">{top1Article.sinChewPerspective}</p>
                    </div>
                  )}

                  {top1Article.chinaPressPerspective && (
                    <div className="p-3.5 rounded-lg bg-[#1e3a5f]/30 border border-[#90caf9]/30 text-xs font-serif-sc leading-relaxed">
                      <div className="font-bold text-[#90caf9] mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#90caf9]" />
                        <span>中国报前线视角</span>
                      </div>
                      <p className="text-white/80">{top1Article.chinaPressPerspective}</p>
                    </div>
                  )}
                </div>

                {/* 3-Step Event Development Timeline */}
                {top1Article.timeline && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-xs font-mono text-white/40 block mb-2">
                      EVENT TIMELINE · 本周事件发酵时间线
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {top1Article.timeline.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-white/5 border border-white/10 text-xs"
                        >
                          <span className="text-[10px] font-mono text-[#ffd8a8] block">
                            {item.time}
                          </span>
                          <span className="font-bold text-white block mt-0.5 font-serif-sc truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-white/60 line-clamp-2 mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectArticle(top1Article)}
                    className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-[#ffd8a8] font-serif-sc font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>展开速读抽屉 (全文精读)</span>
                  </button>

                  <a
                    href={top1Article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-serif-sc text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>查看星洲原报道</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= WEEKLY RANKING GRID (#02 ~ #08) ================= */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-sc text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>本周热点排行矩阵</span>
              <span className="text-xs font-mono text-white/40 font-normal">
                / TOP VIRAL RANKINGS
              </span>
            </h3>
            <span className="text-xs font-serif-sc text-white/50">
              点击任意卡片展开阅读抽屉
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listArticles.map((article) => {
              const isSinChew = article.source === "sinchew";
              return (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  onMouseEnter={() => setHoveredArticleId(article.id)}
                  onMouseLeave={() => setHoveredArticleId(null)}
                  className="group relative rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer shadow-lg hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-3">
                    {/* Card Header: Rank Badge, Source, and Days Ago */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs ${
                            article.rank === 2
                              ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                              : article.rank === 3
                              ? "bg-orange-400 text-black shadow-md shadow-orange-400/20"
                              : "bg-white/10 text-white/80 border border-white/15"
                          }`}
                        >
                          #{String(article.rank).padStart(2, "0")}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isSinChew
                              ? "bg-[#b91c1c]/30 text-[#ff8080] border border-[#b91c1c]/40"
                              : "bg-[#1e3a5f]/40 text-[#90caf9] border border-[#1e3a5f]/60"
                          }`}
                        >
                          {article.sourceName}
                        </span>

                        <span className="text-white/40 text-[11px]">
                          {article.categoryLabel}
                        </span>
                      </div>

                      {/* Time Ago Indicator (Crucial for 2-3 day visitor!) */}
                      <span className="text-[11px] text-[#ffd8a8] bg-black/40 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ffd8a8]/70" />
                        {article.timeAgoLabel}
                      </span>
                    </div>

                    {/* Image Thumbnail */}
                    {article.imageUrl && (
                      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-black/40 border border-white/10 my-1">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Trend badge on image */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90">
                          <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[#ffd8a8] border border-white/10">
                            {article.trendBadge}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#ff6b6b]">
                            <Flame className="w-3 h-3" />
                            {article.heatScoreFormatted}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Headline */}
                    <h4 className="font-serif-sc font-bold text-base sm:text-lg text-white group-hover:text-[#ffd8a8] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>

                    {/* Summary */}
                    <p className="text-xs sm:text-[13px] text-white/60 font-serif-sc line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* Perspective Highlight if Available */}
                    {(article.sinChewPerspective || article.chinaPressPerspective) && (
                      <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[11px] text-white/70 font-serif-sc leading-relaxed">
                        <span className="text-[#ffd8a8] font-bold block mb-0.5">
                          {isSinChew ? "星洲报道切点" : "中国报关注点"}：
                        </span>
                        <p className="line-clamp-2">
                          {article.sinChewPerspective || article.chinaPressPerspective}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Heat Bar & Read More */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-white/40 font-mono text-[11px]">
                      <span>热度值</span>
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[#b91c1c] rounded-full"
                          style={{ width: `${article.heatScore}%` }}
                        />
                      </div>
                      <span className="text-[#ffd8a8] font-bold">
                        {article.heatScore}
                      </span>
                    </div>

                    <div className="text-white/60 group-hover:text-white font-serif-sc text-xs flex items-center gap-1 font-medium transition-colors">
                      <span>速读详情</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ================= 3-MINUTE CATCHUP FOOTNOTE BANNER ================= */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-[#b91c1c]/15 via-white/[0.04] to-[#1e3a5f]/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#b91c1c]/20 border border-[#b91c1c]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#ffd8a8]" />
            </div>
            <div>
              <h4 className="font-serif-sc font-bold text-white text-sm sm:text-base">
                两三天没来？点击上方任意热点，即刻一站式补齐本周全马要闻
              </h4>
              <p className="text-xs font-serif-sc text-white/60 mt-0.5">
                实时抓取联合星洲日报与中国报权威新闻源 · 自动按发酵热度降序排列
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-serif-sc text-white shrink-0 transition-colors"
          >
            返回顶部 3D 报刊 ↑
          </button>
        </div>
      </div>
    </section>
  );
};
