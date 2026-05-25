"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  withAura?: boolean;
}

export const GlassCard = ({ children, className, intensity = "medium", withAura = true }: GlassCardProps) => {
  const blurMap = {
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-[25px]",
    heavy: "backdrop-blur-[40px]",
  };

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        boxShadow: withAura
          ? "0 0 30px rgba(200,241,53,0.15), inset 0 0 0 0.3px rgba(200,241,53,0.35)"
          : "none",
        borderColor: "rgba(200,241,53,0.3)"
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative rounded-none border border-white/10 bg-white/[0.03] transition-all duration-500 overflow-hidden group",
        blurMap[intensity],
        className
      )}
    >
      {/* Subtle Specular Highlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative z-20 h-full">
        {children}
      </div>
    </motion.div>
  );
};
