export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      if (!env.OPENAI_API_KEY) {
        return Response.json({ ok: true, aiStatus: "offline", reason: "OPENAI_API_KEY is not configured" });
      }
      try {
        const resp = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }
        });
        return Response.json({ ok: true, aiStatus: resp.ok ? "connected" : "error", httpStatus: resp.status });
      } catch {
        return Response.json({ ok: true, aiStatus: "error", reason: "network request failed" });
      }
    }

    if (url.pathname === "/api/ai-test" && request.method === "POST") {
      if (!env.OPENAI_API_KEY) {
        return Response.json({ ok: false, error: "AI key not configured" }, { status: 503 });
      }
      try {
        const resp = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-5-mini",
            input: "Reply with exactly: StudyMind AI OK"
          })
        });
        return Response.json({
          ok: resp.ok,
          status: resp.status,
          response: resp.ok ? "AI request succeeded" : "AI request failed"
        }, { status: resp.ok ? 200 : 502 });
      } catch {
        return Response.json({ ok: false, error: "network request failed" }, { status: 502 });
      }
    }

    if (url.pathname === "/api/config") {
      return Response.json({
        version: "1.3.0",
        curriculum: "الثالث الثانوي 2027",
        track: "علمي رياضة",
        apiKeyExposed: false
      });
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);

    return new Response("StudyMind is running.", {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
