/**
 * Décor **statique** : fond sombre, bandeau de titre, cadre d'arène. Rien ne
 * bouge ici — conformément au cahier des charges, le fond ne change jamais
 * pendant le duel.
 *
 * Le décor est rasterisé une fois dans un canvas hors écran, puis blitté en
 * une seule opération à chaque frame.
 *
 * @module render/scene
 */

import { ARENA, SIGNATURE, STAGE, TITLE } from '../data/tuning.js';
import { drawSpriteCentered } from './sprites.js';

/** @type {HTMLCanvasElement|null} */
let cache = null;
let cacheKey = '';

/**
 * Construit (ou réutilise) le décor pour un duel donné.
 * @param {{a:object,b:object,lang:'ref'|'fr'}} opts
 */
/**
 * @param {{fighters:Array, teams:number[], lang:string}} opts
 *
 * À deux, le bandeau relevé sur la vidéo, inchangé. Au-delà, les noms se
 * suivent séparés par des points médians et les icônes disparaissent : à cinq
 * combattants, cinq icônes de 28 px et quatre « VS » ne tiennent plus dans la
 * largeur de l'arène, et la réduction automatique rendait les noms illisibles
 * avant de rendre la ligne courte.
 */
export function buildBackdrop({ fighters, teams, lang }) {
  const [a, b] = fighters;
  const key = `${fighters.map((e) => e.id).join(',')}|${(teams ?? []).join('')}|${lang}`;
  if (cache && cacheKey === key) return cache;

  const cv = document.createElement('canvas');
  cv.width = STAGE.width;
  cv.height = STAGE.height;
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // fond
  ctx.fillStyle = STAGE.paper;
  ctx.fillRect(0, 0, STAGE.width, STAGE.height);

  if (fighters.length === 2) drawTitle(ctx, a, b, lang);
  else drawTitleMulti(ctx, fighters, teams, lang);
  drawArena(ctx);
  // après l'arène, forcément : `drawArena` repeint tout le carré en blanc
  drawSignature(ctx);

  cache = cv;
  cacheKey = key;
  return cv;
}

export function drawBackdrop(ctx, backdrop) {
  ctx.drawImage(backdrop, 0, 0);
}

/* ------------------------------------------------------------------ */

function drawArena(ctx) {
  const { x, y, size, border, fill, stroke } = ARENA;
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = border;
  ctx.lineJoin = 'miter';
  ctx.strokeRect(x + border / 2, y + border / 2, size - border, size - border);
}

/**
 * **La signature de la chaîne, posée sur le sol de l'aire de jeu.**
 *
 * Elle est ici et pas dans une passe par image parce que le décor est le seul
 * endroit qui ne coûte rien : rasterisé une fois, blitté ensuite. Et elle est
 * **dans l'arène** et pas dans la bande sombre parce qu'un filigrane hors du
 * terrain se recadre — voir `SIGNATURE` dans `data/tuning.js` pour le
 * raisonnement complet.
 *
 * Conséquence de rendu à connaître : tout ce que `match.js` dessine ensuite
 * passe **par-dessus** — nappe de sol, zones de pouvoir, combattants. La
 * signature n'est donc jamais entre le spectateur et le duel, ce qui est la
 * règle de composition du dépôt ; en contrepartie, une ambiance d'arène opaque
 * la teinterait. Aucune ne l'est : elles sont toutes en alpha faible.
 */
function drawSignature(ctx) {
  const inner = ARENA.inner;
  const w = inner.right - inner.left;
  const h = inner.bottom - inner.top;
  const { handle, mark, tag } = SIGNATURE;

  ctx.save();

  /*
   * Le filigrane s'**ajuste à la largeur**, comme le bandeau de titre : une
   * taille de casse en dur mentirait le jour où le pseudo change de longueur.
   * Les métriques d'une police sont linéaires en taille, donc deux passes
   * suffisent ; la troisième est là pour le cas d'une police de repli.
   */
  const cible = w * mark.widthRatio;
  let size = 64;
  for (let i = 0; i < 3; i++) {
    ctx.font = `400 ${size}px "Archivo Black", "Arial Black", sans-serif`;
    size *= cible / ctx.measureText(handle).width;
  }
  ctx.font = `400 ${size}px "Archivo Black", "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = mark.alpha;
  ctx.fillStyle = mark.color;
  ctx.fillText(handle, inner.left + w / 2, inner.top + h * mark.y);

  // la ligne lisible : coin bas-droit, à l'intérieur du trait noir
  ctx.font = `600 ${tag.size}px "Oswald", "Arial Narrow", sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = tag.alpha;
  ctx.fillStyle = tag.color;
  ctx.fillText(handle, inner.right - tag.pad, inner.bottom - tag.pad);

  ctx.restore();
}

/**
 * Bandeau à plusieurs : les noms à la suite, chacun dans sa couleur, séparés
 * par des points médians — et **regroupés par camp** quand il y a des camps,
 * avec un « VS » entre les groupes. C'est ce qui distingue à l'œil un 2 contre
 * 2 d'un chacun-pour-soi, sans rien écrire de plus.
 */
function drawTitleMulti(ctx, els, teams, lang) {
  // groupes de camp, dans l'ordre d'apparition
  const groupes = [];
  els.forEach((el, i) => {
    const camp = teams?.[i] ?? i;
    const g = groupes.find((x) => x.camp === camp);
    if (g) g.els.push(el);
    else groupes.push({ camp, els: [el] });
  });

  const maxWidth = ARENA.size - 8;
  let size = TITLE.fontSize;
  const mesure = (s) => {
    ctx.font = `400 ${s}px "Archivo Black", "Arial Black", sans-serif`;
    let w = 0;
    groupes.forEach((g, gi) => {
      g.els.forEach((el, i) => {
        w += ctx.measureText(lang === 'fr' ? el.name : el.nameRef).width;
        if (i < g.els.length - 1) w += ctx.measureText(' · ').width;
      });
      if (gi < groupes.length - 1) {
        ctx.font = `400 ${s * (TITLE.vsSize / TITLE.fontSize)}px "Archivo Black", "Arial Black", sans-serif`;
        w += ctx.measureText(' VS ').width;
        ctx.font = `400 ${s}px "Archivo Black", "Arial Black", sans-serif`;
      }
    });
    return w;
  };
  for (let i = 0; i < 10 && mesure(size) > maxWidth; i++) size *= maxWidth / mesure(size);

  const font = `400 ${size}px "Archivo Black", "Arial Black", sans-serif`;
  const vsFont = `400 ${size * (TITLE.vsSize / TITLE.fontSize)}px "Archivo Black", "Arial Black", sans-serif`;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';
  let x = TITLE.centerX - mesure(size) / 2;
  const base = TITLE.baseline;

  groupes.forEach((g, gi) => {
    g.els.forEach((el, i) => {
      const nom = lang === 'fr' ? el.name : el.nameRef;
      ctx.font = font;
      strokeFill(ctx, nom, x, base, el.look.body, TITLE.stroke, TITLE.strokeWidth);
      x += ctx.measureText(nom).width;
      if (i < g.els.length - 1) {
        strokeFill(ctx, ' · ', x, base, TITLE.vsColor, TITLE.stroke, TITLE.strokeWidth);
        x += ctx.measureText(' · ').width;
      }
    });
    if (gi < groupes.length - 1) {
      ctx.font = vsFont;
      strokeFill(ctx, ' VS ', x, base - 2, TITLE.vsColor, TITLE.stroke, 6);
      x += ctx.measureText(' VS ').width;
    }
  });
  ctx.restore();
}

/**
 * Bandeau « DARK ⬤ VS ❄ ICE » : deux noms colorés à contour noir encadrant
 * un « VS » blanc, chaque nom accolé à son icône pixel.
 */
function drawTitle(ctx, a, b, lang) {
  const nameA = lang === 'fr' ? a.name : a.nameRef;
  const nameB = lang === 'fr' ? b.name : b.nameRef;
  // le bandeau ne doit jamais dépasser la largeur de l'arène : on réduit la
  // taille de casse si les noms sont longs (ex. « TEMPÊTE » au lieu de « ICE »)
  const maxWidth = ARENA.size - 8;
  let size = TITLE.fontSize;
  for (let i = 0; i < 8; i++) {
    ctx.font = `400 ${size}px "Archivo Black", "Arial Black", sans-serif`;
    const wNames = ctx.measureText(nameA).width + ctx.measureText(nameB).width;
    ctx.font = `400 ${size * (TITLE.vsSize / TITLE.fontSize)}px "Archivo Black", "Arial Black", sans-serif`;
    const total =
      wNames + ctx.measureText('VS').width + TITLE.gap * 4 + TITLE.iconSize * 2;
    if (total <= maxWidth) break;
    size *= maxWidth / total;
  }
  const font = `400 ${size}px "Archivo Black", "Arial Black", sans-serif`;
  const vsFont = `400 ${size * (TITLE.vsSize / TITLE.fontSize)}px "Archivo Black", "Arial Black", sans-serif`;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';

  ctx.font = font;
  const wA = ctx.measureText(nameA).width;
  const wB = ctx.measureText(nameB).width;
  ctx.font = vsFont;
  const wVs = ctx.measureText('VS').width;

  const g = TITLE.gap;
  const icon = TITLE.iconSize;
  const total = wA + g + icon + g + wVs + g + icon + g + wB;
  let x = TITLE.centerX - total / 2;
  const base = TITLE.baseline;

  ctx.font = font;
  strokeFill(ctx, nameA, x, base, a.look.body, TITLE.stroke, TITLE.strokeWidth);
  x += wA + g;

  drawSpriteCentered(ctx, a.icon, x + icon / 2, base - size * 0.36, icon);
  x += icon + g;

  ctx.font = vsFont;
  strokeFill(ctx, 'VS', x, base - 4, TITLE.vsColor, TITLE.stroke, 6);
  x += wVs + g;

  drawSpriteCentered(ctx, b.icon, x + icon / 2, base - size * 0.36, icon);
  x += icon + g;

  ctx.font = font;
  strokeFill(ctx, nameB, x, base, b.look.body, TITLE.stroke, TITLE.strokeWidth);

  ctx.restore();
}

/** Texte plein avec contour noir (le contour est dessiné d'abord). */
export function strokeFill(ctx, text, x, y, fill, stroke, width) {
  ctx.lineWidth = width;
  ctx.strokeStyle = stroke;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}
