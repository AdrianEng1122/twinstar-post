"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Activity,
  Calculator,
  Calendar,
  Sparkles,
  ShieldCheck,
  Coins,
  ChevronRight,
  Info,
} from "lucide-react";

export const MalaysiaMarketPulse: React.FC = () => {
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcCurrency, setCalcCurrency] = useState<"SGD" | "USD" | "CNY">("SGD");
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);

  // Exchange rate definitions (Base MYR)
  const rates = {
    SGD: 3.251,
    USD: 4.205,
    CNY: 0.5895,
    GBP: 5.562,
  };

  const convertedResult = (calcAmount * rates[calcCurrency]).toFixed(2);

  return (
    <section className="w-full bg-[#0D0D11] border-y border-white/10 text-white py-12 px-4 sm:px-6 lg:px-12 select-none relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-sc font-bold text-lg sm:text-xl text-white">
                  大马财经与民生晴雨表
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#ffd8a8]">
                  MALAYSIA MARKET PULSE
                </span>
              </div>
              <p className="text-xs font-serif-sc text-white/50">
                国家银行（BNM）与财政部每周官方数据同步 · 汇率与燃油消费核心参考
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsConverterOpen(!isConverterOpen)}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-serif-sc text-[#ffd8a8] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isConverterOpen ? "收起换算器" : "马币换算器"}</span>
            </button>

            <span className="text-[11px] font-mono text-white/40 hidden md:inline">
              周度更新：本周四至下周三
            </span>
          </div>
        </div>

        {/* Currency Quick-Converter Drawer/Dropdown (if toggled) */}
        {isConverterOpen && (
          <div className="p-4 rounded-xl bg-black/50 border border-white/15 flex flex-wrap items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-2 text-xs font-serif-sc text-white/80">
              <Sparkles className="w-4 h-4 text-[#ffd8a8]" />
              <span>即时换算马币（MYR）：</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                className="w-28 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#ffd8a8]"
                placeholder="金额"
              />

              <div className="flex items-center p-0.5 rounded bg-white/10 border border-white/15 text-xs font-mono">
                {(["SGD", "USD", "CNY"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCalcCurrency(curr)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      calcCurrency === curr
                        ? "bg-white text-black font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              <div className="text-sm font-mono flex items-center gap-2">
                <span className="text-white/50">≈</span>
                <span className="text-lg font-bold text-emerald-400">
                  RM {convertedResult}
                </span>
                <span className="text-xs text-white/40">
                  (按 1 {calcCurrency} = {rates[calcCurrency]} MYR)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: USD / MYR Forex */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                  $
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-white block">
                    USD / MYR
                  </span>
                  <span className="text-[10px] text-white/50 block">美元兑马币</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                -0.0120
              </span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                4.2050
              </div>
              <p className="text-[11px] font-serif-sc text-white/50 mt-1">
                创 18 个月新高 · 马币持续坚挺
              </p>
            </div>
          </div>

          {/* Card 2: SGD / MYR Forex */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs font-mono">
                  S$
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-white block">
                    SGD / MYR
                  </span>
                  <span className="text-[10px] text-white/50 block">新币兑马币</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                -0.0080
              </span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">
                3.2510
              </div>
              <p className="text-[11px] font-serif-sc text-white/50 mt-1">
                新柔跨境消费换汇持续利好
              </p>
            </div>
          </div>

          {/* Card 3: Weekly Fuel Prices (APM) */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Fuel className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-serif-sc text-xs font-bold text-white block">
                    每周官方燃油顶价
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono">
                    APM WEEKLY FUEL
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono">
                全国顶价
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70">RON95:</span>
                <span className="font-bold text-amber-400">RM 2.05 / L</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70">RON97:</span>
                <span className="font-bold text-white">RM 3.19 / L</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/70">Euro5柴油(西马):</span>
                <span className="font-bold text-white">RM 2.95 / L</span>
              </div>
            </div>
          </div>

          {/* Card 4: FBM KLCI & BNM OPR */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                  KL
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-white block">
                    FBM KLCI 综指
                  </span>
                  <span className="text-[10px] text-white/50 block">马股吉隆坡基准</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +0.51%
              </span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono text-white tracking-tight flex items-baseline gap-2">
                <span>1,672.88</span>
                <span className="text-xs font-mono text-emerald-400 font-normal">
                  +8.42
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mt-1">
                <span>央行 OPR: 3.00%</span>
                <span className="text-emerald-400">外资净买入</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
