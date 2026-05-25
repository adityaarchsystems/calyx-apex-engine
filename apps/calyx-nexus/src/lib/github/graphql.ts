import { validateCredentials } from "../config/credentials";

export const GITHUB_GRAPHQL_QUERY = `
    query($username: String!) {
        user(login: $username) {
            login
            contributionsCollection {
                totalCommitContributions
                totalPullRequestReviewContributions
                totalPullRequestContributions
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                        }
                    }
                }
            }
            repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
                nodes {
                    name
                    description
                    url
                    stargazerCount
                    forkCount
                    primaryLanguage {
                        name
                    }
                }
            }
        }
    }
`;

export async function fetchGitHubData(username: string = "adityaarchsystems") {
    // strict credential guard check
    validateCredentials();

    const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
    const apiBase = process.env.GITHUB_API_BASE || "https://api.github.com/graphql";
    
    try {
        const response = await fetch(apiBase, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "Calyx-Nexus-Dashboard",
            },
            body: JSON.stringify({
                query: GITHUB_GRAPHQL_QUERY,
                variables: { username }
            }),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error("[GITHUB_GRAPHQL_ERROR]", response.status, response.statusText);
            throw new Error(`[CRITICAL] GitHub GraphQL API failed with status ${response.status}`);
        }

        const json = await response.json();
        if (json.errors) {
            console.error("[GITHUB_GRAPHQL_ERROR] GraphQL Errors:", JSON.stringify(json.errors));
            throw new Error(`[CRITICAL] GitHub GraphQL API returned errors: ${JSON.stringify(json.errors)}`);
        }

        const data = json.data;
        if (data && data.user) {
            const targetRepos = ['gemini-to-antigravity-migration', 'calyx-apex-engine', 'dailydev-hackathon-2026', 'architecture-sheets'];
            if (data.user.repositories && data.user.repositories.nodes) {
                data.user.repositories.nodes.sort((a: any, b: any) => {
                    const aTarget = targetRepos.some(t => t.toLowerCase() === a.name.toLowerCase());
                    const bTarget = targetRepos.some(t => t.toLowerCase() === b.name.toLowerCase());
                    if (aTarget && !bTarget) return -1;
                    if (!aTarget && bTarget) return 1;
                    return 0;
                });
            }
            // Align viewer to user for backwards compatibility
            data.viewer = data.user;
        }

        return data;
    } catch (error) {
        console.error("[GITHUB_GRAPHQL_FATAL]", error);
        throw error;
    }
}

