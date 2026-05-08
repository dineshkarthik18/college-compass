import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { formatCurrency, formatPackage } from "@/lib/format";
import { CompareToggle } from "@/components/compare-toggle";
import { SaveButton } from "@/components/save-button";
import { Pill } from "@/components/ui";

type CollegeCardProps = {
  college: {
    id: string;
    slug: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placementPercentage: number;
    averagePackage: number;
    courses?: { name: string }[];
  };
};

export function CollegeCard({ college }: CollegeCardProps) {
  return (
    <article className="rounded border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill tone="good">{college.placementPercentage}% placed</Pill>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
              <Star size={15} className="fill-coral text-coral" />
              {college.rating.toFixed(1)}
            </span>
          </div>
          <Link href={`/colleges/${college.slug}`} className="focus-ring rounded text-lg font-semibold leading-snug text-ink hover:text-moss">
            {college.name}
          </Link>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/65">
            <MapPin size={15} />
            {college.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {college.courses?.map((course) => <Pill key={course.name}>{course.name}</Pill>)}
          </div>
        </div>
        <div className="grid min-w-44 grid-cols-2 gap-2 text-sm sm:text-right">
          <div>
            <p className="text-ink/55">Annual fees</p>
            <p className="font-semibold">{formatCurrency(college.fees)}</p>
          </div>
          <div>
            <p className="text-ink/55">Avg package</p>
            <p className="font-semibold">{formatPackage(college.averagePackage)}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SaveButton collegeId={college.id} />
        <CompareToggle collegeId={college.id} />
        <Link
          href={`/colleges/${college.slug}`}
          className="focus-ring ml-auto inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-semibold text-moss hover:bg-skyglass"
        >
          View details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
