import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ collegeId: string }> };

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { collegeId } = await params;

    await prisma.savedCollege.delete({
      where: { userId_collegeId: { userId: user.id, collegeId } }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
