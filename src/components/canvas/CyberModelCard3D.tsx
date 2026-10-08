"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AiModel } from "@/lib/models/types";

interface CyberModelCard3DProps {
  model: AiModel;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
  opacity: number;
  onSelect: (model: AiModel) => void;
}

const RANK_ICONS = ["🥇", "🥈", "🥉", "④", "⑤", "⑥"];
const RANK_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

function getAccentColors(org: string, name: string) {
  if (org === "OpenAI") return { accent: "#00F0FF", bar: "from-[#00E5FF] to-[#0099FF]", bg: "#050a14" };
  if (org === "Anthropic") return { accent: "#C084FC", bar: "from-[#C084FC] to-[#8B5CF6]", bg: "#090614" };
  if (org === "DeepSeek") return { accent: "#10B981", bar: "from-[#34D399] to-[#10B981]", bg: "#05120e" };
  if (org === "Google") return { accent: "#38BDF8", bar: "from-[#38BDF8] to-[#6366F1]", bg: "#050d14" };
  if (org === "Meta") return { accent: "#F59E0B", bar: "from-[#FCD34D] to-[#F59E0B]", bg: "#130c02" };
  return { accent: "#8B5CF6", bar: "from-[#8B5CF6] to-[#6D28D9]", bg: "#07050f" };
}

function getArchTag(model: AiModel): string {
  const arch = model.architecture.toLowerCase();
  if (arch.includes("moe") || arch.includes("mixture")) return "ARCH // SPARSE-MOE-L7";
  if (arch.includes("multimodal") || model.modality === "Multimodal") return "ARCH // MULTIMODAL-L7";
  if (model.modality === "Reasoning") return "ARCH // REASONING-L7";
  return "ARCH // DENSE-L7";
}

function getCoreCode(model: AiModel): string {
  const name = model.name.toUpperCase().replace(/[\s./-]/g, "_");
  return `${name.slice(0, 12)}_CORE`;
}

export function CyberModelCard3D({
  model,
  position,
  rotation,
  isSelected,
  opacity,
  onSelect,
}: CyberModelCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const borderMeshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { accent, bar, bg } = getAccentColors(model.organization, model.name);
  const archTag = getArchTag(model);
  const coreCode = getCoreCode(model);

  // Pull the top 2 benchmarks for bar display
  const displayBenchmarks = model.benchmarks
    .filter((b) => b.name !== "Frontier Arena Elo")
    .slice(0, 2);

  const rank = model.rank ?? 0;
  const elo = model.eloScore ?? null;
  const rankIcon = rank >= 1 && rank <= 6 ? RANK_ICONS[rank - 1] : `#${rank}`;
  const rankColor = RANK_COLORS[rank] ?? "#8B5CF6";

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const hoverZ = isHovered ? 0.18 : 0;
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      position[2] + hoverZ,
      8,
      delta
    );

    if (borderMeshRef.current) {
      const mat = borderMeshRef.current.material as THREE.MeshBasicMaterial;
      const targetOp = isSelected ? 0.9 : isHovered ? 0.65 : 0.3 * opacity;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOp, 6, delta);
    }
  });

  if (opacity <= 0.02) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(model);
      }}
    >
      {/* Smoked Glass Backing Mesh */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[2.5, 3.6]} />
        <meshPhysicalMaterial
          color="#060913"
          emissive="#04060c"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.85}
          transmission={0.6}
          thickness={0.3}
          ior={1.45}
          transparent
          opacity={0.88 * opacity}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Precision Neon Wireframe Border */}
      <mesh ref={borderMeshRef} position={[0, 0, 0]}>
        <planeGeometry args={[2.53, 3.63]} />
        <meshBasicMaterial
          color={accent}
          wireframe
          transparent
          opacity={0.35 * opacity}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Holographic Card UI */}
      <Html
        transform
        distanceFactor={4.3}
        position={[0, 0, 0.02]}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          opacity: opacity,
          transition: "opacity 0.25s ease-out",
          pointerEvents: "auto",
        }}
        className="select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
          className="w-[295px] h-[420px] rounded-2xl p-5 flex flex-col justify-between font-mono transition-all duration-300 cursor-pointer backdrop-blur-xl relative overflow-hidden"
          style={{
            borderColor: isSelected ? accent : isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
            boxShadow: isSelected ? `0 0 35px ${accent}44` : isHovered ? "0 8px 32px rgba(0,0,0,0.5)" : "none",
            backgroundColor: isSelected ? `${bg}ee` : isHovered ? "rgba(5,8,18,0.85)" : "rgba(4,6,12,0.80)",
            border: "1px solid",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* ── Top Header Row ── */}
          <div className="flex items-center justify-between text-[9px] text-zinc-400 tracking-wider pb-2 border-b border-white/[0.08]">
            <span className="text-zinc-400">PROTOTYPE_DATA_2026</span>
            <span className="text-zinc-500">//</span>
            <span style={{ color: accent }}>NEURAL_TELEMETRY</span>
          </div>

          {/* ── Model Name + Rank Badge ── */}
          <div className="space-y-1 pt-1 relative">
            {/* Rank Badge — top-right corner of name block */}
            {rank > 0 && (
              <div
                className="absolute -top-1 right-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest border"
                style={{
                  color: rankColor,
                  borderColor: `${rankColor}55`,
                  backgroundColor: `${rankColor}18`,
                }}
              >
                <span>{rankIcon}</span>
                <span>RANK #{rank}</span>
                {elo && (
                  <span className="text-[7px] opacity-80 ml-0.5">
                    · Elo {elo}
                  </span>
                )}
              </div>
            )}
            <h2 className="text-[18px] font-bold tracking-tight text-white uppercase font-sans pr-24 leading-tight">
              {model.name}
            </h2>
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-semibold text-zinc-300">{model.organization}</span>
              <span className="tracking-widest text-[8px]" style={{ color: accent }}>
                {archTag}
              </span>
            </div>
          </div>

          {/* ── Core Telemetry Box ── */}
          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1 text-[9px] text-zinc-400 leading-relaxed font-mono">
            <div className="font-bold text-white tracking-widest text-[10px] flex items-center justify-between">
              <span>{coreCode}</span>
              <span className="text-emerald-400 text-[8px] animate-pulse">● ONLINE</span>
            </div>
            <p className="text-[9px] text-zinc-400 line-clamp-2 leading-tight">
              {model.summary}
            </p>
          </div>

          {/* ── Twin Glowing Progress Bars ── */}
          <div className="space-y-3 py-1">
            {displayBenchmarks.map((bench, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[9px] tracking-wider text-zinc-300">
                  <span>{bench.name.toUpperCase()}</span>
                  <span className="font-bold text-white">{bench.score}%</span>
                </div>
                <div className="w-full h-[7px] bg-black/60 rounded-full overflow-hidden border border-white/10 p-[1px]">
                  <div
                    className={`h-full bg-gradient-to-r ${bar} rounded-full`}
                    style={{
                      width: `${bench.score}%`,
                      boxShadow: `0 0 8px ${accent}88`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Card Footer + CTA ── */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            <span className="text-[8px] text-zinc-500 tracking-widest">PROTOTYPE_DATA_2026</span>
            <a
              href={model.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest transition-all duration-200 hover:brightness-125"
              style={{
                color: accent,
                borderColor: `${accent}55`,
                backgroundColor: `${accent}18`,
                border: `1px solid ${accent}44`,
              }}
            >
              TRY MODEL ↗
            </a>
          </div>
        </div>
      </Html>
    </group>
  );
}
