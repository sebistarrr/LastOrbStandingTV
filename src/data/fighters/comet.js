import { fiche, SPIN } from '../defaults.js';

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
  /** **« Rien qui frappe » et non « sans arme »** : depuis que son entourage est
   *  dessiné, la carte de sélection montre une *Ceinture de débris*. Elle ne
   *  touche toujours rien — géométrie vide, voir `weapon` — mais une accroche
   *  qui dirait « sans arme » à côté d'une ligne « Arme : Ceinture de débris »
   *  serait fausse à l'écran. La moitié affichée suit donc le dessin, la
   *  mécanique ne bouge pas. */
  tagline: 'Rien qui frappe — son élan est tout ce qu’elle a, et il se dépense',
  taglineRef: 'Nothing that strikes — momentum is all it has, and it spends',
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
     * **Les cinq teintes du personnage, relevées sur sa maquette** — et la
     * source unique de tout ce qui est violet chez elle : corps, entourage,
     * anneaux de pouvoir, queue et icône.
     *
     * Prises par **bandes de luminance** sur `comet-core.png` (28ᵉ, 46ᵉ, 62ᵉ,
     * 86ᵉ et 98ᵉ centile des pixels opaques), donc **dans le dessin** et pas
     * choisies à côté : le corps et l'entourage sont littéralement la même
     * matière, ce qui est le seul moyen qu'un tourbillon cerné d'éclats se lise
     * comme **un** objet.
     *
     * **Elle était magenta uni** (`#d63b8f`) ; le dessin l'a emmenée vers le
     * violet profond, et **toutes** ses couleurs ont suivi dans la même passe —
     * queue, fuseau, fantômes, poussière, halo, sillage, ligne de HUD. Une
     * passe de couleur incomplète n'en est pas une : le dépôt a déjà payé le
     * Rayon solaire qui ne ressemblait plus à l'astre qui le tirait.
     *
     * La famille violet-magenta reste **libre** au roster : l'orange est pris
     * deux fois (Ronin, Soleil), le bleu par le Pistolero, le vert par le
     * Druide, le gris par le Golem et LUNE, le noir par le Shinobi, le blanc
     * par le Mannequin. Le violet de l'Hoplite (`#7046ac`) est le seul voisin,
     * et il est vérifié : celui-ci est **beaucoup plus sombre** (luminance
     * médiane 19 contre 63) et cerné d'éclats.
     */
    palette: {
      edge: '#04010e', // l'encre du vide central
      shadow: '#290651', // violet d'ombre
      body: '#540f8b', // violet de corps
      light: '#cb2fad', // magenta des bras
      core: '#ee82ec', // rose clair, la crête des bras
    },
    /**
     * **Le corps est un sprite — le troisième du roster**, après le Soleil et
     * LUNE, et pour la même raison : une maquette fournie vaut mieux qu'un
     * cercle qui l'imite.
     *
     * `assets/sprites/comet-core.png`, **coupé à sa sphère**. Le détourage est
     * fait par **topologie** et non à la couleur : le fond blanc est ce que le
     * remplissage atteint depuis le bord de l'image, le reste est l'objet. Un
     * simple seuil de clarté aurait été faux ici et l'a d'abord été — les bras
     * magenta saturés portent `R = 255`, donc un seuil sur le canal maximum les
     * prenait **pour du fond** et trouait le dessin. Le seuil porte sur le
     * canal **minimum** : un blanc a ses trois canaux clairs, un magenta non.
     *
     * La coupe tombe à **286 px** du centre, relevée par couverture d'anneau :
     * c'est le dernier rayon encore plein à 98,5 %, et au-delà la couverture
     * s'effondre (0,93 à 288 px, 0,28 à 300). Tout ce qui est dehors — 15,7 %
     * du dessin — est devenu l'**arme**, voir `weapon`.
     *
     * La maquette est un JPEG, donc ses aplats sont bruités : 43 000 couleurs
     * distinctes pour un dessin qui en montre une cinquantaine. Le PNG est donc
     * réduit de moitié (moyenne d'aire, qui efface le bruit) puis quantifié à
     * 48 teintes — le dessin y gagne, et le fichier passe de 489 à 69 Ko.
     */
    sprite: 'cometCore',
    /**
     * **Pas de `spriteScale`, et c'est une mesure.** La clé existe (défaut 1)
     * pour corriger un dessin qui déborde de son disque plein. Ici le PNG est
     * coupé **à** ce disque : la correction vaudrait 1,007, soit du bruit de
     * bord JPEG. Une clé qui recopie son défaut est une occasion de divergence
     * silencieuse, pas une intention.
     */
    /**
     * **Opacité du voile d'encaissement.** Sur un aplat le flash *remplace* la
     * couleur ; sur un dessin, le remplacer l'effacerait — on ne verrait qu'une
     * pastille unie à chaque coup. 0,55 : le coup se voit, le tourbillon reste
     * lisible dessous.
     */
    spriteFlash: 0.55,
    /**
     * **Plus peinte, mais toujours lue** : la carte de sélection en cerne sa
     * vignette et `Match.damage` en tire la couleur des gerbes. C'est le violet
     * de corps de la maquette (bande médiane de luminance), donc ces deux
     * usages restent d'accord avec ce qu'on voit.
     */
    body: '#540f8b',
    /** Elle **s'embrase** au lieu de blanchir, comme le Soleil : le corps
     *  touché passe au rose clair de ses propres bras. Sur un dessin aussi
     *  sombre, c'est le contraste le plus fort dont elle dispose — un blanc pur
     *  serait la seule couleur du personnage à ne pas venir du dessin. */
    bodyHit: '#ee82ec',
    /** **Plus tracé sur le corps** — un cercle net autour d'un tourbillon se
     *  lirait comme un carcan, et le sprite porte son propre bord. La clé reste
     *  lue par la carte de sélection, ce n'est donc pas une clé morte
     *  (invariant 9). C'est l'encre du dessin. */
    outline: '#04010e',
    /**
     * **Une seule encre claire, et c'est mesuré.** Le corps est un dessin, donc
     * la question du contour (`hpStroke`) se pose comme pour le Soleil — mais
     * elle se tranche dans l'autre sens : sous l'empreinte des digits, **82 %
     * des pixels sont sombres et 6 % clairs**, parce que le vide central du
     * tourbillon tombe exactement là où le nombre s'écrit. Le Soleil était à
     * 53 % clairs / 40 % sombres, et aucun aplat n'y tenait ; ici une encre
     * claire suffit, et un contour n'ajouterait qu'un pâté.
     *
     * À remesurer si la maquette change — c'est le genre de valeur qui devient
     * fausse sans rien dire.
     */
    hpColor: '#fbe6fb',
    /**
     * **Halo visible quand le Coup de fouet est prêt.** Contrairement au
     * Mannequin et aux deux boss, elle n'a aucune raison d'en porter un en
     * permanence : son corps est sombre et saturé, il se détache tout seul sur
     * l'arène blanche. Le halo sert donc à ce qu'il sert partout ailleurs —
     * **annoncer qu'un pouvoir est chargé**.
     */
    aura: { color: 'rgba(203,47,173,0.38)', radius: 1.3, pulse: 1.2, showWhen: 'ability-ready' },
    flair: {
      /**
       * **Le fuseau, c'est sa queue** — et c'est pour elle que le mécanisme
       * existait déjà : `flair.js` suit les positions passées du **corps**, pas
       * d'une pointe d'arme. Un combattant sans arme au sens du moteur ne peut
       * porter que celui-là ; un `ribbon` désignerait le centre de sa bille et
       * se lirait comme une tache.
       *
       * Large (34, soit son diamètre) et franchement opaque : à 1 050 px/s, une
       * traînée fine ne se voit pas — elle est étalée sur toute la largeur de
       * l'écran et n'a qu'une image pour exister. **Le magenta des bras**
       * plutôt que le rose clair : sur l'arène blanche, c'est la teinte saturée
       * qui porte, pas la plus claire.
       */
      smear: { color: '#cb2fad', width: 34, alpha: 0.42 },
      /**
       * **Images fantômes pendant la Rentrée seulement** : le module allume
       * `f.ghosting` le temps de l'ultime et rien d'autre ne l'allume. C'est le
       * compteur générique de l'invariant 7 — le rendu le lit, il ne sait pas
       * pourquoi.
       *
       * **`every` se calcule sur la vitesse de pointe, il ne se choisit pas.**
       * Une traînée de fantômes doit être une bande de billes qui **se
       * recouvrent** (le relevé du Dragoon), pas un pointillé. À 2 415 px/s —
       * sa pointe en Rentrée — un dépôt toutes les 0,035 s les espaçait de
       * **85 px** pour un corps qui en fait 68 de large : le trait se cassait.
       * 0,022 s les ramène à 53 px, donc ils se chevauchent encore.
       * **À recalculer si sa vitesse rebouge** : `every < diamètre / vitesse de
       * pointe`, et rien ne crie si on l'oublie.
       */
      ghost: { color: '#cb2fad', every: 0.022, alpha: 0.4 },
      /** Poussière qui **retombe** derrière elle : des débris, pas de la
       *  chaleur — l'inverse des braises montantes du Soleil. Ses trois teintes
       *  sont celles du dessin : ce qui s'échappe d'elle est fait de la même
       *  matière qu'elle. */
      motes: { rate: 16, size: 6, drift: 30, rise: 34, colors: ['#ee82ec', '#cb2fad', '#540f8b'] },
      impact: ['#ee82ec', '#ffffff', '#540f8b'],
      shape: 'spark',
      castFlash: 'rgba(203,47,173,0.5)',
    },
    /** Sillage court et dense : il double le fuseau de près, là où celui-ci
     *  porte loin. Même magenta, plus transparent. */
    trail: { color: 'rgba(203,47,173,0.3)', every: 0.02, life: 0.3 },
    accent: '#ee82ec',
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
    shot: null, // les éclats de la Fragmentation partent muets, voir `special`
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
    /** La Fragmentation — voir la recette : ce qui se détache et part en
     *  morceaux. Les huit éclats, eux, partent **muets** (`shot: null`) :
     *  `MIX.repeatGap` fondrait huit tirs identiques en un seul coup saturé, et
     *  la salve est déjà annoncée d'un bloc par ce créneau. */
    special: 'shatter',
    ultimate: 'boom',
  },

  /**
   * **1 050 px/s : la plus rapide du roster, et de très loin** — 655 au
   * Pistolero, qui détenait le record, 624 au Druide, 500 au Shinobi, 230 au
   * Soleil. Elle va **60 % plus vite que le deuxième**. Calé.
   *
   * **700 → 1 050, demandé** (« augmente sa vitesse de 50 % »). Mesuré : +6
   * points de victoires contre les six (45 → **51 %**) et 2,2 → 2,9 PV/s au banc
   * du Mannequin. Un gain modeste pour la moitié de vitesse en plus, et c'est
   * cohérent avec ce qu'elle est devenue depuis `seek: 0` — aller plus vite en
   * ligne droite fait autant rater que toucher. Elle reste dans la bande du
   * roster, donc **aucun autre chiffre n'a été retouché**.
   *
   * Et ce n'est que son **plancher** : `movement.speed` est multiplié par son
   * élan (`rush`), qui monte à 1,5 tout seul, 1,7 par les murs, 1,9 au Coup de
   * fouet et 2,3 pendant la Rentrée. Elle passe donc **1 575 px/s** en pointe
   * ordinaire, **1 785** en s'appuyant sur les parois, et **2 415** pendant son
   * ultime — sur une arène de 628 px de large, qu'elle traverse alors en **un
   * quart de seconde**.
   *
   * **Ce que ça oblige à revérifier, et ça ne crie pas** : à 2 415 px/s le pas
   * fixe de 1/120 s fait avancer de **20 px** par image. C'est bien en deçà de
   * la somme des rayons (34 + 34 = 68 au minimum), donc aucun corps ne peut
   * être traversé sans que le choc cinétique le voie — la condition de contact
   * est testée à chaque pas. La cadence des images fantômes, elle, a dû suivre
   * (voir `look.flair.ghost`).
   *
   * **`seek: 0` — elle file droit et ne vise personne, demandé.**
   *
   * Le pilotage de `Fighter.step()` est gardé par `mv.seek > 0` : à zéro, la
   * ligne qui tourne le cap vers l'adversaire **ne s'exécute pas du tout**. Son
   * cap ne change donc plus qu'aux rebonds de mur, comme l'Hoplite et le
   * Mannequin. C'est le troisième combattant du roster dans ce cas, et le seul
   * dont **tous les dégâts sont au contact** — les deux autres tirent ou
   * n'attaquent pas.
   *
   * **Ce que ça change, mesuré** : elle tombe de 46 % à **28 %** de victoires
   * contre les six, et de 3,1 à 2,2 PV/s au banc du Mannequin. Une comète qui
   * ne corrige pas sa trajectoire rate simplement beaucoup plus. C'est
   * `kinetic.cooldown` qui l'a ramenée (1,9 → 1,15 s, voir là-bas) : le verrou
   * long ne servait qu'à brider un personnage **visé**.
   *
   * **Et ça rend le Rebond central** : puisque les murs sont désormais la seule
   * chose qui change son cap, ils sont aussi le rythme du personnage — chaque
   * paroi la relance *et* la réoriente. Le pouvoir le moins spectaculaire des
   * trois est devenu celui qui structure son déplacement.
   *
   * **`turnRate: 2.8` ne pilote donc plus rien**, et c'est assumé : `step()` ne
   * le lit qu'à travers `mv.turnRate * mv.seek`, nul ici. Il reste **lu par la
   * carte de sélection** (`speedLine(speed, turnRate)`), donc ce n'est pas une
   * clé morte au sens de l'invariant 9 — même situation que l'Hoplite (1,85) et
   * le Mannequin (1,6), qui portent tous deux `seek: 0`. Le remonter ou le
   * baisser ne déplacerait pas un duel ; ça ne changerait que la ligne
   * « Vitesse » de sa fiche à l'écran.
   */
  movement: { speed: 1050, turnRate: 2.8, seek: 0 },

  /**
   * **Une arme qui se voit et qui ne touche pas — demandé** (« tout ce qu'il y
   * a autour devient l'arme »).
   *
   * C'est la **géométrie vide du Mannequin** avec un dessin par-dessus, et les
   * deux moitiés de cette phrase comptent autant l'une que l'autre :
   *
   *  • `hitbox` reste **`from`/`to`/`radius` à zéro**. `bladeSegment()` écrase
   *    alors le segment tranchant sur le pivot quelle que soit la portée, et la
   *    condition de `weaponHit` devient « le centre adverse est à moins de zéro
   *    du sien » — or `resolveBodies` maintient les corps séparés d'au moins la
   *    somme des rayons. La condition est **structurellement impossible**, pas
   *    seulement inoffensive, donc `resolveMelee` ne tourne toujours **jamais**
   *    pour elle. Ses dégâts continuent de passer par son seul module ;
   *  • `reach`, `spin` et `handle.length` ne servent donc plus **qu'au
   *    dessin**. C'est exactement le cas du Shinobi, dont la rotation d'arme a
   *    été poussée deux fois sans qu'un vainqueur bouge : depuis que sa hitbox
   *    est un disque centré, `weaponAngle` ne décide plus d'aucune collision.
   *
   * **Ce n'est pas le cas du Soleil, et la différence est à connaître.** Sa
   * couronne ne blesse pas (`melee.damage: 0`) mais elle a une **vraie hitbox**
   * : `resolveMelee` pose son verrou, applique son recul propre et décolle les
   * deux corps *hors* de `Match.damage` — d'où le piège documenté, « une arme à
   * zéro dégât n'est pas une arme inerte », et une matrice qui bouge dès qu'on
   * touche à sa portée. Ici, rien de tout ça ne peut arriver : il n'y a aucune
   * touche possible, donc aucun effet de bord. **Preuve exigée et fournie : la
   * matrice est identique au caractère près.**
   */
  weapon: {
    /** Ce que le dessin montre : les éclats et les éclairs qui tournent autour
     *  d'elle. Nommé, parce que la carte de sélection affiche toujours une ligne
     *  « Arme » — et « aucune » mentirait maintenant sur ce qu'on voit. */
    name: 'Ceinture de débris',
    nameRef: 'Debris Belt',
    /**
     * **48,03 px — et c'est de la géométrie de dessin, pas de collision.**
     *
     * Déduite de la maquette comme partout : l'entourage s'étend jusqu'à 404 px
     * du centre là où la sphère en fait 286, soit **1,413 × le rayon du corps**.
     * À 34 de rayon, cela fait 48,03. Les débris dépassent donc de 14 px tout
     * autour de la bille — ce que montre le dessin, ni plus ni moins.
     *
     * L'invariant du dépôt tient au centième, comme pour le Shinobi :
     * `handle.length + largeur dessinée = −48,03 + 96,06 = 48,03 = reach`.
     */
    reach: 48.028,
    /**
     * **SPIN × 0,25**, soit 1,44 rad/s — une rotation lente, la plus lente du
     * roster devant le Golem (0,45). Des débris en orbite ne fouettent pas
     * l'air : ils dérivent. **Purement visuel** (voir plus haut), donc calé à
     * l'œil et pas au banc — c'est le seul réglage de cette fiche qui ait ce
     * droit.
     */
    spin: SPIN * 0.25,
    spinDir: 1,
    /**
     * **Aucun manche, et `length` négatif** : `width: 0` demande au moteur de ne
     * rien tracer, et la longueur ne sert plus qu'à reculer le sprite d'une
     * demi-largeur pour le **centrer sur la bille** — même mécanique que le
     * shuriken du Shinobi. Sans ça, la ceinture pendrait à côté du corps au lieu
     * de l'entourer.
     */
    handle: { length: -48.028, width: 0, color: '#540f8b', dark: '#290651', outline: '#04010e', gem: null },
    /**
     * **L'entourage du dessin, découpé de la sphère** :
     * `assets/sprites/comet-ring.png`, tout ce qui est au-delà de 286 px du
     * centre. Sa base est prise **12 px en deçà** de la sphère pour qu'elle
     * chevauche la bille : sans ce recouvrement, une couture circulaire se
     * verrait tourner (la leçon de la couronne du Soleil, prise à 168 px pour
     * une sphère de 178).
     *
     * **L'échelle ne se lit pas sur la carte texte**, et c'est le piège déjà
     * payé trois fois (lance de l'Hoplite, arme du Golem, couronne du Soleil) :
     * `drawSpriteLeft` dimensionne par la **hauteur** (`map.h × scale`, donc
     * 17) puis applique le rapport d'aspect du PNG — carré ici, donc 1. La
     * largeur dessinée vaut `17 × scale`, d'où `scale = 96,056 / 17 = 5,650348`.
     */
    head: { sprite: 'cometRing', scale: 5.650348 },
    /**
     * **Zéro partout, et c'est ce qui garde le personnage intact.** Voir le
     * commentaire de bloc : c'est cette ligne, et elle seule, qui fait que le
     * dessin ajouté ci-dessus ne peut toucher personne.
     */
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
     * au banc, jusqu'à 20 duels par paire contre les six.
     *
     * Le balayage est **raide** : quand elle n'avait que le Coup de fouet,
     * 4 → 88 % de victoires, 3 → 51 %, 2,8 → 37 %, **2 → 2 %**. Un point de
     * dégât couvre presque toute la bande du roster — conséquence directe de sa
     * mécanique, un dégât multiplié par un facteur continu amplifie chaque
     * réglage au lieu de l'amortir. Ne pas y toucher « d'un demi-point pour
     * voir ».
     *
     * **3 → 2,5 à l'arrivée de la Fragmentation et du Rebond** : les deux
     * ensemble l'avaient portée à **79 %**, et c'est son contact qu'il fallait
     * reprendre, pas eux (voir `cooldown` juste en dessous).
     */
    damage: 1.6,
    /**
     * **Un plancher anti-double-compte, et plus une cadence — c'est une
     * correction de bug.**
     *
     * Il a valu 0,9 puis 1,15 puis 1,9 puis 1,15 s, écrit comme le `meleeCd`
     * que le moteur pose pour les autres : `resolveMelee` ne tournant jamais
     * pour elle, il fallait bien empêcher qu'un contact de plusieurs images
     * fasse plusieurs coups.
     *
     * **La mesure a montré qu'il faisait autre chose.** Un contact dure **2 à
     * 3 images** (0,017 s en moyenne, relevé sur 24 duels) : un plancher de
     * 0,05 s aurait suffi à ce travail-là. En revanche le verrou **avalait 27 à
     * 44 % des contacts suivants** — des contacts *neufs*, parfois plus d'une
     * seconde après le précédent. À l'écran, la Comète percutait son adversaire
     * et il ne se passait rien.
     *
     * Le double compte est désormais interdit par `f.state.ramArmed`, qui ne se
     * relève qu'à la **séparation** (voir le module). Cette valeur n'est plus
     * qu'un plancher contre un contact qui **grésille** : la mesure a vu des
     * épisodes se rouvrir 0,03 s après le précédent, ce qui est la même
     * collision vue deux fois. 0,12 s couvre ce cas et rien d'autre.
     */
    cooldown: 0.12,
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
    /** Plafond ordinaire. À 1,5, elle plafonne à 1 575 px/s. Calé. */
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
    /* ---------- REBOND — le mur lui rend son élan ---------- */
    /**
     * **Demandé.** Jusqu'ici un rebond de mur ne lui coûtait ni ne lui rendait
     * rien : elle traversait l'arène, tapait la paroi, repartait. C'était son
     * **temps mort** — et c'est justement là qu'elle en passe le plus, puisque
     * tout ce qu'elle produit demande d'aller au contact.
     *
     * Chaque mur touché ajoute désormais `gain` à son élan, plafonné à `cap`.
     * Ce n'est pas un pouvoir : **aucune horloge, aucune jauge, aucune visée**,
     * exactement comme la rampe au-dessus. C'est une règle permanente de plus
     * sur la même ressource, et elle transforme un déplacement subi en
     * accumulation.
     *
     * **Le plafond est le point.** Chaque source d'élan a le sien, et ils
     * s'étagent : rampe **1,5** < murs **1,7** < Coup de fouet **1,9** <
     * Rentrée **2,3**. Un mur ne remplace donc jamais un pouvoir — il va un
     * cran plus loin que ce que le temps seul donnerait, et pas davantage.
     *
     * **Ce que le moteur fournit déjà** : `Fighter.wall` est posé à chaque pas
     * par `step()` — il était jusqu'ici *marquage de mise en scène*, lu par le
     * seul bruitage de rebond. Le lire ne coûte donc rien et ne change rien
     * pour les neuf autres. Un rebond de coin pose `wall` deux fois dans le
     * même pas et ne vaut qu'un gain : c'est la bonne lecture, on compte des
     * **pas**, pas des parois.
     */
    bounce: { gain: 0.12, cap: 1.7 },
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
    /** Anneau de détente au sol, tracé par `Effects.ring`. Au magenta des bras
     *  (`light`) : c'est la teinte saturée qui porte sur l'arène blanche, la
     *  même que celle du fuseau. **Cette ligne avait été oubliée** à la passe de
     *  couleur du tourbillon — elle était restée au rose de l'ancienne palette,
     *  hors du bloc `look` et donc hors du balayage. C'est exactement le piège
     *  que le dépôt nomme (*une passe de couleur incomplète n'en est pas une*),
     *  et il ne suffit pas de relire `look` : un pouvoir porte ses propres
     *  couleurs. */
    ring: { to: 150, time: 0.35, color: 'rgba(203,47,173,0.9)', width: 7 },
  },

  /* ---------- POUVOIR SPÉCIAL — Fragmentation ---------- */
  /**
   * **Elle détache des morceaux de sa ceinture et les sème — demandé.**
   *
   * **Troisième créneau** (`special`), celui du Champ de givre et du Dôme de
   * drain : il ne remplace pas l'ultime, il s'ajoute, avec sa propre jauge au
   * HUD. Le patron est celui des Éclats de roche du Golem — anneau complet,
   * horloge fixe, aucune visée — mais ce qu'il **fait au personnage** n'a rien à
   * voir, et c'est tout l'intérêt :
   *
   *  • **il ne lui coûte rien — demandé** (« le pouvoir shed ne doit pas
   *    impacter sa vitesse »). Il a porté un `cost: 0.2` pendant une version :
   *    la salve retirait de l'élan, et le joueur voyait le nombre du HUD
   *    reculer au moment où les éclats partaient. C'était un prix *pensé* comme
   *    un prix de puissance, mais l'élan est **un seul nombre** qui fait vitesse
   *    *et* dégâts (voir `rush`) — donc tirer la **ralentissait**, ce qui n'a
   *    aucun sens pour une comète et se voyait à l'écran. Le séparer en deux
   *    états aurait été la seule façon de ne facturer que les dégâts, et c'est
   *    précisément ce que ce personnage refuse de faire ;
   *  • **il lui donne ce qu'elle n'avait pas : atteindre sans toucher.** Son
   *    banc le disait — elle s'effondre contre qui recule (3 victoires sur 16
   *    contre le Pistolero) parce que tout ce qu'elle produit demande d'aller au
   *    contact. Huit éclats en anneau menacent aussi **derrière elle**, ce qui
   *    est exactement ce qui manquait au combattant le plus rapide du roster :
   *    de quoi peser pendant qu'elle traverse l'arène.
   *
   * **Anneau complet et pas éventail**, comme le Golem : trois éclats répartis
   * sur 360° se lisent comme trois éclats qui partent n'importe où, huit se
   * lisent comme un anneau. Il n'y a donc aucune ouverture à régler, la
   * géométrie est fixée par `count`.
   */
  special: {
    id: 'shed',
    name: 'Fragmentation',
    nameRef: 'Shed',
    barLabel: 'SHED',
    barLabelFr: 'FRAGMENTATION',
    /** **Exactement la jauge de l'ultime**, et c'est la règle du dépôt : le
     *  Pistolero, le Ronin, l'Hoplite et le Shinobi peignent leurs deux rangées
     *  de la même encre. Elle était seule à déroger — violet de corps en bas,
     *  magenta en haut —, ce qui laissait croire à deux matières différentes là
     *  où il n'y a qu'un personnage. */
    barFill: '#cb2fad',
    barText: '#fbe6fb',
    /** Calé : **deux à trois salves** dans un duel de 30 s. 8 → 10 s à
     *  l'équilibrage final — c'est le levier qui dose la part du pouvoir dans
     *  sa production sans toucher à la lisibilité d'un éclat. */
    cooldown: 10,
    /** Première salve tôt — elle perd certains duels avant la deuxième. */
    first: 3,
    /** Huit, un éclat tous les 45° : c'est le seuil de lecture d'un anneau,
     *  mesuré par le Golem qui est passé de 3 à 8 pour cette raison. */
    count: 8,
    projectile: 'shard',
  },

  /* ---------- ULTIME — Rentrée ---------- */
  /**
   * **Quatre secondes et demie où la boucle n'a plus de coût.**
   *
   * Son élan est **tenu** au-dessus de tout ce qu'elle peut atteindre seule
   * (2,3, soit 2 415 px/s) et surtout **ses chocs ne lui coûtent plus rien** :
   * `rush.spend` ne s'applique pas.
   *
   * **Elle ne raccourcit plus le verrou**, et c'est une clé retirée : depuis
   * que le double compte est interdit par la séparation et non par une horloge,
   * le plancher de 0,12 s ne bride personne — le raccourcir pendant l'ultime
   * n'aurait rien changé, et une clé que plus personne ne lit ne crie pas
   * (invariant 9). C'est exactement l'ultime qu'appelle un personnage bâti sur une
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
    barFill: '#cb2fad',
    barText: '#fbe6fb',
    /** 12 s : entre le Soleil (7) et le Golem. Calé — il doit tomber deux à
     *  trois fois dans un duel, pas ponctuer chaque échange. */
    chargeRate: 100 / 12,
    /** Elle charge **en touchant**, comme tout le roster : c'est ce qui
     *  récompense le fait de revenir au contact plutôt que de tourner. */
    chargeOnHit: 4,
    duration: 4.5,
    /** L'élan tenu pendant toute la manœuvre. Calé. */
    rush: 2.3,
    /** Secousse de caméra à **chaque** choc de la Rentrée — petite (le Séisme
     *  du Golem vaut 16) parce qu'elle se répète une dizaine de fois. */
    shake: 6,
  },

  /**
   * **Un seul projectile, et ce sont ses propres débris.**
   *
   * Elle n'en avait aucun : tout passait par le contact. La Fragmentation lui
   * en donne, et ce n'est pas une arme de tir qu'on lui greffe — ce sont les
   * **morceaux de sa ceinture**, découpés dans la même maquette que son corps
   * (les composantes détachées du tourbillon).
   */
  projectiles: {
    shard: {
      label: 'Éclat de ceinture',
      labelRef: 'Belt Shard',
      /**
       * **Une seule silhouette, et c'est une mesure de rendu.**
       * `Projectiles.draw` tourne chaque projectile de son propre cap, donc les
       * huit éclats d'un anneau sont déjà orientés à 45° les uns des autres.
       * Trois avaient été découpées puis retirées — voir `pixelart/comet.js`.
       */
      sprite: 'cometShard',
      /** Carte de 8 px × 2,6 = ~21 px dessinés, un peu plus petit que l'éclat
       *  du Golem (24) : elle est elle-même le plus petit corps du roster. */
      scale: 2.6,
      /**
       * **Lents — 300 px/s, les plus lents du dépôt** (380 pour l'éclat du
       * Golem, 936 pour la balle du Pistolero). C'est voulu : ce sont des
       * débris qu'elle **sème**, pas des projectiles qu'elle tire. Un éclat
       * rapide aurait fait d'elle une tireuse, ce qu'elle n'est pas.
       */
      speed: 300,
      /**
       * **Calé au banc, et le levier le plus raide des trois nouveaux** :
       * 2 → 43 % de victoires contre les six, **3 → 66 %** à réglages de contact
       * égaux (20 duels par paire). Huit éclats × trois salves, c'est jusqu'à
       * 72 PV par duel sur une barre de 100 — d'où l'écart.
       *
       * À 2 elle était **plus faible qu'avant les pouvoirs là où elle l'était
       * déjà** (1 victoire sur 20 contre le Pistolero, contre 3 sur 16 avant) :
       * le pouvoir ne payait plus ce que son contact avait perdu. À 3 il le
       * paie. Reste faible devant son choc (4 à 6) : la Fragmentation est là
       * pour **atteindre ce qu'elle ne rattrape pas**, pas pour tuer.
       */
      damage: 3,
      radius: 10,
      /** 2,4 s à 300 px/s = 720 px, soit un peu plus que la diagonale utile de
       *  l'arène : un éclat qui ricoche une fois finit toujours sa course. */
      life: 2.4,
      bounces: 1,
      knockback: 60,
      trail: { color: 'rgba(84,15,139,0.38)', every: 0.04, life: 0.28 },
    },
  },

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
    color: '#ee82ec',
  },
});
