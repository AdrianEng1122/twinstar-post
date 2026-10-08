"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AiModel } from "@/lib/models/types";
import { CrystalAiHead } from "./CrystalAiHead";
import { CyberModelCard3D } from "./CyberModelCard3D";

interface QuantumSceneProps {
  scrollProgress: number;
  models: AiModel[];
  selectedModel: AiModel | null;
  onSelectModel: (model: AiModel) => void;
}

// Reusable: lookAt rotation (Y only) for a point to face outward from center
function getOutwardRotationY(posX: number, posZ: number): number {
  // The card's "front" face (+Z in local space) should point AWAY from origin
  // atan2(x, z) gives the angle from +Z axis clockwise in XZ plane
  return Math.atan2(posX, posZ);
}

// Ambient deep-space dust particles
function StudioDustParticles({ count = 200 }) {
  const geometry = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 30;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 22;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(coords, 3));
    return geom;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.007;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.03} color="#8B5CF6" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export function QuantumScene({
  scrollProgress,
  models,
  selectedModel,
  onSelectModel,
}: QuantumSceneProps) {
  const { camera } = useThree();

  // Active index tracking
  const activeIndex = useMemo(() => {
    if (!selectedModel || models.length === 0) return 0;
    const found = models.findIndex((m) => m.id === selectedModel.id);
    return found >= 0 ? found : 0;
  }, [selectedModel, models]);

  // Drag-to-spin state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const orbitalRotationY = useRef(0);
  const targetRotationY = useRef(0);

  // Elliptical orbit dimensions
  const RADIUS_X = 4.5;
  const RADIUS_Z = 3.8;
  const AUTO_SPIN = 0.003; // radians/frame (at 60fps)

  // Snap carousel to active model on selection
  useEffect(() => {
    const total = Math.min(models.length, 6);
    if (total > 0) {
      // Each card sits at baseAngle = (idx / total) * 2π
      // We want card[activeIndex] to come to front (angle ≈ 0, i.e. posZ = +radius)
      const targetAngle = -(activeIndex / total) * Math.PI * 2;
      targetRotationY.current = targetAngle;
    }
  }, [activeIndex, models.length]);

  // Per-frame animation
  useFrame((state, delta) => {
    if (!isDragging) {
      // Smoothly lerp toward target, then keep auto-spinning
      orbitalRotationY.current = THREE.MathUtils.damp(
        orbitalRotationY.current,
        targetRotationY.current,
        4,
        delta
      );
      targetRotationY.current += AUTO_SPIN * delta * 60;
    }

    // Camera gentle parallax follow
    const ptr = state.pointer;
    camera.position.lerp(
      new THREE.Vector3(ptr.x * 0.4, 0.1 + ptr.y * 0.3, 7.4),
      0.06
    );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  const displayModels = useMemo(() => models.slice(0, 6), [models]);

  return (
    <group
      onPointerDown={(e) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (isDragging) {
          const dx = (e.clientX - dragStartX.current) * 0.009;
          targetRotationY.current += dx;
          orbitalRotationY.current += dx;
          dragStartX.current = e.clientX;
        }
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      {/* Studio Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 6]} intensity={2.0} color="#FFFFFF" />

      {/* Rim Accent Lights */}
      <pointLight position={[-6, 5, 4]} color="#00F0FF" intensity={32} distance={22} />
      <pointLight position={[6, -4, 4]} color="#C084FC" intensity={28} distance={20} />
      <pointLight position={[0, -2, -4]} color="#8B5CF6" intensity={18} distance={15} />

      <StudioDustParticles count={200} />

      {/* Centerpiece Crystal AI Head — counter-rotates slightly for dynamic feel */}
      <group position={[0, 0.05, 0]}>
        <CrystalAiHead rotationY={orbitalRotationY.current * 0.35} />
      </group>

      {/* 360° Orbiting Card Carousel */}
      <group>
        {displayModels.map((model, idx) => {
          const total = displayModels.length;
          const baseAngle = (idx / total) * Math.PI * 2;
          const currentAngle = baseAngle + orbitalRotationY.current;

          // World position on ellipse
          const posX = Math.sin(currentAngle) * RADIUS_X;
          const posZ = Math.cos(currentAngle) * RADIUS_Z;
          const posY = 0.05 + Math.sin(idx * 1.2 + 0.6) * 0.1;

          // Outward-facing rotation: card front (+Z local) points away from origin
          const rotY = getOutwardRotationY(posX, posZ);

          // Opacity & scale: front half (posZ > 0) = fully visible; rear half fades out
          // cos(currentAngle) > 0 means front hemisphere
          const cosA = Math.cos(currentAngle);
          const isFront = cosA >= 0;

          // Smooth opacity: 1.0 at front, 0.15 at deepest rear
          const depthT = (cosA + 1) / 2; // 0..1 where 1 = front
          const opacity = THREE.MathUtils.lerp(0.15, 1.0, Math.pow(depthT, 1.8));

          // Rear cards scale down slightly
          const scale = THREE.MathUtils.lerp(0.78, 1.0, Math.pow(depthT, 1.2));

          const isSelected = activeIndex === idx;

          return (
            <group key={model.id} scale={[scale, scale, scale]}>
              <CyberModelCard3D
                model={model}
                position={[posX, posY, posZ]}
                rotation={[0, rotY, 0]}
                isSelected={isSelected}
                opacity={opacity}
                onSelect={(m) => onSelectModel(m)}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
