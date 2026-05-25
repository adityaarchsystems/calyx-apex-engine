import Link from "next/link";
import { fetchGitHubData } from "@/lib/github/graphql";
import { calculateImpactScore } from "@/lib/github/impact";
import { GitHubHeatmap } from "@/components/ui/github-heatmap";

export default async function GitHubMatrixModule({ username = "adityaarchsystems" }: { username?: string } = {}) {
    const githubData = await fetchGitHubData(username);
    const githubStats = {
        commits: githubData?.user?.contributionsCollection?.totalCommitContributions || 0,
        pullRequests: (githubData?.user?.contributionsCollection?.totalPullRequestReviewContributions || 0) + 
                      (githubData?.user?.contributionsCollection?.totalPullRequestContributions || 0),
        stars: githubData?.user?.repositories?.nodes?.reduce((acc: number, curr: any) => acc + (curr.stargazerCount || 0), 0) || 0,
        forks: githubData?.user?.repositories?.nodes?.reduce((acc: number, curr: any) => acc + (curr.forkCount || 0), 0) || 0,
    };

    const impactScore = calculateImpactScore(githubStats);
    
    // Muted Palette Progression - Mandate 2.1
    const getMutedColor = (intensity: number) => {
        const palette = [
            "rgba(15, 23, 42, 0.4)", // Level 0: Slate 900
            "var(--calyx-accent-soft)", // Level 1
            "rgba(var(--calyx-accent-rgb), 0.4)", // Level 2
            "var(--calyx-accent)", // Level 3
        ];
        return palette[intensity] || palette[0];
    };

    const weeks = githubData?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const allDays = weeks.flatMap((w: any) => w.contributionDays || []);
    const last28Days = allDays.slice(-28);

    const getIntensity = (count: number) => {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        return 3;
    };

    return (
        <div className="w-full h-full relative flex flex-col justify-between overflow-hidden p-6 sm:p-8">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-calyx-text-muted">
                        MODULE 04
                    </span>
                    <div className="bg-[#a855f7] w-2 h-2 rounded-sm opacity-80 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                </div>
                
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-medium tracking-tight text-slate-200">GitHub Matrix</h2>
                    <p className="text-[13px] leading-relaxed text-slate-400/80 max-w-[95%]">
                        GraphQL v4 deep extraction — commit velocity, PR review turnaround, and algorithmic impact scoring via logarithmic normalization.
                    </p>
                </div>
            </div>

            {/* Centered Commit Heatmap Matrix to eliminate offsets */}
            <div className="w-full flex-grow flex items-center justify-center p-4">
                <GitHubHeatmap weeks={weeks} />
            </div>

            {/* Premium action button at lower-left */}
            <div className="flex items-end justify-between w-full mt-auto">
                <Link
                    href="/nexus/matrix"
                    prefetch={true}
                    className="px-4 py-2 border border-neutral-800 rounded text-[11px] font-mono tracking-wider transition-all duration-200 hover:border-[#a855f7]/40 hover:bg-[#a855f7]/5 text-neutral-300 uppercase flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                >
                    <span>ANALYZE COMMITS</span>
                    <span className="text-[8px] opacity-60">■</span>
                </Link>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    IMPACT: {impactScore}
                </span>
            </div>
        </div>
    );
}

