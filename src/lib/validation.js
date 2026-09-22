/**
 * Validation shared by the browser forms and the /api functions, so the rules
 * are identical on both sides. No dependencies; runs in Node 18+ and browsers.
 */

export const TIME_ZONE = 'Pacific/Auckland';

/** Current date (YYYY-MM-DD) and minutes-since-midnight in Auckland. */
export function aucklandNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-NZ', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const fromMinutes = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** "07:30" -> "7:30am" */
export function formatTime(hhmm) {
  const mins = toMinutes(hhmm);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h < 12 ? 'am' : 'pm';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')}${suffix}`;
}

/** All bookable time slots for a given config. */
export function timeSlots({ firstTime, lastTime, intervalMinutes }) {
  const out = [];
  for (let t = toMinutes(firstTime); t <= toMinutes(lastTime); t += intervalMinutes) {
    out.push(fromMinutes(t));
  }
  return out;
}

export function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// NZ and international numbers: digits, spaces, +, -, brackets; 7–15 digits.
const phoneDigits = (v) => String(v || '').replace(/[^\d]/g, '');
const clean = (v) => String(v ?? '').trim();

function validContact(data, errors) {
  if (clean(data.name).length < 2) errors.name = 'Enter your name.';
  if (clean(data.name).length > 100) errors.name = 'Name must be 100 characters or fewer.';
  const digits = phoneDigits(data.phone);
  if (digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number we can reach you on.';
  if (!EMAIL_RE.test(clean(data.email))) errors.email = 'Enter a valid email address, e.g. name@example.com.';
}

/**
 * Validate a reservation request.
 * @returns {{ ok: boolean, errors: Record<string,string>, value: object }}
 */
export function validateReservation(data, booking, now = new Date()) {
  const errors = {};
  const today = aucklandNow(now);
  const date = clean(data.date);
  const time = clean(data.time);
  const guests = Number(data.guests);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Choose a date.';
  } else if (date < today.date) {
    errors.date = 'Choose today or a later date.';
  } else if (date > addDays(today.date, booking.maxDaysAhead)) {
    errors.date = `Bookings open up to ${booking.maxDaysAhead} days ahead. For later dates, please call us.`;
  }

  const slots = timeSlots(booking);
  if (!slots.includes(time)) {
    errors.time = 'Choose a time.';
  } else if (date === today.date && toMinutes(time) <= today.minutes) {
    errors.time = 'That time has passed. Choose a later time.';
  }

  if (!Number.isInteger(guests) || guests < 1) {
    errors.guests = 'Choose the number of guests.';
  } else if (guests > booking.maxGuests) {
    errors.guests = `For groups over ${booking.maxGuests}, please send a functions enquiry.`;
  }

  validContact(data, errors);

  const seating = ['no-preference', 'inside', 'outside'].includes(data.seating)
    ? data.seating
    : 'no-preference';
  const requests = clean(data.requests);
  if (requests.length > 1000) errors.requests = 'Keep special requests under 1000 characters.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      date,
      time,
      guests,
      name: clean(data.name),
      phone: clean(data.phone),
      email: clean(data.email).toLowerCase(),
      seating,
      requests: requests || null,
    },
  };
}

export const OCCASIONS = ['Birthday', 'Celebration', 'Group booking', 'Private function', 'Work event', 'Other'];

/** Validate a functions / group enquiry. */
export function validateEnquiry(data, now = new Date()) {
  const errors = {};
  validContact(data, errors);

  const occasion = OCCASIONS.includes(data.occasion) ? data.occasion : null;
  if (!occasion) errors.occasion = 'Choose the type of event.';

  const date = clean(data.date);
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = 'Enter a valid date.';
    else if (date < aucklandNow(now).date) errors.date = 'Choose a future date.';
  }

  const guests = clean(data.guests) === '' ? null : Number(data.guests);
  if (guests !== null && (!Number.isInteger(guests) || guests < 1 || guests > 500)) {
    errors.guests = 'Enter an approximate number of guests.';
  }

  const message = clean(data.message);
  if (message.length < 10) errors.message = 'Tell us a little about your event.';
  if (message.length > 2000) errors.message = 'Keep your message under 2000 characters.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      name: clean(data.name),
      phone: clean(data.phone),
      email: clean(data.email).toLowerCase(),
      occasion,
      date: date || null,
      guests,
      message,
    },
  };
}
