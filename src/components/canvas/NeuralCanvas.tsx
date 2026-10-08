"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Interactive Cyber Neural Core Sphere / Icosahedron
function CyberNeuralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.15;
      wireframeRef.current.rotation.z += delta * 0.05;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.08;
      outerRingRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <group position={[0, 0, 0]}>
        {/* Central Core with Distort Shimmer */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 3]} />
          <MeshDistortMaterial
            color="#080814"
            emissive="#1E1035"
            roughness={0.2}
            metalness={0.9}
            distort={0.3}
            speed={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Outer Electric Cyan Wireframe Cage */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[1.75, 1]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={0.6}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbiting Orbital Rings */}
        <group ref={outerRingRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.5, 0.015, 16, 100]} />
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[2.8, 0.012, 16, 100]} />
            <meshBasicMaterial color="#00F0FF" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// Background Cyber Particle Constellation
function CyberParticles({ count = 200 }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 20;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8B5CF6"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function NeuralCanvas() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Cyber Dark Lighting Setup */}
        <ambientLight intensity={0.4} />
        
        {/* Neural Violet Key Light */}
        <pointLight position={[-6, 4, 3]} color="#8B5CF6" intensity={35} distance={15} />

        {/* Electric Cyan Rim Light */}
        <pointLight position={[6, -3, 4]} color="#00F0FF" intensity={30} distance={15} />

        {/* Emerald Core Accent */}
        <pointLight position={[0, 0, -2]} color="#10B981" intensity={15} distance={10} />

        {/* Baseline 3D Scene Elements */}
        <CyberParticles count={250} />
        <CyberNeuralCore />

        {/* Smooth OrbitControls for Camera Interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
