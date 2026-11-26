// DataNusa page renderers — one function per route. Each returns the HTML
// for that section, built from data.js and charts.js. Values are escaped
// before they reach the page.

import { AGE_BANDS, GDP, GDP_PER_CAPITA, HEALTH_EDU, INDICATORS, JOBS_BY_SECTOR, META, POP_TREND, PROVINCES, SECTORS, STUNTING, UNEMPLOYMENT } from './data.js';
import { columnChart, hbarChart, lineChart } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const idr = (n) => Number(n).toLocaleString('id-ID');
const oneDecimal = (n) => Number(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const density = (p) => (p.pop * 1000000) / p.area;

export function overview(state) {
  const cards = INDICATORS.map((k) => `<article class="kpi"><p class="kpi-label">${esc(k.label)}</p><p class="kpi-value">${esc(k.value)}</p><p class="kpi-sub">${esc(k.sub)}</p><p class="kpi-detail">${esc(k.detail)}</p></article>`).join('');
  const gdpMode = state.gdpMode || 'growth';
  const gdpPoints = GDP.map((g) => ({ year: g.year, value: gdpMode === 'growth' ? g.growth : g.nominal }));
  const gdpChart = gdpMode === 'growth'
    ? lineChart({ points: gdpPoints, label: 'Pertumbuhan ekonomi Indonesia 2015–2024, persen per tahun', unit: '%', highlight: state.year })
    : lineChart({ points: gdpPoints, label: 'PDB nominal Indonesia 2015–2024, Rp triliun', unit: '', highlight: state.year });
  const ageRows = AGE_BANDS.map((a) => ({ name: `${a.band} th`, value: state.ageMode === 'pct' ? +(a.pop / 283.4 * 100).toFixed(1) : a.pop }));
  const ageChart = hbarChart({ rows: ageRows, label: 'Penduduk menurut kelompok umur 2024', unit: state.ageMode === 'pct' ? '%' : ' jt', color: '#1d6fb8' });
  return `<section class="hero"><p class="eyebrow">Portal statistik · ${esc(META.country)}</p>
<h1>Indonesia dalam angka</h1>
<p class="lede">Delapan indikator utama, tren sepuluh tahun, dan data 38 provinsi — dari publikasi resmi, diperbarui ${esc(META.updated)}.</p>
<p class="source-note">${esc(META.note)}</p></section>
<section><h2>Indikator utama</h2><div class="kpi-grid">${cards}</div></section>
<section><div class="section-head"><h2>Pertumbuhan ekonomi, 2015–2024</h2>
<div class="toggle" role="group" aria-label="Tampilan grafik PDB"><button data-gdp="growth" class="${gdpMode === 'growth' ? 'on' : ''}">Pertumbuhan %</button><button data-gdp="nominal" class="${gdpMode === 'nominal' ? 'on' : ''}">PDB nominal</button></div></div>
${gdpChart}<p class="fig-note">Pertumbuhan PDB riil (harga konstan 2010) dan PDB nominal (harga berlaku), %. Kontraksi 2020 adalah dampak pandemi COVID-19. Sumber: BPS.</p></section>
<section><div class="section-head"><h2>Penduduk menurut kelompok umur, 2024</h2>
<div class="toggle" role="group" aria-label="Satuan grafik umur"><button data-age="abs" class="${state.ageMode !== 'pct' ? 'on' : ''}">Juta jiwa</button><button data-age="pct" class="${state.ageMode === 'pct' ? 'on' : ''}">Persen</button></div></div>
${ageChart}<p class="fig-note">Proyeksi penduduk 2024, BPS. Kelompok usia produktif (15–64 tahun) sekitar 69% dari total penduduk. Jumlah kelompok umur dibulatkan, total 283,4 juta.</p></section>
<section><h2>Jelajahi datanya</h2><ul class="explore">
<li><a href="#/penduduk">Penduduk →</a><span>Struktur umur dan penduduk tiap provinsi.</span></li>
<li><a href="#/ekonomi">Ekonomi →</a><span>PDB sepuluh tahun, sektor, dan PDB per kapita.</span></li>
<li><a href="#/ketenagakerjaan">Ketenagakerjaan →</a><span>Pengangguran dan lapangan kerja menurut sektor.</span></li>
<li><a href="#/kesehatan-pendidikan">Kesehatan &amp; pendidikan →</a><span>Harapan hidup, stunting, dan sekolah.</span></li>
<li><a href="#/provinsi">Provinsi →</a><span>Tabel 38 provinsi: cari, urutkan, bandingkan.</span></li>
</ul></section>`;
}

export function population() {
  const popPoints = POP_TREND.map((p) => ({ year: p.year, value: p.pop }));
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const rows = top.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td class="num">${oneDecimal(p.pop)}</td><td class="num">${idr(density(p))}</td></tr>`).join('');
  const ageRows = AGE_BANDS.map((a) => ({ name: `${a.band} th`, value: a.pop }));
  return `<h1>Penduduk</h1><p class="lede">283,5 juta jiwa pada 2024 — negara berpenduduk terbesar keempat di dunia.</p>
<section><h2>Jumlah penduduk, 2010–2024</h2>
${columnChart({ points: popPoints, label: 'Jumlah penduduk Indonesia 2010–2024, juta jiwa', unit: ' jt', color: '#1d6fb8' })}
<p class="fig-note">Sensus Penduduk 2010 dan 2020, SUPAS 2015, proyeksi 2024. Sumber: BPS.</p></section>
<section><h2>Struktur umur, 2024</h2>
${hbarChart({ rows: ageRows, label: 'Penduduk menurut kelompok umur 2024, juta jiwa', unit: ' jt', color: '#1d6fb8' })}
<p class="fig-note">Kelompok 20–24 tahun adalah yang terbesar. Sumber: proyeksi penduduk BPS 2024.</p></section>
<section><h2>Provinsi terpadat penduduknya</h2>
<table class="data"><thead><tr><th>#</th><th>Provinsi</th><th class="num">Penduduk (jt)</th><th class="num">Kepadatan (jiwa/km²)</th></tr></thead><tbody>${rows}</tbody></table>
<p class="fig-note">Sepuluh provinsi terbesar. <a href="#/provinsi">Lihat tabel lengkap 38 provinsi →</a></p></section>`;
}

export function economy(state) {
  const year = state.year || 2024;
  const g = GDP.find((x) => x.year === year) || GDP[GDP.length - 1];
  const pc = GDP_PER_CAPITA.find((x) => x.year === year);
  const options = GDP.map((x) => `<option value="${x.year}" ${x.year === year ? 'selected' : ''}>${x.year}</option>`).join('');
  const points = GDP.map((x) => ({ year: x.year, value: x.growth }));
  const sectorRows = SECTORS.map((s) => ({ name: s.name, value: s.share }));
  return `<h1>Ekonomi</h1><p class="lede">PDB Rp22.139 triliun pada 2024, tumbuh 5,03% — ekonomi terbesar di Asia Tenggara.</p>
<section><div class="section-head"><h2>Tahun yang ditampilkan</h2>
<label class="year-pick">Tahun <select id="yearSelect" aria-label="Pilih tahun">${options}</select></label></div>
<div class="kpi-grid three">
<article class="kpi"><p class="kpi-label">PDB nominal ${year}</p><p class="kpi-value">Rp${idr(g.nominal)} T</p><p class="kpi-sub">Harga berlaku · BPS</p></article>
<article class="kpi"><p class="kpi-label">Pertumbuhan ${year}</p><p class="kpi-value">${g.growth.toLocaleString('id-ID')}%</p><p class="kpi-sub">Harga konstan 2010 · BPS</p></article>
<article class="kpi"><p class="kpi-label">PDB per kapita ${year}</p><p class="kpi-value">${pc ? `Rp${pc.value.toLocaleString('id-ID')} jt` : '—'}</p><p class="kpi-sub">Tahun terpilih · BPS</p></article>
</div></section>
<section><h2>Pertumbuhan ekonomi, 2015–2024</h2>
${lineChart({ points, label: 'Pertumbuhan ekonomi Indonesia 2015–2024, persen', unit: '%', highlight: year })}
<p class="fig-note">Titik oranye menandai tahun yang dipilih di atas. Kontraksi −2,07% pada 2020 adalah dampak pandemi. Sumber: BPS.</p></section>
<section><h2>Pangsa PDB menurut sektor, 2024</h2>
${hbarChart({ rows: sectorRows, label: 'Pangsa PDB menurut lapangan usaha 2024, persen', unit: '%' })}
<p class="fig-note">Industri pengolahan tetap penyumbang terbesar. "Lainnya" mencakup seluruh sektor di luar tujuh yang dirinci. Sumber: BPS.</p></section>`;
}

export function employment() {
  const points = UNEMPLOYMENT.map((u) => ({ year: u.year, value: u.rate }));
  const jobRows = JOBS_BY_SECTOR.map((j) => ({ name: j.name, value: j.share }));
  return `<h1>Ketenagakerjaan</h1><p class="lede">Tingkat pengangguran terbuka 4,76% pada Februari 2025 — terendah dalam satu dekade.</p>
<section><h2>Pengangguran terbuka, Februari 2015–2025</h2>
${lineChart({ points, label: 'Tingkat pengangguran terbuka Februari 2015–2025, persen', unit: '%', color: '#b3541e' })}
<p class="fig-note">TPT, Sakernas Februari setiap tahun. Lonjakan 2020 adalah dampak pandemi. Sumber: BPS.</p></section>
<section><h2>Di mana orang bekerja, Februari 2025</h2>
${hbarChart({ rows: jobRows, label: 'Pekerja menurut lapangan usaha Februari 2025, persen', unit: '%', color: '#b3541e' })}
<p class="fig-note">Pertanian masih menyerap pekerja terbanyak, diikuti perdagangan. Sumber: BPS, Sakernas.</p></section>
<section><h2>Angka kunci</h2><div class="kpi-grid three">
<article class="kpi"><p class="kpi-label">Angkatan kerja</p><p class="kpi-value">149,8 jt</p><p class="kpi-sub">Feb 2025 · BPS</p></article>
<article class="kpi"><p class="kpi-label">Bekerja</p><p class="kpi-value">142,6 jt</p><p class="kpi-sub">Feb 2025 · BPS</p></article>
<article class="kpi"><p class="kpi-label">Pekerja informal</p><p class="kpi-value">58,2%</p><p class="kpi-sub">Feb 2025 · BPS</p></article>
</div></section>`;
}

export function healthEdu() {
  const cards = HEALTH_EDU.map((h) => `<article class="kpi"><p class="kpi-label">${esc(h.label)}</p><p class="kpi-value">${esc(h.value)}</p><p class="kpi-sub">${esc(h.year)} · ${esc(h.source)}</p></article>`).join('');
  const points = STUNTING.map((s) => ({ year: s.year, value: s.value }));
  return `<h1>Kesehatan &amp; pendidikan</h1><p class="lede">Harapan hidup 74,1 tahun dan stunting balita turun ke 19,8% pada 2024.</p>
<section><h2>Indikator utama</h2><div class="kpi-grid three">${cards}</div></section>
<section><h2>Stunting balita, 2019–2024</h2>
${lineChart({ points, label: 'Prevalensi stunting balita 2019–2024, persen', unit: '%', color: '#0b6e5d' })}
<p class="fig-note">Prevalensi stunting pada balita turun 7,9 poin dalam lima tahun. Target pemerintah: di bawah 14% pada 2029. Sumber: SSGI, Kementerian Kesehatan.</p></section>
<section><h2>Yang perlu dibaca</h2><ul class="notes">
<li><strong>Pendidikan:</strong> rata-rata lama sekolah 9,0 tahun (2024) — setara tamat SMP — dengan harapan lama sekolah 13,2 tahun.</li>
<li><strong>Kesehatan:</strong> umur harapan hidup naik dari 70,7 tahun (2015) menjadi 74,1 tahun (2024).</li>
<li><strong>Kemiskinan:</strong> 8,47% penduduk hidup di bawah garis kemiskinan pada Maret 2025 (BPS).</li>
</ul></section>`;
}

export function regions(state) {
  const q = (state.q || '').toLowerCase();
  const sortKey = state.sort || 'pop';
  const sortDir = state.dir || 'desc';
  let list = PROVINCES.map((p) => ({ ...p, density: density(p) }));
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
  const keys = { name: (a, b) => a.name.localeCompare(b.name, 'id'), pop: (a, b) => a.pop - b.pop, area: (a, b) => a.area - b.area, density: (a, b) => a.density - b.density };
  list.sort((a, b) => (sortDir === 'asc' ? 1 : -1) * keys[sortKey](a, b));
  const arrow = (k) => (sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '');
  const th = (k, label, cls = '') => `<th class="${cls}"><button data-sort="${k}" class="th-btn">${label}${arrow(k)}</button></th>`;
  const rows = list.map((p) => `<tr><td>${esc(p.name)}</td><td class="num">${oneDecimal(p.pop)}</td><td class="num">${idr(p.area)}</td><td class="num">${idr(Math.round(p.density))}</td></tr>`).join('');
  const sel = state.selected ? PROVINCES.find((p) => p.name === state.selected) : null;
  const detail = sel ? `<aside class="province-detail"><h3>${esc(sel.name)}</h3><p>Penduduk <strong>${oneDecimal(sel.pop)} juta jiwa</strong> · luas <strong>${idr(sel.area)} km²</strong> · kepadatan <strong>${idr(Math.round(density(sel)))} jiwa/km²</strong>.</p><p class="fig-note">Perkiraan BPS pertengahan 2024, dibulatkan.</p></aside>` : '';
  return `<h1>Provinsi</h1><p class="lede">38 provinsi, dari Jawa Barat (50,3 juta jiwa) sampai Papua Barat Daya (0,6 juta jiwa).</p>
<section><div class="controls"><label>Cari provinsi <input id="regionSearch" type="search" placeholder="mis. Jawa, Papua…" value="${esc(state.q || '')}"></label>
<span class="count" id="regionCount">${list.length} dari 38 provinsi</span></div>
<div class="table-wrap"><table class="data"><thead><tr>${th('name', 'Provinsi')}${th('pop', 'Penduduk (jt)', 'num')}${th('area', 'Luas (km²)', 'num')}${th('density', 'Kepadatan (jiwa/km²)', 'num')}</tr></thead><tbody>${rows || '<tr><td colspan="4">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>'}</tbody></table></div>
<p class="fig-note">Klik judul kolom untuk mengurutkan; klik lagi untuk membalik urutan. Kepadatan dihitung dari penduduk dan luas di tabel ini. Sumber: BPS, Kemendagri (dibulatkan).</p>
${detail}</section>`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1><p>Bagian itu tidak ada. <a href="#/">Kembali ke beranda</a>.</p>`;
}
