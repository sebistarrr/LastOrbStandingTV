/**
 * **Motifs de corps — le traitement du disque uni.**
 *
 * Trois corps du roster sont des dessins (Soleil, Lune, Comète) ; les sept
 * autres sont des aplats vectoriels, et c'est **voulu** : le contraste est ce
 * qui fait lire les boss et la Comète comme des objets à part. Habiller les
 * sept d'un sprite effacerait ce contraste — et coûterait, sur chacun,
 * `hpStroke`, un flash posé au lieu de remplacer, et une aura à revoir.
 *
 * Ce module est la voie moins chère : on garde l'aplat et on **le traite** —
 * un modelé (lumière + ombre de bord) et **une marque simple** par combattant.
 * Purement décoratif, donc soumis au même contrat que `flair.js` :
 *
 *  - **il ne lit que de l'état déjà calculé et n'écrit rien** ;
 *  - **aucun aléa** — ni `game.rng` (invariant 2 : les vainqueurs), ni
 *    `viewRng` : tout est fonction de `(x, y, r, angle)`, donc stable à la
 *    graine **et** à l'image près ;
 *  - **aucune horloge** : une marque qui pulse ferait respirer un corps qui,
 *    lui, ne respire pas.
 *
 * Et il **ne connaît aucun combattant** (invariant 12) : la fiche nomme sa
 * marque, la table ci-dessous la dessine. Clé absente, rien ne se dessine et le
 * corps est celui d'avant, expression par expression.
 *
 * Toutes les coordonnées des marques sont en **fraction du rayon**, jamais en
 * pixels : `sizeFactor` fait enfler le corps (invariant 7) et le motif doit
 * enfler avec lui. Et toutes restent **au-delà de 0,45 r** : le centre est pris
 * par le chiffre de PV, qui est repassé après et ne doit rien avoir à couvrir.
 */

const TAU = Math.PI * 2;

/**
 * Les marques. Chacune reçoit un contexte **déjà translaté sur le centre du
 * corps, tourné du cap et mis à l'échelle du rayon** : elle dessine dans un
 * disque unité, trait compris (`lineWidth` est posé par l'appelant en unités
 * de rayon lui aussi).
 *
 * @type {Record<string, (ctx: CanvasRenderingContext2D) => void>}
 */
const MARQUES = {
  /** **Barillet** (Pistolero) : six chambres en couronne. Six parce que c'est
   *  le nombre de son barillet de fiche — la marque cite l'arme, elle ne
   *  l'invente pas. */
  barillet(ctx) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0.13, 0, TAU);
      ctx.stroke();
    }
  },

  /** **Tourbillon** (Ronin) : deux arcs opposés, la rotation qui monte jusqu'à
   *  la surchauffe rendue en dessin. Ils tournent avec `weaponAngle`, donc le
   *  corps *dit* enfin ce que `Damage = Spin` fait. */
  tourbillon(ctx) {
    for (let i = 0; i < 2; i++) {
      const a = i * Math.PI;
      ctx.beginPath();
      ctx.arc(0, 0, 0.66, a + 0.25, a + 1.9);
      ctx.stroke();
    }
  },

  /** **Chevrons** (Hoplite) : deux V empilés pointant vers le cap — la lance
   *  est braquée dessus (`weapon.spin = 0`), le corps le répète. */
  chevrons(ctx) {
    for (const d of [0.28, 0.62]) {
      ctx.beginPath();
      ctx.moveTo(d - 0.34, -0.42);
      ctx.lineTo(d, 0);
      ctx.lineTo(d - 0.34, 0.42);
      ctx.stroke();
    }
  },

  /** **Shuriken** (Shinobi) : quatre pointes, parce que **la bille *est* le
   *  shuriken** — hitbox en disque, sprite centré. La seule marque du lot qui
   *  se remplit au lieu de se tracer : un shuriken est une silhouette. */
  shuriken(ctx) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU;
      const c = Math.cos(a);
      const s = Math.sin(a);
      ctx.moveTo(c * 0.26 - s * 0.17, s * 0.26 + c * 0.17);
      ctx.lineTo(c * 0.86, s * 0.86);
      ctx.lineTo(c * 0.26 + s * 0.17, s * 0.26 - c * 0.17);
    }
    ctx.fill();
  },

  /** **Runes** (Druide) : un anneau fin et trois points — le cercle
   *  d'invocation des orbes guidées, réduit à ce qui reste lisible à 41 px. */
  runes(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 0.72, 0, TAU);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.1, 0, TAU);
      ctx.fill();
    }
  },

  /** **Fissures** (Golem) : trois brisures, pas un réseau. Le plus gros corps
   *  du roster supporterait plus de matière, mais il encaisse aussi le plus de
   *  coups : ce qu'on y ajoute, on le regarde longtemps. */
  fissures(ctx) {
    const traits = [
      [[-0.78, -0.2], [-0.34, -0.34], [-0.5, 0.08], [-0.16, 0.3]],
      [[0.2, -0.8], [0.36, -0.44], [0.16, -0.3]],
      [[0.82, 0.12], [0.44, 0.24], [0.56, 0.6]],
    ];
    for (const t of traits) {
      ctx.beginPath();
      ctx.moveTo(t[0][0], t[0][1]);
      for (let i = 1; i < t.length; i++) ctx.lineTo(t[i][0], t[i][1]);
      ctx.stroke();
    }
  },
};

/**
 * Pose le motif d'un corps vectoriel : le modelé, puis la marque.
 *
 * L'appel est **clipé au disque** : une marque qui déborderait doublerait le
 * contour, et un trait clair seul n'existe pas sur l'arène blanche (piège
 * connu) — mieux vaut qu'il soit coupé net par le bord du corps.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x centre du corps
 * @param {number} y centre du corps
 * @param {number} r rayon **courant** (`sizeFactor` déjà appliqué)
 * @param {number} angle cap de l'arme (`weaponAngle`), pour les marques orientées
 * @param {{gloss?: number, shade?: number, mark?: string, color?: string,
 *          alpha?: number, width?: number, fill?: boolean}} motif bloc `look.motif`
 */
export function drawMotif(ctx, x, y, r, angle, motif) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.clip();

  /**
   * **Modelé.** Deux passes séparées parce que les deux moitiés ne servent pas
   * les mêmes corps : un corps sombre (le Shinobi, `#141414`) ne se creuse pas
   * — l'assombrir le rend illisible, piège déjà payé — il se **glace**. Un
   * corps clair, l'inverse. D'où deux réglages de fiche, pas un seul curseur.
   */
  if (motif.gloss) {
    const g = ctx.createRadialGradient(x - r * 0.34, y - r * 0.4, 0, x - r * 0.34, y - r * 0.4, r * 1.25);
    g.addColorStop(0, `rgba(255,255,255,${motif.gloss})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fill();
  }
  if (motif.shade) {
    // Ombre **de bord** : le dégradé ne démarre qu'à 55 % du rayon, sinon il
    // ternit le centre, c'est-à-dire exactement le fond du chiffre de PV.
    const g = ctx.createRadialGradient(x, y, r * 0.55, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${motif.shade})`);
    ctx.fillStyle = g;
    ctx.fill();
  }

  const dessine = motif.mark ? MARQUES[motif.mark] : null;
  if (dessine) {
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(r, r);
    ctx.globalAlpha = motif.alpha ?? 0.45;
    ctx.strokeStyle = motif.color ?? '#000000';
    ctx.fillStyle = motif.color ?? '#000000';
    // `width` est en **pixels d'écran** : la division par `r` annule la mise à
    // l'échelle ci-dessus, qui s'applique aussi au trait. Un motif garde donc
    // la même épaisseur quand le corps enfle (`sizeFactor`) — exactement comme
    // `look.outlineWidth`, dont il est le voisin visuel.
    ctx.lineWidth = (motif.width ?? 3) / r;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    dessine(ctx);
  }

  ctx.restore();
}
