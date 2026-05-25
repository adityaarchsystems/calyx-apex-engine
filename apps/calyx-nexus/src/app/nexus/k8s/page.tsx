export default function KubernetesTerminal() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: Cluster Health & Node Telemetry */}
      <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-200 uppercase">GKE / Kubernetes Engine</h1>
            <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
              Containerized cluster orchestration. Managing pod scaling, namespace isolation, and node pool health for the Calyx ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase ml-1">Cluster Stable</span>
          </div>
        </div>

        {/* Cluster Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Node Pools</span>
            <span className="text-[11px] font-mono text-slate-300 uppercase">02 Active (e2-standard-4)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">CPU Pressure</span>
            <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">24.2% Utilization</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Memory Load</span>
            <span className="text-[11px] font-mono text-slate-300 uppercase">4.1 GB / 16.0 GB</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Pod Status</span>
            <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">12/12 Running</span>
          </div>
        </div>
      </div>

      {/* MAIN TERMINAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
        
        {/* PANE A: Pod Lifecycle & Namespaces (5 Columns) */}
        <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm overflow-hidden">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
            <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Namespace Orchestration
          </span>

          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col p-4 bg-slate-950/80 border border-slate-700/50 rounded-sm relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">ns/folio-production</span>
                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">6 Pods Active</span>
              </div>
              <div className="flex flex-col gap-1 ml-2 mt-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase">ReplicaSets:</span>
                    <span className="text-[var(--calyx-accent)] uppercase">Synced</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                    <span className="text-slate-500 uppercase">Health:</span>
                    <span className="text-[var(--calyx-accent)] uppercase">Ready [1.0]</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-slate-950/80 border border-slate-700/50 rounded-sm relative group overflow-hidden mt-2">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">ns/omni-ad-inference</span>
                <span className="text-[9px] font-mono text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10 px-1.5 py-0.5 rounded uppercase">4 Pods Active</span>
              </div>
              <div className="flex flex-col gap-1 ml-2 mt-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase">Gateway:</span>
                    <span className="text-slate-300 uppercase">Ingress-Traffic</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono mt-1">
                    <span className="text-slate-500 uppercase">GPU Bound:</span>
                    <span className="text-[var(--calyx-accent)] font-bold uppercase">True</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-slate-950/40 border border-slate-800/40 border-dashed rounded-sm relative group mt-2">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700"></div>
              <div className="flex justify-between items-start mb-2 ml-2">
                <span className="text-[12px] font-mono font-medium text-slate-500 uppercase">ns/gdv-vault-storage</span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded uppercase">2 Pods Standby</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 ml-2 mt-2 italic uppercase">Awaiting persistent volume claim (PVC)...</span>
            </div>
          </div>
        </div>

        {/* PANE B: Cluster Log & Resource Pressure (7 Columns) */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-0 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50 absolute top-0 w-full z-10">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Kubectl Event Log</span>
            <span className="text-[9px] font-mono tracking-wider text-indigo-400 uppercase">IND-Node (Bhilai)</span>
          </div>
          
          <div className="flex flex-col h-full pt-16 px-6 pb-6 font-mono text-[11px] text-slate-500 leading-relaxed overflow-y-auto">
            <div className="text-slate-600 mb-3 uppercase">{`// Kube-Proxy initializing... Established`}</div>
            
            <div className="flex gap-4 mb-1 uppercase">
                <span className="text-slate-600 uppercase">Info</span>
                <span className="text-slate-400">Successfully assigned ns/folio-production pod to node-pool-1</span>
            </div>
            <div className="flex gap-4 mb-1 uppercase">
                <span className="text-slate-600 uppercase">Info</span>
                <span className="text-slate-400">Pulling image "gcr.io/calyx-studios/folio-beta:v1.0.4"</span>
            </div>
            <div className="flex gap-4 mb-1 uppercase">
                <span className="text-[var(--calyx-accent)] uppercase font-bold">Ready</span>
                <span className="text-slate-400">Container "folio-core" started successfully. Health check 200 OK.</span>
            </div>
            <div className="flex gap-4 mb-1 mt-3 uppercase">
                <span className="text-slate-600 uppercase">Info</span>
                <span className="text-slate-400">HorizontalPodAutoscaler triggered for ns/omni-ad-inference</span>
            </div>
            <div className="flex gap-4 mb-1 uppercase">
                <span className="text-slate-600 uppercase">Info</span>
                <span className="text-[var(--calyx-accent)] uppercase">{`Scaling replicas [4 -> 6] based on GPU resource pressure.`}</span>
            </div>
            <div className="flex gap-4 mb-4 mt-3 uppercase">
                <span className="text-indigo-400 uppercase">Event</span>
                <span className="text-indigo-400/80 italic uppercase">Global Digital Vault volume mount initialized. Awaiting encryption handshake.</span>
            </div>
            
            <div className="flex items-center mt-auto pt-4 border-t border-slate-800/50">
                <span className="text-indigo-400 font-bold uppercase">{`kubectl@calyx-nexus:~$ `}</span>
                <span className="w-1.5 h-3 bg-indigo-500 ml-2 animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
