import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, GraduationCap, MapPin, Star, TrendingUp } from "lucide-react";
import { CompareToggle } from "@/components/compare-toggle";
import { SaveButton } from "@/components/save-button";
import { Pill } from "@/components/ui";
import { formatCurrency, formatPackage } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function CollegeDetailPage({ params }: Props) {
  const { id } = await params;
  const college = await prisma.college.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      courses: { orderBy: { annualFee: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!college) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded text-sm font-semibold text-moss hover:text-ink">
        <ArrowLeft size={16} />
        Back to colleges
      </Link>

      <section className="mt-6 grid gap-6 border-b border-line pb-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Pill tone="good">{college.type}</Pill>
            <Pill>{college.accreditation}</Pill>
          </div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink sm:text-5xl">{college.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-ink/64">
            <MapPin size={18} />
            {college.location}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-ink/70">{college.overview}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <SaveButton collegeId={college.id} />
            <CompareToggle collegeId={college.id} />
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-semibold hover:border-moss"
            >
              Official site
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
        <aside className="grid gap-3 rounded border border-line bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-1">
          {[
            ["Rating", `${college.rating.toFixed(1)} / 5`, Star],
            ["Annual fees", formatCurrency(college.fees), GraduationCap],
            ["Placement", `${college.placementPercentage}%`, TrendingUp],
            ["Average package", formatPackage(college.averagePackage), TrendingUp]
          ].map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded bg-paper p-4">
              <p className="flex items-center gap-2 text-sm text-ink/58">
                <Icon size={16} />
                {String(label)}
              </p>
              <p className="mt-1 text-xl font-semibold">{String(value)}</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="grid gap-6 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-semibold">Courses</h2>
          <div className="mt-4 overflow-hidden rounded border border-line bg-white">
            <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-line bg-paper px-4 py-3 text-sm font-semibold text-ink/70">
              <span>Course</span>
              <span>Level</span>
              <span>Annual fee</span>
              <span>Seats</span>
            </div>
            {college.courses.map((course) => (
              <div key={course.id} className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.7fr] gap-3 border-b border-line px-4 py-4 text-sm last:border-b-0">
                <span className="font-semibold">{course.name}</span>
                <span>{course.level}</span>
                <span>{formatCurrency(course.annualFee)}</span>
                <span>{course.seats}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Basic Information</h2>
          <dl className="mt-4 grid gap-3 rounded border border-line bg-white p-4">
            {[
              ["Established", college.establishedYear],
              ["Campus size", college.campusSize],
              ["Highest package", formatPackage(college.highestPackage)],
              ["Location", college.location]
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0">
                <dt className="text-sm text-ink/58">{String(label)}</dt>
                <dd className="text-right text-sm font-semibold">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-6 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded border border-line bg-white p-5">
          <h2 className="text-2xl font-semibold">Placements</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded bg-skyglass p-4">
              <p className="text-sm text-ink/60">Placement percentage</p>
              <p className="mt-1 text-3xl font-semibold">{college.placementPercentage}%</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded bg-paper p-4">
                <p className="text-sm text-ink/60">Average</p>
                <p className="mt-1 text-xl font-semibold">{formatPackage(college.averagePackage)}</p>
              </div>
              <div className="rounded bg-paper p-4">
                <p className="text-sm text-ink/60">Highest</p>
                <p className="mt-1 text-xl font-semibold">{formatPackage(college.highestPackage)}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <div className="mt-4 grid gap-3">
            {college.reviews.map((review) => (
              <article key={review.id} className="rounded border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{review.title}</h3>
                  <span className="text-sm font-semibold text-coral">{review.rating.toFixed(1)}</span>
                </div>
                <p className="mt-1 text-sm text-ink/50">{review.author}</p>
                <p className="mt-3 text-sm leading-6 text-ink/70">{review.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
