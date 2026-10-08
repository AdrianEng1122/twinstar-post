"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { NewspaperMesh } from "./NewspaperMesh";
import { NewsArticle } from "@/lib/news/types";
import { PaperThemeId, PAPER_THEMES } from "@/lib/theme/paperTheme";

interface CameraRigProps {
  scrollProgress: number;
  focusMode?: "all" | "sinchew" | "chinapress";
}

const CameraRig: React.FC<CameraRigProps> = ({ scrollProgress, focusMode = "all" }) => {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // 1. Strict Clamping of Scroll Progress [0, 1]
    const p = Math.min(Math.max(scrollProgress, 0), 1);

    // 2. Camera Positioning & Page Focus Zoom (Silky, rock-solid, ZERO jitter)
    // Phase 1 (0–25%) & Phase 2 (25–60%): Camera stays at standard distance [0, 0, 4.7]
    // Phase 3 (60–100%): Camera zooms in cleanly to either full spread (3.4) or single page focus (2.65)
    let targetX = 0;
    let targetY = 0;
    let targetZ = 4.7;

    if (p > 0.6) {
      const t = (p - 0.6) / 0.4;
      const ease = t * t * (3 - 2 * t);

      if (focusMode === "sinchew") {
        // Focus Left Page: Sin Chew Daily Broadsheet (Fills screen, text 2.5x larger!)
        targetX = THREE.MathUtils.lerp(0, -0.96, ease);
        targetY = THREE.MathUtils.lerp(0, 0.06, ease);
        targetZ = THREE.MathUtils.lerp(4.7, 2.65, ease);
      } else if (focusMode === "chinapress") {
        // Focus Right Page: China Press Broadsheet (Fills screen, text 2.5x larger!)
        targetX = THREE.MathUtils.lerp(0, 0.96, ease);
        targetY = THREE.MathUtils.lerp(0, 0.06, ease);
        targetZ = THREE.MathUtils.lerp(4.7, 2.65, ease);
      } else {
        // Double-Page Broadsheet Spread Overview
        targetX = 0;
        targetY = THREE.MathUtils.lerp(0, -0.04, ease);
        targetZ = THREE.MathUtils.lerp(4.7, 3.4, ease);
      }
    }

    // Pure, stable cinema damping
    const dampSpeed = 7;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, dampSpeed, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, dampSpeed, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, dampSpeed, delta);

    const lookAtX = THREE.MathUtils.damp(targetLookAt.current.x, targetX, dampSpeed, delta);
    const lookAtY = THREE.MathUtils.damp(targetLookAt.current.y, targetY, dampSpeed, delta);
    targetLookAt.current.set(lookAtX, lookAtY, 0);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};

interface NewspaperSceneProps {
  scrollProgress: number;
  focusMode?: "all" | "sinchew" | "chinapress";
  sinChewArticles: NewsArticle[];
  chinaPressArticles: NewsArticle[];
  theme?: PaperThemeId;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const NewspaperScene: React.FC<NewspaperSceneProps> = ({
  scrollProgress,
  focusMode = "all",
  sinChewArticles,
  chinaPressArticles,
  theme = "vintage",
  onSelectArticle,
}) => {
  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      className="w-full h-full relative select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 4.7], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Soft Studio Ambient Lighting */}
        <ambientLight intensity={1.4} color="#252530" />

        {/* Studio Key Directional Light */}
        <directionalLight
          position={[5, 7, 5]}
          intensity={2.6}
          color="#fffaf0"
        />

        {/* Warm Studio Rim Light (Back-Left) */}
        <directionalLight
          position={[-6, 3, -4]}
          intensity={3.4}
          color="#ffd8a8"
        />

        {/* Cool Fill Light (Right) */}
        <directionalLight
          position={[5, -2, -3]}
          intensity={1.2}
          color="#90caf9"
        />

        {/* Camera Rig with Smooth Track-in & Page Focus Zoom */}
        <CameraRig scrollProgress={scrollProgress} focusMode={focusMode} />

        {/* 3D Broadsheet Mesh */}
        <NewspaperMesh
          scrollProgress={scrollProgress}
          sinChewArticles={sinChewArticles}
          chinaPressArticles={chinaPressArticles}
          theme={theme}
          onSelectArticle={onSelectArticle}
        />

        {/* Floor Contact Shadows - Rendered once statically for massive 60fps performance */}
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.65}
          scale={10}
          blur={2.2}
          far={4}
          frames={1}
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

export default NewspaperScene;
