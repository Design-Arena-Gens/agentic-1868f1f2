'use client';

import { useState } from 'react';
import type { VoicePersona, VisualMood, PipelineInput } from '@/lib/types';
import { classNames } from '@/lib/utils';

const moodOptions: { value: VisualMood; label: string; description: string }[] = [
  { value: 'cinematic', label: 'Cinematic', description: 'Epic visuals & dramatic energy' },
  { value: 'documentary', label: 'Documentary', description: 'Grounded realism & clarity' },
  { value: 'playful', label: 'Playful', description: 'Bright colors & dynamic motion' },
  { value: 'futuristic', label: 'Futuristic', description: 'Neon, tech overlays & innovation' },
  { value: 'minimal', label: 'Minimal', description: 'Clean, intentional and calm' },
];

const voiceOptions: { value: VoicePersona; label: string; tagline: string }[] = [
  { value: 'warm_narrator', label: 'Warm Narrator', tagline: 'Emotive storytelling' },
  { value: 'energetic_host', label: 'Energetic Host', tagline: 'High-energy hype' },
  { value: 'documentarian', label: 'Documentarian', tagline: 'Confident & credible' },
  { value: 'calm_mentor', label: 'Calm Mentor', tagline: 'Reassuring guidance' },
  { value: 'dramatic_actor', label: 'Dramatic Actor', tagline: 'Big emphasis and pacing' },
];

const platformPresets = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
];

export interface PipelineFormProps {
  loading: boolean;
  onSubmit: (payload: Pick<PipelineInput, 'script' | 'targetPlatforms' | 'preferredMood' | 'voicePersona' | 'aspectRatio'>) => Promise<void>;
}

export function PipelineForm({ loading, onSubmit }: PipelineFormProps) {
  const [script, setScript] = useState('');
  const [preferredMood, setPreferredMood] = useState<VisualMood>('cinematic');
  const [voicePersona, setVoicePersona] = useState<VoicePersona>('warm_narrator');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['youtube', 'instagram']);
  const [useSample, setUseSample] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payloadScript = useSample ? SAMPLE_SCRIPT : script;
    await onSubmit({ script: payloadScript, preferredMood, voicePersona, aspectRatio, targetPlatforms });
  };

  const togglePlatform = (platform: string) => {
    setTargetPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform],
    );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
            Campaign Script
          </label>
          <button
            type="button"
            className={classNames(
              'text-xs font-medium transition',
              useSample ? 'text-teal-300' : 'text-zinc-400 hover:text-teal-200',
            )}
            onClick={() => setUseSample((prev) => !prev)}
          >
            {useSample ? 'Using sample script' : 'Use sample script'}
          </button>
        </div>
        <textarea
          className="min-h-[160px] rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 shadow-inner shadow-black/30 outline-none ring-1 ring-zinc-800 transition focus:ring-2 focus:ring-teal-400/70"
          placeholder="Drop in your narrative, bullet outline or rough talking points. The agent will craft scenes, narration and social snippets."
          value={useSample ? SAMPLE_SCRIPT : script}
          onChange={(event) => setScript(event.target.value)}
          disabled={useSample}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4">
          <legend className="px-2 text-xs font-semibold uppercase text-zinc-400">Visual Mood</legend>
          <div className="mt-4 flex flex-col gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPreferredMood(option.value)}
                className={classNames(
                  'flex items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition',
                  preferredMood === option.value
                    ? 'border-teal-500/70 bg-teal-500/10 text-teal-100 shadow-teal-500/20'
                    : 'border-transparent bg-zinc-900/40 text-zinc-200 hover:border-zinc-700/80 hover:bg-zinc-900/60',
                )}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-zinc-400">{option.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4">
          <legend className="px-2 text-xs font-semibold uppercase text-zinc-400">Voice Persona</legend>
          <div className="mt-4 grid gap-2">
            {voiceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVoicePersona(option.value)}
                className={classNames(
                  'flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition',
                  voicePersona === option.value
                    ? 'border-teal-500/70 bg-teal-500/10 text-teal-100 shadow-teal-500/20'
                    : 'border-transparent bg-zinc-900/40 text-zinc-200 hover:border-zinc-700/80 hover:bg-zinc-900/60',
                )}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-zinc-400">{option.tagline}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4">
          <h3 className="text-xs font-semibold uppercase text-zinc-400">Aspect Ratio</h3>
          <div className="mt-3 flex gap-2">
            {['16:9', '9:16', '1:1'].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio as '16:9' | '9:16' | '1:1')}
                className={classNames(
                  'flex-1 rounded-xl border px-3 py-2 text-sm transition',
                  aspectRatio === ratio
                    ? 'border-teal-500/60 bg-teal-500/10 text-teal-100'
                    : 'border-transparent bg-zinc-900/40 text-zinc-200 hover:border-zinc-700/80 hover:bg-zinc-900/60',
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/60 p-4">
          <h3 className="text-xs font-semibold uppercase text-zinc-400">Social Targets</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {platformPresets.map((platform) => (
              <button
                key={platform.value}
                type="button"
                onClick={() => togglePlatform(platform.value)}
                className={classNames(
                  'rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition',
                  targetPlatforms.includes(platform.value)
                    ? 'border-teal-400/70 bg-teal-500/10 text-teal-100'
                    : 'border-transparent bg-zinc-900/40 text-zinc-300 hover:border-zinc-700/80 hover:bg-zinc-900/60',
                )}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={classNames(
          'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-teal-500/30 transition',
          loading ? 'pointer-events-none opacity-60' : 'hover:brightness-110',
        )}
      >
        {loading ? 'Running agent pipeline…' : 'Generate storyboard & launch plan'}
      </button>
    </form>
  );
}

const SAMPLE_SCRIPT = `We just launched Aurora, a personal AI companion designed to help creators storyboard and produce daily content.

Scene 1: Introduce Aurora responding to a quick voice prompt, assembling a shot list in seconds.
Scene 2: Show the agent remixing brand assets into vertical and horizontal layouts.
Scene 3: Aurora suggests trending hooks and social captions tailor-made for each platform.
Scene 4: Reveal the auto-scheduler kicking posts to YouTube Shorts, TikTok, and Instagram Reels with one approval.
Scene 5: Close on the creator reviewing analytics while Aurora lines up tomorrow's ideas.`;
