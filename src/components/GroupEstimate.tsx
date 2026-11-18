"use client";

import { useState } from "react";
import { site } from "@/content/site-data";
import { estimate, money } from "@/lib/format";

const LIMITS = { players: [1, 16], hours: [1, 8] } as const;

function Stepper({
  label,
  value,
  unit,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  const btn =
    "grid size-11 cursor-pointer place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-bone disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink";
  return (
    <fieldset className="flex items-center justify-between gap-4 rounded-card bg-paper px-5 py-4">
      <legend className="visually-hidden">{label}</legend>
      <span className="text-body text-stone" aria-hidden="true">
        {label}
      </span>
      <span className="flex items-center gap-3">
        <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Fewer ${unit}s`}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <output className="min-w-[4.5rem] text-center text-card font-medium tabular-nums" aria-live="polite">
          {value} {unit}
          {value === 1 ? "" : "s"}
        </output>
        <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`More ${unit}s`}>
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </span>
    </fieldset>
  );
}

export default function GroupEstimate() {
  const [players, setPlayers] = useState(2);
  const [hours, setHours] = useState(2);
  const clamp = (n: number, [lo, hi]: readonly [number, number]) => Math.min(hi, Math.max(lo, n));

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr] lg:gap-10">
      <div className="space-y-3">
        <Stepper label="Players" unit="player" value={players} min={LIMITS.players[0]} max={LIMITS.players[1]} onChange={(n) => setPlayers(clamp(n, LIMITS.players))} />
        <Stepper label="Time" unit="hour" value={hours} min={LIMITS.hours[0]} max={LIMITS.hours[1]} onChange={(n) => setHours(clamp(n, LIMITS.hours))} />
        <p className="px-1 pt-2 text-xs leading-snug text-stone">
          Estimates only, before tax. {site.pricing.proRateNote} {site.pricing.groupNote}
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        {site.pricing.plans.map((plan) => {
          const e = estimate(plan, players, hours);
          return (
            <li key={plan.id} className="flex flex-col justify-between gap-6 rounded-card bg-ink p-6 text-bone">
              <p className="text-small text-bone/70">{plan.listName}</p>
              <div>
                <p className="text-price font-light">{money(Math.round(e.total * 100) / 100)}</p>
                <p className="mt-2 text-xs leading-snug text-bone/60">
                  {plan.perPerson
                    ? `${players} × ${money(plan.price)} × ${hours} hr${e.gratuity ? ` + ${site.pricing.gratuityPercent}% gratuity` : ""}`
                    : `${e.tables} table${e.tables > 1 ? "s" : ""} × ${money(players === 1 && plan.soloPrice ? plan.soloPrice : plan.price)} × ${hours} hr`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
