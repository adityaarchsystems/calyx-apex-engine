import { fetchGitHubData } from "@/lib/github/graphql";
import { GitHubHeatmap } from "@/components/ui/github-heatmap";
import { calculateImpactScore } from "@/lib/github/impact";

export const revalidate = 60;

export default async function GitHubMatrixTerminal() {
    const githubData = await fetchGitHubData("adityaarchsystems");

    const user = githubData?.user || {};
    const repos = user.repositories?.nodes || [];
    const weeks = user.contributionsCollection?.contributionCalendar?.weeks || [];

    const commits = user.contributionsCollection?.totalCommitContributions || 0;
    const reviews = user.contributionsCollection?.totalPullRequestReviewContributions || 0;
    const pullRequests = user.contributionsCollection?.totalPullRequestContributions || 0;
    const stars = repos.reduce((acc: number, curr: any) => acc + (curr.stargazerCount || 0), 0);
    const forks = repos.reduce((acc: number, curr: any) => acc + (curr.forkCount || 0), 0);

    const githubStats = { commits, pullRequests: reviews + pullRequests, stars, forks };
    const impactScore = calculateImpactScore(githubStats);

    const allDays = weeks.flatMap((w: any) => w.contributionDays || []);
    const trailing35Days = allDays.slice(-35);

    // Normalize data array to exactly 35 cells total
    const paddedDays = [
        ...Array(35 - trailing35Days.length).fill({ contributionCount: 0, date: "" }),
        ...trailing35Days
    ];

    const getOpacity = (count: number) => {
        if (count === 0) return 0.08;
        return Math.min(1.0, 0.2 + (count / 10) * 0.8);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEADER: Productivity Telemetry */}
            <div className="flex flex-col gap-6 border-b border-slate-800/50 pb-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-slate-200 uppercase">GitHub Matrix / Production</h1>
                        <p className="text-[13px] leading-relaxed text-slate-400/80 mt-1">
                            GraphQL-driven contribution extraction. Monitoring commit velocity, PR turnaround, and algorithmic impact scores for adityaarchsystems.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--calyx-accent-soft)] border border-[var(--calyx-accent)]/30 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--calyx-accent)] animate-pulse"></span>
                        <span className="text-[10px] font-mono tracking-widest text-[var(--calyx-accent)] uppercase ml-1">Live Sync</span>
                    </div>
                </div>

                {/* Productivity Telemetry Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Commits</span>
                        <span className="text-[11px] font-mono text-slate-300 uppercase">{commits} Commits</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Pull Requests</span>
                        <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">{reviews} Reviews / {pullRequests} PRs</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Impact Score</span>
                        <span className="text-[11px] font-mono text-slate-300 uppercase">{impactScore} / 100.0</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Normalization</span>
                        <span className="text-[11px] font-mono text-slate-300 uppercase">LOGARITHMIC (V4)</span>
                    </div>
                </div>
            </div>

            {/* MAIN TERMINAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-auto min-h-[500px]">
                {/* PANE A: Contribution Heatmap (5 Columns) */}
                <div className="col-span-1 md:col-span-5 flex flex-col p-6 bg-slate-900/60 border border-slate-700/30 rounded-sm">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6 flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        Developer Intensity (52-Week Map)
                    </span>

                    {/* Asset Tracking Layer Frame */}
                    <div className="flex p-4 border border-zinc-800 bg-[#06050a]/90 rounded-sm relative overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.5)]">
                        {/* Chronological Grid Frame */}
                        <div className="relative flex-grow flex items-center justify-center">
                            {/* Self-sizing wrapper for exact alignment */}
                            <div className="relative flex flex-col gap-2">
                                {/* Weekday Headers across the top columns */}
                                <div 
                                    className="grid grid-cols-7 gap-2 text-[9px] font-mono text-zinc-600 font-bold select-none text-center"
                                    style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
                                >
                                    <span className="w-5 md:w-6 flex items-center justify-center">S</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">M</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">T</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">W</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">T</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">F</span>
                                    <span className="w-5 md:w-6 flex items-center justify-center">S</span>
                                </div>

                                <div className="relative">
                                    {/* Subtle sub-border grid frames behind the cells to anchor our purple nodes */}
                                    <div 
                                        className="absolute inset-0 grid grid-cols-7 grid-rows-5 gap-2 justify-center items-center pointer-events-none opacity-20"
                                        style={{ 
                                            gridTemplateRows: "repeat(5, minmax(0, 1fr))",
                                            gridTemplateColumns: "repeat(7, minmax(0, 1fr))"
                                        }}
                                    >
                                        {Array.from({ length: 35 }).map((_, idx) => (
                                            <div
                                                key={`bg-${idx}`}
                                                className="w-5 h-5 md:w-6 md:h-6 border border-purple-500/20 rounded-sm bg-purple-500/5"
                                            />
                                        ))}
                                    </div>

                                    {/* Actual Purple Contribution Opacity Nodes */}
                                    <div 
                                        className="grid grid-cols-7 grid-rows-5 gap-2 justify-center items-center relative z-10"
                                        style={{ 
                                            gridTemplateRows: "repeat(5, minmax(0, 1fr))",
                                            gridTemplateColumns: "repeat(7, minmax(0, 1fr))"
                                        }}
                                    >
                                        {paddedDays.map((day: any, index: number) => {
                                            const opacity = getOpacity(day.contributionCount);
                                            return (
                                                <div
                                                    key={index}
                                                    title={day.date ? `${day.date}: ${day.contributionCount} contributions` : "No contributions"}
                                                    className="w-5 h-5 md:w-6 md:h-6 border border-purple-500/10 rounded-sm transition-all duration-200 hover:scale-105 hover:border-purple-500/40 cursor-help"
                                                    style={{
                                                        backgroundColor: day.date ? `rgba(168, 85, 247, ${opacity})` : "rgba(168, 85, 247, 0.08)",
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Ecosystem Ingestion</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[var(--calyx-accent)] uppercase">
                                Real-time Contribution Pipeline Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* PANE B: Repository Pulse (7 Columns) */}
                <div className="col-span-1 md:col-span-7 flex flex-col p-6 bg-slate-900/60 border border-slate-800/50 rounded-sm overflow-hidden relative">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6">
                        Active Repository Pulse
                    </span>

                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[480px]">
                        {repos.map((repo: any, index: number) => {
                            const isTarget = ['gemini-to-antigravity-migration', 'calyx-apex-engine', 'dailydev-hackathon-2026', 'architecture-sheets'].some(
                                t => t.toLowerCase() === repo.name.toLowerCase()
                            );

                            return (
                                <a
                                    key={index}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-4 bg-slate-950/80 border rounded-sm group hover:border-slate-500 transition-colors flex flex-col ${
                                        isTarget ? "border-[#a855f7]/40 shadow-[0_0_10px_rgba(168,85,247,0.05)]" : "border-slate-800"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[13px] font-mono font-medium text-slate-200 uppercase truncate pr-2">
                                            {repo.name}
                                        </span>
                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                            isTarget ? "text-[var(--calyx-accent)] bg-[var(--calyx-accent)]/10" : "text-zinc-500 bg-zinc-900"
                                        }`}>
                                            {repo.primaryLanguage?.name || "MD"}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 font-sans mb-3 line-clamp-2 uppercase">
                                        {repo.description || "No description provided."}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 mt-auto">
                                        <span>★ {repo.stargazerCount || 0}</span>
                                        <span>Ψ {repo.forkCount || 0}</span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
