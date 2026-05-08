import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof Response) return error;

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

export function parsePage(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(12, Math.max(4, Number(searchParams.get("pageSize") ?? 6)));
  return { page, pageSize };
}
