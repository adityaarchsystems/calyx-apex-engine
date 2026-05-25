
/**
 * CALYX NEXUS — Neural Compute Math Engine
 * Implements the CAS (Compute Authority Score) Algorithm.
 */

import { HFModel, HFSpace } from "./client";

/**
 * MANDATE 2: The Compute Authority Formula
 * CAS = SUM [ log(D + 1) * Wq + (L * 1.5) + S_score ]
 */
export function calculateCAS(models: any[], spaces: any[]): { 
  totalCAS: number; 
  nodes: { id: string; cas: number; isQuantized: boolean }[] 
} {
  const quantTags = ["gguf", "awq", "onnx", "exl2"];
  
  const processedModels = models.map(m => {
    const isQuantized = m.tags?.some((tag: string) => 
      quantTags.includes(tag.toLowerCase())
    );
    
    const weightModifier = isQuantized ? 1.8 : 1.0;
    
    // MANDATE 2.1: log1p protection against -Infinity/NaN
    const downloads = m.downloads || 0;
    const likes = m.likes || 0;
    
    const cas = (Math.log1p(downloads) * weightModifier) + (likes * 1.5);
    
    return {
      id: m.id.split("/")[1] || m.id,
      cas: parseFloat(cas.toFixed(2)),
      isQuantized
    };
  });

  const processedSpaces = spaces.map(s => ({
    id: s.id.split("/")[1] || s.id,
    cas: parseFloat((s.trendingScore || 0).toFixed(2)),
    isQuantized: false
  }));

  const allNodes = [...processedModels, ...processedSpaces]
    .sort((a, b) => b.cas - a.cas)
    .slice(0, 12); // Top 12 as per Mandate 3.1

  const totalCAS = allNodes.reduce((acc, curr) => acc + curr.cas, 0);

  return {
    totalCAS: parseFloat(totalCAS.toFixed(2)),
    nodes: allNodes
  };
}
