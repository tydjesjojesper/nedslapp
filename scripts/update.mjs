// Hämtar SHL:s kalender och sparar den som data/schedule.json.
// Körs automatiskt varje natt av GitHub Actions. Lokalt: node scripts/update.mjs [sökväg-till-.ics-fil]
import fs from 'node:fs';

const ICS_URL = 'https://ics.ecal.com/ecal-sub/6acfe45ed448ec0002b33b57/Swedish%20Hockey%20League.ics';
const OUT = new URL('../data/schedule.json', import.meta.url);

const text = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : await (async () => {
  const res = await fetch(ICS_URL);
  if (!res.ok) throw new Error('Kunde inte hämta kalendern: HTTP ' + res.status);
  return res.text();
})();

function parseDate(v) {
  const m = v.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])) : null;
}

const seen = new Set(), matches = [];
for (const block of text.replace(/\r/g, '').replace(/\n[ \t]/g, '').split('BEGIN:VEVENT').slice(1)) {
  const get = k => (block.match(new RegExp('^' + k + '[^:\\n]*:(.*)$', 'm')) || [])[1]?.trim() || '';
  const m = get('SUMMARY').match(/SHL\s*\|\s*(.+?)\s+-\s+(.+)$/); // "🏒 SHL | Hemmalag - Bortalag"
  const t = parseDate(get('DTSTART'));
  if (!m || !t) continue;
  const key = `${m[1]}|${m[2]}|${t.toISOString()}`;
  if (seen.has(key)) continue;
  seen.add(key);
  matches.push({ h: m[1], a: m[2], t: t.toISOString(), arena: get('LOCATION').replace(/\\,/g, ',') });
}
matches.sort((x, y) => x.t.localeCompare(y.t) || x.h.localeCompare(y.h));

// Skydd: skriv inte över bra data om något gått snett med hämtningen.
if (matches.length < 50) throw new Error(`Bara ${matches.length} matcher hittades, avbryter.`);

let old = {};
try { old = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch {}
if (JSON.stringify(old.matches) === JSON.stringify(matches)) { console.log('Inga ändringar.'); process.exit(0); }
fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), matches }) + '\n');
console.log(`Sparade ${matches.length} matcher.`);
