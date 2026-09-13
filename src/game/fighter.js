/**
 * Combattant : état runtime + rendu.
 *
 * Toutes les caractéristiques viennent de la fiche gelée (data/elements.js).
 * Cette classe ne contient que l'état **mutable** d'un duel : position, PV,
 * timers. Deux duels lancés avec la même fiche se comportent donc à
 * l'identique.
 *
 * @module game/fighter
 */

import { ARENA, MATCH, PHYSICS } from '../data/tuning.js';
import { PIXEL_MAPS } from '../data/pixelmaps.js';
import { TAU, clamp, rotateToward, wrapAngle } from '../core/math.js';
import { drawSpriteCentered, drawSpriteLeft } from '../render/sprites.js';

export class Fighter {
  /**
   * @param {object} element fiche gelée
   * @param {number} slot rang d'entrée : 0 = gauche, 1 = droite en duel
   * @param {object} rng
   * @param {{x:number,y:number,heading:number}} [spawn] point de départ imposé.
   *   Absent, on prend `MATCH.spawn[slot]`, les deux points **relevés sur la
   *   vidéo**. Au-delà de deux combattants ces deux points ne suffisent plus et
   *   c'est `Match` qui répartit l'anneau, mais le duel repasse exactement par
   *   la valeur d'origine.
   * @param {number} [maxHp] points de vie de départ. La norme (`MATCH.maxHp`,
   *   200) par défaut ; une fiche peut porter les siens (le Golem, 400) et un
   *   module peut en imposer à un combattant qu'il fait entrer (le Clone
   *   d'ombre, 50). Ce n'est pas une option de partie : le curseur de PV a été
   *   retiré du dépôt.
   */
  constructor(element, slot, rng, spawn = MATCH.spawn[slot], maxHp = MATCH.maxHp) {
    this.el = element;
    this.slot = slot;
    this.rng = rng;
    /**
     * Camp. En duel c'est le rang (0 et 1), donc « chacun pour soi » et
     * « deux équipes » se confondent ; à plusieurs c'est `Match` qui l'impose,
     * et c'est lui qui décide qui peut blesser qui.
     */
    this.team = slot;

    const inner = ARENA.inner;
    this.x = inner.left + (inner.right - inner.left) * spawn.x;
    this.y = inner.top + (inner.bottom - inner.top) * spawn.y;
    // léger écart de cap piloté par la seed : deux duels d'un même
    // affrontement ne se déroulent pas exactement pareil, sans que la fiche
    // de l'élément ne change d'un iota
    this.heading = spawn.heading + rng.spread(0.35);
    this.speed = element.movement.speed;
    this.impulseX = 0;
    this.impulseY = 0;

    /**
     * Points de vie de départ, **et plafond des soins**. Portés par le
     * combattant et non par `MATCH` : chacun peut avoir les siens, ce qui
     * permet de compenser un combattant faible sans toucher à sa fiche, ou de
     * poser un handicap. Tout ce qui affiche une proportion de vie (barre du
     * HUD, cerclage rouge de danger) doit donc diviser par **celui-ci**, pas
     * par une constante.
     */
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.flash = 0;
    this.invulnerable = 0;

    // arme
    this.weaponAngle = slot === 0 ? 0 : Math.PI;
    this.spinDir = element.weapon.spinDir;
    this.meleeCd = 0;

    // pouvoir & ultime
    this.ability = {
      cooldown: element.ability.cooldown, // valeur courante (peut décroître)
      timer: element.ability.cooldown,
      uses: 0,
    };
    this.ult = { charge: 0, active: 0, ready: false };

    // stats évolutives affichées dans le HUD, valeurs de départ dans la fiche
    // `stacks`  : stat principale (Hors-la-loi « Damage », Bretteur « Spin
    //             Speed », Mage « Attack Speed », …)
    // `stacks2` : stat secondaire, quand la fiche en déclare une
    this.stacks = element.progression?.stack ?? 1;
    this.stacks2 = element.progression?.stack2 ?? 0;

    // ralentissements empilés
    /** @type {Array<{amount:number, until:number}>} */
    this.slows = [];

    /**
     * Dégâts sur la durée (la brûlure du Bretteur). Le tic est appliqué par
     * Match, seul point d'entrée des dégâts.
     * @type {Array<{damage:number, interval:number, timer:number, until:number,
     *               source:Fighter, ring:string|null}>}
     */
    this.dots = [];
    /** Teinte du corps imposée par un effet (givre, piège de Lumière). */
    this.tint = null;
    this.tintUntil = 0;
    this.tintAlpha = 1; // 1 = remplace la couleur, <1 = se mélange

    /**
     * Temps restant **hors du plateau**. Un combattant qui saute quitte
     * l'arène : il ne bouge plus, ne touche plus, n'est plus touché et n'est
     * plus dessiné, mais il reste vivant et son HUD continue de vivre.
     * Générique comme `invulnerable` : le moteur ne sait pas *pourquoi* il est
     * parti, seul son module de pouvoirs le sait (le Bond du Dragoon).
     */
    this.offstage = 0;

    /**
     * Temps restant pendant lequel le combattant **sème des images fantômes**.
     * Générique comme `offstage` : le moteur ne sait pas *pourquoi* il en sème,
     * seul son module le sait (la charge du Lancier). C'est `render/flair.js`
     * qui le lit, donc allumer ce compteur ne peut rien changer au duel — la
     * mise en scène a son propre aléa et son propre banc de particules.
     */
    this.ghosting = 0;

    /**
     * Point que suit le ruban de `render/flair.js`, quand un module en désigne
     * un autre que la pointe d'arme. `null` = comportement d'origine.
     *
     * Même forme que les compteurs ci-dessus : un module le pose, le rendu le
     * lit, et le rendu **ne sait pas pourquoi**. Il existe parce qu'un
     * combattant peut n'avoir aucune arme au sens du moteur — un module peut
     * intégrer lui-même une arme dont `weapon.reach` vaut zéro, et la pointe
     * suivie serait alors le centre de sa bille.
     * @type {{x:number,y:number}|null}
     */
    this.ribbonAnchor = null;

    /**
     * Décalage **perpendiculaire** de l'ancrage de l'arme, en px, positif vers
     * la gauche de l'axe. Même forme que les autres compteurs génériques : un
     * module l'écrit, `weaponPivot()` s'en sert, et le moteur ne sait pas
     * pourquoi. À zéro — la valeur par défaut, celle des dix autres
     * combattants — l'arme reste ancrée au centre du corps.
     */
    this.weaponLateral = 0;

    /**
     * Rotation **propre** de l'arme, en radians, autour du centre de sa propre
     * carte — à ne pas confondre avec `weaponAngle`, qui est la direction dans
     * laquelle l'arme *pointe depuis le corps*.
     *
     * La différence est toute la demande du rechargement du Hors-la-loi :
     * faire tourner `weaponAngle` fait **orbiter** l'arme autour de la bille
     * comme une aiguille d'horloge, alors qu'on veut un pistolet qui reste où
     * il est et **tourne sur lui-même**. Les deux se composent : l'ancrage et
     * l'orientation d'ensemble restent à `weaponAngle`, la vrille s'applique
     * par-dessus, autour du milieu de la carte.
     *
     * Encore un compteur générique : un module l'écrit, `drawWeapon()` et
     * `bladeSegment()` s'en servent, le moteur ne sait pas pourquoi. À zéro —
     * la valeur par défaut, celle des dix autres combattants — rien ne change
     * pour personne.
     */
    this.weaponTwirl = 0;

    /**
     * **Facteur de taille du corps**, multiplié à `look.radius`. Dernier-né des
     * compteurs génériques (invariant 7) : un module l'écrit, le moteur s'en
     * sert partout, et **le moteur ne sait pas pourquoi**.
     *
     * Il existe parce qu'un corps est jusqu'ici **figé** : `look.radius` est une
     * valeur de fiche, et les fiches sont gelées (invariant 1). Aucun module ne
     * pouvait donc faire grandir ou rétrécir un combattant, alors que tout le
     * reste de son état est modulable.
     *
     * **Un seul `get radius()` suffit à tout**, et c'est ce qui rend la clé
     * bon marché : les 81 lecteurs du moteur passent déjà par lui — collisions
     * de mur, séparation des corps, portée du verrou de mêlée, aura, contour,
     * placement du chiffre de PV, et **jusqu'au sprite de corps**, qui se
     * dimensionne sur `this.radius * 2`. Un combattant qui change de taille
     * change donc *tout* de lui-même, sans une ligne de plus.
     *
     * À **1** — la valeur par défaut, celle des huit combattants — le produit
     * `x * 1` est exact en IEEE 754 : le chemin est celui d'avant, au bit près.
     * C'est la preuve exigée par la leçon de `weapon.spokes` : **poser la clé,
     * la laisser inutilisée partout, exiger la matrice identique au caractère
     * près, et seulement ensuite ajouter le combattant qui s'en sert.**
     */
    this.sizeFactor = 1;

    this.trailTimer = 0;
    this.boost = 0; // durée restante d'un bonus de vitesse
    this.boostFactor = 1;
    /** @type {Fighter|null} */
    this.opponent = null;
    this.state = {}; // bac à sable pour les modules de pouvoirs
    /** Suivi de l'incantation d'ultime, pour la mise en scène (rendu seul). */
    this.wasUlting = false;
    /** Mur touché à ce pas, pour la mise en scène (rendu seul). */
    this.wall = null;
  }

  get radius() {
    return this.el.look.radius * this.sizeFactor;
  }

  get alive() {
    return this.hp > 0;
  }

  /** Vivant **et** présent dans l'arène : la condition de tout ce qui le voit. */
  get onStage() {
    return this.hp > 0 && this.offstage <= 0;
  }

  /** Facteur de vitesse courant (1 = nominal), ralentissements inclus. */
  slowFactor(now) {
    let worst = 0;
    for (const s of this.slows) if (s.until > now && s.amount > worst) worst = s.amount;
    return 1 - clamp(worst, 0, 0.75);
  }

  applySlow(amount, duration, now) {
    if (amount <= 0) return;
    this.slows.push({ amount, until: now + duration });
    if (this.slows.length > 8) this.slows.shift();
  }

  /**
   * Applique (ou rafraîchit) un dégât sur la durée.
   * Un seul DoT par source : une nouvelle application remplace la précédente,
   * comme la brûlure du Bretteur, qui se « rafraîchit » à chaque coup.
   */
  applyDot({ damage, interval, duration, source, ring = null, tint = null }, now) {
    const existing = this.dots.find((d) => d.source === source);
    const dot = {
      damage,
      interval,
      timer: existing ? existing.timer : interval,
      until: now + duration,
      source,
      ring,
      tint,
    };
    if (existing) Object.assign(existing, dot);
    else this.dots.push(dot);
  }

  /**
   * Teinte temporaire du corps (effet visuel d'un contrôle adverse).
   * `alpha` < 1 mélange la teinte à la couleur d'élément : c'est ainsi que la
   * Glace givre ses victimes — sur le jaune de la Lumière, le bleu du givre
   * donne le vert pâle qu'on voit dans la vidéo.
   */
  applyTint(color, duration, now, alpha = 1) {
    this.tint = color;
    this.tintUntil = now + duration;
    this.tintAlpha = alpha;
  }

  /** Couleur d'anneau d'état à dessiner autour du corps, s'il y en a une. */
  statusRing(now) {
    for (const d of this.dots) if (d.until > now && d.ring) return d.ring;
    return null;
  }

  /**
   * Teinte de corps imposée par un dégât sur la durée.
   * La brûlure du Feu **colore entièrement sa victime en orange** : au zoom,
   * la boule jaune de la Foudre devient franchement orange, ce n'est pas un
   * simple cerclage.
   */
  statusTint(now) {
    for (const d of this.dots) if (d.until > now && d.tint) return d.tint;
    return null;
  }

  /** Vitesse effective en px/s. */
  currentSpeed(now) {
    return this.el.movement.speed * this.slowFactor(now) * (this.boost > 0 ? this.boostFactor : 1);
  }

  /* ------------------------------------------------------------------ */
  /* Simulation                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * @param {number} dt pas fixe
   * @param {number} now temps de duel
   */
  /**
   * @param {number} dt
   * @param {number} now
   * @param {boolean} [hold] si vrai, le combattant **ne se déplace pas** : ni
   *   pilotage, ni intégration, ni rebond. Tout le reste continue (minuteurs,
   *   rotation d'arme), pour que l'attente d'avant-combat reste vivante à
   *   l'écran plutôt que d'être une image figée.
   */
  step(dt, now, hold = false) {
    // hors du plateau : plus de déplacement, plus de rebond, plus de rotation
    // d'arme — le combattant est en l'air, il n'existe plus pour l'arène
    if (this.offstage > 0) {
      this.offstage = Math.max(0, this.offstage - dt);
      this.invulnerable = Math.max(0, this.invulnerable - dt);
      // parti en l'air : il ne laisse pas de fantôme à son dernier point connu
      this.ghosting = 0;
      this.wall = null;
      return;
    }

    this.meleeCd = Math.max(0, this.meleeCd - dt);
    this.ghosting = Math.max(0, this.ghosting - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.boost = Math.max(0, this.boost - dt);
    if (this.slows.length) this.slows = this.slows.filter((s) => s.until > now);
    if (this.dots.length) this.dots = this.dots.filter((d) => d.until > now);
    if (this.tint && now >= this.tintUntil) this.tint = null;

    // --- pilotage : on tourne doucement vers l'adversaire (mesuré ~1,9 rad/s)
    const mv = this.el.movement;
    if (!hold && this.opponent && mv.seek > 0) {
      const want = Math.atan2(this.opponent.y - this.y, this.opponent.x - this.x);
      this.heading = rotateToward(this.heading, want, mv.turnRate * mv.seek * dt);
    }

    // --- intégration
    const sp = hold ? 0 : this.currentSpeed(now);
    let vx = Math.cos(this.heading) * sp + this.impulseX;
    let vy = Math.sin(this.heading) * sp + this.impulseY;
    this.x += vx * dt;
    this.y += vy * dt;

    // amortissement du recul
    const k = Math.exp(-PHYSICS.speedRecovery * dt);
    this.impulseX *= k;
    this.impulseY *= k;

    // --- rebonds sur les murs
    const r = this.radius;
    const i = ARENA.inner;
    let bounced = false;
    // `wall` note le mur touché **pour la mise en scène seulement** : simple
    // marquage, aucun effet sur la trajectoire.
    this.wall = null;
    if (this.x - r < i.left) { this.x = i.left + r; this.heading = wrapAngle(Math.PI - this.heading); this.impulseX = Math.abs(this.impulseX); bounced = true; this.wall = 'left'; }
    if (this.x + r > i.right) { this.x = i.right - r; this.heading = wrapAngle(Math.PI - this.heading); this.impulseX = -Math.abs(this.impulseX); bounced = true; this.wall = 'right'; }
    if (this.y - r < i.top) { this.y = i.top + r; this.heading = wrapAngle(-this.heading); this.impulseY = Math.abs(this.impulseY); bounced = true; this.wall = 'top'; }
    if (this.y + r > i.bottom) { this.y = i.bottom - r; this.heading = wrapAngle(-this.heading); this.impulseY = -Math.abs(this.impulseY); bounced = true; this.wall = 'bottom'; }
    if (bounced && PHYSICS.spinFlipsOnBounce) this.spinDir *= -1;

    // --- rotation de l'arme (ralentie comme le déplacement)
    const spinScale = this.slowFactor(now);
    this.weaponAngle = wrapAngle(
      this.weaponAngle + this.el.weapon.spin * this.spinDir * spinScale * dt,
    );
  }

  /** Ajoute une impulsion (recul, choc). */
  push(dirX, dirY, force) {
    const len = Math.hypot(dirX, dirY) || 1;
    this.impulseX += (dirX / len) * force;
    this.impulseY += (dirY / len) * force;
  }

  /* ------------------------------------------------------------------ */
  /* Géométrie de l'arme                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * **Pivot de l'arme**, en coordonnées monde.
   *
   * `weaponLateral` décale l'ancrage **perpendiculairement à l'axe de l'arme**
   * — c'est un compteur générique de plus (cf. `ghosting`) : un module
   * l'allume, le moteur s'en sert, et le moteur ne sait pas pourquoi. À zéro,
   * qui est la valeur par défaut, rien ne change pour personne.
   *
   * `bladeSegment()` et `drawWeapon()` passent **tous les deux** par ici, et
   * c'est le point : décaler seulement le dessin ferait mentir le sprite sur
   * l'endroit où il coupe. C'est la même discipline que `handle.length`, dont
   * la somme avec la carte doit toujours retomber sur la portée.
   */
  weaponPivot() {
    const lat = this.weaponLateral;
    if (!lat) return { x: this.x, y: this.y };
    return {
      x: this.x - Math.sin(this.weaponAngle) * lat,
      y: this.y + Math.cos(this.weaponAngle) * lat,
    };
  }

  /**
   * Milieu de la carte d'arme sur l'axe, en distance depuis le pivot — le
   * centre autour duquel `weaponTwirl` fait tourner l'arme.
   *
   * Il est **déduit de la portée**, pas mesuré sur le sprite : la règle du
   * dépôt veut que `handle.length + carte dessinée = reach`, donc le milieu de
   * la carte tombe à mi-chemin entre le talon et la pointe. C'est ce qui
   * permet à `bladeSegment()` de le calculer sans connaître `PIXEL_MAPS` — et
   * si un jour la somme cessait de retomber sur la portée, ce centre serait
   * faux **en même temps** que la pointe, donc l'erreur resterait cohérente.
   */
  weaponMid() {
    const w = this.el.weapon;
    return (w.handle.length + w.reach) / 2;
  }

  /**
   * **Nombre de branches de l'arme**, 1 pour tout le monde sauf le Soleil (8).
   *
   * Une arme à plusieurs branches est le même objet répété à intervalle
   * régulier sur le tour : `bladeSegment(k)` rend la k-ième, `weaponHit` les
   * essaie toutes et `drawWeapon` les peint toutes. Le moteur ne connaît
   * toujours aucun combattant (invariant 12) — la forme se dit **entièrement
   * dans la fiche**, et un autre combattant en hériterait sans une ligne d'ici.
   *
   * Absente, la clé vaut 1 : le chemin repris ci-dessous est alors **exactement
   * celui d'avant**, expression par expression.
   */
  get spokes() {
    return this.el.weapon.spokes ?? 1;
  }

  /**
   * Segment tranchant [a,b] en coordonnées monde + rayon.
   *
   * @param {number} [spoke] branche à rendre, de 0 à `spokes - 1`.
   */
  bladeSegment(spoke = 0) {
    const { reach, hitbox } = this.el.weapon;
    /**
     * **À `spoke` nul, l'angle est `this.weaponAngle` lui-même**, sans la
     * moindre opération — pas `this.weaponAngle + 0`. C'est la même discipline
     * que la branche sans vrille ci-dessous et que le chemin du duel dans
     * `match.js` : une addition flottante neutre en apparence suffit à
     * déplacer un dernier bit, donc une collision limite, donc un vainqueur.
     * Les sept combattants à une seule branche doivent repasser par le chemin
     * exact d'avant, et la matrice le vérifie.
     */
    const ang = spoke ? this.weaponAngle + (TAU * spoke) / this.spokes : this.weaponAngle;
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const o = this.weaponPivot();

    /**
     * **Sans vrille, l'expression d'origine, mot pour mot.**
     *
     * Ce n'est pas de la micro-optimisation, c'est du déterminisme. La forme
     * générale ci-dessous regroupe autrement les mêmes produits
     * (`c * (reach * from)` au lieu de `(c * reach) * from`), or la
     * multiplication flottante **n'est pas associative** : le résultat diffère
     * du dernier bit. Ça suffit à faire basculer une collision limite, et la
     * première version de cette méthode a déplacé `fire vs bladesman` et
     * `light vs wind` — deux affrontements où le Hors-la-loi n'est même pas.
     * Les dix combattants qui ne vrillent jamais doivent repasser par le
     * chemin exact d'avant.
     */
    const t = this.weaponTwirl;
    if (!t) {
      return {
        ax: o.x + c * reach * hitbox.from,
        ay: o.y + s * reach * hitbox.from,
        bx: o.x + c * reach * hitbox.to,
        by: o.y + s * reach * hitbox.to,
        r: hitbox.radius,
      };
    }

    /**
     * La vrille tourne le segment autour du milieu de la carte, exactement
     * comme `drawWeapon()` tourne le sprite. Ne la passer qu'au dessin ferait
     * mentir le sprite sur l'endroit où il porte — c'est la même discipline
     * que `weaponLateral`, et elle a déjà été payée une fois.
     */
    const mid = this.weaponMid();
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const a0 = reach * hitbox.from - mid;
    const b0 = reach * hitbox.to - mid;
    const ax = mid + a0 * ct;
    const ay = a0 * st;
    const bx = mid + b0 * ct;
    const by = b0 * st;

    return {
      ax: o.x + c * ax - s * ay,
      ay: o.y + s * ax + c * ay,
      bx: o.x + c * bx - s * by,
      by: o.y + s * bx + c * by,
      r: hitbox.radius,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx, now) {
    const look = this.el.look;

    // halo (pouvoir prêt)
    if (this.auraVisible()) {
      const pulse = 0.75 + 0.25 * Math.sin(now * TAU * look.aura.pulse);
      const rr = this.radius * look.aura.radius * pulse;
      const g = ctx.createRadialGradient(this.x, this.y, this.radius * 0.6, this.x, this.y, rr);
      g.addColorStop(0, look.aura.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, rr, 0, TAU);
      ctx.fill();
    }

    /**
     * Ordre d'affichage. Par défaut l'arme passe **sous** le corps, ce qui est
     * le relevé de tous les combattants d'origine. `weapon.overBody` la fait
     * passer par-dessus — c'est le cas du Lancier, dont la vidéo montre la
     * lance qui recouvre franchement la bille.
     *
     * Le drapeau est porté par la **fiche** et non par le moteur : celui-ci ne
     * connaît toujours aucun combattant, il lit.
     */
    const overBody = this.el.weapon.overBody === true;
    if (!overBody) this.paintWeapon(ctx);

    const dotTint = this.statusTint(now);
    /**
     * **Le corps peut être un sprite au lieu d'un cercle vectoriel.**
     *
     * `look.sprite` est une clé de `PIXEL_MAPS` comme une autre, donc elle
     * accepte aussi un override PNG. Absente — les sept autres combattants —
     * on repasse par le tracé d'origine, mot pour mot : le moteur ne connaît
     * toujours aucun combattant (invariant 12), il lit.
     */
    if (look.sprite) this.drawSpriteBody(ctx, look, dotTint);
    else {
      // corps — le flash blanc d'encaissement prime sur tout, puis la teinte
      // d'un contrôle adverse se pose (ou se mélange) sur la couleur d'élément
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, TAU);
      ctx.fillStyle = this.flash > 0 ? look.bodyHit : look.body;
      ctx.fill();
      if (this.flash <= 0 && (this.tint || dotTint)) {
        ctx.globalAlpha = this.tint ? this.tintAlpha : dotTint.alpha;
        ctx.fillStyle = this.tint ?? dotTint.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.lineWidth = look.outlineWidth;
      ctx.strokeStyle = look.outline;
      ctx.stroke();
    }

    // anneau d'état (brûlure : cerclage orange autour de la victime)
    const ring = this.statusRing(now);
    if (ring) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + look.outlineWidth * 0.9, 0, TAU);
      ctx.lineWidth = look.outlineWidth * 1.1;
      ctx.strokeStyle = ring;
      ctx.stroke();
    }

    /**
     * `look.hpOverWeapon` : le chiffre de PV se pose **après** l'arme au lieu
     * d'avant — opt-in, faux par défaut, donc n'affecte que qui le demande.
     * Le Bretteur en a besoin : sa manche passe par-dessus la bille
     * (`overBody`) et couvre le centre où le chiffre se pose, en tons sombres
     * — sans ce drapeau, le chiffre resterait invisible sous elle. Le Lancier
     * ne le porte pas : sa lance ne recouvre le centre qu'en charge, et
     * `CLAUDE.md` documente déjà ce compromis-là comme voulu.
     */
    const hpOverWeapon = look.hpOverWeapon === true;
    if (!hpOverWeapon) this.drawHpNumber(ctx);

    /**
     * `weapon.overBody` : l'arme est peinte **en dernier**, après le corps et
     * les anneaux d'état — donc strictement au-dessus de la balle, en
     * permanence. Elle passe aussi après le chiffre de PV, sauf si
     * `look.hpOverWeapon` demande l'inverse (voir plus haut).
     *
     * Elle passait auparavant juste avant le chiffre, pour garder celui-ci
     * lisible ; mais les digits traversaient alors la lance, ce qui se lit
     * exactement comme une arme *derrière* la balle. Un demi-dessus se lit
     * comme un dessous : c'est tout ou rien. Contrepartie assumée — pendant une
     * charge, la lance peut masquer une partie du chiffre.
     */
    if (overBody) this.paintWeapon(ctx);
    if (hpOverWeapon) this.drawHpNumber(ctx);
  }

  /**
   * **Corps servi par un sprite.** Trois écarts au cercle vectoriel, chacun
   * imposé par le fait qu'un dessin n'est pas un aplat :
   *
   *  1. **Il est dimensionné sur le rayon, pas sur la carte.**
   *     `drawSpriteCentered` impose la hauteur ; on lui donne le diamètre du
   *     corps, corrigé par `look.spriteScale`. Cette correction existe parce
   *     qu'un dessin déborde souvent de son disque plein (les pointes du
   *     Soleil) : sans elle, la balle **paraîtrait plus petite que sa
   *     hitbox**. C'est la même discipline que `handle.length + largeur =
   *     reach` pour une arme — le dessin ne doit pas mentir sur la géométrie.
   *  2. **Le contour n'est pas tracé.** Un cercle net autour d'un dessin
   *     découpé (pointes, éclats) se lit comme un carcan, et le sprite porte
   *     déjà son propre bord sombre. `look.outline` reste lu ailleurs (la
   *     carte de sélection), ce n'est donc pas une clé morte.
   *  3. **Le flash et les teintes se posent en disque par-dessus, jamais en
   *     remplacement.** Sur un aplat, le flash *remplace* la couleur ; sur un
   *     dessin, le remplacer l'effacerait — on ne verrait plus qu'une pastille
   *     unie à chaque coup encaissé. `look.spriteFlash` règle l'opacité de ce
   *     voile : assez pour que le coup se voie, assez peu pour que l'astre
   *     reste lisible dessous.
   */
  drawSpriteBody(ctx, look, dotTint) {
    drawSpriteCentered(ctx, look.sprite, this.x, this.y, this.radius * 2 * (look.spriteScale ?? 1));

    const voile = this.flash > 0
      ? { color: look.bodyHit, alpha: look.spriteFlash ?? 0.6 }
      : this.tint
        ? { color: this.tint, alpha: this.tintAlpha }
        : dotTint
          ? { color: dotTint.color, alpha: dotTint.alpha }
          : null;
    if (!voile) return;

    ctx.globalAlpha = voile.alpha;
    ctx.fillStyle = voile.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  /**
   * Le chiffre de PV, seul — factorisé pour être **repassé** par-dessus tout
   * ce qui a pu le recouvrir après `draw()` (un pouvoir dessiné dans
   * `drawOver`, par ex. la Tempête de sève du Mage sur sa cible). Voir l'appel
   * dans `Match.draw()`.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawHpNumber(ctx) {
    const look = this.el.look;
    ctx.font = look.hpFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const texte = String(Math.max(0, Math.ceil(this.hp)));
    /**
     * **`look.hpStroke` : un contour sous le chiffre, et il a fallu l'ouvrir.**
     *
     * Le dépôt notait que « le chiffre de PV n'a pas de contour dans ce moteur,
     * les nombres de dégâts en ont un » — vrai tant qu'un corps est un **aplat**
     * : une seule couleur d'encre suffit à passer dessus. Sur un corps servi par
     * un **dessin**, ça ne marche plus : sous les digits du Soleil, 53 % des
     * pixels sont clairs et 40 % sombres, et le meilleur aplat possible tombe à
     * **2,28** de contraste dans son pire cas (une encre claire, à 1,08). Il n'y
     * a pas de bonne couleur — il y a un contour à ajouter.
     *
     * Même traitement que `Flair.drawPops` pour les nombres de dégâts, à la même
     * épaisseur : c'est la convention du dépôt pour un nombre posé sur un fond
     * qu'on ne maîtrise pas, et deux traitements différents pour deux nombres
     * de même taille se verraient.
     *
     * Opt-in : absent — les sept autres — le tracé est celui d'avant.
     */
    if (look.hpStroke) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = 7;
      ctx.strokeStyle = look.hpStroke;
      ctx.strokeText(texte, this.x, this.y + look.hpOffsetY);
    }
    ctx.fillStyle = look.hpColor;
    ctx.fillText(texte, this.x, this.y + look.hpOffsetY);
  }

  auraVisible() {
    const when = this.el.look.aura.showWhen;
    if (when === 'ability-ready') return this.ability.timer <= 0.35;
    if (when === 'ultimate-ready') return this.ult.ready || this.ult.active > 0;
    return true;
  }

  /**
   * Dessin de l'arme, et **crochet facultatif** : une entité peut poser un
   * `customWeapon` pour remplacer ce tracé — c'est ainsi que les clones du
   * Shinobi, qui empruntent ce prototype, n'en portent aucune.
   */
  paintWeapon(ctx) {
    if (this.customWeapon) { this.customWeapon(ctx); return; }
    this.drawWeapon(ctx);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  drawWeapon(ctx) {
    const w = this.el.weapon;
    const map = PIXEL_MAPS[w.head.sprite];
    /**
     * **Un combattant sans arme n'en dessine pas.** Le Mannequin ne déclare
     * aucun `head.sprite` ; sans ce garde, la ligne suivante lisait
     * `PIXEL_MAPS[undefined].h` et plantait au premier rendu. Générique et sans
     * nom de combattant : le moteur constate qu'il n'y a rien à peindre, il ne
     * sait pas de qui il s'agit (invariant 12).
     */
    if (!map) return;
    const headH = map.h * w.head.scale;
    const pivot = this.weaponPivot();
    /**
     * **Une passe par branche**, et `bladeSegment(k)` tourne du même angle : le
     * dessin ne doit jamais mentir sur l'endroit où l'arme porte, c'est la même
     * discipline que `weaponPivot()` et que `weaponTwirl`.
     */
    for (let k = 0; k < this.spokes; k++) this._paintSpoke(ctx, w, map, headH, pivot, k);
  }

  /** Une branche de l'arme, à l'angle `weaponAngle + k × TAU / spokes`. */
  _paintSpoke(ctx, w, map, headH, pivot, k) {
    ctx.save();
    // le pivot, pas le centre du corps : voir `weaponPivot()`
    ctx.translate(pivot.x, pivot.y);
    ctx.rotate(k ? this.weaponAngle + (TAU * k) / this.spokes : this.weaponAngle);

    // vrille : l'arme tourne sur elle-même, autour du milieu de sa carte, sans
    // quitter sa place. `bladeSegment()` applique exactement la même rotation.
    if (this.weaponTwirl) {
      const mid = this.weaponMid();
      ctx.translate(mid, 0);
      ctx.rotate(this.weaponTwirl);
      ctx.translate(-mid, 0);
    }

    // manche : rectangle sombre + liseré, comme sur la vidéo.
    // `width: 0` = arme posée à même la boule (shuriken du Shinobi, sceptre du
    // Mage) : rien à tracer,
    // `length` ne sert plus qu'à décaler le sprite.
    const h = w.handle;
    if (h.width > 0) {
      const half = h.width / 2;
      ctx.fillStyle = h.outline;
      ctx.fillRect(-2, -half - 2, h.length + 4, h.width + 4);
      ctx.fillStyle = h.color;
      ctx.fillRect(0, -half, h.length, h.width);
      ctx.fillStyle = h.dark;
      ctx.fillRect(0, 0, h.length, half); // moitié basse plus sombre (volume)
      if (h.gem) {
        ctx.fillStyle = h.gem.color;
        ctx.fillRect(h.length * h.gem.at - h.gem.size / 2, -h.gem.size / 2, h.gem.size, h.gem.size);
      }
    }

    // tête d'arme (sprite)
    drawSpriteLeft(ctx, w.head.sprite, h.length, 0, headH, w.head.anchorY);
    ctx.restore();
  }

  /** Silhouette utilisée pour les fantômes de téléportation. */
  ghostColor() {
    return this.el.look.trail.color;
  }

  /** Petit utilitaire de debug (`?debug=1`). */
  drawDebug(ctx) {
    const b = this.bladeSegment();
    ctx.save();
    ctx.strokeStyle = 'rgba(255,0,0,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b.ax, b.ay);
    ctx.lineTo(b.bx, b.by);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(b.bx, b.by, b.r, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.strokeStyle = 'rgba(0,120,255,0.7)';
    ctx.stroke();
    ctx.restore();
  }
}
