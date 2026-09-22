/**
 * POST /api/reservations
 * Validates a booking request and stores it with status "requested".
 * A stored request is NOT a confirmed booking; the café confirms it.
 *
 * Responses:
 *   201 { ok: true, reference }     stored
 *   400 { errors: {field: msg} }    validation failed
 *   503 { error: 'not_configured' } no booking backend connected yet
 *   500 { error: 'server_error' }
 */
import { site } from '../src/config/site.js';
import { validateReservation } from '../src/lib/validation.js';
import { guard, sendJson } from './_lib/http.js';
import { isConfigured, insertRow } from './_lib/supabase.js';

export default async function handler(req, res) {
  const body = await guard(req, res);
  if (!body) return;

  const { ok, errors, value } = validateReservation(body, site.booking);
  if (!ok) return sendJson(res, 400, { errors });

  if (!isConfigured()) return sendJson(res, 503, { error: 'not_configured' });

  try {
    const saved = await insertRow('reservations', {
      booking_date: value.date,
      booking_time: value.time,
      guests: value.guests,
      name: value.name,
      phone: value.phone,
      email: value.email,
      seating: value.seating,
      special_requests: value.requests,
      status: 'requested',
      source: 'website',
    });
    // TODO(next step): notify the café (e.g. email via Resend, or Supabase webhook).
    return sendJson(res, 201, { ok: true, reference: String(saved.id).slice(0, 8).toUpperCase() });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { error: 'server_error' });
  }
}
