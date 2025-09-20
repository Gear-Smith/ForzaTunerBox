interface CloudflareEnv {
  RESEND_KEY: {
    get(): Promise<string>;
  };
}

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() })
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors() })
    }

    const { to, subject, html, from } = await request.json()
    const apiKey = await env.RESEND_KEY.get()

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from ?? "feedback@forzatunerbox.com",
        to,
        subject,
        html,
      }),
    })

    const payload = await r.text()
    return new Response(payload, { status: r.status, headers: { ...cors(), "Content-Type": "application/json" } })
  },
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "https://forzatunerbox.com",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  }
}
