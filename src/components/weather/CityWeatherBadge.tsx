"use client";

import React, { useState } from "react";
import {
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  ChevronDown,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export type WeatherCity = "kl" | "skudai" | "kotabharu";

interface CityWeatherData {
  id: WeatherCity;
  name: string;
  state: string;
  temp: number;
  condition: string;
  icon: "sun" | "rain" | "thunder";
  humidity: number;
  windSpeed: string;
  aqi: number;
  aqiStatus: string;
  aqiColor: string;
  forecast: { day: string; temp: string; condition: string }[];
}

export const CITIES_WEATHER: Record<WeatherCity, CityWeatherData> = {
  kl: {
    id: "kl",
    name: "吉隆坡",
    state: "联邦直辖区",
    temp: 31,
    condition: "午后雷阵雨",
    icon: "thunder",
    humidity: 78,
    windSpeed: "东南风 12 km/h",
    aqi: 42,
    aqiStatus: "优良",
    aqiColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    forecast: [
      { day: "周六", temp: "32° / 24°", condition: "多云转晴" },
      { day: "周日", temp: "30° / 24°", condition: "傍晚短雨" },
      { day: "周一", temp: "31° / 25°", condition: "局部阵雨" },
    ],
  },
  skudai: {
    id: "skudai",
    name: "柔佛·士姑来",
    state: "依斯干达公主城",
    temp: 30,
    condition: "多云微风有阵雨",
    icon: "rain",
    humidity: 82,
    windSpeed: "南风 14 km/h",
    aqi: 36,
    aqiStatus: "优",
    aqiColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    forecast: [
      { day: "周六", temp: "31° / 25°", condition: "多云间晴" },
      { day: "周日", temp: "30° / 24°", condition: "午后小雨" },
      { day: "周一", temp: "31° / 24°", condition: "阴天微风" },
    ],
  },
  kotabharu: {
    id: "kotabharu",
    name: "哥打峇鲁",
    state: "吉兰丹东海岸",
    temp: 32,
    condition: "沿海晴朗微风",
    icon: "sun",
    humidity: 68,
    windSpeed: "东北海风 18 km/h",
    aqi: 26,
    aqiStatus: "极佳",
    aqiColor: "text-teal-400 border-teal-500/40 bg-teal-500/10",
    forecast: [
      { day: "周六", temp: "33° / 25°", condition: "艳阳晴朗" },
      { day: "周日", temp: "32° / 25°", condition: "海风微拂" },
      { day: "周一", temp: "32° / 24°", condition: "晴间多云" },
    ],
  },
};

export const CityWeatherBadge: React.FC = () => {
  const [activeCity, setActiveCity] = useState<WeatherCity>("kl");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const current = CITIES_WEATHER[activeCity];

  const renderIcon = (type: "sun" | "rain" | "thunder", className = "w-3.5 h-3.5") => {
    switch (type) {
      case "sun":
        return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
      case "rain":
        return <CloudRain className={`${className} text-blue-400`} />;
      case "thunder":
        return <CloudLightning className={`${className} text-yellow-300`} />;
    }
  };

  return (
    <div className="relative inline-block text-left select-none">
      {/* City Weather Ear Capsule */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-xs font-serif-sc text-white/90 hover:text-white transition-all shadow-sm group"
        title="点击切换大马城市（吉隆坡 / 柔佛士姑来 / 哥打峇鲁）天气与空气指数"
      >
        <MapPin className="w-3 h-3 text-[#ff8080]" />
        <span className="font-bold text-white group-hover:text-[#ffd8a8] transition-colors">
          {current.name}
        </span>

        <span className="text-white/30">|</span>

        <div className="flex items-center gap-1 font-mono">
          {renderIcon(current.icon)}
          <span className="font-bold">{current.temp}°C</span>
          <span className="text-[11px] text-white/60 hidden sm:inline font-serif-sc">
            {current.condition}
          </span>
        </div>

        <span className="text-white/30 hidden sm:inline">|</span>

        {/* AQI Badge */}
        <span
          className={`px-1.5 py-0.2 rounded text-[10px] font-mono border hidden sm:inline-flex items-center gap-0.5 ${current.aqiColor}`}
        >
          <span>API</span>
          <span className="font-bold">{current.aqi}</span>
          <span>{current.aqiStatus}</span>
        </span>

        <ChevronDown
          className={`w-3 h-3 text-white/50 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel: Switch City & 3-Day Forecast */}
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#121216]/95 backdrop-blur-xl border border-white/20 p-4 shadow-2xl z-50 text-white flex flex-col gap-3 font-serif-sc">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-[#ffd8a8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd8a8]" />
                大马报眼气象与空气指数
              </span>
              <span className="text-[10px] font-mono text-white/40">
                大马气象局实时同步
              </span>
            </div>

            {/* City Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs text-center font-bold">
              {(["kl", "skudai", "kotabharu"] as const).map((cityKey) => {
                const item = CITIES_WEATHER[cityKey];
                const isActive = activeCity === cityKey;
                return (
                  <button
                    key={cityKey}
                    onClick={() => {
                      setActiveCity(cityKey);
                    }}
                    className={`py-1.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-white text-black shadow-md"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{item.name.replace("柔佛·", "")}</span>
                  </button>
                );
              })}
            </div>

            {/* Active City Detail Card */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{current.name}</span>
                    <span className="text-[11px] font-mono text-white/40">
                      ({current.state})
                    </span>
                  </h4>
                  <p className="text-xs text-[#ffd8a8]">{current.condition}</p>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {renderIcon(current.icon, "w-6 h-6")}
                  <span className="text-2xl font-black">{current.temp}°C</span>
                </div>
              </div>

              {/* Weather indicators */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono text-white/70">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>湿度 {current.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-400" />
                  <span className="truncate">{current.windSpeed}</span>
                </div>
                <div className="flex items-center justify-end">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${current.aqiColor}`}
                  >
                    AQI {current.aqi} {current.aqiStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div>
              <span className="text-[11px] font-mono text-white/40 block mb-1.5">
                3-DAY OUTLOOK · 未来三日天气展望
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {current.forecast.map((fc, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-white/5 border border-white/10 text-center text-xs"
                  >
                    <span className="text-[10px] font-mono text-white/50 block">
                      {fc.day}
                    </span>
                    <span className="font-bold text-white block my-0.5 font-mono">
                      {fc.temp}
                    </span>
                    <span className="text-[10px] text-white/70 block">
                      {fc.condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
