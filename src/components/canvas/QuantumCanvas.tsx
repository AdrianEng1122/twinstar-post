"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { QuantumScene } from "./QuantumScene";
import { AiModel } from "@/lib/models/types";

interface QuantumCanvasProps {
  scrollProgress: number;
  models: AiModel[];
  selectedModel: AiModel | null;
  onSelectModel: (model: AiModel) => void;
}

export function QuantumCanvas({
  scrollProgress,
  models,
  selectedModel,
  onSelectModel,
}: QuantumCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
    >
      <QuantumScene
        scrollProgress={scrollProgress}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={onSelectModel}
      />
    </Canvas>
  );
}

export default QuantumCanvas;
