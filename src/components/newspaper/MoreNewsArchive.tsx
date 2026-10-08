"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Newspaper,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Tag,
  Radio,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle, NewsCategory, NewsSource } from "@/lib/news/types";

interface MoreNewsArchiveProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

const CATEGORY_TABS: { id: string; label: string; icon?: string }[] = [
  { id: "all", label: "全部资讯" },
  { id: "nation", label: "全国焦点" },
  { id: "business", label: "财经商业" },
  { id: "tech", label: "科技创新" },
  { id: "international", label: "国际风云" },
  { id: "sports", label: "体育竞技" },
  { id: "entertainment", label: "文化娱乐" },
];

export const MoreNewsArchive: React.FC<MoreNewsArchiveProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [selectedSource, setSelectedSource] = useState<NewsSource | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewLayout, setViewLayout] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter articles based on source, category, and keyword
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // 1. Source filter
      if (selectedSource !== "all" && article.source !== selectedSource) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all") {
        if (
          article.category !== selectedCategory &&
          !article.categoryLabel?.toLowerCase().includes(selectedCategory)
        ) {
          return false;
        }
      }

      // 3. Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = article.title.toLowerCase().includes(q);
        const inSummary = article.summary?.toLowerCase().includes(q);
        const inCategory = article.categoryLabel?.toLowerCase().includes(q);
        if (!inTitle && !inSummary && !inCategory) {
          return false;
        }
      }

      return true;
    });
  }, [articles, selectedSource, selectedCategory, searchQuery]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // Helper for category badge color
  const getCategoryBadgeStyle = (category?: string) => {
    switch (category) {
      case "business":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "tech":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "nation":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "international":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "sports":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-violet-500/10 text-violet-400 border-violet-500/30";
    }
  };

  // Relative time helper (client-safe to prevent SSR hydration mismatch)
  const getRelativeTime = (timestamp?: number, pubDate?: string) => {
    if (!isMounted) return "今日快讯";
    const timeMs = timestamp || (pubDate ? new Date(pubDate).getTime() : 0);
    if (!timeMs) return "今日快讯";
    const diffMin = Math.floor((Date.now() - timeMs) / (1000 * 60));
    if (diffMin < 1) return "刚刚";
    if (diffMin < 60) return `${diffMin}分钟前`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}小时前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}天前`;
  };

  return (
    <section className="w-full bg-[#08080C] border-t border-white/10 text-white py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden select-none">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        {/* =========================================================
            1. SECTION HEADER
        ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-3">
              <Newspaper className="w-3.5 h-3.5 text-press-red" />
              <span>双报即时全览档案库 · 持续更新</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif-sc text-white flex items-center gap-3">
              <span>更多新闻资讯全览</span>
              <span className="text-xs font-mono font-normal uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 text-white/60">
                Live Archive
              </span>
            </h2>

            <p className="mt-2 text-sm text-white/60 max-w-2xl font-sans">
              汇聚星洲日报与中国报最新海量即时电讯，涵盖全国政经、社会民生、财经外汇及国际科技。点击任意报道即可直接展开完整长文。
            </p>
          </div>

          {/* Quick Counter Stats */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="text-xs">
                <span className="text-white/40 block">当前已索引报道</span>
                <span className="font-mono font-bold text-white text-sm">
                  {articles.length} 篇实时资讯
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. INTERACTIVE CONTROLS (Sources, Categories, Search & Layout)
        ========================================================= */}
        <div className="flex flex-col gap-4 bg-[#0F0F16]/80 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Top Row: Source Selector + Search Bar + View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Source Radio Buttons */}
            <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 self-start">
              <button
                onClick={() => setSelectedSource("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSource === "all"
                    ? "bg-white text-black shadow font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                全部双报
              </button>
              <button
                onClick={() => setSelectedSource("sinchew")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedSource === "sinchew"
                    ? "bg-blue-600 text-white shadow font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                星洲日报
              </button>
              <button
                onClick={() => setSelectedSource("chinapress")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedSource === "chinapress"
                    ? "bg-red-600 text-white shadow font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                中国报
              </button>
            </div>

            {/* Right: Search Box + Layout Mode Switch */}
            <div className="flex items-center gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="在此版块检索关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>

              {/* View Layout Switch */}
              <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
                <button
                  onClick={() => setViewLayout("grid")}
                  title="杂志网格视图"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewLayout === "grid"
                      ? "bg-white/20 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout("list")}
                  title="紧凑列表视图"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewLayout === "list"
                      ? "bg-white/20 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white/15 text-white border border-white/25 font-semibold"
                      : "bg-white/[0.03] text-white/50 border border-white/5 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            3. ARTICLES DISPLAY (Grid or List Layout)
        ========================================================= */}
        {filteredArticles.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <Search className="w-10 h-10 text-white/20 mb-3" />
            <p className="text-white/60 text-sm font-medium">
              未找到符合当前筛选条件的新闻报道
            </p>
            <p className="text-xs text-white/40 mt-1">
              请尝试更换分类标签、重置来源或清空关键词
            </p>
            <button
              onClick={() => {
                setSelectedSource("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              重置筛选条件
            </button>
          </div>
        ) : viewLayout === "grid" ? (
          // ================= GRID VIEW =================
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedArticles.map((article, index) => {
                const isSinChew = article.source === "sinchew";
                return (
                  <motion.article
                    key={article.id || `more-news-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: (index % 12) * 0.03 }}
                    onClick={() => onSelectArticle(article)}
                    className="group rounded-2xl bg-[#0F0F16] border border-white/10 hover:border-white/25 p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Top Meta Bar */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeStyle(
                            article.category
                          )}`}
                        >
                          {article.categoryLabel || "深度报道"}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isSinChew
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {article.sourceName}
                          </span>

                          <span suppressHydrationWarning className="text-[11px] font-mono text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(article.timestamp, article.pubDate)}
                          </span>
                        </div>
                      </div>

                      {/* Optional Thumbnail Image */}
                      {article.imageUrl && (
                        <div className="w-full h-44 mb-3.5 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                        </div>
                      )}

                      {/* Article Title */}
                      <h3 className="font-serif-sc text-base sm:text-lg font-bold text-white/90 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt Summary */}
                      {article.summary && (
                        <p className="mt-2 text-xs text-white/55 line-clamp-3 leading-relaxed font-sans">
                          {article.summary}
                        </p>
                      )}
                    </div>

                    {/* Bottom Utility Bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                      <span className="truncate max-w-[150px]">
                        {article.author || "特派通讯员"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-white/70 font-medium group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px]">
                        阅读全文
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          // ================= LIST VIEW =================
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {displayedArticles.map((article, index) => {
                const isSinChew = article.source === "sinchew";
                return (
                  <motion.div
                    key={article.id || `more-news-list-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: (index % 12) * 0.02 }}
                    onClick={() => onSelectArticle(article)}
                    className="group rounded-xl bg-[#0F0F16] border border-white/10 hover:border-white/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          isSinChew
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {article.sourceName}
                      </span>

                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border shrink-0 ${getCategoryBadgeStyle(
                          article.category
                        )}`}
                      >
                        {article.categoryLabel || "综合"}
                      </span>

                      <h4 className="font-serif-sc text-sm sm:text-base font-semibold text-white/90 group-hover:text-white truncate transition-colors">
                        {article.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs text-white/40">
                      <span suppressHydrationWarning className="font-mono text-[11px]">
                        {getRelativeTime(article.timestamp, article.pubDate)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-white/60 group-hover:text-white transition-colors">
                        展开
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================
            4. LOAD MORE / PAGINATION CONTROL
        ========================================================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/40 font-mono">
            已显示 <span className="text-white font-bold">{displayedArticles.length}</span> / 共{" "}
            <span className="text-white font-bold">{filteredArticles.length}</span> 篇报道
          </div>

          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold border border-white/15 hover:border-white/30 transition-all shadow-md"
            >
              <span>加载更多新闻 (+12)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs text-white/40 font-medium py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>已加载该分类下的全部实时报道</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
