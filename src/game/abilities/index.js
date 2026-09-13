/**
 * Registre des modules de pouvoirs.
 *
 * Un module implémente : init / update / drawUnder / barValue, et facultativement
 * drawOver,
 * plus trois crochets optionnels :
 *   • `onLand(f, target, hit, game)` → réaction à sa propre touche d'arme
 *     (la brûlure du Bretteur, la pile du Lancier) ;
 *   • `drawUnbounded(ctx, f, game, now)` → passe de rendu **hors arène**, pour
 *     un effet qui déborde volontairement du cadre (le dôme du Lancier) ;
 *   • `specialBar(f)` → seconde rangée de jauge, pour un troisième créneau de
 *     pouvoir.
 *
 * Ajouter un combattant = ajouter sa fiche + son module ici.
 *
 * @module game/abilities
 */

import { windAbilities } from './wind.js';
import { outlawAbilities } from './outlaw.js';
import { bladesmanAbilities } from './bladesman.js';
import { lancerAbilities } from './lancer.js';
import { mageAbilities } from './mage.js';
import { golemAbilities } from './golem.js';
import { dummyAbilities } from './dummy.js';
import { sunAbilities } from './sun.js';
import { lunarAbilities } from './lunar.js';
import { cometAbilities } from './comet.js';

const REGISTRY = {
  wind: windAbilities,
  outlaw: outlawAbilities,
  bladesman: bladesmanAbilities,
  lancer: lancerAbilities,
  mage: mageAbilities,
  golem: golemAbilities,
  dummy: dummyAbilities,
  sun: sunAbilities,
  lunar: lunarAbilities,
  comet: cometAbilities,
};

/** Module neutre : sert de repli pour un élément sans pouvoirs dédiés. */
const NOOP = {
  id: 'noop',
  init() {},
  update() {},
  drawUnder() {},
  drawOver() {},
  barValue: (f) => f.ult.charge / 100,
};

export function abilitiesFor(elementId) {
  return REGISTRY[elementId] ?? NOOP;
}
