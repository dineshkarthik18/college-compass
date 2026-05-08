"use client";

import { Scale } from "lucide-react";
import { useEffect, useState } from "react";

const key = "college_compare_ids";

export function readCompareIds() {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
}

export function CompareToggle({ collegeId }: { collegeId: string }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(readCompareIds().includes(collegeId));
  }, [collegeId]);

  function toggle() {
    const current = readCompareIds();
    const next = current.includes(collegeId)
      ? current.filter((id) => id !== collegeId)
      : [...current, collegeId].slice(-3);
    window.localStorage.setItem(key, JSON.stringify(next));
    setSelected(next.includes(collegeId));
    window.dispatchEvent(new Event("compare-updated"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-moss"
      title="Add to compare"
    >
      <Scale size={16} />
      <span>{selected ? "Selected" : "Compare"}</span>
    </button>
  );
}
