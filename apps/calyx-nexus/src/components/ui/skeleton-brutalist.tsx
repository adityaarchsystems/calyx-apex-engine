
import React from "react";

interface SkeletonProps {
  className?: string;
  height?: string;
}

export const SkeletonBrutalist: React.FC<SkeletonProps> = ({ className = "", height = "h-32" }) => {
  return (
    <div 
      className={`w-full bg-[#1e3348]/20 animate-pulse border border-[#1e3348]/40 ${height} ${className}`}
      style={{ borderRadius: "0px" }}
    />
  );
};
