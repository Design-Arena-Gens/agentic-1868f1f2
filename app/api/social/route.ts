import { NextResponse } from 'next/server';
import { simulateImmediatePublish, simulateSocialPost } from '@/lib/social';
import type { PlatformPublishingPlan } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { plan: PlatformPublishingPlan; publishNow?: boolean };

    if (!body?.plan) {
      return NextResponse.json({ error: 'Missing publishing plan.' }, { status: 400 });
    }

    const action = body.publishNow
      ? await simulateImmediatePublish(body.plan)
      : await simulateSocialPost(body.plan);

    return NextResponse.json(action);
  } catch (error) {
    console.error('[social] error', error);
    return NextResponse.json({ error: 'Failed to trigger social action.' }, { status: 500 });
  }
}
