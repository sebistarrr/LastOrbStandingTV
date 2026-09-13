/**
 * Libellés des écrans DOM, dans les deux langues du jeu.
 *
 * **L'application parle anglais.** C'est la langue de la vidéo de référence
 * (`DARK`, `HIGH NOON`, `Damage: 5.50`), donc celle du HUD et du titre d'arène
 * depuis toujours ; les écrans de sélection et de fin étaient les seuls à être
 * restés en français, et ils suivent désormais. `?lang=fr` bascule l'ensemble,
 * chrome DOM compris — plus de moitié d'écran dans une langue et moitié dans
 * l'autre.
 *
 * Le français reste la langue du **code, des commentaires et de la doc** (voir
 * « Habitudes attendues » dans CLAUDE.md) : seul l'affichage change ici.
 *
 * Les deux jeux portent exactement les mêmes clés, `index.html` compris. Le
 * HTML est écrit en anglais pour que la page soit correcte avant même que le
 * module ne se charge ; `applyStaticLabels` la réécrit ensuite, ce qui garantit
 * que le HTML et cette table ne peuvent pas diverger sans que ça se voie.
 *
 * @module ui/lang
 */

/** @typedef {'ref'|'fr'} Lang */

export const UI = {
  /** Anglais : la langue de la vidéo de référence, et celle du jeu. */
  ref: {
    // --- écran de sélection (statique)
    selectTitle: 'CHOOSE YOUR FIGHTERS',
    slotLeft: 'LEFT',
    slotRight: 'RIGHT',
    selectHint: 'Pick a slot, then pick a fighter.',
    start: 'START THE DUEL',
    // --- formats de partie
    modeDuel: 'DUEL',
    modeTeams: '2 VS 2',
    modeSolo: '1 VS X',
    modeRoyale: 'BATTLE ROYALE',
    teamA: 'TEAM A',
    teamB: 'TEAM B',
    slotSolo: 'ALONE',
    tierNormal: 'FIGHTERS',
    tierBoss: 'BOSSES',
    tierTarget: 'TRAINING',
    slotN: (i) => `FIGHTER ${i}`,
    startSolo: 'START THE HUNT',
    startRoyale: 'START THE BRAWL',
    standings: 'FINAL STANDINGS',
    // --- écran de fin (statique)
    ko: 'K.O.',
    rematch: 'REMATCH',
    replay: 'WATCH IT AGAIN',
    exportShort: 'EXPORT AS SHORT',
    exportPending: 'PREPARING…',
    back: 'CHANGE FIGHTERS',
    // --- fiche du combattant (construite en JS)
    sheetRole: 'Role',
    sheetSpeed: 'Speed',
    sheetWeapon: 'Weapon',
    sheetMelee: 'Melee',
    sheetAbility: 'Ability',
    sheetUltimate: 'Ultimate',
    sheetSpecial: 'Special',
    sheetProjectile: 'Projectile',
    /** @param {number} v @param {number} turn */
    speedLine: (v, turn) => `${v} px/s — ${turn} rad/s turn`,
    /** @param {string} name @param {number} reach @param {string} spin */
    weaponLine: (name, reach, spin) => `${name} — ${reach} px reach, ${spin}`,
    spinNone: 'no spin of its own — its angle is commanded',
    /** @param {number} deg */
    spinLine: (deg) => `${deg} °/s spin`,
    /** @param {string} dmg @param {number} cd */
    meleeLine: (dmg, cd) => `${dmg} every ${cd}s`,
    meleeStack: 'current stack',
    /** @param {number} hp */
    meleeHp: (hp) => `${hp} HP`,
    /** @param {string} name @param {number} cd */
    abilityLine: (name, cd) => `${name} — ${cd}s cooldown`,
    /** @param {string} name */
    abilityPassive: (name) => `${name} — passive`,
    /** @param {string} name @param {number} d */
    ultimateLine: (name, d) => `${name} — ${d}s`,
    /** Le pouvoir spécial n'a pas de jauge : sa recharge est la seule chose
     *  qui le décrit à l'écran de sélection. */
    specialLine: (name, d, cd) => `${name} — ${d}s, every ${cd}s`,
    specialNone: 'none',
    projectileNone: 'none — everything goes through the weapon and the zones',
    /** @param {string} label @param {string} dmg @param {number} speed */
    projectileLine: (label, dmg, speed) => `${label} — ${dmg}, ${speed} px/s`,
    // --- résultat
    /** @param {string} name */
    winner: (name) => `${name} WINS`,
    /** Deux vainqueurs ou plus : l'accord change, donc une entrée à part. */
    winners: (names) => `${names} WIN`,
    /** @param {number} hp @param {string} dur @param {number} hits @param {number} seed */
    resultDetail: (hp, dur, hits, seed) =>
      `${hp} HP left · ${dur} s duel · ${hits} hits · seed ${seed}`,
    // --- annonces parlées (render/audio.js)
    /**
     * **Ce que dit l'annonceur, et rien d'autre ne le dit.** Ces quatre entrées
     * sont écrites pour être *entendues*, pas lues : pas de capitales (une voix
     * de synthèse épelle un mot tout en majuscules comme un sigle), pas de
     * ponctuation décorative, et des mots pleins là où l'écran se contente d'un
     * signe. C'est pour cela qu'elles ne réutilisent pas `winner`/`winners`.
     *
     * @param {string[]} noms les combattants d'un même camp
     */
    speechSide: (noms) => noms.join(' and '),
    /** @param {string[]} cotes un texte par camp */
    speechVersus: (cotes) => cotes.join(' versus '),
    /** @param {string} nom */
    speechWinner: (nom) => `${nom} wins`,
    /** Deux vainqueurs ou plus : l'accord change, comme au bandeau. */
    speechWinners: (noms) => `${noms} win`,
    exportDone: 'Video downloaded — ready for YouTube Shorts.',
    exportUnsupported: 'Video export is not available in this browser.',
    /**
     * @param {string} ext @param {string} mb @param {string} son
     *
     * `son` dit si le fichier porte la piste audio : ça se voit à l'ouverture
     * du fichier, donc **après** l'avoir publié. Le navigateur exige un geste
     * avant d'ouvrir le son, et une page lancée directement sur `?a=…&b=…` n'en
     * a pas reçu : un duel peut donc être filmé muet, et il vaut mieux le lire
     * ici que le découvrir sur YouTube.
     */
    exportReady: (ext, mb, son) => `Vertical 1080 × 1920 · ${ext} · ${mb} MB · ${son}`,
    exportSound: 'with sound',
    exportSilent: 'no sound',
    // --- son
    /** Le bouton ne porte qu'une icône : ces deux libellés sont son `aria-label`,
     *  et ils changent avec son état — c'est le seul texte d'interface qui le
     *  fasse, d'où deux clés au lieu d'une. */
    soundMute: 'Mute the sound',
    soundUnmute: 'Turn the sound back on',
    // --- accessibilité
    ariaStage: 'Duel arena',
    ariaSelect: 'Fighter selection',
    ariaRoster: 'Available fighters',
    ariaResult: 'Duel result',
    noscript: 'This duel needs JavaScript.',
    docTitle: 'LAST ORB STANDING — ten fighters, one arena',
  },

  /** Français : la traduction, atteignable par `?lang=fr`. */
  fr: {
    selectTitle: 'CHOISIS TES COMBATTANTS',
    slotLeft: 'GAUCHE',
    slotRight: 'DROITE',
    selectHint: 'Clique sur un slot puis sur un combattant.',
    // --- formats de partie
    modeDuel: 'DUEL',
    modeTeams: '2 CONTRE 2',
    modeSolo: '1 CONTRE X',
    modeRoyale: 'BATAILLE ROYALE',
    teamA: 'ÉQUIPE A',
    teamB: 'ÉQUIPE B',
    slotSolo: 'SEUL',
    tierNormal: 'COMBATTANTS',
    tierBoss: 'BOSS',
    tierTarget: 'ENTRAÎNEMENT',
    slotN: (i) => `COMBATTANT ${i}`,
    startSolo: 'LANCER LA TRAQUE',
    startRoyale: 'LANCER LA MÊLÉE',
    standings: 'CLASSEMENT',
    start: 'LANCER LE DUEL',
    ko: 'K.O.',
    rematch: 'REVANCHE',
    replay: 'REVOIR CE DUEL',
    exportShort: 'EXPORTER EN SHORT',
    exportPending: 'PRÉPARATION…',
    back: 'CHANGER DE COMBATTANT',
    sheetRole: 'Rôle',
    sheetSpeed: 'Vitesse',
    sheetWeapon: 'Arme',
    sheetMelee: 'Corps à corps',
    sheetAbility: 'Pouvoir',
    sheetUltimate: 'Ultime',
    sheetSpecial: 'Spécial',
    sheetProjectile: 'Projectile',
    speedLine: (v, turn) => `${v} px/s — virage ${turn} rad/s`,
    weaponLine: (name, reach, spin) => `${name} — portée ${reach} px, ${spin}`,
    spinNone: 'sans rotation propre — son angle est piloté',
    spinLine: (deg) => `rotation ${deg} °/s`,
    meleeLine: (dmg, cd) => `${dmg} toutes les ${cd}s`,
    meleeStack: 'pile courante',
    meleeHp: (hp) => `${hp} PV`,
    abilityLine: (name, cd) => `${name} — recharge ${cd}s`,
    abilityPassive: (name) => `${name} — passif`,
    ultimateLine: (name, d) => `${name} — ${d}s`,
    specialLine: (name, d, cd) => `${name} — ${d}s, toutes les ${cd}s`,
    specialNone: 'aucun',
    projectileNone: 'aucun — tout passe par l’arme et les zones',
    projectileLine: (label, dmg, speed) => `${label} — ${dmg}, ${speed} px/s`,
    winner: (name) => `${name} L’EMPORTE`,
    /** Deux vainqueurs ou plus : l'accord change, donc une entrée à part. */
    winners: (names) => `${names} L’EMPORTENT`,
    resultDetail: (hp, dur, hits, seed) =>
      `${hp} PV restants · duel de ${dur} s · ${hits} touches · seed ${seed}`,
    // --- annonces parlées (voir le commentaire côté anglais)
    speechSide: (noms) => noms.join(' et '),
    speechVersus: (cotes) => cotes.join(' contre '),
    speechWinner: (nom) => `${nom} l’emporte`,
    speechWinners: (noms) => `${noms} l’emportent`,
    exportDone: 'Vidéo téléchargée — prête pour YouTube Shorts.',
    exportUnsupported: 'Export vidéo indisponible sur ce navigateur.',
    exportReady: (ext, mb, son) => `Vertical 1080 × 1920 · ${ext} · ${mb} Mo · ${son}`,
    exportSound: 'avec le son',
    exportSilent: 'sans le son',
    soundMute: 'Couper le son',
    soundUnmute: 'Remettre le son',
    ariaStage: 'Arène de duel',
    ariaSelect: 'Sélection des combattants',
    ariaRoster: 'Combattants disponibles',
    ariaResult: 'Résultat du duel',
    noscript: 'Ce duel nécessite JavaScript.',
    docTitle: 'LAST ORB STANDING — dix combattants, une arène',
  },
};

/**
 * Nom d'affichage d'un combattant, de son arme, de son pouvoir et de son
 * ultime. Les fiches portent les deux : `name` en français, `nameRef` tel
 * qu'il est écrit dans la vidéo. Un seul point de décision pour tout l'écran.
 *
 * @param {{name:string, nameRef?:string}} o
 * @param {Lang} lang
 */
export function label(o, lang) {
  return lang === 'fr' ? o.name : o.nameRef ?? o.name;
}

/**
 * Applique les libellés statiques d'`index.html`. Appelé même en anglais :
 * c'est ce qui empêche le HTML et la table de diverger en silence.
 *
 * @param {Document|HTMLElement} root
 * @param {Lang} lang
 */
export function applyStaticLabels(root, lang) {
  const t = UI[lang] ?? UI.ref;
  const set = (sel, value) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = value;
  };
  const aria = (sel, value) => {
    const el = root.querySelector(sel);
    if (el) el.setAttribute('aria-label', value);
  };

  set('.select-title', t.selectTitle);
  // Les emplacements sont construits en JS et portent déjà leur libellé ; il ne
  // reste ici que ce qui est écrit en dur dans `index.html`.
  set('[data-mode="duel"]', t.modeDuel);
  set('[data-mode="teams"]', t.modeTeams);
  set('[data-mode="solo"]', t.modeSolo);
  set('[data-mode="royale"]', t.modeRoyale);
  set('.select-hint', t.selectHint);
  set('#btn-start', t.start);
  set('.result-kicker', t.ko);
  set('#btn-rematch', t.rematch);
  set('#btn-replay', t.replay);
  set('#btn-export', t.exportShort);
  set('#btn-back', t.back);
  set('noscript p', t.noscript);

  // Le bouton de son n'a pas de texte : son libellé *est* son `aria-label`, et
  // `main.js` le réécrit à chaque bascule.
  aria('#btn-sound', t.soundMute);
  aria('#stage', t.ariaStage);
  aria('#screen-select', t.ariaSelect);
  aria('#roster', t.ariaRoster);
  aria('#screen-result', t.ariaResult);

  if (root.title !== undefined && root === document) document.title = t.docTitle;
  if (root === document) document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
}
