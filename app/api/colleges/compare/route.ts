import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams
      .get("ids")
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (!ids || ids.length < 2) {
      return NextResponse.json({ error: "Select at least two colleges" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: { courses: { take: 4, orderBy: { annualFee: "asc" } } }
    });

    const ordered = ids
      .map((id) => colleges.find((college) => college.id === id))
      .filter(Boolean);

    return NextResponse.json({ colleges: ordered });
  } catch (error) {
    return apiError(error);
  }
}
