'use client';

import { useSystem } from "@/context/SystemContext";

export default function ProjectOrchestrationHub() {
  const { 
    isStressTestActive, 
    isLockdownActive, 
    toggleStressTest, 
    toggleLockdown,
    systemHealth 
  } = useSystem();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: Global Project State */}
      <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-200">Calyx Codex / Orchestration</h1>
            <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
              Global product command and strategic lifecycle management. Syncing intent, architecture, and deployment across the Calyx Studios ecosystem.
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm transition-all duration-300 ${
            systemHealth === 'OPTIMAL' ? 'bg-[var(--calyx-accent)]/10 border-[var(--calyx-accent)]/30' :
            systemHealth === 'STRESSED' ? 'bg-amber-500/10 border-amber-500/30' :
            systemHealth === 'SCANNING' ? 'bg-[var(--calyx-accent)]/20 border-[var(--calyx-accent)]/50' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              systemHealth === 'OPTIMAL' ? 'bg-[var(--calyx-accent)]' :
              systemHealth === 'STRESSED' ? 'bg-amber-500' :
              systemHealth === 'SCANNING' ? 'bg-[var(--calyx-accent)] animate-ping' :
              'bg-red-500'
            }`}></span>
            <span className={`text-[10px] font-mono tracking-widest uppercase ml-1 ${
              systemHealth === 'OPTIMAL' ? 'text-[var(--calyx-accent)]' :
              systemHealth === 'STRESSED' ? 'text-amber-500' :
              systemHealth === 'SCANNING' ? 'text-[var(--calyx-accent)]' :
              'text-red-500'
            }`}>{systemHealth === 'OPTIMAL' ? 'Orchestrator Online' : `SYS_${systemHealth}`}</span>
          </div>
        </div>

        {/* Global Resource Pressure */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Active Products</span>
            <span className="text-[11px] font-mono text-slate-300 uppercase">05 CORE UNITS</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Vibe Coding Phase</span>
            <span className={`text-[11px] font-mono transition-colors ${isStressTestActive ? 'text-amber-400' : 'text-[var(--calyx-accent)]'}`}>
              {isStressTestActive ? 'PRESSURE_RECOVERY' : 'INTENT STABILIZATION'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Bhilai Node Health</span>
            <span className="text-[11px] font-mono text-slate-300 uppercase">OPTIMAL / 12MS</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Ecosystem Sync</span>
            <span className="text-[11px] font-mono text-slate-300 uppercase">99.9% COHERENCE</span>
          </div>
        </div>
      </div>

      {/* MAIN COMMAND GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
        
        {/* PANE A: The Product Stack (5 Columns) */}
        <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
            Product Stack Ledger
          </span>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            {/* Product 1: FOLIO */}
            <div className={`p-4 bg-slate-950/80 border border-slate-700/50 rounded-sm relative group overflow-hidden ${isLockdownActive ? 'grayscale' : ''}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isStressTestActive ? 'bg-amber-500' : 'bg-[var(--calyx-accent)]'}`}></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">Folio_Beta</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isStressTestActive ? 'text-amber-400 bg-amber-500/10' : 'text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10'
                }`}>
                  {isStressTestActive ? 'UNDER_PRESSURE' : 'STRESS TEST PASS'}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 ml-2 mt-2 uppercase">
                {isLockdownActive ? '[ REDACTED ]' : '72-hour operational audit complete. Zero downtime recorded.'}
              </div>
            </div>

            {/* Product 2: OMNI-AD */}
            <div className={`p-4 bg-slate-950/80 border border-slate-800/50 rounded-sm relative group ${isLockdownActive ? 'grayscale' : ''}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isStressTestActive ? 'bg-amber-500' : 'bg-[var(--calyx-accent)]'}`}></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase uppercase">Omni-Ad Vibe Spy</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                   isStressTestActive ? 'text-amber-400 bg-amber-500/10' : 'text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10'
                }`}>INFERENCE SYNC</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 ml-2 mt-2 uppercase">
                {isLockdownActive ? '[ REDACTED ]' : 'GPU-bound scraping nodes operating at nominal capacity.'}
              </div>
            </div>

            {/* Product 3: GDV */}
            <div className={`p-4 bg-slate-950/80 border border-slate-800/50 rounded-sm relative group ${isLockdownActive ? 'grayscale' : ''}`}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700"></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[13px] font-mono font-medium text-slate-300 uppercase uppercase">Global Digital Vault</span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">COLD_STORAGE</span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 ml-2 mt-2 italic uppercase">
                 {isLockdownActive ? '[ REDACTED ]' : 'Awaiting persistent volume claim for blob migration.'}
              </div>
            </div>

            {/* Wildcard: Bhilai Node Solution */}
            <div className="p-4 bg-slate-950/40 border border-slate-800/30 border-dashed rounded-sm relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800"></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[12px] font-mono font-medium text-slate-500 uppercase uppercase">Bhilai Clinic Node</span>
                <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded uppercase">R&D Phase</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 ml-2 italic uppercase">Scoping digital appointment ecosystem.</span>
            </div>
          </div>
        </div>

        {/* PANE B: Strategic Command Matrix (7 Columns) */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-6 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Stress Test & Simulation Triggers</span>
            <span className={`text-[9px] font-mono uppercase transition-colors ${
              isLockdownActive ? 'text-red-500' : 'text-[var(--calyx-accent)]'
            }`}>{isLockdownActive ? 'LOCKED' : 'Armed'}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {/* Trigger 1: Global Load */}
            <div 
              onClick={toggleStressTest}
              className={`flex flex-col p-5 bg-slate-900/60 border transition-all cursor-pointer group ${
                isStressTestActive ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-[var(--calyx-accent)]/50'
              }`}
            >
              <span className={`text-[10px] font-mono transition-colors uppercase ${
                isStressTestActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}>{isStressTestActive ? 'STOP_STRESS_TEST' : 'Trigger Global Stress Test'}</span>
              <span className="text-[9px] font-mono text-slate-600 mt-2">Simulates 100k requests/sec across all node pools.</span>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isStressTestActive ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isStressTestActive ? 'bg-amber-500 animate-pulse delay-75' : 'bg-slate-700'}`}></div>
                </div>
                <span className={`text-[9px] font-mono transition-all duration-300 ${
                  isStressTestActive ? 'text-amber-400 font-bold' : 'text-slate-500'
                }`}>{isStressTestActive ? '[ EXECUTING ]' : '[ INACTIVE ]'}</span>
              </div>
            </div>

            {/* Trigger 2: Vault Lockdown */}
            <div 
              onClick={toggleLockdown}
              className={`flex flex-col p-5 bg-slate-900/60 border transition-all cursor-pointer group ${
                isLockdownActive ? 'border-red-500 bg-red-500/5 shadow-lg shadow-red-500/10' : 'border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <span className={`text-[10px] font-mono transition-colors uppercase ${
                isLockdownActive ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'
              }`}>{isLockdownActive ? 'TERMINATE_LOCKDOWN' : 'Initiate Vault Lockdown'}</span>
              <span className="text-[9px] font-mono text-slate-600 mt-2">Severs all API gateways and rotates cryptographic keys.</span>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isLockdownActive ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isLockdownActive ? 'bg-red-500 animate-ping delay-150' : 'bg-slate-700'}`}></div>
                </div>
                <span className={`text-[9px] font-mono transition-all duration-300 ${
                  isLockdownActive ? 'text-red-400 font-bold' : 'text-slate-500'
                }`}>{isLockdownActive ? '[ ACTIVE ]' : '[ INACTIVE ]'}</span>
              </div>
            </div>

            {/* Product Map: 2D Grid Representation */}
            <div className="col-span-1 sm:col-span-2 bg-slate-950/80 border border-slate-800/80 rounded-sm p-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Strategic Coverage Matrix</span>
                    <span className={`text-[11px] font-mono ${isLockdownActive ? 'text-red-400' : 'text-[var(--calyx-accent)]'}`}>92%</span>
                </div>
                <div className="flex gap-2 h-12">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${
                          i < 10 
                            ? (isLockdownActive ? 'bg-red-500/20' : (isStressTestActive ? 'bg-amber-500/40' : 'bg-[var(--calyx-accent)]/40')) 
                            : 'bg-slate-800/30'
                        }`}></div>
                    ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    <span>Alpha</span>
                    <span>Beta</span>
                    <span>Production</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
