"use client";

import React from "react";

export function HudCornerBrackets() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none hidden md:block">
      {/* Top Left */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 font-mono text-[9px] text-cyber-dim">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 border-t border-l border-cyan-electric/70" />
          <span className="tracking-widest text-cyan-electric/60">SYS_COORD // 01.A</span>
        </div>
        <div className="pl-3 text-[8px] text-cyber-dim/80">LAT 37.7749° N</div>
      </div>

      {/* Top Right */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1 font-mono text-[9px] text-cyber-dim">
        <div className="flex items-center gap-1.5">
          <span className="tracking-widest text-neural-light/60">SEC_LEVEL // OMEGA</span>
          <div className="w-2.5 h-2.5 border-t border-r border-neural-violet/70" />
        </div>
        <div className="pr-3 text-[8px] text-cyber-dim/80">NODE: US-WEST-01</div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 font-mono text-[9px] text-cyber-dim">
        <div className="pl-3 text-[8px] text-cyber-dim/80">BUFFER: 100% READY</div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 border-b border-l border-cyan-electric/70" />
          <span className="tracking-widest text-cyber-dim">NEURAL // ARCHIVE 2026</span>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 font-mono text-[9px] text-cyber-dim">
        <div className="pr-3 text-[8px] text-cyber-dim/80">R3F v8 // THREE.JS 0.169</div>
        <div className="flex items-center gap-1.5">
          <span className="tracking-widest text-emerald/60">MOUNTED // OK</span>
          <div className="w-2.5 h-2.5 border-b border-r border-emerald/70" />
        </div>
      </div>
    </div>
  );
}
