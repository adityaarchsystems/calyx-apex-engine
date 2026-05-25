/**
 * CALYX NEXUS — Server-Side Credential & Parameter Mapping Guide
 * Enforces strict mappings of target platform data structures to authenticated runtime handles.
 */

export const CREDENTIALS_MAPPING = {
    github: {
        handle: "adityaarchsystems",
        tokenVar: "GITHUB_PAT",
        tokenAltVar: "GITHUB_TOKEN",
        requiredScopes: ["read:user", "repo"]
    },
    dailydev: {
        handle: "adityaarchsystems",
        profileUrl: "https://app.daily.dev/adityaarchsystems"
    },
    huggingface: {
        handle: "adityaarchsystems",
        tokenVar: "HF_TOKEN",
        apiBase: "https://huggingface.co"
    },
    gcp: {
        handle: "aditya.archsystems@gmail.com",
        credentialsVar: "GCP_SERVICE_ACCOUNT_JSON",
        targetClusterProfile: "omni-ad-vibe-spy",
        sslRequired: true
    }
};

export function validateCredentials() {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT_JSON;
    const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;

    // Check if any required token is undefined
    if (!redisUrl || !redisToken || !gcpServiceAccount || !token) {
        console.error("[CRITICAL] Integration Token Missing");
        throw new Error("[CRITICAL] Integration Token Missing");
    }

    // Check if token is dummy
    if (token === "dummy" || token.startsWith("your_") || token.startsWith("ghp_your")) {
        console.error("[CRITICAL] Integration Token Missing");
        throw new Error("[CRITICAL] Integration Token Missing");
    }

    // Check if GCP service account JSON is parseable and valid JSON
    try {
        const parsedGcp = JSON.parse(gcpServiceAccount);
        if (!parsedGcp.project_id || parsedGcp.project_id !== "omni-ad-vibe-spy") {
            console.error("[CRITICAL] Integration Token Missing");
            throw new Error("[CRITICAL] Integration Token Missing");
        }
    } catch (e) {
        console.error("[CRITICAL] Integration Token Missing");
        throw new Error("[CRITICAL] Integration Token Missing");
    }

    const hfToken = process.env.HF_TOKEN;

    const status = {
        github: {
            configured: true,
            handle: CREDENTIALS_MAPPING.github.handle
        },
        dailydev: {
            configured: true,
            handle: CREDENTIALS_MAPPING.dailydev.handle
        },
        huggingface: {
            configured: !!hfToken,
            handle: CREDENTIALS_MAPPING.huggingface.handle
        },
        gcp: {
            configured: true,
            handle: CREDENTIALS_MAPPING.gcp.handle
        }
    };

    return status;
}

