'use client';

import { useEffect, useState } from "react";
import { useSystem } from "@/context/SystemContext";

export default function EcosystemVaultTerminal() {
  const { isLockdownActive } = useSystem();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const generateLogs = () => {
      const now = new Date();
      
      const formatTime = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
      };

      const nowTime = formatTime(now);

      const d2 = new Date(now.getTime() - 24 * 1000);
      const d2Time = formatTime(d2);

      const d3 = new Date(now.getTime() - (3 * 60 + 33) * 1000);
      const d3Time = formatTime(d3);

      return [
        {
          timestamp: `SYS.CLK: ${nowTime}`,
          protocol: 'Handshake / OAuth',
          node: 'Dev-Connect-V1',
          signature: '0x8F9E4...B21A',
          status: '200 OK'
        },
        {
          timestamp: `SYS.CLK: ${d2Time}`,
          protocol: 'REST / GET',
          node: 'People-API-Read',
          signature: '0x4A2BC...C90F',
          status: '200 OK'
        },
        {
          timestamp: `SYS.CLK: ${d3Time}`,
          protocol: 'GraphQL / Query',
          node: 'Calyx-Briefs-Mtx',
          signature: '0x1B8D7...F44E',
          status: '200 OK'
        }
      ];
    };

    setLogs(generateLogs());

    const interval = setInterval(() => {
      setLogs(generateLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Vault Header */}
      <div className="flex flex-col gap-2 border-b border-slate-800/50 pb-6">
        <h1 className="text-2xl font-medium tracking-tight text-slate-200">Ecosystem Vault</h1>
        <p className="text-[13px] leading-relaxed text-slate-400/80 max-w-2xl">
          Cryptographic root authority and identity ledger. Managing Google Developer Program clearances, API gateways, and regional node verification.
        </p>
      </div>

      {/* Ledger Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* PANE A: Master Identity Key */}
        <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--calyx-accent)]/5 rounded-full blur-3xl transition-all duration-700 group-hover:bg-[var(--calyx-accent)]/10 group-hover:blur-2xl"></div>
          
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6">Root Authority</span>
          
          <div className="flex flex-col gap-1 mb-8 relative z-10">
            <span className="text-[16px] font-medium tracking-tight text-slate-200">Google Developer Program</span>
            <span className="text-[12px] font-mono text-[var(--calyx-accent)]">Level 2 Verified Contributor</span>
          </div>

          <div className="flex flex-col gap-4 relative z-10 mt-auto">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Primary Node</span>
              <span className="text-[11px] font-mono text-slate-300 uppercase">IND-NODE (Bhilai)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Clearance</span>
              <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">Class A / Unrestricted</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Sys Status</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                <span className="text-[11px] font-mono text-slate-300 uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANE B: Active API Gateways */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 bg-slate-900/60 border border-slate-800/50 rounded-sm">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 uppercase">Active Protocol Gateways</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/50 border border-slate-800/50 flex flex-col gap-3 hover:border-slate-600 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono font-medium text-slate-300 uppercase">Developer Connect</span>
                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">OAuth 2.0</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Live synchronization established. Token lifecycle managed.</span>
            </div>

            <div className="p-4 bg-slate-950/50 border border-slate-800/50 flex flex-col gap-3 hover:border-slate-600 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono font-medium text-slate-300 uppercase">Google People API</span>
                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">REST / JSON</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Read-only profile aggregation active. Rate limits nominal.</span>
            </div>
            
            <div className="p-4 bg-slate-950/50 border border-slate-800/50 flex flex-col gap-3 hover:border-slate-600 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono font-medium text-slate-300 uppercase uppercase">Calyx Briefs Matrix</span>
                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">GraphQL</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Telemetry feed stable. Logarithmic extraction executing.</span>
            </div>

            <div className="p-4 bg-slate-950/50 border border-slate-800/50 flex flex-col gap-3 border-dashed opacity-50 uppercase">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono font-medium text-slate-300 uppercase uppercase">Vault Extensible</span>
                <span className="text-[9px] font-mono text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded">Standby</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600">Awaiting encrypted payload configuration.</span>
            </div>
          </div>
        </div>

        {/* PANE C: Cryptographic Access Ledger */}
        <div className="col-span-1 md:col-span-12 flex flex-col mt-4 bg-slate-900/40 border border-slate-800/50 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/80 uppercase">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">System Handshake Ledger</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
              <span className="text-[9px] font-mono tracking-wider text-[var(--calyx-accent)] uppercase">Live Monitoring</span>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] flex flex-col">
              {/* Headers */}
              <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-slate-800/50 text-[9px] font-mono tracking-widest text-slate-600 uppercase">
                <span>Timestamp</span>
                <span>Protocol</span>
                <span>Target Node</span>
                <span>Hash Signature</span>
                <span className="text-right">Status</span>
              </div>
              {/* Log Rows */}
              {logs.map((log, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-slate-800/30 text-[10px] font-mono text-slate-400 hover:bg-slate-800/30 transition-colors duration-200 cursor-default group uppercase">
                  <span className="text-slate-500 group-hover:text-slate-300 transition-colors uppercase">{log.timestamp}</span>
                  <span className={log.protocol === 'GraphQL / Query' ? 'text-[var(--calyx-accent)] uppercase' : 'text-slate-300 uppercase'}>
                    {log.protocol}
                  </span>
                  <span className="uppercase">{log.node}</span>
                  <span className="truncate sensitive-data uppercase">{log.signature}</span>
                  <div className="flex justify-end">
                    <span className="text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-2 py-0.5 rounded-sm uppercase">
                      [ {log.status} ]
                    </span>
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
