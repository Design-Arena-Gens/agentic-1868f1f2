'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { VoiceTrackPlan } from '@/lib/types';
import { classNames } from '@/lib/utils';

export interface VoiceControlProps {
  voicePlan: VoiceTrackPlan | null;
}

export function VoiceControl({ voicePlan }: VoiceControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const segments = useMemo(() => voicePlan?.segments ?? [], [voicePlan]);

  useEffect(() => {
    const synth = synthRef.current;
    return () => {
      synth?.cancel();
    };
  }, []);

  if (!voicePlan) {
    return null;
  }

  const handlePlay = async (index: number) => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setCurrentIndex(null);
      return;
    }

    setIsPlaying(true);
    setCurrentIndex(index);

    const utterance = new SpeechSynthesisUtterance(segments[index].text);
    utterance.rate = voicePlan.speechRate;
    utterance.pitch = voicePlan.pitch;
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentIndex(null);
    };

    synthRef.current.speak(utterance);
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-zinc-50">Voice Blueprint</h2>
        <p className="text-sm text-zinc-400">
          {voicePlan.narrationStyle}. Preview AI speech using the browser voice engine.
        </p>
      </header>

      <div className="mt-5 space-y-3">
        {segments.map((segment, index) => (
          <div key={segment.sceneId} className="rounded-2xl border border-zinc-800/70 bg-black/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-teal-200">Scene {index + 1}</span>
                <p className="text-sm text-zinc-200">{segment.text}</p>
              </div>
              <button
                type="button"
                onClick={() => handlePlay(index)}
                className={classNames(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-400/60 transition',
                  currentIndex === index && isPlaying
                    ? 'bg-teal-500/80 text-black shadow-lg shadow-teal-500/40'
                    : 'bg-transparent text-teal-100 hover:bg-teal-500/20',
                )}
              >
                {currentIndex === index && isPlaying ? '◼' : '▶'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
