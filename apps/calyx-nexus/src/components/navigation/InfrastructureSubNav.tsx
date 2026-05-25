"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InfrastructureSubNav() {
    const pathname = usePathname();

    const links = [
        { name: "VAULT", href: "/nexus/vault" },
        { name: "CLOUD RUN", href: "/nexus/cloud-run" },
        { name: "GEAR ADK", href: "/nexus/gear" },
        { name: "VERTEX AI", href: "/nexus/vertex" },
    ];

    return (
        <div className="flex items-center gap-1 bg-[#090810]/60 border border-[rgba(139,92,246,0.15)] rounded-full p-1 backdrop-blur-md text-[9px] font-mono font-bold shadow-md">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 select-none ${
                            isActive
                                ? "bg-[#a855f7]/15 text-purple-400 border border-[rgba(168,85,247,0.3)]"
                                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                        }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
}
