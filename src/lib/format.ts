import { site, type DayIndex, type Plan } from "@/content/site-data";

/** $20 / $10.95 — whole dollars drop the cents. */
export function money(n: number): string {
  return "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
}

export function minutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** "17:00" → "5 PM", "00:00" → "12 AM", "12:30" → "12:30 PM" */
export function clock(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

export function hoursRange(open: string, close: string): string {
  return `${clock(open)} – ${clock(close)}`;
}

export interface HoursGroup {
  label: string;
  days: DayIndex[];
  range: string;
}

/**
 * Monday-first rows. Runs of three or more days with the same hours merge
 * ("Mon – Thu"); shorter runs stay as one row per day ("Saturday", "Sunday").
 */
export function groupedHours(): HoursGroup[] {
  const order: DayIndex[] = [1, 2, 3, 4, 5, 6, 0];
  const runs: { days: DayIndex[]; range: string }[] = [];
  for (const d of order) {
    const h = site.hours[d];
    const range = hoursRange(h.open, h.close);
    const last = runs[runs.length - 1];
    if (last && last.range === range) last.days.push(d);
    else runs.push({ days: [d], range });
  }
  return runs.flatMap((run) => {
    if (run.days.length >= 3) {
      const first = site.hours[run.days[0]];
      const end = site.hours[run.days[run.days.length - 1]];
      return [{ label: `${first.short} – ${end.short}`, days: run.days, range: run.range }];
    }
    return run.days.map((d) => ({ label: site.hours[d].day, days: [d], range: run.range }));
  });
}

/** Current wall-clock time in the bar's timezone. */
export function zoneNow(date = new Date()): { day: DayIndex; mins: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.business.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")) as DayIndex;
  return { day, mins: Number(get("hour")) * 60 + Number(get("minute")) };
}

export interface OpenStatus {
  open: boolean;
  /** The day whose opening hours apply right now (after midnight counts as the previous day). */
  serviceDay: DayIndex;
  text: string;
}

export function openStatus(now = zoneNow()): OpenStatus {
  const prev = ((now.day + 6) % 7) as DayIndex;
  const p = site.hours[prev];
  // Still inside yesterday's after-midnight hours?
  if (minutes(p.close) < minutes(p.open) && now.mins < minutes(p.close)) {
    return { open: true, serviceDay: prev, text: `Open now until ${clock(p.close)}` };
  }
  const h = site.hours[now.day];
  const o = minutes(h.open);
  const c = minutes(h.close);
  const overnight = c <= o;
  if (now.mins >= o && (overnight || now.mins < c)) {
    return { open: true, serviceDay: now.day, text: `Open now until ${clock(h.close)}` };
  }
  if (now.mins < o) {
    return { open: false, serviceDay: now.day, text: `Closed now. Opens today at ${clock(h.open)}` };
  }
  const next = site.hours[(now.day + 1) % 7];
  return { open: false, serviceDay: now.day, text: `Closed now. Opens tomorrow at ${clock(next.open)}` };
}

export function weekendLine(sep = " · "): string {
  return site.pricing.plans.map((p) => `${p.id === "table" ? "Table only" : p.name} ${money(p.weekendPrice)}`).join(sep);
}

export function specials() {
  return site.specials.map((s) =>
    "fromPricing" in s && s.fromPricing
      ? { ...s, detail: `${site.pricing.weekend.windowLabel}. Pay once per person: ${weekendLine()}.` }
      : s,
  );
}

export function estimate(plan: Plan, players: number, hours: number) {
  const base = plan.perPerson ? plan.price * players * hours : (players === 1 && plan.soloPrice ? plan.soloPrice : plan.price) * hours;
  const tables = plan.perPerson ? 1 : Math.ceil(players / (plan.maxPlayers ?? 4));
  const subtotal = plan.perPerson ? base : base * tables;
  const gratuity = plan.hasGratuity ? (subtotal * site.pricing.gratuityPercent) / 100 : 0;
  return { subtotal, gratuity, total: subtotal + gratuity, tables };
}

export const tel = `tel:${site.business.phoneTel}`;
