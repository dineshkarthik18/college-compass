import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  collegeId: z.string().min(1),
  notes: z.string().max(500).optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        college: {
          include: { courses: { select: { name: true }, take: 3 } }
        }
      }
    });

    return NextResponse.json({ saved });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await request.json());

    const saved = await prisma.savedCollege.upsert({
      where: { userId_collegeId: { userId: user.id, collegeId: body.collegeId } },
      update: { notes: body.notes },
      create: { userId: user.id, collegeId: body.collegeId, notes: body.notes },
      include: { college: true }
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
