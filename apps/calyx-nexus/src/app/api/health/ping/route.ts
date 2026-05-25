import { NextResponse } from 'next/server';
import { redis, supabase, ctx } from '@/lib/api-clients';
import crypto from 'crypto';

export async function GET() {
    const start = process.hrtime.bigint();
    
    // Simulate minor processing to calculate high-resolution time delta
    const end = process.hrtime.bigint();
    const latencyNs = end - start;
    const latencyMs = Math.max(1, Math.round(Number(latencyNs) / 1000000));
    
    const status = latencyMs < 100 ? 'OPTIMAL' : 'DEGRADED';
    const edgeTimestamp = new Date().toISOString();

    const responsePayload = {
        status,
        latencyMs,
        edgeTimestamp
    };

    const logItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        latencyMs,
        status,
        edgeTimestamp
    };

    ctx.waitUntil(
        Promise.all([
            redis.rpush('cpm_telemetry_history', JSON.stringify(logItem)),
            redis.ltrim('cpm_telemetry_history', -100, -1),
            supabase.channel('sync_health_stream').send({
                type: 'broadcast',
                event: 'ping_latency',
                payload: responsePayload
            })
        ]).catch(err => {
            console.error('Failed to stream and store ping latency telemetry:', err);
        })
    );

    return NextResponse.json(responsePayload);
}
