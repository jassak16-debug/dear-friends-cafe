/** Minimal helpers for Vercel Node functions (also used by the local dev server). */

const MAX_BODY_BYTES = 20 * 1024;

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/** Vercel pre-parses JSON into req.body; otherwise read the stream ourselves. */
export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Payload too large'), { status: 413 });
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

/**
 * Shared request guard: method, optional origin allow-list, JSON parsing, honeypot.
 * Returns the parsed body, or null if a response has already been sent.
 */
export async function guard(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'method_not_allowed' });
    return null;
  }
  const allowed = process.env.ALLOWED_ORIGIN; // e.g. https://www.yourdomain.co.nz
  if (allowed && req.headers.origin && req.headers.origin !== allowed) {
    sendJson(res, 403, { error: 'forbidden_origin' });
    return null;
  }
  let body;
  try {
    body = await readJson(req);
  } catch (err) {
    sendJson(res, err.status || 400, { error: 'invalid_json' });
    return null;
  }
  // Honeypot filled in: accept silently so bots learn nothing, but store nothing.
  if (body && body.company) {
    sendJson(res, 200, { ok: true });
    return null;
  }
  return body || {};
}
