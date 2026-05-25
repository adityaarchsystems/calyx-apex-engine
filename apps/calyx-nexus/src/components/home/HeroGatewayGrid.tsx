"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalyxBentoCellAttributes, CalyxMatrixDeploymentPayload } from "@cpm/types";

const DEFAULT_CELLS: CalyxBentoCellAttributes[] = [
    { id: "node-header", label: "Header Controller", type: "core", weight: 1, status: "compiled", lastSynchronized: new Date().toISOString() },
    { id: "node-stats", label: "Stats Matrix", type: "infrastructure", weight: 2, status: "active", lastSynchronized: new Date().toISOString() },
    { id: "node-bio", label: "Developer Bio", type: "showcase", weight: 1, status: "standby", lastSynchronized: new Date().toISOString() },
    { id: "node-kinetic", label: "Pulsing Telemetry", type: "kinetic", weight: 3, status: "compiled", lastSynchronized: new Date().toISOString() }
];

const colRowSpans = [
    "col-span-2 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-2",
    "col-span-3 row-span-2"
];

export function ControlRoomPortal({ isEmbed = false }: { isEmbed?: boolean }) {
    const [isMounted, setIsMounted] = useState(false);
    const [radarSpeed, setRadarSpeed] = useState<string>("4s");
    const [isOverdrive, setIsOverdrive] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleDeploy = (e: Event) => {
                const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
                const payload = customEvent.detail;

                setRadarSpeed("600ms");
                setIsOverdrive(true);

                const timer = setTimeout(() => {
                    setRadarSpeed("4s");
                    setIsOverdrive(false);
                }, 1800);

                return () => clearTimeout(timer);
            };

            window.addEventListener("calyx-matrix-deployed", handleDeploy);
            return () => {
                window.removeEventListener("calyx-matrix-deployed", handleDeploy);
            };
        }
    }, []);

    if (!isMounted) {
        if (isEmbed) {
            return (
                <div className="h-full flex items-center justify-center font-mono text-[10px] text-zinc-500">
                    HYDRATING CORE DATA...
                </div>
            );
        }
        return (
            <div className="bg-[#07060f]/60 border border-[rgba(139,92,246,0.15)] rounded-sm p-6 h-full flex flex-col justify-between" />
        );
    }

    const content = (
        <>
            {/* SVG Latency Radar Loop */}
            <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        {/* Concentric Purple-Obsidian Mapping Rings */}
                        <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" />
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" />
                        
                        {/* Rotating radar sweep line */}
                        <line 
                            x1="100" 
                            y1="100" 
                            x2="100" 
                            y2="10" 
                            stroke="rgba(168, 85, 247, 0.4)" 
                            strokeWidth="1.5" 
                            className="origin-[100px_100px]"
                            style={{
                                animationName: "radar-sweep",
                                animationDuration: radarSpeed,
                                animationTimingFunction: "linear",
                                animationIterationCount: "infinite"
                            }}
                        />
                    </svg>
                    
                    {/* Scattered Pulsing Target Nodes */}
                    <div className="absolute top-[35%] right-[28%] flex items-center justify-center">
                        <span className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: "0.5s" }} />
                        <span className={`relative w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            isOverdrive 
                                ? "bg-green-400 scale-125 shadow-[0_0_15px_#22c55e] animate-ping" 
                                : "bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-[pulse-highlight_4s_ease-in-out_infinite]"
                        }`} style={{ animationDelay: "0.5s" }} />
                    </div>
                    
                    <div className="absolute bottom-[30%] left-[25%] flex items-center justify-center">
                        <span className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: "2s" }} />
                        <span className={`relative w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            isOverdrive 
                                ? "bg-green-400 scale-125 shadow-[0_0_15px_#22c55e] animate-ping" 
                                : "bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-[pulse-highlight_4s_ease-in-out_infinite]"
                        }`} style={{ animationDelay: "2s" }} />
                    </div>
                    
                    <div className="absolute top-[25%] left-[38%] flex items-center justify-center">
                        <span className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" style={{ animationDelay: "3s" }} />
                        <span className={`relative w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            isOverdrive 
                                ? "bg-green-400 scale-125 shadow-[0_0_15px_#22c55e] animate-ping" 
                                : "bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-[pulse-highlight_4s_ease-in-out_infinite]"
                        }`} style={{ animationDelay: "3s" }} />
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-2">
                {!isEmbed && (
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#a855f7]/85 uppercase">
                            MODULE 01
                        </span>
                        <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                    </div>
                )}
                <Link href="/dashboard" prefetch={true} className="block">
                    <h3 className="text-2xl font-black text-white tracking-tight font-sans hover:text-[#a855f7] transition-colors">
                        CONTROL ROOM
                    </h3>
                </Link>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed font-sans">
                    Monitor real-time cluster metrics, active deployments, and latency performance matrices.
                </p>
            </div>

            <div className="relative z-10 flex items-end justify-between w-full">
                <Link
                    href="/dashboard"
                    prefetch={true}
                    className="px-4 py-2 border border-neutral-800 rounded text-[11px] font-mono tracking-wider transition-all duration-200 hover:border-[#a855f7]/40 hover:bg-[#a855f7]/5 text-neutral-300 uppercase flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                >
                    <span>ACCESS TELEMETRY</span>
                    <span className="text-[8px] opacity-60">■</span>
                </Link>
                <span className="text-[10px] font-mono text-purple-300 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0">
                    [SECURE_CONN_ACTIVE]
                </span>
            </div>
        </>
    );

    if (isEmbed) {
        return (
            <div className="w-full h-full relative flex flex-col justify-between p-6 sm:p-8">
                {content}
            </div>
        );
    }

    return (
        <div
            className="group relative w-full h-full p-6 sm:p-8 overflow-hidden flex flex-col justify-between border border-calyx-border/30 bg-calyx-bg rounded-sm"
        >
            {content}
        </div>
    );
}

export function DesignStudioCustomizer({ isEmbed = false }: { isEmbed?: boolean }) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [bentoCells, setBentoCells] = useState<CalyxBentoCellAttributes[]>(DEFAULT_CELLS);
    const [selectedCell, setSelectedCell] = useState<CalyxBentoCellAttributes | null>(null);
    const [tooltipCoords, setTooltipCoords] = useState<{ x: number; y: number } | null>(null);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("calyx_active_matrices");
        if (stored) {
            try {
                const list = JSON.parse(stored);
                if (Array.isArray(list) && list.length > 0) {
                    const activeMatrix = list[0];
                    setBentoCells((prev) =>
                        prev.map((cell, idx) => ({
                            ...cell,
                            status: activeMatrix.status === "ACTIVE" ? "compiled" : "active",
                            weight: Math.min(4, cell.weight + (activeMatrix.nodes % (idx + 2))),
                            lastSynchronized: activeMatrix.syncTime === "Just now" ? new Date().toISOString() : cell.lastSynchronized
                        }))
                    );
                }
            } catch (e) {
                console.error("Local storage active matrices cache hydration scan failed:", e);
            }
        }
    }, []);

    // Garbage-collected scroll listener to clear coords immediately and prevent memory leaks
    useEffect(() => {
        const handleScroll = () => {
            setIsTooltipVisible(false);
            setSelectedCell(null);
            setTooltipCoords(null);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleDeploy = (e: Event) => {
                const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
                const payload = customEvent.detail;

                if (payload) {
                    setBentoCells((prev) =>
                        prev.map((cell, idx) => ({
                            ...cell,
                            status: "compiled",
                            weight: Math.min(4, cell.weight + (payload.nodeCount % (idx + 2))),
                            lastSynchronized: payload.timestamp
                        }))
                    );
                }
            };

            window.addEventListener("calyx-matrix-deployed", handleDeploy);
            return () => {
                window.removeEventListener("calyx-matrix-deployed", handleDeploy);
            };
        }
    }, []);

    useEffect(() => {
        if (!isTooltipVisible) {
            const timer = setTimeout(() => {
                setSelectedCell(null);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isTooltipVisible]);

    const handleCellInteraction = (e: React.MouseEvent, cell: CalyxBentoCellAttributes) => {
        e.preventDefault();
        e.stopPropagation();

        const cellEl = e.currentTarget as HTMLElement;
        const bounds = cellEl.getBoundingClientRect();
        
        setTooltipCoords({
            x: bounds.left + bounds.width / 2,
            y: bounds.top - 8
        });
        setSelectedCell(cell);
        setIsTooltipVisible(true);
    };

    const handleCellLeave = () => {
        setIsTooltipVisible(false);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest(".cursor-pointer")) {
            return;
        }
        router.push("/integrations");
    };

    if (!isMounted) {
        if (isEmbed) {
            return (
                <div className="h-full flex items-center justify-center font-mono text-[10px] text-zinc-500">
                    HYDRATING CORE CANVAS...
                </div>
            );
        }
        return (
            <div className="bg-[#07060f]/60 border border-[rgba(16,185,129,0.15)] rounded-sm p-6 h-full flex flex-col justify-between" />
        );
    }

    const content = (
        <>
            {/* Bento Component Preview Matrix (Interactive Micro-Canvas) */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 flex items-center justify-center p-6 select-none relative">
                <div className="grid grid-cols-4 grid-rows-3 gap-3 w-full h-full border border-[rgba(16,185,129,0.15)] p-4 bg-[#050508]/40 rounded-lg relative">
                    {bentoCells.map((cell, idx) => {
                        const colRowSpan = colRowSpans[idx];
                        return (
                            <div
                                key={cell.id}
                                onClick={(e) => handleCellInteraction(e, cell)}
                                onMouseEnter={(e) => handleCellInteraction(e, cell)}
                                onMouseLeave={handleCellLeave}
                                className={`${colRowSpan} calyx-bento-preview-cell rounded p-2 flex flex-col justify-between cursor-pointer active:scale-95`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-8 h-1.5 bg-emerald-500/40 rounded-sm" />
                                    <span className={`w-1 h-1 rounded-full ${
                                        cell.status === "compiled"
                                            ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                                            : cell.status === "active"
                                            ? "bg-purple-400 shadow-[0_0_6px_#c084fc]"
                                            : "bg-zinc-600"
                                    }`} />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[7.5px] font-mono text-zinc-300 truncate">{cell.label}</div>
                                    <div className="w-full h-1 bg-zinc-800/80 rounded-sm overflow-hidden relative">
                                        <div 
                                            className={`absolute left-0 top-0 bottom-0 ${
                                                cell.type === "core"
                                                    ? "bg-purple-500"
                                                    : cell.type === "infrastructure"
                                                    ? "bg-emerald-500"
                                                    : cell.type === "showcase"
                                                    ? "bg-amber-500"
                                                    : "bg-cyan-500"
                                            }`} 
                                            style={{ width: `${Math.min(100, cell.weight * 25)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Viewport-Fixed Micro-Tooltip */}
                    {selectedCell && tooltipCoords && (
                        <div
                            className={`pointer-events-none backdrop-blur-md bg-[#090810]/95 border border-[rgba(139,92,246,0.25)] shadow-[0_0_25px_rgba(139,92,246,0.15)] rounded px-3 py-2 text-[10px] font-mono text-neutral-300 min-w-[200px] transition-opacity duration-200 ${
                                isTooltipVisible ? "opacity-100 animate-[popIn_150ms_cubic-bezier(0.16,1,0.3,1)_forwards]" : "opacity-0"
                            }`}
                            style={{
                                position: "fixed",
                                left: `${tooltipCoords.x}px`,
                                top: `${tooltipCoords.y}px`,
                                transform: "translate(-50%, -100%)",
                                zIndex: 9999
                            }}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1 mb-1">
                                    <span className="font-bold text-white uppercase">{selectedCell.label}</span>
                                    <span className="text-green-400 font-bold uppercase">{selectedCell.status}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-zinc-400">
                                    <span className="text-zinc-500">ID:</span>
                                    <span className="text-zinc-300 truncate">{selectedCell.id}</span>
                                    <span className="text-zinc-500">TYPE:</span>
                                    <span className="text-zinc-300">{selectedCell.type}</span>
                                    <span className="text-zinc-500">WEIGHT:</span>
                                    <span className="text-zinc-300">{selectedCell.weight}</span>
                                    <span className="text-zinc-500">SYNCED:</span>
                                    <span className="text-zinc-400 truncate">{selectedCell.lastSynchronized.split('T')[1]?.slice(0, 8) || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 space-y-2">
                {!isEmbed && (
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                            MODULE 03
                        </span>
                        <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                    </div>
                )}
                <h3 className="text-2xl font-black text-white tracking-tight font-sans">
                    DESIGN STUDIO
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed font-sans">
                    Customize interactive portfolio matrices, configure custom domains, and deploy workspace layers.
                </p>
            </div>

            <div className="relative z-10 flex items-end justify-between w-full">
                <Link
                    href="/integrations"
                    prefetch={true}
                    className="px-4 py-2 border border-neutral-800 rounded text-[11px] font-mono tracking-wider transition-all duration-200 hover:border-[#a855f7]/40 hover:bg-[#a855f7]/5 text-neutral-300 uppercase flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                >
                    <span>DEPLOY PLATFORM</span>
                    <span className="text-[8px] opacity-60">■</span>
                </Link>
                <span className="text-[10px] font-mono text-emerald-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0">
                    [SANDBOX_READY]
                </span>
            </div>
        </>
    );

    if (isEmbed) {
        return (
            <div 
                onClick={handleCardClick}
                onMouseLeave={handleCellLeave}
                className="w-full h-full relative flex flex-col justify-between p-6 sm:p-8 cursor-pointer"
            >
                {content}
            </div>
        );
    }

    return (
        <div
            onClick={handleCardClick}
            className="group relative w-full h-full p-6 sm:p-8 overflow-hidden flex flex-col justify-between border border-calyx-border/30 bg-calyx-bg rounded-sm cursor-pointer"
            onMouseLeave={handleCellLeave}
        >
            {content}
        </div>
    );
}
