"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface NeuralSiliconDieProps {
  scrollProgress: number; // 0 to 1
}

export function NeuralSiliconDie({ scrollProgress }: NeuralSiliconDieProps) {
  const dieGroupRef = useRef<THREE.Group>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // During scroll:
  // Phase 1 (0–0.25): Die is hero centerpiece, floats gently with studio glints
  // Phase 2 (0.25+): Scales down and settles into an ambient glowing pedestal behind the model card
  const isPhase1 = scrollProgress < 0.25;
  const targetScale = isPhase1 ? 1.0 : Math.max(0.65, 1.0 - (scrollProgress - 0.25) * 0.7);
  const targetZ = isPhase1 ? 0 : -1.8;
  const targetY = isPhase1 ? 0 : -0.2;

  useFrame((state, delta) => {
    if (!dieGroupRef.current) return;

    // Soft ambient floating motion
    const time = state.clock.elapsedTime;
    const floatY = Math.sin(time * 1.2) * 0.06;
    const floatRotX = Math.sin(time * 0.8) * 0.05;
    const floatRotY = Math.cos(time * 0.6) * 0.08;

    // Smoothly apply scroll target scale and depth
    dieGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
    dieGroupRef.current.position.y = THREE.MathUtils.damp(
      dieGroupRef.current.position.y,
      targetY + floatY,
      6,
      delta
    );
    dieGroupRef.current.position.z = THREE.MathUtils.damp(
      dieGroupRef.current.position.z,
      targetZ,
      6,
      delta
    );

    // Subtle tilt that responds softly to time
    dieGroupRef.current.rotation.x = THREE.MathUtils.damp(
      dieGroupRef.current.rotation.x,
      floatRotX + 0.1,
      4,
      delta
    );
    dieGroupRef.current.rotation.y = THREE.MathUtils.damp(
      dieGroupRef.current.rotation.y,
      floatRotY,
      4,
      delta
    );

    // Internal core glow pulsation
    if (coreGlowRef.current) {
      const pulse = 1.0 + Math.sin(time * 2.5) * 0.08;
      coreGlowRef.current.scale.set(pulse, pulse, 1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={dieGroupRef} position={[0, 0, 0]}>
      {/* 1. Main Beveled Obsidian / Smoked Glass Slab (Apple Silicon Inspired) */}
      <RoundedBox
        args={[2.4, 2.4, 0.22]}
        radius={0.08}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#08080C"
          emissive="#0d0d16"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.88}
          transmission={0.5}
          thickness={0.6}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* 2. Chamfered Metallic Edge Perimeter Trim (Polished Titanium Accent) */}
      <RoundedBox args={[2.42, 2.42, 0.02]} radius={0.07} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.95}
          roughness={0.2}
          wireframe
        />
      </RoundedBox>

      {/* 3. Central Silicon Heat Spreader / Neural Matrix Die */}
      <mesh position={[0, 0, 0.115]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial
          color="#090912"
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>

      {/* 4. Etched Micro-Circuit Traces & Interconnects */}
      <group position={[0, 0, 0.118]}>
        {/* Subtle inner framing square */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.35, 1.35)]} />
          <lineBasicMaterial color="#00F0FF" transparent opacity={0.35} />
        </lineSegments>

        {/* Diagonal corner circuit lines */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.9, 0.9)]} />
          <lineBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
        </lineSegments>

        {/* Central Glowing Silicon Core Badge */}
        <mesh ref={coreGlowRef} position={[0, 0, 0.002]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Precision Laser Core Dot */}
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>

        {/* Rotating Orbital Core Ring */}
        <mesh ref={ringRef} position={[0, 0, 0.004]}>
          <ringGeometry args={[0.22, 0.235, 32]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* 5. Studio Edge Rim Light Emitters */}
      <pointLight position={[0, 0, 0.4]} color="#00F0FF" intensity={6} distance={3} />
      <pointLight position={[0, 1.3, 0.2]} color="#8B5CF6" intensity={8} distance={2.5} />
      <pointLight position={[0, -1.3, 0.2]} color="#10B981" intensity={5} distance={2.5} />
    </group>
  );
}
