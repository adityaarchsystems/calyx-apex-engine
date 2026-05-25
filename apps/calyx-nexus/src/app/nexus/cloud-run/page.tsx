"use client";

import React, { useState, useEffect } from "react";

interface LogEntry {
    timestamp: string;
    severity: string;
    textPayload: string;
    logName: string;
}

interface ProjectMetrics {
    projectId: string;
    success: boolean;
    isAuthorized: boolean;
    projectStatus: string;
    activeRequests: number;
    requestHistory: number[];
    logs: LogEntry[];
}

interface GcpResponse {
    success: boolean;
    projects: Record<string, ProjectMetrics>;
}

export default function CloudRunTerminal() {
    const [metrics, setMetrics] = useState<GcpResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("omni-ad-vibe-spy");

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await fetch("/api/gcp/metrics");
                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                }
            } catch (e) {
                console.error("Failed to fetch GCP metrics:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    const projectMetrics = metrics?.projects?.[selectedProjectId];
    const requestHistory = projectMetrics?.requestHistory || [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
    const activeRequests = projectMetrics?.activeRequests !== undefined ? `${projectMetrics.activeRequests} req/min` : "LIVE_CALCULATING...";
    const projectStatus = projectMetrics?.projectStatus || "ROUTING";
    const logs = projectMetrics?.logs || [];

    const getStatusText = (projId: string) => {
        if (loading) return "HYDRATING...";
        const proj = metrics?.projects?.[projId];
        if (!proj) return "OFFLINE";
        if (!proj.isAuthorized) return "UNAUTHORIZED";
        return proj.success ? "STABLE / ONLINE" : "OFFLINE";
    };

    const getProjectDetail = (projId: string) => {
        switch (projId) {
            case "omni-ad-vibe-spy":
                return {
                    region: "us-central1 (Iowa) • Inference Gateway",
                    revisions: "03 DEPLOYED",
                    coldStart: "142ms (OPTIMIZED)",
                    vcpu: "2.0 vCPU / Instance",
                    memory: "1024 MiB / Instance"
                };
            case "flow-core":
                return {
                    region: "europe-west1 (Belgium) • Queue Pipeline",
                    revisions: "05 DEPLOYED",
                    coldStart: "89ms (CACHED)",
                    vcpu: "1.0 vCPU / Instance",
                    memory: "512 MiB / Instance"
                };
            case "recruiter-intel-engine":
            default:
                return {
                    region: "asia-east1 (Taiwan) • Cognitive Registry",
                    revisions: "02 DEPLOYED",
                    coldStart: "210ms (WARM)",
                    vcpu: "4.0 vCPU / Instance",
                    memory: "2048 MiB / Instance"
                };
        }
    };

    const selectedDetails = getProjectDetail(selectedProjectId);

    const projectList = [
        { id: "omni-ad-vibe-spy", name: "omni-ad-vibe-spy" },
        { id: "flow-core", name: "flow-core" },
        { id: "recruiter-intel-engine", name: "recruiter-intel-engine" }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEADER: Serverless Telemetry Loadout */}
            <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-slate-200 uppercase">GCP Cloud Run Engine</h1>
                        <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
                            Serverless container orchestration. Managing auto-scaling, revision traffic routing, and cold start telemetry.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--calyx-accent)]/10 border border-[var(--calyx-accent)]/30 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                        <span className="text-[10px] font-mono tracking-widest text-[var(--calyx-accent)] uppercase ml-1">
                            {projectStatus}
                        </span>
                    </div>
                </div>

                {/* Hardware/Container Telemetry Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Active Revisions</span>
                        <span className="text-[11px] font-mono text-slate-300">{selectedDetails.revisions}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Avg Cold Start</span>
                        <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">{selectedDetails.coldStart}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">CPU Allocation</span>
                        <span className="text-[11px] font-mono text-slate-300">{selectedDetails.vcpu}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Mem Allocation</span>
                        <span className="text-[11px] font-mono text-slate-300">{selectedDetails.memory}</span>
                    </div>
                </div>
            </div>

            {/* MAIN TERMINAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
                {/* PANE A: Active Container Deployments (5 Columns) */}
                <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm overflow-hidden">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                        Service Architecture
                    </span>

                    <div className="flex flex-col gap-4 h-full">
                        {projectList.map((proj) => {
                            const details = getProjectDetail(proj.id);
                            const isSelected = selectedProjectId === proj.id;
                            const isDenied = metrics?.projects?.[proj.id]?.isAuthorized === false;
                            
                            return (
                                <button
                                    key={proj.id}
                                    onClick={() => setSelectedProjectId(proj.id)}
                                    className={`flex flex-col p-4 rounded-sm relative group overflow-hidden text-left cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? "bg-slate-950/80 border border-slate-700/80 shadow-md" 
                                            : "bg-slate-950/30 border border-slate-805/30 hover:border-slate-800/80"
                                    }`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--calyx-accent)]"></div>}
                                    <div className="flex justify-between items-start mb-2 ml-2">
                                        <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">{proj.name}</span>
                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                            isSelected 
                                                ? "text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10" 
                                                : "text-slate-500 bg-slate-900"
                                        }`}>
                                            {isSelected ? "ACTIVE TRAFFIC" : "STANDBY"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 ml-2 mb-3 uppercase">
                                        {details.region}
                                    </span>
                                    <div className="flex items-center gap-2 ml-2 mt-auto pt-3 border-t border-slate-800/80 w-full">
                                        <span className="text-[9px] font-mono text-slate-500 uppercase">GCP Connection:</span>
                                        <span className={`text-[9px] font-mono uppercase ${
                                            isDenied ? "text-rose-500" : "text-slate-400"
                                        }`}>
                                            {getStatusText(proj.id)}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* PANE B: Traffic Routing & Health (7 Columns) */}
                <div className="col-span-1 md:col-span-7 flex flex-col p-0 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50 absolute top-0 w-full z-10">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Load Balancer Matrix ({selectedProjectId})</span>
                        <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Requests / Sec</span>
                    </div>

                    <div className="flex flex-col h-full pt-16 px-6 pb-6 gap-6">
                        {/* Traffic Visualization */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-mono text-slate-400 uppercase">Ingress Traffic Volume</span>
                                <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">
                                    {activeRequests}
                                </span>
                            </div>
                            <div className="flex items-end gap-1 h-24 border-b border-l border-slate-800/80 p-1">
                                {requestHistory.map((height, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 w-full rounded-t-sm transition-all duration-300 ${
                                            height > 85 ? "bg-[var(--calyx-accent)]/80" : "bg-[var(--calyx-accent)]/50 hover:bg-[var(--calyx-accent)]"
                                        }`}
                                        style={{ height: `${Math.min(100, Math.max(10, height))}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Load Balancer Terminal Log */}
                        <div className="flex-grow bg-slate-950/80 border border-slate-800/50 rounded-sm p-4 font-mono text-[10px] text-slate-500 flex flex-col gap-2 overflow-y-auto max-h-[220px]">
                            <div className="text-slate-600 mb-2">{`// HTTP_X_FORWARDED_FOR -> L7_LOAD_BALANCER (${selectedProjectId})`}</div>

                            {loading ? (
                                <div className="text-slate-600 animate-pulse">{`> Fetching real-time GCP Log Stream...`}</div>
                            ) : logs && logs.length > 0 ? (
                                logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-4 group hover:bg-slate-900/50 transition-colors">
                                        <span className="text-slate-600 shrink-0">
                                            {new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                                        </span>
                                        <span className={`shrink-0 ${
                                            log.severity === "ERROR" ? "text-rose-500" : log.severity === "WARNING" ? "text-amber-500" : "text-emerald-500"
                                        }`}>
                                            [{log.severity}]
                                        </span>
                                        <span className="text-slate-300 truncate max-w-[280px]">
                                            {log.textPayload}
                                        </span>
                                        <span className="ml-auto text-slate-600 shrink-0 uppercase">
                                            {log.logName}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-600">{`// NO_LOGS_AVAILABLE`}</div>
                            )}

                            <div className="flex items-center mt-2 uppercase">
                                <span className="text-slate-500 uppercase">{`routing.engine> `}</span>
                                <span className="w-1.5 h-2.5 bg-[var(--calyx-accent)] ml-2 animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
