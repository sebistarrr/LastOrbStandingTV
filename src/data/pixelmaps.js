/**
 * ============================================================================
 *  PIXEL-ART — registre des cartes
 * ============================================================================
 *
 *  Ce fichier n'est plus qu'un **registre** : chaque carte vit dans
 *  `pixelart/<combattant>.js`, du même nom que sa fiche et que son module de
 *  pouvoirs. Retoucher le shuriken du Shinobi n'oblige donc plus à ouvrir les
 *  trente et une cartes du roster.
 *
 *  Une carte est un dessin en **texte** : `rows` liste les lignes, une lettre
 *  par cellule, et `palette` associe chaque lettre à une couleur (`.` =
 *  transparent). C'est ce qui garde le dépôt sans binaire — à trois exceptions
 *  près, documentées dans `assets/sprites/manifest.json`, où un vrai PNG prend
 *  la place de la carte et où celle-ci reste comme repli.
 *
 *  **`PIXEL_MAPS` est la table que lisent les fiches** (`weapon.head.sprite`,
 *  `projectiles.*.sprite`, `icon`), `render/sprites.js` et le manifeste. Une
 *  clé absente d'ici est un sprite invisible, sans erreur : ajouter une carte,
 *  c'est aussi l'inscrire ci-dessous.
 *
 *  L'ordre du registre est **lu** par `render/sprites.js` (parcours des
 *  overrides PNG) : on ajoute en queue de section, on ne réordonne pas.
 *
 * @module data/pixelmaps
 */

import { deepFreeze } from './freeze.js';

import { WIND_SHURIKEN, ICON_TORNADO } from './pixelart/wind.js';
import { OUTLAW_REVOLVER, OUTLAW_SHOT, ICON_REVOLVER, ICE_SHARD } from './pixelart/outlaw.js';
import { BLADESMAN_FLAMEBLADE, BLADESMAN_FLAMEWHEEL, ICON_SABRE } from './pixelart/bladesman.js';
import { LANCER_SPEAR, ICON_LANCE } from './pixelart/lancer.js';
import { MAGE_STAFF, MAGE_ORB, MAGE_FLOWER, ICON_STAFF } from './pixelart/mage.js';
import { GOLEM_ROCK, GOLEM_SHARD, ICON_GOLEM } from './pixelart/golem.js';
import { ICON_DUMMY } from './pixelart/dummy.js';
import { SUN_RAY, SUN_CORE, SUN_BEAM, ICON_SUN } from './pixelart/sun.js';
import { LUNAR_BALL, LUNAR_ROCK1, LUNAR_ROCK2, LUNAR_ROCK3, ICON_LUNAR } from './pixelart/lunar.js';
import { COMET_CORE, COMET_RING, COMET_SHARD, ICON_COMET } from './pixelart/comet.js';

export const PIXEL_MAPS = deepFreeze({
  // Hors-la-loi
  outlawRevolver: OUTLAW_REVOLVER,
  outlawShot: OUTLAW_SHOT,
  iceShard: ICE_SHARD,
  iconRevolver: ICON_REVOLVER,
  // Bretteur
  bladesmanFlameBlade: BLADESMAN_FLAMEBLADE,
  bladesmanFlameWheel: BLADESMAN_FLAMEWHEEL,
  iconSabre: ICON_SABRE,
  // Lancier
  lancerSpear: LANCER_SPEAR,
  iconLance: ICON_LANCE,
  // Shinobi
  windShuriken: WIND_SHURIKEN,
  iconTornado: ICON_TORNADO,
  // Mage
  mageStaff: MAGE_STAFF,
  mageOrb: MAGE_ORB,
  mageFlower: MAGE_FLOWER,
  iconStaff: ICON_STAFF,
  // Golem
  golemRock: GOLEM_ROCK,
  golemShard: GOLEM_SHARD,
  iconGolem: ICON_GOLEM,
  // Mannequin — une seule carte : il n'a ni arme ni projectile
  iconDummy: ICON_DUMMY,
  // Soleil — une carte d'arme **répétée huit fois** par `weapon.spokes`, et
  // `sunCore` qui est le **corps** : le seul du roster à être un sprite plutôt
  // qu'un cercle vectoriel (`look.sprite`)
  sunRay: SUN_RAY,
  sunCore: SUN_CORE,
  sunBeam: SUN_BEAM,
  iconSun: ICON_SUN,
  // Lune — le corps, puis **trois météores** : son seul dégât tombe du ciel,
  // et trois silhouettes valent mieux qu'une répétée quinze fois dans la même
  // averse. On ajoute en queue, on ne réordonne pas.
  lunarBall: LUNAR_BALL,
  lunarRock1: LUNAR_ROCK1,
  lunarRock2: LUNAR_ROCK2,
  lunarRock3: LUNAR_ROCK3,
  iconLunar: ICON_LUNAR,
  // Comète — le corps et l'**entourage** du même dessin, coupés l'un de
  // l'autre : `cometCore` est la sphère, `cometRing` est tout ce qui tourne
  // autour et qui lui sert d'arme. Les deux sont servis par de vrais PNG.
  cometCore: COMET_CORE,
  cometRing: COMET_RING,
  // …et l'éclat qu'elle en détache (Fragmentation), pris dans une composante
  // détachée de la même maquette.
  cometShard: COMET_SHARD,
  iconComet: ICON_COMET,
});
