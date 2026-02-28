const ALLOWED_ORIGIN = "https://tekna-hackathon.janschill.de";
const MET_BASE = "https://api.met.no";
const CACHE_TTL = 600; // 10 minutes

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const isAllowed =
      origin === ALLOWED_ORIGIN || origin === "http://localhost:5173";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(isAllowed ? origin : ALLOWED_ORIGIN),
      });
    }

    const url = new URL(request.url);
    const cacheKey = new Request(`${MET_BASE}${url.pathname}${url.search}`, request);
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) {
      const response = new Response(cached.body, cached);
      if (isAllowed) {
        for (const [key, value] of Object.entries(corsHeaders(origin))) {
          response.headers.set(key, value);
        }
      }
      return response;
    }

    const targetUrl = `${MET_BASE}${url.pathname}${url.search}`;
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "SkogkontrollApp/1.0 github.com/skogkontroll",
      },
    });

    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Cache-Control", `s-maxage=${CACHE_TTL}`);
    if (isAllowed) {
      for (const [key, value] of Object.entries(corsHeaders(origin))) {
        newResponse.headers.set(key, value);
      }
    }

    // Store in cache (non-blocking)
    ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));

    return newResponse;
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}
