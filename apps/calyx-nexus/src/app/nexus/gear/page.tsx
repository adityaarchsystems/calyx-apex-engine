"use client";

import React, { useState, useEffect, useRef } from "react";

export default function GearTerminal() {
    const [logs, setLogs] = useState<string[]>([]);
    const [scanning, setScanning] = useState(false);
    const [connectedXiaomi, setConnectedXiaomi] = useState(true);
    const [connectedRealme, setConnectedRealme] = useState(true);
    const [bleDevice, setBleDevice] = useState<string | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (tag: string, message: string) => {
        const time = new Date().toLocaleTimeString();
        setLogs((prev) => [...prev, `[${time}] ${tag}: ${message}`]);
    };

    useEffect(() => {
        // Initial system logs setup
        const initLogs = [
            "// INITIALIZING BLUETOOTH LOW ENERGY (BLE) STACK... OK",
            "[BLE.SYS] Google Gear Edge Device Matrix loader online.",
            "[BLE.SYS] Bounded context: D:\\Calyx Apex Engine runtime.",
            "[BLE.SYS] Checking Web Bluetooth hardware controller interface...",
            typeof navigator !== "undefined" && (navigator as any).bluetooth
                ? "[BLE.SYS] Web Bluetooth API detected. Ready for physical hardware handshake."
                : "[BLE.SYS] Web Bluetooth API unavailable in this browser context (Local Emulation Mode active).",
            "[BLE.SYS] Mapped local hardware node: Xiaomi Pad 7 Edge (Inference Node).",
            "[BLE.SYS] Mapped local hardware node: Realme GT 6 Snapdragon 8 Elite (X64 Emulation Node).",
            "[BLE.SYS] Standby: Ready for peripheral search scan."
        ];
        setLogs(initLogs);
    }, []);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const handleWebBluetoothScan = async () => {
        if (scanning) return;
        setScanning(true);
        addLog("BLE.SCN", "Requesting user-authorized Web Bluetooth peripheral device scan...");

        try {
            if (typeof navigator === "undefined" || !(navigator as any).bluetooth) {
                throw new Error("Web Bluetooth API is not supported or permission is denied.");
            }

            addLog("BLE.SYS", "Invoking navigator.bluetooth.requestDevice() browser dialog...");
            const device = await (navigator as any).bluetooth.requestDevice({
                acceptAllDevices: true
            });

            addLog("BLE.CON", `Successfully connected to: ${device.name || "Unnamed Device"} [ID: ${device.id}]`);
            setBleDevice(device.name || device.id);

            // Listen to disconnects
            device.addEventListener("gattserverdisconnected", () => {
                addLog("BLE.DIS", `Device connection severed: ${device.name || device.id}`);
                setBleDevice(null);
            });
        } catch (error: any) {
            addLog("BLE.ERR", `Scan failed or user canceled dialog: ${error.message || error}`);
            addLog("BLE.SIM", "Triggering hardware fallback scan to recover emulation matrix...");
            
            // Emulate fallback scan ticks
            setTimeout(() => {
                addLog("BLE.SIM", "Fallback scan: Found Xiaomi Pad 7 Edge [Local Inference Node] (RSSI: -54 dBm)");
            }, 600);
            setTimeout(() => {
                addLog("BLE.SIM", "Fallback scan: Found Realme GT 6 Snapdragon 8 Elite [X64 Emulation Node] (RSSI: -61 dBm)");
            }, 1200);
            setTimeout(() => {
                addLog("BLE.SYS", "Emulated local hardware assets mapped successfully.");
            }, 1800);
        } finally {
            setScanning(false);
        }
    };

    const toggleXiaomi = () => {
        const nextState = !connectedXiaomi;
        setConnectedXiaomi(nextState);
        addLog("SYS.DEV", `Xiaomi Pad 7 Edge connectivity toggled: ${nextState ? "MOUNTED/CONNECTED" : "UNMOUNTED/OFFLINE"}`);
    };

    const toggleRealme = () => {
        const nextState = !connectedRealme;
        setConnectedRealme(nextState);
        addLog("SYS.DEV", `Realme GT 6 Snapdragon 8 Elite connectivity toggled: ${nextState ? "MOUNTED/CONNECTED" : "UNMOUNTED/OFFLINE"}`);
    };

    const clearTerminalLogs = () => {
        setLogs(["// TERMINAL CONSOLE LOGS FLUSHED"]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* HEADER: Edge Compute Telemetry */}
            <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-slate-200">GEAR Edge Compute Hub</h1>
                        <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
                            Local device telemetry and emulation matrix. Managing hardware offloading, Winlator x64 environments, and Web Bluetooth telemetry scan loops.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${scanning ? "bg-amber-500 animate-ping" : "bg-emerald-500 animate-pulse"}`}></span>
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase ml-1">
                            {scanning ? "Scanning BLE..." : "Radio Telemetry Standby"}
                        </span>
                    </div>
                </div>

                {/* Edge Hardware Telemetry Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Local Nodes</span>
                        <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">
                            {((connectedXiaomi ? 1 : 0) + (connectedRealme ? 1 : 0)).toString().padStart(2, "0")} Connected
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Winlator Alloc</span>
                        <span className="text-[11px] font-mono text-slate-300">
                            {connectedRealme ? "8.5 GB RAM RESERVED" : "0.0 GB RAM RESERVED"}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Material 3 Tonal</span>
                        <span className="text-[11px] font-mono text-slate-300">
                            {connectedXiaomi ? "PALETTE SYNCED" : "DESYNCED"}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">BLE Handshake</span>
                        <span className={`text-[11px] font-mono ${bleDevice ? "text-emerald-400" : scanning ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>
                            {bleDevice ? `CONNECTED: ${bleDevice.toUpperCase()}` : scanning ? "SCANNING..." : "DISCONNECTED"}
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN TERMINAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
                
                {/* PANE A: The Hardware Edge Array (5 Columns) */}
                <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm overflow-hidden">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        Physical Device Matrix
                    </span>

                    <div className="flex flex-col gap-4 h-full">
                        {/* Node 1: Xiaomi Pad 7 */}
                        <div className={`flex flex-col p-4 bg-slate-950/80 border rounded-sm relative group overflow-hidden transition-all duration-300 ${connectedXiaomi ? "border-slate-700/50" : "border-red-950 opacity-60"}`}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${connectedXiaomi ? "bg-[var(--calyx-accent)]" : "bg-red-600"}`}></div>
                            <div className="flex justify-between items-start mb-2 ml-2">
                                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">Xiaomi-Pad-7-Edge</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${connectedXiaomi ? "text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10" : "text-red-400 bg-red-950/30"}`}>
                                    {connectedXiaomi ? "Local Inference" : "Offline"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 ml-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Compute Engine:</span>
                                    <span className="text-[10px] font-mono text-slate-300 uppercase">Google AI Edge Gallery</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Hardware Offload:</span>
                                    <span className={`text-[10px] font-mono uppercase ${connectedXiaomi ? "text-[var(--calyx-accent)]" : "text-red-400"}`}>
                                        {connectedXiaomi ? "Active / NPU" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={toggleXiaomi}
                                className={`mt-3 w-full py-1 text-[9.5px] font-mono border transition-all duration-150 ${connectedXiaomi ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"}`}
                            >
                                {connectedXiaomi ? "DISCONNECT NODE" : "CONNECT NODE"}
                            </button>
                        </div>

                        {/* Node 2: Realme GT 6 */}
                        <div className={`flex flex-col p-4 bg-slate-950/80 border rounded-sm relative group overflow-hidden transition-all duration-300 mt-2 ${connectedRealme ? "border-slate-700/50" : "border-red-950 opacity-60"}`}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${connectedRealme ? "bg-[var(--calyx-accent)]" : "bg-red-600"}`}></div>
                            <div className="flex justify-between items-start mb-2 ml-2">
                                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">Realme-GT-6-Node</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${connectedRealme ? "text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10" : "text-red-400 bg-red-950/30"}`}>
                                    {connectedRealme ? "Snapdragon 8 Elite" : "Offline"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 ml-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Translation Layer:</span>
                                    <span className="text-[10px] font-mono text-slate-300 uppercase">Winlator Engine</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">PC Environment:</span>
                                    <span className={`text-[10px] font-mono uppercase ${connectedRealme ? "text-[var(--calyx-accent)]" : "text-red-400"}`}>
                                        {connectedRealme ? "Mounted / Stable" : "Unmounted"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={toggleRealme}
                                className={`mt-3 w-full py-1 text-[9.5px] font-mono border transition-all duration-150 ${connectedRealme ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"}`}
                            >
                                {connectedRealme ? "DISCONNECT NODE" : "CONNECT NODE"}
                            </button>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Device Mesh Integrity</span>
                            <span className={`text-[11px] font-mono uppercase ${connectedXiaomi && connectedRealme ? "text-[var(--calyx-accent)]" : "text-amber-500"}`}>
                                {connectedXiaomi && connectedRealme ? "Optimal" : connectedXiaomi || connectedRealme ? "Degraded" : "Offline"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PANE B: Wear OS & Agent Sync Log (7 Columns) */}
                <div className="col-span-1 md:col-span-7 flex flex-col p-0 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50 absolute top-0 w-full z-10">
                        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Wear OS & Bio-Telemetry Link</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={clearTerminalLogs}
                                className="text-[9px] font-mono tracking-wide text-red-500 hover:text-red-400 uppercase transition bg-transparent border-0 cursor-pointer"
                            >
                                Flush Console
                            </button>
                            <span className="text-[9px] font-mono tracking-wider text-amber-500 uppercase animate-pulse">Standby / Polling</span>
                        </div>
                    </div>
                    
                    {/* Simulated Radar / Polling Animation */}
                    <div className="absolute right-8 top-20 flex items-center justify-center w-16 h-16 opacity-30">
                        <div className="absolute w-full h-full border border-amber-500 rounded-full animate-ping"></div>
                        <div className="absolute w-8 h-8 border border-amber-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    </div>

                    {/* Terminal Polling Log */}
                    <div className="flex flex-col h-full pt-16 px-6 pb-6 font-mono text-[11px] text-slate-400 leading-relaxed overflow-y-auto z-10 min-h-[300px]">
                        {logs.map((log, index) => (
                            <div key={index} className="flex gap-2 mb-1.5 text-zinc-300 animate-in fade-in slide-in-from-bottom-1 duration-150">
                                <span className="text-slate-600 shrink-0 font-bold">[{index.toString().padStart(2, "0")}]</span>
                                <span className="font-mono text-zinc-300 break-all">{log}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>

                    {/* Web Bluetooth Scanning Trigger Footer */}
                    <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 flex justify-between items-center z-10">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Web Bluetooth Client Controller</span>
                        <button
                            onClick={handleWebBluetoothScan}
                            disabled={scanning}
                            className={`px-4 py-2 text-xs font-mono font-bold uppercase border transition-all duration-200 select-none ${
                                scanning
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500/60 cursor-not-allowed"
                                    : "bg-purple-500/10 border-purple-500/40 text-purple-400 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"
                            }`}
                        >
                            {scanning ? "SCANNING PERIPHERALS..." : "SCAN FOR EDGE DEVICES 🔌"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
