import { handlePublish } from '@/lib/publish-handler';

export async function POST(request: Request) {
    return handlePublish(request);
}
