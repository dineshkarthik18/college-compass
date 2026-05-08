import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const updateSchema = z
  .object({
    name: z.string().min(2).optional(),
    fees: z.number().int().min(0).optional(),
    rating: z.number().min(0).max(5).optional(),
    placementPercentage: z.number().int().min(0).max(100).optional(),
    overview: z.string().min(20).optional()
  })
  .refine((value) => Object.keys(value).length > 0, "No update fields provided");

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const college = await prisma.college.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        courses: { orderBy: { annualFee: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ college });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const college = await prisma.college.update({ where: { id }, data: body });
    return NextResponse.json({ college });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.college.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
