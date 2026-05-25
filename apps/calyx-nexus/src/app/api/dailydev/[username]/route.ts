import { NextResponse } from 'next/server';
import { redis, ctx } from '@/lib/api-clients';
import { DailyDevIdentityProfile } from '@cpm/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    if (!username) {
        return NextResponse.json({ error: 'Missing username parameter.' }, { status: 400 });
    }

    const token = "dda_dbOV3Dw1RnoI3g6A7lPHOVSzvgiOb_o1egt2_SA_QM4";

    // Handle special popular/trending query
    if (username === "popular" || username === "trending") {
        const cacheKeyPopular = `dailydev:popular-feed`;
        try {
            const cachedFeed = await redis.get(cacheKeyPopular);
            if (cachedFeed) {
                const parsed = typeof cachedFeed === 'string' ? JSON.parse(cachedFeed) : cachedFeed;
                return NextResponse.json({ success: true, data: parsed });
            }

            const feedRes = await fetch("https://api.daily.dev/public/v1/feeds/popular", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "User-Agent": "Calyx-Nexus-Dashboard"
                }
            });
            if (feedRes.ok) {
                const feedJson = await feedRes.json();
                if (feedJson.data) {
                    ctx.waitUntil(redis.set(cacheKeyPopular, JSON.stringify(feedJson.data), { ex: 300 }));
                    return NextResponse.json({ success: true, data: feedJson.data });
                }
            }
            throw new Error(`daily.dev feed returned status: ${feedRes.status}`);
        } catch (feedErr: any) {
            console.error("Failed to fetch dailydev feed:", feedErr);
            return NextResponse.json({ success: true, data: [] });
        }
    }

    const cacheKey = `dailydev:profile:${username.toLowerCase()}`;

    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return NextResponse.json({ success: true, data: parsed });
        }
        
        // 1. Fetch from daily.dev GraphQL Gateway
        const graphqlQuery = `
            query {
                user(id: "ofZO9eh6Y9yOqnEq5h6hf") {
                    id
                    username
                    name
                    reputation
                    createdAt
                    image
                }
            }
        `;
        
        let reputation = 10;
        let fetchedUsername = username;
        try {
            const gqlRes = await fetch("https://api.daily.dev/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "User-Agent": "Calyx-Nexus-Dashboard"
                },
                body: JSON.stringify({ query: graphqlQuery })
            });
            if (gqlRes.ok) {
                const gqlJson = await gqlRes.json();
                if (gqlJson.data && gqlJson.data.user) {
                    reputation = gqlJson.data.user.reputation || 10;
                    fetchedUsername = gqlJson.data.user.username || username;
                }
            }
        } catch (gqlErr) {
            console.error("Failed to query daily.dev GraphQL gateway:", gqlErr);
        }

        // 2. Fetch bookmarks count from REST API
        let bookmarksCount = 0;
        try {
            const bookmarkRes = await fetch("https://api.daily.dev/public/v1/bookmarks/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "User-Agent": "Calyx-Nexus-Dashboard"
                }
            });
            if (bookmarkRes.ok) {
                const bookmarkJson = await bookmarkRes.json();
                if (bookmarkJson.data && Array.isArray(bookmarkJson.data)) {
                    bookmarksCount = bookmarkJson.data.length;
                }
            }
        } catch (bkErr) {
            console.error("Failed to fetch daily.dev bookmarks count:", bkErr);
        }

        const profile: DailyDevIdentityProfile = {
            username: fetchedUsername,
            readingStreak: 12,
            bookmarksCount: bookmarksCount,
            favoriteTags: [
                "AI-assisted (33%)",
                "ChatGPT (17%)",
                "Design-systems (17%)",
                "DevTools (17%)"
            ],
            reputation: reputation,
            lastActiveAt: new Date().toISOString()
        };

        ctx.waitUntil(redis.set(cacheKey, JSON.stringify(profile), { ex: 300 }));

        return NextResponse.json({ success: true, data: profile });
    } catch (error: any) {
        console.error('❌ DAILY.DEV API PROXY EXCEPTION:', error);
        return NextResponse.json(
            { error: 'Failed to fetch daily.dev profile.', message: error.message },
            { status: 500 }
        );
    }
}
