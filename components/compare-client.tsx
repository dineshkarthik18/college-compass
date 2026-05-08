"use client";

import Link from "next/link";
import { ArrowRight, Plus, Scale, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readCompareIds } from "@/components/compare-toggle";
import { formatCurrency, formatPackage } from "@/lib/format";

type College = {
  id: string;
  slug: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  courses: { id: string; name: string; annualFee: number }[];
};

const storageKey = "college_compare_ids";

export function CompareClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function sync() {
      setIds(readCompareIds());
    }
    sync();
    window.addEventListener("compare-updated", sync);
    return () => window.removeEventListener("compare-updated", sync);
  }, []);

  useEffect(() => {
    if (ids.length < 2) {
      setColleges([]);
      return;
    }

    setLoading(true);
    setError("");
    fetch(`/api/colleges/compare?ids=${ids.join(",")}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to compare colleges");
        return data;
      })
      .then((data) => setColleges(data.colleges))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [ids]);

  const best = useMemo(() => {
    if (!colleges.length) return {};
    return {
      fees: Math.min(...colleges.map((college) => college.fees)),
      rating: Math.max(...colleges.map((college) => college.rating)),
      placementPercentage: Math.max(...colleges.map((college) => college.placementPercentage)),
      averagePackage: Math.max(...colleges.map((college) => college.averagePackage))
    };
  }, [colleges]);

  function remove(id: string) {
    const next = ids.filter((item) => item !== id);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setIds(next);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 inline-flex rounded bg-skyglass px-3 py-1 text-sm font-semibold">Decision table</p>
          <h1 className="text-4xl font-semibold tracking-normal">Compare colleges</h1>
          <p className="mt-3 max-w-2xl text-ink/65">Select two or three colleges and compare cost, outcomes, and location signals side by side.</p>
        </div>
        <Link href="/" className="focus-ring inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold hover:border-moss">
          <Plus size={16} />
          Add colleges
        </Link>
      </section>

      {ids.length < 2 && (
        <section className="mt-8 rounded border border-line bg-white p-8 text-center">
          <Scale className="mx-auto text-ink/35" size={44} />
          <h2 className="mt-4 text-xl font-semibold">Select at least two colleges.</h2>
          <p className="mt-2 text-sm text-ink/60">Use Compare on college cards. You can keep up to three in the table.</p>
          <Link href="/" className="focus-ring mt-5 inline-flex h-10 items-center rounded bg-ink px-4 text-sm font-semibold text-white hover:bg-moss">
            Browse colleges
          </Link>
        </section>
      )}

      {error && <div className="mt-6 rounded border border-coral/30 bg-coral/10 p-4 text-sm font-semibold text-coral">{error}</div>}
      {loading && <div className="mt-6 h-72 animate-pulse rounded border border-line bg-white" />}

      {!loading && colleges.length >= 2 && (
        <section className="mt-6 overflow-x-auto rounded border border-line bg-white shadow-sm">
          <div className="min-w-[760px]">
            <div className="grid border-b border-line bg-paper" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, minmax(190px, 1fr))` }}>
              <div className="p-4 text-sm font-semibold text-ink/65">Signal</div>
              {colleges.map((college) => (
                <div key={college.id} className="border-l border-line p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/colleges/${college.slug}`} className="font-semibold leading-snug hover:text-moss">
                      {college.name}
                    </Link>
                    <button onClick={() => remove(college.id)} className="focus-ring rounded p-1 text-ink/45 hover:bg-white hover:text-coral" title="Remove">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <Link href={`/colleges/${college.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-moss">
                    Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
            {[
              ["Annual fees", "fees", (value: number) => formatCurrency(value), "Lower is better"],
              ["Placement percentage", "placementPercentage", (value: number) => `${value}%`, "Higher is better"],
              ["Rating", "rating", (value: number) => value.toFixed(1), "Higher is better"],
              ["Average package", "averagePackage", (value: number) => formatPackage(value), "Higher is better"],
              ["Location", "location", (value: string) => value, "Consider access and comfort"]
            ].map(([label, field, formatter, hint]) => (
              <div key={String(label)} className="grid border-b border-line last:border-b-0" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, minmax(190px, 1fr))` }}>
                <div className="p-4">
                  <p className="text-sm font-semibold">{String(label)}</p>
                  <p className="mt-1 text-xs text-ink/50">{String(hint)}</p>
                </div>
                {colleges.map((college) => {
                  const value = college[field as keyof College] as never;
                  const isBest = field !== "location" && best[field as keyof typeof best] === value;
                  return (
                    <div key={college.id} className={`border-l border-line p-4 text-sm ${isBest ? "bg-skyglass/70 font-semibold" : ""}`}>
                      {(formatter as (value: never) => string)(value)}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="grid" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, minmax(190px, 1fr))` }}>
              <div className="p-4 text-sm font-semibold">Decision note</div>
              {colleges.map((college) => (
                <div key={college.id} className="border-l border-line p-4 text-sm leading-6 text-ink/70">
                  {college.fees === best.fees && "Best cost fit. "}
                  {college.placementPercentage === best.placementPercentage && "Strongest placement signal. "}
                  {college.rating === best.rating && "Highest student rating. "}
                  {college.averagePackage === best.averagePackage && "Best salary upside. "}
                  {college.fees !== best.fees && college.placementPercentage !== best.placementPercentage && "Use this if location or course mix matters more than pure numbers."}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
