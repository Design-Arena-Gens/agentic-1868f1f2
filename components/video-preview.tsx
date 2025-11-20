'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { SceneBlueprint, VideoAssemblyPlan } from '@/lib/types';
import { classNames } from '@/lib/utils';

export interface VideoPreviewProps {
  scenes: SceneBlueprint[];
  videoPlan: VideoAssemblyPlan | null;
}

export function VideoPreview({ scenes, videoPlan }: VideoPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const orderedScenes = useMemo(() => {
    if (!videoPlan) return scenes;
    const sceneMap = Object.fromEntries(scenes.map((scene) => [scene.id, scene] as const));
    return videoPlan.scenes
      .map(({ sceneId }) => sceneMap[sceneId])
      .filter(Boolean) as SceneBlueprint[];
  }, [scenes, videoPlan]);

  useEffect(() => {
    if (!orderedScenes.length) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % orderedScenes.length);
    }, orderedScenes[activeIndex]?.durationSec ? orderedScenes[activeIndex].durationSec * 1000 : 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderedScenes, activeIndex]);

  if (!orderedScenes.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="grid gap-6 p-6 lg:grid-cols-[2fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800/70 bg-black">
          {orderedScenes.map((scene, index) => (
            <div
              key={scene.id}
              className={classNames(
                'absolute inset-0 transition-opacity duration-700',
                index === activeIndex ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image src={scene.imageUrl} alt={scene.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/40 p-4">
                <p className="text-xs uppercase tracking-wide text-teal-200">{scene.title}</p>
                <p className="text-sm text-zinc-100">{scene.overlayText}</p>
              </div>
            </div>
          ))}

          <div className="absolute left-0 right-0 bottom-0 flex items-center gap-2 bg-black/50 px-4 py-3">
            {orderedScenes.map((scene, index) => (
              <div key={scene.id} className="flex flex-1 flex-col">
                <div className="h-1 rounded-full bg-zinc-700">
                  <div
                    className={classNames(
                      'h-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500',
                      index === activeIndex ? 'w-full' : 'w-0',
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-50">Agentic Preview</h2>
          <p className="text-sm text-zinc-400">
            Live storyboard assembled from the AI pipeline. The preview loops through each beat using the drafted
            durations and transitions.
          </p>
          <div className="space-y-2 text-sm text-zinc-300">
            {orderedScenes.map((scene, index) => (
              <button
                key={scene.id}
                onClick={() => setActiveIndex(index)}
                className={classNames(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition',
                  index === activeIndex
                    ? 'border-teal-400/70 bg-teal-400/10 text-teal-100'
                    : 'border-transparent bg-black/30 text-zinc-300 hover:border-zinc-700/80 hover:bg-black/40',
                )}
              >
                <span>{scene.title}</span>
                <span className="text-xs font-semibold text-zinc-500">{scene.durationSec}s</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
