"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DesignStudioModule() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
            setCurrentTime(timeStr);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full relative flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
            {/* Micro-Canvas Layout Blueprint Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />

            {/* Header Title */}
            <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#a855f7]/85 uppercase">
                        MODULE 03
                    </span>
                    <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                    CENTRAL CONTROL DECK
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono leading-normal">
                    Industrial routing & node deployment metrics.
                </p>
            </div>

            {/* HIGH-DENSITY SUB-SYSTEM TELEMETRY ROWS */}
            <div className="relative z-10 space-y-3 my-4 flex-grow flex flex-col justify-center">
                {/* Row 1: CLUSTER COMMAND HUB */}
                <div
                    onClick={() => router.push("/dashboard")}
                    className="group border border-zinc-800 bg-[#06050a]/90 hover:border-[#a855f7]/40 hover:bg-[#0c0a15] rounded-md p-3.5 flex items-center justify-between shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                            CLUSTER COMMAND HUB
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate">
                            SYS.NODES: 04 // LATENCY: 12ms // ENV: GCP RUN
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <span className="text-[9px] font-mono text-[#10b981] group-hover:text-emerald-400 transition-colors uppercase font-bold">
                            ACTIVE
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    </div>
                </div>

                {/* Row 4: EDGE INGESTION ANALYTICS */}
                <div
                    onClick={() => router.push("/analytics")}
                    className="group border border-zinc-800 bg-[#06050a]/90 hover:border-[#a855f7]/40 hover:bg-[#0c0a15] rounded-md p-3.5 flex items-center justify-between shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                            EDGE INGESTION ANALYTICS
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate">
                            CACHE_HIT: 94.2% // RTT: 42ms // SOURCE: daily.dev
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <span className="text-[9px] font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase font-bold">
                            SYNCED
                        </span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                </div>

                {/* Row 3: WEBHOOK ROUTING SUITE */}
                <div
                    onClick={() => router.push("/integrations")}
                    className="group border border-zinc-800 bg-[#06050a]/90 hover:border-[#a855f7]/40 hover:bg-[#0c0a15] rounded-md p-3.5 flex items-center justify-between shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                            WEBHOOK ROUTING SUITE
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate">
                            SSL: ACTIVE (242d) // LEDGER_CLOCK: {currentTime || "--:--:--"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                        <span className="text-[9px] font-mono text-amber-500 group-hover:text-amber-400 transition-colors uppercase font-bold">
                            SECURE
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Telemetry Footer Info */}
            <div className="relative z-10 flex items-center justify-between w-full pt-4 border-t border-zinc-800/40">
                <span className="text-[9px] font-mono text-zinc-500">
                    ANTIGRAVITY v2.0
                </span>
            </div>
        </div>
    );
}
