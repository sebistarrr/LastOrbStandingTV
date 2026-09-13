import { fiche } from '../defaults.js';
import { formatHalf } from '../format.js';

/* ==========================================================================
 *  BRETTEUR  (BLADESMAN)
 *  Relevé : même vidéo. Voir l'en-tête du Hors-la-loi pour la conversion
 *  ×1,25 et pour ce qui est reporté tel quel ou recalé.
 * ========================================================================== */
export const BLADESMAN = fiche({
  id: 'bladesman',
  name: 'RONIN',
  nameRef: 'RONIN',
  tagline: 'Duelliste — sa lame accélère jusqu’à la surchauffe, puis fond sur sa cible',
  taglineRef: 'Duellist — his blade winds up to overheat, then rushes his target',
  icon: 'iconSabre',

  look: {
    /** **Écart assumé au relevé.** L'or clair `#dcc462` (pipette vidéo,
     *  220,196,98) passe à un orange de braise — demandé avec la lame
     *  ardente qui remplace le sabre dentelé, voir `weapon` plus bas. */
    body: '#e8621b',
    bodyHit: '#e4e4e6', // mesuré : le disque touché blanchit une image entière
    outline: '#181008', // pipette : (24,13,7)
    /** **Écart assumé, demandé — deux passages.** D'abord posé sombre
     *  (`#2a0e05`) parce que le crème mesuré de la vidéo (`#F5F2EA`) se
     *  noyait sur l'orange clair du corps. Depuis que `overBody` (plus bas)
     *  fait passer la manche par-dessus la bille, c'est ce sombre qui se noie
     *  — noir sur les tons presque noirs de la manche. Le crème mesuré
     *  redevient donc le bon choix : la manche est sombre, pas le corps. */
    hpColor: '#f5f2ea',
    /** **Demandé.** Sans ce drapeau, le chiffre se pose **avant** l'arme
     *  (l'ordre par défaut) et la manche — par-dessus la bille depuis
     *  `overBody` — le recouvrirait entièrement au centre. Voir la note dans
     *  `fighter.js` (`draw()`) pour l'ordre exact que ce drapeau inverse. */
    hpOverWeapon: true,
    /** **Écart assumé au relevé, poussé plus loin — demandé.** L'aura passive
     *  était vert-jaune (172,226,22), puis rouge-orangé pour suivre la lame de
     *  braise ; elle reprend maintenant la teinte exacte de l'aura du Feu
     *  (`#f97316`) pour que le reskin « lame de braise » se lise comme des
     *  flammes plutôt que comme un simple filtre de couleur. */
    aura: { color: 'rgba(249,115,22,0.5)', radius: 1.7, pulse: 3, showWhen: 'ultimate-ready' },
    flair: {
      /** **Écart assumé, demandé.** L'éventail balayé par la lame était vert
       *  mesuré (frame 643 : (211,219,109) sur l'arène crème, `#B1C404` posé
       *  à 55 %) ; il reprend désormais la palette flamme du Feu (`#f97316`,
       *  `#fbbf24`, `#ffffff` — voir `abilities/fire.js`), cohérente avec
       *  l'aura, le sillage et l’Aura de braise greffée plus bas. */
      ribbon: { color: '#f97316', width: 26, alpha: 0.55 },
      motes: { rate: 7, size: 8, drift: 34, rise: -10, colors: ['#f97316', '#fbbf24', '#ffffff'] },
      impact: ['#fbbf24', '#ffffff', '#f97316'],
      shape: 'streak',
      castFlash: 'rgba(249,115,22,0.7)', // écart assumé : l'éventail virait au vert fluo sous BLADE RUSH, désormais à l'orange flamme
      /** **Cendres — écart assumé, demandé.** Poussière de braise le long de la
       *  lame, sur le même patron `powder` que le givre du Hors-la-loi et la
       *  foudre du Lancier (voir `render/flair.js`) : des grains isolés au lieu
       *  d'arcs continus, majoritairement gris cendre (`glow`), une minorité de
       *  braises qui rougeoient (`core`). `jitter: 30` dépasse la demi-épaisseur
       *  de la lame (35 × 1,448958 / 2 ≈ 25,4 après le passage ×1,3), sinon les
       *  grains restent dans la silhouette qui les recouvre. Purement décoratif
       *  (`render/flair.js`) : ne peut rien changer au duel. */
      weaponArc: {
        powder: true,
        count: 26,
        jitter: 30,
        size: 4.5,
        rate: 7,
        boost: 1.6,
        core: '#fbbf24',
        glow: '#3a332c',
        alpha: 0.8,
      },
      /** **Fuseau de cendre — écart assumé, demandé.** Le Bretteur n'avait
       *  aucun fuseau de vitesse (opt-in `smear`, absent jusqu'ici) ; il en
       *  gagne un, en cendre plutôt qu'en flamme franche, pour distinguer le
       *  panache qui suit le corps de la traînée de lame (`ribbon`, orange) et
       *  de la poussière d'arme (`weaponArc`, ci-dessus). Même patron `powder`
       *  que le fuseau de givre du Hors-la-loi. */
      smear: {
        color: '#3a332c',
        width: 30,
        alpha: 0.4,
        powder: {
          color: '#2b2620',
          core: '#f97316',
          haze: '#4a423a',
          hazeAlpha: 0.3,
          grains: 5,
          spread: 24,
          size: 5.6,
          rate: 6,
        },
      },
    },
    /** **Écart assumé, demandé.** Le sillage de vitesse était en or terne
     *  (220,196,98) ; il reprend la même teinte flamme que l'aura, cohérente
     *  avec `special.nova` plus bas. */
    trail: { color: 'rgba(249,115,22,0.32)', every: 0.035, life: 0.32 },
    accent: '#f97316',
  },

  /**
   * **Bruitages** (recettes dans `data/sound.js`). Un cran sous le Pistolero :
   * la lame est plus grave que le revolver, et c'est ce qui les sépare à
   * l'oreille quand les deux frappent dans la même seconde.
   *
   * **La Danse d'acier n'a pas de son de pouvoir, elle a une voix tenue.**
   * C'est un *passif* — la rotation qui monte toute seule — donc il n'y a
   * effectivement aucun instant à sonoriser, et `ability` reste `null`. Mais
   * en conclure que le pouvoir devait rester muet était une erreur : ce qui
   * manquait n'était pas un événement, c'était une **continuité**, et le banc
   * ne savait pas en jouer. Voir `swing` ci-dessous.
   */
  sound: {
    pitch: 0.92,
    shot: null, // il n'a aucun projectile
    hit: 'blade',
    impact: 'impact',
    bounce: 'thud',
    ability: null,
    /**
     * **Le personnage entier tient dans cette ligne.**
     *
     * `Damage = Spin` : sa lame va de 0,80 à 3,00 tour/s, plafonne 1,8 s,
     * s'effondre à −3,0/s et repart — et ses dégâts suivent exactement cette
     * courbe. C'était jusqu'ici la seule information vitale du roster qui ne
     * s'entendait pas.
     *
     * `from`/`to` sont ses **deux bornes mesurées**, converties en rad/s :
     * 0,80 tour/s = 5,03 et 3,00 tour/s = 18,85. Prendre ses vraies bornes,
     * et non une échelle commode, est ce qui fait que la voix balaie toute sa
     * course : plancher = silence, plafond = plein régime. On entend donc le
     * cycle de surchauffe **avant** de le lire sur la jauge.
     */
    swing: { loop: 'swish', from: 5, to: 19, gain: 1 },
    special: 'fire',
    /** Une accélération, pas une annonce : bande, scie et timbre montent ensemble. */
    ultimate: 'whirl',
  },

  /** Mesuré 605 px/s (médiane de 49 segments rectilignes) → ×1,25 = 756.
   *  Calé à 560 : c'est le combattant le plus rapide du roster, ce que dit le
   *  relevé, sans aller jusqu'aux 756 px/s qu'une lame de 152 px de portée
   *  rendrait intenable. À 470 il tombait à 9 victoires sur 27. */
  movement: { speed: 560, turnRate: 1.7, seek: 0.5 },

  weapon: {
    /** **Écart assumé au relevé, comme la lance du Lancier.** Le sabre
     *  dentelé de la vidéo est remplacé par une lame ardente transcrite
     *  d'une maquette fournie — garde ailée sombre à gemme rouge, lame en
     *  flamme continue du rouge sombre au jaune vif. Voir `pixelmaps.js`,
     *  `BLADESMAN_FLAMEBLADE`, pour la méthode de transcription (même
     *  principe que `LANCER_SPEAR` : réduction par blocs de l'artwork
     *  fourni, pas un dessin reconstruit). */
    name: 'Lame de braise',
    nameRef: 'Ember Blade',
    /** Mesuré : garde à r 36–45, lame à r 45–122 sur la vidéo 576 → ×1,25 :
     *  garde à 45–56, pointe à 152. **Écart assumé, demandé** : la lame
     *  passe ×1,3 (152 → 197,6) — `handle.length` et `head.scale` sont
     *  recalés dans la même proportion, donc la pointe dessinée retombe
     *  exactement sur cette nouvelle portée, comme avant le reskin. Un
     *  changement de reach déplace la matrice ; voir les invariants. */
    reach: 197.6,
    /** Mesuré : **plancher** de la courbe de rotation, 0,80 tour/s → 5,03 rad/s.
     *  Tout ce qui dépasse est ajouté par `abilities/bladesman.js` : la fiche
     *  décrit le plancher, le module décrit le cycle. */
    spin: 5.03,
    spinDir: 1,
    /** **Design revu, demandé — troisième passage.** Les deux essais de
     *  manche dessinée (rectangle plein, puis chevron modélisé en pixel-art
     *  texte) ne satisfaisaient pas la demande : « il ne faut pas modéliser
     *  l'arme ». `head.sprite` est maintenant servi par un **vrai PNG**
     *  (`assets/sprites/bladesman-flameblade.png`, déclaré dans
     *  `assets/sprites/manifest.json`) recadré directement dans la maquette
     *  fournie — lame, garde **et** manche/pommeau en un seul morceau, plus
     *  aucune part modélisée. `handle.width` reste à 0 : la manche est dans
     *  l'image, pas dans un rectangle. Voir `pixelmaps.js` pour l'écart à
     *  l'invariant « aucun binaire dans le dépôt » que ça implique.
     *
     *  **Écart assumé, demandé — quatrième passage.** La lame regrandit ×1,3
     *  (`head.scale` × 1,3, comme le premier agrandissement) et `handle.length`
     *  se retrouve négatif (−31,26) : au-delà de la valeur qui posait le
     *  pommeau pile au centre de la bille (0), un agrandissement supplémentaire
     *  ne peut que le faire déborder **derrière** le pivot, dans l'axe opposé à
     *  la lame — jamais au-delà du bord de la bille (rayon 41), donc le
     *  pommeau reste sur la silhouette de la bille, pas planté dedans. Sans
     *  incidence avant ce passage-ci : `overBody` (juste en dessous) rend
     *  maintenant toute l'arme visible par-dessus la bille, y compris cette
     *  portion. */
    handle: { length: -31.26, width: 0, color: '#8d7b62', dark: '#5c4f3c', outline: '#171009', gem: null },
    /** `scale` × 1,3 (1,448958 → 1,8836454) : seule la taille change,
     *  `handle.length` est recalé pour que la largeur réellement dessinée
     *  (`headH × ratio du PNG`, 486 × 140) retombe exactement sur `reach`
     *  (197,6, inchangé) — la pointe ne ment toujours pas sur la hitbox
     *  (invariant 5), même si `map.w`/`map.h` (dans `pixelmaps.js`) ne
     *  décrivent plus que le pixel-art de repli, jamais lus pour ce calcul. */
    head: { sprite: 'bladesmanFlameBlade', scale: 1.8836454 },
    /** **L'arme passe par-dessus la bille — demandé.** Même drapeau que le
     *  Lancier (voir `fighters/lancer.js` pour le détail d'ordre de dessin dans
     *  `fighter.js`) : la manche, jusqu'ici en grande partie masquée par la
     *  bille, devient entièrement visible. Purement visuel — `bladeSegment()`
     *  et la hitbox ne lisent pas ce drapeau, seul `Fighter.draw()` le fait. */
    overBody: true,
    /** La garde ne coupe pas : le tranchant commence après elle. Rayon de
     *  hitbox × 1,3 comme le reste de la lame. */
    hitbox: { from: 0.42, radius: 22.1 },
    melee: {
      /** Mesuré, **exact et sans exception** : `damage = 2,00 × Spin Speed`.
       *  La valeur n'est jamais stockée, elle est dérivée de la pile.
       *  **Divisé par deux, demandé** : le multiplicateur passe à 1,00, sans
       *  toucher à la Spin Speed elle-même (mesurée, et lue par le rendu). */
      damage: (f) => Math.max(1, Math.round(f.stacks)),
      cooldown: 1, // mesuré : verrou de 1 000 ms entre deux touches
      knockback: 250,
      selfRecoil: 85,
      /** Mesuré : sauts discrets de +0,15 sur la courbe de rotation, un par
       *  coup d'épée porté, et jamais au-delà du plafond de 3,00.
       *
       *  **Brûlure à l'impact — demandé, pas mesuré.** Même mécanisme que le
       *  Feu (`applyDot`, lu par `Match.resolveMelee`) : chaque coup de lame
       *  marque la cible d'un tic de brûlure, dérivé de la pile courante de
       *  Spin Speed (0,8 à 3,00) plutôt que d'une valeur fixe.
       *
       *  `duration` est `calé` au banc (`tools/matrix.mjs`), pas choisi à
       *  l'estime : à 2 s (deux tics par coup) le Bretteur balayait les deux
       *  autres actifs (5/6, contre 0/6 avant cet ajout) — la brûlure
       *  s'ajoutait à des dégâts au contact déjà mesurés, sans que la cadence
       *  de touche n'ait bougé. Ramenée à **1 s (un seul tic)**, il gagne 2/6 :
       *  un vrai gain sur son relevé d'origine, sans en faire le plus fort du
       *  roster réduit. Voir aussi `special.aura.tickDamage`, qui n'a quasiment
       *  pas pesé dans ce banc — le levier est ici, pas là-bas.
       *
       *  **1 → 1,5, rééquilibrage Ronin/Golem.** Rebalayé au banc à dix duels
       *  par adversaire (cinq par camp) : base à 5/50 (Hoplite 5/10, tout le
       *  reste à 0), 1,5 s → 8/50 (Hoplite 7/10, Druide 1/10), 2 s → 8/50
       *  aussi — le levier plafonne dès 1,5 s, inutile d'aller plus loin.
       *  Le Pistolero, le Shinobi et le Golem restent à 0/10 à chaque palier :
       *  écart structurel (rapides et/ou à distance, contre un duelliste au
       *  contact) connu et non corrigé, comme celui du Golem face au même
       *  Pistolero et au même Shinobi ci-dessus. */
      onHit: {
        stackGain: 0.15,
        stackMax: 3,
        dot: {
          // divisé par deux, demandé : même Spin Speed, moitié moins de brûlure
          damage: (self) => Math.max(0.5, Math.round(self.stacks * 0.5)),
          interval: 1,
          duration: 1.5,
          ring: '#e8621b',
          tint: { color: '#e8621b', alpha: 0.65 },
        },
      },
    },
  },

  /** Surchauffe : la lame monte au plafond, y tient un palier, puis lâche. */
  ability: {
    id: 'overheat',
    name: 'Danse d’acier',
    nameRef: 'Steel Dance',
    /** Mesuré : une fois à 3,00 tours/s, palier d'environ 55 images à 30 fps.
     *  Ce qui déclenche l'effondrement n'est **pas** identifiable sur la
     *  vidéo — il ne coïncide ni avec BLADE RUSH ni avec HIGH NOON. Le modèle
     *  de surchauffe reproduit la courbe : c'est un `calé`, pas un `mesuré`. */
    cooldown: 1.8,
    spin: {
      floor: 0.8, // mesuré : plancher jamais franchi
      ceiling: 3, // mesuré : plafond jamais franchi
      rise: 0.21, // mesuré : montée passive de +0,07 toutes les 10 images
      collapse: 3, // mesuré : effondrement à −1,00 toutes les 10 images
    },
  },

  ultimate: {
    id: 'bladeRush',
    name: 'Ruée de lame',
    nameRef: 'BLADE RUSH',
    barLabel: 'BLADE RUSH',
    barLabelFr: 'RUÉE DE LAME',
    /** **Écart assumé, demandé — deux passages.** D'abord passée à l'orange
     *  de l'aura (`#f97316`, texte assombri) pour suivre le reskin flamme.
     *  Reprend maintenant exactement la couleur de la jauge de Aura de braise
     *  juste en dessous : les deux jauges d'un combattant doivent se lire
     *  comme une paire — taille, police (déjà partagées via `HUD.bar`/
     *  `HUD.special`) et désormais couleur aussi. */
    barFill: '#ea580c',
    barText: '#fff1f0',
    /** Mesuré : cycles de 273, 214 et 333 images — donc **pas une simple
     *  horloge**. Modèle retenu : horloge de 9 s + 6 % par coup d'épée. */
    chargeRate: 100 / 9,
    chargeOnHit: 6,
    duration: 1.5, // mesuré : la ruée dure 1,5 s, minutée
    /** Mesuré : 939 px/s pendant la ruée contre 605 en croisière, soit ×1,55. */
    speedBonus: 1.55,
    /** Mesuré : le verrou entre deux touches tombe de 1 000 ms à 115 ms. */
    hitLock: 0.115,
    /** Calé : au-delà de cette distance la lame fonce, en deçà elle **orbite**.
     *  Foncer droit dessus ne marche pas — à pleine vitesse la zone utile est
     *  franchie en une centaine de millisecondes, et au banc d'origine la lame
     *  n'y était alignée que 15 images sur 149, pour un seul coup porté. */
    orbit: 120,
    /** Mesuré frame 643 : l'aire de l'éventail passe de ~3 500 px² à
     *  18 488 px² au pic, un facteur 5,3 — l'éventail **s'ouvre**, il ne fait
     *  pas que changer de teinte. Ouverture bornée en **angle**
     *  (1,6 rad → 3,0 rad), jamais en nombre d'images. **Couleur : écart
     *  assumé, demandé** — vert mesuré à l'origine, passé à la palette flamme
     *  comme le reste du reskin. */
    fan: { normal: 1.6, rush: 3, color: 'rgba(249,115,22,0.72)' },
  },

  /**
   * **Aura de braise — pouvoir greffé, demandé.** Troisième créneau, sur le
   * même patron que le Blizzard du Hors-la-loi et le Dôme de drain du
   * Lancier (invariant 7 du `CLAUDE.md`) : une horloge propre
   * (`f.state.spec`), sans rapport avec la jauge de BLADE RUSH, qui reste
   * intacte. Nova, ailes de flammes et aura brûlante sont repris de
   * `abilities/fire.js`, dont c'est l'ultime d'origine — voir ce module pour
   * le calcul du burst et des ailes, recopiés tels quels.
   *
   * Cadence et durée sont calées comme les deux pouvoirs greffés existants,
   * sur la durée des duels du roster réduit (10 à 20 s) — pas sur le cycle de
   * ~26 s du Feu, taillé pour un roster de onze où le Feu n'a que ça.
   */
  special: {
    id: 'infernalRage',
    name: 'Aura de braise',
    nameRef: 'Ember Aura',
    barLabel: 'EMBER AURA',
    barLabelFr: 'AURA DE BRAISE',
    /** **Écart assumé, demandé.** Rouge pur à l'origine, pour se distinguer de
     *  la jauge BLADE RUSH au-dessus ; passe à un orange plus sombre pour
     *  suivre le reskin flamme du bas d'écran tout en restant deux teintes
     *  différentes l'une de l'autre. */
    barFill: '#ea580c',
    barText: '#fff1f0',
    cooldown: 11,
    first: 5,
    duration: 5.2, // repris du Blizzard/Dôme de drain, mesuré sur la Glace/l'Ombre
    /** Nova de cubes orange à l'incantation — reprise du Feu, effectifs réduits
     *  de moitié : l’Aura de braise s'ajoute ici à BLADE RUSH plutôt que
     *  d'être l'unique pouvoir du combattant. */
    nova: { count: 45, speed: 420, size: 11, life: 0.9, colors: ['#f97316', '#ea580c', '#fbbf24', '#dc2626'] },
    /** Ailes de flammes autour du corps pendant toute la durée — reprises du Feu. */
    wings: { color: '#f97316', core: '#fbbf24', span: 2.1, flap: 6 },
    /** Aura brûlante : tout adversaire trop près prend un tic de dégâts et un
     *  rafraîchissement de la brûlure ci-dessus. Calé au banc (`matrix.mjs`) :
     *  à 2 dégâts/0,6 s elle cumulait avec la brûlure au contact et balayait
     *  les deux autres actifs (5/6). */
    aura: { radius: 140, tickInterval: 0.6, tickDamage: 0.5 }, // divisé par deux, demandé
  },

  /** Le Bretteur n'a aucun projectile : tout passe par la lame. */
  projectiles: {},

  /** Mesuré : la courbe de rotation démarre au plancher, 0,80 tour/s. */
  progression: { stack: 0.8, stack2: 0 },

  hud: {
    stats: [
      (f) => `Spin Speed: ${formatHalf(f.stacks)}`,
      /** Dérivé de la pile, **jamais stocké** : deux valeurs séparées
       *  finissent toujours par diverger. */
      (f) => `Damage: ${formatHalf(f.stacks * 2)}`,
    ],
    statsFr: [
      (f) => `Rotation : ${formatHalf(f.stacks)} tr/s`,
      (f) => `Dégâts : ${formatHalf(f.stacks * 2)}`,
    ],
    /** **Écart assumé, demandé.** Or sombre à l'origine, seule ligne du bas
     *  d'écran encore hors du reskin flamme ; passe à l'orange de l'aura. */
    color: '#f97316',
  },
});
