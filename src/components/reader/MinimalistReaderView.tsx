"use client";

import React from "react";
import { NewsArticle } from "@/lib/news/types";
import { ArrowUpRight, Flame, Clock, Newspaper, ArrowRight } from "lucide-react";

interface MinimalistReaderViewProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const MinimalistReaderView: React.FC<MinimalistReaderViewProps> = ({
  articles,
  onSelectArticle,
}) => {
  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-white">
      {/* Editorial Section Header */}
      <div className="border-b border-white/15 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" />
            <h2 className="font-serif-sc text-2xl font-bold tracking-tight text-white">
              极简报刊阅读器 · 流式版面
            </h2>
          </div>
          <p className="text-xs text-white/50 font-serif-sc">
            针对小屏移动端与沉浸文字阅读优化的全景新闻视窗 · 共聚合 {articles.length} 条焦点快讯
          </p>
        </div>

        <span className="text-xs font-mono text-[#ffd8a8] bg-white/5 px-3 py-1 rounded border border-white/10">
          READING MODE ACTIVE
        </span>
      </div>

      {/* Hero Lead Story Card */}
      {leadArticle && (
        <article
          onClick={() => onSelectArticle(leadArticle)}
          className="group cursor-pointer mb-12 rounded-xl bg-[#16161c] border border-white/10 overflow-hidden hover:border-[#ffd8a8]/50 transition-all shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          {/* Cover Photo */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[380px] overflow-hidden bg-black/40">
            <img
              src={
                leadArticle.imageUrl ||
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
              }
              alt={leadArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 contrast-110"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#b91c1c] text-white px-2.5 py-1 text-xs font-bold font-serif-sc rounded shadow">
                <Flame className="w-3.5 h-3.5" />
                头条深度
              </span>
              <span className="bg-[#0A0A0C]/85 text-white/80 px-2 py-0.5 text-xs font-mono rounded">
                {leadArticle.sourceName}
              </span>
            </div>
          </div>

          {/* Lead Text */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-white/50 mb-3">
                <span className="text-[#ffd8a8] font-bold">
                  {leadArticle.categoryLabel}
                </span>
                <span>·</span>
                <span suppressHydrationWarning>
                  {new Date(leadArticle.timestamp).toLocaleTimeString("zh-Hans-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <h3 className="font-serif-sc text-2xl sm:text-3xl font-bold text-white group-hover:text-[#ffd8a8] transition-colors leading-snug tracking-tight mb-4">
                {leadArticle.title}
              </h3>

              <p className="font-serif-sc text-sm sm:text-base text-white/70 leading-relaxed line-clamp-4">
                {leadArticle.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>{leadArticle.author || `${leadArticle.sourceName}首席报道`}</span>
              <span className="flex items-center gap-1 text-[#ffd8a8] font-bold group-hover:translate-x-1 transition-transform">
                点击展开深度报道 <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      )}

      {/* Secondary Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secondaryArticles.map((article, idx) => {
          const isSinChew = article.source === "sinchew";
          return (
            <article
              key={article.id || idx}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer rounded-lg bg-[#141418] border border-white/10 p-5 flex flex-col justify-between hover:border-white/30 hover:bg-[#181820] transition-all shadow-md"
            >
              <div>
                {/* Card Top Utility Bar */}
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold font-serif-sc rounded ${
                        isSinChew
                          ? "bg-[#b91c1c]/20 text-[#ff8080] border border-[#b91c1c]/40"
                          : "bg-[#1e3a5f]/30 text-[#90caf9] border border-[#1e3a5f]/60"
                      }`}
                    >
                      {article.sourceName}
                    </span>
                    <span className="text-white/40">{article.categoryLabel}</span>
                  </div>

                  <span suppressHydrationWarning className="text-white/40 text-[11px]">
                    {new Date(article.timestamp).toLocaleTimeString("zh-Hans-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Card Headline */}
                <h4 className="font-serif-sc text-lg font-bold text-white group-hover:text-[#ffd8a8] transition-colors leading-snug line-clamp-2 mb-2">
                  {article.title}
                </h4>

                {/* Card Summary */}
                <p className="font-serif-sc text-xs text-white/60 line-clamp-3 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>{article.author || article.sourceName}</span>
                <span className="flex items-center gap-1 text-[#ffd8a8] font-semibold group-hover:translate-x-1 transition-transform">
                  阅读详情 <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
