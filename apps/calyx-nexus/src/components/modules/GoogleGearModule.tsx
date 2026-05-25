"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GoogleGearModule({ isEmbed = false }: { isEmbed?: boolean } = {}) {
    const router = useRouter();

    const content = (
        <>
            {/* Header Physics */}
            {!isEmbed && (
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-calyx-slate uppercase">MODULE 04</span>
                    <div className="w-1.5 h-1.5 bg-[var(--calyx-accent)]/40 group-hover:bg-[var(--calyx-accent)] transition-colors duration-300"></div>
                </div>
            )}
            
            {/* Title Typography */}
            <div className="mb-2">
                <h2 className="text-xl font-medium tracking-tight text-slate-200 uppercase">Google Developer Ecosystem</h2>
            </div>

            {/* Internal Dual-Pane Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 w-full h-full">
                {/* PANE 1: GDP Identity Node (5 Columns) */}
                <div className="col-span-1 lg:col-span-5 flex flex-col h-full">
                    {/* Node 1 (Verification) -> /nexus/vault */}
                    <Link 
                        href="/nexus/vault"
                        className="w-full bg-slate-900/60 border border-slate-700/30 rounded-sm p-4 relative overflow-hidden flex-grow flex flex-col justify-between group/node transition-all duration-300 hover:bg-slate-800/60 hover:border-[var(--calyx-accent)]/40 hover:shadow-[0_0_20px_rgba(200,241,53,0.05)]"
                    >
                        {/* Ambient Glow Ignition */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--calyx-accent)]/10 rounded-full blur-2xl transition-all duration-500 group-hover/node:blur-3xl group-hover/node:bg-[var(--calyx-accent)]/20"></div>
                        
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Verification</span>
                                <span className="text-[9px] font-mono tracking-wider text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-2 py-[2px] rounded-sm uppercase group-hover/node:bg-[var(--calyx-accent)] group-hover/node:text-black transition-all">Active</span>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-[14px] font-medium tracking-tight text-slate-200 group-hover/node:text-white transition-colors">Google Developer Program</span>
                                <span className="text-[11px] font-mono text-slate-400 group-hover/node:text-[var(--calyx-accent)] transition-colors">Level 2 Contributor</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-6 relative z-10">
                            <div className="flex justify-between items-center border-t border-slate-800/50 pt-3">
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Region</span>
                                <span className="text-[10px] font-mono text-slate-300 uppercase">IND-Node (Bhilai)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase group-hover/node:text-slate-400">Hash</span>
                                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px] sensitive-data group-hover/node:text-slate-400 transition-colors">0x7F...3B9A</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* PANE 2: Cloud Telemetry Matrix (7 Columns) */}
                <div className="col-span-1 lg:col-span-7 flex flex-col h-full">
                    {/* Infrastructure Readout */}
                    <div className="flex flex-col w-full h-full justify-between">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-4">Live Infrastructure</span>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Node 2: GCP Cloud Run -> /nexus/cloud-run */}
                            <Link 
                                href="/nexus/cloud-run"
                                className="flex flex-col gap-1.5 p-3 border border-slate-800/50 bg-slate-900/20 rounded-sm group/subnode transition-all duration-200 hover:-translate-y-[2px] hover:bg-slate-800/40 hover:border-slate-600/80 hover:shadow-lg hover:shadow-black/50"
                            >
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase group-hover/subnode:text-slate-400">GCP Cloud Run</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                                    <span className="text-[11px] font-mono font-medium text-slate-300 uppercase group-hover/subnode:text-[var(--calyx-accent)] transition-colors">99.9% Uptime</span>
                                </div>
                            </Link>
                            
                            {/* Node 3: Vertex AI -> /nexus/vertex */}
                            <Link 
                                href="/nexus/vertex"
                                className="flex flex-col gap-1.5 p-3 border border-slate-800/50 bg-slate-900/20 rounded-sm group/subnode transition-all duration-200 hover:-translate-y-[2px] hover:bg-slate-800/40 hover:border-slate-600/80 hover:shadow-lg hover:shadow-black/50"
                            >
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase group-hover/subnode:text-slate-400">Vertex AI</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                                    <span className="text-[11px] font-mono font-medium text-slate-300 uppercase group-hover/subnode:text-[var(--calyx-accent)] transition-colors">Model Synced</span>
                                </div>
                            </Link>

                            {/* Node 4: GEAR ADK -> /nexus/gear */}
                            <Link 
                                href="/nexus/gear"
                                className="flex flex-col gap-1.5 p-3 border border-slate-800/50 bg-slate-900/20 rounded-sm group/subnode transition-all duration-200 hover:-translate-y-[2px] hover:bg-slate-800/40 hover:border-slate-600/80 hover:shadow-lg hover:shadow-black/50"
                            >
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase group-hover/subnode:text-slate-400">GEAR ADK</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    <span className="text-[11px] font-mono font-medium text-slate-300 uppercase group-hover/subnode:text-amber-400 transition-colors">Standby (Idle)</span>
                                </div>
                            </Link>

                            {/* Node 5: Kubernetes (Offline) */}
                            <div className="flex flex-col gap-1.5 p-3 border border-slate-800/50 bg-slate-900/20 rounded-sm opacity-50 cursor-not-allowed">
                                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Kubernetes Engine</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase">Offline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        <div className="relative flex flex-col h-full p-6 border border-calyx-border/30 bg-calyx-bg overflow-hidden group rounded-sm">
            {content}
        </div>
    );
}
