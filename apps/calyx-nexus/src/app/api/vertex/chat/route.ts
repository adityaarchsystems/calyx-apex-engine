import { NextResponse } from 'next/server';
import { generateGeminiContent } from '@/lib/google/vertex';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }

        // daily-dev-ask: Grab community-vetted technical articles from daily.dev
        let groundedPrompt = prompt;
        try {
            const dailyDevToken = "dda_dbOV3Dw1RnoI3g6A7lPHOVSzvgiOb_o1egt2_SA_QM4";
            const recommendUrl = `https://api.daily.dev/public/v1/recommend/keyword?q=${encodeURIComponent(prompt)}&limit=3`;
            const recommendRes = await fetch(recommendUrl, {
                headers: {
                    "Authorization": `Bearer ${dailyDevToken}`,
                    "User-Agent": "Calyx-Nexus-Dashboard"
                }
            });
            if (recommendRes.ok) {
                const recommendData = await recommendRes.json();
                if (recommendData.data && recommendData.data.length > 0) {
                    const articlesContext = recommendData.data.map((art: any) => 
                        `[Article] Title: ${art.title}\nSummary: ${art.summary}\nURL: ${art.url}`
                    ).join("\n\n");
                    
                    groundedPrompt = `System Grounding Context (daily.dev RAG):\n${articlesContext}\n\nUser Prompt: ${prompt}`;
                }
            }
        } catch (ragError) {
            console.error("daily.dev RAG grounding lookup failed:", ragError);
        }

        const reply = await generateGeminiContent(groundedPrompt);
        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Gemini Vertex error:', error);
        return NextResponse.json(
            { error: 'Failed to generate Vertex AI content.', details: error.message },
            { status: 500 }
        );
    }
}
