"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AiModel } from "@/lib/models/types";
import { Award } from "lucide-react";

interface BenchmarkProjector3DProps {
  model: AiModel;
  visible: boolean;
  phaseProgress: number; // 0 to 1 within Phase 3
  position?: [number, number, number];
}

export function BenchmarkProjector3D({
  model,
  visible,
  phaseProgress,
  position = [2.2, -0.2, 0.4],
}: BenchmarkProjector3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRingRef = useRef<THREE.Mesh>(null);

  // Take top benchmarks to display in 3D
  const benchmarks = model.benchmarks?.slice(0, 3) || [
    { name: "MMLU", score: 88.5 },
    { name: "HumanEval", score: 82.6 },
    { name: "MATH", score: 79.8 },
  ];

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth entry fade/scale
    const targetScale = visible ? 1 : 0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );

    // Soft rotation of base pedestal
    if (baseRingRef.current) {
      baseRingRef.current.rotation.z += delta * 0.4;
    }
  });

  if (!visible && groupRef.current?.scale.x === 0) return null;

  const barSpacing = 0.8;
  const maxHeight = 2.0;

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Holographic Projection Base Ring */}
      <mesh
        ref={baseRingRef}
        position={[0.8, -1.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.2, 1.4, 32]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.35 * Math.max(phaseProgress, 0.1)}
        />
      </mesh>

      {/* Projection Link Beam to Card */}
      <mesh position={[-0.1, -0.9, -0.1]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
      </mesh>

      {/* 2. 3D Vertical Benchmark Bars */}
      {benchmarks.map((bench, idx) => {
        // Normalize score (Elo scores normalized to 100 scale)
        const normalized = bench.score > 100 ? (bench.score / 1400) * 100 : bench.score;
        const targetH = Math.max(0.2, (normalized / 100) * maxHeight * Math.min(phaseProgress * 1.3, 1));
        const barX = idx * barSpacing;

        return (
          <group key={bench.name} position={[barX, -1.2 + targetH / 2, 0]}>
            {/* The 3D Column Mesh */}
            <mesh>
              <cylinderGeometry args={[0.14, 0.16, targetH, 24]} />
              <meshStandardMaterial
                color={idx === 0 ? "#00F0FF" : idx === 1 ? "#8B5CF6" : "#10B981"}
                emissive={idx === 0 ? "#008B99" : idx === 1 ? "#4C1D95" : "#059669"}
                emissiveIntensity={0.6}
                roughness={0.2}
                metalness={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Glowing Cap Ring at Top of Bar */}
            <mesh position={[0, targetH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.05, 0.18, 16]} />
              <meshBasicMaterial
                color={idx === 0 ? "#00F0FF" : idx === 1 ? "#A78BFA" : "#34D399"}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Crisp 3D Data Tag */}
            <Html
              position={[0, targetH / 2 + 0.35, 0]}
              center
              distanceFactor={3.2}
              className="pointer-events-none select-none"
            >
              <div className="flex flex-col items-center bg-obsidian-surface/90 border border-white/10 px-2.5 py-1 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <span className="text-[10px] font-mono text-cyber-dim uppercase tracking-wider whitespace-nowrap">
                  {bench.name}
                </span>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <span
                    className={
                      idx === 0
                        ? "text-cyan-electric"
                        : idx === 1
                        ? "text-neural-light"
                        : "text-emerald"
                    }
                  >
                    {bench.score}
                    {bench.score <= 100 ? "%" : ""}
                  </span>
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. Section Title Holographic Pill */}
      <Html
        position={[0.8, 1.4, 0]}
        center
        distanceFactor={3.2}
        className="pointer-events-none select-none"
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-surface/90 border border-cyan-electric/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Award className="w-3.5 h-3.5 text-cyan-electric animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase whitespace-nowrap">
            FRONTIER TELEMETRY // BENCHMARKS
          </span>
        </div>
      </Html>
    </group>
  );
}
