/**
 * Tiny HTML templating helpers (no dependencies).
 * `html` auto-escapes interpolated strings; wrap trusted markup with `raw()`.
 */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escape = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

class Raw {
  constructor(v) {
    this.v = v;
  }
  toString() {
    return this.v;
  }
}
export const raw = (v) => new Raw(String(v ?? ''));

function render(v) {
  if (v == null || v === false) return '';
  if (v instanceof Raw) return v.v;
  if (Array.isArray(v)) return v.map(render).join('');
  return escape(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => {
    out += render(v) + strings[i + 1];
  });
  return raw(out);
}
