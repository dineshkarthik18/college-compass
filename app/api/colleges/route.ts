import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parsePage } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  slug: z.string().min(3),
  name: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  location: z.string().min(2),
  type: z.string().min(2),
  establishedYear: z.number().int().min(1800).max(new Date().getFullYear()),
  accreditation: z.string().min(2),
  overview: z.string().min(20),
  fees: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  placementPercentage: z.number().int().min(0).max(100),
  averagePackage: z.number().min(0),
  highestPackage: z.number().min(0),
  campusSize: z.string().min(2),
  website: z.string().url()
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePage(searchParams);
    const query = searchParams.get("q")?.trim();
    const location = searchParams.get("location")?.trim();
    const course = searchParams.get("course")?.trim();
    const feeBand = searchParams.get("fees")?.trim();

    const where: Prisma.CollegeWhereInput = {};

    if (query) {
      where.name = { contains: query, mode: "insensitive" };
    }

    if (location && location !== "all") {
      where.OR = [
        { city: { equals: location, mode: "insensitive" } },
        { state: { equals: location, mode: "insensitive" } }
      ];
    }

    if (course && course !== "all") {
      where.courses = {
        some: { name: { contains: course, mode: "insensitive" } }
      };
    }

    if (feeBand && feeBand !== "all") {
      const feeRanges: Record<string, Prisma.IntFilter> = {
        low: { lte: 100000 },
        mid: { gt: 100000, lte: 300000 },
        high: { gt: 300000, lte: 600000 },
        premium: { gt: 600000 }
      };
      where.fees = feeRanges[feeBand];
    }

    const [total, colleges, locations, courses] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy: [{ rating: "desc" }, { placementPercentage: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { courses: { select: { name: true }, take: 3 } }
      }),
      prisma.college.findMany({
        distinct: ["city"],
        orderBy: { city: "asc" },
        select: { city: true, state: true }
      }),
      prisma.course.findMany({
        distinct: ["name"],
        orderBy: { name: "asc" },
        select: { name: true }
      })
    ]);

    return NextResponse.json({
      colleges,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      facets: { locations, courses }
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = createSchema.parse(await request.json());
    const college = await prisma.college.create({ data: body });
    return NextResponse.json({ college }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
