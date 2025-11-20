'use client';

import type { SceneBlueprint, VideoAssemblyPlan } from '@/lib/types';
import { formatSeconds } from '@/lib/utils';

export interface PipelineTimelineProps {
  scenes: SceneBlueprint[];
  videoPlan: VideoAssemblyPlan | null;
  onUpdateDuration: (sceneId: string, durationSec: number) => void;
}

export function PipelineTimeline({ scenes, videoPlan, onUpdateDuration }: PipelineTimelineProps) {
  if (!videoPlan || scenes.length === 0) {
    return null;
  }

  const maxDuration = Math.max(...scenes.map((scene) => scene.durationSec));

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-zinc-50">Timeline Assembly</h2>
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          Total runtime · {formatSeconds(videoPlan.totalDurationSec)} · Ratio {videoPlan.aspectRatio}
        </span>
      </header>

      <div className="mt-5 space-y-3">
        {scenes.map((scene) => (
          <div key={scene.id} className="rounded-2xl border border-zinc-800/80 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{scene.title}</h3>
                <p className="text-xs text-zinc-400">{scene.transition.toUpperCase()} · {scene.durationSec}s</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={4}
                  max={Math.max(10, maxDuration + 4)}
                  step={1}
                  value={scene.durationSec}
                  onChange={(event) => onUpdateDuration(scene.id, Number(event.target.value))}
                  className="h-1 w-40 rounded-full accent-teal-400"
                />
                <span className="text-xs font-semibold text-teal-300">{scene.durationSec}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
