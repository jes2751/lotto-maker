export interface Env {
  DRAW_SYNC_SECRET: string;
  DRAW_SYNC_URL: string;
}

interface ScheduledExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

async function triggerDrawSync(env: Env) {
  const response = await fetch(env.DRAW_SYNC_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DRAW_SYNC_SECRET}`
    }
  });

  const payload = await response.text();

  if (!response.ok) {
    throw new Error(`Draw sync request failed with status ${response.status}: ${payload}`);
  }

  return new Response(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export default {
  async scheduled(_event: unknown, env: Env, ctx: ScheduledExecutionContext) {
    ctx.waitUntil(triggerDrawSync(env));
  },
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (request.method === "POST" || url.pathname === "/run") {
      return triggerDrawSync(env);
    }

    return Response.json({
      ok: true,
      name: "lotto-draw-sync-cron",
      schedule: "0 1 * * SUN (UTC, weekly)"
    });
  }
};
