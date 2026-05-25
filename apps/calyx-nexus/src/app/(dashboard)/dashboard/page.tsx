"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Database, Server, RefreshCw, Layers } from "lucide-react";
import { CalyxMatrixDeploymentPayload } from "@cpm/types";

interface MatrixItem {
    name: string;
    endpoint: string;
    nodes: number;
    syncTime: string;
    status: "ACTIVE" | "IDLE" | "PROCESSING";
}

export default function CommandHub() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [latencyPoints, setLatencyPoints] = useState<number[]>([12, 14, 11, 15, 10, 13, 9, 12, 11, 14, 15, 12]);
    const [liveLatency, setLiveLatency] = useState<number>(12);
    const [animationOffset, setAnimationOffset] = useState<number>(0);
    const [matrices, setMatrices] = useState<MatrixItem[]>([
        {
            name: "Primary GitHub Portfolio",
            endpoint: "calyx-dev.calyx.nexus",
            nodes: 14,
            syncTime: "2m ago",
            status: "ACTIVE",
        },
        {
            name: "Calyx Studios Corporate Matrix",
            endpoint: "studios.calyx.nexus",
            nodes: 8,
            syncTime: "1h ago",
            status: "IDLE",
        },
        {
            name: "Alpha-Gen Neural Node",
            endpoint: "neural.calyx.nexus",
            nodes: 18,
            syncTime: "Just now",
            status: "PROCESSING",
        },
    ]);
    const [quota, setQuota] = useState<any>({
        github: { used: 1100, total: 5000, percent: 22 },
        vercel: { used: 7200, total: 20000, percent: 36 },
        redis: { used: 80000, total: 1000000, percent: 8 }
    });

    useEffect(() => {
        setCurrentTime(new Date().toISOString());
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toISOString());
        }, 1000);

        const fetchQuota = async () => {
            try {
                const res = await fetch("/api/quota");
                if (res.ok) {
                    const data = await res.json();
                    setQuota(data);
                    if (data.latencyPoints && Array.isArray(data.latencyPoints)) {
                        setLatencyPoints(data.latencyPoints);
                        if (data.latencyPoints.length > 0) {
                            setLiveLatency(data.latencyPoints[data.latencyPoints.length - 1]);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to fetch quota data:", e);
            }
        };
        fetchQuota();

        // Refresh quota and server-side latency metrics every 2.5 seconds
        const quotaInterval = setInterval(() => {
            fetchQuota();
            setAnimationOffset((prev) => (prev + 20) % 40);
        }, 2500);

        return () => {
            clearInterval(timeInterval);
            clearInterval(quotaInterval);
        };
    }, []);

    // Safe Client Hydration Fence for localStorage matrix telemetry
    useEffect(() => {
        if (typeof window !== "undefined") {
            const loadMatrices = () => {
                const stored = localStorage.getItem("calyx_active_matrices");
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setMatrices(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse active matrices:", e);
                    }
                }
            };

            loadMatrices();

            const loadCanvasNodes = () => {
                const storedNodes = localStorage.getItem("calyx_canvas_nodes");
                if (storedNodes) {
                    try {
                        const parsed = JSON.parse(storedNodes);
                        if (Array.isArray(parsed)) {
                            const nodeCount = parsed.length;
                            setMatrices((prev) =>
                                prev.map((m) =>
                                    m.name === "Alpha-Gen Neural Node"
                                        ? { ...m, nodes: nodeCount }
                                        : m
                                )
                            );
                        }
                    } catch (e) {
                        console.error("Failed to parse calyx_canvas_nodes:", e);
                    }
                }
            };
            loadCanvasNodes();

            const handleDeploy = (e: Event) => {
                const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
                const payload = customEvent.detail;
                if (payload) {
                    setMatrices((prev) => {
                        const targetEndpoint = payload.matrixId === "Primary GitHub Portfolio"
                            ? "calyx-dev.calyx.nexus"
                            : `${payload.matrixId.split(" ")[0].toLowerCase()}.calyx.nexus`;

                        const existingIdx = prev.findIndex((m) => m.endpoint === targetEndpoint);

                        const newItem: MatrixItem = {
                            name: payload.matrixId,
                            endpoint: targetEndpoint,
                            nodes: payload.nodeCount,
                            syncTime: "Just now",
                            status: "ACTIVE"
                        };

                        if (existingIdx > -1) {
                            const updated = [...prev];
                            updated[existingIdx] = newItem;
                            return updated;
                        } else {
                            return [newItem, ...prev];
                        }
                    });
                }
            };

            window.addEventListener("calyx-matrix-deployed", handleDeploy);
            return () => {
                window.removeEventListener("calyx-matrix-deployed", handleDeploy);
            };
        }
    }, []);

    const apiBudgets = [
        {
            name: "GitHub REST API",
            used: quota.github.used,
            total: quota.github.total,
            percent: quota.github.total > 0 ? Math.min(100, Math.max(0, Math.round((quota.github.used / quota.github.total) * 100))) : 0,
            unit: "Requests",
            color: "#a855f7", // Purple
        },
        {
            name: "Vercel Edge Functions",
            used: quota.vercel.used,
            total: quota.vercel.total,
            percent: quota.vercel.total > 0 ? Math.min(100, Math.max(0, Math.round((quota.vercel.used / quota.vercel.total) * 100))) : 0,
            unit: "Invocations",
            color: "#06b6d4", // Cyan
        },
        {
            name: "Upstash Redis Storage",
            used: quota.redis.used,
            total: quota.redis.total,
            percent: quota.redis.total > 0 ? Math.min(100, Math.max(0, Math.round((quota.redis.used / quota.redis.total) * 100))) : 0,
            unit: "Commands",
            color: "#10b981", // Emerald
        },
    ];


    // Compute cubic bezier path commands for smooth curves
    const width = 600;
    const height = 150;
    const padding = 15;
    const maxVal = Math.max(...latencyPoints, 30);
    
    const getCoordinatesPath = () => {
        const step = (width - padding * 2) / (latencyPoints.length - 1);
        const points = latencyPoints.map((val, idx) => ({
            x: padding + idx * step,
            y: height - padding - (val / maxVal) * (height - padding * 2)
        }));

        if (points.length === 0) return "";
        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            // Compute control points for cubic Bezier interpolation curves
            const cpX1 = p0.x + (p1.x - p0.x) / 2;
            const cpY1 = p0.y;
            const cpX2 = p0.x + (p1.x - p0.x) / 2;
            const cpY2 = p1.y;

            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Feed */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(139,92,246,0.15)] pb-6 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                            Telemetry System / Core Hub
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        COMMAND INTERFACE
                    </h1>
                    <p className="text-xs font-mono text-zinc-400">
                        Real-time cluster mapping, caching thresholds, and system pipeline diagnostics.
                    </p>
                </div>

                {/* Status Console metadata */}
                <div className="bg-[#0b0a14] border border-[rgba(139,92,246,0.15)] rounded-md px-4 py-2.5 font-mono text-right flex flex-col justify-center min-w-[200px] shadow-sm">
                    <span className="text-[8px] text-zinc-500 tracking-wider">SYSTEM CLOCK TIMESTAMP</span>
                    <span className="text-xs text-purple-300 font-bold tracking-widest">
                        {currentTime || "CONNECTING..."}
                    </span>
                </div>
            </div>

            {/* Main Dashboard Layout Panel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Active Matrix Inventory (Left Column - 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                ACTIVE MATRIX INVENTORY
                            </h3>
                            <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded">
                                {matrices.length} Nodes Registered
                            </span>
                        </div>

                        <div className="divide-y divide-zinc-800/80 space-y-3 pt-2">
                            {matrices.map((matrix, idx) => (
                                <div
                                    key={matrix.name}
                                    className={`flex items-center justify-between pt-3 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-1 ${
                                        idx === 0 ? "" : "border-t border-zinc-800/60"
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                matrix.status === "ACTIVE" 
                                                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" 
                                                    : matrix.status === "PROCESSING"
                                                    ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-spin"
                                                    : "bg-zinc-600"
                                            }`} />
                                            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-tight">
                                                {matrix.name}
                                            </h4>
                                        </div>
                                        <div className="text-[10px] font-mono text-zinc-500">
                                            Domain Target:{" "}
                                            <span className="text-purple-400/80 hover:text-purple-400 transition cursor-pointer">
                                                {matrix.endpoint}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right font-mono">
                                            <div className="text-[9px] text-zinc-500">NODES</div>
                                            <div className="text-xs font-black text-zinc-300">
                                                {matrix.nodes} Layer Cards
                                            </div>
                                        </div>
                                        <div className="text-right font-mono">
                                            <div className="text-[9px] text-zinc-500">SYNCHRONIZED</div>
                                            <div className="text-xs text-zinc-400">
                                                {matrix.syncTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upstash Redis Latency Streaming Monitor */}
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                    UPSTASH REDIS LATENCY MONITOR
                                </h3>
                                <p className="text-[9px] font-mono text-zinc-500">
                                    Edge cache streaming queries measured via synchronous response loops.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded px-2.5 py-1 text-emerald-400 font-mono text-xs font-black">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>{liveLatency}ms LIVE</span>
                            </div>
                        </div>

                        {/* High-Fidelity SVG Graph */}
                        <div className="relative border border-zinc-800/80 bg-[#050508] rounded-md overflow-hidden p-2">
                            {/* Grid lines in backplane */}
                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-4 pointer-events-none opacity-20">
                                {Array.from({ length: 4 }).map((_, rIdx) => (
                                    <div
                                        key={rIdx}
                                        className="border-b border-purple-500/30 w-full"
                                        style={{ top: `${(rIdx + 1) * 25}%` }}
                                    />
                                ))}
                            </div>

                            <svg
                                viewBox={`0 0 ${width} ${height}`}
                                className="w-full h-[150px] overflow-visible"
                            >
                                {/* Area Gradient Fill */}
                                <defs>
                                    <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Area Path */}
                                <path
                                    d={`${getCoordinatesPath()} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
                                    fill="url(#glowGrad)"
                                    className="transition-all duration-500 ease-in-out"
                                />

                                {/* Latency Line */}
                                <path
                                    d={getCoordinatesPath()}
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-500 ease-in-out"
                                />

                                {/* Dynamic point indicator */}
                                {latencyPoints.map((val, idx) => {
                                    const step = (width - padding * 2) / (latencyPoints.length - 1);
                                    const cx = padding + idx * step;
                                    const cy = height - padding - (val / maxVal) * (height - padding * 2);
                                    const isLast = idx === latencyPoints.length - 1;

                                    return (
                                        <g key={idx}>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={isLast ? 4 : 2}
                                                fill={isLast ? "#c084fc" : "#a855f7"}
                                                className={isLast ? "animate-pulse" : ""}
                                            />
                                            {isLast && (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={8}
                                                    fill="none"
                                                    stroke="#c084fc"
                                                    strokeWidth="1.5"
                                                    className="animate-ping"
                                                />
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* API Budgets Indicators (Right Column - 5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                ACTIVE API BUDGET CONSUMPTION
                            </h3>
                            <p className="text-[9px] font-mono text-zinc-500">
                                Downstream API access caps mapping remaining availability quotas.
                            </p>
                        </div>

                        {/* Circle Gauges */}
                        <div className="grid grid-cols-1 gap-4">
                            {apiBudgets.map((budget) => {
                                const radius = 28;
                                const strokeWidth = 4;
                                const circumference = 2 * Math.PI * radius;
                                const strokeDashoffset = circumference - (budget.percent / 100) * circumference;

                                return (
                                    <div
                                        key={budget.name}
                                        className="bg-[#0b0a14] border border-[rgba(139,92,246,0.1)] rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-zinc-200 tracking-tight">
                                                {budget.name}
                                            </h4>
                                            <p className="text-[10px] font-mono text-zinc-500">
                                                Quotas:{" "}
                                                <span className="text-zinc-300 font-medium">
                                                    {budget.used.toLocaleString()} /{" "}
                                                    {budget.total.toLocaleString()}
                                                </span>{" "}
                                                {budget.unit}
                                            </p>
                                        </div>

                                        {/* SVG Circle Gauge */}
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r={radius}
                                                    stroke="#1e1b30"
                                                    strokeWidth={strokeWidth}
                                                    fill="transparent"
                                                />
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r={radius}
                                                    stroke={budget.color}
                                                    strokeWidth={strokeWidth}
                                                    fill="transparent"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            <div className="absolute text-[10px] font-mono font-bold text-zinc-200">
                                                {budget.percent}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
