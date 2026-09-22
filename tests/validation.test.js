import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateReservation, validateEnquiry, timeSlots, formatTime, aucklandNow } from '../src/lib/validation.js';

const booking = { firstTime: '07:00', lastTime: '14:30', intervalMinutes: 30, maxGuests: 10, maxDaysAhead: 60 };
// 10:00am NZST on Wednesday 23 Sept 2026 (UTC+12)
const NOW = new Date('2026-09-22T22:00:00Z');
const good = { date: '2026-09-25', time: '09:30', guests: '4', name: 'Sam Lee', phone: '021 123 4567', email: 'Sam@Example.com' };

test('Auckland date/time is used, not server time', () => {
  assert.deepEqual(aucklandNow(NOW), { date: '2026-09-23', minutes: 600 });
});

test('time slots run from first to last booking time', () => {
  const s = timeSlots(booking);
  assert.equal(s[0], '07:00');
  assert.equal(s.at(-1), '14:30');
  assert.equal(s.length, 16);
  assert.equal(formatTime('14:30'), '2:30pm');
  assert.equal(formatTime('07:00'), '7:00am');
});

test('valid reservation passes and is normalised', () => {
  const r = validateReservation(good, booking, NOW);
  assert.equal(r.ok, true);
  assert.equal(r.value.guests, 4);
  assert.equal(r.value.email, 'sam@example.com');
  assert.equal(r.value.seating, 'no-preference');
});

test('rejects past dates, past times today, too far ahead, big groups', () => {
  assert.ok(validateReservation({ ...good, date: '2026-09-22' }, booking, NOW).errors.date);
  assert.ok(validateReservation({ ...good, date: '2026-09-23', time: '09:30' }, booking, NOW).errors.time);
  assert.equal(validateReservation({ ...good, date: '2026-09-23', time: '10:30' }, booking, NOW).ok, true);
  assert.ok(validateReservation({ ...good, date: '2026-12-31' }, booking, NOW).errors.date);
  assert.ok(validateReservation({ ...good, guests: '11' }, booking, NOW).errors.guests);
});

test('rejects times outside the bookable slots', () => {
  assert.ok(validateReservation({ ...good, time: '15:30' }, booking, NOW).errors.time);
  assert.ok(validateReservation({ ...good, time: '09:15' }, booking, NOW).errors.time);
});

test('contact details are required', () => {
  const r = validateReservation({ ...good, name: '', phone: '12', email: 'nope' }, booking, NOW);
  assert.deepEqual(Object.keys(r.errors).sort(), ['email', 'name', 'phone']);
});

test('enquiry validation', () => {
  const e = { name: 'Sam', phone: '0211234567', email: 's@e.co', occasion: 'Birthday', message: 'Lunch for 14 people' };
  assert.equal(validateEnquiry(e, NOW).ok, true);
  assert.ok(validateEnquiry({ ...e, occasion: 'Rave' }, NOW).errors.occasion);
  assert.ok(validateEnquiry({ ...e, message: 'hi' }, NOW).errors.message);
  assert.ok(validateEnquiry({ ...e, date: '2020-01-01' }, NOW).errors.date);
});
