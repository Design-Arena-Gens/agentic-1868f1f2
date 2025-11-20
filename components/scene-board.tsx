'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SceneBlueprint } from '@/lib/types';
import { classNames } from '@/lib/utils';

export interface SceneBoardProps {
  scenes: SceneBlueprint[];
  onUpdateScene: (sceneId: string, updates: Partial<SceneBlueprint>) => void;
}

export function SceneBoard({ scenes, onUpdateScene }: SceneBoardProps) {
  const [expandedScene, setExpandedScene] = useState<string | null>(null);

  if (!scenes.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-2xl shadow-black/40">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-50">Storyboard Draft</h2>
          <p className="text-sm text-zinc-400">
            Review each AI drafted scene. Adjust overlays or narration to align with your brand voice.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {scenes.map((scene, index) => {
          const isExpanded = expandedScene === scene.id;
          return (
            <article
              key={scene.id}
              className={classNames(
                'group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur transition',
                isExpanded ? 'ring-2 ring-teal-400/70' : 'hover:border-teal-500/40',
              )}
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={scene.imageUrl}
                  alt={scene.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wide text-teal-200">Scene {index + 1}</span>
                  <h3 className="text-lg font-semibold text-zinc-50">{scene.title}</h3>
                  <p className="max-w-sm text-sm text-zinc-200">{scene.overlayText}</p>
                </div>
              </div>

              <div className="space-y-4 px-4 pb-5 pt-4 text-sm text-zinc-200">
                <textarea
                  className="w-full rounded-xl bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-2 focus:ring-teal-400/70"
                  value={scene.overlayText}
                  onChange={(event) => onUpdateScene(scene.id, { overlayText: event.target.value })}
                />

                <details
                  open={isExpanded}
                  onToggle={(event) => setExpandedScene(event.currentTarget.open ? scene.id : null)}
                  className="rounded-xl bg-black/30 p-3"
                >
                  <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Narrative + transitions
                  </summary>
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <label className="mb-1 block text-xs uppercase text-zinc-500">Narration</label>
                      <textarea
                        className="min-h-[96px] w-full rounded-xl bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-2 focus:ring-teal-400/70"
                        value={scene.voiceover}
                        onChange={(event) => onUpdateScene(scene.id, { voiceover: event.target.value })}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                      <span>Estimated duration · {scene.durationSec}s</span>
                      <span>Transition · {scene.transition.toUpperCase()}</span>
                    </div>
                  </div>
                </details>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
