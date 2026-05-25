import { Redis } from '@upstash/redis';
import { createServerServiceRoleClient } from '@cpm/database';

let supabaseInstance: any = null;

export const supabase = new Proxy({} as any, {
    get(target, prop, receiver) {
        if (!supabaseInstance) {
            const url = process.env.SUPABASE_URL;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (!url || !key) {
                if (prop === 'then') return undefined;
                return (...args: any[]) => {
                    throw new Error('Supabase client called but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
                };
            }
            
            supabaseInstance = createServerServiceRoleClient(url, key);
        }
        return Reflect.get(supabaseInstance, prop, receiver);
    }
});

let redisInstance: Redis | null = null;

export const redis = new Proxy({} as any, {
    get(target, prop, receiver) {
        if (!redisInstance) {
            const url = process.env.UPSTASH_REDIS_REST_URL;
            const token = process.env.UPSTASH_REDIS_REST_TOKEN;
            
            if (!url || !token) {
                if (prop === 'then') return undefined;
                return (...args: any[]) => {
                    throw new Error('Redis client called but UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing.');
                };
            }
            
            redisInstance = new Redis({ url, token });
        }
        return Reflect.get(redisInstance, prop, receiver);
    }
}) as unknown as Redis;

export const ctx = {
    waitUntil: (promise: Promise<any>) => {
        promise.catch(err => console.error('Error in ctx.waitUntil:', err));
    }
};
