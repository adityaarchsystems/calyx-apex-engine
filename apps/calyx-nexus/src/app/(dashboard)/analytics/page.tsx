"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { LineChart as ChartIcon, Eye, ArrowUpRight, CheckCircle2, Hourglass, Zap } from "lucide-react";
import { CalyxMatrixDeploymentPayload } from "@cpm/types";

interface DataPoint {
    time: string;
    views: number;
    requests: number;
    latency: number;
    x: number; // SVG coordinate
    y: number; // SVG coordinate
}

export default function AnalyticsDashboard() {
    const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const [latencyPoints, setLatencyPoints] = useState<number[]>([12, 14, 11, 15, 10, 13, 9, 12, 11, 14, 15, 12]);

    useEffect(() => {
        const fetchLatency = async () => {
            try {
                const res = await fetch("/api/analytics/history");
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.latencyPoints) && data.latencyPoints.length > 0) {
                        const coercedPoints = data.latencyPoints.map((val: any) => parseFloat(val) || 0.0);
                        setLatencyPoints(coercedPoints);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch latency data from /api/analytics/history:", e);
            }
        };

        fetchLatency();
        const interval = setInterval(fetchLatency, 2500);

        const handleDeploy = (e: Event) => {
            const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
            const payload = customEvent.detail;
            if (payload && typeof payload.latencyDelta === "number") {
                setLatencyPoints((prev) => [...prev.slice(-11), payload.latencyDelta]);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("calyx-matrix-deployed", handleDeploy);
        }

        return () => {
            clearInterval(interval);
            if (typeof window !== "undefined") {
                window.removeEventListener("calyx-matrix-deployed", handleDeploy);
            }
        };
    }, []);

    const [liveMetrics, setLiveMetrics] = useState({
        pageViews: "28,500",
        renderRequests: "41,000",
        cacheHitRate: "99.4%",
        avgLatency: "12.1ms"
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch("/api/analytics/history");
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.success && data.metrics) {
                        const views = parseInt(data.metrics.pageViews, 10) || 0;
                        const requests = parseInt(data.metrics.renderRequests, 10) || 0;
                        const hitRate = parseFloat(data.metrics.cacheHitRate) || 0.0;
                        const latency = parseFloat(data.metrics.avgLatency) || 0.0;

                        setLiveMetrics({
                            pageViews: views.toLocaleString(),
                            renderRequests: requests.toLocaleString(),
                            cacheHitRate: `${hitRate.toFixed(1)}%`,
                            avgLatency: `${latency.toFixed(1)}ms`
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load live metrics:", err);
            }
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    const maxVal = 20;
    const width = 700;
    const height = 240;
    const paddingX = 50;
    const paddingY = 40;

    // 1440px-optimized Data Coordinates Matrix derived from reactive state
    const dataPoints: DataPoint[] = useMemo(() => {
        const step = (width - paddingX * 2) / (latencyPoints.length - 1 || 1);
        return latencyPoints.map((val, idx) => {
            const timeStr = `${String(idx * 2).padStart(2, "0")}:00`;
            const x = paddingX + idx * step;
            const y = height - paddingY - (val / maxVal) * (height - paddingY * 2);
            return {
                time: timeStr,
                views: val * 350 + Math.floor((idx * 73) % 200),
                requests: val * 550 + Math.floor((idx * 97) % 300),
                latency: val,
                x,
                y
            };
        });
    }, [latencyPoints]);

    const metrics = [
        {
            name: "Profile Page Views",
            value: liveMetrics.pageViews,
            delta: "+12.4%",
            icon: Eye,
            description: "Aggregate external visits across profile matrices.",
            color: "text-purple-400",
            bg: "bg-purple-500/5 border-purple-500/10",
        },
        {
            name: "Widget Render Requests",
            value: liveMetrics.renderRequests,
            delta: "+8.2%",
            icon: Zap,
            description: "Live widget compilation queries dispatched.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/5 border-cyan-500/10",
        },
        {
            name: "Edge Cache Hit Rate",
            value: liveMetrics.cacheHitRate,
            delta: "Optimal",
            icon: CheckCircle2,
            description: "Upstash edge key/value hits capture ratio.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/5 border-emerald-500/10",
        },
        {
            name: "Server Compile Latency",
            value: liveMetrics.avgLatency,
            delta: "-1.8ms",
            icon: Hourglass,
            description: "Average latency during synchronous SSR builds.",
            color: "text-amber-400",
            bg: "bg-amber-500/5 border-amber-500/10",
        },
    ];

    // Compute cubic bezier path commands for smooth curves
    const getBezierPath = (points: DataPoint[]) => {
        if (points.length === 0) return "";
        let path = `M ${points[0].x} ${points[0].y}`;
        
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            // Compute control points for cubic Bezier
            const cpX1 = p0.x + (p1.x - p0.x) / 2;
            const cpY1 = p0.y;
            const cpX2 = p0.x + (p1.x - p0.x) / 2;
            const cpY2 = p1.y;
            
            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!containerRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Translate client position to SVG viewBox coordinates (width: 700, height: 240)
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const svgX = (clientX / rect.width) * 700;

        // Find closest point by x coordinate
        let closest = dataPoints[0];
        let minDist = Math.abs(dataPoints[0].x - svgX);
        
        for (let i = 1; i < dataPoints.length; i++) {
            const dist = Math.abs(dataPoints[i].x - svgX);
            if (dist < minDist) {
                minDist = dist;
                closest = dataPoints[i];
            }
        }

        // Limit tracking distance
        if (minDist < 60) {
            setHoveredPoint(closest);
            // Project relative position back to screen for absolute tooltip placement
            const projectedX = (closest.x / 700) * rect.width;
            const projectedY = (closest.y / 240) * rect.height;
            setTooltipPos({ x: projectedX, y: projectedY });
        } else {
            setHoveredPoint(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="flex flex-col border-b border-[rgba(139,92,246,0.15)] pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <ChartIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                        Analytics Engine / Telemetry Feed
                    </span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                    EDGE INGESTION ANALYTICS
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                    Statistical telemetry parsing edge node requests, caching efficiency ratios, and compiler latency parameters.
                </p>
            </div>

            {/* Metrics Counters Grid (4 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div
                            key={metric.name}
                            className={`p-5 rounded-lg border ${metric.bg} flex flex-col justify-between h-[130px] shadow-sm relative group overflow-hidden`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest block">
                                        {metric.name}
                                    </span>
                                    <span className="text-2xl font-black text-zinc-100 tracking-tight font-mono">
                                        {metric.value}
                                    </span>
                                </div>
                                <div className={`p-2 rounded bg-zinc-950 border border-zinc-800 ${metric.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 mt-2">
                                <span className="text-[9.5px] text-zinc-500 font-sans leading-tight max-w-[150px]">
                                    {metric.description}
                                </span>
                                <div className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-400">
                                    <span>{metric.delta}</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Interactive Bezier Area Graph Section */}
            <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-6 space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                <div>
                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                        CUBIC BEZIER RENDER LATENCY CURVE
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        Interactive precision vector mapping. Hover over curve nodes to verify telemetry intercepts.
                    </p>
                </div>

                <div 
                    ref={containerRef} 
                    className="relative border border-zinc-800/80 bg-[#050508] rounded-md p-4 overflow-visible"
                >
                    {/* SVG Graphic with mouse-tracking events */}
                    <svg
                        viewBox="0 0 700 240"
                        className="w-full h-[240px] overflow-visible cursor-crosshair select-none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Chart Grid Lines */}
                        {Array.from({ length: 5 }).map((_, idx) => {
                            const y = 30 + idx * 45;
                            return (
                                <line
                                    key={idx}
                                    x1="40"
                                    y1={y}
                                    x2="660"
                                    y2={y}
                                    stroke="rgba(139,92,246,0.06)"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Bezier Path Area Fill */}
                        <path
                            d={`${getBezierPath(dataPoints)} L 650 210 L 50 210 Z`}
                            fill="url(#areaGrad)"
                        />

                        {/* Bezier Path Line */}
                        <path
                            d={getBezierPath(dataPoints)}
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Render nodes */}
                        {dataPoints.map((pt, idx) => {
                            const isHovered = hoveredPoint?.time === pt.time;
                            return (
                                <g key={idx}>
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 6 : 3.5}
                                        fill={isHovered ? "#d8b4fe" : "#050508"}
                                        stroke={isHovered ? "#a855f7" : "#8b5cf6"}
                                        strokeWidth={isHovered ? 2.5 : 2}
                                        className="transition-all duration-150"
                                    />
                                    {isHovered && (
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={12}
                                            fill="none"
                                            stroke="#a855f7"
                                            strokeWidth="1"
                                            strokeDasharray="2,2"
                                            className="animate-spin"
                                            style={{ animationDuration: "3s" }}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* X Axis Labels */}
                        {dataPoints.map((pt, idx) => (
                            <text
                                key={idx}
                                x={pt.x}
                                y="225"
                                fill="#4b5563"
                                className="text-[9px] font-mono font-bold uppercase tracking-wider"
                                textAnchor="middle"
                            >
                                {pt.time}
                            </text>
                        ))}
                    </svg>

                    {/* Interactive Intersection Hover Tooltip overlay */}
                    {hoveredPoint && (
                        <div
                            className="absolute pointer-events-none z-20 bg-[#0c0a15] border border-purple-500/30 rounded-md p-3.5 shadow-[0_10px_25px_rgba(139,92,246,0.15)] flex flex-col gap-1.5 min-w-[155px] -translate-x-1/2 -translate-y-26 transition-all duration-75 ease-out"
                            style={{
                                left: `${tooltipPos.x}px`,
                                top: `${tooltipPos.y}px`,
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                                    SYNC WINDOW: {hoveredPoint.time}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-zinc-400">RENDER LATENCY</span>
                                    <span className="text-purple-400 font-extrabold">{hoveredPoint.latency.toFixed(1)}ms</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
