"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AiHead3DProps {
  scrollProgress: number;
  rotationY?: number;
  onManualRotate?: (rotY: number) => void;
}

export function AiHead3D({ scrollProgress, rotationY: controlledRotY }: AiHead3DProps) {
  const headGroupRef = useRef<THREE.Group>(null);
  const eyeVisorRef = useRef<THREE.Mesh>(null);
  const neuralCoreRef = useRef<THREE.Group>(null);
  const haloRingRef = useRef<THREE.Mesh>(null);

  // Drag interaction state for 360-degree manual spinning
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragRotationY = useRef(0);
  const velocityY = useRef(0.005); // Ambient spin velocity

  // Internal brain neural particles
  const brainParticleData = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const violet = new THREE.Color("#8B5CF6");
    const cyan = new THREE.Color("#00F0FF");

    for (let i = 0; i < count; i++) {
      const r = 0.65 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 0.35 + r * Math.sin(phi) * Math.sin(theta) * 0.9;
      positions[i * 3 + 2] = -0.1 + r * Math.cos(phi);

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
    if (!headGroupRef.current) return;

    const time = state.clock.elapsedTime;

    // 1. Continuous 360-Degree Rotation & Inertia
    if (!isDragging) {
      // Natural ambient rotation + scroll-driven spin
      const scrollSpinBoost = scrollProgress * 0.3;
      dragRotationY.current += (velocityY.current + scrollSpinBoost) * delta * 60;
    }

    // Apply rotation (controlled or drag-based)
    const effectiveRotY = controlledRotY !== undefined ? controlledRotY : dragRotationY.current;
    headGroupRef.current.rotation.y = effectiveRotY;

    // 2. Subtle Lifelike Breathing & Head Pitch/Tilt
    const pointer = state.pointer;
    const targetPitch = pointer.y * -0.15 + Math.sin(time * 1.5) * 0.03;
    const targetRoll = pointer.x * -0.08;

    headGroupRef.current.rotation.x = THREE.MathUtils.damp(
      headGroupRef.current.rotation.x,
      targetPitch,
      5,
      delta
    );
    headGroupRef.current.rotation.z = THREE.MathUtils.damp(
      headGroupRef.current.rotation.z,
      targetRoll,
      5,
      delta
    );

    // Floating bobbing
    headGroupRef.current.position.y = Math.sin(time * 1.8) * 0.06;

    // 3. Eye Visor Neural Scanline Glow
    if (eyeVisorRef.current) {
      const pulse = 1.2 + Math.sin(time * 4) * 0.4;
      const mat = eyeVisorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = pulse;
    }

    // 4. Brain Neural Core Pulse
    if (neuralCoreRef.current) {
      neuralCoreRef.current.rotation.y -= delta * 0.3;
    }

    // 5. Crown Halo Orbit
    if (haloRingRef.current) {
      haloRingRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group
      ref={headGroupRef}
      position={[0, 0, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        setIsDragging(true);
        dragStartX.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (isDragging) {
          e.stopPropagation();
          const deltaX = (e.clientX - dragStartX.current) * 0.012;
          dragRotationY.current += deltaX;
          velocityY.current = deltaX * 0.5;
          dragStartX.current = e.clientX;
        }
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      {/* 1. Main Cranium / Forehead Plate (Obsidian Chrome Finish) */}
      <mesh position={[0, 0.4, -0.05]} scale={[1.0, 1.2, 1.1]}>
        <sphereGeometry args={[1.0, 36, 36]} />
        <meshPhysicalMaterial
          color="#07070e"
          emissive="#100b1a"
          emissiveIntensity={0.2}
          roughness={0.12}
          metalness={0.92}
          transmission={0.35}
          thickness={0.7}
          ior={1.48}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* 2. Sculpted Cyber Face Plate & Cheek Contours */}
      <mesh position={[0, -0.15, 0.42]} rotation={[Math.PI / 16, 0, 0]} scale={[0.82, 0.85, 0.75]}>
        <cylinderGeometry args={[0.75, 0.45, 1.1, 32]} />
        <meshPhysicalMaterial
          color="#0a0a14"
          roughness={0.15}
          metalness={0.88}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* 3. Sleek Sculpted Chin / Jawline Plate */}
      <mesh position={[0, -0.72, 0.45]} scale={[0.42, 0.32, 0.4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#121222"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* 4. Wraparound Ocular Visor (Cyber Eyes) */}
      <mesh
        ref={eyeVisorRef}
        position={[0, 0.15, 0.65]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.88, 0.38, 0.22]}
      >
        <torusGeometry args={[0.8, 0.22, 16, 64, Math.PI * 0.85]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Scanning Laser Pupil Dot */}
      <mesh position={[0, 0.15, 0.95]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* 5. Cyber Ear Sensor Pods (Left & Right) */}
      <group position={[-1.02, 0.12, -0.05]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.16, 32]} />
        <meshStandardMaterial color="#1a1a2c" metalness={0.9} roughness={0.2} />
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[0.08, 0.22, 32]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>
      </group>

      <group position={[1.02, 0.12, -0.05]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.16, 32]} />
        <meshStandardMaterial color="#1a1a2c" metalness={0.9} roughness={0.2} />
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[0.08, 0.22, 32]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      </group>

      {/* 6. Articulated Mechanical Neck Rings */}
      <group position={[0, -0.92, 0.1]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.08, 16, 32]} />
          <meshStandardMaterial color="#161626" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.08, 16, 32]} />
          <meshStandardMaterial color="#0d0d18" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.09, 16, 32]} />
          <meshStandardMaterial color="#080812" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Internal Brain Synapse Particle Core */}
      <group ref={neuralCoreRef}>
        <points geometry={brainParticleData}>
          <pointsMaterial
            size={0.035}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* 8. Orbiting Crown Halo Ring */}
      <mesh
        ref={haloRingRef}
        position={[0, 1.25, -0.1]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <torusGeometry args={[0.85, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.65} />
      </mesh>

      {/* 9. Dynamic Studio Rim Spotlights */}
      <pointLight position={[0, 1.5, 1.2]} color="#00F0FF" intensity={12} distance={5} />
      <pointLight position={[-2, 0.5, -1]} color="#8B5CF6" intensity={15} distance={6} />
      <pointLight position={[2, 0.5, -1]} color="#00F0FF" intensity={15} distance={6} />
    </group>
  );
}
