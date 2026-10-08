import React from "react";
import { Newspaper, Flame, Globe2, Radio } from "lucide-react";
import { CityWeatherBadge } from "@/components/weather/CityWeatherBadge";

interface MastheadProps {
  editionDate?: string;
  issueNo?: string;
}

export const Masthead: React.FC<MastheadProps> = ({
  editionDate = "2026年9月24日 星期四",
  issueNo = "第 28,642 号",
}) => {
  return (
    <header className="w-full border-b border-ink/20 bg-paper pt-4">
      {/* Top Utility Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between border-b border-ink/15 pb-2 text-xs text-ink-muted">
          <div className="flex items-center space-x-3">
            <span className="font-serif-sc font-medium tracking-wider">{editionDate}</span>
            <span className="hidden md:inline-block">·</span>
            <span className="hidden md:inline-block">丙午年 八月十四</span>
            <span className="hidden sm:inline-block">·</span>
            <CityWeatherBadge />
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1 font-semibold text-press-red">
              <Radio className="h-3 w-3 animate-pulse" />
              实时热榜聚合
            </span>
            <span>·</span>
            <span className="font-serif-sc tracking-wide">{issueNo}</span>
            <span>·</span>
            <span className="bg-ink/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink">
              3D Interactive
            </span>
          </div>
        </div>

        {/* Main Masthead Banner */}
        <div className="py-6 text-center">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex flex-col text-left text-xs text-ink-muted max-w-[140px]">
              <span className="font-bold text-ink">星洲日报 供稿</span>
              <span className="text-[11px] leading-tight mt-1">
                马来西亚第一大华文报章，深耕客观独立新闻报道
              </span>
            </div>

            <div className="flex-1 text-center">
              <p className="font-serif-sc text-xs tracking-[0.35em] text-ink-muted uppercase">
                TWIN STAR POST · Malaysia Chinese Press Chronicle
              </p>
              <h1 className="mt-1 font-serif-sc text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-ink">
                双星时报
              </h1>
              <div className="mt-1 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-ink/40" />
                <span className="font-serif-sc text-sm font-semibold tracking-chineseWide text-press-red">
                  星洲日报 × 中国报 · 联合数字全景特刊
                </span>
                <div className="h-px w-12 bg-ink/40" />
              </div>
            </div>

            <div className="hidden md:flex flex-col text-right text-xs text-ink-muted max-w-[140px]">
              <span className="font-bold text-ink">中国报 供稿</span>
              <span className="text-[11px] leading-tight mt-1">
                今日视点，最新焦点，全方位剖析社会民生热点
              </span>
            </div>
          </div>
        </div>

        {/* Thick & Thin Editorial Divider */}
        <div className="newsprint-border-thick-thin py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-serif-sc">
            <div className="flex items-center space-x-6">
              <span className="cursor-pointer font-bold text-ink hover:text-press-red transition-colors">
                头条聚焦
              </span>
              <span className="cursor-pointer text-ink-muted hover:text-ink transition-colors">
                全国动态
              </span>
              <span className="cursor-pointer text-ink-muted hover:text-ink transition-colors">
                国际风云
              </span>
              <span className="cursor-pointer text-ink-muted hover:text-ink transition-colors">
                财经商业
              </span>
              <span className="cursor-pointer text-ink-muted hover:text-ink transition-colors">
                科技前沿
              </span>
              <span className="cursor-pointer text-ink-muted hover:text-ink transition-colors">
                社论观点
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              <Flame className="h-3.5 w-3.5 text-press-red" />
              <span>今日热词:</span>
              <span className="underline decoration-ink/30 underline-offset-2">预算案</span>
              <span>·</span>
              <span className="underline decoration-ink/30 underline-offset-2">林吉特汇率</span>
              <span>·</span>
              <span className="underline decoration-ink/30 underline-offset-2">AI 算力中心</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
