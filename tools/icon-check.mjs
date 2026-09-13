/**
 * **Ce que la page déclare comme icône existe-t-il vraiment ?**
 *
 * Raison d'être : un `apple-touch-icon` en 404 **ne crie nulle part**. iOS ne
 * signale rien, ne journalise rien — il pose une capture de la page à la place
 * de l'icône, et l'utilisateur ne l'apprend qu'en ajoutant le site à son écran
 * d'accueil. Même silence pour une icône du manifeste : Chrome se rabat sans
 * bruit. C'est exactement la forme des régressions que le dépôt attrape par
 * outil plutôt que par relecture.
 *
 * L'outil charge la page dans un iPhone simulé, relit ses `<link>` et ses
 * `<meta>`, récupère **chaque URL déclarée**, lit les dimensions réelles dans
 * l'en-tête IHDR des PNG (et non l'attribut `sizes`, qui est une promesse),
 * et valide le manifeste comme JSON en suivant les icônes qu'il nomme.
 *
 * Sortie non nulle si quoi que ce soit manque. Demande le serveur local, comme
 * les autres outils Playwright.
 *
 * @module tools/icon-check
 */
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const URL_BASE = process.env.URL ?? 'http://127.0.0.1:8085';
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const ctx = await browser.newContext(devices['iPhone 13 Pro']);
const page = await ctx.newPage();
const erreurs = [];
page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
await page.goto(`${URL_BASE}/index.html`, { waitUntil: 'networkidle' });

const decl = await page.evaluate(() => ({
  titre: document.title,
  liens: [...document.querySelectorAll('link[rel*="icon"],link[rel="manifest"]')].map((l) => ({
    rel: l.rel, href: l.href, sizes: l.getAttribute('sizes'),
  })),
  metas: Object.fromEntries(
    [...document.querySelectorAll('meta[name]')]
      .filter((m) => /apple|mobile|theme|application-name|description/.test(m.name))
      .map((m) => [m.name, m.content]),
  ),
}));

console.log(`titre : ${decl.titre}\n`);
let ko = 0;
for (const l of decl.liens) {
  const r = await page.request.get(l.href);
  const buf = await r.body();
  let detail = `${buf.length} o`;
  if (l.rel === 'manifest') {
    try {
      const m = JSON.parse(buf.toString());
      detail += ` · JSON ok · ${m.icons.length} icônes · display=${m.display}`;
      for (const ic of m.icons) {
        const u = new URL(ic.src, l.href).href;
        const ri = await page.request.get(u);
        if (!ri.ok()) { ko++; console.log(`   ✗ icône du manifeste ${ic.src} → ${ri.status()}`); }
        else detail += `\n     ✓ ${ic.src} (${ic.sizes}) ${(await ri.body()).length} o`;
      }
    } catch (e) { ko++; detail += ` · JSON INVALIDE : ${e.message}`; }
  } else {
    // dimensions réelles du PNG (IHDR)
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    detail += ` · ${w}×${h} · type couleur ${buf[25]}`;
  }
  if (!r.ok()) ko++;
  console.log(`${r.ok() ? '✓' : '✗'} ${l.rel.padEnd(16)} ${r.status()}  ${l.href.split('/').pop()}  ${detail}`);
}

console.log('\nmétadonnées :');
for (const [k, v] of Object.entries(decl.metas)) console.log(`  ${k.padEnd(38)} ${v}`);

const manque = ['apple-mobile-web-app-title', 'apple-mobile-web-app-capable', 'theme-color']
  .filter((k) => !(k in decl.metas));
if (manque.length) { ko++; console.log(`\n✗ métas manquantes : ${manque.join(', ')}`); }
if (erreurs.length) { ko++; console.log(`\n✗ erreurs console : ${erreurs.join(' | ')}`); }
console.log(ko ? `\n${ko} PROBLÈME(S)` : '\nOK — tout ce que la page déclare existe.');
await browser.close();
process.exit(ko ? 1 : 0);
