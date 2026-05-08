"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CollegeCard } from "@/components/college-card";

type College = {
  id: string;
  slug: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  courses: { name: string }[];
};

type ApiResponse = {
  colleges: College[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
  facets: {
    locations: { city: string; state: string }[];
    courses: { name: string }[];
  };
};

const feeOptions = [
  { value: "all", label: "Any fees" },
  { value: "low", label: "Under ₹1L" },
  { value: "mid", label: "₹1L - ₹3L" },
  { value: "high", label: "₹3L - ₹6L" },
  { value: "premium", label: "₹6L+" }
];

export function CollegeExplorer() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("all");
  const [course, setCourse] = useState("all");
  const [fees, setFees] = useState("all");
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const next = new URLSearchParams({ page: String(page), pageSize: "6" });
    if (q.trim()) next.set("q", q.trim());
    if (location !== "all") next.set("location", location);
    if (course !== "all") next.set("course", course);
    if (fees !== "all") next.set("fees", fees);
    return next;
  }, [course, fees, location, page, q]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`/api/colleges?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load colleges");
        return response.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [params]);

  function resetFilters() {
    setQ("");
    setLocation("all");
    setCourse("all");
    setFees("all");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 border-b border-line pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="mb-3 inline-flex rounded bg-skyglass px-3 py-1 text-sm font-semibold text-ink">Structured college decisions</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
            Discover colleges by fit, not just fame.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/68">
            Search real structured data, shortlist options, and compare outcomes side by side before you decide where to apply.
          </p>
        </div>
        <div className="rounded border border-line bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-ink">Quick compare</p>
          <p className="mt-1 text-sm text-ink/60">Select two or three colleges from the listing, then open the decision table.</p>
          <Link
            href="/compare"
            className="focus-ring mt-4 inline-flex h-10 items-center rounded bg-coral px-4 text-sm font-semibold text-white hover:bg-coral/90"
          >
            Open compare
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded border border-line bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/42" size={18} />
            <input
              value={q}
              onChange={(event) => {
                setQ(event.target.value);
                setPage(1);
              }}
              placeholder="Search college name"
              className="focus-ring h-11 w-full rounded border border-line bg-paper pl-10 pr-3 text-sm"
            />
          </label>
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
              setPage(1);
            }}
            className="focus-ring h-11 rounded border border-line bg-paper px-3 text-sm"
            aria-label="Filter by location"
          >
            <option value="all">All locations</option>
            {data?.facets.locations.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}, {item.state}
              </option>
            ))}
          </select>
          <select
            value={fees}
            onChange={(event) => {
              setFees(event.target.value);
              setPage(1);
            }}
            className="focus-ring h-11 rounded border border-line bg-paper px-3 text-sm"
            aria-label="Filter by fees"
          >
            {feeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            value={course}
            onChange={(event) => {
              setCourse(event.target.value);
              setPage(1);
            }}
            className="focus-ring h-11 rounded border border-line bg-paper px-3 text-sm"
            aria-label="Filter by course"
          >
            <option value="all">All courses</option>
            {data?.facets.courses.slice(0, 18).map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded border border-line px-3 text-sm font-semibold hover:bg-paper"
          >
            <X size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink/70">
            <SlidersHorizontal size={17} />
            {data ? `${data.meta.total} colleges found` : "Loading colleges"}
          </p>
        </div>

        {error && <div className="rounded border border-coral/30 bg-coral/10 p-4 text-sm font-medium text-coral">{error}</div>}

        {loading && (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse rounded border border-line bg-white" />
            ))}
          </div>
        )}

        {!loading && data?.colleges.length === 0 && (
          <div className="rounded border border-line bg-white p-8 text-center">
            <p className="text-lg font-semibold">No colleges match these filters.</p>
            <p className="mt-2 text-sm text-ink/60">Try widening fees, location, or course criteria.</p>
          </div>
        )}

        {!loading && data && data.colleges.length > 0 && (
          <>
            <div className="grid gap-4">
              {data.colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm font-medium text-ink/65">
                Page {data.meta.page} of {Math.max(1, data.meta.totalPages)}
              </span>
              <button
                type="button"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
