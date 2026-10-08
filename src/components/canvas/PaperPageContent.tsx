"use client";

import React from "react";
import { NewsArticle } from "@/lib/news/types";
import { PaperThemeId, PAPER_THEMES } from "@/lib/theme/paperTheme";
import {
  Flame,
  Bookmark,
  Clock,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  Radio,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface PaperPageContentProps {
  type: "cover" | "leftSpread" | "rightSpread";
  sinChewArticles: NewsArticle[];
  chinaPressArticles: NewsArticle[];
  currentDate?: string;
  theme?: PaperThemeId;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const PaperPageContent: React.FC<PaperPageContentProps> = ({
  type,
  sinChewArticles,
  chinaPressArticles,
  currentDate = "2026年9月24日 星期四",
  theme = "vintage",
  onSelectArticle,
}) => {
  const currentTheme = PAPER_THEMES[theme] || PAPER_THEMES.vintage;
  const leadSinChew = sinChewArticles[0];
  const scStory2 = sinChewArticles[1];
  const scStory3 = sinChewArticles[2];
  const scStory4 = sinChewArticles[3];
  const scStory5 = sinChewArticles[4];

  const cpTopStory = chinaPressArticles[0];
  const cpFeedStories = chinaPressArticles.slice(1, 6);
  const cpWireStory = chinaPressArticles[6] || chinaPressArticles[1];

  // ==========================================
  // 1. COVER VIEW (Folded Front Page: 800 x 1140px)
  // ==========================================
  if (type === "cover") {
    return (
      <div
        style={{
          width: "800px",
          height: "1140px",
          backgroundColor: currentTheme.paperBg,
          color: currentTheme.inkText,
          borderColor: currentTheme.paperBorder,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
          contain: "layout style paint",
        }}
        className="w-[800px] h-[1140px] px-8 py-7 flex flex-col justify-between select-none shadow-2xl border-2 font-sans-sc overflow-hidden relative transition-colors duration-300"
      >
        {/* Newspaper Top Utility Banner */}
        <div className="border-b-4 border-double border-[#141414] pb-3">
          <div className="flex justify-between items-center text-xs font-mono text-[#555] tracking-wider mb-1.5">
            <span>MALAYSIA CHINESE PRESS ARCHIVE · NO. 28,642</span>
            <span>{currentDate} · 丙午年 八月十四</span>
          </div>

          <div className="text-center py-2">
            <p className="text-[11px] font-serif-sc tracking-[0.4em] uppercase text-[#666] font-semibold">
              TWIN STAR POST · 双星时报联合特刊
            </p>
            <h1 className="font-serif-sc text-6xl font-black tracking-tight text-[#141414] my-1">
              双星时报
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-serif-sc font-bold text-[#b91c1c]">
              <span>★ 星洲日报 × 中国报</span>
              <span>★ 双报联发展卷</span>
              <span>★ 3D 沉浸翻阅</span>
            </div>
          </div>

          {/* Market Indices Mini Strip */}
          <div className="bg-[#ece6d8]/70 border-t border-[#141414]/20 pt-1 mt-1 text-[10.5px] font-mono text-[#444] flex justify-between px-1">
            <span>马股 KLCI 1,672.48 (+0.28%)</span>
            <span>美元/令吉 4.2140 (-0.15%)</span>
            <span>原棕油 RM3,942</span>
            <span>黄金 $2,658.2</span>
          </div>
        </div>

        {/* Cover Feature Article (Clickable) */}
        <div
          onClick={() => leadSinChew && onSelectArticle?.(leadSinChew)}
          className="my-auto py-2 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center gap-2 bg-[#b91c1c] text-[#F4EFEA] px-3 py-1 text-xs font-bold font-serif-sc tracking-wider shadow-sm group-hover:bg-[#d32f2f] transition-colors">
              <Flame className="w-3.5 h-3.5" />
              <span>今日重磅头条 · 点击阅读详情</span>
            </div>
            <span className="text-xs font-mono text-[#777]">
              {leadSinChew?.categoryLabel || "深度报道"}
            </span>
          </div>

          <h2 className="font-serif-sc text-3xl sm:text-4xl font-extrabold leading-tight text-[#141414] tracking-tight mb-3 group-hover:text-[#b91c1c] transition-colors">
            {leadSinChew?.title || "内阁拍板全面加速国家AI基础设施建设 拨款20亿设立超级算力中心"}
          </h2>

          {/* Cover Hero Photo */}
          <div className="relative w-full h-[330px] bg-[#e2dccf] border-2 border-[#141414] my-3 overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
            <img
              src={
                leadSinChew?.imageUrl ||
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
              }
              alt="Feature Headline"
              className="w-full h-full object-cover contrast-125 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 inset-x-0 bg-[#141414]/90 text-[#F4EFEA] text-xs px-4 py-1.5 font-mono flex justify-between">
              <span>PHOTO: 星洲日报全媒体新闻摄影 · 现场纪实</span>
              <span className="flex items-center gap-1 text-[#ffd8a8] font-bold">
                点击展开全文 <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <p className="font-serif-sc text-sm text-[#2b2b2b] leading-relaxed line-clamp-3">
            {leadSinChew?.summary ||
              "数字部部长在布城宣布，内阁今日审议通过《国家主权人工智能发展总纲》，计划通过公私合营模式在柔佛和砂拉越建立两座绿色算力中心。"}
          </p>
        </div>

        {/* Cover Mid-page Dual Highlights */}
        <div className="grid grid-cols-2 gap-4 border-t-2 border-[#141414]/30 pt-3 pb-1">
          {scStory2 && (
            <div
              onClick={() => onSelectArticle?.(scStory2)}
              className="cursor-pointer group p-2 bg-[#ece6d8]/50 border border-[#d8d1c3] hover:bg-[#ece6d8] transition-colors"
            >
              <div className="text-[11px] font-mono font-bold text-[#b91c1c] flex items-center gap-1 mb-1">
                <span>【星洲要闻】</span>
                <span className="text-[#666]">{scStory2.categoryLabel}</span>
              </div>
              <h4 className="font-serif-sc text-sm font-bold text-[#141414] line-clamp-1 group-hover:text-[#b91c1c]">
                {scStory2.title}
              </h4>
            </div>
          )}

          {cpTopStory && (
            <div
              onClick={() => onSelectArticle?.(cpTopStory)}
              className="cursor-pointer group p-2 bg-[#ece6d8]/50 border border-[#d8d1c3] hover:bg-[#ece6d8] transition-colors"
            >
              <div className="text-[11px] font-mono font-bold text-[#1e3a5f] flex items-center gap-1 mb-1">
                <span>【中国报直击】</span>
                <span className="text-[#666]">{cpTopStory.categoryLabel}</span>
              </div>
              <h4 className="font-serif-sc text-sm font-bold text-[#141414] line-clamp-1 group-hover:text-[#1e3a5f]">
                {cpTopStory.title}
              </h4>
            </div>
          )}
        </div>

        {/* Cover Bottom Teaser & Fold Callout */}
        <div className="border-t-2 border-[#141414] pt-3 flex items-center justify-between text-xs text-[#555] font-mono">
          <div className="flex items-center gap-2 text-[#b91c1c] font-bold text-sm">
            <Bookmark className="w-4 h-4" />
            <span>向下滚动平滑展开双页大版面</span>
          </div>
          <span className="font-bold tracking-widest animate-pulse">
            SCROLL TO UNFOLD BROADSHEET ↓
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. LEFT SPREAD VIEW (Sin Chew Daily Broadsheet: 800 x 1140px)
  // ==========================================
  if (type === "leftSpread") {
    return (
      <div
        style={{
          width: "800px",
          height: "1140px",
          backgroundColor: currentTheme.paperBg,
          color: currentTheme.inkText,
          borderColor: currentTheme.paperBorder,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
          contain: "layout style paint",
        }}
        className="w-[800px] h-[1140px] px-8 py-6 flex flex-col justify-between select-none shadow-2xl border-r-2 font-sans-sc overflow-hidden relative transition-colors duration-300"
      >
        {/* Page Top Header */}
        <div className="border-b-4 border-double border-[#141414] pb-2 flex justify-between items-end shrink-0">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#777]">
              PAGE 02 · LEAD EDITORIAL SPREAD
            </span>
            <h2 className="font-serif-sc text-3xl font-black text-[#b91c1c] tracking-tight">
              星洲日报 · 头条特稿
            </h2>
          </div>
          <div className="text-right text-xs font-mono text-[#555]">
            <span>{currentDate}</span>
            <span className="mx-2">|</span>
            <span className="font-bold text-[#b91c1c]">实时特讯流</span>
          </div>
        </div>

        {/* Financial Market Index Strip */}
        <div className="bg-[#ece6d8]/70 border-b border-[#141414]/20 py-1 px-2 text-[10.5px] font-mono text-[#444] flex justify-between shrink-0">
          <span>吉隆坡综指 KLCI 1,672.48 (+0.28%)</span>
          <span>美元/令吉 4.2140 (-0.15%)</span>
          <span>新币/令吉 3.2680</span>
          <span>棕油期货 RM3,942</span>
          <span>现货黄金 $2,658.2</span>
        </div>

        {/* Lead Feature Article (Clickable) */}
        <div
          onClick={() => leadSinChew && onSelectArticle?.(leadSinChew)}
          className="cursor-pointer group shrink-0"
        >
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#b91c1c] text-[#F4EFEA] text-xs font-bold px-2 py-0.5 font-serif-sc">
                深度特稿
              </span>
              <span className="text-xs text-[#777] font-mono font-bold">
                {leadSinChew?.categoryLabel || "科技前沿"}
              </span>
              <span className="text-xs font-mono text-[#999]">
                {leadSinChew?.pubDate
                  ? new Date(leadSinChew.pubDate).toLocaleTimeString("zh-MY", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "即时"}
              </span>
            </div>
            <span className="text-xs text-[#b91c1c] font-mono font-bold flex items-center gap-1 group-hover:underline">
              点击阅读完整详讯 <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <h3 className="font-serif-sc text-3xl sm:text-[31px] font-black leading-snug text-[#111] tracking-tight mb-2 group-hover:text-[#b91c1c] transition-colors">
            {leadSinChew?.title || "内阁拍板全面加速国家AI基础设施建设 拨款20亿设立超级算力中心"}
          </h3>

          {/* Feature Image with Caption */}
          <div className="relative w-full h-[200px] bg-[#e2dccf] border border-[#141414]/30 mb-2 overflow-hidden shadow-sm">
            <img
              src={
                leadSinChew?.imageUrl ||
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
              }
              alt="Lead Story"
              className="w-full h-full object-cover contrast-115 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-1 right-2 bg-[#141414]/85 text-[#F4EFEA] px-2.5 py-0.5 text-[11px] font-mono">
              星洲特派影像中心 · 现场实景
            </div>
          </div>

          {/* Two-Column Editorial Typography */}
          <div className="grid grid-cols-2 gap-5 text-[15px] font-serif-sc text-[#111] leading-relaxed">
            <div>
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#b91c1c] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none text-justify font-medium">
                {leadSinChew?.summary ||
                  "数字部部长在布城宣布，内阁今日审议通过《国家主权人工智能发展总纲》，计划通过公私合营模式在柔佛和砂拉越建立两座绿色算力中心，以满足东盟区域对算力与大数据处理的爆发式增长需求。"}
              </p>
            </div>
            <div className="border-l border-[#d3ccbe] pl-4">
              <p className="text-justify line-clamp-4 text-[#222]">
                {leadSinChew?.content ||
                  "多家具备国际领军实力的科技集团已初步签署意向备忘录，预计将带动数万个高薪科技岗位，并协助本土中小微企业完成智能化转型。专家呼吁加大本土科技人才培育力度，为高精尖产业注入源源不断的创新驱动力。"}
              </p>
              <div className="mt-2 text-xs text-[#777] font-mono flex items-center justify-between pt-1 border-t border-[#e5dfd3]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#b91c1c]" />
                  <span>{leadSinChew?.author || "星洲特派特稿组"}</span>
                </div>
                <span className="text-[#b91c1c] font-bold">全版推荐</span>
              </div>
            </div>
          </div>

          {/* Editorial Key Insights Box (Fill gaps with meaningful journalistic synthesis) */}
          <div className="mt-2 p-2.5 bg-[#ece6d8]/70 border border-[#d8d1c3] rounded text-xs font-serif-sc">
            <div className="flex items-center gap-1.5 text-[#b91c1c] font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>本报观察 · 核心看点聚焦 (KEY TAKEAWAYS)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[12.5px] text-[#222] leading-snug font-medium">
              <div className="border-r border-[#d8d1c3] pr-2">
                <span className="font-bold text-[#141414]">● 政策统筹：</span>
                推进国家协同发展战略，健全配套监管与长效保障机制。
              </div>
              <div className="border-r border-[#d8d1c3] pr-2">
                <span className="font-bold text-[#141414]">● 产业反响：</span>
                业界普遍看好长期发展动能，呼吁加速跨部门落地实施。
              </div>
              <div>
                <span className="font-bold text-[#141414]">● 区域辐射：</span>
                持续追踪东盟产供链与外资流向，巩固科技枢纽定位。
              </div>
            </div>
          </div>
        </div>

        {/* Mid-Page Divider */}
        <div className="border-t-2 border-[#141414] my-2 shrink-0" />

        {/* Dual Sub-Features Grid (Secondary & Tertiary Stories) */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          {/* Card A: Secondary Story */}
          {scStory2 && (
            <div
              onClick={() => onSelectArticle?.(scStory2)}
              className="cursor-pointer group p-3 bg-[#ece6d8]/40 border border-[#d8d1c3] hover:bg-[#ece6d8]/90 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-[#b91c1c]">
                    【重磅追踪】
                  </span>
                  <span className="text-[11px] text-[#666] font-serif-sc">
                    {scStory2.categoryLabel}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#b91c1c] font-semibold flex items-center gap-0.5 group-hover:underline">
                  阅读全文 <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <h4 className="font-serif-sc text-[17px] font-bold text-[#141414] line-clamp-2 group-hover:text-[#b91c1c] leading-snug">
                {scStory2.title}
              </h4>
              <p className="text-[13.5px] text-[#444] font-serif-sc line-clamp-2 mt-1 leading-normal font-normal">
                {scStory2.summary}
              </p>
              <div className="mt-1.5 text-[11px] text-[#777] font-mono flex justify-between">
                <span>{scStory2.author || "星洲特约记者"}</span>
                <span>
                  {new Date(scStory2.timestamp).toLocaleTimeString("zh-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Card B: Tertiary Story */}
          {scStory3 && (
            <div
              onClick={() => onSelectArticle?.(scStory3)}
              className="cursor-pointer group p-3 bg-[#ece6d8]/40 border border-[#d8d1c3] hover:bg-[#ece6d8]/90 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-[#1e3a5f]">
                    【焦点观察】
                  </span>
                  <span className="text-[11px] text-[#666] font-serif-sc">
                    {scStory3.categoryLabel}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#1e3a5f] font-semibold flex items-center gap-0.5 group-hover:underline">
                  阅读全文 <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <h4 className="font-serif-sc text-[17px] font-bold text-[#141414] line-clamp-2 group-hover:text-[#1e3a5f] leading-snug">
                {scStory3.title}
              </h4>
              <p className="text-[13.5px] text-[#444] font-serif-sc line-clamp-2 mt-1 leading-normal font-normal">
                {scStory3.summary}
              </p>
              <div className="mt-1.5 text-[11px] text-[#777] font-mono flex justify-between">
                <span>{scStory3.author || "星洲综合报道"}</span>
                <span>
                  {new Date(scStory3.timestamp).toLocaleTimeString("zh-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Rapid Wire Briefs (Stories 4 & 5) */}
        <div className="border-t border-[#141414]/30 pt-2 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#555] mb-1">
            <span className="flex items-center gap-1 text-[#b91c1c]">
              <Radio className="w-3 h-3 animate-pulse" />
              即时短波快讯 · NEWS WIRE BRIEFS
            </span>
            <span>24H UPDATES</span>
          </div>

          <div className="space-y-1">
            {scStory4 && (
              <div
                onClick={() => onSelectArticle?.(scStory4)}
                className="flex items-center justify-between text-xs py-1 px-1.5 hover:bg-[#ece6d8] cursor-pointer group rounded"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-[10.5px] font-mono bg-white/70 border border-[#141414]/15 px-1 py-0.2 shrink-0 text-[#b91c1c] font-bold">
                    {scStory4.categoryLabel}
                  </span>
                  <span className="font-serif-sc truncate group-hover:text-[#b91c1c] text-[#141414] font-medium">
                    {scStory4.title}
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-[#888] shrink-0 flex items-center gap-1">
                  {new Date(scStory4.timestamp).toLocaleTimeString("zh-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            )}

            {scStory5 && (
              <div
                onClick={() => onSelectArticle?.(scStory5)}
                className="flex items-center justify-between text-xs py-1 px-1.5 hover:bg-[#ece6d8] cursor-pointer group rounded"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-[10.5px] font-mono bg-white/70 border border-[#141414]/15 px-1 py-0.2 shrink-0 text-[#1e3a5f] font-bold">
                    {scStory5.categoryLabel}
                  </span>
                  <span className="font-serif-sc truncate group-hover:text-[#1e3a5f] text-[#141414] font-medium">
                    {scStory5.title}
                  </span>
                </div>
                <span className="text-[10.5px] font-mono text-[#888] shrink-0 flex items-center gap-1">
                  {new Date(scStory5.timestamp).toLocaleTimeString("zh-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Page Bottom Footer */}
        <div className="border-t-2 border-[#141414] pt-2 flex justify-between items-center text-xs font-mono text-[#666] shrink-0">
          <span>SIN CHEW DAILY · ALL RIGHTS RESERVED 2026</span>
          <span className="font-bold text-sm text-[#141414]">02</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. RIGHT SPREAD VIEW (China Press Trending Broadsheet: 800 x 1140px)
  // ==========================================
  return (
    <div
      style={{
        width: "800px",
        height: "1140px",
        backgroundColor: currentTheme.paperBg,
        color: currentTheme.inkText,
        borderColor: currentTheme.paperBorder,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        willChange: "transform",
        contain: "layout style paint",
      }}
      className="w-[800px] h-[1140px] px-8 py-6 flex flex-col justify-between select-none shadow-2xl border-l-2 font-sans-sc overflow-hidden relative transition-colors duration-300"
    >
      {/* Page Top Header */}
      <div className="border-b-4 border-double border-[#141414] pb-2 flex justify-between items-end shrink-0">
        <div className="text-left text-xs font-mono text-[#555]">
          <span className="font-bold text-sm text-[#141414]">03</span>
          <span className="mx-2">/</span>
          <span>CHINA PRESS RADAR</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#777]">
            PAGE 03 · TRENDING FEED
          </span>
          <h2 className="font-serif-sc text-3xl font-black text-[#1e3a5f] tracking-tight">
            中国报 · 今日焦点风云榜
          </h2>
        </div>
      </div>

      {/* Live Radar Subtitle Strip */}
      <div className="bg-[#1e3a5f]/10 border-b border-[#1e3a5f]/25 py-1 px-2 text-[11px] font-mono text-[#1e3a5f] flex justify-between shrink-0">
        <span className="font-bold flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#b91c1c]" />
          24小时热度风云榜 · 汇聚全马最快突发要闻
        </span>
        <span>每 3 分钟自动刷新</span>
      </div>

      {/* Rank 01: Featured Spotlight Card */}
      {cpTopStory && (
        <div
          onClick={() => onSelectArticle?.(cpTopStory)}
          className="cursor-pointer group p-3 bg-[#ece6d8] border-2 border-[#1e3a5f]/30 hover:border-[#1e3a5f] transition-all rounded shadow-sm shrink-0"
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#1e3a5f] text-white px-2 py-0.5 font-bold text-[11px] rounded-sm flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#ff8080]" />
                01 头条直击
              </span>
              <span className="bg-white/80 border border-[#1e3a5f]/20 text-[#1e3a5f] font-serif-sc font-bold px-1.5 py-0.5 text-xs">
                {cpTopStory.categoryLabel}
              </span>
            </div>
            <span className="text-[#666]">
              {new Date(cpTopStory.timestamp).toLocaleTimeString("zh-MY", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <h3 className="font-serif-sc text-[21px] font-black text-[#111] leading-snug group-hover:text-[#1e3a5f] transition-colors mb-1">
            {cpTopStory.title}
          </h3>

          <p className="text-[14px] text-[#222] font-serif-sc line-clamp-2 leading-relaxed font-normal">
            {cpTopStory.summary}
          </p>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#777] font-mono pt-1.5 border-t border-[#d8d1c3]">
            <span>{cpTopStory.author || "中国报综合组报道"}</span>
            <span className="flex items-center gap-1 text-[#1e3a5f] font-bold group-hover:translate-x-0.5 transition-transform">
              点击阅读完整详讯 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* Rank 02 to 06: Trending Feed Cards */}
      <div className="space-y-2 shrink-0">
        {cpFeedStories.map((article, idx) => (
          <div
            key={article.id || idx}
            onClick={() => onSelectArticle?.(article)}
            className="group cursor-pointer border-b border-[#141414]/15 pb-1.5 last:border-b-0 hover:bg-[#ece6d8]/90 transition-colors px-2 py-1.5 -mx-2 rounded"
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] text-[#F4EFEA] flex items-center justify-center font-bold text-[11px] group-hover:bg-[#1e3a5f] transition-colors">
                  0{idx + 2}
                </span>
                <span className="bg-[#1e3a5f]/15 text-[#1e3a5f] font-serif-sc font-bold px-1.5 py-0.2 text-[11px]">
                  {article.categoryLabel}
                </span>
              </div>
              <span className="text-[#666] text-[11px]">
                {new Date(article.timestamp).toLocaleTimeString("zh-MY", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h4 className="font-serif-sc text-[17px] font-bold text-[#111] leading-snug group-hover:text-[#1e3a5f] transition-colors line-clamp-1">
              {article.title}
            </h4>

            <p className="text-[13px] text-[#333] font-serif-sc line-clamp-1 mt-0.5 leading-normal">
              {article.summary}
            </p>

            <div className="mt-1 flex items-center justify-between text-[11px] text-[#777] font-mono">
              <span>{article.author || "中国报即时组"}</span>
              <span className="flex items-center gap-1 text-[#1e3a5f] font-semibold group-hover:translate-x-1 transition-transform">
                查看原文 & 深度分析 <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Topics & Radar Wire */}
      <div className="p-2.5 bg-[#e5dfd3] border border-[#141414]/25 rounded text-xs shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[11px] text-[#1e3a5f] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#b91c1c]" />
            全马焦点热搜词：
          </span>
          <span className="text-[10px] font-mono text-[#666]">LIVE RADAR</span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] font-serif-sc text-[#333]">
          <span className="px-1.5 py-0.5 bg-white/70 border border-[#141414]/15 rounded">#大马羽球赛</span>
          <span className="px-1.5 py-0.5 bg-white/70 border border-[#141414]/15 rounded">#吉隆坡轻轨三期</span>
          <span className="px-1.5 py-0.5 bg-white/70 border border-[#141414]/15 rounded">#令吉汇率走势</span>
          <span className="px-1.5 py-0.5 bg-white/70 border border-[#141414]/15 rounded">#绿色算力中心</span>
          <span className="px-1.5 py-0.5 bg-white/70 border border-[#141414]/15 rounded">#民生物价机制</span>
        </div>

        {cpWireStory && (
          <div
            onClick={() => onSelectArticle?.(cpWireStory)}
            className="mt-2 pt-1.5 border-t border-[#141414]/15 flex items-center justify-between cursor-pointer group text-[11px]"
          >
            <div className="flex items-center gap-1.5 truncate mr-2">
              <span className="bg-[#b91c1c] text-white px-1 font-bold text-[10px]">快讯</span>
              <span className="truncate group-hover:text-[#1e3a5f]">{cpWireStory.title}</span>
            </div>
            <ArrowRight className="w-3 h-3 text-[#1e3a5f] shrink-0" />
          </div>
        )}
      </div>

      {/* Bottom China Press Interactive Bar */}
      <div className="p-3 bg-[#141414] text-[#F4EFEA] border border-[#141414] flex items-center justify-between text-xs shrink-0 rounded-sm">
        <div className="font-serif-sc">
          <span className="font-bold text-sm text-[#F4EFEA] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#ff8080]" />
            中国报 24H 实时监控雷达
          </span>
          <p className="text-[11px] text-[#ccc] mt-0.5">
            点击上方任意资讯条目即可滑出抽屉式阅读完整详讯
          </p>
        </div>
        <span className="font-mono text-xs bg-white text-[#141414] px-2.5 py-1 font-bold shrink-0 ml-3">
          INTERACTIVE
        </span>
      </div>

      {/* Page Bottom Footer */}
      <div className="border-t-2 border-[#141414] pt-2 flex justify-between items-center text-xs font-mono text-[#666] shrink-0">
        <span>CHINA PRESS MALAYSIA · RADAR NETWORK</span>
        <span className="font-bold text-sm text-[#141414]">03</span>
      </div>
    </div>
  );
};

export default PaperPageContent;
