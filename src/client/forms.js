/**
 * Reservation and functions enquiry forms.
 *
 * Validates in the browser with the same rules the server uses, then POSTs JSON
 * to the form's data-endpoint. The UI only reports success when the server
 * says the request was stored. If no backend is connected yet (503), or the
 * request fails, people are told plainly to call instead — nothing is faked.
 */
import {
  validateReservation,
  validateEnquiry,
  aucklandNow,
  addDays,
  toMinutes,
  formatTime,
} from './validation.js';

const REQUEST_TIMEOUT_MS = 15000;

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-NZ', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

function readForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return data;
}

function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach((el) => (el.textContent = ''));
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
}

function showErrors(form, errors) {
  let first = null;
  for (const [name, message] of Object.entries(errors)) {
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    const input = form.elements[name];
    if (slot) slot.textContent = message;
    if (input && input.setAttribute) {
      input.setAttribute('aria-invalid', 'true');
      first ??= input;
    }
  }
  first?.focus();
}

function setStatus(form, kind, htmlContent) {
  const status = form.querySelector('[data-form-status]');
  status.className = `form-status form-status--${kind}`;
  status.innerHTML = htmlContent;
  status.focus();
  return status;
}

const callLine = (phone) =>
  `<a class="btn btn--solid" href="tel:${escapeHtml(phone.e164)}">Call ${escapeHtml(phone.display)}</a>`;

async function send(endpoint, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    let body = {};
    try { body = await res.json(); } catch { /* non-JSON (e.g. static host 404) */ }
    return { status: res.status, body };
  } catch {
    return { status: 0, body: {} };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- reservation-specific behaviour ---------- */

function setupReservation(form, config) {
  const { booking } = config;
  const dateInput = form.elements.date;
  const timeSelect = form.elements.time;
  const today = aucklandNow();
  dateInput.min = today.date;
  dateInput.max = addDays(today.date, booking.maxDaysAhead);

  // On today's date, disable times that have already passed.
  const syncTimes = () => {
    const now = aucklandNow();
    const isToday = dateInput.value === now.date;
    [...timeSelect.options].forEach((opt) => {
      if (!opt.value) return;
      opt.disabled = isToday && toMinutes(opt.value) <= now.minutes;
    });
    if (timeSelect.selectedOptions[0]?.disabled) timeSelect.value = '';
    const anyLeft = [...timeSelect.options].some((o) => o.value && !o.disabled);
    const slot = form.querySelector('[data-error-for="time"]');
    if (isToday && !anyLeft) {
      slot.textContent = 'There are no more online booking times today. Choose another date or call us.';
    } else if (slot.textContent.startsWith('There are no more')) {
      slot.textContent = '';
    }
  };
  dateInput.addEventListener('change', syncTimes);
  syncTimes();
}

function reservationSuccess(form, value, body) {
  const seating = { 'no-preference': 'No preference', inside: 'Inside', outside: 'Outside' }[value.seating];
  hideFields(form);
  setStatus(
    form,
    'success',
    `<p class="form-status__title">Booking request sent</p>
     <p>Thanks, ${escapeHtml(value.name)}. We’ve received your request. It isn’t confirmed yet. We’ll contact you on ${escapeHtml(value.phone)} or by email to confirm.</p>
     <dl>
       <dt>Date</dt><dd>${escapeHtml(formatDate(value.date))}</dd>
       <dt>Time</dt><dd>${escapeHtml(formatTime(value.time))}</dd>
       <dt>Guests</dt><dd>${escapeHtml(value.guests)}</dd>
       <dt>Seating</dt><dd>${escapeHtml(seating)}</dd>
       ${body.reference ? `<dt>Reference</dt><dd>${escapeHtml(body.reference)}</dd>` : ''}
     </dl>
     <a class="text-link" href="/reservations">Make another booking</a>`,
  );
}

function enquirySuccess(form, value) {
  hideFields(form);
  setStatus(
    form,
    'success',
    `<p class="form-status__title">Enquiry sent</p>
     <p>Thanks, ${escapeHtml(value.name)}. We’ve received your enquiry and will be in touch using the details you gave us.</p>`,
  );
}

function hideFields(form) {
  form.querySelectorAll('fieldset, .form__submit').forEach((el) => (el.hidden = true));
}

/* ---------- shared submit flow ---------- */

function setupForm(form) {
  const kind = form.dataset.form;
  const config = JSON.parse(form.dataset.config || '{}');
  if (kind === 'reservation') setupReservation(form, config);

  const submit = form.querySelector('[data-submit]');
  const submitLabel = submit.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);
    const data = readForm(form);

    // Honeypot: bots fill the hidden field. Stop quietly.
    if (data.company) return;

    const result = kind === 'reservation' ? validateReservation(data, config.booking) : validateEnquiry(data);
    if (!result.ok) {
      showErrors(form, result.errors);
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    const { status, body } = await send(form.dataset.endpoint, { ...result.value, company: '' });
    submit.disabled = false;
    submit.textContent = submitLabel;

    if (status === 201 || status === 200) {
      if (kind === 'reservation') reservationSuccess(form, result.value, body);
      else enquirySuccess(form, result.value);
      return;
    }
    if (status === 400 && body.errors) {
      showErrors(form, body.errors);
      return;
    }
    // 503 = backend not connected yet; 404/0 = no API available (e.g. static preview) or offline.
    const notConnected = status === 503 || status === 404 || status === 0;
    const what = kind === 'reservation' ? 'booking' : 'enquiry';
    setStatus(
      form,
      notConnected ? 'unavailable' : 'error',
      `<p class="form-status__title">${notConnected ? (kind === 'reservation' ? 'Online booking isn’t live yet' : 'Online enquiries aren’t live yet') : `Your ${what} wasn’t sent`}</p>
       <p>${notConnected ? `Nothing has been ${kind === 'reservation' ? 'booked' : 'sent'}.` : 'Something went wrong and nothing was sent.'} Please call ${escapeHtml(config.phone.display)}.</p>
       <p>Your details are still in the form.</p>
       <p>${callLine(config.phone)}</p>`,
    );
  });
}

document.querySelectorAll('form[data-form]').forEach(setupForm);
