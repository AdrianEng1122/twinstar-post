"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { AiModel } from "@/lib/models/types";
import { FRONTIER_FALLBACK_MODELS } from "@/lib/models/fallbackData";
import { ScrollHudOverlay } from "./ScrollHudOverlay";
import { useCategory } from "@/lib/context/CategoryContext";
import { Loader2, Sparkles } from "lucide-react";

// Client-side dynamic import of the entire QuantumCanvas (Canvas is INSIDE QuantumCanvas)
const DynamicQuantumCanvas = dynamic(
  () => import("./QuantumCanvas").then((mod) => mod.QuantumCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 font-mono text-xs text-zinc-400">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-electric animate-spin" />
          <Sparkles className="w-4 h-4 text-violet-400 absolute" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-xs font-semibold">
            MOUNTING 3D CRYSTAL AI HEAD & ORBITAL CAROUSEL
          </span>
          <span className="text-[10px] text-zinc-500">
            INITIALIZING REFRACTIVE SHADERS & SYNAPTIC NETWORK...
          </span>
        </div>
      </div>
    ),
  }
);

interface QuantumSceneContainerProps {
  filterCategory?: string;
  onSelectModel?: (model: AiModel) => void;
}

export function QuantumSceneContainer({
  filterCategory,
  onSelectModel,
}: QuantumSceneContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeCategory } = useCategory();
  const currentCategory = filterCategory !== undefined ? filterCategory : activeCategory;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [allModels, setAllModels] = useState<AiModel[]>(FRONTIER_FALLBACK_MODELS);
  const [selectedModel, setSelectedModel] = useState<AiModel | null>(FRONTIER_FALLBACK_MODELS[0]);

  // Fetch live models from /api/models
  useEffect(() => {
    async function loadModels() {
      try {
        const res = await fetch("/api/models?limit=12");
        if (res.ok) {
          const data = await res.json();
          if (data && data.models && data.models.length > 0) {
            setAllModels(data.models);
            setSelectedModel(data.models[0]);
          }
        }
      } catch (err) {
        console.warn("[QuantumSceneContainer] Using fallback model data:", err);
      }
    }
    loadModels();
  }, []);

  // Filter models based on category
  const filteredModels = useMemo(() => {
    if (currentCategory === "All") return allModels;
    if (currentCategory === "Reasoning") {
      return allModels.filter(
        (m) =>
          m.modality === "Reasoning" ||
          m.name.includes("R1") ||
          m.name.includes("R2") ||
          m.name.includes("o1") ||
          m.name.includes("GPT-6") ||
          m.name.includes("Opus")
      );
    }
    if (currentCategory === "Daily Chat") {
      return allModels.filter((m) => m.modality === "LLM");
    }
    if (currentCategory === "Open Source") {
      return allModels.filter((m) => m.openWeights === true);
    }
    return allModels;
  }, [allModels, currentCategory]);

  // Reset selected model if not in list
  useEffect(() => {
    if (
      filteredModels.length > 0 &&
      (!selectedModel || !filteredModels.find((m) => m.id === selectedModel.id))
    ) {
      setSelectedModel(filteredModels[0]);
    }
  }, [filteredModels, selectedModel]);

  // Track scroll progress
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSelectModel = (model: AiModel) => {
    setSelectedModel(model);
    if (onSelectModel) {
      onSelectModel(model);
    }
  };

  return (
    <div
      ref={containerRef}
      id="quantum-experience-stage"
      className="relative w-full h-[220vh]"
    >
      {/* Sticky 3D Viewport pinned to full screen */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#030306]">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-radial-dark pointer-events-none" />

        {/* 3D WebGL Canvas Layer */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <DynamicQuantumCanvas
            scrollProgress={scrollProgress}
            models={filteredModels}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
          />
        </div>

        {/* Full HUD Overlay matching reference image */}
        <ScrollHudOverlay
          scrollProgress={scrollProgress}
          models={filteredModels}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
        />
      </div>
    </div>
  );
}
