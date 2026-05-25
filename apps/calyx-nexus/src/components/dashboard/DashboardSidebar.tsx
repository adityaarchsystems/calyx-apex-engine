"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Activity, Cpu, Layers } from "lucide-react";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                const target = e.target as HTMLElement;
                // Suppress routing transition if user is currently focused on input components
                if (
                    target && (
                        target.tagName === "INPUT" || 
                        target.tagName === "TEXTAREA" || 
                        target.isContentEditable ||
                        target.hasAttribute("contenteditable")
                    )
                ) {
                    return;
                }
                router.push("/");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [router]);

    const menuItems = [
        {
            name: "Command Hub",
            path: "/dashboard",
            icon: LayoutDashboard,
            description: "Core Matrix Telemetry",
        },
        {
            name: "Snap Analytics",
            path: "/analytics",
            icon: Activity,
            description: "Real-time Processing",
        },
        {
            name: "Control Center",
            path: "/integrations",
            icon: Cpu,
            description: "Ecosystem Integrations",
        },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#07060f] border-r border-[rgba(139,92,246,0.15)] flex flex-col justify-between z-30">
            {/* Upper Sidebar Section */}
            <div className="flex flex-col">
                {/* Header branding */}
                <Link 
                    href="/" 
                    prefetch={true}
                    className="p-6 border-b border-[rgba(139,92,246,0.1)] flex flex-col gap-1.5 hover:bg-purple-950/15 hover:brightness-110 active:scale-98 transition-all duration-150 group"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping absolute" />
                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full relative" />
                        </div>
                        <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase group-hover:text-purple-300 transition-colors">
                            Calyx Nexus
                        </span>
                    </div>
                    <h2 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase group-hover:text-zinc-400 transition-colors">
                        Monolithic Control Room
                    </h2>
                </Link>

                {/* Navigation Mappings */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-start gap-3.5 px-4 py-3 rounded-lg border transition-all duration-300 group relative overflow-hidden ${
                                    isActive
                                        ? "text-[#a855f7] bg-[#a855f7]/10 border-l-2 border-[#a855f7]"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#12111f]/45"
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-115 ${
                                        isActive ? "text-purple-400" : "text-zinc-500"
                                    }`}
                                />
                                
                                <div className="flex flex-col">
                                    <span className={`text-xs font-mono tracking-wider font-bold uppercase ${
                                        isActive ? "text-purple-300" : "text-zinc-300"
                                    }`}>
                                        {item.name}
                                    </span>
                                    <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
                                        {item.description}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Lower Fold Indicators */}
            <div className="p-6 border-t border-[rgba(139,92,246,0.1)] bg-[#030307] space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span>OPERATOR ID</span>
                        <span className="text-purple-400 font-bold">@calyx</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span>BRIDGE CHANNEL</span>
                        <span className="text-emerald-400 font-bold">PORT_3000</span>
                    </div>
                </div>

                <div className="p-3 bg-[#0a0914] border border-purple-500/10 rounded flex flex-col gap-1.5 shadow-inner">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                            Online
                        </span>
                    </div>
                    <p className="text-[8.5px] font-mono text-zinc-500 leading-normal">
                        Active Secure Bridge Online. Encryption streams stable.
                    </p>
                </div>
            </div>
        </aside>
    );
}
