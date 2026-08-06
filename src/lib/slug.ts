import crypto from "crypto";
import { db } from "@/lib/db";

export async function getUniqueSlug(baseInput: string, currentId?: string): Promise<string> {
  let slug = baseInput
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (!slug) slug = "status";

  let candidate = slug;
  let isUnique = false;

  while (!isUnique) {
    const existing = await db.statusPage.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === currentId) {
      isUnique = true;
    } else {
      const suffix = crypto.randomBytes(2).toString("hex"); // e.g. "a9f2"
      candidate = `${slug}-${suffix}`;
    }
  }

  return candidate;
}
