import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getUniqueSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPage = await db.statusPage.findUnique({
      where: { id },
      include: { monitors: true },
    });

    if (!existingPage || existingPage.userId !== userId) {
      return NextResponse.json({ error: "Status page not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, slug: inputSlug, rawSlug, isPublic, monitorIds } = body;

    const baseForSlug = rawSlug || inputSlug || title || existingPage.title;
    const finalSlug = await getUniqueSlug(baseForSlug, id);

    const updatedPage = await db.statusPage.update({
      where: { id },
      data: {
        title: title ? title.trim() : existingPage.title,
        slug: finalSlug,
        isPublic: typeof isPublic === "boolean" ? isPublic : existingPage.isPublic,
      },
    });

    if (Array.isArray(monitorIds)) {
      // Re-link monitors
      await db.statusPageMonitor.deleteMany({
        where: { statusPageId: id },
      });

      if (monitorIds.length > 0) {
        await db.statusPageMonitor.createMany({
          data: monitorIds.map((monitorId: string) => ({
            statusPageId: id,
            monitorId,
          })),
        });
      }
    }

    const fullPage = await db.statusPage.findUnique({
      where: { id },
      include: { monitors: { select: { monitorId: true } } },
    });

    return NextResponse.json({ success: true, statusPage: fullPage });
  } catch (error: any) {
    console.error("[STATUS_PAGES_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPage = await db.statusPage.findUnique({ where: { id } });
    if (!existingPage || existingPage.userId !== userId) {
      return NextResponse.json({ error: "Status page not found" }, { status: 404 });
    }

    await db.statusPage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Status page deleted successfully." });
  } catch (error: any) {
    console.error("[STATUS_PAGES_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
