
"use client";

import React from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Node {
  id: string;
  cas: number;
  isQuantized: boolean;
}

interface ComputeRackProps {
  nodes: Node[];
}

const ComputeRack: React.FC<ComputeRackProps> = ({ nodes }) => {
  const maxCAS = Math.max(...nodes.map(n => n.cas), 1);

  return (
    <div className="flex items-end h-40 gap-1 w-full bg-calyx-border/5 p-1 border border-calyx-border/20">
      <TooltipProvider delayDuration={0}>
        {nodes.map((node, i) => (
          <Tooltip key={`${node.id}-${i}`}>
            <TooltipTrigger asChild>
              <div 
                className="w-4 min-h-[4px] bg-[#1e3348] transition-colors hover:bg-calyx-turquoise cursor-crosshair"
                style={{ 
                  height: `${(node.cas / maxCAS) * 100}%`,
                  ...(node.cas > 0 && { 
                    backgroundColor: node.cas >= maxCAS * 0.8 ? '#4E8A78' : `rgba(78, 138, 120, ${node.cas / maxCAS})` 
                  })
                }}
              />
            </TooltipTrigger>
            <TooltipContent 
              className="bg-[#152233] border-calyx-turquoise/50 rounded-none p-2 text-[10px] font-mono text-calyx-platinum z-50"
              side="top"
              sideOffset={5}
            >
              <div className="flex flex-col gap-1">
                <span className="text-calyx-turquoise uppercase tracking-tighter">Node ID: {node.id}</span>
                <span className="text-calyx-text-muted">Compute Authority: {node.cas}</span>
                <span className="text-calyx-text-muted">Arch: {node.isQuantized ? "Quantized (AWQ/GGUF)" : "Standard"}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {/* Placeholder bars to maintain rack density if nodes < 12 */}
        {Array.from({ length: Math.max(0, 12 - nodes.length) }).map((_, i) => (
          <div 
            key={`placeholder-${i}`}
            className="w-4 min-h-[4px] bg-[#1e3348]/40"
            style={{ 
              height: "4%",
            }}
          />
        ))}
      </TooltipProvider>
    </div>
  );
};


export default ComputeRack;
