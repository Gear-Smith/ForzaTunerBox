import type { ForzaTune } from "../ForzaTune";
import { FEEDBACK_PATH } from "../feedbackRoute";

interface SendFeedbackEmailParams {
  email?: string;
  content: string;
  tune?: ReturnType<ForzaTune["toJSON"]> | null;
}

export async function sendFeedbackEmail({ email, content, tune }: SendFeedbackEmailParams): Promise<void> {
  const workerUrl = import.meta.env.VITE_WORKER_URL;
  if (!workerUrl) throw new Error("Worker URL not configured");

  const response = await fetch(new URL(FEEDBACK_PATH, workerUrl).href, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email?.trim() || undefined, content, tune }),
  });
  if (!response.ok) throw new Error("Failed to send feedback: " + response.status);
}
