"use client";

import { useEffect, useState } from "react";
import type { DayIndex } from "@/content/site-data";
import { groupedHours, openStatus } from "@/lib/format";

/**
 * Opening hours with today's row emphasised. "Today" is worked out in the
 * bar's timezone after hydration, so the static HTML stays the same for everyone.
 */
export default function HoursList({ tone = "light", showStatus = false }: { tone?: "light" | "dark"; showStatus?: boolean }) {
  const [today, setToday] = useState<DayIndex | null>(null);
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const s = openStatus();
      setToday(s.serviceDay);
      setStatus({ open: s.open, text: s.text });
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const rows = groupedHours();
  const line = tone === "light" ? "border-ink/12" : "border-bone/12";
  const muted = tone === "light" ? "text-stone" : "text-bone/65";
  const strong = tone === "light" ? "text-ink" : "text-bone";

  return (
    <div>
      {showStatus && (
        <p className={`mb-5 flex min-h-6 items-center gap-2.5 text-body font-medium ${strong}`} aria-live="polite">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${status === null ? "bg-current opacity-30" : status.open ? "bg-[#3fbf6f] shadow-[0_0_0_4px_rgb(63_191_111/0.2)]" : "bg-[#d9534f]"}`}
          />
          {status?.text ?? "Open 7 days a week"}
        </p>
      )}
      <table className={`w-full border-t ${line} text-body`}>
        <caption className="visually-hidden">Opening hours</caption>
        <tbody>
          {rows.map((r) => {
            const isToday = today !== null && r.days.includes(today);
            return (
              <tr key={r.label} className={`border-b ${line} last:border-b-0`}>
                <th scope="row" className={`py-2.5 text-start font-normal ${isToday ? `font-semibold ${strong}` : muted}`}>
                  {r.label}
                  {isToday && <span className="visually-hidden"> (today)</span>}
                </th>
                <td className={`py-2.5 text-end font-medium whitespace-nowrap ${strong}`}>{r.range}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
