import { fiche } from '../defaults.js';
import { formatHalf } from '../format.js';

/* ==========================================================================
 *  LANCER — Lancier  (invité)
 *
 *  Troisième combattant venu de la chaîne « ballthingsim », relevé sur
 *  « Dragoon vs Outlaw » (576 × 1024, 33,6 s) — la vidéo dont le Hors-la-loi
 *  est déjà tiré, vue depuis l'autre camp. Toutes les cotes `mesuré`
 *  ci-dessous sortent de cette vidéo, converties ×1,25 vers le repère
 *  720 × 1280.
 * ========================================================================== */
export const LANCER = fiche({
  id: 'lancer',
  name: 'HOPLITE',
  nameRef: 'HOPLITE',
  tagline: 'Chargeur — pointe en avant, il frappe de plus en plus fort',
  taglineRef: 'Charger — spear first, and every hit lands harder',
  icon: 'iconLance',

  look: {
    /**
     * **Cuivre, comme sa lance.** Écart volontaire au relevé : la vidéo montre
     * une bille indigo `#574a84`, mais l'arme a été refaite d'après la
     * maquette, et la bille reprend sa teinte dominante — `#975938`, pipettée
     * sur la hampe.
     *
     * **C'est le cuivre clair, pas le cuivre moyen, et c'est délibéré.** La
     * teinte dominante de la hampe est `#975938` — mais le Hors-la-loi est à
     * `#8a5934`, soit 13 unités de rouge d'écart : dans leur duel, les deux
     * billes et les deux titres devenaient indiscernables. `#c9905f` est le
     * cuivre de la facette éclairée du fer de lance, donc toujours « la
     * couleur de l'arme », et il s'en détache nettement (63, 55, 43 d'écart).
     */
    /**
     * Violet de la hampe de la lance électrique — la bille suit l'arme, comme
     * elle suivait le cuivre avant elle.
     *
     * Retour, de fait, tout près de l'indigo `#574a84` **mesuré** sur la
     * vidéo : c'est le détour par le cuivre qui était l'écart, pas celui-ci.
     * Et la teinte reste distincte de l'Ombre (`#870286`), qui est un magenta
     * — rouge dominant, là où celui-ci a le bleu dominant.
     */
    body: '#7046ac',
    bodyHit: '#e4e4e6', // mesuré : le disque touché blanchit, comme les deux autres invités
    outline: '#181008',
    /** Mesuré : PV en blanc cerné de noir. Ce moteur ne cerne pas le chiffre
     *  (voir le Bretteur) : sur le cuivre clair, le crème mesuré se noie, donc
     *  le chiffre passe en brun sombre. Même écart volontaire, même raison. */
    /** Retour au crème **mesuré**. Il avait dû passer en brun sombre parce que
     *  le cuivre clair de la bille le noyait ; sur ce violet profond, le crème
     *  d'origine repasse sans peine. */
    hpColor: '#f5f2ea',
    aura: {
      /**
       * Halo de la bille, passé au **jaune de foudre**. Attention au fond :
       * l'arène est **blanche**, donc un jaune pâle y serait invisible — c'est
       * la même leçon que le mode additif, qui ne marchait que sur le cadre
       * sombre. On prend donc un ambre saturé, pas un jaune clair.
       */
      color: 'rgba(240,176,0,0.5)',
      radius: 1.66,
      pulse: 2.2,
      showWhen: 'ultimate-ready', // halo cuivre quand le Bond est chargé
    },
    /**
     * La traînée du Lancier est la signature la plus visible de sa vidéo : un
     * **fuseau cramoisi** derrière la bille indigo, mesuré `#a32b4a` au cœur et
     * `#df8692` sur les bords. C'est le seul rouge de sa palette, et il est
     * rendu ici par le ruban de pointe d'arme.
     */
    flair: {
      /**
       * Les boucles qui entourent la lance : c'est la **pointe d'arme** qui les
       * trace en tournant.
       *
       * Mesuré cramoisi `#c2385a` sur la vidéo. Passé au **violet électrique**
       * avec l'arme : une traînée cramoisie derrière une lance violette lisait
       * comme deux personnages superposés. C'est un écart volontaire, du même
       * lot que la bille et la jauge.
       */
      // Affiné depuis 18 : pendant une charge la pointe parcourt 224 px en
      // 0,16 s, donc deux points de ruban consécutifs sont très écartés et un
      // trait épais à bouts ronds se referme en **barres pâles** détachées du
      // combattant. À 13, la traînée redevient un trait.
      /**
       * `electric` : la traînée est **cassée** au lieu d'être lisse, et tracée
       * d'un seul trait continu en deux passes — halo ambre puis cœur clair.
       *
       * L'amplitude s'annule au point le plus récent, sinon la traînée se
       * décrocherait de la pointe de l'arme et flotterait à côté du
       * combattant. `rate` a le même rôle que sur les arcs de lame : à 60
       * paliers par seconde on obtient du grain, à 16 on lit un éclair.
       */
      ribbon: {
        color: '#f0b400',
        width: 13,
        alpha: 0.55,
        electric: { core: '#fff6c0', glow: '#e0a800', coreWidth: 2.4, jitter: 16, rate: 16 },
      },
      /** Le fuseau **derrière la bille**, l'autre moitié de sa signature, et
       *  ce que le premier portage avait oublié : le ruban ne suit que la
       *  pointe d'arme. Seul combattant du roster à en porter un. Mesuré
       *  `#a32b4a` au cœur, large au ras du corps et effilé vers l'arrière. */
      /**
       * Le fuseau devient lui aussi électrique. Il est **large et peu opaque**
       * là où le ruban est fin et vif : c'est lui qui donne le corps de la
       * traînée, le ruban qui donne le nerf. Sa cassure est plus ample et plus
       * lente, sinon les deux tracés grésillent à l'identique et se lisent
       * comme un seul trait épais.
       */
      smear: {
        color: '#c98a00',
        width: 30,
        alpha: 0.4,
        electric: { core: '#f0b400', glow: '#c98a00', coreWidth: 5, jitter: 34, rate: 11 },
      },
      /**
       * **Images fantômes de la charge.** Mesuré : pendant une charge, la
       * traînée n'est pas un trait mais une **bande de billes qui se
       * recouvrent**, cramoisie, avec la lance répétée dans chacune (visible
       * image par image entre 8,60 et 8,83 s). C'est ce que le fuseau seul ne
       * pouvait pas rendre : il ne garde qu'un point par pas, donc pas d'angle
       * d'arme. Le compteur `Fighter.ghosting` décide quand en semer ; c'est
       * `render/flair.js` qui les dessine, donc ils ne peuvent rien changer au
       * duel.
       */
      ghost: { color: '#e0a800', every: 0.03, alpha: 0.5, lance: 20 },
      /**
       * **Aura d'arme** — halo le long de la lame, tracé sur `bladeSegment()`,
       * donc solidaire de la portée *et* du décalage latéral de l'arme.
       *
       * `boostAlpha` est l'intensité pendant la charge : l'aura se gonfle quand
       * la lance part, ce qui annonce le coup sans qu'aucune valeur d'attaque
       * ne soit lue par le rendu. Le battement est un `sin` du temps, pas un
       * tirage — inutile de consommer `viewRng` pour ça.
       */
      weaponAura: {
        color: '#e0a800',
        core: '#fff3a8',
        /**
         * Calé au rendu, et resserré depuis 26 : à cette largeur, les trois
         * passes formaient une **gélule** opaque qui délavait la hampe au lieu
         * de la cerner — l'aura mangeait le sprite qu'elle est censée mettre
         * en valeur. À 14, elle le borde.
         */
        width: 14,
        alpha: 0.22,
        boostAlpha: 0.4,
        pulse: 5.5,
      },
      /**
       * **Arcs électriques le long de la lame.** Ils quittent la lame et y
       * reviennent — l'amplitude est modulée par un sinus qui s'annule aux deux
       * bouts — et grésillent au rythme de `rate` paliers par seconde.
       *
       * `rate` est le paramètre qui décide si c'est de l'électricité ou du
       * bruit : retiré à chaque image (60/s), le tracé donne du grain de
       * télévision. À 18 paliers par seconde, l'œil suit chaque arc assez
       * longtemps pour le lire comme un éclair.
       */
      weaponArc: {
        count: 7,
        steps: 6,
        span: 0.42,
        /**
         * Amplitude, en px. **Elle doit dépasser la demi-épaisseur du sprite**
         * — la lance fait ~55 px de haut dessinée, donc 27 de demi-épaisseur.
         * À 13, les arcs restaient entièrement dans la silhouette et on ne
         * voyait rien du tout : ils sont dessinés derrière l'arme, qui les
         * recouvrait intégralement.
         */
        jitter: 38,
        rate: 18,
        boost: 1.6,
        core: '#fff6c0',
        glow: '#f0b400',
        coreWidth: 2,
        glowWidth: 6.5,
        alpha: 0.85,
      },
      /**
       * **Onde de pénétration**, pendant la charge seulement (conditionnée à
       * `Fighter.boost`). Un sillage en coin ouvert **vers l'arrière** depuis la
       * pointe — ouvert vers l'avant, il se lirait comme un projectile — et un
       * arc de proue juste devant elle.
       */
      pierce: {
        color: 'rgba(240,176,0,0.5)',
        core: '#fff6c0',
        // Long et étroit : au premier réglage (60 × 26) le coin se lisait
        // comme une **boule** collée à la pointe. C'est l'élancement qui fait
        // lire « ça transperce ».
        length: 82,
        width: 12,
        alpha: 0.34,
        bow: 16,
        bowGap: 9,
        bowWidth: 2.5,
      },
      motes: { rate: 10, size: 9, drift: 24, rise: -18, colors: ['#ffd83d', '#c98a00', '#fff6c0'] },
      impact: ['#fff6c0', '#ffffff', '#e0a800'],
      shape: 'spark',
      castFlash: 'rgba(240,190,40,0.6)',
    },
    trail: { color: 'rgba(201,138,0,0.30)', every: 0.04, life: 0.32 },
    accent: '#f0b400',
  },

  /**
   * **Bruitages** (recettes dans `data/sound.js`). Sa touche est un `pierce` et
   * non un `blade` : 164 px de portée, une pointe, et le son doit dire *piqué*
   * là où le Ronin dit *tranché*.
   */
  sound: {
    pitch: 0.95,
    shot: null,
    hit: 'pierce',
    impact: 'impact',
    bounce: 'thud',
    /** La charge : un souffle qui monte, posé au départ de la ruée. */
    ability: 'dash',
    /** Le dôme est une nappe entretenue, donc un bourdon et pas un impact. */
    special: 'hum',
    /**
     * **Le décollage, et d'abord l'appui.** L'ultime commence par un bond, et
     * il est le seul du roster à quitter l'arène (`offstage`). `riser` faisait
     * décoller quelque chose qui n'avait jamais touché terre : `vault` pose la
     * poussée au sol avant le corps qui s'éloigne.
     */
    ultimate: 'vault',
    /**
     * **Créneau propre à l'Hoplite**, lu par son seul module : la Foudre
     * tombante a deux instants, et un seul son n'aurait pas pu dire les deux.
     * `riser` part au décollage, `zap` à l'arrivée.
     */
    strike: 'zap',
  },

  /** Mesuré 432 px/s (médiane de 37 segments rectilignes, bille isolée par
   *  érosion pour ne pas suivre la lance) → ×1,25 = 540. **Gardé tel quel**,
   *  contrairement au Hors-la-loi et au Bretteur qui ont dû être ralentis :
   *  vérifié au banc, le Lancier fait 15 victoires sur 30 à 540 px/s contre 16
   *  à 470 — sa vitesse n'est pas ce qui le rend fort, c'est sa portée et ses
   *  dégâts. Aucune raison de toucher un `mesuré` qui ne casse rien.
   *  C'est le combattant le plus rapide du roster après le Bretteur. */
  /**
   * **`seek: 0` — le déplacement est rectiligne.** `Fighter.step` ne fait
   * tourner le corps vers l'adversaire que si `seek > 0` ; à zéro, le Lancier
   * file droit et ne change de direction qu'aux rebonds sur les murs et à ses
   * propres charges. C'est ce qui distingue ce personnage des dix autres, qui
   * pilotent tous vers leur cible.
   */
  movement: { speed: 430, turnRate: 1.85, seek: 0 },

  weapon: {
    name: 'Lance d’orage',
    nameRef: 'Storm Spear',
    /** Mesuré : centre → pointe = 131 px sur la vidéo 576 → ×1,25 = 164.
     *  **La plus longue portée du roster.** Elle découle du sprite :
     *  −52 (talon) + 54 cellules × 4 = 164, pour que hitbox et dessin ne
     *  puissent pas diverger quand on retouche la carte. */
    reach: 164,
    /**
     * **La lance suit le cap de déplacement.** Elle ne tourne pas librement et
     * ne vise pas non plus : elle est *soudée à la vitesse*, et pointe là où le
     * Lancier va.
     *
     * Relevé sur 141 images réparties sur toute la vidéo, lance isolée par ACP
     * de son contour sombre (les fantômes translucides et la traînée cramoisie
     * sont écartés par seuil) : l'axe de la lance tient à **6,6° du cap de
     * déplacement** en médiane — 3,7° sur les images où elle est le mieux
     * isolée, et 94 % sous 15° — contre **37,9° du cap vers l'adversaire**.
     * Le résultat tient à tous les régimes : 10,6° en marche lente, 6,1° en
     * croisière, 4,8° à l'accélération, 6,1° en pleine charge.
     *
     * Les deux relevés précédents étaient faux, chacun à sa façon. Le premier
     * donnait 327 °/s de rotation libre : le détecteur suivait la **traînée**,
     * pas l'arme. Le second concluait « elle vise, à ±5° » — mesuré sur les
     * seules plages où le Lancier fonçait *sur* l'adversaire, où cap de
     * déplacement et cap adverse se confondent. Un sous-ensemble biaisé.
     *
     * Ce que ça explique, et que ni l'un ni l'autre ne rendait : l'angle reste
     * **figé une demi-seconde** quand il va tout droit (2,13 → 2,67 s, moins de
     * 10° d'écart), **saute de 85° en une image** au rebond mural
     * (2,667 → 2,700 s, là où `heading` est réfléchi), et tourne lentement le
     * reste du temps — |ω| médian **33 °/s**, 88 % des images sous 100 °/s.
     * Toutes ces valeurs tombent d'elles-mêmes si `weaponAngle = heading` :
     * c'est le pilotage qui les produit, pas une règle d'arme.
     *
     * D'où `spin: 0` — `Fighter.step` n'écrit pas l'angle — et c'est
     * `abilities/lancer.js` qui le recopie du cap à chaque pas.
     */
    spin: 0,
    spinDir: 1,
    /**
     * **Charge de lance.** Le Lancier accélère en ligne droite, pointe en
     * avant. Il n'y a plus ni visée ni verrouillage : la lance suivant le cap,
     * elle est *déjà* dans l'axe de la charge — il suffit de partir quand
     * l'adversaire s'y trouve.
     *
     * Mesuré : la charge porte la bille à ~1 400 px/s pendant ~0,15 s, contre
     * 540 en croisière (t = 8,70 → 8,84 s sur la vidéo).
     */
    lunge: {
      /**
       * **Vitesse de balayage de la lance**, en rad/s. C'est le seul mouvement
       * propre du personnage hors charge : le corps va tout droit, la lance
       * tourne, et la charge part quand l'axe croise l'adversaire.
       *
       * Calée sur la **fréquence de charge relevée** — une toutes les 1,0 à
       * 1,7 s sur les deux vidéos. Un demi-tour à 4 rad/s prend 0,79 s, et
       * comme l'adversaire bouge aussi, on croise un peu plus souvent que ça.
       */
      scanSpin: 5.5,
      /**
       * Tolérance de verrouillage, en radians. Le balayage avance de
       * `scanSpin × dt` = 0,067 rad par pas à 60 Hz : en dessous de ça,
       * l'axe pourrait enjamber l'adversaire sans jamais le « croiser ».
       */
      aim: 0.1,
      /**
       * **Temps de verrouillage avant la charge**, en secondes. Court : c'est
       * le battement qui rend l'intention lisible, pas une attente. Il valait
       * 0,05 plus un moulinet de 0,10 — soit 0,15 de pause cumulée, jugée trop
       * longue. Le moulinet a disparu : le balayage de `seek` le remplace,
       * l'arme tourne déjà en permanence.
       */
      brace: 0.18,
      /**
       * Garde-fou de durée de charge. La charge s'arrête normalement **au mur**
       * (`Fighter.wall`) ; ce plafond n'existe que pour qu'une charge lancée le
       * long d'une paroi ne puisse pas bloquer la machine d'états. À 540 × 3,6
       * = 1 944 px/s, 0,6 s couvre 1 166 px, soit près de deux fois la diagonale
       * de l'arène.
       */
      dashMax: 0.6,
      /** Mesuré **1 392 px/s vidéo sur A et 1 770 sur B** ; 3,6 × 540 = 1 944
       *  logiques, soit 1 555 en repère vidéo — dans la fourchette. */
      speed: 3.6,
      /** Temps mort après la charge. Court : la vidéo enchaîne. */
      recover: 0.08,
      /** Verrou de touche hors charge — voir le garde-fou dans le module. */
      guard: 0.05,
      /** Décalage latéral de l'ancrage, hors charge. */
      lateral: 36,
      /** Calé : le recul propre à la charge, ajouté à `melee.selfRecoil`. */
      recoil: 240,
      dashRing: 'rgba(240,176,0,0.55)',
      hitRing: { to: 96, time: 0.26, color: 'rgba(255,230,150,0.75)' },
    },
    /** `width: 0` : rien à tracer, toute la lance tient dans `lancerSpear`.
     *  `length` est **négatif** parce que le talon dépasse derrière le pivot
     *  (**42 px** remesurés en aplatissant la lance, arrondis à 44 pour tomber
     *  sur la grille du sprite) — le blit démarre donc en arrière de la bille,
     *  ce que ne fait aucune autre arme du roster. */
    handle: { length: -44, width: 0, color: '#4c2d80', dark: '#210f3e', outline: '#080211', gem: null },
    /** `scale` n'est plus rond parce que la carte fait la taille de l'artwork
     *  et non celle d'un cadre choisi : 201 × 1,03483 = 208,0 px logiques, donc
     *  la pointe tombe à −44 + 208 = **164**, la portée relevée. */
    head: { sprite: 'lancerSpear', scale: 1.03483 },
    /**
     * **L'arme passe par-dessus la bille.** Mesuré : sur la vidéo, la lance
     * recouvre franchement le disque, contour compris. C'est l'inverse des dix
     * autres combattants, dont l'arme passe dessous — d'où le drapeau, porté
     * par la fiche et non par le moteur.
     *
     * `fighter.js` la pose alors **en dernier**, après le contour, les anneaux
     * d'état *et* le chiffre de PV. Ce commentaire a longtemps décrit l'inverse
     * (« avant le chiffre »), et c'était vrai d'une version antérieure du
     * moteur : l'arme passait juste avant, pour garder le chiffre lisible, mais
     * les digits traversaient la lance — ce qui se lit exactement comme une arme
     * *derrière* la balle. Un demi-dessus se lit comme un dessous.
     *
     * Contrepartie assumée, et c'est l'écart avec le Ronin et le Golem : pendant
     * une charge, la lance peut masquer une partie du chiffre. Les deux autres
     * posent `look.hpOverWeapon` pour l'éviter, l'Hoplite non — sa lance ne
     * recouvre le centre qu'en charge.
     */
    overBody: true,
    /** Seule la lame tranche : elle commence à 52 px du centre (fraction 0,32),
     *  le talon et le manche ne comptent pas. Rayon volontairement fin — une
     *  arme aussi longue touche sans arrêt avec un gros rayon. */
    hitbox: { from: 0.32, radius: 12 },
    melee: {
      /** Mesuré : la stat « Damage » part de 10,00 et monte de 2,00 par touche
       *  portée — 10 → 12 → 14 → 16 → 18 → 20 sur la vidéo, avec des chutes de
       *  PV de l'Outlaw exactement égales (100 → 90 → 78 → 64 → 48 → 30).
       *  Six touches ont suffi. Aucun plafond n'est visible sur 33,6 s.
       *  **Écart assumé, demandé** : départ à 8 au lieu de 10, puis **divisé
       *  par deux sur demande** — voir `progression.stack` et `onHit` plus bas
       *  pour la même division. */
      damage: (f) => Math.max(4, Math.round(f.stacks)),
      /**
       * **Mesuré, et c'est la charge qui l'a rendu au relevé.** Sur la vidéo
       * les touches de lance tombent à 13,63 / 14,77 / 16,37 s : le verrou réel
       * est d'environ **1,1 s**, comme le reste du roster.
       *
       * Il a longtemps valu 6 s, et c'était le seul écart au relevé qui
       * subsistait. La raison : une lance de 164 px qui **balaie en tournant**
       * accroche 0,34 fois par seconde là où la vidéo en compte 0,181, et seul
       * un verrou absurde ramenait la cadence. Le mécanisme était faux, pas le
       * chiffre — et le maquillage coûtait au personnage tout son relief, un
       * Lancier au métronome qui tuait en 43,2 s exactement quel que soit
       * l'adversaire.
       *
       * La charge (`weapon.lunge`) rend le mécanisme : le Lancier ne touche
       * plus par hasard en balayant, il touche quand sa charge aboutit. La
       * cadence est désormais portée par `lunge.recover`, et le verrou peut
       * reprendre sa valeur relevée.
       */
      cooldown: 1.1,
      /**
       * **Recul, des deux côtés.** Relevé à 300 / 95 ; monté à 460 / 200 pour
       * donner du poids à l'impact — écart volontaire de mise en scène.
       *
       * C'est l'**amplitude** qu'on augmente et pas l'amortissement, parce que
       * celui-ci est global (`PHYSICS.speedRecovery`, partagé par les onze) :
       * le rendre plus sec ici le rendrait plus sec pour tout le monde. Une
       * impulsion plus grande sous le même amortissement donne exactement le
       * coup sec cherché — départ franc, résorption inchangée.
       *
       * 460 est au-dessus de tout le roster en mêlée (205 à 300) ; c'est
       * assumé : le Lancier est le seul à frapper lancé à 1 400 px/s.
       */
      knockback: 460,
      /**
       * **Symétrique** : action et réaction. Il valait 200 contre 460 encaissés,
       * et un choc qui pousse deux fois plus fort d'un côté se lit comme un coup
       * absorbé, pas comme un impact.
       */
      selfRecoil: 460,
      /**
       * Mesuré à l'origine : **+2,00 par touche portée**, relevé au PV près. La
       * stat passait 10 → 12 → 14 → 16 → 18 → 20 aux instants 12,53 / 13,63 /
       * 14,77 / 16,37 / 21,00 s, et l'Outlaw descendait de 100 à 30 PV :
       * 10+12+14+16+18 = 70, exactement les cinq touches placées.
       *
       * **Écart assumé, demandé** : le gain passe à **+1,00 par touche**,
       * départ à 8 (`progression.stack` et le plancher de `damage` ci-dessus).
       * Le plafond reste 16, désormais **déduit** de la même règle que les
       * autres combattants à stat croissante — sans plafond la montée est
       * quadratique en durée de duel. À gain divisé par deux, il faut deux
       * fois plus de touches pour l'atteindre : la matrice doit être
       * regénérée et comparée après ce changement (invariant 3).
       *
       * **Tout redivisé par deux, demandé** : gain, plafond et départ suivent
       * ensemble, pour garder le même nombre de touches jusqu'au plafond.
       */
      onHit: { stackGain: 0.5, stackMax: 8 },
    },
  },

  /**
   * Le Lancier n'a **aucun pouvoir actif** dans la vidéo : sa seule ligne de
   * stat est « Damage », et elle ne bouge qu'aux touches. La montée en dégâts
   * *est* son pouvoir ; elle est décrite dans `weapon.melee.onHit`.
   * Ce cooldown n'est jamais consommé (le module n'arme aucune minuterie),
   * mais la fiche doit en porter un : le moteur le lit à la construction.
   */
  ability: {
    id: 'lancersFury',
    name: 'Charge de lance',
    nameRef: 'Spear Charge',
    cooldown: Infinity,
    cooldownStep: 0,
    cooldownFloor: Infinity,
  },

  ultimate: {
    id: 'jump',
    name: 'Foudre tombante',
    nameRef: 'THUNDERFALL',
    barLabel: 'THUNDERFALL',
    barLabelFr: 'FOUDRE TOMBANTE',
    /** **Écart assumé, demandé.** La jauge suivait la teinte du corps
     *  (`#5d3d8e`, le violet sombre de la hampe). Reprend maintenant
     *  exactement la couleur de la jauge du Dôme de drain juste en dessous :
     *  les deux jauges d'un combattant doivent se lire comme une paire —
     *  taille, police (déjà partagées via `HUD.bar`/`HUD.special`) et
     *  désormais couleur aussi. */
    barFill: '#7c3aed',
    barText: '#f3e8ff',
    /** Mesuré : +0,10 de remplissage par seconde, donc jauge pleine en ~10 s. */
    chargeRate: 10,
    /** Mesuré : marches de ~8 % à chaque touche portée. */
    chargeOnHit: 8,
    /**
     * Durée totale pendant laquelle la jauge reste vide et le Bond occupe le
     * Lancier : 0,45 s d'élan puis 1,5 s hors de l'arène. Chronométré deux
     * fois : jauge vidée à 10,60 s / décollage 11,02 s / retour 12,53 s, puis
     * 19,03 / 19,50 / 21,00.
     */
    duration: 1.95,
    windup: 0.45, // mesuré : 0,42 s et 0,47 s entre la vidange et le décollage
    /**
     * Mesuré : **1,51 s et 1,50 s d'absence**, rechronométré image par image
     * sur le premier bond (dernière image du Lancier à 11,03 s, marqueur seul
     * jusqu'à 12,53 s). Un temps de vol court — de l'ordre d'une demi-seconde —
     * ne laisserait pas au marqueur le temps d'enfler puis de se resserrer,
     * qui est ce qui annonce la chute et rend le Bond lisible.
     */
    flight: 1.5,
    /**
     * **Onde de choc au décollage.** Le Lancier disparaît d'une image à
     * l'autre : sans une marque au point de départ, rien ne dit d'où il est
     * parti. Disque gris qui s'ouvre, comme le marqueur d'arrivée — les deux
     * bouts du bond se répondent.
     */
    liftoff: { to: 190, time: 0.4, color: 'rgba(120,116,124,0.6)', width: 7 },
    /**
     * Chute **collée à l'adversaire** : le décalage vaut cette fraction de la
     * somme des deux rayons. À 0, les deux billes se superposent et
     * `resolveBodies` les sépare aussitôt, ce qui fait sauter le Lancier d'une
     * image à l'autre au moment précis où on le regarde.
     */
    landOffset: 0.9,
    /**
     * Marqueur au sol : un disque gris qui **suit l'adversaire** pendant tout
     * le vol. Il enfle pendant la montée puis se resserre jusqu'au corps —
     * c'est ce resserrement qui annonce l'impact (mesuré : ~100 px de rayon à
     * mi-vol, ~55 px juste avant la chute).
     */
    marker: {
      grow: 2.5, // × rayon de la bille, au sommet du bond
      land: 1.35, // × rayon de la bille, à l'instant de la chute
      fill: 'rgba(120,116,124,0.30)',
      edge: 'rgba(90,86,96,0.55)',
      edgeWidth: 3,
    },
    /**
     * Chute. Les dégâts sont ceux de la lance au moment de l'impact : sur la
     * vidéo l'Outlaw passe de 100 à 90 PV alors que le HUD affiche
     * « Damage: 10.00 », et la stat monte ensuite comme après une touche.
     */
    impact: {
      radius: 110, // mesuré : disque rose de ~106 px
      knockback: 520,
      ring: { to: 225, time: 0.35, color: 'rgba(150,146,156,0.8)', width: 6 }, // mesuré
      flash: 'rgba(255,255,255,0.55)', // l'arène blanchit d'un coup à la chute
      shake: 14,
      sparks: 34,
    },
  },

  /**
   * **LIEN D'ESSENCE — pouvoir spécial, repris tel quel de l'Ombre.**
   *
   * Même montage que le Blizzard du Hors-la-loi : un troisième créneau, sa
   * propre minuterie, aucun contact avec `ability` ni avec le Bond. Pas de
   * jauge non plus, pour la même raison — le HUD n'en a qu'une.
   *
   * **Le dôme est figé à l'endroit de l'incantation** (`anchored`), et c'est
   * ce qui compte pour ce combattant-ci : le Lancier traverse l'arène en
   * charge, un dôme qui le suivrait balaierait tout le terrain. Ancré, il
   * marque le point d'où le lien part, et le lien s'étire quand le Lancier
   * charge — ce qui donne au drain une lecture que l'Ombre, immobile, n'a
   * jamais eue.
   *
   * Deux différences avec la fiche de l'Ombre, et seulement deux :
   *
   *   - le **rayon du dôme** tombe de 265 à 200. À 265 il couvrait plus de la
   *     moitié de l'arène (640 px de côté), donc les deux combattants
   *     restaient dedans en permanence et le dôme cessait d'être un lieu ;
   *   - le **drain** passe de 1 PV / 0,4 s à 1 PV / 0,5 s. Le Lancier gagnait
   *     déjà 29 duels sur 30 ; lui ajouter 2,5 PV/s gratuits n'aurait pas
   *     demandé de mesure pour savoir où ça allait.
   *
   * La teinte, elle, reste **celle de l'Ombre** : violet `#7c3aed`. C'est
   * fortuit mais commode — le Lancier est déjà violet, le lien se lit comme
   * le sien et non comme un emprunt.
   */
  special: {
    id: 'essenceTether',
    name: 'Dôme de drain',
    nameRef: 'Drain Dome',
    barLabel: 'DRAIN DOME',
    barLabelFr: 'DÔME DE DRAIN',
    barFill: '#7c3aed',
    barText: '#f3e8ff',
    /** Calé, comme le Blizzard, sur la durée des duels du roster réduit. */
    cooldown: 11,
    first: 5,
    duration: 5.65, // repris de l'Ombre, mesuré deux fois sur sa vidéo
    dome: {
      radius: 200,
      /** Le dôme **déborde de l'arène** : dans la vidéo de l'Ombre il
       *  recouvre le HUD. Il est donc dessiné par `drawUnbounded`. */
      clipToArena: false,
      fill: 'rgba(30,24,45,0.88)', // pipette sur la vidéo de l'Ombre
      edge: 'rgba(76,29,149,0.95)',
      edgeWidth: 4,
      sparks: 90, // poussière violette qui dérive dans le dôme
      sparkColors: ['#a855f7', '#c4b5fd', '#ffffff', '#6d28d9'],
      anchored: true,
    },
    tether: {
      color: '#7c3aed',
      core: 'rgba(255,255,255,0.55)',
      width: 5,
      tickInterval: 0.5,
      tickDamage: 0.5, // divisé par deux, demandé
      slow: 0.15, // ralentit la cible tant que le lien tient
      motes: 26,
    },
  },

  /** Le Lancier n'a aucun projectile : tout passe par la lance et le Bond. */
  projectiles: {},

  /** Mesuré à l'origine : « Damage: 10.00 » à la première image du duel.
   *  **Écart assumé, demandé** : départ à 8, puis divisé par deux sur demande
   *  — voir `weapon.melee` ci-dessus. */
  progression: { stack: 4, stack2: 0 },

  hud: {
    stats: [(f) => `Damage: ${formatHalf(f.stacks)}`],
    statsFr: [(f) => `Dégâts : ${formatHalf(f.stacks)}`],
    // Violet clair : sur l'encre sombre du chrome, le violet de la bille
    // manquerait de contraste.
    color: '#9d7bc8',
  },
});
