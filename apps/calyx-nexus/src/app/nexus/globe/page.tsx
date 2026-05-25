'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ImpactGlobe = dynamic(() => import('@/components/impact-globe'), { ssr: false });

interface LogLine {
    label?: string;
    content: string;
    type?: 'ROOT' | 'ARC' | 'COMMENT';
}

export default function ImpactGlobeTerminal() {
    const [logs, setLogs] = useState<LogLine[]>([
        { content: "// Mapping geospatial coordinates for Aditya Sharma...", type: 'COMMENT' },
        { label: "Root", content: "IND-Node-Bhilai [21.1926 N, 81.3509 E]", type: 'ROOT' },
        { label: "Arc.01", content: "Bhilai -> Mumbai (Inference Sync) ... OK", type: 'ARC' },
        { label: "Arc.02", content: "Mumbai -> Iowa (Folio-Beta Deployment) ... OK", type: 'ARC' },
        { label: "Arc.03", content: "Iowa -> Frankfurt (GDV Global Vault) ... OK", type: 'ARC' },
    ]);

    useEffect(() => {
        const presetLogs: LogLine[] = [
            { label: "Arc.04", content: "Frankfurt -> Tokyo (Distributed Cache Sync) ... OK", type: 'ARC' },
            { label: "Telemetry", content: "Ping IND-Node-01 [latency: 18ms] ... OK", type: 'ARC' },
            { label: "Buffer", content: "Flushing local siphons ... 12 keys evicted", type: 'ARC' },
            { label: "Sync", content: "Encryption keys rotated successfully.", type: 'ARC' },
            { label: "Arc.05", content: "Tokyo -> Bhilai (Feedback Loop Verified) ... OK", type: 'ARC' },
            { label: "Security", content: "Supabase Session Token Verified cleanly.", type: 'ARC' },
            { label: "Telemetry", content: "CPU Temperature IND-Node-02: 44.5 C", type: 'ARC' },
            { label: "Telemetry", content: "Memory Alloc Mumbai Cluster: 62% in use", type: 'ARC' },
        ];

        let index = 0;
        const interval = setInterval(() => {
            const nextLog = presetLogs[index % presetLogs.length];
            setLogs((prev) => {
                const updated = [...prev, nextLog];
                if (updated.length > 15) {
                    return [updated[0], updated[1], ...updated.slice(updated.length - 13)];
                }
                return updated;
            });
            index++;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {/* Spinning WebGL Globe Backdrop */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <ImpactGlobe />
            </div>

            {/* HEADER: Geospatial Telemetry */}
            <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6 relative z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-slate-200 uppercase">Impact Globe / Geospatial</h1>
                        <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
                            WebGL-powered geospatial visualization. Mapping global open-source influence and regional node health for Calyx Studios.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--calyx-accent)]/10 border border-[var(--calyx-accent)]/30 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-ping absolute"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] relative"></span>
                        <span className="text-[10px] font-mono tracking-widest text-[var(--calyx-accent)] uppercase ml-1">Globe Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Global Nodes</span>
                        <span className="text-[11px] font-mono text-slate-300 uppercase">04 Active Regions</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Root Authority</span>
                        <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">IND-Node (Bhilai)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Cross-Border Arc</span>
                        <span className="text-[11px] font-mono text-slate-300 uppercase">12,400 KM Total</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Sync Status</span>
                        <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px] relative z-10">
                
                <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Regional Node Authority
                    </span>

                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-slate-950/80 border border-slate-700/50 rounded-sm relative group overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--calyx-accent)]"></div>
                            <div className="flex justify-between items-start mb-2 ml-2">
                                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">IND-Node-01</span>
                                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">Primary Root</span>
                            </div>
                            <div className="flex flex-col gap-1 ml-2 text-[10px] font-mono text-slate-500 uppercase">
                                <span>Location: Bhilai, Chhattisgarh</span>
                                <span>Status: Master Identity Lock Active</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950/40 border border-slate-800/50 rounded-sm relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--calyx-accent)]/50"></div>
                            <div className="flex justify-between items-start mb-2 ml-2">
                                <span className="text-[12px] font-mono font-medium text-slate-300 uppercase">IND-Node-02</span>
                                <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase">Inference Gateway</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 ml-2 uppercase">Mumbai Cluster • Latency: 22ms</span>
                        </div>

                        <div className="p-4 bg-slate-950/30 border border-slate-800/30 border-dashed rounded-sm relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700"></div>
                            <div className="flex justify-between items-start mb-2 ml-2">
                                <span className="text-[12px] font-mono font-medium text-slate-500 uppercase">Cloud-Arc-Global</span>
                                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase">Iowa / Frankfurt</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 ml-2 italic uppercase">Routing GCP traffic via US/EU node-pools...</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-7 flex flex-col p-0 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div className="w-80 h-80 rounded-full border border-slate-800/50 relative animate-[spin_60s_linear_infinite]">
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#070e16_100%)]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-slate-800/30"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-slate-800/30"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50 relative z-10">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Global Influence Matrix</span>
                        <span className="text-[9px] font-mono tracking-wider text-[var(--calyx-accent)] uppercase">Real-Time Arcs Active</span>
                    </div>
                    
                    <div className="flex flex-col h-full pt-16 px-6 pb-6 font-mono text-[11px] leading-relaxed overflow-y-auto z-10 custom-scrollbar">
                        {logs.map((log, i) => {
                            if (log.type === 'COMMENT') {
                                return (
                                    <div key={i} className="text-slate-600 mb-4 uppercase">
                                        {log.content}
                                    </div>
                                );
                            }
                            if (log.type === 'ROOT') {
                                return (
                                    <div key={i} className="flex gap-4 mb-2">
                                        <span className="text-[var(--calyx-accent)] uppercase">{log.label}</span>
                                        <span className="text-slate-300 uppercase">{log.content}</span>
                                    </div>
                                );
                            }
                            return (
                                <div key={i} className="flex gap-4 opacity-70 uppercase mb-1">
                                    <span className="text-slate-600 w-16 shrink-0">{log.label}</span>
                                    <span className="text-slate-400">{log.content}</span>
                                </div>
                            );
                        })}
                        
                        <div className="mt-auto flex items-center pt-4 border-t border-slate-800/50">
                            <span className="text-[var(--calyx-accent)] font-bold uppercase">{`geospatial.engine> `}</span>
                            <span className="w-1.5 h-3 bg-[var(--calyx-accent)] ml-2 animate-pulse"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

