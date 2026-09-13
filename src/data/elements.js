/**
 * ============================================================================
 *  FICHES D'ÉLÉMENTS — registre du roster
 * ============================================================================
 *
 *  Ce fichier n'est plus qu'un **assemblage** : chaque combattant vit dans
 *  `fighters/<id>.js`, un fichier par fiche, du même nom que son module de
 *  pouvoirs `game/abilities/<id>.js`.
 *
 *  C'est la découpe qui compte : modifier le Shinobi demandait d'ouvrir un
 *  fichier de 3 000 lignes pour en toucher 350. Aujourd'hui on ouvre
 *  `fighters/wind.js` et rien d'autre.
 *
 *  Ce qui reste ici, et rien de plus : le registre `ELEMENTS`, l'ordre
 *  `ROSTER` (qui décide du camp A de la matrice) et l'accès `getElement`.
 *  Aucune valeur de combattant.
 *
 *  Ce qui définit un combattant est dans sa fiche : apparence, vitesse, arme,
 *  pouvoir, ultime, projectiles, HUD. Le moteur ne contient AUCUNE constante
 *  propre à un élément : il lit la fiche.
 *
 *  Les objets sont gelés (deepFreeze) : un duel ne peut pas les modifier, donc
 *  le Hors-la-loi se comporte exactement pareil au 1er et au 100e duel. Le runtime
 *  travaille sur une copie d'état (voir game/fighter.js).
 *
 *  **Ajouter un combattant** = `fighters/<id>.js` + `game/abilities/<id>.js` +
 *  trois lignes ici (import, entrée `ELEMENTS`, queue de `ROSTER`).
 *  Marche à suivre complète : `docs/AJOUTER-UN-COMBATTANT.md`.
 *
 *  Unités : px (référentiel 720x1280 de la vidéo), secondes, radians.
 *  « mesuré » = valeur relevée sur la vidéo de référence.
 *  « calé »   = valeur ajustée pour retrouver le rythme observé (~60 s de duel).
 *  « déduit » = valeur calculée à partir d'une autre.
 *
 * @module data/elements
 */

import { deepFreeze } from './freeze.js';

import { WIND } from './fighters/wind.js';
import { OUTLAW } from './fighters/outlaw.js';
import { BLADESMAN } from './fighters/bladesman.js';
import { LANCER } from './fighters/lancer.js';
import { MAGE } from './fighters/mage.js';
import { GOLEM } from './fighters/golem.js';
import { DUMMY } from './fighters/dummy.js';
import { SUN } from './fighters/sun.js';
import { LUNAR } from './fighters/lunar.js';
import { COMET } from './fighters/comet.js';

export const ELEMENTS = deepFreeze({
  wind: WIND,
  outlaw: OUTLAW,
  bladesman: BLADESMAN,
  lancer: LANCER,
  mage: MAGE,
  golem: GOLEM,
  dummy: DUMMY,
  sun: SUN,
  lunar: LUNAR,
  comet: COMET,
});

/**
 * Le roster : ordre d'affichage dans l'écran de sélection, et — via
 * `tools/matrix.mjs` — ordre d'appariement de la matrice d'équilibrage.
 *
 * **Un nouveau venu s'ajoute en queue.** Les paires sont formées en
 * `[liste[i], liste[j]]`, donc l'insérer ailleurs déplacerait le camp A
 * d'affrontements existants et changerait leur issue sans qu'aucune valeur de
 * fiche n'ait bougé. Preuve à vérifier : le diff de la matrice ne doit
 * contenir que des ajouts.
 *
 * Il n'y a plus de liste `DISABLED` : les sept éléments gelés ont été
 * **supprimés** du dépôt, pas masqués. Tout ce qui est ici se joue.
 */
export const ROSTER = deepFreeze([
  'outlaw',
  'bladesman',
  'lancer',
  'wind',
  'mage',
  // En queue, comme le veut la règle ci-dessus : le diff de la matrice ne doit
  // contenir que des ajouts.
  'golem',
  // Le Mannequin est jouable comme les autres — c'est tout l'intérêt : on le
  // choisit pour regarder un combattant à l'œuvre. Ses lignes de matrice sont
  // structurellement constantes (il ne peut pas gagner), et sa ligne miroir est
  // la seule du fichier à finir en `timeout` : deux combattants sans dégâts ne
  // se départagent jamais.
  'dummy',
  /**
   * **Le Soleil ferme la marche, et il la fermera toujours.** C'est un *boss* :
   * il est fait pour gagner contre les sept autres, donc ses lignes de matrice
   * sont structurellement à sens unique — comme celles du Mannequin, mais dans
   * l'autre sens. L'ajouter en queue est la règle générale (le diff de la
   * matrice ne doit contenir que des ajouts) ; ici c'est en plus la seule
   * position qui garde les sept autres exactement où ils étaient.
   */
  'sun',
  /**
   * **LUNE ferme la marche à son tour**, et pour la même raison que le Soleil :
   * un boss a des lignes de matrice structurellement à sens unique, et la queue
   * de `ROSTER` est la seule position qui laisse les huit autres exactement où
   * ils étaient — le diff de la matrice ne contient alors **que des ajouts**
   * (invariant 3), ce qui se vérifie d'un coup d'œil.
   *
   * Elle passe **après** le Soleil, donc le Soleil est camp A dans leur duel.
   * Le camp A pèse lourd (piège documenté du Golem) : leur ligne unique est
   * donc à lire comme un indice, pas comme un verdict. Le banc les rejoue sur
   * les deux camps.
   */
  'lunar',
  /**
   * **La Comète ferme la marche**, et pour la raison générale cette fois : elle
   * n'est ni un boss ni une cible, elle se juge avec les six du milieu. La
   * queue de `ROSTER` est la seule position qui laisse les neuf autres
   * exactement où ils étaient — le diff de la matrice ne contient alors **que
   * des ajouts** (invariant 3), et le compte absolu des six est resté
   * 13, 13, 12, 12, 10, 4.
   *
   * Conséquence à connaître avant de lire sa ligne : elle est **camp B partout
   * sauf contre elle-même**, et le camp A pèse lourd (piège documenté du
   * Golem). Sa ligne de matrice sous-estime donc sa force — c'est le banc sur
   * les deux camps qui la mesure, pas elle.
   */
  'comet',
]);

/** @param {string} id */
export function getElement(id) {
  const el = ELEMENTS[id];
  if (!el) throw new Error(`Élément inconnu : ${id}`);
  return el;
}
