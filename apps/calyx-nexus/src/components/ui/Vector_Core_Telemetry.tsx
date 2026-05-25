"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Vector_Core_Telemetry = () => {
    const [telemetry, setTelemetry] = useState({
        siphon: "24ms",
        saturation: "1.2GB",
        load: "0.15",
        duration: "1,240h"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry((prev) => ({
                ...prev,
                siphon: `${Math.floor(Math.random() * 10 + 20)}ms`,
                saturation: `${(Math.random() * 0.2 + 1.1).toFixed(2)}GB`,
                load: (Math.random() * 0.1 + 0.1).toFixed(2),
                duration: "1,240h"
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-black/60 backdrop-blur-2xl border border-white/10 p-6 font-mono text-[10px] w-full max-w-[300px] shadow-2xl"
        >
            <div className="flex items-center gap-2 mb-4 text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
                <div className="w-1.5 h-1.5 bg-[var(--calyx-accent)] rounded-full animate-pulse" />
                Vector_Core_Telemetry
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-white/30">SIPHON_VELOCITY:</span>
                    <span className="text-[var(--calyx-accent)]">{telemetry.siphon}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/30">DATA_SATURATION:</span>
                    <span className="text-white/60">{telemetry.saturation}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/30">NEURAL_LOAD_AVG:</span>
                    <span className="text-white/60">{telemetry.load}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/30">STRATA_DURATION:</span>
                    <span className="text-white/60">{telemetry.duration}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-[8px] text-white/20 uppercase tracking-tighter">
                SECURE_CONNECTION_ESTABLISHED // ROOT_CORE_VECTOR
            </div>
        </motion.div>
    );
};
