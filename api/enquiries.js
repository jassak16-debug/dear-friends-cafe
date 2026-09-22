/**
 * POST /api/enquiries
 * Functions / group booking enquiries. Same response shape as /api/reservations.
 */
import { validateEnquiry } from '../src/lib/validation.js';
import { guard, sendJson } from './_lib/http.js';
import { isConfigured, insertRow } from './_lib/supabase.js';

export default async function handler(req, res) {
  const body = await guard(req, res);
  if (!body) return;

  const { ok, errors, value } = validateEnquiry(body);
  if (!ok) return sendJson(res, 400, { errors });

  if (!isConfigured()) return sendJson(res, 503, { error: 'not_configured' });

  try {
    await insertRow('function_enquiries', {
      name: value.name,
      phone: value.phone,
      email: value.email,
      occasion: value.occasion,
      preferred_date: value.date,
      guests: value.guests,
      message: value.message,
      status: 'new',
    });
    return sendJson(res, 201, { ok: true });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: 'server_error' });
  }
}
