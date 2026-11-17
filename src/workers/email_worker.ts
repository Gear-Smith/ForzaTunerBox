import { z } from "zod";
import { FEEDBACK_PATH } from "../feedbackRoute";

interface CloudflareEnv {
  RESEND_KEY: { get(): Promise<string> };
  FEEDBACK_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const inbox = "feedback@forzatunerbox.com";
const headers = {
  "Access-Control-Allow-Origin": "https://forzatunerbox.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const feedback = z.strictObject({
  content: z.string().trim().min(1).max(5000),
  email: z.email().max(254).optional(),
  tune: z.record(z.string(), z.unknown()).nullish(),
});

function respond(body: string | null, status: number) {
  return new Response(body, { status, headers });
}

async function readFeedback(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return JSON.parse(text + decoder.decode());
      bytes += value.byteLength;
      if (bytes > 32 * 1024) {
        await reader.cancel();
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    if (new URL(request.url).pathname !== FEEDBACK_PATH) return respond("Not Found", 404);
    if (request.method === "OPTIONS") return respond(null, 204);
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { ...headers, Allow: "POST, OPTIONS" },
      });
    }
    const mediaType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
    if (mediaType !== "application/json") return respond("Expected JSON", 415);

    const { success } = await env.FEEDBACK_LIMITER.limit({
      key: "feedback:" + (request.headers.get("CF-Connecting-IP") ?? "unknown"),
    });
    if (!success) return respond("Too Many Requests", 429);

    const submission = feedback.safeParse(await readFeedback(request));
    if (!submission.success) return respond("Invalid feedback", 400);
    const { email, content, tune } = submission.data;
    const text = [
      content,
      email ? "Submitted email: " + email : "",
      tune ? "Included tune data:\n" + JSON.stringify(tune, null, 2) : "",
    ].filter(Boolean).join("\n\n");

    try {
      const apiKey = await env.RESEND_KEY.get();
      const result = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "ForzaTunerBox <" + inbox + ">",
          to: inbox,
          subject: "ForzaTunerBox Feedback",
          text,
        }),
      });
      return result.ok ? respond(null, 204) : respond("Unable to send feedback", 502);
    } catch {
      return respond("Unable to send feedback", 502);
    }
  },
};
