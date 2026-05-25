"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicHologram = dynamic(() => import("@/components/impact-globe"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center z-0 absolute inset-0 bg-calyx-bg">
            <div className="w-32 h-[1px] bg-calyx-border overflow-hidden">
                <div className="w-full h-full bg-[var(--calyx-accent)] animate-[pulse_1.5s_ease-in-out_infinite] origin-left scale-x-50"></div>
            </div>
            <p className="mt-4 font-mono text-[9px] text-calyx-slate tracking-[0.2em] uppercase text-center">
                [ IGNITING HOLOGRAPHIC ENGINE ]
            </p>
        </div>
    )
});

export default function ImpactGlobeModule() {
    return (
        <div className="w-full h-full relative overflow-hidden group">
            
            {/* Header block with brand accent */}
            <div className="absolute top-8 left-8 right-8 z-20 pointer-events-none flex items-center justify-between">
                <span className="font-mono text-[10px] text-calyx-slate tracking-widest uppercase">
                    MODULE 01
                </span>
                <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            </div>

            {/* High-Fidelity Typography Overlay */}
            <div className="absolute top-16 left-8 z-20 pointer-events-none flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-calyx-platinum tracking-tight">Impact Globe</h2>
                <p className="text-calyx-slate text-sm max-w-xs leading-relaxed">
                    WebGL-powered 3D geospatial visualization mapping global open-source influence.
                </p>
            </div>
            
            {/* Isolated Client-Side WebGL Engine */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-auto">
                <DynamicHologram />
            </div>

            {/* Premium action button at lower-left */}
            <div className="absolute bottom-6 left-8 z-30 pointer-events-auto">
                <Link
                    href="/nexus/globe"
                    prefetch={true}
                    className="px-4 py-2 border border-neutral-800 rounded text-[11px] font-mono tracking-wider transition-all duration-200 hover:border-[#a855f7]/40 hover:bg-[#a855f7]/5 text-neutral-300 uppercase flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                >
                    <span>EXPLORE GLOBE</span>
                    <span className="text-[8px] opacity-60">■</span>
                </Link>
            </div>

            {/* Globe Typographic Footer */}
            <div className="absolute bottom-8 right-8 z-30 font-mono text-[9px] text-calyx-slate tracking-[0.3em] uppercase">
                GEOSPATIAL . WEBGL . THREE.JS
            </div>
        </div>
    );
}
