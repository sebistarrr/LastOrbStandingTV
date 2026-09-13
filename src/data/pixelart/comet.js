/**
 * Cartes de pixel-art de la COMÈTE.
 *
 * **Trois cartes, et deux d'entre elles sont des replis.** Le corps et l'arme
 * sont servis par de **vrais PNG** (`assets/sprites/comet-core.png` et
 * `comet-ring.png`, déclarés dans `assets/sprites/manifest.json`) : les cartes
 * ci-dessous ne s'affichent que si le manifeste cesse de les pointer. Elles
 * restent obligatoires — une clé absente de `PIXEL_MAPS` dessine du vide sans
 * erreur, et `fiche-check` le détecte.
 *
 * **Les trois sont transcrites de la maquette, pas dessinées à la main** :
 * réduction mécanique du PNG à la taille de la carte (moyenne d'aire), puis
 * chaque cellule est rattachée à la teinte la plus proche de `look.palette`.
 * C'est la règle du dépôt dans les deux sens — un sprite *se transcrit*, et une
 * icône redessinée à la main **diverge** de l'arme qu'elle annonce.
 *
 * @module data/pixelart/comet
 */

import { deepFreeze } from '../freeze.js';

/** Les cinq teintes de `look.palette`, relevées par bandes de luminance sur
 *  `comet-core.png` — les trois cartes les recopient, icône comprise. */
const PALETTE = {
  K: '#04010e', // l'encre du vide central
  s: '#290651', // violet d'ombre
  b: '#540f8b', // violet de corps
  m: '#cb2fad', // magenta des bras
  c: '#ee82ec', // rose clair, la crête des bras
};

/**
 * **Le corps** — repli de `comet-core.png`, la sphère seule.
 *
 * Le vide central occupe le tiers du disque : c'est lui qui rend le chiffre de
 * PV lisible sans contour (82 % de pixels sombres sous son empreinte, mesuré),
 * là où le Soleil a dû s'en faire poser un.
 */
export const COMET_CORE = deepFreeze({
  w: 16,
  h: 16,
  palette: PALETTE,
  rows: [
    '.....ssKsss.....',
    '...sssbbbssss...',
    '..Ksbbbmmbbbss..',
    '.Ksbbmmbmcmmbss.',
    '.ssmmmssKKbmbbs.',
    'KsbmmKKKKKKbmbbK',
    'sbmmsKKKKKKsmbbs',
    'sbbbKKKKKKKKmmss',
    'sbbmsKKKKKKKmmbs',
    'ssbmsKKKKKKbmmbs',
    'KsbbmKKKKKKbbbsK',
    '.sbmbmbKssmbmss.',
    '.Ksbmmmmmmmbbss.',
    '..sssbmbbmbbsK..',
    '...KssbbbbbsK...',
    '.....ssssss.....',
  ],
});

/**
 * **L'arme** — repli de `comet-ring.png` : tout ce qui entoure la sphère,
 * éclats et éclairs, avec un **centre vide** que la bille vient boucher.
 *
 * La hauteur est ce qui compte : `head.scale` est calé sur `h = 17` (voir la
 * fiche), donc changer cette carte de hauteur déplacerait la largeur dessinée
 * de l'arme, et avec elle sa portée.
 */
export const COMET_RING = deepFreeze({
  w: 17,
  h: 17,
  palette: PALETTE,
  rows: [
    '.................',
    '.................',
    '.....bssKKsb.....',
    '....ss.....smm...',
    '...bK.......Kbs..',
    '.sbK.........sb..',
    '.sb...........ss.',
    '.mb...........sb.',
    '.sb...........ss.',
    '..s...........ss.',
    '..s...........s..',
    '..bs.........s...',
    '...bs.......Kbs..',
    '...bbK.....sbbb..',
    '......sssKsb.....',
    '.......s.........',
    '.................',
  ],
});

/**
 * **L'éclat de la Fragmentation** — repli de `comet-shard-1.png`, et c'est **un
 * morceau de la maquette elle-même** : une des composantes détachées qui
 * flottaient autour du tourbillon. Choisie parmi les 37 par **remplissage de
 * boîte** (0,71, le plus haut) — c'est un caillou, pas un éclair, et un éclair
 * filiforme lancé à travers l'arène ne se lit pas.
 *
 * **Une seule silhouette, et c'est une mesure de rendu, pas une économie** :
 * `Projectiles.draw` tourne chaque projectile de son propre cap
 * (`ctx.rotate(p.angle)`), donc les huit éclats d'un anneau complet sont déjà
 * orientés à 45° les uns des autres. Trois silhouettes avaient été découpées
 * puis **retirées** : elles n'ajoutaient rien que la rotation ne donne déjà, et
 * trois entrées de `projectiles` auraient encombré la carte de sélection. C'est
 * l'inverse du cas de LUNE, dont les vingt-cinq météores tombent **tous dans le
 * même sens** — là, la silhouette est le seul levier de variété.
 */
export const COMET_SHARD = deepFreeze({
  w: 6,
  h: 8,
  palette: PALETTE,
  rows: [
    '.sKs..',
    'bsKKs.',
    'bssKKs',
    'bbssKs',
    '.bssKs',
    '.bbsss',
    '..bbss',
    '...bs.',
  ],
});

/**
 * **Icône de sélection : le personnage entier, en petit.**
 *
 * Échantillonnée sur le **composite** bille + entourage, et non redessinée :
 * c'est le seul moyen qu'elle ne dérive pas du dessin le jour où l'un des deux
 * PNG change. Elle est lue par le bandeau de titre du duel et par la chaîne de
 * repli de `ui/select.js` — **jamais** par la vignette de la carte, qui montre
 * `look.sprite` et `weapon.head.sprite`.
 */
export const ICON_COMET = deepFreeze({
  w: 16,
  h: 16,
  palette: PALETTE,
  rows: [
    '.....bb.s.......',
    '....bsssssssmb..',
    '...bsssbbbssscs.',
    '...ssbbmmmmbsss.',
    '.sssbbmbsbmmbsb.',
    '.bssmmKKKKKmbsss',
    'mbsbmbKKKKKmmbsb',
    '.bsbmsKKKKKsmbsb',
    '.bsbmsKKKKKbmbsb',
    '..sbbbKKKKKbmsss',
    '..ssbbbKKKbbbsK.',
    '..ssbmmmbmmbssm.',
    '...bsbmmbmbbsbb.',
    '...bsssbbbbssbb.',
    '...b.ssssssss...',
    '......sb........',
  ],
});
