import { html, raw } from '../lib/html.js';
import { site } from '../config/site.js';
import { timeSlots, formatTime, OCCASIONS } from '../lib/validation.js';

/**
 * Labelled form field with hint and error slot wired up via aria-describedby.
 * The error <p> is filled in by /assets/forms.js.
 */
export function field({ id, label, type = 'text', required = false, hint = '', attrs = '', control = null, optional = false }) {
  const describedBy = [hint && `${id}-hint`, `${id}-error`].filter(Boolean).join(' ');
  const input =
    control ??
    html`<input class="input" id="${id}" name="${id}" type="${type}" ${required ? raw('required') : ''} aria-describedby="${describedBy}" ${raw(attrs)}>`;
  return html`<div class="field" data-field="${id}">
  <label class="field__label" for="${id}">${label}${optional ? html` <span class="field__optional">(optional)</span>` : ''}</label>
  ${hint ? html`<p class="field__hint" id="${id}-hint">${hint}</p>` : ''}
  ${input}
  <p class="field__error" id="${id}-error" data-error-for="${id}"></p>
</div>`;
}

const select = (id, options, { required = true, placeholderLabel = 'Select', describedBy = `${id}-error` } = {}) =>
  html`<select class="input select" id="${id}" name="${id}" ${required ? raw('required') : ''} aria-describedby="${describedBy}">
  <option value="">${placeholderLabel}</option>
  ${options.map((o) => html`<option value="${o.value}">${o.label}</option>`)}
</select>`;

/** Hidden field bots fill in and people don't. Checked server-side. */
const honeypot = () =>
  html`<div class="hp" aria-hidden="true"><label for="company">Company</label><input id="company" name="company" type="text" tabindex="-1" autocomplete="off"></div>`;

const statusRegion = () =>
  html`<div class="form-status" role="status" aria-live="polite" tabindex="-1" data-form-status></div>`;

export function reservationForm() {
  const b = site.booking;
  const slots = timeSlots(b).map((t) => ({ value: t, label: formatTime(t) }));
  const guests = Array.from({ length: b.maxGuests }, (_, i) => ({
    value: String(i + 1),
    label: i === 0 ? '1 guest' : `${i + 1} guests`,
  }));
  // Config the browser needs; everything else stays server-side.
  const clientConfig = JSON.stringify({ booking: b, phone: site.phone });

  return html`<form class="form" novalidate data-form="reservation" data-endpoint="/api/reservations" data-config="${clientConfig}">
  <fieldset class="form__group">
    <legend class="form__legend">Your table</legend>
    <div class="form__row form__row--3">
      ${field({ id: 'date', label: 'Date', type: 'date', required: true, attrs: 'autocomplete="off"' })}
      ${field({ id: 'time', label: 'Time', required: true, control: select('time', slots, { placeholderLabel: 'Select a time' }) })}
      ${field({
        id: 'guests',
        label: 'Guests',
        required: true,
        control: select('guests', guests, { placeholderLabel: 'How many?' }),
      })}
    </div>
    <p class="form__aside">Booking for more than ${b.maxGuests}? <a href="/functions">Send a group enquiry</a> and we’ll help plan it.</p>
    <div class="field" data-field="seating">
      <fieldset class="choice-group">
        <legend class="field__label">Seating preference <span class="field__optional">(optional)</span></legend>
        <div class="choice-group__options">
          <label class="choice"><input type="radio" name="seating" value="no-preference" checked><span>No preference</span></label>
          <label class="choice"><input type="radio" name="seating" value="inside"><span>Inside</span></label>
          <label class="choice"><input type="radio" name="seating" value="outside"><span>Outside</span></label>
        </div>
      </fieldset>
    </div>
  </fieldset>

  <fieldset class="form__group">
    <legend class="form__legend">Your details</legend>
    <div class="form__row form__row--2">
      ${field({ id: 'name', label: 'Name', required: true, attrs: 'autocomplete="name" maxlength="100"' })}
      ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, attrs: 'autocomplete="tel" inputmode="tel"' })}
    </div>
    ${field({ id: 'email', label: 'Email', type: 'email', required: true, attrs: 'autocomplete="email"' })}
    ${field({
      id: 'requests',
      label: 'Special requests',
      optional: true,
      hint: 'Highchair, pram space, dietary needs or a celebration we should know about.',
      control: html`<textarea class="input textarea" id="requests" name="requests" rows="4" maxlength="1000" aria-describedby="requests-hint requests-error"></textarea>`,
    })}
  </fieldset>
  ${honeypot()}
  <div class="form__submit">
    <button class="btn btn--solid btn--block" type="submit" data-submit>Request booking</button>
    <p class="form__fineprint">Sending this form requests a table. Your booking is confirmed once the café has confirmed it with you.</p>
  </div>
  ${statusRegion()}
</form>`;
}

export function enquiryForm() {
  const clientConfig = JSON.stringify({ phone: site.phone });
  return html`<form class="form" novalidate data-form="enquiry" data-endpoint="/api/enquiries" data-config="${clientConfig}">
  <fieldset class="form__group">
    <legend class="form__legend">About your event</legend>
    ${field({
      id: 'occasion',
      label: 'Type of event',
      required: true,
      control: select('occasion', OCCASIONS.map((o) => ({ value: o, label: o })), { placeholderLabel: 'Choose one' }),
    })}
    <div class="form__row form__row--2">
      ${field({ id: 'date', label: 'Preferred date', type: 'date', optional: true, attrs: 'autocomplete="off"' })}
      ${field({ id: 'guests', label: 'Approximate number of guests', type: 'number', optional: true, attrs: 'min="1" max="500" inputmode="numeric"' })}
    </div>
    ${field({
      id: 'message',
      label: 'Tell us about it',
      required: true,
      hint: 'Time of day, food or drinks you have in mind, anything else that helps.',
      control: html`<textarea class="input textarea" id="message" name="message" rows="5" required maxlength="2000" aria-describedby="message-hint message-error"></textarea>`,
    })}
  </fieldset>
  <fieldset class="form__group">
    <legend class="form__legend">Your details</legend>
    <div class="form__row form__row--2">
      ${field({ id: 'name', label: 'Name', required: true, attrs: 'autocomplete="name" maxlength="100"' })}
      ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, attrs: 'autocomplete="tel" inputmode="tel"' })}
    </div>
    ${field({ id: 'email', label: 'Email', type: 'email', required: true, attrs: 'autocomplete="email"' })}
  </fieldset>
  ${honeypot()}
  <div class="form__submit">
    <button class="btn btn--solid btn--block" type="submit" data-submit>Send enquiry</button>
  </div>
  ${statusRegion()}
</form>`;
}
