"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  ChevronDown,
  ChevronUp,
  X,
  Gauge,
  Headphones,
  Sliders,
  Check,
  ExternalLink,
  Heart,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle } from "@/lib/news/types";

interface AiNewsBroadcasterProps {
  articles: NewsArticle[];
  onSelectArticle?: (article: NewsArticle) => void;
}

interface VoicePreset {
  id: string;
  name: string;
  tag: string;
  desc: string;
  icon: string;
  defaultPitch: number;
  defaultRate: number;
  defaultVolume: number;
}

const VOICE_PRESETS: VoicePreset[] = [
  {
    id: "doubao-soft",
    name: "晓晓（豆包治愈风 · 推荐）",
    tag: "温柔知性",
    desc: "细腻温润、语调舒缓柔和，如豆包轻语陪伴",
    icon: "🌸",
    defaultPitch: 0.94,
    defaultRate: 0.90,
    defaultVolume: 0.92,
  },
  {
    id: "sweet-light",
    name: "晓伊（晨读轻语）",
    tag: "甜美柔润",
    desc: "声线清新甜美，晨光中的温和早报",
    icon: "✨",
    defaultPitch: 1.02,
    defaultRate: 0.94,
    defaultVolume: 0.90,
  },
  {
    id: "warm-male",
    name: "云希（暖心阳光）",
    tag: "亲切青年",
    desc: "温暖磁性、充满朝气，如好友在旁播报",
    icon: "🎙️",
    defaultPitch: 0.96,
    defaultRate: 0.92,
    defaultVolume: 0.92,
  },
  {
    id: "news-anchor",
    name: "云健（专业新闻台）",
    tag: "沉稳大台",
    desc: "浑厚温润、从容稳重的新闻主笔风范",
    icon: "☕",
    defaultPitch: 0.88,
    defaultRate: 0.88,
    defaultVolume: 0.95,
  },
];

interface BroadcastTrack {
  id: number;
  label: string;
  spokenText: string;
  displayHeadline: string;
  article: NewsArticle | null;
}

export const AiNewsBroadcaster: React.FC<AiNewsBroadcasterProps> = ({
  articles,
  onSelectArticle,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  // Clean title for natural spoken speech without mechanical symbols
  const cleanSpokenText = (text: string) => {
    return text
      .replace(/【.*?】/g, "")
      .replace(/（.*?）/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\|.*/g, "")
      .replace(/丨.*/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/[-_]/g, " ")
      .trim();
  };

  // Load browser speech synthesis voices with onvoiceschanged support
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const zhVoices = allVoices.filter(
        (v) =>
          v.lang.startsWith("zh") ||
          v.lang.includes("cmn") ||
          v.lang.includes("Chinese") ||
          v.name.includes("Chinese") ||
          v.name.includes("Xiaoxiao") ||
          v.name.includes("Yunxi") ||
          v.name.includes("Xiaoyi")
      );
      setAvailableVoices(zhVoices.length > 0 ? zhVoices : allVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Pick the best natural neural voice based on selected preset
  const activeVoice = useMemo(() => {
    if (availableVoices.length === 0) return null;

    // If user explicitly picked a voice from detailed list
    if (selectedVoiceName) {
      const found = availableVoices.find((v) => v.name === selectedVoiceName);
      if (found) return found;
    }

    // Auto-match based on preset
    if (selectedPreset.id === "doubao-soft") {
      return (
        availableVoices.find((v) => v.name.includes("Xiaoxiao")) ||
        availableVoices.find((v) => v.name.includes("Natural") && !v.name.includes("Male")) ||
        availableVoices.find((v) => v.name.includes("Google") && v.lang.startsWith("zh")) ||
        availableVoices.find((v) => v.name.includes("Tingting") || v.name.includes("Yaoyao")) ||
        availableVoices.find((v) => v.lang.startsWith("zh-CN") && !v.name.includes("Huihui")) ||
        availableVoices[0]
      );
    }
    if (selectedPreset.id === "sweet-light") {
      return (
        availableVoices.find((v) => v.name.includes("Xiaoyi")) ||
        availableVoices.find((v) => v.name.includes("Xiaoxiao")) ||
        availableVoices.find((v) => v.name.includes("Sinji") || v.name.includes("Meijia")) ||
        availableVoices.find((v) => v.name.includes("Google") && v.lang.startsWith("zh")) ||
        availableVoices[0]
      );
    }
    if (selectedPreset.id === "warm-male") {
      return (
        availableVoices.find((v) => v.name.includes("Yunxi")) ||
        availableVoices.find((v) => v.name.includes("Natural") && v.name.includes("Male")) ||
        availableVoices.find((v) => v.name.includes("Kangkang")) ||
        availableVoices[0]
      );
    }
    if (selectedPreset.id === "news-anchor") {
      return (
        availableVoices.find((v) => v.name.includes("Yunjian") || v.name.includes("Yunyang")) ||
        availableVoices.find((v) => v.name.includes("Male")) ||
        availableVoices[0]
      );
    }

    return availableVoices[0];
  }, [availableVoices, selectedPreset, selectedVoiceName]);

  // Build segmented playlist tracks with natural spoken conversational phrasing
  const playlistTracks: BroadcastTrack[] = useMemo(() => {
    if (!articles || articles.length === 0) {
      return [
        {
          id: 0,
          label: "开篇晨报",
          spokenText: "亲爱的读者朋友，早上好。欢迎收听晨曦时报，今日重点要闻正在汇聚中，祝您生活愉快。",
          displayHeadline: "晨曦时报 AI 温润电台正在初始化...",
          article: null,
        },
      ];
    }

    const topItems = articles.slice(0, 4);
    const dateStr = new Date().toLocaleDateString("zh-Hans-CN", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const tracks: BroadcastTrack[] = [];

    // Track 0: Greeting + Lead Story
    if (topItems[0]) {
      const t1 = cleanSpokenText(topItems[0].title);
      const s1 = cleanSpokenText(topItems[0].summary || "").slice(0, 75);
      tracks.push({
        id: 0,
        label: "头条焦点",
        spokenText: `亲爱的读者朋友，早上好。今天是${dateStr}，欢迎收听双星时报为您准备的温润早报。首先关注今日头条，${topItems[0].sourceName}报道：${t1}……${s1}`,
        displayHeadline: `【头条】${topItems[0].title}`,
        article: topItems[0],
      });
    }

    // Track 1: Second Story
    if (topItems[1]) {
      const t2 = cleanSpokenText(topItems[1].title);
      const s2 = cleanSpokenText(topItems[1].summary || "").slice(0, 75);
      tracks.push({
        id: 1,
        label: "全国聚焦",
        spokenText: `接下来关注第二条要闻，来自${topItems[1].sourceName}的报道：${t2}……${s2}`,
        displayHeadline: `【要闻】${topItems[1].title}`,
        article: topItems[1],
      });
    }

    // Track 2: Third Story
    if (topItems[2]) {
      const t3 = cleanSpokenText(topItems[2].title);
      const s3 = cleanSpokenText(topItems[2].summary || "").slice(0, 75);
      tracks.push({
        id: 2,
        label: "财经前沿",
        spokenText: `在财经与前沿动态方面，${topItems[2].sourceName}提到：${t3}……${s3}`,
        displayHeadline: `【财经】${topItems[2].title}`,
        article: topItems[2],
      });
    }

    // Track 3: Fourth Story
    if (topItems[3]) {
      const t4 = cleanSpokenText(topItems[3].title);
      const s4 = cleanSpokenText(topItems[3].summary || "").slice(0, 75);
      tracks.push({
        id: 3,
        label: "社会热点",
        spokenText: `另外还有一条热点资讯，来自${topItems[3].sourceName}：${t4}……${s4}`,
        displayHeadline: `【热点】${topItems[3].title}`,
        article: topItems[3],
      });
    }

    // Track 4: Outro & warm wishes
    tracks.push({
      id: 4,
      label: "早间结语",
      spokenText: "以上就是今天为您精心梳理的晨报精选速览。您可以翻阅下方的 3D 报刊或热榜阅读图文全文。感谢您的聆听，愿您度过温暖顺遂的一天。",
      displayHeadline: "早报播报完毕 · 感谢您的聆听与陪伴",
      article: null,
    });

    return tracks;
  }, [articles]);

  const currentTrack = playlistTracks[currentTrackIndex] || playlistTracks[0];

  // Progress tracker timer
  const startProgressTracking = (textLength: number, rate: number) => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgressPercent(0);

    // Approximate speech speed: ~4-5 characters per second at 1.0x
    const estimatedDurationMs = (textLength / (4.2 * rate)) * 1000;
    const intervalMs = 250;
    const step = (intervalMs / estimatedDurationMs) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 98) return 98;
        return Math.min(prev + step, 98);
      });
    }, intervalMs);
  };

  // Play a specific track (0ms instant execution)
  const playTrack = useCallback(
    (trackIdx: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (trackIdx < 0 || trackIdx >= playlistTracks.length) return;

      const synth = window.speechSynthesis;
      synth.cancel();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);

      const track = playlistTracks[trackIdx];
      setCurrentTrackIndex(trackIdx);

      const utterance = new SpeechSynthesisUtterance(track.spokenText);
      utteranceRef.current = utterance;

      if (activeVoice) {
        utterance.voice = activeVoice;
      }

      // Soft, humanized tuning: gentle pitch and unhurried rate
      const effectiveRate = selectedPreset.defaultRate * playbackSpeed;
      utterance.pitch = selectedPreset.defaultPitch;
      utterance.rate = effectiveRate;
      utterance.volume = isMuted ? 0 : selectedPreset.defaultVolume;

      utterance.onstart = () => {
        setIsPlaying(true);
        startProgressTracking(track.spokenText.length, effectiveRate);
      };

      utterance.onend = () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setProgressPercent(100);

        // Auto-advance to next track smoothly!
        const nextIdx = trackIdx + 1;
        if (nextIdx < playlistTracks.length) {
          setTimeout(() => {
            playTrack(nextIdx);
          }, 350);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        setIsPlaying(false);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };

      // Speak immediately!
      synth.speak(utterance);
    },
    [playlistTracks, activeVoice, selectedPreset, playbackSpeed, isMuted]
  );

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
      return;
    }

    // Play current track immediately
    playTrack(currentTrackIndex);
  };

  // Next Track
  const handleNextTrack = () => {
    const next = currentTrackIndex + 1;
    if (next < playlistTracks.length) {
      playTrack(next);
    }
  };

  // Previous Track
  const handlePrevTrack = () => {
    const prev = currentTrackIndex - 1;
    if (prev >= 0) {
      playTrack(prev);
    }
  };

  // Restart from beginning
  const handleRestart = () => {
    playTrack(0);
  };

  // Switch voice preset
  const handleSelectPreset = (preset: VoicePreset) => {
    setSelectedPreset(preset);
    setSelectedVoiceName(""); // reset custom override
    setIsVoicePickerOpen(false);

    if (isPlaying) {
      setTimeout(() => {
        playTrack(currentTrackIndex);
      }, 50);
    }
  };

  // Change speed
  const handleSpeedChange = () => {
    const next = playbackSpeed === 1.0 ? 1.2 : playbackSpeed === 1.2 ? 0.9 : 1.0;
    setPlaybackSpeed(next);
    if (isPlaying) {
      playTrack(currentTrackIndex);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = nextMuted ? 0 : selectedPreset.defaultVolume;
    }
  };

  if (!isSupported) return null;

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 transition-all duration-300 select-none ${
        isMinimized ? "w-auto" : "w-[350px] sm:w-[410px]"
      }`}
    >
      {/* Minimized Floating Pill State */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#121118]/90 hover:bg-[#1C1A24] border border-pink-500/30 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping absolute" />
            <Radio className="w-4 h-4 text-pink-400 relative z-10" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5 font-serif-sc">
              <span>{selectedPreset.icon}</span>
              <span>AI 温润播报</span>
              {isPlaying && (
                <span className="text-[10px] text-pink-300 animate-pulse font-mono font-normal">
                  · 播放中
                </span>
              )}
            </span>
            <span className="text-[10px] text-white/50 truncate max-w-[120px]">
              {selectedPreset.tag} · {currentTrack.label}
            </span>
          </div>

          <ChevronUp className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
        </button>
      ) : (
        /* Expanded Full Glassmorphism Player Card */
        <div className="relative rounded-2xl bg-[#0D0C13]/95 border border-pink-500/20 shadow-2xl backdrop-blur-2xl p-4 sm:p-5 flex flex-col gap-3.5 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/10 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Header Row: Title + Voice Style Badge + Minimize */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400">
                <Headphones className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white font-serif-sc tracking-wide">
                    双星 AI 温润电台
                  </h4>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                    豆包声线
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {/* Voice Selector Trigger */}
                  <button
                    onClick={() => setIsVoicePickerOpen((prev) => !prev)}
                    className="text-[11px] text-white/70 hover:text-pink-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{selectedPreset.icon}</span>
                    <span className="font-medium underline underline-offset-2 decoration-pink-500/40">
                      {selectedPreset.name}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                </div>
              </div>
            </div>

            {/* Window Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              title="最小化为悬浮气泡"
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Preset Picker Dropdown */}
          <AnimatePresence>
            {isVoicePickerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-[#161420] border border-white/10 rounded-xl p-2.5 flex flex-col gap-1.5 relative z-20 shadow-xl"
              >
                <div className="flex items-center justify-between px-1 pb-1 border-b border-white/10 text-[11px] text-white/60">
                  <span className="font-medium">选择播音声线风格</span>
                  <span className="text-[10px] text-pink-400">0延迟 · 温和拟人</span>
                </div>

                {VOICE_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left ${
                        isSelected
                          ? "bg-pink-500/20 border border-pink-500/40 text-white"
                          : "hover:bg-white/5 text-white/75 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{preset.icon}</span>
                        <div>
                          <div className="font-semibold flex items-center gap-1.5">
                            <span>{preset.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-normal">
                              {preset.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 line-clamp-1">{preset.desc}</p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Playback Content: Soundwave Visualizer & Current Headline */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {/* 7-Bar Animated Equalizer */}
                <div className="flex items-center gap-0.5 h-3.5 px-1">
                  {[35, 75, 50, 90, 60, 80, 45].map((h, i) => (
                    <span
                      key={i}
                      className={`w-0.5 rounded-full transition-all duration-300 ${
                        isPlaying ? "bg-pink-400 animate-pulse" : "bg-white/20 h-1"
                      }`}
                      style={{
                        height: isPlaying ? `${h}%` : "3px",
                        animationDelay: `${i * 100}ms`,
                        animationDuration: "600ms",
                      }}
                    />
                  ))}
                </div>

                <span className="text-white/50 text-[10px] font-mono">
                  {isPlaying
                    ? `正在温润朗读 · ${currentTrack.label}`
                    : `待播状态 · ${currentTrack.label}`}
                </span>
              </div>

              {/* Track Index Badge */}
              <div className="text-[10px] font-mono text-pink-300/80 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                篇章 {currentTrackIndex + 1} / {playlistTracks.length}
              </div>
            </div>

            {/* Current Spoken Headline */}
            <p className="text-xs text-white/90 font-serif-sc line-clamp-2 leading-relaxed min-h-[36px]">
              {currentTrack.displayHeadline}
            </p>

            {/* Quick jump to active article */}
            {currentTrack.article && (
              <button
                onClick={() => onSelectArticle?.(currentTrack.article!)}
                className="self-start inline-flex items-center gap-1 text-[11px] text-pink-300 hover:text-pink-200 transition-colors"
              >
                <span>阅读当前报道全文</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1 relative">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Bottom Action Controls: Prev, Play, Next, Speed, Mute */}
          <div className="flex items-center justify-between pt-1 relative z-10">
            {/* Left Controls: Restart + Speed */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRestart}
                title="从头开始播报"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/70 hover:text-white transition-all border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleSpeedChange}
                title="调节语速"
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-[11px] font-mono font-medium text-white/80 hover:text-white transition-all border border-white/10 flex items-center gap-1"
              >
                <Gauge className="w-3 h-3 text-pink-400" />
                <span>{playbackSpeed}x</span>
              </button>
            </div>

            {/* Center Track Navigation Controls: Prev | Play/Pause | Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTrack}
                disabled={currentTrackIndex === 0}
                title="上一条新闻"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Big Play / Pause Button - Starts INSTANTLY! */}
              <button
                onClick={handleTogglePlay}
                className={`p-3.5 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${
                  isPlaying
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/30"
                    : "bg-white text-black hover:bg-white/90 shadow-white/20"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                disabled={currentTrackIndex >= playlistTracks.length - 1}
                title="下一条新闻"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Right Controls: Voice Style Picker + Mute */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsVoicePickerOpen((prev) => !prev)}
                title="声线风格"
                className={`p-2 rounded-xl transition-all border ${
                  isVoicePickerOpen
                    ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleToggleMute}
                title={isMuted ? "取消静音" : "静音"}
                className={`p-2 rounded-xl transition-all border ${
                  isMuted
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10"
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
