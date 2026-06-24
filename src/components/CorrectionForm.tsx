"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { copy, type Locale } from "@/lib/i18n";

interface CorrectionFormProps {
  recordId?: string;
  recordLabel?: string;
  locale?: Locale;
}

export function CorrectionForm({ recordId, recordLabel, locale = "en" }: CorrectionFormProps) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const t = copy[locale];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recordId) return;

    setState("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, message, language: locale })
      });

      if (!response.ok) {
        setState("error");
        return;
      }

      setMessage("");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="correction-panel" onSubmit={submit}>
      <h2>{t.correctionHeading}</h2>
      <label htmlFor="correction-record">{t.correctionRecordLabel}</label>
      <input id="correction-record" readOnly value={recordLabel ?? ""} />
      <label htmlFor="correction-message">{t.correctionMessageLabel}</label>
      <textarea
        id="correction-message"
        maxLength={2000}
        onChange={(event) => {
          setMessage(event.target.value);
          setState((current) => (current === "sending" ? current : "idle"));
        }}
        placeholder={t.correctionMessagePlaceholder}
        required
        rows={4}
        value={message}
        disabled={state === "sending"}
      />
      <button disabled={!recordId || state === "sending"} type="submit">
        <Send aria-hidden="true" size={16} />
        {state === "sending" ? t.correctionSaving : t.correctionSubmit}
      </button>
      {state === "sent" ? (
        <p aria-live="polite" className="form-status form-status--ok" role="status">
          {t.correctionSuccess}
        </p>
      ) : null}
      {state === "error" ? (
        <p aria-live="assertive" className="form-status form-status--error" role="alert">
          {t.correctionError}
        </p>
      ) : null}
    </form>
  );
}
