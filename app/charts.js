// DataNusa chart builders — hand-rolled SVG, no libraries, no network.
// Each function takes plain data and returns an SVG string with a title,
// labelled axes and values, so a chart is readable on its own in a screenshot.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n, d = 1) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

function axisLabels(points, w, h, pad, ymin, ymax, valueOf) {
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const xs = points.map((p, i) => x0 + (i * (x1 - x0)) / Math.max(1, points.length - 1));
  const ys = points.map((p) => y1 - ((valueOf(p) - ymin) / (ymax - ymin || 1)) * (y1 - y0));
  return { xs, ys, x0, x1, y0, y1 };
}

// Line chart with dots and value labels, for a series over years. The
// lowest point's label sits below its dot, so the falling line never
// strikes through the number — the 2020 contraction is the one to read.
export function lineChart({ points, label, unit = '', color = '#0b6e5d', height = 260, highlight = null }) {
  const w = 720, h = height, pad = { l: 56, r: 16, t: 18, b: 34 };
  const values = points.map((p) => p.value);
  const lowest = Math.min(...values);
  let ymin = Math.min(...values), ymax = Math.max(...values);
  const span = ymax - ymin || 1;
  ymin -= span * 0.15; ymax += span * 0.15;
  const { xs, ys, x0, x1, y0, y1 } = axisLabels(points, w, h, pad, ymin, ymax, (p) => p.value);
  const grid = [0.25, 0.5, 0.75].map((f) => {
    const y = y1 - f * (y1 - y0);
    const v = ymin + f * (ymax - ymin);
    return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#e3e8ea" stroke-width="1"/><text x="${x0 - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5b6b70">${fmt(v, Math.abs(v) < 10 ? 1 : 0)}${unit}</text>`;
  }).join('');
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const dots = points.map((p, i) => {
    const hot = highlight !== null && p.year === highlight;
    return `<circle cx="${xs[i].toFixed(1)}" cy="${ys[i].toFixed(1)}" r="${hot ? 6 : 4}" fill="${hot ? '#c2410c' : color}" stroke="#fff" stroke-width="1.5"><title>${p.year}: ${fmt(p.value)}${unit}</title></circle>`;
  }).join('');
  const xlabels = points.map((p, i) => `<text x="${xs[i]}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#5b6b70">${p.year}</text>`).join('');
  const vlabels = points.map((p, i) => {
    const below = p.value === lowest;
    const y = below ? ys[i] + 20 : ys[i] - 10;
    return `<text x="${xs[i]}" y="${y.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#16323a">${fmt(p.value)}${unit}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" class="chart"><title>${esc(label)}</title>${grid}<path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${vlabels}${xlabels}</svg>`;
}

// Vertical columns, for a short series such as population by census year.
export function columnChart({ points, label, unit = '', color = '#0b6e5d', height = 240 }) {
  const w = 720, h = height, pad = { l: 56, r: 16, t: 26, b: 34 };
  const values = points.map((p) => p.value);
  const ymax = Math.max(...values) * 1.15;
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const bw = (x1 - x0) / points.length;
  const bars = points.map((p, i) => {
    const bh = (p.value / ymax) * (y1 - y0);
    const x = x0 + i * bw + bw * 0.18, y = y1 - bh;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${color}"><title>${p.year}: ${fmt(p.value)}${unit}</title></rect><text x="${(x + bw * 0.32).toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#16323a">${fmt(p.value)}${unit}</text><text x="${(x + bw * 0.32).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#5b6b70">${p.year}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" class="chart"><title>${esc(label)}</title><line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="#cbd5d8" stroke-width="1"/>${bars}</svg>`;
}

// Horizontal bars with a label, a track and a value, for shares and rankings.
export function hbarChart({ rows, label, unit = '%', color = '#0b6e5d', max = null, heightPer = 34 }) {
  const w = 720, h = rows.length * heightPer + 14;
  const top = max === null ? Math.max(...rows.map((r) => r.value)) : max;
  const bars = rows.map((r, i) => {
    const y = 8 + i * heightPer;
    const bw = Math.max(2, (r.value / top) * 430);
    return `<text x="0" y="${y + 15}" font-size="12.5" fill="#16323a">${esc(r.name)}</text><rect x="230" y="${y + 4}" width="${bw.toFixed(1)}" height="16" rx="3" fill="${color}"><title>${esc(r.name)}: ${fmt(r.value)}${unit}</title></rect><text x="${(238 + bw).toFixed(1)}" y="${y + 17}" font-size="12.5" font-weight="600" fill="#16323a">${fmt(r.value)}${unit}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" class="chart"><title>${esc(label)}</title>${bars}</svg>`;
}
