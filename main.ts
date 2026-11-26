// DataNusa — the program that hands the statistics site in (Node 22,
// standard library only). It assembles /output from this repository:
//   - app/         the site itself, plain static files
//   - screenshots/ four renders of the site running in a browser
//   - dossier.json the judge's summary, written by the vendored make.fun
//                  library exactly as the scorer re-writes it
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The run is deterministic: the same repository always produces the same
// /output bytes, so the grader's two runs agree.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The caps the scorer refuses beyond (from the kit's gate): at most four
// screenshots, each at most 256 KiB; app/ at most 993 entries and 16 MiB;
// the dossier text at most 160 KiB. Passing them here makes this program
// fail exactly where the scorer would.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  throw new Error(`datanusa: ${message}`);
}

function totalBytes(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const info = statSync(path);
    total += info.isDirectory() ? totalBytes(path) : info.size;
  }
  return total;
}

function countEntries(dir: string): number {
  let total = 0;
  for (const name of readdirSync(dir)) {
    total += 1;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) total += countEntries(path);
  }
  return total;
}

function checkScreenshots(dir: string): string[] {
  if (!existsSync(dir)) fail('screenshots/ is missing — take the four renders first');
  const shots = readdirSync(dir)
    .filter((name) => !name.startsWith('.'))
    .sort();
  if (shots.length < 3 || shots.length > CAPS.screenshots.max) {
    fail(`screenshots/ holds ${shots.length} images, the scorer wants 3 or 4`);
  }
  for (const name of shots) {
    const size = statSync(join(dir, name)).size;
    if (size > CAPS.screenshots.max_bytes) {
      fail(`screenshots/${name} is ${size} bytes, over the 256 KiB cap`);
    }
  }
  return shots;
}

function checkApp(dir: string): void {
  if (!existsSync(join(dir, 'index.html'))) fail('app/index.html is missing');
  const entries = countEntries(dir);
  if (entries > CAPS.app_max_files) fail(`app/ holds ${entries} entries, over the 993 cap`);
  const bytes = totalBytes(dir);
  if (bytes > CAPS.app_max_bytes) fail(`app/ is ${bytes} bytes, over the 16 MiB cap`);
}

function handIn(): void {
  const appDir = join(repoRoot, 'app');
  const shotsDir = join(repoRoot, 'screenshots');
  checkApp(appDir);
  const shots = checkScreenshots(shotsDir);

  mkdirSync(outDir, { recursive: true });
  cpSync(appDir, join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

  const dossier = buildDossier(outDir, CAPS);
  writeFileSync(join(outDir, 'dossier.json'), dossier);

  // The scorer rebuilds the dossier from the same files and compares it
  // byte for byte, so rebuild it here and refuse to hand in a mismatch.
  // buildDossier returns a Uint8Array, so the comparison is on bytes.
  const rebuilt = buildDossier(outDir, CAPS);
  const written = readFileSync(join(outDir, 'dossier.json'));
  if (!written.equals(Buffer.from(rebuilt))) fail('dossier.json does not match a fresh buildDossier run');

  const appBytes = totalBytes(join(outDir, 'app'));
  console.log(`datanusa: handed in ${shots.length} screenshots, app/ ${appBytes} bytes`);
  console.log(`datanusa: cover is ${shots[0]}`);
  console.log(`datanusa: dossier.json ${dossier.length} bytes`);
}

handIn();
