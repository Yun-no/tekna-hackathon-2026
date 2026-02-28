const ALLOWED_ORIGIN = "https://tekna-hackathon.janschill.de";
const MET_BASE = "https://api.met.no";

export default {
  async fetch(request) {
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
    const targetUrl = `${MET_BASE}${url.pathname}${url.search}`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "SkogkontrollApp/1.0 github.com/skogkontroll",
      },
    });

    const newResponse = new Response(response.body, response);
    if (isAllowed) {
      for (const [key, value] of Object.entries(corsHeaders(origin))) {
        newResponse.headers.set(key, value);
      }
    }
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
