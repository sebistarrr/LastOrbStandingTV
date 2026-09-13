/**
 * Cartes de pixel-art de la COMÈTE.
 *
 * **Une seule carte, et c'est une icône** — comme le Mannequin, et pour la même
 * raison : ce combattant n'a **aucune arme**, donc aucun sprite d'arme, et
 * aucun projectile. Son corps reste un cercle vectoriel (`look.body`), ce qui
 * lui laisse le contour et le halo que le moteur trace déjà.
 *
 * @module data/pixelart/comet
 */

import { deepFreeze } from '../freeze.js';

/**
 * Icône de sélection : **la tête et la queue**, pas un personnage.
 *
 * Le dessin est bâti sur la seule chose que le joueur doit lire avant de la
 * choisir — *ça va vite et ça n'a rien dans les mains*. D'où une tête ronde et
 * claire en bas à droite, et une traînée qui s'effile vers le coin opposé : la
 * diagonale est ce qui dit la vitesse, une icône centrée l'aurait dite immobile.
 *
 * Les trois teintes sont celles de sa fiche (`look.palette`) et pas des
 * voisines choisies à l'œil : c'est le piège que le dépôt a payé sur le Rayon
 * solaire — une icône échantillonnée ailleurs que sur le personnage **dérive**
 * dès le premier réglage de couleur.
 *
 * Le contour sombre est obligatoire ici comme partout : la carte de sélection
 * est claire, et un dessin magenta clair sans cerne s'y dissout (la leçon des
 * jaunes pâles de l'Hoplite).
 */
export const ICON_COMET = deepFreeze({
  w: 16,
  h: 16,
  palette: {
    K: '#3d0b2a', // contour, l'encre de sa palette
    M: '#d63b8f', // le magenta de corps
    p: '#ff8ad0', // le rose clair de la queue
    w: '#fff0fa', // le cœur, presque blanc
  },
  rows: [
    '................',
    'KKK.............',
    'KMMKK...........',
    '.KMMMKK.........',
    '..KMMMMKK.......',
    '...KMpppMKK.....',
    '....KMpppMK.....',
    '.....KMpppMKK...',
    '......KMppwwMK..',
    '.......KMwwwwMK.',
    '.......KMwwwwwMK',
    '......KMpwwwwwMK',
    '......KMppwwwMK.',
    '.......KMpppMK..',
    '........KMMMK...',
    '.........KKK....',
  ],
});
