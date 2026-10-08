"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Cpu, Loader2 } from "lucide-react";

// Client-side dynamic import of the 3D Canvas
const DynamicNeuralCanvas = dynamic(
  () => import("./NeuralCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 font-mono text-xs text-cyber-subtext">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-electric animate-spin" />
          <Cpu className="w-4 h-4 text-neural-light absolute" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white tracking-widest text-xs font-semibold">
            MOUNTING 3D CANVAS // R3F v8
          </span>
          <span className="text-[10px] text-cyber-dim">
            INITIALIZING SHADERS & WEBGL ACCELERATION...
          </span>
        </div>
      </div>
    ),
  }
);

interface SceneContainerProps {
  className?: string;
}

export function SceneContainer({ className = "" }: SceneContainerProps) {
  return (
    <div
      id="canvas-mount-root"
      className={`relative w-full h-[520px] lg:h-[640px] rounded-3xl overflow-hidden glass-panel border border-white/[0.08] shadow-hud-card transition-all ${className}`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 bg-radial-dark pointer-events-none" />

      {/* Cyber Grid Texture */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-40 pointer-events-none" />

      {/* Top HUD Frame Details */}
      <div className="absolute top-4 left-5 right-5 z-10 flex items-center justify-between font-mono text-[10px] text-cyber-dim pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-electric animate-ping" />
          <span className="text-white font-medium">VIEWPORT // R3F_CORE_01</span>
          <span className="hidden sm:inline-block text-cyber-dim">
            [ FOV 45° | THREE.0.169 ]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block text-emerald">● WEBGL 2.0 ACTIVE</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] text-cyber-subtext">
            DRAG TO ROTATE
          </span>
        </div>
      </div>

      {/* Interactive 3D Canvas Mount */}
      <div className="w-full h-full">
        <DynamicNeuralCanvas />
      </div>

      {/* Bottom HUD Metadata Bar */}
      <div className="absolute bottom-3 left-5 right-5 z-10 flex items-center justify-between font-mono text-[9px] text-cyber-dim pointer-events-none">
        <div className="flex items-center gap-3">
          <span>CANVAS_ID: #CANVAS-MOUNT-ROOT</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-neural-light">BUFFER: DYNAMIC</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-electric/80">
          <span>RENDER_TARGET: PASS_THROUGH</span>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />
    </div>
  );
}
