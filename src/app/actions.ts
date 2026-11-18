"use server";

import { site } from "@/content/site-data";

export interface InquiryState {
  status: "idle" | "sent" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "date" | "headcount" | "type", string>>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Event inquiry. Validates on the server (browser checks are for UX only),
 * then forwards the inquiry as JSON to EVENT_INQUIRY_WEBHOOK_URL.
 * Any form/email service that accepts a JSON POST works (Formspree,
 * Zapier, Make, a Resend function, ...). Set it in the host's env settings.
 */
export async function submitEventInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Honeypot: real people never see or fill this field.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "sent", message: "Thanks! We'll be in touch soon." };
  }

  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 2000);
  const data = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    date: get("date"),
    headcount: get("headcount"),
    type: get("type"),
    details: get("details"),
  };

  const fieldErrors: InquiryState["fieldErrors"] = {};
  if (!data.name) fieldErrors.name = "Enter your name.";
  if (!EMAIL.test(data.email)) fieldErrors.email = "Enter an email address like you@example.com.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) fieldErrors.date = "Choose the date of your event.";
  const count = Number(data.headcount);
  if (!Number.isInteger(count) || count < 1 || count > 500) fieldErrors.headcount = "Enter the number of guests (1 to 500).";
  if (!data.type) fieldErrors.type = "Choose the type of event.";
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const endpoint = process.env.EVENT_INQUIRY_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message: `Online inquiries are not switched on yet, so this was not sent. Please call ${site.business.phoneDisplay} to plan your event.`,
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, source: "Website event inquiry", submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("Event inquiry failed", err);
    return {
      status: "error",
      message: `Sorry, your inquiry could not be sent. Please try again or call ${site.business.phoneDisplay}.`,
    };
  }

  return {
    status: "sent",
    message: "Thanks! Your inquiry is in. We'll contact you about availability, pricing and package options.",
  };
}
