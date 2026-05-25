import { NextResponse } from 'next/server';
import { redis, supabase, ctx } from '@/lib/api-clients';
import { validateCredentials } from './config/credentials';

export async function handleGithubImport(request: Request) {
    try {
        const { username } = await request.json();
        if (!username) {
            return NextResponse.json(
                { error: 'Missing GitHub username in request body.' },
                { status: 400 }
            );
        }

        // strict credentials validation
        validateCredentials();

        const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;

        const graphqlHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'User-Agent': 'Calyx-Profile-Matrix-Sync-Engine',
            'Authorization': `bearer ${token}`
        };

        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const variables = {
            username,
            from: oneYearAgo.toISOString(),
            to: now.toISOString()
        };

        const query = `
            query ($username: String!, $from: DateTime, $to: DateTime) {
                user(login: $username) {
                    bio
                    createdAt
                    contributionsCollection(from: $from, to: $to) {
                        totalCommitContributions
                        totalPullRequestContributions
                        totalIssueContributions
                        totalPullRequestReviewContributions
                        contributionCalendar {
                            totalContributions
                        }
                    }
                    repositories(first: 50, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER) {
                        nodes {
                            name
                            description
                            homepageUrl
                            stargazerCount
                            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    size
                                    node {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        let repos: any[] = [];
        let userBio = '';
        let hasGraphQLData = false;
        let contributions = 0;
        let totalCommitContributions = 0;
        let openSourceContributionCount = 0;
        let accountCreationYear = '2022';

        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: graphqlHeaders,
                body: JSON.stringify({ query, variables })
            });

            if (response.ok) {
                const resJson = await response.json();
                const user = resJson.data?.user;
                if (user) {
                    userBio = user.bio || '';
                    repos = user.repositories?.nodes || [];
                    contributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
                    totalCommitContributions = user.contributionsCollection?.totalCommitContributions || 0;
                    openSourceContributionCount = (user.contributionsCollection?.totalPullRequestContributions || 0) +
                        (user.contributionsCollection?.totalIssueContributions || 0) +
                        (user.contributionsCollection?.totalPullRequestReviewContributions || 0);
                    accountCreationYear = user.createdAt ? new Date(user.createdAt).getFullYear().toString() : '2022';
                    hasGraphQLData = true;
                }
            }
        } catch (err) {
            console.error('--- GitHub GraphQL API Error ---', err);
        }

        if (!hasGraphQLData || repos.length === 0) {
            console.error('[CRITICAL] Ingestion Token Missing or GraphQL Fetch Failed');
            return NextResponse.json({ error: '[CRITICAL] Ingestion Token Missing or GraphQL Fetch Failed' }, { status: 400 });
        }

        const targetRepos = ['gemini-to-antigravity-migration', 'calyx-apex-engine', 'dailydev-hackathon-2026', 'architecture-sheets'];
        repos.sort((a, b) => {
            const aTarget = targetRepos.some(t => t.toLowerCase() === a.name.toLowerCase());
            const bTarget = targetRepos.some(t => t.toLowerCase() === b.name.toLowerCase());
            if (aTarget && !bTarget) return -1;
            if (!aTarget && bTarget) return 1;
            return 0;
        });

        let systemsBytes = 0;
        let webBytes = 0;
        let algoBytes = 0;
        let otherBytes = 0;

        const systemsLangs = new Set(['c', 'c++', 'rust']);
        const webLangs = new Set(['typescript', 'javascript', 'html', 'css']);
        const algoLangs = new Set(['python', 'go', 'r']);

        for (const repo of repos) {
            for (const edge of repo.languages?.edges || []) {
                const lang = edge.node.name.toLowerCase();
                const size = edge.size;
                if (systemsLangs.has(lang)) {
                    systemsBytes += size;
                } else if (webLangs.has(lang)) {
                    webBytes += size;
                } else if (algoLangs.has(lang)) {
                    algoBytes += size;
                } else {
                    otherBytes += size;
                }
            }
        }

        let themeFlavor: 'RETRO_TERMINAL' | 'LUXURY_GLASSMORPHISM' | 'SCANDI_MINIMALIST' | 'EIGHT_BIT_GIT' = 'EIGHT_BIT_GIT';
        const maxBytes = Math.max(systemsBytes, webBytes, algoBytes, otherBytes);

        if (maxBytes > 0) {
            if (systemsBytes === webBytes && systemsBytes === maxBytes) {
                themeFlavor = 'RETRO_TERMINAL';
            } else if (systemsBytes === maxBytes) {
                themeFlavor = 'RETRO_TERMINAL';
            } else if (webBytes === maxBytes) {
                themeFlavor = 'LUXURY_GLASSMORPHISM';
            } else if (algoBytes === maxBytes) {
                themeFlavor = 'SCANDI_MINIMALIST';
            } else {
                themeFlavor = 'EIGHT_BIT_GIT';
            }
        } else {
            themeFlavor = 'LUXURY_GLASSMORPHISM';
        }

        let { data: profileRecord, error: dbError } = await supabase
            .from('profiles')
            .select('id')
            .eq('github_username', username)
            .maybeSingle();

        if (dbError) throw dbError;

        if (!profileRecord) {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    github_username: username,
                    subscription_tier: 'FREE',
                    theme_flavor: themeFlavor,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select('id')
                .single();
            if (createError || !newProfile) throw createError || new Error('Failed to provision user profile.');
            profileRecord = newProfile;
        } else {
            await supabase
                .from('profiles')
                .update({ theme_flavor: themeFlavor, updated_at: new Date().toISOString() })
                .eq('id', profileRecord.id);
        }

        await supabase
            .from('canvas_nodes')
            .delete()
            .eq('profile_id', profileRecord.id);

        const seededNodes: any[] = [];
        let Y_current = 0;

        seededNodes.push({
            profile_id: profileRecord.id,
            node_type: 'HeaderNode',
            position_x: 0,
            position_y: Y_current,
            config_data: {
                title: `${username.toUpperCase()} MATRIX`,
                org: userBio || 'Ecosystem Engineering Architect'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        Y_current += 150 + 16;

        seededNodes.push({
            profile_id: profileRecord.id,
            node_type: 'BioNode',
            position_x: 0,
            position_y: Y_current,
            config_data: {
                hydrationMode: 'LIVE_API',
                apiUsername: username,
                static_values: {
                    bio: userBio || 'Systems Architect and Web tinkerer. Building modern web tools and high performance low-level frameworks.'
                }
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        Y_current += 128 + 16;

        const activeReposList = [...repos];

        const assignedMetrics = new Set<string>();

        const getUniqueMetric = (preferred: string, fallbackPriority: string[]): string => {
            if (!assignedMetrics.has(preferred)) {
                assignedMetrics.add(preferred);
                return preferred;
            }
            for (const key of fallbackPriority) {
                if (!assignedMetrics.has(key)) {
                    assignedMetrics.add(key);
                    return key;
                }
            }
            return 'accountCreationDate';
        };

        const fallbackPriority = ['totalStarsCount', 'totalCommitContributions', 'openSourceContributionCount', 'accountCreationDate'];
        const col1 = getUniqueMetric('totalStarsCount', fallbackPriority);
        const col2 = getUniqueMetric('totalCommitContributions', fallbackPriority);

        let totalStarsCountVal = 0;
        repos.forEach(r => { totalStarsCountVal += (r.stargazerCount || 0); });

        const labels: Record<string, { val: string; label: string }> = {
            totalStarsCount: { val: totalStarsCountVal.toLocaleString(), label: 'Total Repository Stars' },
            totalCommitContributions: { val: (totalCommitContributions).toLocaleString(), label: 'Commits Heatmap Index' },
            openSourceContributionCount: { val: (openSourceContributionCount).toLocaleString(), label: 'Open Source Contributions' },
            accountCreationDate: { val: accountCreationYear || '2022', label: 'Developer Since' }
        };

        seededNodes.push({
            profile_id: profileRecord.id,
            node_type: 'StatsNode',
            position_x: 0,
            position_y: Y_current,
            config_data: {
                hydrationMode: 'LIVE_API',
                apiUsername: username,
                static_values: {
                    stat1Val: labels[col1]?.val || '0',
                    stat1Label: labels[col1]?.label || 'Total Repository Stars',
                    stat2Val: labels[col2]?.val || '0',
                    stat2Label: labels[col2]?.label || 'Commits Heatmap Index'
                },
                column1Mapping: col1,
                column2Mapping: col2
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        seededNodes.push({
            profile_id: profileRecord.id,
            node_type: 'TechStackNode',
            position_x: 340,
            position_y: Y_current,
            config_data: {
                techs: Array.from(new Set(activeReposList.flatMap(r => r.languages?.edges || []).map((e: any) => e.node.name))).slice(0, 5)
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        Y_current += 128 + 16;

        const repoHeight = 256;
        for (let i = 0; i < activeReposList.length; i += 2) {
            if (i + 1 < activeReposList.length) {
                seededNodes.push({
                    profile_id: profileRecord.id,
                    node_type: 'ProductShowcaseNode',
                    position_x: 0,
                    position_y: Y_current,
                    config_data: {
                        projectTitle: activeReposList[i].name,
                        externalUrl: activeReposList[i].homepageUrl || `github.com/${username}/${activeReposList[i].name}`,
                        projectDescription: activeReposList[i].description || 'High-fidelity automated product showcase component.',
                        displayFlavor: 'MINI_BROWSER',
                        static_values: {
                            linesOfCode: `${Math.round(10 + Math.random() * 80)}k LOC`,
                            stackTags: (activeReposList[i].languages?.edges || []).slice(0, 3).map((e: any) => e.node.name)
                        }
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

                seededNodes.push({
                    profile_id: profileRecord.id,
                    node_type: 'ProductShowcaseNode',
                    position_x: 500,
                    position_y: Y_current,
                    config_data: {
                        projectTitle: activeReposList[i + 1].name,
                        externalUrl: activeReposList[i + 1].homepageUrl || `github.com/${username}/${activeReposList[i + 1].name}`,
                        projectDescription: activeReposList[i + 1].description || 'High-fidelity automated product showcase component.',
                        displayFlavor: 'MINI_BROWSER',
                        static_values: {
                            linesOfCode: `${Math.round(10 + Math.random() * 80)}k LOC`,
                            stackTags: (activeReposList[i + 1].languages?.edges || []).slice(0, 3).map((e: any) => e.node.name)
                        }
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

                Y_current += repoHeight + 16;
            } else {
                seededNodes.push({
                    profile_id: profileRecord.id,
                    node_type: 'ProductShowcaseNode',
                    position_x: 0,
                    position_y: Y_current,
                    config_data: {
                        projectTitle: activeReposList[i].name,
                        externalUrl: activeReposList[i].homepageUrl || `github.com/${username}/${activeReposList[i].name}`,
                        projectDescription: activeReposList[i].description || 'High-fidelity automated product showcase component.',
                        displayFlavor: 'MINI_BROWSER',
                        static_values: {
                            linesOfCode: `${Math.round(10 + Math.random() * 80)}k LOC`,
                            stackTags: (activeReposList[i].languages?.edges || []).slice(0, 3).map((e: any) => e.node.name)
                        }
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

                Y_current += repoHeight + 16;
            }
        }

        if (themeFlavor === 'RETRO_TERMINAL') {
            seededNodes.push({
                profile_id: profileRecord.id,
                node_type: 'LiveGuestbookNode',
                position_x: 0,
                position_y: Y_current,
                config_data: {
                    maxRollingLogs: 5,
                    allowAnonymousSignatures: true,
                    static_values: {
                        logs: [
                            { timestamp: '03:22', handle: 'admin', msg: '@calyx-dev linked' },
                            { timestamp: '04:10', handle: 'guest', msg: 'amazing portfolio!' },
                            { timestamp: '04:55', handle: 'dev', msg: '🚀 terminal node loaded' }
                        ]
                    }
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            Y_current += 192 + 16;
        }

        const { error: batchErr } = await supabase
            .from('canvas_nodes')
            .insert(seededNodes);

        if (batchErr) throw batchErr;

        const cacheKey = `github:stats:${username.toLowerCase()}`;
        ctx.waitUntil(redis.del(cacheKey));

        return NextResponse.json({
            success: true,
            message: 'One-click GitHub onboarding compilation complete.',
            theme_flavor: themeFlavor,
            nodesSeededCount: seededNodes.length
        });
    } catch (error: any) {
        console.error('❌ ONBOARDING ROUTE EXCEPTION DETECTED:', error);
        return NextResponse.json(
            { error: 'GitHub layout compilation failure.', message: error.message },
            { status: 500 }
        );
    }
}
