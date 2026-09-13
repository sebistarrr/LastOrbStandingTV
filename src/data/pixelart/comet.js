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
