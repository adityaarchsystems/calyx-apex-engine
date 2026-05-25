import { NextResponse } from 'next/server';
import { redis, supabase, ctx } from '@/lib/api-clients';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    try {
        const { _calyx_hp, handle, msg } = await request.json();
        if (!handle || !msg) {
            return NextResponse.json(
                { error: 'Missing handle or msg parameters.' },
                { status: 400 }
            );
        }

        // Honeypot check
        if (_calyx_hp) {
            console.log(`🤖 [BOT SPAM BLOCK]: Bot triggered honeypot field. Terminating transaction silently.`);
            return NextResponse.json({ success: true, message: 'Message securely processed.' });
        }

        // Rate Limiter
        try {
            const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
            const ipKey = `rate-limit:${clientIp}`;
            
            const bucketData = await redis.hgetall(ipKey) as Record<string, string> | null;
            
            const B = 5.0;
            const r = 1.0 / 60.0;
            const nowSecs = Date.now() / 1000.0;
            
            let lastTokens = B;
            let lastTimestamp = nowSecs;
            
            if (bucketData && bucketData.tokens && bucketData.timestamp) {
                lastTokens = parseFloat(bucketData.tokens);
                lastTimestamp = parseFloat(bucketData.timestamp);
            }
            
            const replenishedTokens = Math.min(B, lastTokens + r * (nowSecs - lastTimestamp));
            
            if (replenishedTokens < 1.0) {
                console.warn(`🛑 [RATE LIMIT EXCEEDED] Blocking IP ${clientIp}`);
                return NextResponse.json(
                    { error: 'Too many submissions. IP Rate-limit window locked.' },
                    { status: 429 }
                );
            }
            
            const finalTokens = replenishedTokens - 1.0;
            
            ctx.waitUntil(
                redis.hset(ipKey, {
                    tokens: finalTokens.toString(),
                    timestamp: nowSecs.toString()
                }).then(() => redis.expire(ipKey, 3600))
            );

            console.log(`--- [FORM RELAY CAPTURE] RELAYING SUBMISSION FOR ${userId} ---`);
            ctx.waitUntil(
                supabase.channel('sync_health_stream').send({
                    type: 'broadcast',
                    event: 'system_error',
                    payload: {
                        logId: `form-${Date.now()}`,
                        originatingNodeId: `FormRelayNode`,
                        integrationTarget: 'GITHUB',
                        errorCode: 'CONNECTION_TIMEOUT',
                        rawErrorMessage: `[FORM TRANSMISSION CAPTURED] From: @${handle} | Message: ${msg}`,
                        firedAt: new Date().toISOString()
                    }
                })
            );

            return NextResponse.json({ success: true, message: 'Stateless form capture relayed to Room D logs.' });
        } catch (rlErr: any) {
            console.error('Rate limit execution error:', rlErr);
            return NextResponse.json({ success: true, message: 'Message fallback bypass.' });
        }
    } catch (error: any) {
        console.error('❌ FORM CAPTURE RELAY EXCEPTION:', error);
        return NextResponse.json(
            { error: 'Form capture relay failed.', message: error.message },
            { status: 500 }
        );
    }
}
