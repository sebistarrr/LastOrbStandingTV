import { fiche } from '../defaults.js';
import { formatHalf } from '../format.js';

/* ==========================================================================
 *  HORS-LA-LOI  (OUTLAW)
 *  Relevé : vidéo « Outlaw vs Bladesman » (576x1024, 30 fps, 1159 images).
 *
 *  Ce personnage et le Bretteur viennent d'un autre jeu, dont le relevé a été
 *  pris sur une vidéo 576x1024. **Toute mesure s'y convertit en ×1,25** vers
 *  le repère 720x1280 utilisé ici : c'est exactement le rapport entre les deux
 *  vidéos de référence. Chaque valeur convertie cite la mesure d'origine.
 *
 *  Les valeurs de *rythme* (vitesse, portée d'engagement, cadence) sont en
 *  revanche `calé` : le moteur d'origine était Matter.js à pas fixe, celui-ci
 *  intègre à la main et pilote au cap. Reporter les constantes telles quelles
 *  d'un moteur à l'autre est le piège documenté du portage précédent.
 * ========================================================================== */
export const OUTLAW = fiche({
  id: 'outlaw',
  name: 'PISTOLERO',
  nameRef: 'PISTOLERO',
  tagline: 'Gâchette de givre — vise, tire, et gèle sa cible balle après balle',
  taglineRef: 'Frost trigger — aims, fires, and freezes its mark with every bullet',
  icon: 'iconRevolver',

  look: {
    /**
     * **Bleu de glace.** La pipette donne le brun `#8a5934` de la vidéo ; le
     * personnage est passé au type glace, et sa bille suit son arme, comme
     * celle du Lancier suit la sienne. Bleu **moyen** et non pâle : le chiffre
     * de PV est crème (mesuré), et un bleu clair le noierait — c'est la leçon
     * du cuivre clair du Lancier, qui avait forcé son chiffre en brun sombre.
     */
    body: '#3f97c9',
    bodyHit: '#e4e4e6', // mesuré frames 223/224/225 : le disque touché blanchit
    outline: '#181008', // pipette : (24,13,7), contour des billes
    /** Mesuré : le chiffre de PV est crème. Sur le brun sombre c'est le seul
     *  ton lisible — le noir du reste du roster y disparaîtrait. */
    hpColor: '#f5f2ea',
    aura: {
      color: 'rgba(143,208,238,0.5)',
      radius: 1.58,
      pulse: 2.2,
      /** Le barillet se recharge toutes les secondes : un halo branché sur le
       *  pouvoir clignoterait sans arrêt. Il annonce donc HIGH NOON. */
      showWhen: 'ultimate-ready',
    },
    flair: {
      /**
       * Le revolver ne tourne pas (il est asservi à l'adversaire) : le ruban
       * de pointe d'arme trace donc sa ligne de visée, pas une spirale.
       *
       * **Même suite d'effets que le Lancier, en glace au lieu de foudre** :
       * ruban et fuseau `electric`, aura d'arme, arcs le long du canon. Le
       * code est partagé, seule la gamme change — c'est tout l'intérêt d'avoir
       * mis ces effets dans `render/flair.js`, ils ne peuvent rien changer au
       * duel.
       *
       * **La gamme est en bleus saturés, pas en bleus pâles.** L'arène est
       * blanche : `#dff2fb` y serait invisible, exactement comme les jaunes
       * clairs du Lancier l'étaient. Le halo porte le bleu franc, le cœur un
       * bleu clair *encore teinté* — jamais du blanc.
       */
      ribbon: {
        color: '#3f97c9',
        width: 15,
        /** Mêmes opacités que le Lancier (0,55 / 0,40) : c'est la **teinte**
         *  qui a dû descendre, pas l'alpha. Sur l'arène blanche un bleu porte
         *  moins qu'un ambre à luminosité égale — au premier réglage
         *  (`#bfeaff` sur `#2a7fae`) la traînée se lisait comme une volute
         *  grise. Les deux tons sont donc descendus d'un cran. */
        alpha: 0.72,
        /**
         * **Poudre de givre** plutôt qu'éclair de givre. Le tracé électrique
         * disait la foudre, ce qui n'est pas ce que dit ce personnage : il gèle,
         * il ne foudroie pas. Les grains sont serrés au ras du canon et
         * s'ouvrent vers l'arrière — une poudre se disperse en retombant.
         *
         * `rate` bas (6 contre 16 pour l'éclair) : la poudre doit **tenir en
         * place** assez longtemps pour se lire comme de la matière en
         * suspension. À 16 paliers par seconde elle sautillait et redonnait du
         * bruit, exactement ce que le tracé électrique cherchait, lui, à
         * produire.
         */
        powder: {
          color: '#2f8ec6',
          /** **Le cœur reste un bleu, pas un blanc.** Premier réglage :
           *  `#e8f7ff` sur `#7cc3e4`, invisible — l'arène est blanche, et un
           *  grain quasi blanc à 3 px n'y existe pas. C'est exactement la leçon
           *  déjà payée sur les jaunes clairs du Lancier, refaite à l'envers. */
          core: '#8fd0ee',
          haze: '#5fb0d8',
          hazeAlpha: 0.42,
          grains: 4,
          spread: 17,
          size: 4.4,
          rate: 6,
        },
      },
      /** Le fuseau derrière la bille : large et peu opaque là où le ruban est
       *  fin et vif. Cassure plus ample et plus lente que celle du ruban,
       *  sinon les deux tracés grésillent à l'identique et se lisent comme un
       *  seul trait épais (leçon payée sur le Lancier). */
      smear: {
        color: '#2a7fae',
        width: 34,
        alpha: 0.52,
        /** Le fuseau porte le corps du sillage : grains plus gros, plus
         *  nombreux et plus étalés que ceux du ruban, sur une nappe plus large.
         *  Graine de hachage différente (7.3), sinon les deux nuages se
         *  superposent exactement et l'on n'en voit qu'un. */
        powder: {
          color: '#1d78ad',
          core: '#5fb0d8',
          haze: '#4a9fd0',
          hazeAlpha: 0.34,
          grains: 5,
          spread: 29,
          size: 6.4,
          rate: 5,
        },
      },
      /** Aura le long du canon, tracée sur `bladeSegment()` — donc solidaire
       *  de la portée. `boostAlpha` la gonfle pendant HIGH NOON. */
      /** `powder` étale l'aura sur six passes très transparentes au lieu de
       *  trois larges : le bord net d'une gélule convient à une lame
       *  électrifiée, pas à du givre en suspension. */
      weaponAura: {
        color: '#5fb0d8',
        core: '#cfeeff',
        width: 8,
        alpha: 0.2,
        boostAlpha: 0.36,
        pulse: 3.2,
        powder: true,
      },
      /**
       * Arcs de givre le long du canon. Même règle que sur la lance :
       * l'amplitude doit **dépasser la demi-épaisseur du sprite**, sinon les
       * arcs restent dans la silhouette qui les recouvre. Le revolver fait
       * 46 px de haut dessiné (`map.h 46 × scale 1`), soit 23 de demi-
       * épaisseur — d'où 32, le même rapport que les 38 de la lance sur ses
       * 55 px.
       */
      /**
       * **Poussière de givre le long du canon**, à la place des arcs. Même
       * ancrage, même hachage, mais des grains isolés au lieu de polylignes.
       *
       * `jitter` garde la contrainte des arcs : il doit dépasser la
       * demi-épaisseur du sprite (23 px pour un revolver de 46 px de haut),
       * sinon les grains restent dans la silhouette, qui les recouvre.
       */
      weaponArc: {
        powder: true,
        count: 30,
        jitter: 30,
        size: 4.2,
        rate: 9,
        boost: 1.5,
        core: '#a8dcf2',
        glow: '#2f8ec6',
        alpha: 0.85,
      },
      /** Pas de `pierce` : l'onde de pénétration est conditionnée à
       *  `Fighter.boost`, que le Hors-la-loi allume pendant HIGH NOON — un
       *  coin de charge planté devant un pistolero qui recule à chaque tir se
       *  lirait comme un bug. C'est le seul effet de la suite du Lancier qui
       *  ne se transpose pas. */
      motes: { rate: 8, size: 8, drift: 30, rise: -8, colors: ['#3f97c9', '#8fd0ee', '#dff2fb'] },
      impact: ['#dff2fb', '#ffffff', '#3f97c9'],
      shape: 'streak',
      castFlash: 'rgba(253,247,237,0.65)', // mesuré : l'arène vire au crème sous HIGH NOON
    },
    trail: { color: 'rgba(63,151,201,0.26)', every: 0.04, life: 0.28 },
    accent: '#8fd0ee',
  },

  /**
   * **Bruitages** — les recettes sont dans `data/sound.js`, la fiche ne fait
   * que les nommer, exactement comme elle nomme ses sprites et ses couleurs.
   *
   * `pitch: 1` : c'est lui la référence de hauteur du roster, et c'est mérité —
   * la détonation est le son le plus reconnaissable du jeu, tous les autres se
   * placent par rapport à elle.
   */
  sound: {
    pitch: 1,
    /** Claquement, souffle, calibre, et le renvoi de la rue déserte derrière. */
    shot: 'gunshot',
    /**
     * **Le Peacemaker frappe de la crosse, pas de la balle : du métal sec.**
     * Il empruntait `blade` — la lame du Ronin — qui siffle haut et long ;
     * `pistolwhip` est la même matière deux fois plus bas et sans queue, donc
     * une masse qui cogne au lieu d'un fil qui tranche.
     */
    hit: 'pistolwhip',
    /**
     * **Sa balle gèle** (`onHit.slow`, −30 % pendant 1,6 s) : son impact est le
     * seul du banc dont le corps **monte** au lieu de retomber — le gel prend
     * après le choc. L'`impact` générique disait juste « quelque chose a
     * touché ».
     */
    impact: 'frostbite',
    bounce: 'thud',
    /**
     * **Le barillet qu'on réarme, pas un tir.** La rafale du Six-Shooter
     * s'entend déjà, une détonation par balle : lui donner en plus un son de
     * pouvoir ferait deux bruits pour un seul geste. Ce son-là est celui du
     * **rechargement**, le moment où le barillet vrille et où il ne tire plus —
     * et il dure ce que dure le geste (0,7 s de `reload`), là où le `click`
     * emprunté à l'interface tenait 45 ms.
     */
    ability: 'cylinder',
    special: 'frost',
    /** Un duel à midi s'ouvre sur une cloche, pas sur une montée de synthé. */
    ultimate: 'knell',
  },

  /** Mesuré 483 px/s (médiane de 57 segments rectilignes) → ×1,25 = 604.
   *  Calé à 455 (à 604 px/s dans cette arène le pistolero traverse le cadre
   *  plus vite qu'il ne recharge, et la matrice le fait gagner partout), puis
   *  **écart assumé, demandé** : ×1,2 supplémentaire → 546, sous le 604
   *  mesuré. **Un second ×1,2, demandé** : 546 → 655, cette fois au-dessus du
   *  604 mesuré — écart assumé une deuxième fois. Voir la matrice après ce
   *  changement dans les invariants. */
  movement: { speed: 655, turnRate: 1.9, seek: 0.44 },

  weapon: {
    name: 'Pacificateur',
    nameRef: 'Peacemaker',
    /** Mesuré : pointe du canon à 97 px du centre sur la vidéo 576 → ×1,25.
     *  Elle **découle** du sprite : 37 (garde) + 34 cellules × 2,5. */
    reach: 122,
    /** **Zéro, et ce n'est pas un oubli.** Mesuré : « le canon est asservi à
     *  l'adversaire à chaque image, sans lissage ». C'est le module
     *  `abilities/outlaw.js` qui écrit `weaponAngle`, pas la rotation
     *  commune du roster. */
    spin: 0,
    spinDir: 1,
    /** Le sprite porte sa propre crosse : `width: 0` demande au moteur de ne
     *  rien dessiner, `length` ne sert plus qu'à décoller le sprite du centre
     *  (37 px, soit 4 px sous le bord de la bille). */
    handle: { length: 37, width: 0, color: '#26566f', dark: '#153546', outline: '#0b1620', gem: null },
    // 37 + 85 × 1 = 122, la portée relevée — inchangée par le nouveau dessin
    head: { sprite: 'outlawRevolver', scale: 1 },
    /** Seul le bout du canon frappe : à bout portant, c'est un tir. */
    hitbox: { from: 0.62, radius: 12 },
    melee: {
      /** Mesuré : la stat « Damage » part de 3,00 et monte de 0,10 par coup
       *  au but. Elle sert **à la fois** au tir et au coup à bout portant.
       *  **Divisé par deux, demandé** : plancher, départ (`progression.stack`),
       *  gain et plafond (`onHit` ci-dessous) suivent tous la même division,
       *  pour garder le même nombre de coups jusqu'au plafond. */
      damage: (f) => Math.max(1.5, Math.round(f.stacks)),
      /** Calé, et c'est le verrou le plus long du roster : le canon étant
       *  asservi à l'adversaire, il est **toujours** aligné, donc ce verrou est
       *  la seule chose qui limite le coup à bout portant. À 1,5 s, le
       *  pistolero gagnait 27 duels sur 27. */
      cooldown: 3,
      knockback: 240,
      selfRecoil: 119, // mesuré : recul de 95 px/s hors ultime → ×1,25
      onHit: { stackGain: 0.05, stackMax: 4 }, // mesuré ×0,5, demandé
    },
  },

  /** Barillet : six coups, puis le trou du rechargement. */
  ability: {
    id: 'sixShooter',
    name: 'Barillet',
    nameRef: 'Six-Shooter',
    /**
     * **Le délai entre deux tirs, divisé par deux — demandé (0,6 → 0,3 s).**
     *
     * Mesuré à 0,6 : ~18 images entre deux décréments d'`Ammo` à 30 fps. C'est
     * donc un **écart assumé au relevé**, du même lot que le rechargement
     * divisé par deux et le barillet porté à dix.
     *
     * **C'est le levier de cadence, et il n'a rien à voir avec le barillet.**
     * Passer de 6 à 10 balles n'avait rendu que +6 % de tirs par seconde (le
     * rechargement ne pèse que 0,7 s sur un cycle qui en dure plusieurs) ;
     * diviser ce délai-ci change directement le rythme de tir. Les deux se
     * combinent bien : avec des tirs deux fois plus rapprochés, un chargeur de
     * six se viderait en 1,8 s et il passerait son duel à recharger — c'est
     * maintenant que le barillet de dix sert à quelque chose.
     *
     * Aucun dégât n'est touché : sa balle vaut toujours ce que la vidéo dit.
     *
     * **0,3 → 0,345, demandé (+15 %).** Rallonge le même levier de cadence, en
     * sens inverse cette fois : moins de tirs par seconde, sans toucher au
     * barillet ni à la balle.
     */
    cooldown: 0.345,
    /**
     * **6 → 10 balles, demandé.** C'est un **écart assumé au relevé** : la
     * vidéo montre « Ammo: n/6 », six chambres, et le nom même de l'arme
     * (`Six-Shooter`) le dit. On ne réécrit pas la mesure, on s'en écarte
     * volontairement — même régime que le rechargement divisé par deux
     * juste en dessous.
     *
     * Conséquence à ne pas manquer : le barillet **augmente le DPS à lui
     * seul**, en réduisant la part du duel passée à recharger. Il fallait
     * donc le mesurer avant de toucher aux dégâts, sinon on aurait cumulé
     * deux hausses en croyant n'en faire qu'une.
     */
    magazine: 10,
    /** Le rechargement est le trou observé entre `0/6` et `6/6` : 1,4 s
     *  mesuré. **Divisé par deux sur demande** — c'est donc un écart assumé au
     *  relevé, pas une nouvelle mesure. Le tour de vrille du pistolet suit
     *  automatiquement, son angle étant calculé depuis l'avancement. */
    reload: 0.7,
    projectile: 'shot',
    recoil: 119, // mesuré : 95 px/s → ×1,25, appliqué à chaque tir
    /**
     * Dispersion, en radians de part et d'autre de la ligne de visée.
     *
     * **Déduit d'une mesure, pas inventé.** La vidéo montre la stat `Damage`
     * gagner 25 paliers de 0,10 en 38,6 s pour ~50 tirs : le pistolero touche
     * une fois sur deux, soit 0,65 coup/s. Sans dispersion, une visée réécrite
     * à chaque image touche **toujours** — le banc `tools/probe.mjs` donnait
     * 1,30 coup/s, exactement le double, et 27 victoires sur 27.
     *
     * 0,75 rad ramène le banc à **0,60 coup/s**, soit la précision relevée.
     * La valeur est raide : 0,72 donne 10 victoires sur 27, 0,80 en donne 9,
     * 0,75 en donne 15. Elle se règle au banc, pas à l'estime.
     */
    spread: 0.75,
  },

  ultimate: {
    id: 'highNoon',
    /** Renommé sur demande (« Pluie de plomb » / `LEAD HAIL`) : la main de
     *  cartes tristement célèbre de Wild Bill Hickok (as et huit), un classique
     *  du folklore du gunslinger — le thème du Pistolero. */
    name: 'Main du mort',
    nameRef: 'DEAD MAN’S HAND',
    barLabel: 'DEAD MAN’S HAND',
    barLabelFr: 'MAIN DU MORT',
    /** **Écart assumé, demandé.** Reprend exactement la couleur de la jauge
     *  de Blizzard juste en dessous (`special.barFill`/`barText`) : les deux
     *  jauges d'un même combattant doivent se lire comme une paire — taille,
     *  police (déjà partagées via `HUD.bar`/`HUD.special`, voir `tuning.js`)
     *  et désormais couleur aussi. */
    barFill: '#3fbde0',
    barText: '#f2fdff',
    /** Mesuré : charge linéaire de 1,13 px/image sur 238 px utiles → 7,0 s.
     *  C'est une **horloge pure** : la jauge gauche ne réagit pas aux coups. */
    chargeRate: 100 / 7,
    chargeOnHit: 0,
    duration: 6.2, // mesuré : la jauge se vide à 1,28 px/image → 6,2 s
    fireRateBonus: 2, // mesuré : la cadence de tir double
    speedBonus: 1.22, // mesuré : les deux camps gagnent ~22 % pendant HIGH NOON
    /** Mesuré : 790 px/s de recul par coup → ×1,25. Pic relevé à l'image
     *  1011 : 1 380 px/s, chaque coup de la rafale le propulse violemment. */
    recoil: 988,
    /** L'arène de la vidéo vire au crème sous HIGH NOON. Ici le décor est
     *  rasterisé une fois et ne bouge jamais (cahier des charges) : la lumière
     *  se pose donc **au sol, sous le pistolero** (voir abilities/outlaw.js). */
    glow: { radius: 250, color: 'rgba(253,247,237,0.34)', edge: 'rgba(232,201,138,0.5)' },
  },

  /**
   * **BLIZZARD — pouvoir spécial, repris tel quel de la Glace.**
   *
   * Troisième créneau de pouvoir, à côté d'`ability` (le barillet) et
   * d'`ultimate` (HIGH NOON), et **il ne les touche ni l'un ni l'autre** : il
   * porte sa propre minuterie et son propre état de module. C'était la seule
   * façon de l'*ajouter* sans remplacer HIGH NOON.
   *
   * Conséquence assumée : **il n'a pas de jauge**. Le HUD n'en porte qu'une,
   * et elle appartient à l'ultime. Le Blizzard s'annonce donc par son onde de
   * choc et par le disque de givre au sol, pas par un remplissage — ce qui,
   * pour un pouvoir sur horloge fixe, suffit à le lire.
   *
   * Le champ, l'onde et la neige sont **copiés de la fiche de la Glace** sans
   * retouche : c'est le même pouvoir, pas une variante. Seul le rythme est
   * `calé` ici, parce que la Glace le charge à la jauge et que le Hors-la-loi
   * le déclenche à l'horloge.
   */
  special: {
    id: 'blizzard',
    name: 'Champ de givre',
    nameRef: 'Frost Field',
    /** Jauge propre, sous celle de l'ultime — voir `HUD.special`. Le pouvoir
     *  greffé n'en avait pas au départ ; c'est ce qui manquait pour qu'on voie
     *  venir son déclenchement au lieu de le subir. */
    barLabel: 'FROST FIELD',
    barLabelFr: 'CHAMP DE GIVRE',
    /** Même traitement de libellé que les jauges d'ultime — texte clair cerné
     *  de noir — donc le fond doit être assez tenu pour le porter : `#67d6ec`
     *  était trop pâle une fois le libellé passé à la taille de l'ultime. */
    barFill: '#3fbde0',
    barText: '#f2fdff',
    /** Calé : les duels du roster réduit durent 10 à 20 s. À 14 s d'horloge
     *  le Blizzard ne partait presque jamais et ne se voyait qu'en duel long ;
     *  à 5 s il tourne en continu. 9 s laisse deux incantations dans un duel
     *  moyen. */
    cooldown: 11,
    /** Calé plus court que le cycle : le premier Blizzard doit tomber assez
     *  tôt pour peser sur un duel qui se décide en 12 s. */
    first: 4,
    duration: 5.2, // repris de la Glace, mesuré sur sa vidéo
    shockwave: {
      // onde cyan qui dépasse largement l'arène au déclenchement (observé)
      from: 40,
      to: 900,
      time: 0.95,
      color: 'rgba(103,214,236,0.85)',
      width: 6,
    },
    field: {
      radius: 130, // mesuré sur la Glace : disque cyan de ~130 px
      fill: 'rgba(224,247,255,0.55)',
      edge: 'rgba(103,214,236,0.75)',
      edgeWidth: 3,
      follows: true, // le champ suit le porteur
      slow: 0.35,
      tickInterval: 0.7,
      tickDamage: 0.5, // divisé par deux, demandé
    },
    snow: { count: 90, fall: 46, drift: 22, color: 'rgba(186,230,253,0.9)' },
    /**
     * **Éclats de givre** — la mécanique `frostShards` de la Glace, greffée
     * sur le Blizzard. Chez la Glace c'est un pouvoir *permanent* que le
     * Blizzard accélère ; ici il n'existe **que** pendant le Blizzard, sinon
     * le Hors-la-loi aurait deux armes en permanence et cesserait d'être un
     * pistolero. Les chiffres sont ceux du `duringUltimate` de la Glace, qui
     * décrit précisément le régime « pendant Blizzard ».
     */
    shards: { count: 7, cooldown: 2.4, projectile: 'iceShard' },
  },

  projectiles: {
    /** Éclat repris tel quel de la fiche de la Glace : les projectiles sont
     *  lus dans la fiche du **porteur** (`owner.el.projectiles[key]`), donc un
     *  emprunt se recopie, il ne se référence pas. */
    iceShard: {
      label: 'Éclat de givre',
      labelRef: 'Frost Shard',
      /**
       * **Un projectile peut avoir son propre son**, sinon il prend le `shot`
       * de la fiche. Ici il le faut : le Champ de givre crache des éclats à la
       * volée, et les faire détoner au revolver ferait entendre un chargeur
       * infini. `pebble` est sec et court, il s'empile sans saturer.
       */
      sound: 'pebble',
      sprite: 'iceShard',
      scale: 2.4,
      speed: 380,
      damage: 1, // divisé par deux, demandé
      radius: 10,
      life: 3.4,
      bounces: 2, // les éclats ricochent sur les murs (observé sur la Glace)
      knockback: 45,
      onHit: { slow: 0.12, slowDuration: 1.6 },
      /** Les éclats vont moitié moins vite que la balle (380 contre 936) :
       *  bouffée plus étalée et plus lente, mais moins dense — sinon dix éclats
       *  simultanés saturent le banc de particules à eux seuls. */
      trail: {
        color: 'rgba(186,230,253,0.5)',
        every: 0.03,
        life: 0.55,
        dotted: true,
        puff: { count: 3, spread: 7, trailBack: 10, core: 'rgba(245,253,255,0.7)' },
      },
    },
    shot: {
      label: 'Balle de glace',
      labelRef: 'Ice Bullet',
      sprite: 'outlawShot',
      /** ×1,5 sur l'ancienne taille : carte 30 × 9 dessinée 45 × 13,5. La
       *  collision ne suit pas — `radius: 8` ne dépend pas du sprite — donc
       *  c'est un grossissement purement visuel. */
      scale: 1.5,
      /** Calé : à 30 fps la vidéo ne montre que le sillage, jamais la balle.
       *  720 px/s laissait à l'adversaire de quoi sortir de la ligne de tir —
       *  c'était l'autre moitié de la précision relevée, avec la dispersion.
       *  Porté à **936 (×1,3)** sur demande : la balle traverse donc plus vite
       *  et la dispersion redevient le seul garde-fou de la précision. */
      speed: 936,
      /** Mêmes dégâts que le coup à bout portant : c'est la même stat. */
      damage: (f) => Math.max(1.5, Math.round(f.stacks)),
      radius: 8, // calé avec la dispersion et la vitesse, pour 0,60 coup/s au banc
      life: 1.4,
      bounces: 0,
      knockback: 45,
      /** Mesuré frame 300 : un trait **pâle** de 2 px, (213,182,153) à
       *  (236,206,177) — pas un rond sombre. */
      /**
       * **Bouffée de poudre** plutôt qu'un point isolé. Un point toutes les
       * 30 ms à 936 px/s laisse 28 px entre deux marques : ça se lit comme un
       * chapelet de perles, pas comme un sillage. `puff` en sème cinq autour de
       * chaque marque, étalées perpendiculairement et traînant vers l'arrière.
       *
       * `every` descend en même temps (0,03 → 0,018), sinon les bouffées
       * restent séparées quelle que soit leur densité — c'est l'espacement des
       * émissions qui décide de la continuité, pas leur richesse.
       */
      trail: {
        color: 'rgba(160,214,240,0.55)',
        every: 0.018,
        life: 0.34,
        dotted: true,
        puff: { count: 5, spread: 6, trailBack: 16, core: 'rgba(240,252,255,0.75)' },
      },
      /**
       * **Gel.** `slow` et `slowDuration` sont lus par `Match.damage` et
       * passés à `Fighter.applySlow` : le moteur savait déjà le faire, c'est le
       * mécanisme de l'Ombre et de la Glace. Rien à écrire ailleurs.
       *
       * 0,30 pendant 1,6 s : assez pour se voir et pour compter, pas assez
       * pour immobiliser — `slowFactor` retient le pire ralentissement actif,
       * donc deux balles coup sur coup ne s'empilent pas, elles prolongent.
       *
       * `stackGain` et `stackMax` suivent la même division par deux que
       * `weapon.melee.onHit` : les deux nourrissent la même pile partagée
       * (`f.stacks`), ils doivent avancer au même pas.
       */
      onHit: { stackGain: 0.05, stackMax: 4, slow: 0.5, slowDuration: 1.6 },
    },
  },

  /** Mesuré : « Damage: 3.00 » et « Ammo: 6/6 » sur la première image.
   *  **Divisé par deux, demandé** : départ à 1,5, voir `weapon.melee` pour le
   *  reste de la division (plancher, gain par coup, plafond). */
  /** `stack2` est la réserve de départ : elle suit le barillet, sinon il
   *  commencerait le duel avec un chargeur incomplet. */
  progression: { stack: 1.5, stack2: 10 },

  hud: {
    stats: [
      (f) => `Damage: ${formatHalf(f.stacks)}`,
      (f) => `Ammo: ${Math.round(f.stacks2)}/${f.el.ability.magazine}`,
    ],
    statsFr: [
      (f) => `Dégâts : ${formatHalf(f.stacks)}`,
      (f) => `Balles : ${Math.round(f.stacks2)}/${f.el.ability.magazine}`,
    ],
    color: '#6fc3e8', // bleu clair : la ligne de stat est posée sur l'encre sombre
  },
});
