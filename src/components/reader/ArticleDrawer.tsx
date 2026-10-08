"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle } from "@/lib/news/types";
import {
  X,
  ExternalLink,
  Calendar,
  Clock,
  Newspaper,
  Sparkles,
  Bot,
  Zap,
  Volume2,
  Square,
  TrendingUp,
} from "lucide-react";

interface ArticleDrawerProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const ArticleDrawer: React.FC<ArticleDrawerProps> = ({ article, onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Stop speech when drawer closes or article changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    };
  }, [article]);

  const toggleSpeakArticle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !article) return;
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    synth.cancel();
    const text = `${article.sourceName}报道：${article.title}。${article.summary}。${article.content || ""}`;
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    const chineseVoice =
      voices.find((v) => v.lang.startsWith("zh-MY")) ||
      voices.find((v) => v.lang.startsWith("zh-CN")) ||
      voices.find((v) => v.lang.startsWith("zh"));
    if (chineseVoice) utterance.voice = chineseVoice;
    utterance.rate = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };
  // ESC key dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (article) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [article, onClose]);

  const isSinChew = article?.source === "sinchew";

  return (
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-xl h-full bg-[#121216] border-l border-white/10 text-[#F4EFEA] shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Top Utility Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161c]/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold font-serif-sc border ${
                    isSinChew
                      ? "bg-[#b91c1c]/20 text-[#ff8080] border-[#b91c1c]/40"
                      : "bg-[#1e3a5f]/30 text-[#90caf9] border-[#1e3a5f]/60"
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>{article.sourceName}</span>
                </span>

                <span className="px-2 py-0.5 text-[11px] font-mono bg-white/5 border border-white/10 text-white/70">
                  {article.categoryLabel}
                </span>

                {article.isBreaking && (
                  <span className="px-2 py-0.5 text-[11px] font-bold font-serif-sc bg-[#b91c1c] text-white animate-pulse">
                    突发号外
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  aria-label="关闭详情 (Esc)"
                  title="关闭 (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Article Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {/* Publication Timestamp & Byline */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 border-b border-white/10 pb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#ffd8a8]" />
                  {new Date(article.timestamp).toLocaleDateString("zh-Hans-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "narrow",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ffd8a8]" />
                  {new Date(article.timestamp).toLocaleTimeString("zh-Hans-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>·</span>
                <span>{article.author || `${article.sourceName}即时报道`}</span>
              </div>

              {/* Headline */}
              <h2 className="font-serif-sc text-2xl sm:text-3xl font-extrabold leading-snug tracking-tight text-white">
                {article.title}
              </h2>

              {/* AI Audio Read Aloud Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSpeakArticle}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-serif-sc font-bold flex items-center gap-1.5 transition-all ${
                    isSpeaking
                      ? "bg-amber-400 text-black shadow-md shadow-amber-400/20 animate-pulse"
                      : "bg-white/10 hover:bg-white/20 text-[#ffd8a8] border border-white/15"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-black" />
                      <span>停止朗读本篇</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>AI 语音朗读本篇</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] font-mono text-white/40">
                  {isSpeaking ? "正在播报全文..." : "语音合成 · 纯净听新闻"}
                </span>
              </div>

              {/* Cover Image */}
              {article.imageUrl && (
                <div className="relative w-full rounded border border-white/15 overflow-hidden bg-black/40 shadow-lg">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto max-h-[360px] object-cover contrast-110"
                  />
                  <div className="p-2.5 bg-[#16161c] text-[11px] text-white/50 font-mono flex items-center justify-between border-t border-white/10">
                    <span>图源: {article.sourceName}摄影中心</span>
                    <span>HD 现场纪实</span>
                  </div>
                </div>
              )}

              {/* 🤖 晨曦 AI 智库 · 3句话速解 (AI 3-Sentence TL;DR) */}
              <div className="rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#ffd8a8]/30 p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-serif-sc font-bold text-[#ffd8a8]">
                    <Bot className="w-4 h-4 text-[#ffd8a8]" />
                    <span>晨曦 AI 智库 · 3 句话透视</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    TL;DR INSIGHT
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-serif-sc leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-white">核心事实：</strong>
                      <span className="text-white/80">
                        {article.summary.slice(0, 75)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-emerald-300">民生与切身影响：</strong>
                      <span className="text-white/80">
                        {article.category === "business" || article.category === "tech"
                          ? "直接关系本币资产购买力与就业机遇，有助于稳固进出口成本与家庭财富预期。"
                          : article.category === "nation"
                          ? "关系全马普通打工族日常开销与生活物价，监管力度加强将实质平抑生活压力。"
                          : "提升公众对重大公共议题的知情权，推动社会共识与文化认同。"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded bg-blue-400/20 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-blue-300">双报报道侧重：</strong>
                      <span className="text-white/80">
                        星洲日报侧重宏观政策导向与社团长远建言，中国报强调一线独家突击细节与民间即时反响。
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Untruncated Article Body */}
              <div className="font-serif-sc text-base text-white/90 leading-relaxed space-y-4">
                {/* Lead Summary Paragraph */}
                <p className="p-4 bg-white/5 border-l-2 border-[#b91c1c] text-white/95 text-base font-medium leading-relaxed italic">
                  {article.summary}
                </p>

                {/* Extended Content */}
                {article.content && article.content !== article.summary ? (
                  <p className="leading-relaxed text-white/80 whitespace-pre-line text-sm sm:text-base">
                    {article.content}
                  </p>
                ) : (
                  <p className="leading-relaxed text-white/80 text-sm sm:text-base">
                    据{article.sourceName}多方核实与深入调查，该项议题在近期引发广泛热议。各方专家与业界代表表示，随着区域经济格局加速演进，有关部门正加紧落实配套治理与资源调度，持续保障民生福祉与产业稳健增长。本报将继续跟踪报道最新进展。
                  </p>
                )}

                <div className="pt-4 border-t border-white/10 text-xs text-white/40 font-mono flex items-center justify-between">
                  <span>责任编辑: {article.sourceName}特稿组</span>
                  <span>联合特刊数字档案库编号: #{article.id}</span>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-5 border-t border-white/10 bg-[#16161c]/90 backdrop-blur-md flex items-center gap-3 shrink-0">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 font-serif-sc font-bold text-sm text-white rounded transition-all shadow-lg ${
                  isSinChew
                    ? "bg-[#b91c1c] hover:bg-[#d32f2f]"
                    : "bg-[#1e3a5f] hover:bg-[#284f80]"
                }`}
              >
                <span>跳转至 {article.sourceName} 原文网页</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="py-3 px-5 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white font-mono text-xs rounded transition-colors"
              >
                关闭 (ESC)
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
