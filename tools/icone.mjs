/**
 * Génère les icônes d'application (`assets/icons/`) **depuis les assets du
 * jeu**, et jamais à la main.
 *
 * C'est la règle du dépôt pour les icônes — « une icône redessinée à la main
 * diverge de son arme : l'échantillonner dessus » — appliquée un cran plus
 * haut : l'icône d'écran d'accueil est échantillonnée sur la **scène**. Elle
 * reprend le fond d'encre, le carré d'arène et son liseré noir, plus un corps
 * de combattant pris dans sa banque de sprites. Repalettiser la Comète ou
 * changer `STAGE.paper` et relancer cet outil suffit : rien ne dérive.
 *
 *   node tools/icone.mjs              # écrit dans assets/icons/
 *   node tools/icone.mjs --orbe=sunCore
 *
 * **Ce qui est un écart assumé à la scène**, et pourquoi :
 *
 *  • Le liseré de l'arène est à 2,9 % du côté, là où le jeu est à 0,94 %
 *    (6 px sur 640). À l'échelle, il ferait 0,6 px sur la grille d'un iPhone
 *    et disparaîtrait. Une proportion juste donne ici un trait absent.
 *  • L'arène est **rentrée de 10 %**. iOS n'affiche pas un carré : il masque
 *    l'icône par une superellipse qui mange les coins. Une arène bord à bord
 *    perdrait ses quatre angles, donc sa forme.
 *  • L'orbe remplit presque l'arène (rayon 0,32 du côté). À 60 px — la taille
 *    réelle sur la grille —, un orbe aux proportions du duel devient un point.
 *
 * @module tools/icone
 */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_BASE = process.env.URL ?? 'http://127.0.0.1:8085';
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const arg = (nom, defaut) =>
  process.argv.find((a) => a.startsWith(`--${nom}=`))?.split('=')[1] ?? defaut;

/**
 * Le corps qui pose pour l'icône, et la fiche dont on prend la lumière.
 *
 * La Comète : c'est l'orbe le plus graphique du roster — un tourbillon à cœur
 * sombre, lisible jusqu'à 60 px là où une bille unie devient une pastille. Le
 * choix est arbitraire et se change ici, pas dans le dessin.
 */
const ORBE = arg('orbe', 'cometCore');
const FICHE = arg('fiche', 'comet');

/**
 * Les tailles, et qui les lit.
 *  • 180 — `apple-touch-icon`, l'écran d'accueil iOS (60 pt × 3).
 *  • 192 / 512 — le manifeste web (Android, Chrome desktop).
 *  •  32 — l'onglet.
 * iOS ignore le manifeste pour « Ajouter à l'écran d'accueil » : c'est le
 * `<link rel="apple-touch-icon">` qui décide, d'où un fichier dédié.
 */
const TAILLES = [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['favicon-32.png', 32],
];

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`${URL_BASE}/index.html`, { waitUntil: 'networkidle' });

const sorties = await page.evaluate(
  async ({ ORBE, FICHE, TAILLES }) => {
    const { loadSprites, getSprite } = await import('/src/render/sprites.js');
    const { ELEMENTS } = await import('/src/data/elements.js');
    const { STAGE, ARENA } = await import('/src/data/tuning.js');
    await loadSprites();

    const el = ELEMENTS[FICHE];
    const lumiere = el.look.palette?.light ?? el.look.body;

    /**
     * On dessine **une seule fois en 1024**, puis on réduit : réduire un grand
     * rendu donne un anticrénelage propre, alors que redessiner à 32 px ferait
     * tomber le liseré sous le pixel et le supprimerait par endroits.
     */
    const S = 1024;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx = cv.getContext('2d');

    // 1. le fond d'encre de la scène
    ctx.fillStyle = STAGE.paper;
    ctx.fillRect(0, 0, S, S);

    // 2. le carré d'arène, rentré pour survivre au masque d'iOS
    const inset = S * 0.1;
    const cote = S - 2 * inset;
    const bord = S * 0.03;
    ctx.fillStyle = ARENA.fill;
    ctx.fillRect(inset, inset, cote, cote);
    ctx.strokeStyle = ARENA.stroke;
    ctx.lineWidth = bord;
    ctx.lineJoin = 'miter';
    ctx.strokeRect(inset + bord / 2, inset + bord / 2, cote - bord, cote - bord);

    // 3. la nappe de lumière du combattant, comme `flair.drawFloor`
    const n = parseInt(lumiere.slice(1), 16);
    const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    const halo = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.38);
    halo.addColorStop(0, `rgba(${rgb},0.5)`);
    halo.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // 4. l'orbe, dimensionné sur sa HAUTEUR comme partout dans le moteur
    const img = getSprite(ORBE);
    const h = S * 0.64;
    const w = h * (img.width / img.height);
    ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);

    /*
     * Réduction en deux temps quand le rapport dépasse 2 : un `drawImage` qui
     * divise par 32 d'un coup n'échantillonne qu'une poignée de texels et
     * crénelle le liseré. Chaque étape divise au plus par deux.
     */
    const reduire = (taille) => {
      let src = cv;
      let cur = S;
      while (cur / 2 >= taille) {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = cur / 2;
        const c = tmp.getContext('2d');
        c.imageSmoothingQuality = 'high';
        c.drawImage(src, 0, 0, cur / 2, cur / 2);
        src = tmp;
        cur /= 2;
      }
      const out = document.createElement('canvas');
      out.width = out.height = taille;
      const c = out.getContext('2d');
      c.imageSmoothingQuality = 'high';
      /**
       * Fond opaque **avant** le dessin : iOS compose un `apple-touch-icon`
       * transparent sur du noir, ce qui ferait un halo noir autour des angles
       * anticrénelés. Le rendu est déjà opaque ; ceci le garantit.
       */
      c.fillStyle = STAGE.paper;
      c.fillRect(0, 0, taille, taille);
      c.drawImage(src, 0, 0, taille, taille);
      return out.toDataURL('image/png');
    };

    return TAILLES.map(([nom, taille]) => [nom, taille, reduire(taille)]);
  },
  { ORBE, FICHE, TAILLES },
);

mkdirSync(join(RACINE, 'assets/icons'), { recursive: true });
for (const [nom, taille, data] of sorties) {
  const buf = Buffer.from(data.split(',')[1], 'base64');
  writeFileSync(join(RACINE, 'assets/icons', nom), buf);
  console.log(`assets/icons/${nom}  ${taille}×${taille}  ${(buf.length / 1024).toFixed(1)} ko`);
}
console.log(`\norbe « ${ORBE} », lumière de la fiche « ${FICHE} »`);
await browser.close();
