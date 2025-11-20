'use client';

import { useMemo, useState } from 'react';
import { PipelineForm } from '@/components/pipeline-form';
import { SceneBoard } from '@/components/scene-board';
import { PipelineTimeline } from '@/components/pipeline-timeline';
import { VoiceControl } from '@/components/voice-control';
import { VideoPreview } from '@/components/video-preview';
import { SocialPlanner } from '@/components/social-planner';
import type { AgenticStoryboard, PipelineInput } from '@/lib/types';

export default function Page() {
  const [storyboard, setStoryboard] = useState<AgenticStoryboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (
    payload: Pick<PipelineInput, 'script' | 'targetPlatforms' | 'preferredMood' | 'voicePersona' | 'aspectRatio'>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Pipeline failed');
      }
      const data = (await response.json()) as AgenticStoryboard;
      setStoryboard(data);
    } catch (pipelineError) {
      if (pipelineError instanceof Error) {
        setError(pipelineError.message);
      } else {
        setError('Unexpected error while running the agent pipeline.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSceneUpdate = (sceneId: string, updates: Partial<AgenticStoryboard['scenes'][number]>) => {
    setStoryboard((current) => {
      if (!current) return current;
      const scenes = current.scenes.map((scene) => (scene.id === sceneId ? { ...scene, ...updates } : scene));
      return { ...current, scenes };
    });
  };

  const handleDurationUpdate = (sceneId: string, durationSec: number) => {
    setStoryboard((current) => {
      if (!current) return current;
      const scenes = current.scenes.map((scene) => (scene.id === sceneId ? { ...scene, durationSec } : scene));
      const updatedTimeline = current.video.scenes.map((entry) => ({ ...entry }));
      let cursor = 0;
      const recalculatedTimeline = updatedTimeline.map((entry) => {
        const scene = scenes.find((item) => item.id === entry.sceneId);
        const runtime = scene?.durationSec ?? entry.end - entry.start;
        const timelineEntry = { ...entry, start: cursor, end: cursor + runtime };
        cursor += runtime;
        return timelineEntry;
      });
      const video = {
        ...current.video,
        totalDurationSec: cursor,
        scenes: recalculatedTimeline,
      };
      return { ...current, scenes, video };
    });
  };

  const handleSocialUpdate = (platform: string, updates: Partial<AgenticStoryboard['distribution'][number]>) => {
    setStoryboard((current) => {
      if (!current) return current;
      const distribution = current.distribution.map((plan) =>
        plan.platform === platform ? { ...plan, ...updates } : plan,
      );
      return { ...current, distribution };
    });
  };

  const hasStoryboard = Boolean(storyboard);

  const stats = useMemo(() => {
    if (!storyboard) {
      return null;
    }
    return [
      { label: 'Scenes', value: storyboard.scenes.length },
      { label: 'Runtime', value: `${Math.round(storyboard.video.totalDurationSec)}s` },
      { label: 'Platforms', value: storyboard.distribution.length },
    ];
  }, [storyboard]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-black via-zinc-900 to-black p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-200">
              Autonomous media lab
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
              Launch an AI agent that turns raw scripts into ready-to-post video stories.
            </h1>
            <p className="text-sm text-zinc-400">
              Paste a script and the pipeline assembles scenes, generates a narrated timeline, suggests edits, and drafts
              social launches. Iterate visually, then deploy across every channel with one approval.
            </p>
          </div>
          {stats && (
            <dl className="grid w-full max-w-sm grid-cols-3 gap-3 rounded-2xl border border-zinc-800/60 bg-black/40 p-4 text-center text-sm text-zinc-200">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-zinc-50">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="mt-8">
          <PipelineForm loading={loading} onSubmit={handleGenerate} />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </section>

      {hasStoryboard && storyboard && (
        <div className="space-y-10">
          <VideoPreview scenes={storyboard.scenes} videoPlan={storyboard.video} />
          <SceneBoard scenes={storyboard.scenes} onUpdateScene={handleSceneUpdate} />
          <PipelineTimeline scenes={storyboard.scenes} videoPlan={storyboard.video} onUpdateDuration={handleDurationUpdate} />
          <VoiceControl voicePlan={storyboard.voice} />
          <SocialPlanner plans={storyboard.distribution} onUpdate={handleSocialUpdate} />
        </div>
      )}

      {!hasStoryboard && (
        <div className="grid gap-6 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-sm text-zinc-400">
          <p>
            Generate your first storyboard to unlock the agent workspace. You can also explore using the sample script
            from the form above – the agent will produce mock scenes, a narration blueprint, and cross-platform launch
            notes.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-zinc-800/40 to-black" />
                <h3 className="text-sm font-semibold text-zinc-200">Autonomous beat {index}</h3>
                <p className="mt-2 text-xs text-zinc-500">
                  The storyboard agent will synthesize visuals, narration and social capsules based on your script.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="pb-10 text-center text-xs text-zinc-600">
        Crafted agent stack · Video pipeline + Voiceover + Social autoposter
      </footer>
    </main>
  );
}
