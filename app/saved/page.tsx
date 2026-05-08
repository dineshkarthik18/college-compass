import Link from "next/link";
import { redirect } from "next/navigation";
import { BookmarkX } from "lucide-react";
import { CollegeCard } from "@/components/college-card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const saved = await prisma.savedCollege.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { college: { include: { courses: { select: { name: true }, take: 3 } } } }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="border-b border-line pb-6">
        <p className="text-sm font-semibold text-moss">Signed in as {user.name}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal">Saved colleges</h1>
        <p className="mt-3 max-w-2xl text-ink/65">Your private shortlist stays tied to your account so you can compare and revisit decisions later.</p>
      </section>

      {saved.length === 0 ? (
        <section className="mt-8 rounded border border-line bg-white p-8 text-center">
          <BookmarkX className="mx-auto text-ink/35" size={42} />
          <h2 className="mt-4 text-xl font-semibold">No saved colleges yet.</h2>
          <p className="mt-2 text-sm text-ink/60">Start from discovery and save colleges that look relevant.</p>
          <Link href="/" className="focus-ring mt-5 inline-flex h-10 items-center rounded bg-ink px-4 text-sm font-semibold text-white hover:bg-moss">
            Browse colleges
          </Link>
        </section>
      ) : (
        <section className="mt-6 grid gap-4">
          {saved.map((item) => (
            <CollegeCard key={item.id} college={item.college} />
          ))}
        </section>
      )}
    </main>
  );
}
