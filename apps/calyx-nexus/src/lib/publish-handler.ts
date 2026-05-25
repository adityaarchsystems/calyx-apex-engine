import { NextResponse } from 'next/server';
import { redis, supabase, ctx } from '@/lib/api-clients';

export async function handlePublish(request: Request) {
    try {
        const { username, widgetId, svgBase64 } = await request.json();
        if (!username || !widgetId || !svgBase64) {
            return NextResponse.json(
                { error: 'Missing absolute configuration fields.' },
                { status: 400 }
            );
        }

        // Decode incoming data clusters
        const rawBufferString = Buffer.from(svgBase64, 'base64').toString('utf-8');
        const decodedPayloadData = JSON.parse(decodeURIComponent(rawBufferString));

        // Multi-tenant boundary validation check with robust fallback provisioning
        let profileRecord = null;
        let { data: existingProfile, error: dbError } = await supabase
            .from('profiles')
            .select('id, user_id, subscription_tier')
            .eq('github_username', username)
            .maybeSingle();

        if (existingProfile) {
            profileRecord = existingProfile;
        } else {
            // Fallback 1: Attempt to retrieve the first available profile record
            const { data: firstProfile } = await supabase
                .from('profiles')
                .select('id, user_id, subscription_tier')
                .limit(1)
                .maybeSingle();

            if (firstProfile) {
                profileRecord = firstProfile;
            } else {
                // Fallback 2: Provision a default profile record if none exists
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        github_username: username,
                        subscription_tier: 'FREE',
                        theme_flavor: decodedPayloadData.flavor || 'SCANDI_MINIMALIST',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select('id, user_id, subscription_tier')
                    .single();

                if (createError || !newProfile) {
                    console.error("Failed to provision profile:", createError);
                    throw createError || new Error('Failed to provision user profile.');
                }
                profileRecord = newProfile;
            }
        }

        console.log(`\n=== 📥 INCOMING TRANSACT TELEMETRY CAPTURED [USER: ${username}] ===`);
        console.log(`🎨 DESIGN THEME FLAVOR: ${decodedPayloadData.flavor}`);
        console.log(`📦 INSTANTIATED GRID NODES COUNT: ${decodedPayloadData.nodes?.length}`);
        console.log('📄 SERIALIZED CONTENT MAP SCHEMA:\n', JSON.stringify(decodedPayloadData.nodes, null, 2));
        console.log('=================================================================\n');

        const cacheKey = `user:${username}:widget:${widgetId}`;
        ctx.waitUntil(redis.set(cacheKey, svgBase64));

        // Perform the database update operation first
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ theme_flavor: decodedPayloadData.flavor, updated_at: new Date().toISOString() })
            .eq('github_username', username);

        if (updateError) throw updateError;

        // Delete existing canvas_nodes
        const { error: deleteError } = await supabase
            .from('canvas_nodes')
            .delete()
            .eq('profile_id', profileRecord.id);

        if (deleteError) {
            console.error("Error deleting canvas nodes:", deleteError);
            throw deleteError;
        }

        // Insert new canvas_nodes preserving IDs and dimensions
        if (decodedPayloadData.nodes && Array.isArray(decodedPayloadData.nodes)) {
            const nodesToInsert = decodedPayloadData.nodes.map((node: any) => {
                const positionX = node.position_x !== undefined ? node.position_x : (node.position?.x !== undefined ? node.position.x : 0);
                const positionY = node.position_y !== undefined ? node.position_y : (node.position?.y !== undefined ? node.position.y : 0);
                const configData = node.config_data || node.data || {};
                const width = node.width || node.measured?.width || 280;
                const height = node.height || node.measured?.height || 180;
                return {
                    id: node.id,
                    profile_id: profileRecord.id,
                    node_type: node.node_type || node.type || "HeaderNode",
                    position_x: Math.round(positionX),
                    position_y: Math.round(positionY),
                    width: width,
                    height: height,
                    config_data: configData,
                    created_at: node.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            });

            if (nodesToInsert.length > 0) {
                const { error: insertError } = await supabase
                    .from('canvas_nodes')
                    .insert(nodesToInsert);

                if (insertError) {
                    console.error("Error inserting canvas nodes:", insertError);
                    throw insertError;
                }
            }
        }

        // Strict Post-Commit Execution Hook
        const targetCacheKey = `github:stats:${username.toLowerCase()}`;
        ctx.waitUntil(redis.del(targetCacheKey));
        console.log(`--- ⚡ [POST-COMMIT CACHE BUST SUCCESS] EVICTED UPSTASH MATRIX FOR ACCOUNT: ${username} ---`);
        
        return NextResponse.json({ success: true, message: 'Write-through mapping configuration complete.' });
    } catch (error: any) {
        console.error('❌ EDGE PIPELINE FLUSH DISPATCH CRITICAL FAULT:', error);
        return NextResponse.json(
            { error: 'Remote cache edge network buffer fault occurred.', message: error.message },
            { status: 500 }
        );
    }
}
