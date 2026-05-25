"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function InfrastructureHub() {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-full relative flex flex-col justify-between border border-calyx-border/30 bg-calyx-bg rounded-sm p-6 sm:p-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-slate-800 rounded-sm" />
                    <div className="h-2 w-2 bg-slate-800 rounded-sm" />
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="h-8 w-8 border-2 border-t-transparent border-purple-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative flex flex-col justify-between border border-calyx-border/30 bg-calyx-bg rounded-sm p-6 sm:p-8 group overflow-hidden">
            {/* Header Block with brand accent */}
            <div className="flex items-center justify-between mb-4 z-20">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a855f7] rounded-sm"></span>
                    <span className="text-xs font-mono font-bold tracking-widest text-[#a855f7] uppercase">
                        INFRASTRUCTURE HUB
                    </span>
                </div>
                <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            </div>

            {/* Split Content Columns (Hugging Face / Google Developer) */}
            <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-2 min-h-0">
                {/* Left Section: Hugging Face Hub Developer Profile */}
                <Link
                    href="/nexus/compute"
                    className="flex flex-col justify-between h-full bg-[#050409]/60 border border-zinc-800/60 rounded-sm p-4 relative overflow-hidden group/hf hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                >
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl transition-all duration-500 group-hover/hf:bg-purple-500/10"></div>
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest font-mono">
                                Hugging Face Hub
                            </h4>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-400"></span>
                                </span>
                                <span className="text-[8px] font-mono tracking-widest text-purple-300 uppercase">Active</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono leading-normal">
                            Model downloads, Space analytics & client inference endpoints.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Engine</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">Gemma-4-e2b</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Format</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">Int4 Mobile</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Context</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">8192 Tokens</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Throughput</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">~120 T/S</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/60 mt-3 relative z-10 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">MODEL REGISTRY</span>
                        <div className="text-[9px] font-mono font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                            <span>HF Metrics ↗</span>
                        </div>
                    </div>
                </Link>

                {/* Right Section: Google Developer Program Badges */}
                <Link
                    href="/nexus/vault"
                    className="flex flex-col justify-between h-full bg-[#050409]/60 border border-zinc-800/60 rounded-sm p-4 relative overflow-hidden group/gdp hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                >
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl transition-all duration-500 group-hover/gdp:bg-emerald-500/10"></div>
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest font-mono">
                                Google Developer
                            </h4>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                                </span>
                                <span className="text-[8px] font-mono tracking-widest text-emerald-300 uppercase">Verified</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono leading-normal">
                            Developer credentials & GCP platform orchestration status.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Role</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">L2 Contributor</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Region</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">IND-Node</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Signature</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300 truncate max-w-[90px]" title="0x7F...3B9A">0x7F...3B9A</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">Status</span>
                                <span className="text-[10px] font-mono font-medium text-slate-300">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/60 mt-3 relative z-10 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">GCP PLATFORM</span>
                        <div className="text-[9px] font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                            <span>GDP Badges ↗</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
