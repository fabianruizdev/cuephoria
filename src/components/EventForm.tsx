"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitEventInquiry, type InquiryState } from "@/app/actions";
import { site } from "@/content/site-data";
import { PillButton } from "./ui";

const initial: InquiryState = { status: "idle", message: "" };

type FieldName = "name" | "email" | "date" | "headcount" | "type";

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" role="img" aria-label="Error" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="7" fill="#ff8a7a" />
      <path d="M8 4.5v4.2M8 11.2v.3" stroke="#0f1214" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Keeps aria-invalid and aria-describedby in step with the visual :user-invalid
 * state, as in the "required field feedback" guide, scoped to this form.
 */
function useAriaValiditySync(form: React.RefObject<HTMLFormElement | null>, announcer: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = form.current;
    if (!root) return;
    const supportsUserInvalid = CSS.supports("selector(:user-invalid)");
    const touched = new WeakSet<Element>();
    const announced = new WeakSet<Element>();
    let timer: number | undefined;

    const isUserInvalid = (el: HTMLInputElement) =>
      supportsUserInvalid ? el.matches(":user-invalid") : touched.has(el) && !el.validity.valid;

    const linkError = (el: HTMLElement, shown: boolean) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
      else el.removeAttribute("aria-describedby");
    };

    const sync = (target: EventTarget | null, announce = false) => {
      const el = target as HTMLInputElement | null;
      if (!el?.matches?.("input, select, textarea") || !root.contains(el)) return;
      const invalid = isUserInvalid(el);
      if (!supportsUserInvalid) el.classList.toggle("user-invalid-fallback", invalid);
      el.setAttribute("aria-invalid", invalid ? "true" : "false");
      linkError(el, invalid);
      if (invalid && announce && !announced.has(el) && announcer.current) {
        const msg = el.dataset.error ? document.getElementById(el.dataset.error)?.textContent?.trim() : "";
        const label = el.labels?.[0]?.textContent?.replace("*", "").trim();
        window.clearTimeout(timer);
        announcer.current.textContent = "";
        timer = window.setTimeout(() => {
          if (announcer.current) announcer.current.textContent = `${label}: Error: ${msg}`;
        }, 500);
        announced.add(el);
      }
      if (!invalid) announced.delete(el);
    };

    root.querySelectorAll("input, select, textarea").forEach((el) => el.setAttribute("aria-invalid", "false"));

    const onBlur = (e: Event) => { touched.add(e.target as Element); sync(e.target, true); };
    const onInput = (e: Event) => { if ((e.target as Element).getAttribute("aria-invalid") === "true") sync(e.target); };
    const onChange = (e: Event) => { touched.add(e.target as Element); sync(e.target, true); };
    const onInvalid = (e: Event) => { touched.add(e.target as Element); announced.add(e.target as Element); sync(e.target); };

    root.addEventListener("blur", onBlur, true);
    root.addEventListener("input", onInput);
    root.addEventListener("change", onChange, true);
    root.addEventListener("invalid", onInvalid, true);
    return () => {
      window.clearTimeout(timer);
      root.removeEventListener("blur", onBlur, true);
      root.removeEventListener("input", onInput);
      root.removeEventListener("change", onChange, true);
      root.removeEventListener("invalid", onInvalid, true);
    };
  }, [form, announcer]);
}

export default function EventForm({ headingId }: { headingId: string }) {
  const [state, action, pending] = useActionState(submitEventInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  useAriaValiditySync(formRef, announcerRef);

  // Earliest selectable date is today (read in the browser, not at prerender time).
  const dateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const d = new Date();
    if (dateRef.current) dateRef.current.min = new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  }, []);

  // After the server answers: focus the first field it rejected, or the status message.
  useEffect(() => {
    if (state.status === "idle") return;
    const firstBad = state.fieldErrors && (Object.keys(state.fieldErrors)[0] as FieldName | undefined);
    if (firstBad) {
      const el = formRef.current?.elements.namedItem(firstBad) as HTMLElement | null;
      el?.setAttribute("aria-invalid", "true");
      el?.focus();
    } else {
      statusRef.current?.focus();
    }
    if (state.status === "sent") formRef.current?.reset();
  }, [state]);

  const serverError = (n: FieldName) => state.fieldErrors?.[n];

  const field =
    "field-box relative flex flex-col rounded-field bg-ink-3 transition-shadow focus-within:shadow-[inset_0_0_0_2px_var(--color-flame)]";
  const labelCls = "flex flex-col gap-3 px-5 pt-[1.5rem] pb-[1.375rem] text-small text-bone cursor-text";
  const control = "field-control w-full bg-transparent text-body-lg leading-tight text-bone outline-none";
  const errorCls = "field-error items-start gap-1.5 px-5 pb-4 -mt-2 text-xs leading-snug text-[#ffb3a8]";

  const required = <span aria-hidden="true"> *</span>;

  const errorText = (n: FieldName, msg: string) => (
    <p id={id(`${n}-error`)} className={errorCls} style={serverError(n) ? { display: "flex" } : undefined}>
      <ErrorIcon />
      <span>{serverError(n) ?? msg}</span>
    </p>
  );

  return (
    <form ref={formRef} action={action} aria-labelledby={headingId} className="mt-10">
      <p className="visually-hidden">Fields marked with an asterisk (*) are required.</p>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6 lg:grid-cols-3">
        <div className={field}>
          <label htmlFor={id("name")} className={labelCls}>
            <span>Your name{required}</span>
            <input id={id("name")} name="name" type="text" required autoComplete="name" maxLength={100} placeholder="Full name" enterKeyHint="next" data-error={id("name-error")} className={control} />
          </label>
          {errorText("name", "Enter your name.")}
        </div>

        <div className={field}>
          <label htmlFor={id("email")} className={labelCls}>
            <span>Email address{required}</span>
            <input id={id("email")} name="email" type="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={200} placeholder="you@example.com" enterKeyHint="next" data-error={id("email-error")} className={control} />
          </label>
          {errorText("email", "Enter an email address like you@example.com.")}
        </div>

        <div className={field}>
          <label htmlFor={id("phone")} className={labelCls}>
            <span>Phone number</span>
            <input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Your phone number" enterKeyHint="next" className={control} />
          </label>
        </div>

        <div className={field}>
          <label htmlFor={id("date")} className={labelCls}>
            <span>Event date{required}</span>
            <input id={id("date")} name="date" ref={dateRef} type="date" required data-error={id("date-error")} className={control} />
          </label>
          {errorText("date", "Choose the date of your event.")}
        </div>

        <div className={field}>
          <label htmlFor={id("headcount")} className={labelCls}>
            <span>Headcount{required}</span>
            <input id={id("headcount")} name="headcount" type="text" inputMode="numeric" pattern="[0-9]{1,3}" required maxLength={3} placeholder="Number of guests" enterKeyHint="next" data-error={id("headcount-error")} className={control} />
          </label>
          {errorText("headcount", "Enter the number of guests, in digits.")}
        </div>

        <div className={field}>
          <label htmlFor={id("type")} className={labelCls}>
            <span>Event type{required}</span>
            <select id={id("type")} name="type" required defaultValue="" data-error={id("type-error")} className={`${control} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 6l4 4 4-4%22 fill=%22none%22 stroke=%22%23f2eee6%22 stroke-width=%221.6%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:1rem] bg-[right_center] bg-no-repeat pe-6`}>
              <option value="" disabled>Select event type</option>
              {site.events.formTypes.map((t) => (
                <option key={t} value={t} className="bg-ink-3 text-bone">{t}</option>
              ))}
            </select>
          </label>
          {errorText("type", "Choose the type of event.")}
        </div>

        <div className={`${field} sm:col-span-2 lg:col-span-3`}>
          <label htmlFor={id("details")} className={`${labelCls} pb-5`}>
            <span>Additional details</span>
            <textarea id={id("details")} name="details" rows={1} maxLength={2000} placeholder="Tell us about your plans, food and drink preferences or accessibility needs." className={`${control} min-h-[4.75rem] resize-y [field-sizing:content] sm:min-h-[3.25rem] lg:min-h-[1.75rem]`} />
          </label>
        </div>
      </div>

      {/* Honeypot for bots, hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-col items-center gap-6 text-center">
        <PillButton type="submit" tone="flame" disabled={pending}>
          {pending ? "Sending…" : "Send event inquiry"}
        </PillButton>
        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          className={`max-w-xl rounded-sm text-small outline-none focus-visible:outline-flame ${
            state.status === "sent" ? "font-medium text-[#8fe0a9]" : state.status === "error" ? "font-medium text-[#ffb3a8]" : "text-bone/70"
          }`}
        >
          {state.status === "idle" ? "We’ll contact you to discuss availability, pricing and package options." : state.message}
        </p>
      </div>
      <div ref={announcerRef} aria-live="polite" className="visually-hidden" />
    </form>
  );
}
