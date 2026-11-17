import { afterEach, expect, it, vi } from "vitest";
import worker from "./email_worker";

afterEach(() => vi.unstubAllGlobals());

const send = (body: unknown, path = "/api/feedback", allowed = true) => {
  const upstream = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
  vi.stubGlobal("fetch", upstream);
  const env = {
    RESEND_KEY: { get: async () => "test-key" },
    FEEDBACK_LIMITER: { limit: async () => ({ success: allowed }) },
  };
  const response = worker.fetch(new Request("https://example.com" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }), env);
  return { response, upstream };
};

it("rejects the old arbitrary mail payload without contacting Resend", async () => {
  const { response, upstream } = send({ to: "other@example.com", subject: "spam", html: "<img>" });
  expect((await response).status).toBe(400);
  expect(upstream).not.toHaveBeenCalled();
});

it("rejects unknown paths and rate-limited submissions", async () => {
  const missing = send({ content: "Feedback" }, "/backup.zip");
  expect((await missing.response).status).toBe(404);
  expect(missing.upstream).not.toHaveBeenCalled();
  const limited = send({ content: "Feedback" }, "/api/feedback", false);
  expect((await limited.response).status).toBe(429);
  expect(limited.upstream).not.toHaveBeenCalled();
});

it("sends plain text feedback to the fixed inbox", async () => {
  const { response, upstream } = send({ content: "<img>", email: "user@example.com", tune: { weight: 1500 } });
  expect((await response).status).toBe(204);
  const payload = JSON.parse(upstream.mock.calls[0][1].body);
  expect(payload).toEqual({
    from: "ForzaTunerBox <feedback@forzatunerbox.com>",
    to: "feedback@forzatunerbox.com",
    subject: "ForzaTunerBox Feedback",
    text: expect.stringContaining("<img>"),
  });
  expect(payload.text).toContain("user@example.com");
  expect(payload.text).toContain("1500");
});

it("returns 404 for a guessed backup URL and reserves 405 for the feedback route", async () => {
  const getSecret = vi.fn();
  const limit = vi.fn();
  const upstream = vi.fn();
  vi.stubGlobal("fetch", upstream);
  const env = { RESEND_KEY: { get: getSecret }, FEEDBACK_LIMITER: { limit } };

  const missing = await worker.fetch(new Request("https://example.com/backup.zip"), env);
  expect(missing.status).toBe(404);

  const feedback = await worker.fetch(new Request("https://example.com/api/feedback"), env);
  expect(feedback.status).toBe(405);
  expect(feedback.headers.get("Allow")).toBe("POST, OPTIONS");
  expect(limit).not.toHaveBeenCalled();
  expect(getSecret).not.toHaveBeenCalled();
  expect(upstream).not.toHaveBeenCalled();
});
