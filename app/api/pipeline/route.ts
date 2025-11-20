import { NextResponse } from 'next/server';
import { AgentPipeline } from '@/lib/pipeline';
import type { PipelineInput } from '@/lib/types';

const pipeline = new AgentPipeline();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PipelineInput>;
    if (!body.script || body.script.trim().length === 0) {
      return NextResponse.json({ error: 'Script is required.' }, { status: 400 });
    }

    const payload: PipelineInput = {
      script: body.script,
      targetPlatforms: body.targetPlatforms ?? ['youtube', 'instagram', 'tiktok'],
      preferredMood: body.preferredMood ?? 'cinematic',
      voicePersona: body.voicePersona ?? 'warm_narrator',
      aspectRatio: body.aspectRatio ?? '16:9',
    };

    const result = await pipeline.process(payload);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[pipeline] error', error);
    return NextResponse.json({ error: 'Failed to run pipeline.' }, { status: 500 });
  }
}
