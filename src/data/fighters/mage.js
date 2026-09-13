import { fiche } from '../defaults.js';
import { formatHalf } from '../format.js';

/* ==========================================================================
 *  MAGE  (MAGE)  — invité
 *
 *  Quatrième personnage venu de la chaîne « ballthingsim », **construit sur la
 *  mécanique de Magia**, relevée sur « Dragoon vs Magia » (576 × 1024, 30 fps,
 *  24,4 s).
 *
 *  Attention au repère : cette vidéo-là n'est **pas** au même cadrage que les
 *  deux autres. Son arène mesure 502 px de bord extérieur contre 640 dans le
 *  jeu, donc la conversion est **×1,275** et non ×1,25. Vérifié par la bille :
 *  32 px de rayon mesurés × 1,275 = 40,8, soit les 41 px du roster.
 *
 *  Ce qui est repris de Magia : elle attaque **à distance**, son arme est une
 *  baguette **posée sur le côté** qui **vise** l'adversaire, et sa stat de HUD
 *  est une **cadence de tir qui monte toute seule** (« Attack Speed »).
 *
 *  Ce qui ne l'est pas : le personnage est **vert**, son arme est le sceptre de
 *  la maquette fournie, ses orbes sont **guidées**, et son ultime — la Tempête
 *  de sève — est celui de la Plante, demandé tel quel et délégué à
 *  `abilities/plant.js` plutôt que recopié.
 *
 *  Le Semis de la Plante (les bulbes posés au sol) n'a **pas** été repris,
 *  retiré à la demande : voir la section `ability` plus bas.
 * ========================================================================== */
export const MAGE = fiche({
  id: 'mage',
  name: 'DRUIDE',
  nameRef: 'DRUID',
  tagline: 'Distance — des orbes guidées, et une cadence qui monte sans fin',
  taglineRef: 'Ranged — homing orbs, and a fire rate that never stops climbing',
  icon: 'iconStaff',

  look: {
    /** Vert demandé. Distinct de la Plante (`#15c701`, un vert acide) : ce
     *  vert-ci est plus sombre et plus bleu, celui de la sève du sceptre. Il
     *  faut aussi qu'il tienne le chiffre de PV en crème sur fond blanc
     *  d'arène — d'où une valeur assez basse pour que le blanc tranche. */
    body: '#1f7a3d',
    bodyHit: '#ffffff',
    outline: '#0a0a0a',
    hpColor: '#f5f2ea',
    aura: {
      color: 'rgba(56,205,101,0.42)',
      radius: 1.6,
      pulse: 1.8,
      showWhen: 'ultimate-ready',
    },
    /** Toute la gamme sort du cristal du sceptre (`pixelart/mage.js`) : c'est
     *  ce qui tient l'ensemble — corps, orbes, aura et traînée — sur une seule
     *  couleur, et ce qui évite la passe de couleur incomplète déjà payée sur
     *  le Bretteur puis sur le Shinobi. */
    flair: {
      ribbon: { color: '#38cd65', width: 16, alpha: 0.5 },
      motes: { rate: 9, size: 9, drift: 28, rise: -16, colors: ['#1f964d', '#38cd65', '#97e0a0'] },
      impact: ['#38cd65', '#97e0a0', '#ffffff'],
      shape: 'dot',
      castFlash: 'rgba(56,205,101,0.55)',
    },
    trail: { color: 'rgba(31,150,77,0.26)', every: 0.045, life: 0.3 },
    accent: '#1f964d',
  },

  /**
   * **Bruitages** (recettes dans `data/sound.js`). Le seul du roster dont le
   * tir n'a **aucun transitoire** : une orbe ne claque pas, elle s'allume.
   * C'est la recette `orb`, deux sinus qui montent, et c'est ce qui le rend
   * reconnaissable au milieu d'une mêlée de métal et de pierre.
   */
  sound: {
    pitch: 1.05,
    shot: 'orb',
    /**
     * **Son arme est un bâton, pas une lame** — du bois plein, sans tranchant.
     * Il empruntait `blade` et sonnait donc comme le Ronin, ce que le Bâton de
     * ronce dément à l'image. `bough` est l'exact inverse : passe-bas qui
     * s'effondre au lieu d'un sifflement qui monte.
     */
    hit: 'bough',
    impact: 'impact',
    bounce: 'thud',
    /**
     * La Sève montante est un passif : aucun instant à sonoriser. Et rien à
     * tenir non plus — contrairement au Ronin, sa montée est une **cadence**
     * (+0,05 orbe par tir), pas une rotation. Elle s'entend donc d'elle-même,
     * dans l'espacement des `orb`.
     */
    ability: null,
    special: 'bloom',
    /** Ça pousse (le bandpass monte) et ça craque en retombant (l'éclat descend). */
    ultimate: 'thorns',
  },

  /**
   * **Le plus rapide du roster**, et c'est le relevé qui le dit : 548 px/s de
   * médiane sur 258 couples d'images (p25 507, p75 629), contre 521 pour le
   * Dragoon dans la **même** vidéo — dont on sait par ailleurs qu'il vaut
   * ~540 dans le jeu. La mesure se recale donc toute seule.
   *
   * `calé` malgré tout, comme toutes les vitesses du dépôt : le moteur d'ici
   * intègre à la main et pilote au cap, il ne reporte pas les constantes de
   * Matter.js. 520 est la valeur qui rend la cadence relevée sans que le Mage
   * devienne injoignable — voir la matrice dans `CLAUDE.md`.
   *
   * **+20 % demandé par-dessus** : 520 → 624, écart assumé au calage
   * ci-dessus.
   */
  movement: { speed: 624, turnRate: 2, seek: 0.34 },

  weapon: {
    name: 'Bâton de ronce',
    nameRef: 'Thorn Staff',
    /**
     * **Arme braquée** (`spin: 0`) : le sceptre pointe l'adversaire à chaque
     * image, c'est `abilities/mage.js` qui recopie l'angle. Troisième du
     * roster après le revolver du Hors-la-loi et la lance du Lancier — et
     * troisième fois qu'il faut lui poser **son propre garde-fou**, une arme
     * braquée touchant sinon en permanence.
     *
     * Ici le garde-fou est double, et il tient tout entier dans la géométrie :
     * la hitbox ne couvre que le **cristal** (`from: 0.87`), et l'arme est
     * **décalée sur le flanc** (`weaponLateral`, posé par le module), donc le
     * segment tranchant ne passe pas par l'axe qui vise. Le Mage ne peut
     * toucher au contact qu'en frôlant vraiment — ce qui est le propre d'un
     * combattant à distance.
     */
    spin: 0,
    spinDir: 1,
    /**
     * **Demandé, purement visuel** : le sceptre se dessine par-dessus la
     * bille au lieu de dessous — sans `overBody`, le décalage sur le flanc
     * (`weaponLateral`) le fait déjà déborder de la silhouette, mais son
     * talon restait caché sous le corps. Même drapeau que le Lancier
     * (`fighter.js`, invariant du rendu) : il ne pèse sur aucune hitbox, la
     * géométrie de `bladeSegment()` ne change pas.
     */
    overBody: true,
    /**
     * **Centré sur le pivot, demandé — écart assumé à la portée mesurée.**
     *
     * La baguette de Magia mesure 100 px vidéo entre ses deux bouts (×1,275 =
     * 128 px), et c'est la valeur qu'a portée `reach` à la sortie du
     * personnage : le manche ne démarrait qu'à −12 px du pivot, donc le
     * sceptre tenait presque tout entier **devant** la bille (128 px) contre
     * un talon minuscule **derrière** (12 px).
     *
     * Recentré ici, à même largeur dessinée (70 cellules × `scale: 2` =
     * 140 px, inchangé) : `handle.length` passe à la moitié de cette largeur,
     * **−70**, donc le sceptre démarre 70 px derrière le pivot et va jusqu'à
     * 70 px devant — la même longueur des deux côtés. L'invariant du dépôt
     * (`handle.length` + largeur dessinée = `reach`, sinon la pointe ment sur
     * la hitbox) fixe alors `reach` à **70**, pas 128 : centrer le sprite sans
     * le redessiner en plus grand réduit mécaniquement sa portée.
     *
     * Même patron que le Shinobi, seul autre combattant du roster à porter une
     * arme centrée sur son pivot (`handle.length: -75, reach: 75` — voir sa
     * fiche) : cette symétrie coûtait déjà sa portée mesurée, gardée telle
     * quelle et jamais recalée.
     *
     * `width: 0` : le sceptre est un sprite entier, du talon au cristal. Il
     * n'y a pas de manche à tracer par-dessus, seulement un décalage.
     */
    reach: 70,
    handle: { length: -70, width: 0, color: '#483b33', dark: '#2d2a27', outline: '#1b1a1d', gem: null },
    /** `scale: 2` : la carte est la maquette réduite de moitié (70 × 17), donc
     *  chaque pixel d'art fait 2 px à l'écran. À l'échelle 1 la hampe se
     *  réduisait à un trait — voir `pixelart/mage.js`. */
    head: { sprite: 'mageStaff', scale: 2 },
    /** Seul le cristal blesse : de 0,87 à 1 de la portée, soit les 9 derniers
     *  pixels (13 % de 70, contre 17 sur les 128 d'avant — le cristal reste
     *  la même fraction visible de l'arme, seule l'arme a raccourci). Rayon
     *  15, la demi-hauteur de la couronne de bois, inchangé. */
    hitbox: { from: 0.87, radius: 15 },
    melee: {
      /**
       * Coup de sceptre volontairement faible : le Mage est un tireur, la
       * mêlée n'est là que pour qu'il ne soit pas sans défense au contact.
       *
       * **Le verrou n'est pas un levier ici, contrairement au Hors-la-loi.**
       * Balayé à 1,4 / 1,7 / 2,2 s, il rend 15 / 12 / 14 victoires sur 24 :
       * non monotone, donc du bruit. C'est que le sceptre n'est pas saturé —
       * ses touches de contact sont rares, elles ne sont pas bornées par la
       * recharge. Il reste à 1,7 s par principe (une arme braquée mérite le
       * verrou long) et parce que c'est la configuration sur laquelle la
       * matrice de référence a été relevée, pas parce qu'il équilibre.
       *
       * Baisser ces dégâts à 1 fait en revanche tomber le Mage à 8 duels sur
       * 24 — mais seulement **en plus** de l'orbe à 2. Les deux leviers ne se
       * cumulent pas : près du seuil, un point de dégât bascule des courses
       * déjà serrées.
       *
       * **Divisé par deux, demandé** — cette fois avec l'orbe (ci-dessous) qui
       * suit la même division, donc sans le déséquilibre relatif que produirait
       * ce levier seul. La matrice est régénérée et comparée après le
       * changement (invariant 3), pas supposée stable.
       */
      damage: 1,
      cooldown: 1.7,
      knockback: 260,
      selfRecoil: 120,
    },
  },

  /* ---------- POUVOIR ---------- */
  /**
   * **Aucun.** Le Semis (les bulbes de la Plante, posés et laissés au sol) a
   * été retiré, demandé : un tireur qui vise et guide ses orbes n'a pas
   * besoin d'une mine plantée par terre, et cette mécanique-là tranchait avec
   * le reste de sa fiche — tout le Mage se joue **en l'air**, jamais au sol.
   *
   * La fiche doit malgré tout porter un `ability.cooldown` : le moteur le lit
   * à la construction du combattant. Même patron que la Furie du Lancier
   * (`fighters/lancer.js`) — `cooldown: Infinity`, jamais décompté par le
   * module, et `ui/select.js` l'affiche comme « passif » (`Number.isFinite`).
   */
  ability: {
    id: 'none',
    name: 'Sève montante',
    nameRef: 'Rising Sap',
    cooldown: Infinity,
    cooldownStep: 0,
    cooldownFloor: Infinity,
  },

  /* ---------- ULTIME — celui de la Plante, reteinté ---------- */
  /**
   * **Tempête de fleurs, reprise de la Plante**, à la couleur près : la nuée
   * rose de la vidéo d'origine passe au vert du sceptre, sans quoi le Mage
   * aurait un ultime d'une autre famille que tout le reste de sa fiche.
   * `tickDamage` est constant plutôt que dérivé de `self.stacks` — chez le
   * Mage cette pile est la cadence de tir, pas une stat de dégâts.
   */
  ultimate: {
    id: 'flowerStorm',
    name: 'Orage de ronces',
    nameRef: 'THORN STORM',
    barLabel: 'THORN STORM',
    barLabelFr: 'ORAGE DE RONCES',
    barFill: '#1f7a3d',
    barText: '#dcfce7',
    chargeRate: 3.6,
    chargeOnHit: 2,
    duration: 5,
    storm: {
      petals: { rate: 60, size: 13, speed: 210, life: 1, colors: ['#38cd65', '#1f964d', '#97e0a0'] },
      swarm: {
        clusters: 17,
        perCluster: 6,
        radius: 2.6,
        spread: 0.75,
        size: 17,
        sizeVar: 0.5,
        churn: 1.9,
        color: '#38cd65',
        flowers: 4,
        flowerSize: 42,
        /** La corolle rose de la Plante volait dans une nuée verte. */
        flowerSprite: 'mageFlower',
      },
      root: 0.7,
      tickInterval: 0.7,
      tickDamage: () => 0.5, // divisé par deux, demandé
      healInterval: 1,
      healAmount: 1,
    },
  },

  /* ---------- POUVOIR SPÉCIAL — troisième créneau, conçu pour lui ---------- */
  /**
   * **Tir enraciné** — le seul pouvoir du Mage qui ne vienne de nulle part
   * ailleurs. Les quatre autres invités portent un pouvoir **emprunté** à un
   * élément gelé (Blizzard de la Glace, Aura de braise du Feu, Dôme de drain
   * de l'Ombre) ; celui-ci est original, comme le Clone d'ombre du Shinobi.
   *
   * **Le marché : il s'immobilise pour frapper fort.** Des racines le clouent
   * au sol (`boostFactor: 0`, le compteur générique du `Fighter`, exactement
   * comme la phase `brace` du Lancier), il cesse de tirer ses orbes ordinaires
   * pendant qu'il charge, puis lâche **une orbe majeure** au bout du sceptre.
   *
   * C'est la seule dimension de risque de tout son jeu : partout ailleurs il
   * tire en fuyant, sans jamais rien exposer. Enraciné, il ne peut plus
   * esquiver — et c'est là qu'un Lancier qui charge ou un Shinobi qui referme
   * le trouve. La contrepartie doit donc être franche, sinon le pouvoir ne
   * vaut jamais son risque : l'orbe majeure fait **3 fois** les dégâts d'une
   * orbe ordinaire, va plus vite et vire plus sec.
   *
   * **Pas de zone posée au sol.** Les racines sont accrochées à lui et
   * disparaissent avec le tir : c'est délibérément l'inverse du Semis, qui
   * laissait des bulbes plantés dans l'arène et qui a été retiré pour ça.
   */
  special: {
    id: 'rootedShot',
    name: 'Tir enraciné',
    nameRef: 'Rooted Shot',
    barLabel: 'ROOTED SHOT',
    barLabelFr: 'TIR ENRACINÉ',
    barFill: '#1f964d',
    barText: '#e8fff0',
    /** Calé sur la durée des duels du roster réduit (20 à 25 s) : à 7 s
     *  d'horloge, le Mage s'enracine trois fois dans un duel moyen. */
    cooldown: 7,
    /** Premier enracinement calé plus tôt que le cycle, pour qu'il pèse sur un
     *  duel qui peut se décider en 20 s. */
    first: 3.5,
    /**
     * Durée de l'ancrage, en secondes. C'est **le** curseur de risque du
     * pouvoir : plus il est long, plus l'orbe majeure se paie cher. 1 s laisse
     * au Lancier le temps d'engager une charge et au Shinobi de refermer, sans
     * transformer chaque incantation en condamnation.
     *
     * La clé s'appelle `duration` et pas `charge` : c'est le nom que
     * `ui/select.js` lit pour la ligne « Special » de la carte, comme pour les
     * quatre autres pouvoirs greffés. Sous un autre nom, la carte affichait
     * « Rooted Shot — undefineds, every 7s ».
     */
    duration: 1,
    /** L'orbe lâchée à la fin — voir `projectiles.greatOrb`. */
    projectile: 'greatOrb',
    /**
     * **Recul à la libération, dirigé à l'opposé de l'adversaire — demandé.**
     *
     * Avant, rien ne poussait le Druide au tir : les racines lâchaient, et il
     * repartait *vers* sa cible, simplement parce que son cap la visait déjà
     * (`movement.seek` oriente le corps pendant l'ancrage, où seule la vitesse
     * est nulle). Un tireur qui marche sur sa cible juste après avoir lâché sa
     * plus grosse frappe, c'est l'inverse de ce que le pouvoir raconte.
     *
     * Le recul le renvoie donc **dans le dos de sa propre visée** : l'orbe part
     * d'un côté, lui de l'autre. Ça referme aussi la seule vraie faille du
     * personnage — il était immobile une seconde entière, puis se retrouvait
     * *plus près* de qui venait le punir.
     *
     * 420 : au-dessus du recul de tir du Pistolero (119) et sous celui de sa
     * Main du mort (988). Calé au banc — voir la matrice.
     */
    recoil: 420,
    /**
     * Racines dessinées **sous** le Mage pendant la charge (rendu seul, tracé
     * par un hachage pur — aucun tirage, donc aucun effet sur l'équilibrage).
     * Elles poussent avec la charge et disparaissent au tir.
     */
    roots: {
      count: 7,
      length: 58, // px au-delà du bord de la bille, au bout de la charge
      width: 7,
      /** Bois du sceptre, pas vert : en vert uni les racines se lisaient comme
       *  un astérisque, sept piques identiques plantées autour de la bille. Le
       *  brun les rattache à la hampe, et la pointe verte dit que c'est vivant. */
      color: '#4a3b2f',
      tip: '#38cd65',
    },
    /** Halo qui enfle au bout du sceptre pendant la charge, puis part avec
     *  l'orbe : c'est ce qui rend l'attente lisible. */
    glow: { radius: 30, color: 'rgba(56,205,101,0.55)' },
  },

  projectiles: {
    /**
     * **L'orbe guidée** — ce que le sceptre envoie, et tout le personnage.
     *
     * `homing` est lu par `game/projectiles.js`, qui borne le virage à
     * `turnRate`. C'est **le** paramètre d'équilibrage du Mage : sans borne
     * l'orbe est une touche garantie, et le personnage devient la version
     * projectile du piège de l'arme braquée. À 2,6 rad/s elle rattrape un
     * adversaire qui court tout droit et rate celui qui coupe sec — donc le
     * déplacement garde le dernier mot.
     *
     * `delay` laisse l'orbe sortir du sceptre avant de virer : sans lui, une
     * orbe tirée vers l'arrière pivoterait dans l'arme même.
     *
     * `speed` 470 : nettement sous les 600 du trait d'ombre, parce qu'une
     * orbe qui suit n'a pas besoin d'être rapide, et parce que sa vitesse est
     * ce qui décide si on peut la semer.
     *
     * **`damage` est le seul vrai levier du personnage, et il est raide.**
     * Sur les 24 duels du banc (les deux camps × 4 adversaires × 3 seeds) :
     * 3 → 20 victoires, 2 → 15, 1 → 0. Le guidage, lui, **plafonne** :
     * `turnRate` balayé de 3,4 à 0,4 rad/s ne fait passer le Mage que de 22 à
     * 16 victoires. Un banc qui plafonne dit que le levier n'est pas le bon —
     * l'ablation a tranché : 68 % des dégâts du Mage sont des projectiles,
     * et c'est leur valeur, pas leur trajectoire, qui décide.
     */
    orb: {
      label: 'Orbe de ronce',
      labelRef: 'Thorn Orb',
      sprite: 'mageOrb',
      scale: 2.2, // carte de 11 px -> orbe de 24 px, la taille du cristal
      speed: 470,
      damage: 1, // divisé par deux, demandé
      radius: 11,
      life: 2.6,
      bounces: 1,
      knockback: 70,
      homing: { turnRate: 2.6, delay: 0.1 },
      trail: { color: 'rgba(56,205,101,0.4)', every: 0.035, life: 0.32 },
    },
    /**
     * **L'orbe majeure** — la récompense du Tir enraciné, et rien d'autre ne
     * la tire.
     *
     * Elle reprend l'orbe ordinaire en la poussant sur les trois axes qui se
     * lisent à l'écran : **trois fois les dégâts** (3 contre 1, divisés par
     * deux ensemble sur demande — 6 contre 2 avant), plus grosse
     * (44 px contre 24), plus rapide (620 contre 470) et un guidage plus sec
     * (3,4 rad/s contre 2,6). C'est ce qui doit payer une seconde
     * d'immobilité — une orbe à peine meilleure ne vaudrait jamais le risque,
     * et le pouvoir ne servirait qu'à se faire toucher.
     *
     * `life` allongée à 3,4 s : elle poursuit plus longtemps, donc rater le
     * premier passage ne l'annule pas.
     */
    greatOrb: {
      label: 'Orbe majeure',
      labelRef: 'Greater Orb',
      /** Son propre au projectile, à la place du `shot` de la fiche : l'orbe
       *  majeure vaut trois orbes, elle doit s'entendre plus grosse. */
      sound: 'bloom',
      sprite: 'mageOrb',
      scale: 4, // même carte de 11 px, dessinée deux fois plus grand que l'orbe
      speed: 620,
      damage: 3,
      radius: 20,
      life: 3.4,
      bounces: 1,
      knockback: 190,
      homing: { turnRate: 3.4, delay: 0.1 },
      trail: { color: 'rgba(56,205,101,0.55)', every: 0.025, life: 0.42 },
    },
    /**
     * Pas de `flower` ici. Elle n'était tirée que par les bulbes du Semis
     * (`ability.bulb.projectile`), retiré avec la mécanique — une entrée
     * `projectiles.flower` inutilisée serait une clé de fiche que plus
     * personne ne lit (invariant 9), et `ui/select.js` l'aurait quand même
     * affichée dans la ligne « Projectile » de la carte.
     *
     * La corolle volante de la Tempête de sève (`mageFlower`) n'en dépend
     * pas : `ultimate.storm.swarm.flowerSprite` la dessine directement via
     * `PIXEL_MAPS`, sans passer par le registre des projectiles.
     */
  },

  /**
   * `stack` = **cadence de tir**, en orbes par seconde. C'est la stat de Magia,
   * et la seule mécanique propre du Mage.
   *
   * Relevé sur la vidéo, filigrane TikTok effacé en ne gardant que les pixels
   * roses du texte : 1,00 au départ, 1,10 à t≈1,2 s, 1,15 à 2,2 s, 1,25 à
   * 3,2 s, 1,30 à 3,8 s, puis le passage à 2,00 à t≈13 s et ~3,7 en fin de
   * duel. Tous les paliers sont des multiples de **0,05**, et les six premiers
   * tombent en 4,5 s pour une cadence moyenne de 1,15/s : **+0,05 par orbe
   * tirée**, ce qui rend une montée exponentielle `e^(0,05 t)` — 1,92 à 13 s,
   * 2,72 à 20 s, du bon ordre.
   *
   * Le pas de 0,05 est `mesuré`. Le plafond, lui, est `calé` : la vidéo ne
   * dure pas assez pour le montrer, et sans plafond un duel long rendrait la
   * cadence absurde.
   */
  progression: { stack: 1, stack2: 0 },

  hud: {
    stat: (f) => `Attack Speed: ${formatHalf(f.stacks)}`,
    statFr: (f) => `Cadence de tir : ${formatHalf(f.stacks)}`,
    color: '#1f7a3d',
  },
});
