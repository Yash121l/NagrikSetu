"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function TrackRecordView(props: { recordId: string; kind: string; confidence: string; jurisdiction: string }) {
  const { recordId, kind, confidence, jurisdiction } = props;
  useEffect(() => {
    track("record_viewed", { record_id: recordId, record_kind: kind, confidence, jurisdiction });
  }, [recordId, kind, confidence, jurisdiction]);
  return null;
}
