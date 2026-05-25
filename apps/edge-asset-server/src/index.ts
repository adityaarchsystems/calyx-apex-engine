import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Redis } from '@upstash/redis';
import { cors } from 'hono/cors';
import { compileCanvasToSvg } from './utils/svgCompiler.js';
import fs from 'fs';
import path from 'path';

const app = new Hono();

const getMime = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'svg': return 'image/svg+xml';
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        case 'json': return 'application/json';
        default: return 'application/octet-stream';
    }
};

// Dynamic latency tracker tracking middleware
app.use('*', async (c, next) => {
    const start = performance.now();
    await next();
    const duration = Math.round(performance.now() - start);
    c.header('X-Calyx-Edge-Duration', `${duration}ms`);
});

// Configure CORS to explicitly expose latency duration metrics
app.use('/svg/*', cors({
    origin: '*',
    exposeHeaders: ['X-Calyx-Edge-Duration']
}));

// Configure CORS and serve assets from assets-vault safely
app.use('/assets/*', cors({
    origin: '*',
    exposeHeaders: ['X-Calyx-Edge-Duration']
}));

app.get('/assets/*', async (c) => {
    const wildcardPath = c.req.path.replace(/^\/assets\//, '');
    const safePath = path.normalize(wildcardPath).replace(/^(\.\.(\/|\\|$))+/, '');
    let vaultDir = path.join(process.cwd(), 'assets-vault');
    if (!fs.existsSync(vaultDir)) {
        vaultDir = path.join(process.cwd(), '../../assets-vault');
    }
    const fullPath = path.join(vaultDir, safePath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return c.text('Asset not found', 404);
    }
    const mimeType = getMime(fullPath);
    const data = fs.readFileSync(fullPath);
    return new Response(data, {
        headers: {
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400',
        }
    });
});

const getRedisClient = (env: any) => {
  const url = env.UPSTASH_REDIS_REST_URL || (typeof process !== 'undefined' && process.env ? process.env.UPSTASH_REDIS_REST_URL : undefined);
  const token = env.UPSTASH_REDIS_REST_TOKEN || (typeof process !== 'undefined' && process.env ? process.env.UPSTASH_REDIS_REST_TOKEN : undefined);
  if (!url || !token) {
    throw new Error("Missing edge credentials: Upstash Redis parameters undefined.");
  }
  return new Redis({ url, token });
};

const checkBoundaries = (env: any) => {
  const requiredEnv = [
    'GITHUB_TOKEN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  const missing = requiredEnv.filter((v) => {
    const val = env[v] || (typeof process !== 'undefined' && process.env ? process.env[v] : undefined);
    return !val;
  });
  if (missing.length > 0) {
    console.error(`\n================================================================`);
    console.error(`🛑 FATAL CONFIGURATION EXCEPTION: Missing Edge Server Credentials!`);
    console.error(`The following properties are undefined: ${missing.join(', ')}`);
    console.error(`================================================================\n`);
    return false;
  }
  return true;
};

app.get('/svg/:username/:widgetId', async (c) => {
  const { username, widgetId } = c.req.param();
  const env = c.env || {};
  
  // Validate credentials connection boundaries
  checkBoundaries(env);
  
  const cacheKey = `user:${username}:widget:${widgetId}`;
  
  try {
    const redis = getRedisClient(env);
    const base64Payload = await redis.get<string>(cacheKey);
    
    if (!base64Payload) {
      return c.text('Widget not found', 404);
    }

    const rawBufferString = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const decodedPayload = JSON.parse(decodeURIComponent(rawBufferString));

    const svgContent = compileCanvasToSvg(decodedPayload);

    return new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      }
    });
  } catch (error: any) {
    console.error('Edge Asset Error:', error);
    return c.text(`Internal Server Error: ${error?.message || error}`, 500);
  }
});

// Decouple network listeners from runtime exports to safeguard Cloudflare isolation vectors
const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';
if (!isProd) {
  serve({ fetch: app.fetch, port: 3002 });
  console.log('--- 🚀 LOCAL ADAPTER NODE LISTENER RUNNING ON PORT 3002 ---');
}

// Serverless fetch export adapter to bypass global process environments under pure V8 Isolates
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    checkBoundaries(env);
    return app.fetch(request, env, ctx);
  }
};
