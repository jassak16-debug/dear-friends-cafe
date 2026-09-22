import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import reservations from '../api/reservations.js';
import enquiries from '../api/enquiries.js';

// Minimal req/res doubles matching what Vercel passes to Node functions.
function call(handler, { method = 'POST', body } = {}) {
  return new Promise((resolve) => {
    const headers = {};
    const res = {
      statusCode: 200,
      setHeader: (k, v) => (headers[k.toLowerCase()] = v),
      end: (text) => resolve({ status: res.statusCode, headers, body: text ? JSON.parse(text) : null }),
    };
    handler({ method, headers: {}, body }, res);
  });
}

const future = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
const booking = { date: future, time: '09:30', guests: 2, name: 'Sam Lee', phone: '021 123 4567', email: 'sam@example.com' };

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.ONLINE_BOOKINGS;
});

const connect = () => {
  process.env.SUPABASE_URL = 'https://x.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'k';
  process.env.ONLINE_BOOKINGS = 'true';
};

test('GET is not allowed', async () => {
  const r = await call(reservations, { method: 'GET' });
  assert.equal(r.status, 405);
});

test('invalid booking → 400 with field errors', async () => {
  const r = await call(reservations, { body: { ...booking, email: 'x' } });
  assert.equal(r.status, 400);
  assert.ok(r.body.errors.email);
});

test('no backend configured → 503, never a fake success', async () => {
  const r = await call(reservations, { body: booking });
  assert.equal(r.status, 503);
  assert.equal(r.body.error, 'not_configured');
});

test('demo mode: Supabase keys alone do NOT enable storing (ONLINE_BOOKINGS off)', async () => {
  process.env.SUPABASE_URL = 'https://x.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'k';
  let called = false;
  globalThis.fetch = async () => { called = true; };
  const r = await call(reservations, { body: booking });
  assert.equal(r.status, 503);
  assert.equal(called, false);
});

test('honeypot submissions are accepted silently and not stored', async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; };
  connect();
  const r = await call(reservations, { body: { ...booking, company: 'spam inc' } });
  assert.equal(r.status, 200);
  assert.equal(called, false);
});

test('configured → stores row as "requested" and returns a reference', async () => {
  connect();
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, init };
    return new Response(JSON.stringify([{ id: 'abcdef12-3456' }]), { status: 201 });
  };
  const r = await call(reservations, { body: booking });
  assert.equal(r.status, 201);
  assert.equal(r.body.reference, 'ABCDEF12');
  assert.equal(sent.url, 'https://x.supabase.co/rest/v1/reservations');
  const row = JSON.parse(sent.init.body);
  assert.equal(row.status, 'requested');
  assert.equal(row.booking_time, '09:30');
});

test('database failure → 500, not success', async () => {
  connect();
  globalThis.fetch = async () => new Response('boom', { status: 500 });
  const orig = console.error; console.error = () => {};
  const r = await call(reservations, { body: booking });
  console.error = orig;
  assert.equal(r.status, 500);
});

test('enquiry: 503 when unconfigured, 201 when stored', async () => {
  const e = { name: 'Sam', phone: '0211234567', email: 's@e.co', occasion: 'Birthday', message: 'Lunch for 14 people' };
  assert.equal((await call(enquiries, { body: e })).status, 503);
  connect();
  globalThis.fetch = async () => new Response(JSON.stringify([{ id: '1' }]), { status: 201 });
  assert.equal((await call(enquiries, { body: e })).status, 201);
});
