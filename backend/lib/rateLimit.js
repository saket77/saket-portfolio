// Simple in-memory, per-IP fixed-window rate limit for the public /api/chat
// endpoint. Good enough for a single Railway instance; swap for a shared store
// if you ever scale to multiple instances.

const WINDOW_MS = Number(process.env.CHAT_RATE_WINDOW_MS || 60000);
const MAX = Number(process.env.CHAT_RATE_MAX || 12);
const hits = new Map(); // ip -> { count, reset }

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.ip || req.socket?.remoteAddress || "unknown";
}

function rateLimit(req, res, next) {
  const ip = clientIp(req);
  const now = Date.now();
  let rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    rec = { count: 0, reset: now + WINDOW_MS };
    hits.set(ip, rec);
  }
  rec.count += 1;
  if (rec.count > MAX) {
    const retry = Math.ceil((rec.reset - now) / 1000);
    res.set("Retry-After", String(retry));
    return res.status(429).json({ error: `Too many messages. Try again in ${retry}s.` });
  }
  next();
}

// Periodically drop expired buckets so the map doesn't grow unbounded.
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of hits) if (now > rec.reset) hits.delete(ip);
}, 5 * 60 * 1000);
if (cleanup.unref) cleanup.unref();

module.exports = rateLimit;
