"use client";

import { useState } from "react";

export default function NeuralComputeModule({ isEmbed = false }: { isEmbed?: boolean } = {}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("https://api.hf.space/calyx-studios/omni-ad-inference/v1");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const content = (
        <>
            <div>
                {!isEmbed && (
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--calyx-accent)]/70">
                            MODULE 03
                        </span>
                        <div className="h-2 w-2 bg-[var(--calyx-accent)] opacity-60" />
                    </div>
                )}

                {/* Status Grounding - Mandate 2.1 */}
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-medium tracking-tight text-slate-200">Hugging Face Hub</h2>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--calyx-accent-soft)] border border-[var(--calyx-accent)]/20">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--calyx-accent)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--calyx-accent)]"></span>
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-[var(--calyx-accent)] uppercase mt-[1px]">Operational</span>
                    </div>
                </div>

                <p className="text-xs text-calyx-text-muted leading-relaxed mb-6">
                    Model downloads, Space analytics, and inference endpoint performance — deduplicated and cryptographically verified.
                </p>

                {/* Inference Hardware Loadout - Mandate 2.1 */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4 mb-3 w-full z-10 relative">
                    {/* Spec 01: Engine */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Engine</span>
                        <span className="text-[11px] font-mono font-medium text-slate-300">Gemma-4-e2b</span>
                    </div>
                    {/* Spec 02: Format */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Format</span>
                        <span className="text-[11px] font-mono font-medium text-slate-300">Int4 Mobile</span>
                    </div>
                    {/* Spec 03: Context */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Context</span>
                        <span className="text-[11px] font-mono font-medium text-slate-300">8192 Tokens</span>
                    </div>
                    {/* Spec 04: Throughput */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Throughput</span>
                        <span className="text-[11px] font-mono font-medium text-slate-300">~120 TOKENS/SEC</span>
                    </div>
                </div>
            </div>

            {/* Quick-Connect Terminal Block - Mandate 4.1 */}
            <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Primary Inference Endpoint</span>
                </div>
                <div 
                    onClick={handleCopy}
                    className="relative group flex items-center justify-between w-full py-2 px-3 bg-slate-900/60 border border-slate-700/30 rounded-sm cursor-pointer hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-200"
                >
                    <code className="text-[11px] font-mono text-slate-300 pr-4 select-all">
                        https://api.hf.space/calyx-studios/omni-ad-inference/v1
                    </code>
                    <div className="flex-shrink-0 text-[10px] font-mono font-medium text-[var(--calyx-accent)] bg-[var(--calyx-accent-soft)] px-2 py-1 rounded">
                        {copied ? "COPIED" : "COPY"}
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
        <div className="p-6 sm:p-8 flex flex-col h-full bg-calyx-bg border border-calyx-border/30 rounded-sm relative overflow-hidden group">
            {content}
        </div>
    );
}
