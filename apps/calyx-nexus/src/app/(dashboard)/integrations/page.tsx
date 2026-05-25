"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Globe, Shield, RefreshCw, Send, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { CalyxMatrixDeploymentPayload } from "@cpm/types";

interface WebhookLog {
    id: string;
    timestamp: string;
    source: string;
    event: string;
    payload: string;
    status: "SUCCESS" | "WARNING" | "CRITICAL";
}

interface DomainStatus {
    domain: string;
    cname: "VALID" | "PROCESSING" | "FAILED";
    ssl: "VALID" | "PROCESSING" | "FAILED";
    issuer: string;
    message: string;
}

export default function ControlCenter() {
    const [domainInput, setDomainInput] = useState("");
    const [checkingDomain, setCheckingDomain] = useState(false);
    const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);

    useEffect(() => {
        const now = new Date();
        const t1 = new Date(now.getTime() - 25000);
        const t2 = new Date(now.getTime() - 15000);
        const t3 = new Date(now.getTime() - 5000);

        const formatTime = (time: Date) => {
            return time.toTimeString().split(" ")[0] + "." + String(time.getMilliseconds()).padStart(3, "0");
        };

        setWebhookLogs([
            {
                id: "1",
                timestamp: formatTime(t1),
                source: "GitHub Webhook",
                event: "push",
                payload: '{"ref":"refs/heads/main","commits":[{"id":"e1823","message":"update BioNode"}]}',
                status: "SUCCESS",
            },
            {
                id: "2",
                timestamp: formatTime(t2),
                source: "Upstash Stream",
                event: "cache:flush",
                payload: '{"keys":["nodes:global:configs"],"latency_ms":1.2}',
                status: "SUCCESS",
            },
            {
                id: "3",
                timestamp: formatTime(t3),
                source: "SSL Provisioner",
                event: "cert:renew",
                payload: '{"domain":"calyxsnap.vercel.app","status":"active_ssl_secured"}',
                status: "SUCCESS",
            },
        ]);
    }, []);

    const logsEndRef = useRef<HTMLDivElement>(null);

    // Initial logs auto-scroller
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [webhookLogs]);

    // Listen for canvas deployment compiles in integrations page
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleDeploy = (e: Event) => {
                const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
                const payload = customEvent.detail;
                if (payload) {
                    const time = new Date(payload.timestamp);
                    const formattedTime = time.toTimeString().split(" ")[0] + "." + String(time.getMilliseconds()).padStart(3, "0");
                    const newLog: WebhookLog = {
                        id: crypto.randomUUID(),
                        timestamp: formattedTime,
                        source: "Edge Router",
                        event: "matrix:compiled",
                        payload: JSON.stringify({
                            matrixId: payload.matrixId,
                            nodeCount: payload.nodeCount,
                            layerCards: payload.layerCards,
                            latencyDelta: payload.latencyDelta,
                            activeNodesSummary: payload.activeNodesSummary
                        }),
                        status: "SUCCESS"
                    };
                    setWebhookLogs((prev) => {
                        const updated = [...prev, newLog];
                        if (updated.length > 25) return updated.slice(updated.length - 25);
                        return updated;
                    });
                }
            };

            window.addEventListener("calyx-matrix-deployed", handleDeploy);
            return () => {
                window.removeEventListener("calyx-matrix-deployed", handleDeploy);
            };
        }
    }, []);

    // Live Webhook log stream simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            const sources = ["GitHub Webhook", "Supabase DB", "Upstash Stream", "Edge Router"];
            const events = ["push", "db:insert", "cache:invalidate", "tls:handshake", "dns:propagate"];
            const statuses: ("SUCCESS" | "WARNING" | "CRITICAL")[] = ["SUCCESS", "SUCCESS", "WARNING", "CRITICAL"];

            const randomSource = sources[Math.floor(Math.random() * sources.length)];
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const nowLog = new Date();
            const timestamp = nowLog.toTimeString().split(" ")[0] + "." + String(nowLog.getMilliseconds()).padStart(3, "0");

            let payload = "";
            if (randomStatus === "SUCCESS") {
                payload = `{"action":"sync","status":"completed","records":${Math.floor(Math.random() * 5) + 1}}`;
            } else if (randomStatus === "WARNING") {
                payload = `{"warning":"latency_spike","latency_ms":${Math.floor(Math.random() * 50) + 40}}`;
            } else {
                payload = `{"error":"tls_handshake_failed","remote_ip":"${Math.floor(Math.random() * 255)}.142.12.80"}`;
            }

            const newLog: WebhookLog = {
                id: crypto.randomUUID(),
                timestamp,
                source: randomSource,
                event: randomEvent,
                payload,
                status: randomStatus,
            };

            setWebhookLogs((prev) => {
                const updated = [...prev, newLog];
                if (updated.length > 25) return updated.slice(updated.length - 25);
                return updated;
            });
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const [domainList, setDomainList] = useState<DomainStatus[]>([
        {
            domain: "calyxsnap.vercel.app",
            cname: "VALID",
            ssl: "VALID",
            issuer: "Vercel Let's Encrypt Authority X3",
            message: "Git Branch: main [de25f04]",
        },
    ]);

    const handleRegisterDomain = (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainInput.trim()) return;

        setCheckingDomain(true);
        setTimeout(() => {
            const newDomain: DomainStatus = {
                domain: domainInput.toLowerCase().trim(),
                cname: "PROCESSING",
                ssl: "PROCESSING",
                issuer: "Let's Encrypt TLS Provisioner",
                message: "Awaiting DNS record mapping propagation.",
            };
            setDomainList((prev) => [newDomain, ...prev]);
            setDomainInput("");
            setCheckingDomain(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col border-b border-[rgba(139,92,246,0.15)] pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                        Configuration Suite / Routing Center
                    </span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                    CONTROL CENTER
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                    Route incoming payloads, manage domain namespaces, and monitor SSL certificate lifecycle nodes.
                </p>
            </div>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Domain Reg and Webhooks Console (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Domain Registration View */}
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                            CUSTOM DOMAIN REGISTRATION
                        </h3>
                        
                        <form onSubmit={handleRegisterDomain} className="flex gap-2.5">
                            <input
                                type="text"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                placeholder="Enter custom domain (e.g. portfolio.yourname.dev)"
                                className="flex-1 bg-[#12111f] border border-[rgba(139,92,246,0.15)] focus:border-purple-500 text-xs px-3.5 py-2.5 rounded text-zinc-200 outline-none font-mono"
                                disabled={checkingDomain}
                            />
                            <button
                                type="submit"
                                disabled={checkingDomain}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                            >
                                {checkingDomain ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5" />
                                )}
                                <span>{checkingDomain ? "Routing..." : "Configure"}</span>
                            </button>
                        </form>

                        <div className="bg-[#0b0a14] border border-purple-500/10 rounded-md p-3.5 space-y-2 font-mono">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                Required DNS record target mappings:
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] items-center border-b border-zinc-800/40 pb-2">
                                <span className="text-zinc-400 font-medium">Record Type</span>
                                <span className="text-zinc-400 font-medium">Host</span>
                                <span className="text-zinc-400 font-medium text-right">Value Target</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] items-center pt-1">
                                <span className="text-purple-400 font-extrabold">CNAME</span>
                                <span className="text-zinc-300">@ or subdomain</span>
                                <span className="text-zinc-300 text-right truncate">alias.calyx.nexus</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Inbound Webhooks Console */}
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                    LIVE INBOUND WEBHOOKS CONSOLE
                                </h3>
                                <p className="text-[9px] font-mono text-zinc-500">
                                    Continuous telemetry hook capturing deployment event dispatches.
                                </p>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>

                        {/* Scrolling Console log wrapper */}
                        <div className="bg-[#050508] border border-zinc-800 rounded-md p-4 font-mono text-xs text-zinc-300 h-56 overflow-y-auto space-y-2.5 custom-scrollbar">
                            {webhookLogs.map((log) => (
                                <div key={log.id} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-[9.5px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-500">[{log.timestamp}]</span>
                                            <span className="text-purple-400 font-black">{log.source}</span>
                                            <span className="text-zinc-600 font-medium">&gt;</span>
                                            <span className="text-cyan-400 font-bold">{log.event}</span>
                                        </div>
                                        <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded border ${
                                            log.status === "SUCCESS"
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                : log.status === "WARNING"
                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                                        }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <div className="bg-zinc-950/40 p-2 border border-zinc-900 rounded text-[9.5px] text-zinc-400 truncate font-mono">
                                        {log.payload}
                                    </div>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>

                {/* Right Side: CNAME & SSL State Monitor Panel (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#07060f] border border-[rgba(139,92,246,0.15)] rounded-lg p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-purple-400">
                                DOMAIN & SSL MONITORS
                            </h3>
                            <p className="text-[9px] font-mono text-zinc-500">
                                Certificate verification status mapping active gateway endpoints.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            {domainList.map((item) => (
                                <div
                                    key={item.domain}
                                    className="bg-[#0b0a14] border border-[rgba(139,92,246,0.1)] rounded-lg p-4 space-y-3 shadow-inner"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                            <span className="text-xs font-bold text-zinc-200 truncate max-w-[160px] font-mono">
                                                {item.domain}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badges Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                        <div className="bg-[#12111f] border border-zinc-800 rounded p-2 flex flex-col gap-1">
                                            <span className="text-[8px] text-zinc-500 uppercase tracking-widest">
                                                CNAME STATUS
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    item.cname === "VALID"
                                                        ? "bg-emerald-400"
                                                        : item.cname === "PROCESSING"
                                                        ? "bg-amber-400"
                                                        : "bg-red-500"
                                                }`} />
                                                <span className={`font-bold ${
                                                    item.cname === "VALID"
                                                        ? "text-emerald-400"
                                                        : item.cname === "PROCESSING"
                                                        ? "text-amber-400"
                                                        : "text-red-400"
                                                }`}>
                                                    {item.cname}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-[#12111f] border border-zinc-800 rounded p-2 flex flex-col gap-1">
                                            <span className="text-[8px] text-zinc-500 uppercase tracking-widest">
                                                SSL TUNNEL
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    item.ssl === "VALID"
                                                        ? "bg-emerald-400"
                                                        : item.ssl === "PROCESSING"
                                                        ? "bg-amber-400"
                                                        : "bg-red-500"
                                                }`} />
                                                <span className={`font-bold ${
                                                    item.ssl === "VALID"
                                                        ? "text-emerald-400 font-extrabold"
                                                        : item.ssl === "PROCESSING"
                                                        ? "text-amber-400"
                                                        : "text-red-400"
                                                }`}>
                                                    {item.ssl === "VALID" ? "● VALID" : item.ssl}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional info metadata */}
                                    <div className="text-[9px] font-mono text-zinc-500 space-y-1">
                                        <div className="flex justify-between">
                                            <span>ISSUER:</span>
                                            <span className="text-zinc-400">{item.issuer}</span>
                                        </div>
                                        <p className="text-[8.5px] leading-relaxed text-zinc-500 border-t border-zinc-800/50 pt-1.5 mt-1.5">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
