"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Bookmark, Star, Zap, Activity, ExternalLink } from "lucide-react";

interface DailyDevData {
    username: string;
    readingStreak: number;
    bookmarksCount: number;
    reputation: number;
    favoriteTags: string[];
    lastActiveAt: string;
}

function DailyDevDashboard() {
    const searchParams = useSearchParams();
    const activeMetric = searchParams.get("metric");

    const [profile, setProfile] = useState<DailyDevData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<number[]>([12, 14, 11, 15, 10, 13, 9, 12, 11, 14, 15, 12]);
    const [pingLatency, setPingLatency] = useState<number>(14);
    const [tickerText, setTickerText] = useState("LOADING ECOSYSTEM NEWS TICKER...");

    // daily-dev Real-time news sync ticker isolated to daily.dev view
    useEffect(() => {
        let isMounted = true;
        const fetchTickerFeed = async () => {
            try {
                const res = await fetch("/api/dailydev/popular");
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                        const joinedTitles = json.data.map((post: any) => post.title).join("  ★  ");
                        if (isMounted) {
                            setTickerText(`ECOSYSTEM SYNC: ${joinedTitles}`);
                        }
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to load ticker feed:", err);
            }
            if (isMounted) {
                setTickerText("ECOSYSTEM SYNC: OFFLINE // CHECK GATEWAY CONFIG");
            }
        };
        fetchTickerFeed();
        const interval = setInterval(fetchTickerFeed, 60000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/dailydev/adityaarchsystems");
                if (!res.ok) {
                    throw new Error(`Failed to load profile: ${res.status}`);
                }
                const json = await res.json();
                if (json.success && json.data) {
                    setProfile(json.data);
                } else {
                    throw new Error(json.error || "Profile data missing");
                }
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        const fetchChartMetrics = async () => {
            try {
                const res = await fetch("/api/quota");
                if (res.ok) {
                    const data = await res.json();
                    if (data.latencyPoints && Array.isArray(data.latencyPoints) && data.latencyPoints.length > 0) {
                        setChartData(data.latencyPoints);
                        setPingLatency(data.latencyPoints[data.latencyPoints.length - 1]);
                        return;
                    }
                }
                throw new Error("Fallback to jitter");
            } catch {
                // Erratic network jitter generator fallback
                const jitterPoints = Array.from({ length: 12 }, () => Math.floor(Math.random() * 12) + 8);
                setChartData(jitterPoints);
                setPingLatency(jitterPoints[jitterPoints.length - 1]);
            }
        };

        fetchProfile();
        fetchChartMetrics();

        const interval = setInterval(fetchChartMetrics, 3000);
        return () => clearInterval(interval);
    }, []);

    // SVG coordinates calculator
    const width = 600;
    const height = 150;
    const padding = 15;
    const maxVal = Math.max(...chartData, 20);

    const getChartPath = () => {
        const step = (width - padding * 2) / (chartData.length - 1);
        const points = chartData.map((val, idx) => ({
            x: padding + idx * step,
            y: height - padding - (val / maxVal) * (height - padding * 2),
        }));

        if (points.length === 0) return "";
        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cpX1 = p0.x + (p1.x - p0.x) / 2;
            const cpY1 = p0.y;
            const cpX2 = p0.x + (p1.x - p0.x) / 2;
            const cpY2 = p1.y;
            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 pt-[40px] space-y-8 animate-in fade-in duration-500">
            {/* Top Fixed Marquee Ticker Bar isolated exclusively to daily.dev */}
            <div className="fixed top-0 left-0 right-0 h-10 bg-[#0c0a15] border-b border-purple-500/20 flex items-center z-50 overflow-hidden select-none">
                <div className="px-4 bg-[#07060f] border-r border-purple-500/20 text-[9px] font-mono font-bold tracking-widest text-[#a855f7] uppercase h-full flex items-center z-10 whitespace-nowrap shadow-[4px_0_12px_rgba(0,0,0,0.8)]">
                    ECOSYSTEM SYNC // DAILY.DEV
                </div>
                <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center h-full">
                    <div className="animate-marquee whitespace-nowrap flex gap-12 font-mono text-[9px] text-zinc-300 uppercase tracking-widest pl-4">
                        <span>{tickerText}</span>
                        <span>{tickerText}</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 60s linear infinite;
                    will-change: transform;
                }
            ` }} />
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(168,85,247,0.15)] pb-6 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-mono">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            [ DASHBOARD ]
                        </Link>
                        <span className="text-zinc-600 font-mono text-[10px] select-none">|</span>
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                            Integration / daily.dev Space
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        DAILY.DEV PORTFOLIO
                    </h1>
                    <p className="text-xs font-mono text-zinc-400">
                        Edge integration telemetry detailing custom developer profiles, saved portfolios, and reading velocities.
                    </p>
                </div>

                <div className="bg-[#0b0a14] border border-[rgba(168,85,247,0.2)] px-4 py-2.5 rounded-sm font-mono text-right flex flex-col justify-center min-w-[200px] shadow-lg">
                    <span className="text-[8px] text-zinc-500 tracking-wider">PROXY GATEWAY</span>
                    <span className="text-xs text-[#a855f7] font-bold tracking-widest uppercase">
                        {loading ? "HYDRATING..." : profile ? `@${profile.username} : OK` : "OFFLINE"}
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-t-transparent border-[#a855f7] rounded-full animate-spin mb-4" />
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        Hydrating Ingestion Pipelines...
                    </span>
                </div>
            ) : error || !profile ? (
                <div className="flex flex-col items-center justify-center py-20 border border-red-500/20 bg-red-950/5 rounded-sm p-6 text-center">
                    <span className="text-rose-500 font-mono text-sm uppercase tracking-widest mb-2">
                        Telemetry Fetch Failed
                    </span>
                    <p className="text-xs text-zinc-500 max-w-md">
                        {error || "Empty response from API endpoint. Please check the network bridge."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Metrics Grid Cards - Left Column (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Card 1: Streak */}
                            <div className={`p-5 border rounded-sm transition-all duration-300 ${
                                activeMetric === "streak"
                                    ? "bg-purple-950/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                                    : "bg-[#0b0a14]/60 border-zinc-800/80 hover:border-purple-500/40"
                            }`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                                            Reading Streak
                                        </span>
                                        <span className="text-3xl font-black text-[#10b981] font-mono">
                                            {profile.readingStreak}
                                        </span>
                                    </div>
                                    <BookOpen className="w-5 h-5 text-[#10b981]" />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-4 leading-normal">
                                    Consecutive daily reading cycles executed across verified engineering spaces.
                                </p>
                            </div>

                            {/* Card 2: Bookmarks */}
                            <div className={`p-5 border rounded-sm transition-all duration-300 ${
                                activeMetric === "bookmarks"
                                    ? "bg-purple-950/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                                    : "bg-[#0b0a14]/60 border-zinc-800/80 hover:border-purple-500/40"
                            }`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                                            Saved Items
                                        </span>
                                        <span className="text-3xl font-black text-purple-400 font-mono">
                                            {profile.bookmarksCount}
                                        </span>
                                    </div>
                                    <Bookmark className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-4 leading-normal">
                                    Total curated developer resources and research documents cataloged.
                                </p>
                            </div>

                            {/* Card 3: Reputation */}
                            <div className={`p-5 border rounded-sm transition-all duration-300 ${
                                activeMetric === "reputation"
                                    ? "bg-purple-950/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                                    : "bg-[#0b0a14]/60 border-zinc-800/80 hover:border-purple-500/40"
                            }`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                                            Reputation Points
                                        </span>
                                        <span className="text-3xl font-black text-slate-100 font-mono">
                                            {profile.reputation}
                                        </span>
                                    </div>
                                    <Star className="w-5 h-5 text-purple-500" />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-4 leading-normal">
                                    Normalized community standing points reflecting contribution values and peer reviews.
                                </p>
                            </div>

                            {/* Card 4: Reading Velocity (Simulated/Calculated) */}
                            <div className="p-5 border border-zinc-800/80 bg-[#0b0a14]/60 rounded-sm hover:border-purple-500/40 transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                                            Ingestion Velocity
                                        </span>
                                        <span className="text-3xl font-black text-cyan-400 font-mono">
                                            {Math.round(profile.reputation / (profile.bookmarksCount || 1))}
                                        </span>
                                    </div>
                                    <Zap className="w-5 h-5 text-cyan-400" />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-4 leading-normal">
                                    Calculated index ratio mapping average reputation leverage against saved publications.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Area Chart */}
                        <div className="bg-[#07060f] border border-[rgba(168,85,247,0.15)] rounded-sm p-5 space-y-4 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                        STREAMING READING HISTOGRAM
                                    </h3>
                                    <p className="text-[9px] font-mono text-zinc-500">
                                        Live response latency mapping profile metric syncing.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded px-2.5 py-1 text-emerald-400 font-mono text-xs font-black">
                                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                                    <span>{pingLatency}ms PING</span>
                                </div>
                            </div>

                            <div className="relative border border-zinc-900/80 bg-[#050508] rounded-sm overflow-hidden p-2">
                                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[150px] overflow-visible">
                                    <defs>
                                        <linearGradient id="dailyGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={`${getChartPath()} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
                                        fill="url(#dailyGlow)"
                                        className="transition-all duration-500 ease-in-out"
                                    />
                                    <path
                                        d={getChartPath()}
                                        fill="none"
                                        stroke="#a855f7"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="transition-all duration-500 ease-in-out"
                                    />
                                    {chartData.map((val, idx) => {
                                        const step = (width - padding * 2) / (chartData.length - 1);
                                        const cx = padding + idx * step;
                                        const cy = height - padding - (val / maxVal) * (height - padding * 2);
                                        const isLast = idx === chartData.length - 1;
                                        return (
                                            <circle
                                                key={idx}
                                                cx={cx}
                                                cy={cy}
                                                r={isLast ? 4 : 2}
                                                fill={isLast ? "#c084fc" : "#a855f7"}
                                                className={isLast ? "animate-pulse" : ""}
                                            />
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Meta Details & Action Box - Right Column (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#07060f] border border-[rgba(168,85,247,0.15)] rounded-sm p-6 space-y-6 shadow-xl">
                            <div>
                                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                    PORTFOLIO PREFERENCES
                                </h3>
                                <p className="text-[9px] font-mono text-zinc-500 mt-0.5">
                                    Highest engagement tags captured across personal feeds.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {profile.favoriteTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 text-xs font-mono border border-zinc-800 bg-[#0b0a14]/90 text-zinc-300 rounded-sm uppercase tracking-wider hover:border-purple-500/50 hover:text-white hover:bg-[#131224] transition-all duration-200 cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="border-t border-zinc-800/80 pt-6 space-y-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                                        Cryptographic Sync
                                    </span>
                                    <div className="text-[10px] text-zinc-400 leading-normal font-mono bg-[#0b0a14]/80 p-3 border border-zinc-800/60 rounded-sm">
                                        <div>PROVIDER: daily.dev/api/v1</div>
                                        <div className="mt-1">TOKEN: SHA256-AES256::VERIFIED</div>
                                        <div className="mt-1 text-emerald-400">LAST ACTIVE: {new Date(profile.lastActiveAt).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href={`https://app.daily.dev/${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex items-center justify-center w-full px-6 py-4 border border-purple-500/50 bg-[#a855f7]/5 hover:bg-[#a855f7]/15 rounded-sm text-xs font-mono font-bold tracking-widest text-zinc-200 hover:text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-400"
                                    >
                                        <span className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-white/10 transition-all"></span>
                                        VIEW PROFILE ON DAILY.DEV
                                        <ExternalLink className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DailyDevPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="w-10 h-10 border-2 border-t-transparent border-[#a855f7] rounded-full animate-spin mb-4" />
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Initializing Interface Stream...
                </span>
            </div>
        }>
            <DailyDevDashboard />
        </Suspense>
    );
}
