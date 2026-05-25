import { fetchGitHubData } from "@/lib/github/graphql";
import { GitHubHeatmap } from "@/components/ui/github-heatmap";

export default async function GitHubTerminalPage() {
  const data = await fetchGitHubData();
  
  const viewerData = data?.viewer;
  const login = viewerData?.login || "SYSTEM_OFFLINE";
  const totalCommits = viewerData?.contributionsCollection?.contributionCalendar?.totalContributions || 0;
  const weeks = viewerData?.contributionsCollection?.contributionCalendar?.weeks || [];
  const repos = viewerData?.repositories?.nodes || [];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="border-b border-calyx-border pb-6 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-calyx-platinum">GitHub Matrix</h1>
          <p className="font-mono text-[11px] text-calyx-slate tracking-widest mt-2 uppercase">Live Telemetry // {login}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-light text-calyx-turquoise">{totalCommits}</div>
          <div className="font-mono text-[10px] text-calyx-slate tracking-widest uppercase mt-1">Total Commits (365d)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-calyx-border bg-calyx-surface p-6 h-[400px] flex flex-col">
          <div className="font-mono text-[10px] text-calyx-slate tracking-widest uppercase mb-6 flex justify-between">
            <span>Contribution Graph</span>
            <span className="text-calyx-turquoise">Active</span>
          </div>
          <div className="flex-1 flex items-center justify-center border border-calyx-border/30 bg-calyx-bg/50">
            <GitHubHeatmap weeks={weeks} />
          </div>
        </div>

        <div className="border border-calyx-border bg-calyx-surface p-6 h-[400px] flex flex-col">
          <div className="font-mono text-[10px] text-calyx-slate tracking-widest uppercase mb-6">
            Top Repositories
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {repos.length === 0 ? (
              <div className="text-xs text-calyx-slate font-mono p-4 border border-calyx-border/30 bg-calyx-bg/50">
                [ NO_DATA_AVAILABLE ]
              </div>
            ) : (
              repos.map((repo: any) => (
                <div key={repo.name} className="p-4 border border-calyx-border/50 hover:border-calyx-turquoise/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <a href={repo.url} target="_blank" rel="noreferrer" className="font-bold text-sm text-calyx-platinum hover:text-calyx-turquoise transition-colors">{repo.name}</a>
                    <span className="font-mono text-[9px] px-2 py-0.5 bg-calyx-bg text-calyx-slate border border-calyx-border">{repo.primaryLanguage?.name || 'TXT'}</span>
                  </div>
                  <p className="text-xs text-calyx-slate line-clamp-2">{repo.description || 'No description provided.'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
