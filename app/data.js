// DataNusa — figures for Indonesia, taken from published official statistics.
// Every figure is labelled with its year and source where it is shown, so a
// visitor can tell what it is. Values are rounded as published; nothing here
// is invented to look exact.

export const META = {
  country: 'Indonesia',
  updated: 'November 2026',
  note: 'Angka-angka dari publikasi Badan Pusat Statistik (BPS) dan Kementerian Kesehatan (SSGI), dibulatkan.',
};

// Headline indicators shown on the overview page.
export const INDICATORS = [
  { key: 'pop', label: 'Jumlah penduduk', value: '283,5 jt', sub: '2024 · BPS', detail: 'Hasil proyeksi penduduk pertengahan 2024.' },
  { key: 'gdp', label: 'PDB nominal', value: 'Rp22.139 T', sub: '2024 · BPS', detail: 'Produk domestik bruto atas dasar harga berlaku.' },
  { key: 'growth', label: 'Pertumbuhan ekonomi', value: '5,03%', sub: '2024 · BPS', detail: 'Pertumbuhan PDB atas dasar harga konstan 2010.' },
  { key: 'inflation', label: 'Inflasi (y-on-y)', value: '1,57%', sub: 'Des 2024 · BPS', detail: 'Inflasi tahunan Desember 2024 terhadap Desember 2023.' },
  { key: 'unemp', label: 'Tingkat pengangguran', value: '4,76%', sub: 'Feb 2025 · BPS', detail: 'Tingkat Pengangguran Terbuka (TPT), Sakernas Februari 2025.' },
  { key: 'poverty', label: 'Penduduk miskin', value: '8,47%', sub: 'Mar 2025 · BPS', detail: 'Persentase penduduk miskin, Maret 2025.' },
  { key: 'life', label: 'Umur harapan hidup', value: '74,1 th', sub: '2024 · BPS', detail: 'Umur harapan hidup saat lahir.' },
  { key: 'literacy', label: 'Melek huruf (15+)', value: '96,9%', sub: '2024 · BPS', detail: 'Angka melek huruf penduduk usia 15 tahun ke atas.' },
];

// Nominal GDP (Rp trillion, current prices) and real growth (%), 2015–2024, BPS.
export const GDP = [
  { year: 2015, nominal: 11526, growth: 4.88 },
  { year: 2016, nominal: 12401, growth: 5.03 },
  { year: 2017, nominal: 13588, growth: 5.07 },
  { year: 2018, nominal: 14838, growth: 5.17 },
  { year: 2019, nominal: 15833, growth: 5.02 },
  { year: 2020, nominal: 15443, growth: -2.07 },
  { year: 2021, nominal: 16970, growth: 3.70 },
  { year: 2022, nominal: 19588, growth: 5.31 },
  { year: 2023, nominal: 20892, growth: 5.05 },
  { year: 2024, nominal: 22139, growth: 5.03 },
];

// GDP per capita, Rp million, BPS.
export const GDP_PER_CAPITA = [
  { year: 2015, value: 45.2 },
  { year: 2018, value: 56.0 },
  { year: 2020, value: 57.3 },
  { year: 2022, value: 71.0 },
  { year: 2024, value: 78.6 },
];

// Share of GDP by sector, 2024, BPS (rounded; "Lainnya" is the remainder).
export const SECTORS = [
  { name: 'Industri pengolahan', share: 18.98 },
  { name: 'Perdagangan besar & eceran', share: 12.94 },
  { name: 'Pertanian, kehutanan & perikanan', share: 12.53 },
  { name: 'Konstruksi', share: 9.92 },
  { name: 'Pertambangan & penggalian', share: 8.36 },
  { name: 'Informasi & komunikasi', share: 4.41 },
  { name: 'Jasa keuangan & asuransi', share: 4.24 },
  { name: 'Lainnya', share: 28.62 },
];

// Population by 5-year age band, millions, BPS 2024 projection (rounded).
export const AGE_BANDS = [
  { band: '0–4', pop: 22.4 },
  { band: '5–9', pop: 23.2 },
  { band: '10–14', pop: 23.9 },
  { band: '15–19', pop: 23.6 },
  { band: '20–24', pop: 23.8 },
  { band: '25–29', pop: 23.3 },
  { band: '30–34', pop: 22.7 },
  { band: '35–39', pop: 21.5 },
  { band: '40–44', pop: 20.4 },
  { band: '45–49', pop: 18.6 },
  { band: '50–54', pop: 16.3 },
  { band: '55–59', pop: 13.5 },
  { band: '60–64', pop: 10.6 },
  { band: '65+', pop: 19.6 },
];

// Total population, millions: census and intercensal counts, BPS.
export const POP_TREND = [
  { year: 2010, pop: 237.6, note: 'Sensus Penduduk' },
  { year: 2015, pop: 255.5, note: 'SUPAS' },
  { year: 2020, pop: 270.2, note: 'Sensus Penduduk' },
  { year: 2024, pop: 283.5, note: 'Proyeksi' },
];

// Open unemployment rate (TPT), February each year, %, BPS Sakernas.
export const UNEMPLOYMENT = [
  { year: 2015, rate: 6.18 },
  { year: 2016, rate: 5.61 },
  { year: 2017, rate: 5.5 },
  { year: 2018, rate: 5.34 },
  { year: 2019, rate: 5.28 },
  { year: 2020, rate: 7.07 },
  { year: 2021, rate: 6.49 },
  { year: 2022, rate: 5.86 },
  { year: 2023, rate: 5.32 },
  { year: 2024, rate: 4.91 },
  { year: 2025, rate: 4.76 },
];

// Share of employed workers by sector, %, Feb 2025, BPS (rounded).
export const JOBS_BY_SECTOR = [
  { name: 'Pertanian', share: 28.2 },
  { name: 'Perdagangan', share: 19.4 },
  { name: 'Industri pengolahan', share: 13.5 },
  { name: 'Konstruksi', share: 8.4 },
  { name: 'Transportasi & pergudangan', share: 5.7 },
  { name: 'Akomodasi & makan minum', share: 5.5 },
  { name: 'Jasa lainnya', share: 19.3 },
];

// Health and education indicators, BPS unless noted.
export const HEALTH_EDU = [
  { label: 'Umur harapan hidup', value: '74,1 tahun', year: '2024', source: 'BPS' },
  { label: 'Prevalensi stunting balita', value: '19,8%', year: '2024', source: 'SSGI, Kemenkes' },
  { label: 'Melek huruf usia 15+', value: '96,9%', year: '2024', source: 'BPS' },
  { label: 'Rata-rata lama sekolah', value: '9,0 tahun', year: '2024', source: 'BPS' },
  { label: 'Harapan lama sekolah', value: '13,2 tahun', year: '2024', source: 'BPS' },
  { label: 'Partisipasi sekolah 7–12 th', value: '99,5%', year: '2024', source: 'BPS' },
];

// Stunting prevalence among children under five, %, SSGI.
export const STUNTING = [
  { year: 2019, value: 27.7 },
  { year: 2021, value: 24.4 },
  { year: 2022, value: 21.6 },
  { year: 2023, value: 21.5 },
  { year: 2024, value: 19.8 },
];

// The 38 provinces: population in millions (BPS mid-2024 estimate, rounded)
// and land area in km² (rounded). Density is computed from these two.
export const PROVINCES = [
  { name: 'Jawa Barat', pop: 50.3, area: 35378 },
  { name: 'Jawa Timur', pop: 41.8, area: 47800 },
  { name: 'Jawa Tengah', pop: 37.9, area: 32801 },
  { name: 'Sumatera Utara', pop: 16.0, area: 72981 },
  { name: 'Sulawesi Selatan', pop: 9.5, area: 46717 },
  { name: 'Lampung', pop: 9.3, area: 34624 },
  { name: 'Sumatera Selatan', pop: 9.0, area: 91592 },
  { name: 'DKI Jakarta', pop: 10.6, area: 664 },
  { name: 'Banten', pop: 12.4, area: 9663 },
  { name: 'Riau', pop: 6.6, area: 87024 },
  { name: 'Sumatera Barat', pop: 6.0, area: 42013 },
  { name: 'Kalimantan Barat', pop: 5.8, area: 147307 },
  { name: 'Nusa Tenggara Timur', pop: 5.7, area: 47238 },
  { name: 'Aceh', pop: 5.6, area: 57956 },
  { name: 'Nusa Tenggara Barat', pop: 5.6, area: 18572 },
  { name: 'Bali', pop: 4.4, area: 5780 },
  { name: 'Kalimantan Selatan', pop: 4.3, area: 38744 },
  { name: 'Kalimantan Timur', pop: 4.0, area: 129067 },
  { name: 'DI Yogyakarta', pop: 3.8, area: 3133 },
  { name: 'Jambi', pop: 3.7, area: 50058 },
  { name: 'Sulawesi Tengah', pop: 3.1, area: 61841 },
  { name: 'Kalimantan Tengah', pop: 2.8, area: 153564 },
  { name: 'Sulawesi Tenggara', pop: 2.8, area: 38068 },
  { name: 'Sulawesi Utara', pop: 2.7, area: 13892 },
  { name: 'Kepulauan Riau', pop: 2.2, area: 8202 },
  { name: 'Bengkulu', pop: 2.1, area: 19919 },
  { name: 'Maluku', pop: 2.0, area: 46914 },
  { name: 'Sulawesi Barat', pop: 1.6, area: 16787 },
  { name: 'Bangka Belitung', pop: 1.5, area: 16424 },
  { name: 'Papua Pegunungan', pop: 1.5, area: 51213 },
  { name: 'Papua Tengah', pop: 1.4, area: 61073 },
  { name: 'Maluku Utara', pop: 1.4, area: 31983 },
  { name: 'Gorontalo', pop: 1.3, area: 11257 },
  { name: 'Papua Barat', pop: 1.2, area: 60275 },
  { name: 'Papua', pop: 1.1, area: 82680 },
  { name: 'Kalimantan Utara', pop: 0.7, area: 72567 },
  { name: 'Papua Selatan', pop: 0.6, area: 117849 },
  { name: 'Papua Barat Daya', pop: 0.6, area: 38295 },
];
