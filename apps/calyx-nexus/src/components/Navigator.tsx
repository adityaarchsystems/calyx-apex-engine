'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSystem } from '@/context/SystemContext';

export default function Navigator() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toggleStressTest, toggleLockdown, runDiagnostics } = useSystem();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
                e.preventDefault();
                setOpen((o) => !o);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

  if (!open) return null;

  const routes = [
    { n: 'APEX DASHBOARD', p: '/', t: 'GOTO_NODE' },
    { n: 'TELEMETRY COMMAND HUB', p: '/dashboard', t: 'GOTO_NODE' },
    { n: 'SNAP ANALYTICS', p: '/analytics', t: 'GOTO_NODE' },
    { n: 'CONTROL CENTER', p: '/integrations', t: 'GOTO_NODE' },
    { n: 'ECOSYSTEM VAULT', p: '/nexus/vault', t: 'GOTO_NODE' },
    { n: 'NEURAL COMPUTE', p: '/nexus/compute', t: 'GOTO_NODE' },
    { n: 'GCP CLOUD RUN', p: '/nexus/cloud-run', t: 'GOTO_NODE' },
    { n: 'GEAR EDGE HUB', p: '/nexus/gear', t: 'GOTO_NODE' },
    { n: 'VERTEX AI LAB', p: '/nexus/vertex', t: 'GOTO_NODE' },
    { n: 'K8S CLUSTER', p: '/nexus/k8s', t: 'GOTO_NODE' },
    { n: 'GITHUB MATRIX', p: '/nexus/matrix', t: 'GOTO_NODE' },
    { n: 'IMPACT GLOBE', p: '/nexus/globe', t: 'GOTO_NODE' },
    { n: 'CALYX CODEX', p: '/nexus/codex', t: 'GOTO_NODE' },
  ];

  const actions = [
    { n: 'SYS_DIAGNOSTICS', a: runDiagnostics, t: 'EXECUTE' },
    { n: 'INIT_STRESS_TEST', a: toggleStressTest, t: 'TOGGLE' },
    { n: 'INIT_LOCKDOWN', a: toggleLockdown, t: 'TOGGLE' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#070e16] border border-slate-800 shadow-2xl rounded-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">System Navigator</span>
          <span className="text-[9px] font-mono text-[var(--calyx-accent)]">CMD + SHIFT + K</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* Operational Commands - Decoupled from Routing */}
          <div className="mb-2">
            <span className="px-3 py-1 text-[9px] font-mono text-slate-600 uppercase tracking-widest">Operational Commands</span>
            {actions.map((act) => (
              <button
                key={act.n}
                onClick={() => { 
                  act.a(); 
                  setOpen(false); 
                }}
                className="w-full text-left p-3 flex justify-between items-center hover:bg-amber-500/10 group transition-colors rounded-sm mt-1"
              >
                <span className="text-[12px] font-mono text-amber-500/80 group-hover:text-amber-400 uppercase tracking-tight">{act.n}</span>
                <span className="text-[9px] font-mono text-slate-600 group-hover:text-amber-500">{act.t}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800/50 mt-4 pt-2">
            <span className="px-3 py-1 text-[9px] font-mono text-slate-600 uppercase tracking-widest">Infrastructure Nodes</span>
            {routes.map((r) => (
              <button
                key={r.p}
                onClick={() => { 
                  router.push(r.p); 
                  setOpen(false); 
                }}
                className="w-full text-left p-3 flex justify-between items-center hover:bg-[var(--calyx-accent)]/10 group transition-colors rounded-sm mb-1"
              >
                <span className="text-[12px] font-mono text-slate-400 group-hover:text-slate-200 uppercase tracking-tight">{r.n}</span>
                <span className="text-[9px] font-mono text-slate-600 group-hover:text-[var(--calyx-accent)]">{r.t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
