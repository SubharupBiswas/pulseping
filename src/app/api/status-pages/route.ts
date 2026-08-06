import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getUniqueSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, rawSlug, isPublic = true } = body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return NextResponse.json({ error: "Title must be at least 2 characters" }, { status: 400 });
    }

    // Check plan gating
    const userRecord = await db.user.findUnique({ where: { id: userId } });
    if (!userRecord || userRecord.plan === "FREE") {
      return NextResponse.json({ error: "Status Pages require a PRO or BUSINESS subscription" }, { status: 403 });
    }

    const finalSlug = await getUniqueSlug(rawSlug || title);

    const statusPage = await db.statusPage.create({
      data: {
        userId,
        title: title.trim(),
        slug: finalSlug,
        isPublic: Boolean(isPublic),
      },
    });

    return NextResponse.json({ success: true, statusPage });
  } catch (error: any) {
    console.error("[STATUS_PAGES_CREATE_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statusPages = await db.statusPage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ statusPages });
  } catch (error: any) {
    console.error("[STATUS_PAGES_GET_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
