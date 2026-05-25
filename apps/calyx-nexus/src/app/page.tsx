import Link from "next/link";
import { headers } from "next/headers";
import ImpactGlobeModule from "@/components/modules/ImpactGlobeModule";
import GitHubMatrixModule from "@/components/modules/GitHubMatrixModule";
import DevProfileModule from "@/components/modules/DevProfileModule";
import DesignStudioModule from "@/components/modules/DesignStudioModule";
import InfrastructureHub from "@/components/home/InfrastructureHub";
import { validateCredentials } from "@/lib/config/credentials";

export default async function ApexDashboard() {
    await headers();
    validateCredentials();
    return (
        <div className="min-h-screen bg-calyx-bg text-calyx-slate relative">
            {/* Fixed Global Navigation Semantic Header */}
            <nav className="h-16 w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-[#050507]/80 border-b border-[rgba(139,92,246,0.15)] transition-all flex items-center justify-between px-6 sm:px-12">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-sm"></span>
                    <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase">
                        ■ CALYX NEXUS V0.1
                    </span>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 flex flex-col gap-8">
                <header className="flex flex-col border-b border-zinc-800/40 pb-8 gap-6">
                    <div className="space-y-3">
                        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                            Calyx <span className="text-purple-500">Apex</span> Engine
                        </h2>
                        <p className="text-calyx-slate text-base md:text-lg max-w-xl">
                            Developer Profile Aggregator
                        </p>
                    </div>
                </header>

                {/* PRIMARY GRID - Split Tower Layout */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full auto-rows-[450px]">
                    {/* MODULE 01: Impact Globe */}
                    <div className="calyx-module-card border border-calyx-border/30 bg-[#07060f]/60 rounded-sm overflow-hidden h-full">
                        <ImpactGlobeModule />
                    </div>

                    {/* MODULE 02: Infrastructure Hub */}
                    <div id="infrastructure-command-center" className="calyx-module-card border border-calyx-border/30 bg-[#07060f]/60 rounded-sm overflow-hidden h-full">
                        <InfrastructureHub />
                    </div>

                    {/* MODULE 03: Design Studio Bento Customizer */}
                    <div id="design-studio-canvas" className="calyx-module-card border border-calyx-border/30 bg-[#07060f]/60 rounded-sm overflow-hidden h-full">
                        <DesignStudioModule />
                    </div>

                    {/* MODULE 04: GitHub Matrix */}
                    <div className="calyx-module-card border border-calyx-border/30 bg-[#07060f]/60 rounded-sm overflow-hidden h-full">
                        <GitHubMatrixModule />
                    </div>

                    {/* MODULE 05: daily.dev Integration */}
                    <div className="lg:col-span-2 w-full h-auto">
                        <DevProfileModule username="adityaarchsystems" />
                    </div>
                </section>

                {/* Global System Health Monitor */}
                <div className="fixed bottom-8 left-8 z-50 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                    <div className="bg-[var(--calyx-accent)]/5 border border-[var(--calyx-accent)]/20 px-3 py-1.5 rounded-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                        <span className="text-[10px] font-mono tracking-widest text-[var(--calyx-accent)] uppercase">Health: Optimal</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
