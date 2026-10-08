"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface LiveTickerProps {
  headlines?: string[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({
  headlines = [
    "【星洲实时】内阁通过2027年经济转型强化框架，重点扶持高新技术产业与数字基建",
    "【中国报快讯】马币持续走强，兑美元汇率创近期新高，出口与零售商密切关注汇价波动",
    "【星洲深度】全国数码学校计划全面铺开，AI交互教材预计年底入驻中小学实验课堂",
    "【中国报头条】吉隆坡轻轨与捷运无缝换乘网络年内扩容，市民通勤时间将进一步缩短",
  ],
}) => {
  return (
    <div className="w-full border-b border-ink/20 bg-paper-200/60 overflow-hidden py-1.5">
      <div className="mx-auto max-w-7xl px-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 bg-press-red text-paper px-2 py-0.5 text-xs font-serif-sc font-bold uppercase tracking-wider">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>快讯轮播</span>
        </div>

        <div className="relative overflow-hidden whitespace-nowrap text-xs text-ink">
          <div className="inline-flex gap-8 animate-[marquee_35s_linear_infinite]">
            {headlines.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 font-serif-sc">
                <span>{item}</span>
                <span className="text-ink-light">///</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
