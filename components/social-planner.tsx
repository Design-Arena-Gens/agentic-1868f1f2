'use client';

import { useState } from 'react';
import type { PlatformPublishingPlan } from '@/lib/types';
import { classNames, formatPlatformName } from '@/lib/utils';

export interface SocialPlannerProps {
  plans: PlatformPublishingPlan[];
  onUpdate: (platform: string, updates: Partial<PlatformPublishingPlan>) => void;
}

export function SocialPlanner({ plans, onUpdate }: SocialPlannerProps) {
  const [log, setLog] = useState<string[]>([]);
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);

  if (!plans.length) {
    return null;
  }

  const triggerAction = async (plan: PlatformPublishingPlan, publishNow = false) => {
    setLoadingPlatform(plan.platform);
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, publishNow }),
      });
      const payload = await response.json();
      if (response.ok) {
        const status = publishNow ? 'posted' : 'scheduled';
        onUpdate(plan.platform, { status });
        setLog((current) => [`${formatPlatformName(plan.platform)} · ${payload.detail}`, ...current]);
      } else {
        setLog((current) => [`${formatPlatformName(plan.platform)} · Failed: ${payload.error}`, ...current]);
      }
    } finally {
      setLoadingPlatform(null);
    }
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-zinc-50">Social Launch Agent</h2>
        <p className="text-sm text-zinc-400">
          The agent drafts platform-native captions, ideal launch windows, and can push live or schedule in one tap.
        </p>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.platform} className="rounded-2xl border border-zinc-800/80 bg-black/30 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{formatPlatformName(plan.platform)}</h3>
                <p className="text-xs uppercase tracking-wide text-zinc-500">{plan.toneGuidance}</p>
              </div>
              <span
                className={classNames(
                  'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                  plan.status === 'posted'
                    ? 'bg-teal-500/20 text-teal-200'
                    : plan.status === 'scheduled'
                      ? 'bg-sky-500/20 text-sky-200'
                      : 'bg-zinc-800 text-zinc-400',
                )}
              >
                {plan.status}
              </span>
            </div>
            <textarea
              className="mt-3 min-h-[110px] w-full rounded-xl bg-black/50 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-2 focus:ring-teal-400/70"
              value={plan.caption}
              onChange={(event) => onUpdate(plan.platform, { caption: event.target.value })}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <span>Post on · {new Date(plan.idealPostTime).toLocaleString()}</span>
              <span>{plan.hashtags.join(' ')}</span>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={loadingPlatform === plan.platform}
                onClick={() => triggerAction(plan)}
                className={classNames(
                  'flex-1 rounded-full border border-sky-400/50 px-4 py-2 text-sm font-semibold text-sky-100 transition',
                  loadingPlatform === plan.platform ? 'opacity-60' : 'hover:border-sky-300 hover:text-white',
                )}
              >
                Schedule
              </button>
              <button
                type="button"
                disabled={loadingPlatform === plan.platform}
                onClick={() => triggerAction(plan, true)}
                className={classNames(
                  'flex-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2 text-sm font-semibold text-black transition',
                  loadingPlatform === plan.platform ? 'opacity-60' : 'hover:brightness-110',
                )}
              >
                Push Live
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Agent Log</h3>
        <div className="mt-3 space-y-2 text-xs text-zinc-300">
          {log.length === 0 && <p className="text-zinc-500">No activity yet. Actions will appear here.</p>}
          {log.map((entry, index) => (
            <p key={`${entry}-${index}`} className="text-zinc-300">
              {entry}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
