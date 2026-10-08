"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CrystalAiHeadProps {
  rotationY: number;
}

export function CrystalAiHead({ rotationY }: CrystalAiHeadProps) {
  const headGroupRef = useRef<THREE.Group>(null);
  const brainMeshRef = useRef<THREE.Mesh>(null);
  const brainLeftRef = useRef<THREE.Mesh>(null);
  const brainRightRef = useRef<THREE.Mesh>(null);
  const neuralPointsRef = useRef<THREE.Points>(null);
  const cyanRingRef = useRef<THREE.Mesh>(null);
  const violetRingRef = useRef<THREE.Mesh>(null);

  // Generate glowing neural brain synaptic network
  const { brainPoints, brainColors, brainConnections } = useMemo(() => {
    const count = 350;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyan = new THREE.Color("#00F0FF");
    const violet = new THREE.Color("#C084FC");
    const pink = new THREE.Color("#F472B6");

    for (let i = 0; i < count; i++) {
      // Dual hemisphere distribution for brain
      const isLeft = Math.random() > 0.5;
      const hemisphereOffset = isLeft ? -0.28 : 0.28;

      const r = 0.55 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = hemisphereOffset + r * 0.7 * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 0.45 + r * 0.8 * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = -0.05 + r * 0.85 * Math.cos(phi);

      const t = Math.random();
      const mixed = t < 0.5 ? cyan.clone().lerp(violet, t * 2) : violet.clone().lerp(pink, (t - 0.5) * 2);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    // Connect close neurons with neural axons (synapses)
    const lineCoords: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.22 && lineCoords.length < 800) {
          lineCoords.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          lineCoords.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }

    const pointGeom = new THREE.BufferGeometry();
    pointGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineCoords), 3));

    return { brainPoints: pointGeom, brainColors: colors, brainConnections: lineGeom };
  }, []);

  useFrame((state, delta) => {
    if (!headGroupRef.current) return;

    const time = state.clock.elapsedTime;

    // Apply rotation
    headGroupRef.current.rotation.y = rotationY;

    // Soft lifelike breathing and head bobbing
    headGroupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
    headGroupRef.current.rotation.x = Math.sin(time * 1.0) * 0.03;

    // Brain pulse animation
    if (brainLeftRef.current && brainRightRef.current) {
      const pulse = 1.0 + Math.sin(time * 3.5) * 0.025;
      brainLeftRef.current.scale.set(pulse, pulse, pulse);
      brainRightRef.current.scale.set(pulse, pulse, pulse);
    }

    // Dynamic rotation of the large orbital cyan & violet rings
    if (cyanRingRef.current) {
      cyanRingRef.current.rotation.z += delta * 0.25;
    }
    if (violetRingRef.current) {
      violetRingRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group ref={headGroupRef} position={[0, 0, 0]}>
      {/* 1. Outer Faceted Crystal / Diamond Skull (Refractive Glass Planes) */}
      <group position={[0, 0.2, 0]}>
        {/* Main Cranium - Faceted Geometric Diamond Glass */}
        <mesh position={[0, 0.25, -0.05]} scale={[1.08, 1.25, 1.15]}>
          <icosahedronGeometry args={[1.05, 3]} />
          <meshPhysicalMaterial
            color="#d8e8f8"
            emissive="#121828"
            emissiveIntensity={0.25}
            roughness={0.06}
            metalness={0.12}
            transmission={0.88}
            thickness={1.4}
            ior={1.54}
            reflectivity={0.95}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            flatShading={true} // Creates the iconic faceted glass diamond look
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Sculpted Face & Jawline Profile (Refractive Glass) */}
        <mesh position={[0, -0.3, 0.45]} rotation={[Math.PI / 18, 0, 0]} scale={[0.78, 0.95, 0.72]}>
          <cylinderGeometry args={[0.7, 0.38, 1.2, 8]} />
          <meshPhysicalMaterial
            color="#b0d0f0"
            roughness={0.08}
            metalness={0.15}
            transmission={0.85}
            thickness={1.1}
            ior={1.52}
            flatShading={true}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Crystalline Nose & Eye Brow Ridge */}
        <mesh position={[0, -0.15, 0.9]} scale={[0.18, 0.45, 0.28]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#e0f0ff"
            roughness={0.05}
            metalness={0.2}
            transmission={0.9}
            thickness={0.8}
            ior={1.6}
            flatShading={true}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Geometric Eye Sockets / Crystalline Iris */}
        <mesh position={[-0.32, -0.08, 0.78]} scale={[0.22, 0.14, 0.12]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>
        <mesh position={[0.32, -0.08, 0.78]} scale={[0.22, 0.14, 0.12]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#00F0FF" wireframe />
        </mesh>

        {/* Temple & Neck Circuit Micro-Plates (Sub-surface Tech Layer) */}
        <mesh position={[-0.85, 0.1, 0.1]} rotation={[0, -Math.PI / 4, 0]} scale={[0.35, 0.6, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0a1220" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0.85, 0.1, 0.1]} rotation={[0, Math.PI / 4, 0]} scale={[0.35, 0.6, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0a1220" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* 2. Anatomically Sculpted Glowing Neural Brain Inside Cranium */}
      <group position={[0, 0.45, -0.05]}>
        {/* Left Hemisphere Brain Lobes */}
        <mesh ref={brainLeftRef} position={[-0.28, 0, 0]} scale={[0.55, 0.62, 0.75]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.1}
            transmission={0.4}
            thickness={0.5}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Right Hemisphere Brain Lobes */}
        <mesh ref={brainRightRef} position={[0.28, 0, 0]} scale={[0.55, 0.62, 0.75]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.1}
            transmission={0.4}
            thickness={0.5}
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Firing Neural Synaptic Node Particles */}
        <points ref={neuralPointsRef} geometry={brainPoints}>
          <pointsMaterial
            size={0.045}
            vertexColors
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Interconnected Neural Axon Synapse Lines */}
        <lineSegments geometry={brainConnections}>
          <lineBasicMaterial color="#00F0FF" transparent opacity={0.35} />
        </lineSegments>
      </group>

      {/* 3. Sculpted Faceted Neck & Base Pedestal */}
      <group position={[0, -0.95, -0.05]}>
        <mesh scale={[0.58, 0.8, 0.58]}>
          <cylinderGeometry args={[0.55, 0.75, 0.8, 8]} />
          <meshPhysicalMaterial
            color="#080e18"
            emissive="#060c18"
            roughness={0.1}
            metalness={0.88}
            transmission={0.4}
            flatShading={true}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]} scale={[0.85, 0.1, 0.85]}>
          <cylinderGeometry args={[1, 1.2, 0.2, 8]} />
          <meshStandardMaterial color="#050a12" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 4. Large Glowing Tilted Orbital Laser Rings (Exactly from reference image) */}
      {/* Cyan Orbital Ring looping across the head and cards */}
      <mesh
        ref={cyanRingRef}
        position={[0, 0.15, 0]}
        rotation={[Math.PI / 4, Math.PI / 6, 0]}
      >
        <torusGeometry args={[3.2, 0.016, 16, 128]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
      </mesh>

      {/* Violet / Magenta Orbital Ring tilted across the opposite plane */}
      <mesh
        ref={violetRingRef}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 3, -Math.PI / 5, 0]}
      >
        <torusGeometry args={[3.4, 0.014, 16, 128]} />
        <meshBasicMaterial color="#C084FC" transparent opacity={0.75} />
      </mesh>

      {/* Central Cyan & Violet Studio Lights illuminating crystal facets */}
      <pointLight position={[0, 0.6, 0.2]} color="#00F0FF" intensity={18} distance={5} />
      <pointLight position={[0, 0.5, -0.6]} color="#A855F7" intensity={25} distance={6} />
      <pointLight position={[-2, 1, 2]} color="#38BDF8" intensity={15} distance={8} />
      <pointLight position={[2, 1, 2]} color="#E879F9" intensity={15} distance={8} />
    </group>
  );
}
