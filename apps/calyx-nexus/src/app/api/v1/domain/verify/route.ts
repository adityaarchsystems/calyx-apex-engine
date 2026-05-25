import { NextResponse } from 'next/server';
import { supabase } from '@/lib/api-clients';
import { CustomDomainSslConfig } from '@cpm/types';

export async function POST(request: Request) {
    try {
        const { hostname } = await request.json();
        if (!hostname) {
            return NextResponse.json(
                { error: 'Missing hostname parameter.' },
                { status: 400 }
            );
        }

        console.log(`--- [DNS DoH QUERY] RESOLVING CNAME FOR ${hostname} ---`);
        let response;
        try {
            const dohUrl = `https://cloudflare-dns.com/api-v1/dns-query?name=${encodeURIComponent(hostname)}&type=CNAME`;
            response = await fetch(dohUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/dns-json' }
            });
            if (!response.ok) {
                throw new Error(`Cloudflare DoH tunnel error: ${response.statusText}`);
            }
        } catch (dohErr) {
            console.warn('⚠️ [DoH ROUTING FALLBACK]: Cloudflare api-v1 failed, attempting standard endpoint...');
            const fallbackUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=CNAME`;
            response = await fetch(fallbackUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/dns-json' }
            });
        }

        if (!response.ok) {
            throw new Error(`Cloudflare DoH fallback tunnel error: ${response.statusText}`);
        }

        const dnsJson: any = await response.json();
        let isCnameValid = false;

        if (dnsJson.Answer && Array.isArray(dnsJson.Answer)) {
            isCnameValid = dnsJson.Answer.some((ans: any) => {
                const cleanData = ans.data?.trim().replace(/\.$/, '');
                return ans.type === 5 && cleanData === 'cname.cpm-edge.io';
            });
        }

        const sslStatus = isCnameValid ? 'ACTIVE' : 'FAILED';

        const config: CustomDomainSslConfig = {
            hostname,
            cnameTarget: 'cname.cpm-edge.io',
            isCnameValid,
            sslStatus,
            lastCheckedAt: new Date().toISOString()
        };

        try {
            await supabase.channel('domain_verification_stream').send({
                type: 'broadcast',
                event: 'domain_update',
                payload: { config, updatedAt: new Date().toISOString() }
            });
        } catch (bErr) {
            console.warn('Failed to broadcast domain update:', bErr);
        }

        return NextResponse.json({ success: true, config });
    } catch (err: any) {
        console.error('DNS-over-HTTPS verification failed:', err);
        return NextResponse.json(
            { success: false, error: 'DoH verification loop failed', message: err.message },
            { status: 500 }
        );
    }
}
