/**
 * ============================================================================
 *  BANC DE SONS — chaque bruitage décrit comme une recette, pas un fichier
 * ============================================================================
 *
 *  **Aucun fichier audio dans le dépôt.** Le cahier des charges dit « aucune
 *  dépendance, aucun build » et le dépôt n'a jamais porté de binaire, à une
 *  exception documentée près (les PNG d'`assets/sprites`). Un banc de bruitages
 *  en WAV ou en MP3 aurait pesé quelques mégaoctets, se serait chargé en
 *  asynchrone — donc aurait pu manquer à la première touche — et n'aurait pas
 *  pu se transposer par combattant.
 *
 *  Tout est donc **synthétisé** par `render/audio.js` : oscillateurs, bruit
 *  blanc filtré, enveloppes. Ce fichier ne contient que les **recettes**, comme
 *  `pixelart/` ne contient que des cartes de pixels et `fighters/` que des
 *  valeurs. Il ne connaît ni l'`AudioContext`, ni le navigateur.
 *
 *  **Une recette = une liste de couches.** Un bruitage crédible est presque
 *  toujours deux choses superposées : un *corps* (un oscillateur qui donne la
 *  hauteur) et un *transitoire* (du bruit filtré qui donne la matière). Une
 *  couche seule sonne comme un test de tonalité ; c'est la superposition qui
 *  fait entendre un métal, une pierre ou une détonation.
 *
 *  Champs d'une couche — tous facultatifs sauf `dur` :
 *
 *  | Clé | Rôle |
 *  | --- | --- |
 *  | `wave` | `sine`, `square`, `sawtooth`, `triangle`, ou `noise` (bruit blanc) |
 *  | `f0` / `f1` | fréquence de départ et d'arrivée (glissando exponentiel) |
 *  | `dur` | durée de la couche, en secondes |
 *  | `gain` | volume relatif dans la recette (0 à 1) |
 *  | `delay` | retard au démarrage, pour empiler les couches d'un arpège |
 *  | `attack` | montée, en secondes (0,003 par défaut : une attaque sèche) |
 *  | `filter` | `lowpass`, `highpass` ou `bandpass` — n'a de sens que sur `noise` |
 *  | `cut0` / `cut1` | coupure du filtre, début → fin (balayage exponentiel) |
 *  | `q` | résonance du filtre |
 *
 *  **Ce qui décide de la hauteur, c'est la fiche.** Chaque combattant porte un
 *  bloc `sound` qui nomme ses recettes et sa transposition (`pitch`), de la
 *  même façon qu'il nomme ses sprites et ses couleurs : le moteur ne connaît
 *  toujours aucun combattant (invariant 12), il lit. Le Golem sonne une octave
 *  plus bas que le Shinobi sans une ligne de code propre à lui.
 *
 * @module data/sound
 */

import { deepFreeze } from './freeze.js';

/**
 * Réglages communs à tout le mixage.
 *
 * `master` est bas (0,32) et suivi d'un compresseur : un duel empile
 * facilement six ou sept voix — deux billes qui rebondissent, une rafale, une
 * brûlure, un ultime — et sans réduction la somme sature en un craquement.
 */
export const MIX = deepFreeze({
  /** Volume général avant compression. */
  master: 0.32,
  /**
   * **Le même bruitage ne se rejoue pas plus vite que ça**, en secondes.
   *
   * La cadence de simulation est de 120 Hz : une balle qui touche pendant six
   * pas de suite déclencherait six détonations en 50 ms, ce qui ne s'entend pas
   * comme six coups mais comme un seul, saturé. C'est le même garde-fou que le
   * `meleeCd` du moteur, appliqué à l'oreille.
   */
  repeatGap: 0.045,
  /**
   * Voix simultanées. Au-delà, un son est simplement abandonné : mieux vaut
   * perdre le huitième impact d'une mêlée que faire tousser le mixage.
   *
   * **14 → 20, et c'est une mesure, pas un confort.** Une voix est une
   * *couche*, pas un bruitage : enrichir une recette la fait peser plus lourd
   * sur ce plafond, et le prix se paie sur **les autres sons**, pas sur elle.
   * Donner son propre jeu au Pistolero (`gunshot` passé de 2 à 4 couches,
   * `cylinder` et `knell` à 5) a fait passer les sons perdus de **0 % à 2,3 %**
   * sur quinze duels — rechargements et impacts compris. Le banc, en rejouant
   * l'algorithme de `play()` sur l'horloge du duel :
   *
   * | plafond | 14 | 16 | 18 | 20 | 24 |
   * | --- | --- | --- | --- | --- | --- |
   * | sons perdus | 2,3 % | 1,4 % | 0,5 % | **0,4 %** | 0 % |
   *
   * 20 est le coude : ce qui saute encore n'est plus que `thud`, le rebond de
   * mur — le son le plus fréquent du jeu et le moins porteur de sens. Aller à
   * 24 ne rachèterait que lui.
   *
   * **À remesurer à chaque combattant qu'on sonorise** : six jeux propres
   * empileront six fois cette pression, et rien ne criera — un son perdu ne
   * plante pas, il manque.
   */
  maxVoices: 20,
  /**
   * Largeur du panoramique. À 1, un combattant collé au mur gauche serait
   * **entièrement** dans l'oreille gauche, ce qui est fatigant au casque et
   * faux à l'écran — l'arène ne fait qu'un tiers de la largeur de la scène.
   */
  panWidth: 0.65,
  /**
   * **Constante de lissage des voix tenues**, en secondes.
   *
   * Une voix tenue reçoit une consigne neuve à chaque pas de simulation
   * (120 Hz) : écrire le gain et la coupure directement ferait entendre un
   * *escalier* — c'est le « zipper noise » classique, et il est d'autant plus
   * audible que le paramètre bouge vite, donc précisément pendant la montée en
   * régime du Ronin, le moment qu'on cherche à rendre.
   *
   * `setTargetAtTime` glisse vers la consigne avec cette constante de temps.
   * 0,05 s est le compromis relevé à l'oreille : en dessous, l'escalier
   * revient sur l'effondrement de surchauffe (−3,0 tour/s, la variation la
   * plus raide du jeu) ; au-dessus, la lame « traîne » derrière son ruban à
   * l'image, et le son cesse de dire la même chose que l'écran.
   */
  swingGlide: 0.05,
  /** Voix de l'annonceur : débit et hauteur (1 = réglage du navigateur). */
  voice: { rate: 1.02, pitch: 0.85, volume: 1 },
});

/**
 * Les recettes. Les clés sont des **noms de matière**, pas des noms de
 * combattants : `crunch` est le fracas d'une pierre, et c'est la fiche du Golem
 * qui décide que c'est son corps à corps. Deux combattants peuvent partager une
 * recette et la jouer à des hauteurs différentes.
 */
export const SOUNDS = deepFreeze({
  /* ---------------------------------------------------------------- */
  /*  Tirs et lancers                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * Détonation : un claquement de bruit large, un corps grave très court.
   *
   * **Gain relevé, demandé** — une vidéo de référence (le duel Outlaw vs
   * Bladesman d'origine) montre des impacts nettement plus francs que le banc
   * ne les rendait : crête proche de la saturation (0,7 à 1,0 en amplitude
   * normalisée sur l'audio de la vidéo), et une énergie qui déborde largement
   * dans le médium-aigu plutôt que de rester grave. Le compresseur de
   * `render/audio.js` (seuil −18 dB, ratio 8:1) absorbe la crête : monter le
   * gain d'une couche la pousse dans le compresseur, ce qui *est* le son
   * « punchy, à la limite de la saturation » de la référence — ce n'est pas
   * un défaut à corriger, c'est le levier à tirer.
   */
  gunshot: [
    /**
     * **Le claquement, et c'est lui qu'on reconnaît.** Moins de 50 ms, très
     * haut, attaque à 1 ms : un coup de feu s'identifie à son transitoire, pas
     * à son grave. Sans cette couche la recette sonnait « souffle », pas
     * « détonation ».
     */
    { wave: 'noise', filter: 'highpass', cut0: 3200, cut1: 1100, q: 0.7, dur: 0.045, gain: 0.9, attack: 0.001 },
    /** Le souffle de la charge, plus grave et plus long que le claquement. */
    { wave: 'noise', filter: 'lowpass', cut0: 5200, cut1: 420, q: 1, dur: 0.17, gain: 0.78 },
    /** Le corps : c'est cette couche qui donne le **calibre**. */
    { wave: 'square', f0: 240, f1: 60, dur: 0.09, gain: 0.5 },
    /**
     * **La queue, en retard sur le claquement** : le renvoi de la rue déserte.
     * Le `delay` de 55 ms est ce qui la fait entendre comme un *écho* et non
     * comme une deuxième couche du même coup — en dessous de ~40 ms l'oreille
     * les fond en un seul événement.
     */
    { wave: 'noise', filter: 'bandpass', cut0: 1300, cut1: 520, q: 2.2, dur: 0.33, gain: 0.17, delay: 0.055, attack: 0.02 },
  ],
  /**
   * **Le barillet qu'on réarme** : trois crans, la roue qui tourne, le verrou.
   *
   * Le rechargement dure 0,7 s sur la fiche du Pistolero et le pistolet vrille
   * pendant tout ce temps ; un clic unique ne remplissait pas ce geste — il
   * empruntait même littéralement `click`, le son de l'interface. Les trois
   * crans à 85 ms d'intervalle donnent la **mécanique**, le souffle passe-bande
   * la roue, et le dernier transitoire le moment où ça se referme.
   */
  cylinder: [
    { wave: 'noise', filter: 'bandpass', cut0: 2600, cut1: 4300, q: 3.4, dur: 0.26, gain: 0.13, attack: 0.05 },
    { wave: 'square', f0: 1500, f1: 1150, dur: 0.02, gain: 0.2 },
    { wave: 'square', f0: 1660, f1: 1250, dur: 0.02, gain: 0.2, delay: 0.085 },
    { wave: 'square', f0: 1840, f1: 1360, dur: 0.02, gain: 0.2, delay: 0.17 },
    { wave: 'noise', filter: 'highpass', cut0: 1900, cut1: 3400, q: 1, dur: 0.05, gain: 0.34, delay: 0.255 },
  ],
  /** Lame ou shuriken qui fend l'air : du bruit passe-bande qui descend. */
  whoosh: [
    { wave: 'noise', filter: 'bandpass', cut0: 1700, cut1: 420, q: 1.4, dur: 0.24, gain: 0.4, attack: 0.03 },
  ],
  /** Projectile magique : une montée claire, sans transitoire — rien ne frappe. */
  orb: [
    { wave: 'sine', f0: 620, f1: 1180, dur: 0.18, gain: 0.3, attack: 0.02 },
    { wave: 'triangle', f0: 310, f1: 590, dur: 0.18, gain: 0.16, attack: 0.02 },
  ],
  /** Caillou jeté : sec, aigu, sans queue. */
  pebble: [
    { wave: 'noise', filter: 'highpass', cut0: 900, cut1: 2600, q: 0.8, dur: 0.09, gain: 0.3 },
    { wave: 'square', f0: 420, f1: 190, dur: 0.07, gain: 0.18 },
  ],

  /* ---------------------------------------------------------------- */
  /*  Touches                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Tranchant : un sifflement métallique bref sur un corps médium.
   *
   * **Gain relevé et bande élargie, demandé** — même geste que `gunshot`
   * ci-dessus : la vidéo de référence rend ses touches plus fortes et plus
   * larges en spectre (moins « sifflement fin », plus « claquement large »).
   * `q` baissé (2,2 → 1,5) élargit le bandpass au lieu de le resserrer.
   */
  blade: [
    { wave: 'noise', filter: 'bandpass', cut0: 4200, cut1: 1100, q: 1.5, dur: 0.13, gain: 0.6 },
    { wave: 'triangle', f0: 700, f1: 220, dur: 0.11, gain: 0.34 },
  ],
  /**
   * Pointe : plus étroit et plus haut que `blade`, il pique au lieu de
   * trancher. **Gain relevé et bande élargie, demandé** — même geste que
   * `blade`.
   */
  pierce: [
    { wave: 'noise', filter: 'bandpass', cut0: 5200, cut1: 2200, q: 2.5, dur: 0.1, gain: 0.48 },
    { wave: 'square', f0: 900, f1: 380, dur: 0.08, gain: 0.24 },
  ],
  /**
   * Pierre contre pierre : grave, mat, avec une queue de gravats. **Gain
   * relevé, demandé** — même geste que `blade`.
   */
  crunch: [
    { wave: 'noise', filter: 'lowpass', cut0: 1100, cut1: 160, q: 1.1, dur: 0.28, gain: 0.68 },
    { wave: 'square', f0: 110, f1: 48, dur: 0.16, gain: 0.4 },
  ],
  /**
   * Impact de projectile : plus petit qu'une touche d'arme, il ne doit pas la
   * couvrir — ce rapport-là est gardé. **Gain relevé, demandé** — même geste
   * que `blade`, à l'échelle du projectile.
   */
  impact: [
    { wave: 'noise', filter: 'lowpass', cut0: 2600, cut1: 500, q: 1, dur: 0.11, gain: 0.46 },
    { wave: 'sine', f0: 320, f1: 120, dur: 0.1, gain: 0.28 },
  ],
  /**
   * **Coup de crosse** : le Peacemaker frappe avec sa masse, pas avec un fil.
   *
   * Là où `blade` siffle haut (bandpass à 4200 Hz, c'est une lame qui tranche),
   * celui-ci est **mat et médium** : la même famille de recette, une octave et
   * demie plus bas, sans queue métallique. C'est ce qui sépare à l'oreille un
   * duelliste d'un homme qui cogne avec son arme.
   */
  pistolwhip: [
    { wave: 'noise', filter: 'bandpass', cut0: 1900, cut1: 480, q: 1.2, dur: 0.1, gain: 0.5 },
    { wave: 'square', f0: 300, f1: 110, dur: 0.08, gain: 0.32 },
  ],
  /**
   * **La balle gelante qui mord** : un impact qui *prend* au lieu de retomber.
   *
   * La seule recette du banc dont la couche de corps **monte** (1760 → 2640 Hz)
   * : partout ailleurs un impact descend, parce qu'un choc perd son énergie.
   * Ici le gel continue après la balle — c'est exactement ce que fait la fiche
   * (`onHit.slow`, −30 % de vitesse pendant 1,6 s), et l'oreille doit
   * l'entendre continuer.
   */
  frostbite: [
    { wave: 'noise', filter: 'highpass', cut0: 2800, cut1: 6400, q: 0.8, dur: 0.09, gain: 0.34 },
    { wave: 'triangle', f0: 1760, f1: 2640, dur: 0.12, gain: 0.2, attack: 0.006 },
    { wave: 'sine', f0: 300, f1: 120, dur: 0.09, gain: 0.22 },
  ],
  /**
   * **Fil de rasoir** : ce que `blade` serait s'il n'avait ni masse ni queue.
   *
   * Le Shinobi empruntait `blade`, la lame du Ronin — deux combattants qui
   * frappent du même bruit ne se distinguent qu'à l'image. Or sa « lame » est
   * un **shuriken** : une plaque de 75 px de rayon lancée à plat, qui entaille
   * au passage au lieu de trancher en appuyant. D'où la bande deux fois plus
   * haute (6200 contre 4200 Hz), plus **étroite** (`q` 3,2 contre 1,5) et deux
   * fois plus courte : ça pince, ça ne fend pas.
   */
  razor: [
    { wave: 'noise', filter: 'bandpass', cut0: 6200, cut1: 2600, q: 3.2, dur: 0.09, gain: 0.5 },
    { wave: 'triangle', f0: 1200, f1: 520, dur: 0.07, gain: 0.22 },
  ],
  /**
   * **Le bois qui cogne**, et c'est l'exact opposé de `razor`.
   *
   * Le Druide empruntait `blade` lui aussi, alors que son arme est un **Bâton
   * de ronce** — du bois plein, sans tranchant. Un passe-bas qui s'effondre
   * (1800 → 400 Hz) donne le mat ; le corps grave donne la masse ; l'éclat
   * passe-haut final est l'écharde, la seule chose aiguë d'un choc de bois.
   */
  bough: [
    { wave: 'noise', filter: 'lowpass', cut0: 1800, cut1: 400, q: 1.2, dur: 0.14, gain: 0.5 },
    { wave: 'square', f0: 220, f1: 90, dur: 0.1, gain: 0.3 },
    { wave: 'noise', filter: 'highpass', cut0: 2400, cut1: 1200, q: 1, dur: 0.05, gain: 0.2 },
  ],
  /**
   * **Le rayon qui marque au lieu de trancher.**
   *
   * Les cinq recettes de touche du banc sont des **chocs** : quelque chose de
   * dur rencontre quelque chose de dur, et le corps de la recette *descend*
   * parce qu'un choc perd son énergie. Un rayon de soleil ne cogne pas, il
   * **brûle** — d'où le grésillement passe-bande qui tient six fois plus
   * longtemps qu'un `pierce`, et l'éclair passe-haut qui l'ouvre : ce qu'on
   * entend d'une brûlure, c'est l'instant où ça prend, pas l'impact.
   */
  scorch: [
    { wave: 'noise', filter: 'highpass', cut0: 5000, cut1: 2000, q: 0.8, dur: 0.06, gain: 0.25, attack: 0.001 },
    { wave: 'noise', filter: 'bandpass', cut0: 3000, cut1: 900, q: 1.2, dur: 0.16, gain: 0.55 },
    { wave: 'sine', f0: 420, f1: 150, dur: 0.1, gain: 0.3 },
  ],
  /**
   * **Un corps lancé qui percute** — le choc cinétique de la Comète.
   *
   * Ni `crunch` (la pierre qui éclate), ni `pierce` (la pointe qui entre), ni
   * `bump` (deux billes qui se touchent) : ici **rien ne tranche et rien ne se
   * brise**, c'est une masse à pleine vitesse qui s'arrête d'un coup. Ce qu'on
   * entend d'un tel choc, c'est un **transitoire large suivi d'un corps grave
   * très court** — le contraire d'une résonance, qui supposerait un objet qui
   * vibre encore après.
   *
   * Le passe-haut de 35 ms est ce qui dit la **vitesse** : sans lui, les deux
   * couches basses sonnaient comme un `thud` de mur, c'est-à-dire comme un
   * corps qui *arrive*, pas comme un corps qui *arrive vite*.
   */
  slam: [
    { wave: 'noise', filter: 'highpass', cut0: 2600, cut1: 1400, q: 0.8, dur: 0.035, gain: 0.42, attack: 0.001 },
    { wave: 'noise', filter: 'lowpass', cut0: 2400, cut1: 260, q: 0.9, dur: 0.13, gain: 0.6 },
    { wave: 'sine', f0: 190, f1: 52, dur: 0.16, gain: 0.48 },
  ],
  /** Tic d'un dégât sur la durée (brûlure, givre) : presque un souffle. */
  ember: [
    { wave: 'noise', filter: 'bandpass', cut0: 1400, cut1: 700, q: 1.6, dur: 0.16, gain: 0.16, attack: 0.04 },
  ],

  /* ---------------------------------------------------------------- */
  /*  Le corps dans l'arène                                             */
  /* ---------------------------------------------------------------- */

  /** Rebond sur un mur : un tambour mat, sans hauteur nette. */
  thud: [
    { wave: 'sine', f0: 190, f1: 62, dur: 0.19, gain: 0.34 },
    { wave: 'noise', filter: 'lowpass', cut0: 900, cut1: 220, q: 1, dur: 0.1, gain: 0.18 },
  ],
  /** Deux billes qui se percutent : plus haut et plus court qu'un mur. */
  bump: [
    { wave: 'sine', f0: 380, f1: 140, dur: 0.12, gain: 0.26 },
  ],

  /* ---------------------------------------------------------------- */
  /*  Pouvoirs — matières                                               */
  /* ---------------------------------------------------------------- */

  /** Ruée, charge, glissade : un souffle qui monte puis retombe. */
  dash: [
    { wave: 'noise', filter: 'bandpass', cut0: 700, cut1: 2400, q: 1.1, dur: 0.3, gain: 0.34, attack: 0.06 },
    { wave: 'sawtooth', f0: 120, f1: 300, dur: 0.28, gain: 0.12, attack: 0.06 },
  ],
  /**
   * **Bourrasque** : la Tornade du Shinobi, qui jouait `whoosh` — exactement le
   * son de son propre lancer de shuriken. Deux gestes très différents (jeter
   * une plaque, appeler un vent) sonnaient donc pareil. Celui-ci **monte** là
   * où `whoosh` descend : un souffle qui se lève, pas un objet qui passe.
   */
  gust: [
    { wave: 'noise', filter: 'bandpass', cut0: 500, cut1: 2000, q: 1.8, dur: 0.35, gain: 0.3, attack: 0.05 },
    { wave: 'noise', filter: 'highpass', cut0: 1800, cut1: 4200, q: 0.8, dur: 0.3, gain: 0.12, attack: 0.06 },
  ],
  /**
   * **Givre** : le claquement de l'onde, puis la tenue vitreuse.
   *
   * La fiche du Pistolero décrit un Champ de givre qui part en **onde de 40 à
   * 900 px en 0,95 s** avant de se poser en disque : le son ne disait que le
   * disque. Les deux couches d'ouverture sont l'onde — un grave sec qui claque
   * au déclenchement, et un balayage passe-haut qui **s'ouvre** de 600 à
   * 7000 Hz, la traduction à l'oreille d'un anneau qui gagne le bord de
   * l'écran. Les deux couches d'origine, elles, ne bougent pas : c'est le
   * champ lui-même, et il était juste.
   */
  frost: [
    { wave: 'sine', f0: 180, f1: 58, dur: 0.3, gain: 0.34 },
    { wave: 'noise', filter: 'highpass', cut0: 600, cut1: 7000, q: 0.8, dur: 0.55, gain: 0.34, attack: 0.012 },
    { wave: 'sine', f0: 2600, f1: 1500, dur: 0.5, gain: 0.16, attack: 0.05 },
    { wave: 'noise', filter: 'highpass', cut0: 2400, cut1: 5200, q: 0.7, dur: 0.5, gain: 0.14, attack: 0.08 },
  ],
  /** Braise : un souffle grave et lent, l'inverse exact du givre. */
  fire: [
    { wave: 'noise', filter: 'lowpass', cut0: 1500, cut1: 380, q: 1, dur: 0.55, gain: 0.3, attack: 0.09 },
  ],
  /**
   * **La chaleur qui enfle** — Réchauffement solaire.
   *
   * Même famille que `fire`, la braise du Ronin, et **l'inverse dans le
   * sens** : `fire` referme son passe-bas (1500 → 380 Hz), celui-ci l'ouvre
   * (400 → 2600). Une braise se consume, un astre monte en température. C'est
   * ce seul renversement qui les sépare à l'oreille, alors que les deux sont du
   * feu — et c'est la démonstration que le banc doit se lire en **gestes**, pas
   * en matières : deux souffles de feu ne sont pas le même son si l'un s'éteint
   * et l'autre grandit.
   */
  blaze: [
    { wave: 'noise', filter: 'lowpass', cut0: 400, cut1: 2600, q: 1, dur: 0.7, gain: 0.34, attack: 0.14 },
    { wave: 'sine', f0: 90, f1: 220, dur: 0.65, gain: 0.22, attack: 0.12 },
    { wave: 'noise', filter: 'bandpass', cut0: 1200, cut1: 3000, q: 2, dur: 0.5, gain: 0.14, attack: 0.18, delay: 0.1 },
  ],
  /**
   * **L'astre qui aspire, puis lâche** — Rayon solaire.
   *
   * La seule recette du banc **calée sur la durée d'un pouvoir** : elle est
   * jouée au déclenchement, et le tir ne part qu'après `ultimate.windup`.
   * Les trois premières couches tiennent exactement cette annonce — scie qui
   * monte, air aspiré, sub immobile — et la quatrième, en retard de `windup`
   * moins un souffle, **est** le départ du faisceau.
   *
   * **`windup` a été porté de 1,1 s à 2 s ; ces durées ont suivi**, et c'est
   * la démonstration que ce couplage est réel : laissées à 1,1 s, les trois
   * premières couches se seraient éteintes **presque une seconde avant** que
   * le rayon ne parte, et le `delay` de 1,05 aurait sonné le départ en plein
   * milieu de la charge. Rien n'aurait planté, rien ne se serait vu — le son
   * aurait simplement cessé de dire ce que fait l'image. C'est le seul endroit
   * du dépôt où une recette et une valeur de fiche sont accordées à la
   * milliseconde, et il est écrit des deux côtés pour cette raison.
   */
  flare: [
    { wave: 'sawtooth', f0: 120, f1: 900, dur: 2, gain: 0.24, attack: 0.1 },
    { wave: 'noise', filter: 'bandpass', cut0: 300, cut1: 5200, q: 1.6, dur: 2.05, gain: 0.26, attack: 0.12 },
    { wave: 'sine', f0: 60, f1: 58, dur: 2.1, gain: 0.2, attack: 0.2 },
    /** Le départ du faisceau. `dur` 0,9 et non 0,5 : le tir dure maintenant
     *  2,5 s, une queue trop courte le faisait sonner comme un claquement isolé
     *  au milieu d'un rayon qui, lui, continuait. */
    { wave: 'triangle', f0: 1320, f1: 2640, dur: 0.9, gain: 0.12, delay: 1.95, attack: 0.03 },
  ],
  /** Foudre : une décharge qui s'écrase en un cinquième de seconde. */
  zap: [
    { wave: 'square', f0: 2100, f1: 260, dur: 0.13, gain: 0.3 },
    { wave: 'noise', filter: 'highpass', cut0: 3000, cut1: 900, q: 1, dur: 0.22, gain: 0.28 },
  ],
  /** Nappe entretenue (dôme, champ) : un bourdon doux, il ne doit pas fatiguer. */
  hum: [
    { wave: 'sine', f0: 160, f1: 150, dur: 0.7, gain: 0.2, attack: 0.12 },
    { wave: 'triangle', f0: 320, f1: 300, dur: 0.7, gain: 0.1, attack: 0.12 },
  ],
  /** Végétal : deux notes courtes qui poussent l'une sur l'autre. */
  bloom: [
    { wave: 'triangle', f0: 330, f1: 520, dur: 0.22, gain: 0.24, attack: 0.03 },
    { wave: 'sine', f0: 660, f1: 990, dur: 0.26, gain: 0.16, delay: 0.08, attack: 0.03 },
  ],
  /** Invocation : deux quintes qui montent, franches, on doit entendre « quelqu'un arrive ». */
  summon: [
    { wave: 'square', f0: 180, f1: 270, dur: 0.16, gain: 0.2, attack: 0.02 },
    { wave: 'square', f0: 270, f1: 405, dur: 0.24, gain: 0.2, delay: 0.1, attack: 0.02 },
  ],
  /**
   * **Onde sismique** : le séisme du Golem à l'échelle de son horloge courante.
   *
   * Elle jouait `thud` — c'est-à-dire **le son de ses propres rebonds sur le
   * mur**. Le pouvoir le plus régulier du Golem était donc indiscernable d'un
   * accident de trajectoire, et son commentaire de fiche assumait la
   * confusion (« le même tambour que ses rebonds, en plus gros »). `tremor`
   * est la même matière que `quake` — sinus grave, gravats passe-bas — mais
   * deux fois plus court et une octave plus haut : on entend que c'est la
   * *même* chose que son ultime, en plus petit. C'est ce rapport-là qui rend
   * le Séisme lisible quand il arrive.
   */
  tremor: [
    { wave: 'sine', f0: 90, f1: 38, dur: 0.5, gain: 0.42, attack: 0.02 },
    { wave: 'noise', filter: 'lowpass', cut0: 600, cut1: 140, q: 1, dur: 0.45, gain: 0.28, attack: 0.02 },
    { wave: 'square', f0: 60, f1: 30, dur: 0.22, gain: 0.16 },
  ],
  /** Séisme : le seul son vraiment long du banc, et le seul sous les 40 Hz. */
  quake: [
    { wave: 'sine', f0: 62, f1: 28, dur: 1.1, gain: 0.5, attack: 0.05 },
    { wave: 'noise', filter: 'lowpass', cut0: 320, cut1: 90, q: 1, dur: 0.9, gain: 0.3, attack: 0.05 },
  ],
  /** Soin : la seule recette qui **monte** en gardant sa douceur. */
  heal: [
    { wave: 'sine', f0: 660, f1: 990, dur: 0.32, gain: 0.2, attack: 0.05 },
  ],
  /**
   * **Tourbillon d'acier** — RUÉE DE LAME.
   *
   * Les quatre recettes qui suivent remplacent `riser`, un balayage large qui
   * a servi d'ultime à **quatre combattants sur sept** : il disait « quelque
   * chose arrive » sans jamais dire *quoi*, et quatre ultimes qui sonnent
   * pareil ne s'annoncent pas, ils se confondent. `riser` a donc été retiré du
   * banc plutôt que laissé en repli — une recette que plus personne ne joue
   * est du poids mort, et `tools/sound-check.mjs` la signale.
   *
   * Celle-ci est la seule des quatre dont **tout monte ensemble** — bande,
   * scie et timbre : la RUÉE DE LAME est une accélération, la lame passe de
   * son plancher à son plafond. L'anneau d'acier en retard de 100 ms est la
   * roue de flamme qui se referme.
   */
  whirl: [
    { wave: 'noise', filter: 'bandpass', cut0: 500, cut1: 4200, q: 2.2, dur: 0.6, gain: 0.3, attack: 0.05 },
    { wave: 'sawtooth', f0: 150, f1: 900, dur: 0.55, gain: 0.18, attack: 0.04 },
    { wave: 'triangle', f0: 880, f1: 1760, dur: 0.3, gain: 0.14, delay: 0.1, attack: 0.02 },
  ],
  /**
   * **Le décollage** — FOUDRE TOMBANTE.
   *
   * L'Hoplite est le seul du roster à **quitter l'arène** (`offstage`), et son
   * ultime a donc deux instants distincts, déjà servis par deux créneaux
   * (`ultimate` au départ, `strike` à l'arrivée). Ce qu'il manquait au départ,
   * c'est l'**appui** : la couche grave sans retard est la poussée sur le sol,
   * les deux suivantes sont le corps qui s'éloigne. Un balayage seul faisait
   * décoller quelque chose qui n'avait jamais touché terre.
   */
  vault: [
    { wave: 'square', f0: 90, f1: 200, dur: 0.12, gain: 0.22 },
    { wave: 'noise', filter: 'bandpass', cut0: 400, cut1: 3000, q: 1.4, dur: 0.45, gain: 0.3, attack: 0.04 },
    { wave: 'sine', f0: 120, f1: 620, dur: 0.4, gain: 0.2, attack: 0.03 },
  ],
  /**
   * **La tornade** — TORNADE DE SHURIKENS.
   *
   * La plus longue des quatre (0,75 s) et la seule sans couche grave : une
   * tornade n'a pas de fond, elle a une **enveloppe**. Le passe-haut en retard
   * de 80 ms est le métal qui entre dans le vent — c'est ce qui la sépare
   * d'une simple bourrasque (`gust`, son pouvoir de Tornade), dont elle est
   * sinon la grande sœur.
   */
  cyclone: [
    { wave: 'noise', filter: 'bandpass', cut0: 700, cut1: 3400, q: 2.6, dur: 0.75, gain: 0.28, attack: 0.08 },
    { wave: 'noise', filter: 'highpass', cut0: 2000, cut1: 6000, q: 0.8, dur: 0.6, gain: 0.14, attack: 0.1, delay: 0.08 },
    { wave: 'triangle', f0: 440, f1: 1320, dur: 0.5, gain: 0.12, attack: 0.06 },
  ],
  /**
   * **Les ronces qui poussent** — ORAGE DE RONCES.
   *
   * La seule des quatre qui ne balaie pas vers l'aigu d'un trait : le
   * bandpass monte (ça pousse) mais l'éclat passe-haut, lui, **descend** —
   * c'est le bois qui craque, et il craque en retombant. Même parenté avec
   * `bloom`, son pouvoir végétal, que `cyclone` avec `gust` : l'ultime est la
   * version large de ce que le combattant fait déjà en petit.
   */
  thorns: [
    { wave: 'noise', filter: 'bandpass', cut0: 600, cut1: 2200, q: 3, dur: 0.5, gain: 0.24, attack: 0.06 },
    { wave: 'triangle', f0: 220, f1: 440, dur: 0.45, gain: 0.2, attack: 0.04 },
    { wave: 'noise', filter: 'highpass', cut0: 3400, cut1: 1200, q: 1, dur: 0.22, gain: 0.16, delay: 0.1 },
  ],
  /**
   * **Les Météores** — trois cailloux qui s'arrachent d'une orbite et sifflent
   * en tombant. Tout y **descend**, ce qui est le point : la recette qu'elle
   * portait avant (`swell`, une houle qui enfle) disait une Marée qui attire, et
   * elle a été supprimée avec le pouvoir — *une recette meurt quand le créneau
   * qui la nommait cesse d'être joué*, et `sound-check` le dit.
   *
   * Trois couches, du haut vers le bas : le sifflement bande-étroite qui balaie
   * de 2600 à 420 Hz (la chute), une dent de scie qui le double une octave plus
   * bas (la masse), et un coup de grave qui arrive sous les deux. Elle sonne au
   * **tir**, pas à l'arrivée : le fracas du sol est le créneau `impact`.
   */
  hail: [
    { wave: 'noise', filter: 'bandpass', cut0: 2600, cut1: 420, q: 3.2, dur: 0.75, gain: 0.22, attack: 0.03 },
    { wave: 'sawtooth', f0: 300, f1: 96, dur: 0.7, gain: 0.16, attack: 0.02 },
    { wave: 'sine', f0: 140, f1: 58, dur: 0.55, gain: 0.18, attack: 0.01 },
  ],
  /**
   * **L'Éclipse** — une chute, pas une montée : un balayage descendant, un coup
   * de grave, et un sifflement qui s'éteint. L'inverse exact de `flare`, qui
   * passe deux secondes à se charger avant que le faisceau ne parte.
   *
   * Elle accompagnait un ultime **sans annonce** et devait donc tout dire en
   * arrivant. L'Éclipse s'annonce désormais pendant 0,9 s — la recette n'a pas
   * bougé pour autant, et c'est voulu : c'est *elle* qui ouvre l'annonce, et une
   * chute de 0,9 s de long tombe exactement sur la nuit qui s'installe.
   */
  umbra: [
    { wave: 'sawtooth', f0: 420, f1: 60, dur: 0.7, gain: 0.26, attack: 0.005 },
    { wave: 'sine', f0: 90, f1: 42, dur: 0.9, gain: 0.28, attack: 0.02 },
    { wave: 'noise', filter: 'bandpass', cut0: 4200, cut1: 500, q: 2.2, dur: 0.75, gain: 0.18, attack: 0.01 },
  ],
  /**
   * **Le glas** : une cloche, son octave grave, et la rue qui se vide derrière.
   *
   * **La première du banc à avoir quitté `riser`**, et le patron des quatre
   * ci-dessus : un ultime doit dire *quoi* arrive, pas seulement que quelque
   * chose arrive. MAIN DU MORT est un duel à midi — ce qui l'ouvre
   * n'est pas une montée de synthé mais **une cloche qu'on frappe**, avec ce
   * qui va avec : le battant sur le bronze (le transitoire passe-bande), puis
   * la tension et le vent, tous deux **en retard de 120 ms** pour que la cloche
   * arrive seule et se fasse entendre avant d'être accompagnée.
   *
   * Ré♯ grave et son octave (311 / 622 Hz) : deux couches accordées à l'octave
   * sonnent comme *une* cloche, deux couches accordées autrement sonnent comme
   * deux notes — c'est la même raison qui fait que `play()` transpose toutes
   * les couches d'un coup par le même facteur.
   */
  knell: [
    { wave: 'triangle', f0: 622, f1: 616, dur: 1.05, gain: 0.3, attack: 0.004 },
    { wave: 'sine', f0: 311, f1: 308, dur: 1.2, gain: 0.28, attack: 0.004 },
    { wave: 'noise', filter: 'bandpass', cut0: 3000, cut1: 1100, q: 2.4, dur: 0.3, gain: 0.2 },
    { wave: 'sawtooth', f0: 110, f1: 466, dur: 0.75, gain: 0.16, attack: 0.07, delay: 0.12 },
    { wave: 'noise', filter: 'bandpass', cut0: 500, cut1: 2600, q: 2, dur: 0.8, gain: 0.13, attack: 0.1, delay: 0.12 },
  ],

  /**
   * **Une relance d'élan** : rien ne frappe, quelque chose *prend de la
   * vitesse*.
   *
   * C'est l'inverse exact de `slam`, et les deux appartiennent au même
   * combattant : pas de transitoire du tout (`attack` de 80 ms, soit vingt fois
   * celle d'un coup), et des bornes qui **montent** au lieu de descendre. Une
   * recette dont les `cut0`/`cut1` montent s'entend comme une accélération ;
   * c'est la même bande qu'un `whoosh` prise à l'envers.
   */
  surge: [
    { wave: 'noise', filter: 'bandpass', cut0: 400, cut1: 3200, q: 1.5, dur: 0.34, gain: 0.34, attack: 0.08 },
    { wave: 'triangle', f0: 180, f1: 720, dur: 0.32, gain: 0.18, attack: 0.06 },
  ],
  /**
   * **Ce qui se détache et part en morceaux** — la Fragmentation de la Comète.
   *
   * Trois temps, et c'est l'ordre qui raconte : le **craquement** de la ceinture
   * qui cède (transitoire sec et haut, 50 ms), les **morceaux qui s'éparpillent**
   * (une bande médium qui descend), et dessous un **corps** court — ce qui se
   * détache a une masse.
   *
   * Ni `crunch` (la pierre du Golem qui *écrase*) ni `pebble` (un caillou jeté,
   * sans queue) : ici rien ne frappe, quelque chose **lâche**. C'est aussi la
   * raison pour laquelle les huit éclats partent muets : `MIX.repeatGap`
   * fondrait huit `shot` identiques en un seul coup saturé, et la salve est
   * déjà annoncée d'un bloc par cette recette.
   */
  shatter: [
    { wave: 'noise', filter: 'highpass', cut0: 3800, cut1: 1600, q: 0.9, dur: 0.05, gain: 0.5, attack: 0.001 },
    { wave: 'noise', filter: 'bandpass', cut0: 2200, cut1: 600, q: 1.1, dur: 0.3, gain: 0.34, attack: 0.01 },
    { wave: 'triangle', f0: 260, f1: 90, dur: 0.14, gain: 0.26 },
  ],
  /**
   * **Le bang d'une rentrée atmosphérique** — l'ultime de la Comète.
   *
   * Un ultime doit dire *quoi* arrive (la leçon de `knell`). Ici ce n'est ni une
   * cloche, ni une nappe, ni une montée : c'est une **détonation qui s'ouvre**
   * et qui traîne, donc un passe-bas qui s'effondre sur presque une seconde,
   * une scie très grave dessous, et la déchirure passe-haut par-dessus.
   *
   * La déchirure est plus **courte** que le corps (0,25 s contre 0,7) : un bang
   * se reconnaît à ce que son aigu meurt le premier, l'onde grave continuant
   * sans lui. L'égaliser aurait donné un grondement, c'est-à-dire un séisme —
   * or le Golem en a déjà un (`quake`).
   */
  boom: [
    { wave: 'noise', filter: 'highpass', cut0: 5200, cut1: 1800, q: 0.7, dur: 0.25, gain: 0.3, attack: 0.004 },
    { wave: 'noise', filter: 'lowpass', cut0: 900, cut1: 120, q: 0.8, dur: 0.7, gain: 0.58, attack: 0.01 },
    { wave: 'sawtooth', f0: 120, f1: 34, dur: 0.55, gain: 0.3 },
  ],

  /* ---------------------------------------------------------------- */
  /*  Ponctuation du duel                                               */
  /* ---------------------------------------------------------------- */

  /** Gong d'engagement, à la fin de l'attente d'avant-combat. */
  gong: [
    { wave: 'triangle', f0: 330, f1: 300, dur: 1.3, gain: 0.3, attack: 0.005 },
    { wave: 'sine', f0: 165, f1: 150, dur: 1.4, gain: 0.26, attack: 0.005 },
    { wave: 'noise', filter: 'bandpass', cut0: 2600, cut1: 900, q: 2, dur: 0.35, gain: 0.18 },
  ],
  /** K.O. : la plus grosse dépense du banc, et la seule qui vaille une seconde. */
  ko: [
    { wave: 'noise', filter: 'lowpass', cut0: 2600, cut1: 90, q: 1.2, dur: 0.95, gain: 0.6 },
    { wave: 'sine', f0: 150, f1: 34, dur: 0.85, gain: 0.45 },
    { wave: 'square', f0: 90, f1: 30, dur: 0.4, gain: 0.2 },
  ],
  /** Fanfare de victoire : un arpège majeur, une note toutes les 110 ms. */
  fanfare: [
    { wave: 'square', f0: 523, f1: 523, dur: 0.16, gain: 0.2, attack: 0.01 },
    { wave: 'square', f0: 659, f1: 659, dur: 0.16, gain: 0.2, delay: 0.11, attack: 0.01 },
    { wave: 'square', f0: 784, f1: 784, dur: 0.16, gain: 0.2, delay: 0.22, attack: 0.01 },
    { wave: 'square', f0: 1046, f1: 1046, dur: 0.5, gain: 0.24, delay: 0.33, attack: 0.01 },
    { wave: 'triangle', f0: 261, f1: 261, dur: 0.7, gain: 0.16, delay: 0.33, attack: 0.02 },
  ],
  /** Clic d'interface : les écrans DOM ne sont pas muets non plus. */
  click: [
    { wave: 'square', f0: 900, f1: 600, dur: 0.045, gain: 0.16 },
  ],
});

/**
 * ============================================================================
 *  SONS TENUS — la seule famille du banc qui n'ait pas de fin
 * ============================================================================
 *
 * Tout ce qui précède est un **événement** : quelque chose arrive, on le joue,
 * il s'éteint. Il manquait la famille inverse — un son qui **dure tant qu'un
 * état dure** et dont la matière suit ce que fait le combattant, image par
 * image.
 *
 * **Pourquoi elle manquait, et à qui.** Le Ronin porte `Damage = Spin` : toute
 * sa fiche tient dans la vitesse de sa lame, qui monte de 0,80 à 3,00 tour/s,
 * tient un palier, puis s'effondre en surchauffe et repart. Ce cycle est la
 * chose la plus importante du personnage, il est **visible** (le ruban de
 * pointe s'allonge) et il était **totalement muet** : son créneau `ability`
 * valait `null`, faute d'instant à sonoriser. C'est justement le point — il
 * n'y a pas d'instant, il y a une *continuité*, et un banc qui ne sait jouer
 * que des événements ne peut pas la dire.
 *
 * **Une couche tenue interpole entre deux états au lieu de décrire un geste.**
 * Là où une couche de `SOUNDS` porte `cut0`/`cut1` (début → fin *dans le
 * temps*), une couche d'ici porte les mêmes noms pour **repos → plein
 * régime** : c'est le `level` (0 à 1) passé image par image qui déplace le
 * curseur, et non l'horloge. Deux conséquences :
 *
 *  • `dur`, `delay` et `attack` n'ont aucun sens ici et n'y sont pas — une
 *    voix tenue n'a pas de durée, elle a un début et un arrêt ;
 *  • `gain0` est presque toujours 0 : à `level` nul, la voix doit être
 *    **inaudible sans être coupée**, sinon chaque passage par zéro
 *    s'entendrait comme un clic.
 *
 * C'est `render/audio.js` qui monte ces voix (`swing()`), et le `level` vient
 * de la **vitesse de rotation réellement mesurée** sur `weaponAngle` — pas de
 * `weapon.spin`, qui ne connaît que le plancher. Voir la note de `swing()`.
 */
export const LOOPS = deepFreeze({
  /**
   * **L'air fendu par une lame.** Bande étroite qui monte avec la vitesse : le
   * sifflement d'un objet plat qui tourne vite est une **résonance**, pas un
   * bruit large — c'est le `q` élevé qui fait la différence entre une lame et
   * un ventilateur.
   *
   * La seconde couche ne sort qu'en haut de course (`gain1` trois fois plus
   * bas) : c'est le grésillement de pointe, et il ne doit s'entendre que quand
   * le Ronin est au plafond. Sans elle, le palier de surchauffe sonnait
   * exactement comme le milieu de la montée.
   */
  swish: [
    { wave: 'noise', filter: 'bandpass', cut0: 300, cut1: 2600, q: 1.6, gain0: 0, gain1: 0.3 },
    { wave: 'noise', filter: 'highpass', cut0: 800, cut1: 5200, q: 0.7, gain0: 0, gain1: 0.12 },
  ],
  /**
   * **La pierre qui racle.** Le Golem tourne quatre fois moins vite que le
   * Ronin : `swish` transposé n'aurait donné qu'un sifflement grave, soit un
   * petit objet lourd, pas une masse. Un passe-bas et une scie sous 100 Hz
   * donnent le frottement — ce qu'on entend d'un bloc, c'est ce qu'il **traîne**.
   */
  grind: [
    { wave: 'noise', filter: 'lowpass', cut0: 180, cut1: 900, q: 1.2, gain0: 0, gain1: 0.26 },
    { wave: 'sawtooth', f0: 40, f1: 95, gain0: 0, gain1: 0.1 },
  ],
  /**
   * **Le ronflement d'une fournaise** — la couronne de huit rayons du Soleil.
   *
   * Ni `swish` (une lame fend l'air, bande étroite qui monte) ni `grind` (une
   * masse racle, passe-bas et scie) : ce qui tourne ici, ce n'est pas un objet,
   * c'est de la **combustion**. D'où un passe-bas très grave qui porte le
   * ronflement, et une bande médium étroite (`q` 2,4) qui donne le battement —
   * huit rayons qui passent, c'est un souffle **pulsé**, et c'est cette
   * résonance-là qui le suggère sans qu'on ait à moduler quoi que ce soit à la
   * fréquence de passage.
   */
  furnace: [
    { wave: 'noise', filter: 'lowpass', cut0: 120, cut1: 700, q: 1, gain0: 0, gain1: 0.28 },
    { wave: 'noise', filter: 'bandpass', cut0: 400, cut1: 1600, q: 2.4, gain0: 0, gain1: 0.14 },
  ],
});
