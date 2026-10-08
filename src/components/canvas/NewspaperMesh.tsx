"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { PaperPageContent } from "./PaperPageContent";
import { NewsArticle } from "@/lib/news/types";
import { PaperThemeId, PAPER_THEMES } from "@/lib/theme/paperTheme";

interface NewspaperMeshProps {
  scrollProgress: number; // 0 to 1
  sinChewArticles: NewsArticle[];
  chinaPressArticles: NewsArticle[];
  theme?: PaperThemeId;
  onSelectArticle?: (article: NewsArticle) => void;
}

// Broadsheet Dimensions: 2.0w x 2.85h (aspect ratio 1 : 1.425)
const PAGE_WIDTH = 2.0;
const PAGE_HEIGHT = 2.85;
const PAPER_THICKNESS = 0.006;
// Drei scaling: 800px * (10 / 400) * 0.1 = 2.0 units; 1140px * (10 / 400) * 0.1 = 2.85 units
const HTML_SCALE = 0.1;

export const NewspaperMesh: React.FC<NewspaperMeshProps> = ({
  scrollProgress,
  sinChewArticles,
  chinaPressArticles,
  theme = "vintage",
  onSelectArticle,
}) => {
  const currentTheme = PAPER_THEMES[theme] || PAPER_THEMES.vintage;
  const leftPageRef = useRef<THREE.Group>(null);
  const wholeNewspaperRef = useRef<THREE.Group>(null);

  // Smooth interpolated rotation states
  const currentFoldAngle = useRef(0);
  const currentRotX = useRef(0.18);
  const currentRotY = useRef(-0.32);
  const currentRotZ = useRef(0.06);
  const currentPosY = useRef(0);

  useFrame((state, delta) => {
    // 1. Strict Value Clamping [0, 1]
    const p = Math.min(Math.max(scrollProgress, 0), 1);

    // Fade factor for Phase 1 idle floating motion & mouse parallax
    // 1.0 at 0% scroll -> smoothly decays to 0.0 at 25% scroll
    const heroFactor = Math.max(0, 1 - p / 0.25);

    // Soft vertical breathing bob: Math.sin(t * 1.2) * 0.04
    const floatingBob =
      Math.sin(state.clock.getElapsedTime() * 1.2) * 0.04 * heroFactor;

    // ==============================================================
    // 2. Strict, Monotonic Rotation & Unfolding Calculations
    // ==============================================================
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetPosY = 0;
    let targetFoldAngle = 0;

    if (p <= 0.25) {
      // Phase 1 (0% to 25%): Hero State
      // Rests closed at elegant, stable isometric perspective [0.18, -0.32, 0.06] with gentle breathing bob
      targetRotX = 0.18;
      targetRotY = -0.32;
      targetRotZ = 0.06;
      targetPosY = floatingBob;
      targetFoldAngle = 0; // Fully closed on top of right page
    } else if (p < 0.6) {
      // Phase 2 (25% to 60%): Smooth Unfold Transition
      // Glides from isometric tilt to flat view [0, 0, 0]
      // Left page unfolds open around spine Y-axis from 0 to -Math.PI
      const t = (p - 0.25) / 0.35;
      const ease = t * t * (3 - 2 * t); // Smooth cubic ease

      targetRotX = THREE.MathUtils.lerp(0.18, 0, ease);
      targetRotY = THREE.MathUtils.lerp(-0.32, 0, ease);
      targetRotZ = THREE.MathUtils.lerp(0.06, 0, ease);
      targetPosY = 0;
      targetFoldAngle = THREE.MathUtils.lerp(0, -Math.PI, ease);
    } else {
      // Phase 3 (60% to 100%): Reading Lock
      // Stays perfectly flat facing the camera [0, 0, 0] with zero flip/tilt
      targetRotX = 0;
      targetRotY = 0;
      targetRotZ = 0;
      targetPosY = 0;
      targetFoldAngle = -Math.PI; // Fully spread open flat
    }

    // ==============================================================
    // 3. Smooth Damping with Delta Time (Silky Deceleration)
    // ==============================================================
    const dampSpeed = 10;
    currentFoldAngle.current = THREE.MathUtils.damp(
      currentFoldAngle.current,
      targetFoldAngle,
      dampSpeed,
      delta
    );
    currentRotX.current = THREE.MathUtils.damp(
      currentRotX.current,
      targetRotX,
      dampSpeed,
      delta
    );
    currentRotY.current = THREE.MathUtils.damp(
      currentRotY.current,
      targetRotY,
      dampSpeed,
      delta
    );
    currentRotZ.current = THREE.MathUtils.damp(
      currentRotZ.current,
      targetRotZ,
      dampSpeed,
      delta
    );
    currentPosY.current = THREE.MathUtils.damp(
      currentPosY.current,
      targetPosY,
      dampSpeed,
      delta
    );

    // Apply damped transformations to 3D groups
    if (leftPageRef.current) {
      leftPageRef.current.rotation.y = currentFoldAngle.current;
    }

    if (wholeNewspaperRef.current) {
      wholeNewspaperRef.current.rotation.x = currentRotX.current;
      wholeNewspaperRef.current.rotation.y = currentRotY.current;
      wholeNewspaperRef.current.rotation.z = currentRotZ.current;
      wholeNewspaperRef.current.position.y = currentPosY.current;
    }
  });

  const p = Math.min(Math.max(scrollProgress, 0), 1);
  const showCover = p < 0.55;
  const showInside = p > 0.15;

  return (
    <group ref={wholeNewspaperRef} position={[0, 0, 0]}>
      {/* Central Spine Binding Cylinder */}
      <mesh position={[0, 0, 0.003]}>
        <cylinderGeometry args={[0.016, 0.016, PAGE_HEIGHT, 16]} />
        <meshStandardMaterial
          color="#d5cec0"
          roughness={0.9}
          metalness={0.05}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ================================================================ */}
      {/* RIGHT WING (Stationary right spread: China Press Feed)           */}
      {/* ================================================================ */}
      <group position={[PAGE_WIDTH / 2, 0, 0]}>
        {/* Paper Mesh Backing with FrontSide only */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAPER_THICKNESS]} />
          <meshStandardMaterial
            color={currentTheme.meshColor}
            roughness={0.88}
            metalness={0.02}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Right Inside Page Content (China Press Feed) */}
        {showInside && (
          <Html
            transform
            position={[0, 0, 0.006]}
            scale={HTML_SCALE}
            style={{
              width: "800px",
              height: "1140px",
              pointerEvents: "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformOrigin: "center center",
            }}
          >
            <PaperPageContent
              type="rightSpread"
              sinChewArticles={sinChewArticles}
              chinaPressArticles={chinaPressArticles}
              theme={theme}
              onSelectArticle={onSelectArticle}
            />
          </Html>
        )}
      </group>

      {/* ================================================================ */}
      {/* LEFT WING (Unfolds around spine Y-axis from 0 to -Math.PI)       */}
      {/* ================================================================ */}
      {/* Pivot is centered exactly at x = 0 (the spine) */}
      <group ref={leftPageRef} position={[0, 0, 0]}>
        {/* Child group is positioned at +PAGE_WIDTH/2 so when rotation.y = 0 it rests closed on the right */}
        <group position={[PAGE_WIDTH / 2, 0, 0.005]}>
          {/* Paper Mesh Backing with FrontSide only */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAPER_THICKNESS]} />
            <meshStandardMaterial
              color={currentTheme.meshColor}
              roughness={0.88}
              metalness={0.02}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* Front Cover Content (+Z face: visible when closed at rotation.y = 0) */}
          {showCover && (
            <Html
              transform
              position={[0, 0, 0.006]}
              scale={HTML_SCALE}
              style={{
                width: "800px",
                height: "1140px",
                pointerEvents: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformOrigin: "center center",
              }}
            >
              <PaperPageContent
                type="cover"
                sinChewArticles={sinChewArticles}
                chinaPressArticles={chinaPressArticles}
                theme={theme}
                onSelectArticle={onSelectArticle}
              />
            </Html>
          )}

          {/* Inside Left Page Content (-Z face: rotates to face +Z when unfolded to -Math.PI) */}
          {showInside && (
            <Html
              transform
              position={[0, 0, -0.006]}
              rotation={[0, Math.PI, 0]}
              scale={HTML_SCALE}
              style={{
                width: "800px",
                height: "1140px",
                pointerEvents: "auto",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformOrigin: "center center",
              }}
            >
              <PaperPageContent
                type="leftSpread"
                sinChewArticles={sinChewArticles}
                chinaPressArticles={chinaPressArticles}
                theme={theme}
                onSelectArticle={onSelectArticle}
              />
            </Html>
          )}
        </group>
      </group>
    </group>
  );
};

export default NewspaperMesh;
