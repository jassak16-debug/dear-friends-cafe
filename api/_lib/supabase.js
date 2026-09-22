/**
 * Stores rows in Supabase through its REST API (no SDK needed).
 *
 * Required environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   SUPABASE_URL               https://<project-ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  server-only secret. Never expose it to the browser.
 *
 *   ONLINE_BOOKINGS            must be 'true' to accept requests at all
 *
 * If any is missing, isConfigured() is false and the endpoints answer 503,
 * which the site shows as "online bookings aren't available, please call".
 */
export function isConfigured() {
  // Deliberate on-switch as well as credentials, so a demo can't start storing
  // requests just because keys were added. Must match site.onlineRequests.
  return (
    process.env.ONLINE_BOOKINGS === 'true' &&
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export async function insertRow(table, row) {
  const url = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${table}`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Supabase insert into ${table} failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const [saved] = await res.json();
  return saved;
}
