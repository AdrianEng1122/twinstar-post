"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AiModel } from "@/lib/models/types";
import { getFriendlyModelInfo } from "@/lib/models/friendlyHelpers";
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Cpu,
} from "lucide-react";

interface HolographicModelCardProps {
  model: AiModel;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
  scale: number;
  opacity: number;
  onSelect: (model: AiModel) => void;
}

export function HolographicModelCard({
  model,
  index,
  position,
  rotation,
  isSelected,
  scale,
  opacity,
  onSelect,
}: HolographicModelCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const borderMeshRef = useRef<THREE.Mesh>(null);
  const glassMeshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const info = getFriendlyModelInfo(model);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth hover micro-elevation
    const hoverZOffset = isHovered && isSelected ? 0.15 : 0;
    const targetScale = scale * (isHovered && isSelected ? 1.02 : 1.0);

    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      position[2] + hoverZOffset,
      8,
      delta
    );

    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.15
    );

    // Border opacity
    if (borderMeshRef.current) {
      const mat = borderMeshRef.current.material as THREE.MeshBasicMaterial;
      const targetBorderOpacity = isSelected ? (isHovered ? 0.9 : 0.6) : 0.15 * opacity;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetBorderOpacity, 6, delta);
    }

    if (glassMeshRef.current) {
      const glassMat = glassMeshRef.current.material as THREE.MeshPhysicalMaterial;
      glassMat.opacity = THREE.MathUtils.damp(glassMat.opacity, isSelected ? 0.9 : 0.4 * opacity, 6, delta);
    }
  });

  if (opacity <= 0.02 || scale <= 0.02) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        if (isSelected) {
          e.stopPropagation();
          setIsHovered(true);
        }
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(model);
      }}
    >
      {/* 1. Frosted Smoked Glass Backing Mesh */}
      <mesh ref={glassMeshRef} position={[0, 0, -0.015]}>
        <planeGeometry args={[2.7, 3.6]} />
        <meshPhysicalMaterial
          color="#06060c"
          roughness={0.12}
          metalness={0.85}
          transmission={0.6}
          thickness={0.25}
          ior={1.45}
          transparent
          opacity={0.88 * opacity}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 2. Precision Neon Border Frame */}
      <mesh ref={borderMeshRef} position={[0, 0, 0]}>
        <planeGeometry args={[2.74, 3.64]} />
        <meshBasicMaterial
          color={isSelected ? "#00F0FF" : "#222238"}
          wireframe
          transparent
          opacity={isSelected ? 0.6 : 0.15 * opacity}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 3. Apple/Linear-Style High Definition Typography Overlay */}
      <Html
        transform
        distanceFactor={4.5}
        position={[0, 0, 0.02]}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          opacity: opacity,
          transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: isSelected ? "auto" : "none",
        }}
        className="select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`w-[340px] rounded-3xl p-6 flex flex-col gap-4 font-sans transition-all duration-300 cursor-pointer backdrop-blur-2xl relative overflow-hidden ${
            isSelected
              ? "bg-[#090912]/92 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] ring-1 ring-cyan-electric/30"
              : "bg-[#08080f]/75 border border-white/5 opacity-50"
          }`}
        >
          {/* Subtle Top Glass Reflection */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Top Bar: Lab Tag & Access Badge */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <span className="text-xs font-semibold tracking-wide px-3 py-1 rounded-full bg-white/[0.08] text-zinc-200 border border-white/10">
              {model.organization}
            </span>

            <span
              className={`text-xs font-medium px-3 py-1 rounded-full border flex items-center gap-1.5 ${info.accessBadge.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{info.accessBadge.label}</span>
            </span>
          </div>

          {/* Model Name & Highlight Tag */}
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {model.name}
            </h2>

            {/* "Best For" Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="truncate">Best for: {info.bestFor}</span>
            </div>
          </div>

          {/* Human-Readable Summary */}
          <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 relative z-10">
            {info.friendlySummary}
          </p>

          {/* Simplified Performance Progress Indicators */}
          <div className="space-y-2 py-1 relative z-10">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Capability Highlights
            </div>
            <div className="space-y-2">
              {info.performanceRatings.map((rating, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200 font-medium">{rating.label}</span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      {rating.grade} ({rating.score}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-gradient-to-r from-violet-500 to-cyan-400"
                          : idx === 1
                          ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${rating.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs relative z-10">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>Model Scale</span>
              </div>
              <div className="font-semibold text-white mt-0.5 truncate">
                {model.parameters}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-violet-400" />
                <span>Memory Context</span>
              </div>
              <div className="font-semibold text-cyan-300 mt-0.5 truncate">
                {model.contextWindow}
              </div>
            </div>
          </div>

          {/* Primary Action Button: "Open & Try Model ↗" */}
          <div className="pt-2 relative z-10">
            <a
              href={model.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-3 px-4 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-lg group"
            >
              <span>Open & Try Model</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </Html>
    </group>
  );
}
