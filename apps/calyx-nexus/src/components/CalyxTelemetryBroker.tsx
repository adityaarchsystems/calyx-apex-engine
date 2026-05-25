"use client";

import React, { useEffect, useState } from "react";
import { CalyxMatrixDeploymentPayload } from "@cpm/types";

export default function CalyxTelemetryBroker() {
    const [toast, setToast] = useState<{ visible: boolean; nodeCount: number } | null>(null);

    useEffect(() => {
        const handleDeploy = (e: Event) => {
            const customEvent = e as CustomEvent<CalyxMatrixDeploymentPayload>;
            const payload = customEvent.detail;
            if (payload) {
                setToast({
                    visible: true,
                    nodeCount: payload.nodeCount,
                });
            }
        };

        window.addEventListener("calyx-matrix-deployed", handleDeploy);
        return () => {
            window.removeEventListener("calyx-matrix-deployed", handleDeploy);
        };
    }, []);

    useEffect(() => {
        if (toast?.visible) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast?.visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] backdrop-blur-md bg-[#090810]/70 border border-[rgba(139,92,246,0.15)] shadow-[0_0_30px_rgba(139,92,246,0.1)] rounded px-5 py-4 min-w-[320px] text-xs font-mono animate-[slideUp_200ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="relative flex flex-col gap-1">
                {/* Subtle internal violet radial accent glow */}
                <div className="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-emerald-400 font-extrabold tracking-widest uppercase">
                        ■ PIPELINE UPDATE SUCCESSFUL
                    </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-medium pl-4 relative z-10">
                    // {toast.nodeCount} NODES MUTATED
                </div>
            </div>
        </div>
    );
}
