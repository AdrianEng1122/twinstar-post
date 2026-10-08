"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Newspaper,
  Calendar,
  Filter,
} from "lucide-react";
import { NewsArticle, NewsCategory } from "@/lib/news/types";
import { WEEKLY_TRENDING_ARTICLES } from "@/lib/news/weeklyTrendingData";

interface GlobalNewsSearchProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const GlobalNewsSearch: React.FC<GlobalNewsSearchProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Combined pool of articles
  const allArticlesPool = useMemo(() => {
    const map = new Map<string, NewsArticle>();
    articles.forEach((a) => map.set(a.id, a));
    WEEKLY_TRENDING_ARTICLES.forEach((a) => {
      if (!map.has(a.id)) {
        map.set(a.id, a);
      }
    });
    return Array.from(map.values());
  }, [articles]);

  // Filtered search results
  const searchResults = useMemo(() => {
    let pool = allArticlesPool;

    if (selectedCategory !== "all") {
      pool = pool.filter((a) => a.category === selectedCategory);
    }

    if (!query.trim()) {
      return pool.slice(0, 7); // Default trending suggestions
    }

    const q = query.toLowerCase().trim();
    return pool.filter((article) => {
      return (
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.sourceName.toLowerCase().includes(q) ||
        (article.author && article.author.toLowerCase().includes(q))
      );
    });
  }, [allArticlesPool, query, selectedCategory]);

  // Keyboard navigation (Esc, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          onSelectArticle(searchResults[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onSelectArticle, onClose]);

  // Helper to highlight matching text
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={index}
          className="bg-[#b91c1c]/40 text-[#ffd8a8] font-bold px-0.5 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Spotlight Search Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#121216]/95 border border-white/20 shadow-2xl overflow-hidden flex flex-col z-10 font-serif-sc text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Top Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#ffd8a8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="搜索全马新闻、财经汇率、科技算力、或人物关键词..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder:text-white/40 font-serif-sc"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            <span>ESC</span>
            <span>关闭</span>
          </div>
        </div>

        {/* Category Pills & Quick Filter Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10 overflow-x-auto scrollbar-none text-xs">
          <span className="text-white/40 shrink-0 text-[11px] font-mono mr-1">
            分类：
          </span>
          {[
            { id: "all", label: "全部" },
            { id: "tech", label: "科技" },
            { id: "business", label: "财经" },
            { id: "nation", label: "全国民生" },
            { id: "international", label: "国际" },
            { id: "sports", label: "体育" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#b91c1c] text-white font-bold"
                  : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-white/50 text-sm">
              <Search className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p>未找到与 “{query}” 相关的新闻报道</p>
              <p className="text-xs text-white/30 mt-1">
                尝试输入：AI、林吉特、汇率、轻轨 或 中国报
              </p>
            </div>
          ) : (
            searchResults.map((article, idx) => {
              const isSelected = idx === selectedIndex;
              const isSinChew = article.source === "sinchew";
              return (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-white/15 border border-white/20 text-white shadow-lg"
                      : "hover:bg-white/5 border border-transparent text-white/80"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono mb-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
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

                      <span className="text-white/30">·</span>

                      <span className="text-white/40 text-[11px]">
                        {new Date(article.timestamp).toLocaleDateString("zh-Hans-CN", {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white line-clamp-1">
                      {highlightMatch(article.title, query)}
                    </h4>

                    <p className="text-xs text-white/60 line-clamp-1 mt-0.5 font-serif-sc">
                      {highlightMatch(article.summary, query)}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs text-white/40 font-mono">
                    {isSelected && (
                      <span className="hidden sm:inline text-[#ffd8a8] text-[11px]">
                        回车查看 ↵
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Hotkeys */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-white/40 font-mono">
          <div className="flex items-center gap-3">
            <span>↑ ↓ 键选择</span>
            <span>↵ 回车打开</span>
            <span>ESC 关闭</span>
          </div>

          <span className="text-[11px]">共找到 {searchResults.length} 条相关报道</span>
        </div>
      </div>
    </div>
  );
};
