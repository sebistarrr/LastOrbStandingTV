/**
 * Pouvoirs de la COMÈTE — le combattant sans arme dont la vitesse est l'arme.
 *
 *  • **Le choc cinétique** (mécanique de base) — elle n'a **aucune arme** au
 *    sens du moteur (`reach: 0`, `hitbox.radius: 0`), donc `resolveMelee` ne
 *    tourne jamais pour elle : ses coups sont appelés **d'ici**, au contact des
 *    corps, et leur montant suit son élan.
 *  • **Coup de fouet** (`ability`) — horloge fixe, aucune visée : toutes les
 *    6 s, son élan saute au-dessus de son propre plafond. Le pouvoir n'a pas de
 *    durée ; ce qu'il donne, elle le garde jusqu'au prochain choc.
 *  • **Rentrée** (`ultimate`) — 4,5 s pendant lesquelles l'élan est **tenu** au
 *    maximum, le verrou de touche tombe de moitié et **les chocs ne coûtent
 *    plus rien**. Un ultime qui retire une contrainte, pas qui ajoute un coup.
 *
 * **L'élan est un seul nombre, et c'est délibéré.** `f.state.rush` est à la
 * fois son facteur de vitesse — via `f.boost`/`f.boostFactor`, les compteurs
 * génériques de l'invariant 7 — et son facteur de dégâts. Deux états séparés
 * auraient divergé au premier réglage, et le HUD n'aurait plus dit la vérité.
 *
 * **Les quatre règles du dépôt qui pèsent le plus ici.**
 *
 * 1. *Un test « les corps se touchent » est toujours faux* : `resolveBodies`
 *    sépare les corps à chaque pas, donc `distance <= r1 + r2` n'est vrai dans
 *    aucune image. La Marée de la première LUNE a infligé **0 PV sur 24 duels**
 *    pour cette exacte raison. D'où `kinetic.margin`, explicite dans la fiche.
 * 2. *`alive` ≠ `onStage`* (invariant 8) : un adversaire en plein Bond de
 *    l'Hoplite est vivant mais **absent du plateau**. Le percuter à son dernier
 *    point connu serait le bug documenté.
 * 3. *Le flux de simulation* (invariant 2) : ce module **ne tire nulle part**,
 *    ni `game.rng` ni `game.viewRng`. L'élan suit une rampe, le choc suit une
 *    géométrie, et tout le dessin est déduit de l'état.
 * 4. *Un seul point de sortie* : `endReentry()` remet ensemble la jauge, l'élan,
 *    les images fantômes et le verrou. Dispersés, ils laisseraient la Comète à
 *    1 610 px/s pour le reste du duel — exactement la régression que la Ruée du
 *    Ronin a déjà payée.
 *
 * @module game/abilities/comet
 */

import { TAU } from '../../core/math.js';

/**
 * `#rrggbb` de la fiche + opacité → `rgba(...)`.
 *
 * **Aucune couleur littérale dans ce module**, et c'est la leçon du Soleil :
 * onze orange codés en dur avaient suffi à faire dériver son rayon du dessin de
 * l'astre qui le tire. Tout vient de `look.palette`.
 */
function teinte(hex, alpha = 1) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export const cometAbilities = {
  id: 'comet',

  init(f) {
    /** **L'élan** : facteur de vitesse *et* de dégâts, de 1 à `rush.max` — et
     *  au-delà quand le Coup de fouet ou la Rentrée le poussent. Lu par le HUD
     *  autant que par le moteur, à travers `f.boostFactor`. */
    f.state.rush = 1;
    /** Verrou de touche, le rôle que `melee.cooldown` joue pour les autres.
     *  Elle n'a pas d'arme, donc le moteur n'en pose aucun : sans ce compteur,
     *  un contact qui dure trois images ferait trois coups. */
    f.state.hitCd = 0;
    /** Horloge de la Fragmentation, et la portée d'horloge que la jauge du
     *  troisième créneau doit couvrir. `first` est plus court que `cooldown`,
     *  donc les deux ne se confondent pas : sans `specSpan`, la première jauge
     *  se remplirait à la mauvaise échelle. Même forme que le Golem. */
    f.state.specCd = f.el.special.first;
    f.state.specSpan = f.el.special.first;
  },

  update(f, dt, now, game) {
    const el = f.el;
    const ult = el.ultimate;

    /* ---------- ultime : pas d'annonce, juste une fenêtre ---------------- */
    if (f.ult.active > 0) {
      f.ult.active -= dt;
      if (f.ult.active <= 0) this.endReentry(f);
    } else if (game.phase === 'fight') {
      f.ult.charge = Math.min(100, f.ult.charge + ult.chargeRate * dt);
      f.ult.ready = f.ult.charge >= 100;
      if (f.ult.ready) this.castReentry(f, game);
    }

    /**
     * **L'élan se tient même hors combat**, sinon la bascule de phase le
     * couperait net et la Comète repartirait au ralenti à l'ouverture — le
     * bridage se lirait comme un bug de vitesse.
     */
    if (game.phase !== 'fight') {
      this.syncRush(f);
      return;
    }

    /* ---------- l'élan : il monte tant qu'elle ne touche personne -------- */
    const r = el.rush;
    if (f.ult.active > 0) {
      f.state.rush = ult.rush; // tenu : la Rentrée le met au-dessus de tout
    } else if (f.state.rush < r.max) {
      f.state.rush = Math.min(r.max, f.state.rush + ((r.max - 1) / r.ramp) * dt);
    }
    this.syncRush(f);

    /**
     * **Rebond : le mur lui rend de l'élan.**
     *
     * `f.wall` est posé par `Fighter.step()`, qui tourne **avant** ce module —
     * on lit donc le rebond du pas courant. C'était jusqu'ici un marquage de
     * pure mise en scène (le bruitage de rebond) ; le lire ne change rien pour
     * les neuf autres combattants.
     *
     * Le plafond est **le sien** (`bounce.cap`, 1,7), au-dessus de la rampe
     * (1,5) et en dessous du Coup de fouet (1,9) : un mur va plus loin que le
     * temps seul, jamais aussi loin qu'un pouvoir. Et on compte **un gain par
     * pas** : un rebond de coin pose `wall` deux fois dans la même image, ce
     * qui reste un seul rebond à l'écran.
     */
    const bd = r.bounce;
    if (f.wall && f.ult.active <= 0 && f.state.rush < bd.cap) {
      f.state.rush = Math.min(bd.cap, f.state.rush + bd.gain);
      this.syncRush(f);
    }

    /* ---------- Fragmentation : horloge fixe, anneau complet ------------- */
    f.state.specCd -= dt;
    if (f.state.specCd <= 0) {
      f.state.specCd = el.special.cooldown;
      f.state.specSpan = el.special.cooldown;
      this.castShed(f, game);
    }

    /* ---------- Coup de fouet : horloge fixe, aucune visée --------------- */
    f.ability.timer -= dt;
    if (f.ability.timer <= 0) {
      f.ability.timer = el.ability.cooldown;
      f.ability.uses += 1;
      this.castWhiplash(f, game);
    }

    /* ---------- le choc cinétique ---------------------------------------- */
    f.state.hitCd = Math.max(0, f.state.hitCd - dt);
    if (f.state.hitCd <= 0 && f.onStage) this.tryRam(f, game);
  },

  /**
   * **Le seul point du module qui écrive la vitesse.**
   *
   * `f.boost` est un *bail* renouvelé à chaque image plutôt qu'une durée : le
   * moteur le décompte dans `Fighter.step()` (invariant 7, il ne sait pas
   * pourquoi il le décompte), donc le laisser à 0,2 s à chaque passage suffit à
   * le tenir ouvert, et il se referme tout seul en deux dixièmes de seconde
   * quand le module cesse de tourner — fin de duel, mort, ou phase de parade.
   * Une durée « longue » posée une fois laisserait la Comète lancée bien après
   * qu'elle a cessé d'exister.
   */
  syncRush(f) {
    f.boost = 0.2;
    f.boostFactor = f.state.rush;
  },

  /* ------------------------------------------------------------------ */
  /*  Le choc cinétique                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Un choc, et **un seul par verrou** : on sort au premier ennemi trouvé.
   *
   * Le dégât suit l'élan (`kinetic.damage × rush`) et part **dans son sens de
   * marche** — un corps lancé pousse devant lui, il n'écarte pas. Elle-même
   * recule (`selfKick`), ce qui la décolle de sa cible : sans ça elle restait
   * au contact et rechargeait son verrou sur place, ce qui faisait d'elle un
   * combattant de corps à corps ordinaire au lieu d'un personnage qui doit
   * **repartir et revenir**.
   *
   * **`sound: 'hit'`** : le moteur ne reconnaît une touche d'arme qu'à
   * `kind: 'melee'`, or son geste principal n'est pas une arme. Sans ce mot, il
   * sonnerait comme un projectile perdu et `sound-check` crierait à la recette
   * morte — c'est le mécanisme que le Rayon solaire a éprouvé le premier.
   */
  tryRam(f, game) {
    const k = f.el.kinetic;
    const ult = f.el.ultimate;
    const enRentree = f.ult.active > 0;

    for (const g of game.fighters) {
      if (g === f || g.team === f.team || !g.onStage) continue;
      // de bord à bord **plus une marge explicite** : `resolveBodies` sépare
      // les corps à chaque pas, donc un test au contact strict est toujours faux
      if (Math.hypot(g.x - f.x, g.y - f.y) > f.radius + g.radius + k.margin) continue;

      const nx = Math.cos(f.heading);
      const ny = Math.sin(f.heading);
      game.damage(g, k.damage * f.state.rush, f, {
        kind: 'ram',
        sound: 'hit',
        nx,
        ny,
        knockback: k.knockback,
      });

      f.state.hitCd = enRentree ? ult.cooldown : k.cooldown;
      f.push(-nx, -ny, k.selfKick);
      // la Rentrée retire la contrainte : c'est tout ce qu'elle fait, et c'est
      // assez — l'élan tenu au maximum ne se dépense plus
      if (enRentree) game.shake(ult.shake, 0.2);
      else f.state.rush = Math.max(1, f.state.rush - f.el.rush.spend);
      return;
    }
  },

  /* ------------------------------------------------------------------ */
  /*  Coup de fouet                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * **Il n'a pas de durée**, et c'est ce qui le distingue d'un bonus de vitesse
   * ordinaire : l'élan gagné reste acquis jusqu'à ce qu'un choc le dépense.
   * `Math.max` et non une affectation — pendant la Rentrée, l'élan tenu est
   * déjà plus haut, et le pouvoir ne doit pas le **redescendre**.
   */
  castWhiplash(f, game) {
    const a = f.el.ability;
    game.sfx.cast(f, 'ability');
    game.fx.ring(f.x, f.y, f.radius, a.ring.to, a.ring.time, a.ring.color, a.ring.width, false);
    f.state.rush = Math.max(f.state.rush, a.to);
  },

  /* ------------------------------------------------------------------ */
  /*  Fragmentation — le troisième créneau                               */
  /* ------------------------------------------------------------------ */

  /**
   * **Huit éclats en anneau complet, et ils lui coûtent son élan.**
   *
   * L'anneau part d'un **cap fixe** (`f.heading`) et non d'un tirage : la
   * géométrie est entièrement déduite de l'état, comme tout ce module
   * (invariant 2). Partir du cap plutôt que d'un angle absolu fait que la salve
   * **suit son sens de marche** — les deux éclats de l'avant partent devant
   * elle, ceux de l'arrière couvrent ce qu'elle vient de dépasser.
   *
   * `cost` est ce qui rattache le pouvoir au personnage : elle échange de la
   * vitesse et de la puissance de choc contre de la portée. Le plancher reste 1
   * — la Fragmentation ne peut pas la faire descendre *sous* son élan de
   * départ, sinon un pouvoir qui tombe pendant qu'elle est déjà à sec la
   * clouerait au sol.
   */
  castShed(f, game) {
    const sp = f.el.special;
    game.sfx.cast(f, 'special');
    game.fx.ring(f.x, f.y, f.radius, f.radius + 90, 0.3, teinte(f.el.look.palette.body, 0.85), 6, false);
    for (let i = 0; i < sp.count; i++) {
      game.projectiles.spawn(f, sp.projectile, f.heading + (TAU * i) / sp.count, f.radius + 4);
    }
    f.state.rush = Math.max(1, f.state.rush - sp.cost);
    this.syncRush(f);
  },

  /* ------------------------------------------------------------------ */
  /*  Rentrée — l'ultime                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * Pas de `game.sfx.cast` ici : `match.js` détecte la bascule de
   * `f.ult.active` et joue la recette que la fiche nomme, pour tout ultime du
   * dépôt.
   */
  castReentry(f, game) {
    const ult = f.el.ultimate;
    f.ult.active = ult.duration;
    f.ult.ready = false;
    f.state.rush = ult.rush;
    /** Images fantômes pendant toute la manœuvre — `ghosting` est un compteur
     *  générique lu par `flair.js` seul, donc l'allumer **ne peut pas** changer
     *  un vainqueur (la mise en scène a son propre banc et son propre aléa). */
    f.ghosting = ult.duration;
    game.shake(ult.shake * 1.5, 0.4);
  },

  /**
   * **Seul point de sortie de l'ultime.** Jauge, élan, fantômes et verrou sont
   * remis ensemble : dispersés, une fin de partie en pleine Rentrée laisserait
   * la Comète à 2,3 d'élan pour le reste du duel.
   */
  endReentry(f) {
    f.ult.active = 0;
    f.ult.charge = 0;
    f.ult.ready = false;
    f.ghosting = 0;
    f.state.rush = Math.min(f.state.rush, f.el.rush.max);
    f.state.hitCd = Math.min(f.state.hitCd, f.el.kinetic.cooldown);
  },

  /* ------------------------------------------------------------------ */
  /*  Rendu                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * **L'élan, lisible au sol : un anneau qui se resserre.**
   *
   * Il n'est pas décoratif — c'est la seule façon pour un spectateur de
   * comprendre *pourquoi* le même personnage retire 4 PV puis 9. Le sens de
   * marche compte : un anneau qui **se resserre** dit qu'on accumule, un anneau
   * qui s'ouvre aurait dit qu'une onde part (la leçon des anneaux de charge du
   * Soleil).
   *
   * Aucun tirage : tout est déduit de `f.state.rush`.
   */
  drawUnder(ctx, f) {
    if (!f.onStage) return;
    const p = f.el.look.palette;
    // 0 → 1 sur toute la plage possible, Rentrée comprise : l'anneau ne sature
    // donc pas au plafond ordinaire, et l'ultime se voit encore monter
    const t = Math.max(0, Math.min(1, (f.state.rush - 1) / (f.el.ultimate.rush - 1)));
    if (t <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = 0.12 + 0.42 * t;
    ctx.strokeStyle = teinte(p.light, 0.9);
    ctx.lineWidth = 2 + 5 * t;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius + 16 - 10 * t, 0, TAU);
    ctx.stroke();
    ctx.restore();
  },

  /**
   * **La Rentrée : elle chauffe.** Un halo battant posé sur elle, aux trois
   * teintes de sa palette, du cœur clair vers le magenta transparent.
   *
   * `match.js` repasse le chiffre de PV après cette boucle, donc le recouvrir
   * ici ne le rend pas illisible — piège documenté.
   */
  drawOver(ctx, f, game, now) {
    if (f.ult.active <= 0 || !f.onStage) return;
    const p = f.el.look.palette;
    // le battement dit que la manœuvre **dure** : un halo fixe se lirait comme
    // un changement de couleur du corps
    const r = f.radius * 1.75 * (1 + 0.08 * Math.sin(now * 26));

    ctx.save();
    const g = ctx.createRadialGradient(f.x, f.y, f.radius * 0.6, f.x, f.y, r);
    g.addColorStop(0, teinte(p.core, 0.45));
    g.addColorStop(0.55, teinte(p.light, 0.3));
    g.addColorStop(1, teinte(p.body, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(f.x, f.y, r, 0, TAU);
    ctx.fill();
    ctx.restore();
  },

  barValue(f) {
    if (f.ult.active > 0) return f.ult.active / f.el.ultimate.duration;
    return f.ult.charge / 100;
  },

  /** Seconde rangée de jauge : le remplissage de la Fragmentation. `specSpan`
   *  et non `cooldown`, sinon la **première** salve — qui arrive plus tôt —
   *  afficherait une jauge à la mauvaise échelle. */
  specialBar(f) {
    const span = f.state.specSpan || f.el.special.cooldown;
    return { value: 1 - Math.max(0, Math.min(1, f.state.specCd / span)), active: false };
  },
};
