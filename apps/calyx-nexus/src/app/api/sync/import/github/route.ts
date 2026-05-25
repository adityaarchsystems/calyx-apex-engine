import { handleGithubImport } from '@/lib/github-import-handler';

export async function POST(request: Request) {
    return handleGithubImport(request);
}
