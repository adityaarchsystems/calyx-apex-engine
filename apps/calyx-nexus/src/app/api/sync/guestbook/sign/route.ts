import { NextResponse } from 'next/server';
import { redis, supabase, ctx } from '@/lib/api-clients';

export async function POST(request: Request) {
    try {
        const { profileId, nodeId, handle, msg } = await request.json();
        if (!profileId || !nodeId || !handle || !msg) {
            return NextResponse.json(
                { error: 'Missing parameters for guestbook signature write-through.' },
                { status: 400 }
            );
        }

        const { data: nodeRecord, error: nodeErr } = await supabase
            .from('canvas_nodes')
            .select('*')
            .eq('id', nodeId)
            .eq('profile_id', profileId)
            .single();

        if (nodeErr || !nodeRecord) {
            return NextResponse.json(
                { error: 'Guestbook component node not found.' },
                { status: 404 }
            );
        }

        const configData = nodeRecord.config_data || {};
        const staticVals = configData.static_values || {};
        const logs = staticVals.logs || [];

        const newSignature = {
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            handle: handle.slice(0, 12),
            msg: msg.slice(0, 32)
        };

        const updatedLogs = [newSignature, ...logs].slice(0, 5);

        const updatedConfigData = {
            ...configData,
            static_values: {
                ...staticVals,
                logs: updatedLogs
            }
        };

        const { error: updateErr } = await supabase
            .from('canvas_nodes')
            .update({ config_data: updatedConfigData, updated_at: new Date().toISOString() })
            .eq('id', nodeId);

        if (updateErr) throw updateErr;

        const selectiveCacheKey = `user:node:${nodeId}:guestbook`;
        ctx.waitUntil(redis.del(selectiveCacheKey));

        return NextResponse.json({ success: true, message: 'Quiet write-through complete.', logs: updatedLogs });
    } catch (error: any) {
        console.error('❌ GUESTBOOK SIGN EXCEPTION:', error);
        return NextResponse.json(
            { error: 'Guestbook write-through process dropped.', message: error.message },
            { status: 500 }
        );
    }
}
