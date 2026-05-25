"use client";

import React from "react";

export const AnodicObsidian = () => {
  return (
    <div className="fixed inset-0 z-[-1] anodic-obsidian overflow-hidden">
      {/* Subtle secondary glow to add depth */}
      <div 
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
        style={{ background: "radial-gradient(circle, #1e293b 0%, transparent 70%)" }}
      />
      <div 
        className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10"
        style={{ background: "radial-gradient(circle, #334155 0%, transparent 70%)" }}
      />
    </div>
  );
};
