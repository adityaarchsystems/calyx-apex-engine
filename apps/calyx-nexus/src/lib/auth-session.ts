import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function getAuthUser() {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;

    try {
        const cookieStore = await cookies();
        const projectRef = url.split('//')[1]?.split('.')[0];
        const cookieName = `sb-${projectRef}-auth-token`;
        const authCookie = cookieStore.get(cookieName)?.value;

        if (!authCookie) return null;

        const parsed = JSON.parse(authCookie);
        const accessToken = parsed?.access_token || parsed?.[0];
        if (!accessToken) return null;

        // Verify session against Supabase Auth
        const supabase = createClient(url, anonKey, {
            auth: { persistSession: false }
        });
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error || !user) return null;

        return user;
    } catch (e) {
        console.error('Error verifying Supabase Auth session:', e);
        return null;
    }
}
