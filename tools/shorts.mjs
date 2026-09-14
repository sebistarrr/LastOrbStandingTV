// Programmation éditoriale : quelles affiches filmer, dans quel ordre.
//
// La matrice (`matrix.mjs`) est un garde-fou d'équilibrage : elle joue chaque
// paire 3 fois et ne dit que le vainqueur. Pour choisir ce qu'on **filme**, il
// faut deux autres grandeurs, qu'elle n'imprime pas :
//
//   - **la marge** : les PV restants du vainqueur, en % de sa barre. C'est ce
//     qui fait un duel regardable — une victoire à 4 % se revoit, une victoire
//     à 80 % est une démonstration ;
//   - **l'incertitude** : sur N graines, la paire change-t-elle de vainqueur ?
//     Une affiche qui bascule est une affiche dont on ne connaît pas la fin.
//
// Elle tourne sur **huit** graines, pas trois : trois suffisent à détecter une
// régression, pas à estimer une fréquence. Et elle ne touche à rien — aucun
// rendu, aucune écriture. La matrice de référence reste le seul relevé
// d'équilibrage ; ce fichier-ci ne s'y substitue pas.
//
//   node tools/shorts.mjs            # le classement complet
//   node tools/shorts.mjs --json     # la même chose, brute
//
// Prérequis : un serveur statique sur $URL (défaut http://127.0.0.1:8085).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const URL = process.env.URL ?? 'http://127.0.0.1:8085';
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SEEDS = [11, 22, 33, 44, 55, 66, 77, 88];

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(`${URL}/index.html?a=outlaw&b=bladesman`, { waitUntil: 'networkidle' });

const out = await page.evaluate(async (seeds) => {
  const { Match } = await import('/src/game/match.js');
  const { createRng } = await import('/src/core/rng.js');
  const { ROSTER } = await import('/src/data/elements.js');
  const res = [];
  const dt = 1 / 120;
  for (let i = 0; i < ROSTER.length; i++) {
    for (let j = i + 1; j < ROSTER.length; j++) {
      const pair = [ROSTER[i], ROSTER[j]];
      const runs = [];
      for (const seed of seeds) {
        const m = new Match({ elements: pair, rng: createRng(seed), lang: 'ref', onEnd() {} });
        let t = 0;
        while (m.phase !== 'over' && t < 200) { m.update(dt); t += dt; }
        // La marge se lit sur le vainqueur : sa barre restante en % de **sa**
        // propre `maxHp` — jamais d'une constante, les boss et le Golem ont la
        // leur (invariant du dépôt sur `Fighter.maxHp`).
        const w = m.winner;
        runs.push({
          seed,
          winner: w ? w.el.id : 'timeout',
          duration: +m.stats.duration.toFixed(1),
          margin: w ? +((100 * w.hp) / w.maxHp).toFixed(1) : null,
        });
      }
      res.push({ a: pair[0], b: pair[1], runs });
    }
  }
  return res;
}, SEEDS);

await browser.close();

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 2));
} else {
  const lignes = out.map((p) => {
    const vus = new Set(p.runs.map((r) => r.winner));
    const marges = p.runs.filter((r) => r.margin !== null).map((r) => r.margin);
    const durees = p.runs.map((r) => r.duration);
    const meilleur = p.runs
      .filter((r) => r.margin !== null)
      .sort((x, y) => x.margin - y.margin)[0];
    return {
      affiche: `${p.a} vs ${p.b}`,
      bascule: vus.size > 1,
      marge: marges.length ? Math.min(...marges) : null,
      margeMoy: marges.length ? marges.reduce((s, x) => s + x, 0) / marges.length : null,
      duree: durees.reduce((s, x) => s + x, 0) / durees.length,
      meilleur,
    };
  });
  // Tri éditorial : ce qui bascule d'abord, puis la marge la plus fine.
  lignes.sort((x, y) => (y.bascule - x.bascule) || (x.marge ?? 999) - (y.marge ?? 999));
  console.log('affiche                      bascule  marge min  marge moy  durée moy   meilleure graine');
  for (const l of lignes) {
    console.log(
      l.affiche.padEnd(28),
      (l.bascule ? '  oui  ' : '  non  ').padEnd(8),
      `${(l.marge ?? 0).toFixed(1)} %`.padStart(9),
      `${(l.margeMoy ?? 0).toFixed(1)} %`.padStart(10),
      `${l.duree.toFixed(1)} s`.padStart(10),
      `   seed=${l.meilleur?.seed} (${l.meilleur?.winner}, ${l.meilleur?.margin} %)`,
    );
  }
  console.log(`\n${lignes.length} affiches × ${SEEDS.length} graines`);
  console.log('erreurs page:', errs.slice(0, 5));
}
