import { fiche } from '../defaults.js';

/* ==========================================================================
 *  COMÈTE  (COMET) — le combattant qui n'a que sa vitesse
 *
 *  Cinquième combattant **inventé** du dépôt, après le Golem, le Mannequin, le
 *  Soleil et la Lune : pas de vidéo de référence, donc **aucune de ses valeurs
 *  ne peut porter `mesuré`**. Tout y est `calé` (posé puis vérifié au banc) ou
 *  `déduit` (calculé d'une autre).
 *
 *  **Demandé** : « un nouveau personnage sans arme qui peut se déplacer très
 *  vite ». Les deux moitiés de la phrase sont liées et c'est tout le
 *  personnage : *puisqu'il n'a pas d'arme, sa vitesse doit en être une.*
 *
 *  **Le troisième combattant sans arme, et le deuxième qui gagne.** Le
 *  Mannequin n'a pas d'arme parce qu'il ne doit rien faire ; LUNE n'en a pas
 *  parce que tout ce qu'elle produit **tombe du ciel**. Celle-ci n'en a pas
 *  parce que **c'est son corps qui frappe** — elle est le premier du roster
 *  dont les dégâts passent par le contact sans qu'aucune géométrie d'arme
 *  n'existe.
 *
 *  **Les trois choses qui la tiennent :**
 *
 *   1. **Aucune arme, au sens strict du moteur** : `reach: 0`,
 *      `hitbox.radius: 0`, pas de `head.sprite`. C'est la géométrie **vide** du
 *      Mannequin — structurellement incapable de toucher — et pas des dégâts
 *      mis à zéro : la condition de `weaponHit` devient impossible au lieu
 *      d'être inoffensive. Ses coups ne passent donc **jamais** par
 *      `resolveMelee`, mais par son module, qui appelle `game.damage`
 *      lui-même.
 *   2. **Le choc cinétique** (`kinetic`) : au contact, elle blesse **à
 *      proportion de sa vitesse du moment**. C'est sa mécanique de base, elle
 *      n'a pas d'autre source de dégâts, et c'est ce qui fait que sa vitesse
 *      n'est pas un confort de déplacement mais sa **puissance**.
 *   3. **L'élan** (`rush`) : cette vitesse **monte toute seule** tant qu'elle
 *      ne touche personne, et **chaque choc la lui coûte**. Le personnage est
 *      donc une boucle — prendre de l'élan, le dépenser, le reprendre — et
 *      c'est la seule chose à regarder pour comprendre ce qu'elle fait.
 *
 *  **Ce que ça coûte, et c'est la contrepartie voulue** : elle doit venir au
 *  contact pour exister. Contre un tireur qui recule, elle passe son duel à
 *  traverser l'arène ; contre un gros corps lent, elle ne rate rien. Sa ligne
 *  de matrice est donc **structurellement dispersée**, et c'est le personnage,
 *  pas un défaut de calage (voir `docs/FICHES.md`).
 * ========================================================================== */
export const COMET = fiche({
  id: 'comet',
  /** Archétype traduit, comme SOLEIL/SUN : « comète » et « comet » sont le même
   *  mot d'usage dans les deux langues. Le genre suit le nom — **la** Comète,
   *  donc « la Rentrée » et non « le ». */
  name: 'COMÈTE',
  nameRef: 'COMET',
  tagline: 'Sans arme — son élan est tout ce qu’elle a, et il se dépense',
  taglineRef: 'No weapon — momentum is all it has, and it spends',
  icon: 'iconComet',

  look: {
    /**
     * **34, le plus petit corps du roster** — 41 est la norme, le Golem est à
     * 50 et le Soleil à 82. Calé, et c'est un vrai réglage d'équilibrage : un
     * corps étroit est **plus dur à toucher**, ce qui est sa seule défense
     * puisqu'elle suit la norme de 100 PV et n'a aucune réduction de dégâts.
     *
     * **Pas plus petit, et la raison est le chiffre de PV** : la police du
     * moteur fait 34 px, donc « 100 » mesure une soixantaine de pixels de
     * large. Sous 34 de rayon (68 de diamètre) le nombre déborderait de la
     * bille — le dépôt n'a pas de repli pour ça, et un chiffre qui dépasse se
     * lit comme un bug d'affichage.
     */
    radius: 34,
    /**
     * **Les quatre teintes du personnage, et la source unique de tout ce qui
     * est rose chez elle** — corps, queue, anneaux de pouvoir et icône.
     *
     * Le magenta est la seule famille de teintes **libre** du roster : l'orange
     * est pris deux fois (Ronin, Soleil), le bleu par le Pistolero, le vert par
     * le Druide, le violet par l'Hoplite (`#7046ac`), le gris par le Golem et
     * LUNE, le noir par le Shinobi, le blanc par le Mannequin. Vérifié teinte
     * par teinte avant de choisir : sur une arène blanche où deux combattants
     * se croisent à 700 px/s, deux corps de la même famille seraient
     * indiscernables au premier coup d'œil.
     *
     * Elles sont **nommées ici et lues par le module**, jamais écrites en dur —
     * c'est la règle que le Soleil a payée : un module qui code ses couleurs
     * finit par ne plus avoir la même matière que le personnage qu'il dessine.
     */
    palette: {
      edge: '#3d0b2a', // l'encre du contour
      body: '#d63b8f', // magenta de corps
      light: '#ff8ad0', // le rose de la queue
      core: '#fff0fa', // le cœur, presque blanc
    },
    body: '#d63b8f',
    /** Elle **blanchit** au coup, comme le reste du roster : sur un magenta
     *  saturé, le cœur clair de sa propre palette est le contraste le plus fort
     *  dont elle dispose. */
    bodyHit: '#fff0fa',
    outline: '#3d0b2a',
    /** Crème très clair : le chiffre de PV est posé sur un aplat magenta de
     *  luminance moyenne, une seule encre suffit (le contour `hpStroke` ne se
     *  déclare que sur un **dessin**, ce qu'elle n'est pas). */
    hpColor: '#fff0fa',
    /**
     * **Halo visible quand le Coup de fouet est prêt.** Contrairement au
     * Mannequin et aux deux boss, elle n'a aucune raison d'en porter un en
     * permanence : son corps est saturé, il se détache tout seul. Le halo sert
     * donc à ce qu'il sert partout ailleurs — **annoncer qu'un pouvoir est
     * chargé**.
     */
    aura: { color: 'rgba(255,138,208,0.38)', radius: 1.3, pulse: 1.2, showWhen: 'ability-ready' },
    flair: {
      /**
       * **Le fuseau, c'est sa queue** — et c'est pour elle que le mécanisme
       * existait déjà : `flair.js` suit les positions passées du **corps**, pas
       * d'une pointe d'arme. Un combattant sans arme ne peut porter que
       * celui-là ; un `ribbon` désignerait le centre de sa bille et se lirait
       * comme une tache.
       *
       * Large (34, soit son diamètre) et franchement opaque : à 700 px/s, une
       * traînée fine ne se voit pas — elle est étalée sur toute la largeur de
       * l'écran et n'a qu'une image pour exister.
       */
      smear: { color: '#ff8ad0', width: 34, alpha: 0.42 },
      /**
       * **Images fantômes pendant la Rentrée seulement** : le module allume
       * `f.ghosting` le temps de l'ultime et rien d'autre ne l'allume. C'est le
       * compteur générique de l'invariant 7 — le rendu le lit, il ne sait pas
       * pourquoi.
       */
      ghost: { color: '#ff8ad0', every: 0.035, alpha: 0.4 },
      /** Poussière qui **retombe** derrière elle : des débris, pas de la
       *  chaleur — l'inverse des braises montantes du Soleil. */
      motes: { rate: 16, size: 6, drift: 30, rise: 34, colors: ['#fff0fa', '#ff8ad0', '#d63b8f'] },
      impact: ['#fff0fa', '#ffffff', '#d63b8f'],
      shape: 'spark',
      castFlash: 'rgba(255,138,208,0.5)',
    },
    /** Sillage court et dense : il double le fuseau de près, là où celui-ci
     *  porte loin. */
    trail: { color: 'rgba(255,138,208,0.3)', every: 0.02, life: 0.3 },
    accent: '#ff8ad0',
  },

  /**
   * **Bruitages.** `pitch: 1.15` — le plus haut du roster après le Shinobi
   * (1,2) : petit corps, vitesse élevée, rien de lourd. Aucune de ses trois
   * recettes n'est partagée (c'est la règle du dépôt) et les deux premières
   * sont **l'exacte inversion l'une de l'autre** : `slam` s'ouvre sur un
   * transitoire et s'effondre, `surge` n'a aucun transitoire et monte.
   */
  sound: {
    pitch: 1.15,
    shot: null, // aucun projectile : elle n'atteint que ce qu'elle percute
    /**
     * **Le son du choc cinétique**, et il faut le réclamer explicitement.
     *
     * Le créneau `hit` est celui de la touche d'arme, or elle n'en a pas : son
     * module passe `sound: 'hit'` à `game.damage`, le mécanisme prévu pour une
     * arme que le moteur ne reconnaît pas comme telle (le Rayon solaire l'a
     * éprouvé le premier). Sans ce mot, son **geste principal** sonnerait comme
     * un projectile perdu, et `sound-check` crierait à la recette morte.
     */
    hit: 'slam',
    impact: 'impact',
    bounce: 'thud',
    ability: 'surge',
    /**
     * **Pas de `swing`, et ce n'est pas un oubli.** Une voix tenue se pilote
     * sur `weaponAngle` ; son arme n'existe pas, donc `weapon.spin` vaut 0 et
     * l'angle ne bouge **jamais** — la voix resterait collée au silence. Ce
     * qu'il faudrait entendre chez elle est son *élan*, qui n'est pas une
     * rotation : le banc ne sait pas encore le jouer, et c'est écrit ici pour
     * que personne ne recâble `swing` en croyant à un oubli.
     */
    special: null, // pas de troisième créneau
    ultimate: 'boom',
  },

  /**
   * **700 px/s : la plus rapide du roster, et de loin** — 655 au Pistolero, qui
   * détenait le record, 624 au Druide, 500 au Shinobi, 230 au Soleil. Calé.
   *
   * Et ce n'est que son **plancher** : `movement.speed` est multiplié par son
   * élan (`rush`), qui monte jusqu'à 1,5 en temps normal et 2,3 pendant la
   * Rentrée. Elle passe donc **1 050 px/s** en pointe ordinaire et **1 610**
   * pendant son ultime, sur une arène de 628 px de large — elle la traverse en
   * quatre dixièmes de seconde.
   *
   * `turnRate: 2.8` est également le plus haut du roster (2,2 au Shinobi) : à
   * cette vitesse, un cap qui pivote lentement décrit des courbes si larges
   * qu'elle **manquerait sa cible en tournant autour**. Le braquage est ce qui
   * rend la vitesse utilisable.
   *
   * `seek: 0.62` — le plus décidé du roster (0,44 au Pistolero) : elle n'a
   * aucune raison de dériver, tout ce qu'elle produit est au contact.
   */
  movement: { speed: 700, turnRate: 2.8, seek: 0.62 },

  /**
   * **Aucune arme — la géométrie vide du Mannequin, et pour une raison
   * opposée.**
   *
   * Lui ne doit pas pouvoir blesser ; elle **blesse beaucoup**, mais jamais par
   * ce chemin-là. `weaponHit` compare la distance de la cible au segment
   * tranchant : avec `from`/`to`/`radius` à zéro, ce segment se réduit au pivot
   * et la condition devient « le centre adverse est à moins de zéro du sien » —
   * or `resolveBodies` maintient les corps séparés. La condition est donc
   * **structurellement impossible**, pas seulement inoffensive, et c'est plus
   * sûr que des dégâts à zéro (piège documenté sur la couronne du Soleil :
   * `melee.damage: 0` laisse tourner le recul propre et le décollement des
   * corps, donc la géométrie d'une arme muette reste du gameplay).
   *
   * Le bloc reste obligatoire : le moteur et la carte de sélection le lisent
   * sans le tester.
   */
  weapon: {
    name: 'Aucune',
    nameRef: 'None',
    reach: 0,
    spin: 0,
    spinDir: 1,
    handle: { length: 0, width: 0, color: '#d63b8f', dark: '#3d0b2a', outline: '#3d0b2a', gem: null },
    /** Pas de sprite : `drawWeapon` retombe sur son garde, `ui/select.js` sur
     *  sa chaîne de repli, qui prend l'icône. */
    head: { sprite: null, scale: 1 },
    hitbox: { from: 0, to: 0, radius: 0 },
    melee: { damage: 0, cooldown: 1, knockback: 0, selfRecoil: 0 },
  },

  /* ---------- MÉCANIQUE DE BASE — le choc cinétique ---------- */
  /**
   * **Son unique source de dégâts, et elle n'est lue que par son module.**
   *
   * Bloc de fiche **hors des clés connues du moteur** : rien dans `game/` ne
   * sait ce qu'est `kinetic`, exactement comme `hud.stats` est une fonction que
   * seul le HUD appelle. C'est ce que l'invariant 12 demande — la forme se dit
   * entièrement dans la fiche, et le combattant qui ne déclare pas la clé suit
   * le chemin d'avant.
   *
   * **`damage` est le dégât à élan nominal** (×1), pas le dégât réel : le
   * module le multiplie par `f.state.rush`. À 1,5 d'élan, un choc vaut donc 5 ;
   * pendant la Rentrée, 7. C'est le seul endroit du dépôt où un dégât dépend
   * d'une grandeur **continue** du porteur plutôt que d'une pile (le `Damage`
   * du Pistolero, le `Spin` du Ronin montent par paliers, pas en continu).
   */
  kinetic: {
    /**
     * **Le dégât d'un choc à élan 1, et c'est son levier de puissance** — calé
     * au banc, 5 à 8 graines × les deux camps contre les six.
     *
     * Le balayage est **monotone et raide** : 4 → 88 % de victoires, 3 → 51 %,
     * 2,8 → 37 %, 2,5 → 32 %, **2 → 2 %**. Un point de dégât couvre donc presque
     * toute la bande du roster, et c'est la conséquence directe de sa
     * mécanique — un dégât multiplié par un facteur continu amplifie chaque
     * réglage au lieu de l'amortir. Ne pas y toucher « d'un demi-point pour
     * voir ».
     */
    damage: 3,
    /**
     * **Son verrou de touche, et il joue le rôle de `melee.cooldown`.**
     *
     * `resolveMelee` ne tourne jamais pour elle (géométrie vide), donc le
     * moteur ne pose **aucun** verrou : sans ce compteur, un contact qui dure
     * trois images ferait trois coups. C'est la même leçon que la couronne à
     * huit branches du Soleil — le garde-fou se pose **une fois pour toutes**,
     * avant la recherche de cible, pas par cible.
     *
     * **1,15 s, et c'est le second levier — mesuré contre le premier.** À dégât
     * égal (3), le verrou déplace autant que le dégât : 0,9 → 63 %, 1,05 → 56 %,
     * 1,15 → 51 %. Les deux ont donc été balayés séparément puis remesurés
     * ensemble (*deux leviers qui marchent ne s'additionnent pas*), et c'est
     * celui-ci qui a été retenu pour la dernière marche : baisser le dégât
     * rendait ses coups illisibles (3 PV affichés sur un corps à 100), alors
     * qu'espacer les chocs garde des coups qui **se voient** et laisse
     * l'adversaire respirer entre deux passages.
     */
    cooldown: 1.15,
    /**
     * **La marge, et c'est un piège déjà payé par LUNE.**
     *
     * Un test « les deux corps se touchent » écrit en `distance <= r1 + r2` est
     * **toujours faux et ne crie pas** : `resolveBodies` sépare les corps à
     * chaque pas, donc la condition n'est vraie dans aucune image. La Marée de
     * sa première version a infligé **0 PV sur 24 duels** pour cette exacte
     * raison, et il a fallu une ablation pour le voir. D'où 8 px explicites.
     */
    margin: 8,
    /** Elle projette ce qu'elle percute **dans son sens de marche** : un choc
     *  pousse devant, il n'écarte pas. */
    knockback: 240,
    /**
     * **Ce que le choc lui coûte en trajectoire** : elle rebondit elle aussi,
     * vers l'arrière. Sans ça, elle restait collée à sa cible et rechargeait
     * son verrou au contact, ce qui transformait la mécanique en corps à corps
     * ordinaire — l'inverse d'un personnage qui doit *revenir*.
     */
    selfKick: 130,
  },

  /* ---------- L'ÉLAN ---------- */
  /**
   * **Ce qui fait d'elle une boucle et non un bourrin.**
   *
   * `f.state.rush` est un facteur de vitesse **et** un facteur de dégâts : il
   * monte de 1 à `max` en `ramp` secondes tant qu'elle ne touche personne, et
   * chaque choc lui en retire `spend`. Elle est donc la plus dangereuse quand
   * elle vient de **rater**, et la plus inoffensive juste après avoir réussi.
   *
   * C'est écrit comme **un seul nombre** exprès : le facteur de vitesse passe
   * par `f.boost`/`f.boostFactor`, les compteurs génériques de l'invariant 7
   * (un module les allume, le moteur les décompte, et il ne sait pas pourquoi).
   * Deux états séparés — un pour la vitesse, un pour les dégâts — auraient
   * divergé au premier réglage.
   */
  rush: {
    /** Plafond ordinaire. À 1,5, elle plafonne à 1 050 px/s. Calé. */
    max: 1.5,
    /** Secondes pour aller de 1 au plafond, à froid. Calé : plus court, elle
     *  est en permanence au plafond et l'élan cesse d'être une ressource. */
    ramp: 6,
    /**
     * Ce qu'un choc retire au facteur. **Déduit de `ramp` et `max`** : la rampe
     * rend (1,5 − 1) / 6 = 0,083 par seconde, donc 0,3 se regagne en **3,6 s**,
     * soit trois chocs sur quatre à son verrou de 1,15 s. C'est ce rapport-là
     * qui fait qu'elle ne peut pas rester au plafond en frappant — et c'est
     * tout le personnage. Le changer sans recalculer les deux autres casse la
     * boucle sans rien dire.
     */
    spend: 0.3,
  },

  /* ---------- POUVOIR — Coup de fouet ---------- */
  /**
   * **Le bouton qui rend l'élan, sans attendre la rampe.**
   *
   * Horloge fixe, aucune visée : toutes les 6 s, son élan **saute au-dessus de
   * son propre plafond** (1,9 contre 1,5). Il n'y a pas de durée à ce pouvoir
   * et c'est le point — ce qu'il donne, elle le garde jusqu'à ce qu'elle le
   * dépense. Un joueur ne le voit donc pas « finir » : il le voit **partir dans
   * le prochain choc**.
   *
   * C'est aussi ce qui la rend lisible à l'écran : le halo s'éteint, la queue
   * s'allonge, et le coup suivant fait un tiers de plus.
   */
  ability: {
    id: 'whiplash',
    name: 'Coup de fouet',
    nameRef: 'Whiplash',
    /** Calé : à 6 s, il tombe 5 à 7 fois dans un duel de 40 s. */
    cooldown: 6,
    /** L'élan visé — **au-dessus de `rush.max`**, sinon le pouvoir ne ferait
     *  qu'anticiper une rampe qui serait arrivée toute seule. */
    to: 1.9,
    /** Anneau de détente au sol, tracé par `Effects.ring`. */
    ring: { to: 150, time: 0.35, color: 'rgba(255,138,208,0.9)', width: 7 },
  },

  /* ---------- ULTIME — Rentrée ---------- */
  /**
   * **Quatre secondes et demie où la boucle n'a plus de coût.**
   *
   * Son élan est **tenu** au-dessus de tout ce qu'elle peut atteindre seule
   * (2,3, soit 1 610 px/s), son verrou de touche tombe de 0,9 s à 0,4, et
   * surtout **ses chocs ne lui coûtent plus rien** : `rush.spend` ne s'applique
   * pas. C'est exactement l'ultime qu'appelle un personnage bâti sur une
   * ressource — il ne lui donne pas une attaque de plus, il lui **retire sa
   * contrainte**.
   *
   * **Pas d'annonce, et c'est assumé.** Le Rayon solaire s'annonce 2 s parce
   * qu'il est inesquivable une fois parti ; celui-ci n'est qu'une suite de
   * chocs, chacun esquivable comme les autres. Une annonce n'aurait rien donné
   * à esquiver — elle aurait juste retardé.
   */
  ultimate: {
    id: 'reentry',
    name: 'Rentrée',
    nameRef: 'REENTRY',
    barLabel: 'REENTRY',
    barLabelFr: 'RENTRÉE',
    barFill: '#d63b8f',
    barText: '#fff0fa',
    /** 12 s : entre le Soleil (7) et le Golem. Calé — il doit tomber deux à
     *  trois fois dans un duel, pas ponctuer chaque échange. */
    chargeRate: 100 / 12,
    /** Elle charge **en touchant**, comme tout le roster : c'est ce qui
     *  récompense le fait de revenir au contact plutôt que de tourner. */
    chargeOnHit: 4,
    duration: 4.5,
    /** L'élan tenu pendant toute la manœuvre. Calé. */
    rush: 2.3,
    /** Verrou de touche pendant la Rentrée : 0,4 s au lieu de 0,9. */
    cooldown: 0.4,
    /** Secousse de caméra à **chaque** choc de la Rentrée — petite (le Séisme
     *  du Golem vaut 16) parce qu'elle se répète une dizaine de fois. */
    shake: 6,
  },

  /** Ni projectile, ni troisième créneau. */
  projectiles: {},

  /** Aucune stat par paliers : sa montée est continue, c'est `rush`. */
  progression: { stack: 0, stack2: 0 },

  hud: {
    /**
     * **Les deux seules choses à savoir sur elle**, et la seconde se déduit de
     * la première : où en est son élan, et ce que coûtera son prochain choc.
     *
     * Le dégât est affiché **calculé**, pas en valeur de fiche : c'est la seule
     * façon de rendre visible que sa puissance bouge en continu, là où les
     * stats des autres montent par paliers.
     */
    stats: [
      (f) => `Momentum: ×${(f.state.rush ?? 1).toFixed(2)}`,
      (f) => `Impact: ${Math.round(f.el.kinetic.damage * (f.state.rush ?? 1))}`,
    ],
    statsFr: [
      (f) => `Élan : ×${(f.state.rush ?? 1).toFixed(2)}`,
      (f) => `Choc : ${Math.round(f.el.kinetic.damage * (f.state.rush ?? 1))}`,
    ],
    color: '#ff8ad0',
  },
});
