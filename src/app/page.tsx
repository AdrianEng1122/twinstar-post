"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Masthead } from "@/components/newspaper/Masthead";
import { LiveTicker } from "@/components/newspaper/LiveTicker";
import { ScrollExperience } from "@/components/newspaper/ScrollExperience";
import { FloatingNavbar } from "@/components/navigation/FloatingNavbar";
import { ArticleDrawer } from "@/components/reader/ArticleDrawer";
import { MinimalistReaderView } from "@/components/reader/MinimalistReaderView";
import { WeeklyHeatRadar } from "@/components/trending/WeeklyHeatRadar";
import { MalaysiaMarketPulse } from "@/components/market/MalaysiaMarketPulse";
import { AiNewsBroadcaster } from "@/components/audio/AiNewsBroadcaster";
import { GlobalNewsSearch } from "@/components/search/GlobalNewsSearch";
import { MoreNewsArchive } from "@/components/newspaper/MoreNewsArchive";
import { NewsArticle, NewsSource } from "@/lib/news/types";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mockData";
import { PaperThemeId } from "@/lib/theme/paperTheme";

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeSource, setActiveSource] = useState<NewsSource | "all">("all");
  const [viewMode, setViewMode] = useState<"3d" | "reader">("3d");
  const [paperTheme, setPaperTheme] = useState<PaperThemeId>("vintage");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global Ctrl + K / Cmd + K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 1. Fetch real-time news data from /api/news (requesting up to 60 articles)
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=60");
        if (res.ok) {
          const data = await res.json();
          if (data && data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          }
        }
      } catch (err) {
        console.warn("Using fallback news data:", err);
      }
    }
    fetchNews();
  }, []);

  // 2. Responsive Mobile Auto-Detection (< 768px defaults to clean reader view)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setViewMode("reader");
    }
  }, []);

  // 3. Filter articles based on active source tab
  const filteredArticles = useMemo(() => {
    if (activeSource === "all") return articles;
    return articles.filter((a) => a.source === activeSource);
  }, [articles, activeSource]);

  // Extract headlines for breaking ticker
  const tickerHeadlines = useMemo(() => {
    return articles.slice(0, 6).map((a) => `【${a.sourceName}】${a.title}`);
  }, [articles]);

  const handleSourceChange = (src: NewsSource | "all") => {
    setActiveSource(src);
    if (viewMode === "3d") {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        let targetScroll = 0;
        if (src === "sinchew") {
          targetScroll = scrollHeight * 0.45;
        } else if (src === "chinapress") {
          targetScroll = scrollHeight * 0.85;
        } else {
          targetScroll = 0;
        }
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-ink flex flex-col pt-14 relative">
      {/* Floating Apple-Style Glassmorphism Top Navigation */}
      <FloatingNavbar
        activeSource={activeSource}
        onSourceChange={handleSourceChange}
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode((prev) => (prev === "3d" ? "reader" : "3d"))}
        onOpenSearch={() => setIsSearchOpen(true)}
        theme={paperTheme}
        onThemeChange={setPaperTheme}
      />

      {/* Traditional Bilingual Newspaper Masthead */}
      <Masthead />

      {/* Real-Time Live Ticker Tape */}
      <LiveTicker headlines={tickerHeadlines} />

      {/* Main Viewport Content: 3D Interactive Broadsheet OR 2D Minimalist Reader */}
      {viewMode === "3d" ? (
        <ScrollExperience
          articles={articles}
          activeSource={activeSource}
          theme={paperTheme}
          onSourceChange={handleSourceChange}
          onSelectArticle={(article) => setSelectedArticle(article)}
        />
      ) : (
        <MinimalistReaderView
          articles={filteredArticles}
          onSelectArticle={(article) => setSelectedArticle(article)}
        />
      )}

      {/* Malaysia Market & Living Pulse Dashboard */}
      <MalaysiaMarketPulse />

      {/* Weekly Viral Heat Radar & 7-Day Editorial Feeds */}
      <WeeklyHeatRadar
        onSelectArticle={(article) => setSelectedArticle(article)}
      />

      {/* Comprehensive More News Archive & Live Feed Explorer */}
      <MoreNewsArchive
        articles={articles}
        onSelectArticle={(article) => setSelectedArticle(article)}
      />

      {/* AI Voice Broadcaster Pill */}
      <AiNewsBroadcaster articles={articles} />

      {/* Elegant Editorial Footer */}
      <footer className="w-full bg-[#0A0A0C] border-t border-white/10 py-12 px-6 sm:px-12 text-white/50 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="font-serif-sc text-white/70">
            <span>© 2026 双星时报 · 全景 3D 报刊实验室</span>
            <span className="mx-3 text-white/20">|</span>
            <span>星洲日报 × 中国报 联合数字特刊</span>
          </div>

          <div className="font-mono text-[11px] text-white/40 flex items-center gap-4">
            <span>AWWWARDS DESIGN NOMINEE</span>
            <span>POWERED BY THREE.JS & NEXT.JS 14</span>
          </div>
        </div>
      </footer>

      {/* Slide-Over Article Reading Drawer */}
      <ArticleDrawer
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Global Spotlight Search Modal (Ctrl + K) */}
      <GlobalNewsSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={(article) => setSelectedArticle(article)}
      />
    </main>
  );
}
