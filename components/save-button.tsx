"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function SaveButton({ collegeId, compact = false }: { collegeId: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const response = await fetch("/api/saved", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ collegeId })
    });

    if (response.status === 401) {
      window.location.href = "/auth";
      return;
    }

    setState(response.ok ? "saved" : "error");
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={state === "saving" || state === "saved"}
      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded bg-ink px-3 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-70"
      title="Save college"
    >
      <Heart size={16} fill={state === "saved" ? "currentColor" : "none"} />
      {!compact && <span>{state === "saved" ? "Saved" : state === "saving" ? "Saving" : "Save"}</span>}
    </button>
  );
}
