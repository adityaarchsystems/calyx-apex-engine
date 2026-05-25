
/**
 * CALYX NEXUS — Impact Math Engine
 * Implements the logarithmic normalization formula defined in Phase 2.1
 */

export interface GitHubStats {
  commits: number;
  pullRequests: number;
  stars: number;
  forks: number;
}

const WEIGHTS = {
  commits: 1.0,
  pullRequests: 1.5,
  stars: 0.5,
  forks: 0.8,
};

/**
 * Calculates the normalized Developer Impact Score
 * I = log(C)·w1 + log(PR)·w2 + log(S)·w3 + log(F)·w4
 */
export function calculateImpactScore(stats: GitHubStats): number {
  const { commits, pullRequests, stars, forks } = stats;

  // Use Math.log1p(x) to handle log(0) cases gracefully as log(1+x)
  const score = 
    Math.log1p(commits) * WEIGHTS.commits +
    Math.log1p(pullRequests) * WEIGHTS.pullRequests +
    Math.log1p(stars) * WEIGHTS.stars +
    Math.log1p(forks) * WEIGHTS.forks;

  return parseFloat(score.toFixed(2));
}

/**
 * Normalizes daily contribution counts for heatmap opacity (0 to 1 scale)
 */
export function normalizeDailyIntensity(count: number, maxCount: number = 10): number {
  if (count === 0) return 0;
  // Logarithmic scale for color intensity to show variance in low-activity zones
  const intensity = Math.log1p(count) / Math.log1p(maxCount);
  return Math.min(1, parseFloat(intensity.toFixed(2)));
}
