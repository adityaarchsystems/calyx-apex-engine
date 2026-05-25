'use client';

import { useState } from 'react';

export default function VertexTerminal() {
  const [prompt, setPrompt] = useState("");
  const [streamText, setStreamText] = useState("> [SYSTEM]: Initialize sandbox... Ready for instruction.");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setStreamText("> [API_TUNING]: Querying Google Gemini Pro endpoint...");
    try {
      const res = await fetch("/api/vertex/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setStreamText(data.reply || "> [RESPONSE]: Empty completion returned.");
      } else {
        const errData = await res.json();
        setStreamText(`> [ERROR]: Inference failed (${res.status}). Details: ${errData.details || errData.error || 'Server Action Failure'}`);
      }
    } catch (err: any) {
      setStreamText(`> [ERROR]: Network bridge connection failed. Details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: Model Registry Telemetry */}
      <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-200">Vertex AI / Model Management</h1>
            <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
              Enterprise model orchestration. Managing Gemini endpoints, fine-tuned registry, and prompt engineering laboratories.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase ml-1">Vertex Connected</span>
          </div>
        </div>

        {/* Model Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Registry Nodes</span>
            <span className="text-[11px] font-mono text-blue-400">03 ACTIVE</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Avg Latency</span>
            <span className="text-[11px] font-mono text-slate-300">842ms (GEMINI-PRO)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Subscription</span>
            <span className="text-[11px] font-mono text-slate-300">GOOGLE AI PRO / 5TB</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Endpoint Status</span>
            <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* MAIN TERMINAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
        
        {/* PANE A: Model Registry (5 Columns) */}
        <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm overflow-hidden">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6">Fine-Tuned Registry</span>

          <div className="flex flex-col gap-4 h-full">
            {/* Model Card 1: Gemma 4 e2b */}
            <div className="flex flex-col p-4 bg-slate-950/80 border border-slate-700/50 rounded-sm">
                <span className="text-[13px] font-mono font-medium text-slate-200 uppercase">Gemma 4 e2b</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">Location: Connected Edge Node [Xiaomi]</span>
                <div className="mt-3 flex gap-2">
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded uppercase">GEMMA-EDGE-2B</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Active</span>
                </div>
            </div>

            {/* Model Card 2: Gemma 4 e4b */}
            <div className="flex flex-col p-4 bg-slate-950/50 border border-slate-800/50 rounded-sm">
                <span className="text-[13px] font-mono font-medium text-slate-300 uppercase">Gemma 4 e4b</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">Location: Connected Edge Node [Realme]</span>
                <div className="mt-3 flex gap-2">
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded uppercase">GEMMA-EDGE-4B</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Active</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Token Quota</span>
                <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">UNLIMITED</span>
            </div>
          </div>
        </div>

        {/* PANE B: Prompt Laboratory (7 Columns) */}
        <div className="col-span-1 md:col-span-7 flex flex-col p-0 bg-[#020617] border border-slate-800/50 rounded-sm overflow-hidden relative">
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Interactive Prompt Lab</span>
            <span className="text-[9px] font-mono text-[var(--calyx-accent)] uppercase animate-pulse">
                {loading ? "PROCESSING..." : "IDLE"}
            </span>
          </div>
          
          <div className="flex flex-col p-6 gap-6 h-full">
            {/* System Prompt Input */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Prompt Laboratory Input</span>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter prompt tuning instruction..."
                    className="w-full min-h-[100px] p-4 bg-slate-900/40 border border-slate-800/80 rounded-sm font-mono text-[11px] text-slate-300 focus:outline-none focus:border-[var(--calyx-accent)]/85 placeholder-slate-600 resize-y"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="px-4 py-2 border border-purple-500/50 bg-[#a855f7]/5 hover:bg-[#a855f7]/15 rounded-sm text-xs font-mono font-bold tracking-widest text-zinc-200 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                    {loading ? "EXECUTING..." : "EXECUTE INFERENCE"}
                </button>
            </form>

            {/* Live Output */}
            <div className="flex-grow flex flex-col gap-2">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Inference Output Viewport</span>
                <div className="flex-grow bg-slate-950 border border-slate-800/80 rounded-sm p-4 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[300px] min-h-[150px] relative">
                    <div className="text-slate-300 whitespace-pre-wrap">
                      {streamText}
                      {loading && <span className="inline-block w-1.5 h-3 bg-purple-500 ml-1 animate-pulse"></span>}
                    </div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
