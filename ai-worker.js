// Cloudflare Worker: AI proxy for Nadara. Keeps your API key secret.
// Settings > Variables: ANTHROPIC_API_KEY (secret), ALLOWED_ORIGIN (your GitHub Pages origin), MODEL (optional)
export default {
  async fetch(req, env) {
    const cors = {"Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST,OPTIONS"};
    if (req.method === "OPTIONS") return new Response(null, {headers: cors});
    if (req.method !== "POST") return new Response("POST only", {status: 405, headers: cors});
    let b; try { b = await req.json(); } catch { return new Response(JSON.stringify({error: "bad json"}), {status: 400, headers: cors}); }
    const prompt = String(b.prompt || "").slice(0, 4000);
    if (!prompt) return new Response(JSON.stringify({error: "empty"}), {status: 400, headers: cors});
    const r = await fetch("https://api.anthropic.com/v1/messages", {method: "POST",
      headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
      body: JSON.stringify({model: env.MODEL || "claude-haiku-5-5", max_tokens: 400, messages: [{role: "user", content: prompt}]})});
    const j = await r.json();
    const reply = (j.content && j.content[0] && j.content[0].text) || "";
    return new Response(JSON.stringify({reply}), {headers: {...cors, "Content-Type": "application/json"}});
  }
};
