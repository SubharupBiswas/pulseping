import { NextRequest, NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import { analyzeAndAlertFailure } from "@/lib/webhook-alert";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const resolvedParams = await params;
  const guardId = resolvedParams.id;

  const guard = await db.webhookGuard.findUnique({ where: { id: guardId } });
  if (!guard) {
    return NextResponse.json({ error: "Webhook Guard Not Found" }, { status: 404 });
  }

  const rawBody = await req.json();
  const headers = new Headers(req.headers);
  headers.delete("host");

  let responseStatus = 500;
  let responseText = "";
  let isFailure = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), guard.timeoutMs);

    const targetResponse = await fetch(guard.targetUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(rawBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    responseStatus = targetResponse.status;
    responseText = await targetResponse.text();

    if (!targetResponse.ok) isFailure = true;
  } catch (error: any) {
    isFailure = true;
    responseText =
      error.name === "AbortError"
        ? "Target server timed out (> 4.5 seconds)"
        : error.message;
  }

  const executionTimeMs = Date.now() - startTime;

  after(async () => {
    const log = await db.webhookLog.create({
      data: {
        guardId: guard.id,
        requestHeaders: JSON.parse(JSON.stringify(Object.fromEntries(req.headers))),
        rawBody,
        responseStatus,
        executionTimeMs,
        errorMessage: isFailure ? responseText : null,
        isFailure,
      },
    });

    if (isFailure) {
      await analyzeAndAlertFailure(guard, log);
    }
  });

  return new NextResponse(responseText, { status: responseStatus });
}
