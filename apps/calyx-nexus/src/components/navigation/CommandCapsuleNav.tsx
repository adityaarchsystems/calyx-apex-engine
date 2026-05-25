"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function CommandCapsuleNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredOption, setHoveredOption] = useState<"dashboard" | "studio" | null>(null);
    const [lastOption, setLastOption] = useState<"dashboard" | "studio">("dashboard");

    const onHover = (opt: "dashboard" | "studio") => {
        setHoveredOption(opt);
        setLastOption(opt);
    };

    const handleScrollTo = (e: React.MouseEvent, id: string, targetPath: string) => {
        e.preventDefault();
        if (pathname === "/") {
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            router.push(targetPath);
        }
    };

    return (
        <div 
            className="bg-[#090810]/60 border border-[rgba(139,92,246,0.15)] rounded-full p-1 backdrop-blur-md flex items-center gap-1 shadow-[0_0_20px_rgba(139,92,246,0.05)] relative"
            onMouseLeave={() => setHoveredOption(null)}
        >
            {/* Elegant shifting violet indicator light dot */}
            <span 
                className={`absolute bg-[#a855f7] shadow-[0_0_8px_#a855f7] w-1.5 h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none top-1/2 -translate-y-1/2 ${
                    lastOption === "dashboard" ? "left-[16px]" : "left-[156px]"
                } ${hoveredOption ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            />

            <Link
                href="/#infrastructure-command-center"
                prefetch={true}
                onClick={(e) => handleScrollTo(e, "infrastructure-command-center", "/#infrastructure-command-center")}
                onMouseEnter={() => onHover("dashboard")}
                className="pl-8 pr-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-purple-300 hover:text-white transition-all duration-200 hover:scale-[1.01] hover:border-[#a855f7]/40 active:scale-[0.99] transform-gpu ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
            >
                CONTROL ROOM
            </Link>

            <div className="h-4 w-px bg-[rgba(139,92,246,0.15)]" />

            <Link
                href="/#design-studio-canvas"
                prefetch={true}
                onClick={(e) => handleScrollTo(e, "design-studio-canvas", "/#design-studio-canvas")}
                onMouseEnter={() => onHover("studio")}
                className="pl-8 pr-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-emerald-400 hover:text-white transition-all duration-200 hover:scale-[1.01] hover:border-[#a855f7]/40 active:scale-[0.99] transform-gpu ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
            >
                DESIGN STUDIO
            </Link>
        </div>
    );
}
