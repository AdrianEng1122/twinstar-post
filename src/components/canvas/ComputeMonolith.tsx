"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ComputeMonolithProps {
  scrollProgress: number; // 0 to 1
}

export function ComputeMonolith({ scrollProgress }: ComputeMonolithProps) {
  const monolithRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const particlePointsRef = useRef<THREE.Points>(null);

  // Phase transition calculation:
  // Phase 1 (0–0.25): Fully visible, scale 1.0, pulsing
  // Phase 2 (0.25–0.65): Expands and fades out/recedes as orbital cards disperse
  // Phase 3 (0.65–1.0): Minimized or background anchor
  const visibilityScale = useMemo(() => {
    if (scrollProgress <= 0.22) return 1;
    if (scrollProgress <= 0.55) {
      return Math.max(0, 1 - (scrollProgress - 0.22) / 0.33);
    }
    return 0;
  }, [scrollProgress]);

  // Generate internal quantum orb particles with safe BufferGeometry
  const particleGeometry = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const violet = new THREE.Color("#8B5CF6");
    const cyan = new THREE.Color("#00F0FF");

    for (let i = 0; i < count; i++) {
      const r = 0.55 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.5;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixed = violet.clone().lerp(cyan, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!monolithRef.current) return;

    // Ambient soft rotation
    const rotationSpeed = 0.35 + scrollProgress * 0.4;
    monolithRef.current.rotation.y += delta * rotationSpeed;

    // Subtle bobbing
    monolithRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;

    // Internal pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.06;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Cage counter-rotation
    if (cageRef.current) {
      cageRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      cageRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.8) * 0.1;
    }

    // Particles swirl
    if (particlePointsRef.current) {
      particlePointsRef.current.rotation.y -= delta * 0.5;
    }

    // Smoothly apply scroll scale
    const targetScale = visibilityScale;
    monolithRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  if (visibilityScale <= 0.01) return null;

  return (
    <group ref={monolithRef} position={[0, 0, 0]}>
      {/* 1. Outer Smoked Glass / Obsidian Monolith Shell */}
      <mesh>
        <boxGeometry args={[1.5, 2.8, 0.45]} />
        <meshPhysicalMaterial
          color="#06060c"
          emissive="#120b22"
          emissiveIntensity={0.25}
          roughness={0.12}
          metalness={0.88}
          transmission={0.65}
          thickness={0.8}
          ior={1.48}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Cyber Neon Border Cage / Edge Highlights */}
      <mesh ref={cageRef}>
        <boxGeometry args={[1.54, 2.84, 0.49]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 3. Internal Pulsing Quantum Core Orb */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 4. Internal Swirling Quantum Particles */}
      <points ref={particlePointsRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Monolith Top & Bottom Neon Emitter Rings */}
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 16, 64]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>
    </group>
  );
}
