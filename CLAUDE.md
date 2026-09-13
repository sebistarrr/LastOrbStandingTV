# CLAUDE.md — mémoire du projet

Duels **à deux, en 2 contre 2, en 1 contre X ou en bataille royale**, avec dix
combattants : cinq repris de la chaîne « ballthingsim » — le Pistolero, le
Ronin, l'Hoplite, le Shinobi et le Druide — et **cinq inventés**, le Golem, le
Mannequin (une cible d'entraînement qui ne frappe pas), la Comète (rien qui
frappe : son élan est son arme) et **deux boss**, le Soleil et la Lune. Moteur écrit
d'après les vidéos de référence.
HTML + CSS + JS ES modules, Canvas 2D, **aucune dépendance, aucun build**.
Publié sur GitHub Pages à chaque push sur `main` → <https://sebistarrr.github.io/test2/>

**Ce fichier est relu à chaque session : chaque ligne y est payée à chaque
fois.** Il ne porte donc que **les règles** — carte, roster, invariants, index
des pièges, outils —, et sous leur forme la plus courte. Le *pourquoi* — mesures,
balayages, histoire — vit ailleurs et ne s'ouvre qu'à la demande, une fois :

| Quand | Fichier |
| --- | --- |
| Savoir **pourquoi** une règle existe : mesures, chiffres, histoire. Y sont aussi la **méthode de relevé vidéo** et les **écarts volontaires** au relevé | `docs/PIEGES.md` |
| Travailler sur **un combattant** : relevés, écarts, demandes passées, **équilibrage** | `docs/FICHES.md` |
| **Ajouter ou modifier** un personnage | `docs/AJOUTER-UN-COMBATTANT.md` |

Un piège de l'index tient ici en **une ligne** ; sa mesure, son balayage et son
histoire sont dans `docs/PIEGES.md`, **sous le même intitulé**. Avant de refaire
un geste qu'un piège nomme, y aller lire le détail — c'est là qu'est le chiffre
qui évite de le repayer. Même règle pour un chiffre d'équilibrage et
`docs/FICHES.md`.

Ces deux fichiers sont longs et **ne se lisent jamais en entier** : chacun porte
en tête un sommaire avec le numéro de ligne de ses sections, à ouvrir sur la
bonne (`offset` / `limit`). Les numéros dérivent ; `grep -n '^#\+ '` les recale.

---

## Carte

**Un combattant = trois fichiers du même nom.** `wind`, c'est
`data/fighters/wind.js` (sa fiche), `game/abilities/wind.js` (ses pouvoirs) et
`data/pixelart/wind.js` (ses dessins). Rien d'autre à ouvrir pour le modifier.

| Besoin | Fichier |
| --- | --- |
| Stats, couleurs, armes, pouvoirs d'un combattant | `src/data/fighters/<id>.js` |
| Valeurs universelles + helper `fiche()` | `src/data/defaults.js` |
| Registre du roster (`ELEMENTS`, `ROSTER`) | `src/data/elements.js` |
| Sprites pixel-art (texte) | `src/data/pixelart/<id>.js`, recensés dans `src/data/pixelmaps.js` |
| Overrides de sprites en vrai PNG (écart assumé à « aucun binaire ») | `assets/sprites/` + `manifest.json` |
| **Combattant sans arme** (Mannequin, LUNE, Comète) | **c'est `hitbox` à 0 qui l'empêche de toucher**, pas la portée : `bladeSegment()` écrase le tranchant sur le pivot, la condition de `weaponHit` devient impossible. Plus sûr que des dégâts à zéro. Une arme peut donc être **dessinée sans exister** (la ceinture de la Comète : sprite + `reach`, hitbox nulle, matrice identique), et les dégâts, s'il y en a, sont appelés **par le module** |
| Géométrie de scène, phases, export vidéo | `src/data/tuning.js` |
| Déroulé du duel, dégâts, rendu global | `src/game/match.js` |
| Entité combattant (état + dessin) | `src/game/fighter.js` |
| Pouvoirs d'un combattant | `src/game/abilities/<id>.js` |
| Pouvoir **spécial** greffé (3<sup>e</sup> créneau) | bloc `special` de la fiche + `f.state.spec` dans le module |
| Mise en scène (rubans, fuseaux, nappes, ondes, nombres) | `src/render/flair.js` + `look.flair` de chaque fiche |
| **Son** : synthèse des bruitages et annonceur | `src/render/audio.js` |
| **Recettes de bruitage** (aucun fichier audio) | `src/data/sound.js` + `sound` de chaque fiche |
| Écrans DOM | `src/ui/select.js`, `src/ui/result.js`, `index.html`, `styles/style.css` |
| **Rangée d'un combattant à la sélection** | clé `tier` de sa fiche — lue par `ui/select.js` seul, jamais par le moteur |
| Libellés d'interface (les deux langues) | `src/ui/lang.js` |
| Câblage, boucle, seed, enregistreur | `src/main.js` |
| **Formats de partie** | `src/ui/select.js` (la table `FORMATS`) + `src/game/match.js` (le moteur) |

`elements.js` et `pixelmaps.js` ne sont que des **registres** : aucune valeur de
combattant n'y vit. Les ouvrir pour changer une couleur est une erreur de
navigation, pas un besoin.

---

## Roster

**Dix combattants, tous jouables.** Cinq sont relevés sur trois vidéos
« ballthingsim » en 576 × 1024, 30 fps ; **le Golem, le Mannequin, le Soleil, la
Lune et la Comète sont inventés** — aucune de leurs valeurs ne peut porter
`mesuré`, tout y est `calé` ou `déduit`.

**Trois combattants sont hors barème.** Le Mannequin ne peut pas gagner ; les
**deux boss** battent les sept autres et **ne se départagent qu'entre eux** — ce
sont des **spécifications**, pas des défauts à corriger. Les **sept du milieu**
se jugent entre eux.

**La spécification des boss n'est plus satisfaite sur deux points, et c'est le
choix courant** : le Soleil perd une graine sur trois contre l'Hoplite, et leur
duel a désormais un vainqueur (LUNE, 50/50). Les deux écarts sont mesurés et
leurs leviers connus — voir « L'équilibrage en cinq lignes » ci-dessous. Les
lire comme des bugs à corriger, c'est rouvrir un rééquilibrage que personne n'a
demandé.

Chaque ligne dit **ce qui est structurel** — la clé de fiche qu'on ne casse pas
sans le savoir. Les valeurs, les relevés et les demandes : `docs/FICHES.md`.

| Personnage | Ce qui le tient |
| --- | --- |
| `outlaw` **PISTOLERO** | tireur de glace, **canon asservi** (`weapon.spin = 0`), barillet, balles gelantes, `weaponTwirl` au rechargement. **Champ de givre** greffé |
| `bladesman` **RONIN** | duelliste, rotation qui monte jusqu'à la surchauffe, **`Damage = Spin`**, brûlure au contact. **Aura de braise** greffée |
| `lancer` **HOPLITE** | chargeur, **lance braquée sur le cap** (`weapon.spin = 0`), **la plus longue portée du jeu**, dégât qui monte à chaque touche, **Foudre tombante** qui le sort de l'arène (`offstage`). **Dôme de drain** greffé |
| `wind` **SHINOBI** | ninja sombre, **la bille est le shuriken** — sprite centré, hitbox en **disque**. Porte le **Clone d'ombre**, voir plus bas |
| `mage` **DRUIDE** / DRUID | tireur, **sceptre posé sur le flanc et dessiné par-dessus la bille** (`spin = 0` + `weaponLateral` + `weapon.overBody`), **orbes guidées** (`projectiles.orb.homing`). **Orage de ronces** et **Tir enraciné** |
| `golem` **GOLEM** | des six : le plus lent, la portée la plus courte, le plus gros corps, et **`maxHp` doublé** — sa seule défense, sans aucune réduction de dégâts. Onde sismique sur horloge, Éclats de roche, **Séisme** |
| `sun` **SOLEIL** / SUN | **boss.** Deux fois la norme en rayon, `maxHp` ×5, le plus lent de très loin — c'est toute sa contrepartie. **Huit rayons** en couronne (`weapon.spokes: 8`, aucun angle mort) qui **ne blessent pas** (`melee.damage: 0`, demandé) : sa silhouette et son bruit, plus son arme. Tout passe donc par son **ultime** |
| `lunar` **LUNE** / MOON | **boss, et le seul combattant sans arme qui gagne** — `reach: 0`, `hitbox.radius: 0`, pas de `head.sprite` (le cas du Mannequin) : **100 % de sa production tombe du ciel**, corps de rayon fixe, `maxHp` ×5. Pouvoir et ultime sont la même averse, à deux densités |
| `dummy` **MANNEQUIN** / DUMMY | **cible d'entraînement, pas un adversaire** : aucune arme, aucun dégât, aucun pouvoir, blanc. Il existe pour qu'on **regarde l'autre** — sa ligne de HUD affiche les dégâts **subis**, donc la production réelle de l'adversaire |
| `comet` **COMÈTE** / COMET | **rien qui frappe, et c'est son corps qui blesse** — `hitbox` à 0 sur ses trois clés : `resolveMelee` ne tourne jamais pour elle, son module appelle `game.damage` lui-même au contact. Sa **ceinture de débris est un dessin** (sprite + portée, hitbox nulle), comme son corps, tous deux découpés de la même maquette. La plus rapide et la plus petite du roster. Son dégât suit un **facteur continu** (`f.state.rush`) qui monte tout seul et que **chaque choc dépense** — sa vitesse est sa puissance *et* sa ressource |

**Le Clone d'ombre**, parce qu'il touche le moteur : des doubles de 15 PV qui
sont de **vrais combattants du tableau**, dans le camp du Shinobi, avec **tous
ses pouvoirs** — donc **un clone invoque des clones**. **Le groupe ne fait qu'un
au HUD** (une plaque, PV cumulés, une paire de jauges), **qu'un seul nom** au
bandeau de victoire et au classement, et **ses pouvoirs battent à une horloge
unique, partagée par référence** : ils partent tous en même temps.

**Un id ne se renomme pas** : il n'est montré à personne, et le changer
toucherait `ROSTER`, `abilities/index.js`, les trois registres, les noms de
fichiers et les URL d'archive. Seuls `name`/`nameRef` changent.

Les noms sont des **archétypes, pas des noms propres**, sur le patron de
SHINOBI : **l'article revient** (« le Pistolero ») ; **le genre suit le nom, pas
le personnage** (« le Fer de lance » donne « **la** Charge de lance » — un
remplacement de jeton ne peut pas le savoir) ; et **`name`/`nameRef` peuvent
rediverger**, un archétype se traduisant là où un nom propre non.

**Sept éléments relevés sur *Elemental Armory League* ont été supprimés** — ni
fiche, ni module, ni sprite, ni liste `DISABLED` ; le huitième, le Vent, survit
sous les traits du Shinobi, et ce qu'il reste des autres est **greffé sur un
survivant**. Un commentaire qui cite un élément disparu parle d'une
**provenance**, pas d'un fichier à ouvrir.

### L'équilibrage en cinq lignes

**Relevé courant** (`tools/matrix-reference.txt`), 27 duels hors miroir chacun :
**Lune 27**, **Soleil 23**, Pistolero 15, Druide 14, Hoplite 13, Golem 13,
Shinobi 13, Comète 12, Ronin 5, Mannequin 0 (c'est sa définition). Écart **5 à
15** entre les sept du milieu, connu et non corrigé.

- **Le sommet n'est plus partagé, et c'est assumé : LUNE est au-dessus** (50/50
  contre le Soleil, 140/140 contre les sept autres du banc de l'époque, et
  16/16 contre la Comète, mesurés à part), prix de deux demandes —
  500 PV et une zone de météore de 115 px. **Le retour à un partage tient en un
  chiffre**, `LUNAR.maxHp` : 280 → 27/50, 500 → 50/50, balayage monotone.
- **Le Soleil perd une graine sur trois contre l'Hoplite** et rien n'a été calé
  pour masquer la ligne : trois balayages de couronne sont **non monotones**. Si
  la spécification doit redevenir absolue, le levier est **l'horloge de son
  ultime**, et c'est un rééquilibrage à part entière.
- **Les lignes `… vs dummy` sont un banc de DPS**, pas un relevé d'équilibrage,
  et elles ne suivent pas la durée des duels. `dummy vs dummy` finit en
  **`timeout`** : deux combattants sans dégâts ne se départagent jamais.
- **La matrice ne joue chaque paire qu'une fois, toujours dans le même sens** :
  elle exagère les écarts **et peut aussi en cacher un**. Avant de conclure
  qu'un « dernier » doit remonter, le remesurer **sur les deux camps**.
- **Un changement confiné à un combattant ne doit déplacer que ses lignes**, et
  ça se vérifie dans le diff : les autres gardent leur compte **absolu**. À
  l'ajout d'un combattant, le diff ne contient **que des ajouts** et leurs
  comptes ne montent que des lignes neuves (l'ajout de la Comète : +2 au
  Pistolero, +3 au Golem, +1 aux quatre autres, et pas une ligne existante
  déplacée).
- **La Comète est le premier combattant dont le dégât suit une grandeur
  continue** (`f.state.rush`, de 1 à 2,3) et non une pile : ses deux leviers
  sont donc **raides**, un point de dégât couvrant presque toute la bande
  (4 → 88 %, 3 → 51 %, 2 → 2 % contre les six).

Les chiffres, les balayages et l'histoire de chaque rééquilibrage — division des
dégâts par deux, Golem/Ronin, nerf Shinobi/Pistolero, refontes de LUNE, banc de
DPS détaillé — sont dans `docs/FICHES.md`, section « Équilibrage du roster ».

---

## Formats de partie

Quatre, et **un seul mécanisme** : le moteur reçoit une liste de combattants et
un camp pour chacun. Il ne sait pas ce qu'est un « 2 contre 2 » ; il sait qui
peut blesser qui.

| Format | `elements` | `teams` |
| --- | --- | --- |
| Duel | 2 identifiants | omis → `[0, 1]` |
| 2 contre 2 | 4 identifiants | `[0, 0, 1, 1]` |
| **1 contre X** | 3 à 5 identifiants | `[0, 1, 1, …]` |
| Bataille royale | 3 à *n* identifiants | omis → chacun le sien |

`ui/select.js` porte la table des formats et fabrique les camps ; `main.js` les
lit aussi depuis l'URL (`?f=a,b,c&teams=0,0,1`). Ajouter un format ne demande
**qu'une entrée dans cette table** — pas une ligne de moteur. Chaque entrée porte
tout ce qui distingue son format (`taille`, `min`/`max`, `camps`, `tag`,
`bouton`) : **aucun `mode === '…'` ne doit ressortir dans `select.js`**, et c'est
`min` qui décide l'affichage du compteur, pas un nom de format.

- **Le 1 contre X et la bataille royale ne diffèrent que par `camps`** :
  `[0, 1, 1, 1]` contre `[0, 1, 2, 3]`. Même compteur, deux parties sans rapport.
- **L'écran plafonne la bataille royale à 5** (`Math.min(5, ROSTER.length)`) :
  choix de lisibilité — le HUD n'a que deux bandeaux —, pas une limite du moteur,
  qui en accepte *n*. Agrandir le roster ne déplace pas ce plafond.
- **Les points de vie ne se règlent pas** — demandé : le champ, ses bornes et le
  paramètre du moteur ont été **retirés** plutôt que masqués.
- **La norme est de 100 PV** (`MATCH.maxHp`). Modifier cette constante **change
  la durée des duels d'autant** et déplace la matrice entière : ce n'est pas un
  réglage confiné, c'est le rythme du jeu.
- **Mais `maxHp` est aussi une valeur de fiche**, lue en une ligne
  (`el.maxHp ?? MATCH.maxHp`) : absente partout sauf chez le Golem et les deux
  boss. À ne pas confondre avec le curseur retiré ci-dessus.
- **`Fighter.maxHp` est donc par combattant** : **rien ne doit diviser par une
  constante** — un seuil écrit en valeur absolue devient faux le jour où la
  grandeur qu'il compare cesse d'être constante, et il ne crie pas en le devenant.
- **`MATCH.timeScale` règle la vitesse de déroulement, et vaut 1.** C'est un
  facteur de **temps réel consommé** (`acc += elapsed * timeScale`), pas un
  facteur de pas : le mettre dans le pas changerait toutes les intégrations, donc
  les collisions limites, donc les vainqueurs.
- **Deux durées règlent la fin** : `MATCH.victory.settle` est le temps de **mise
  en place**, `MATCH.victoryDuration` le temps **total**. Allonger la seconde
  tient l'image plus longtemps ; allonger la première ralentit l'animation.
- **Un bandeau nomme les vainqueurs pendant la parade**, dans l'arène : l'écran
  de résultat **n'est pas filmé**.
- **La matrice reste un outil de duel**, délibérément : c'est le garde-fou de
  non-régression du 1v1, la seule configuration dont l'équilibrage soit relevé.

Ce qui change à l'écran au-delà de deux — HUD en deux bandeaux, mort retirée
aussitôt, titre d'arène, placement en anneau, classement, parade à plusieurs :
`docs/PIEGES.md`.

---

## Langue

**L'application est en anglais, le dépôt est en français.** Ce que voit le
joueur est en anglais (c'est la langue de la vidéo de référence) ; le code, les
commentaires, la doc, les réponses **et les messages d'erreur console** restent
en français.

Tout l'affichage passe par `src/ui/lang.js` : `UI.ref` (anglais) et `UI.fr`, aux
**clés strictement identiques**, plus l'aide `label()`. `?lang=fr` bascule tout.
Chaque fiche porte donc **les deux moitiés** de son identité : `name`/`nameRef`,
`tagline`/`taglineRef`, `weapon.name`/`.nameRef`, `ability`+`ultimate`
`.name`/`.nameRef`, `projectiles.*.label`/`.labelRef`, `hud.statFr`/`hud.stat`,
`ultimate.barLabelFr`/`.barLabel`.

**Un combattant sans ses champs `Ref` retombe en français au milieu d'un écran
anglais** : `label()` a un repli silencieux (`nameRef ?? name`) qui évite le
plantage mais pas l'incohérence — `tools/lang-check.mjs` les vérifie.
`index.html` est écrit en anglais pour que la page soit correcte avant le
chargement du module, puis `applyStaticLabels()` la réécrit.

---

## Son

**Aucun fichier audio** : les bruitages sont **synthétisés** (`data/sound.js`
porte les recettes, `render/audio.js` les monte). Rien à charger, rien qui puisse
manquer, et un timbre qui se **transpose par combattant**.

- **La fiche décide, comme pour les sprites.** Bloc `sound` : `pitch` et un nom
  de recette par créneau (`shot`, `hit`, `impact`, `bounce`, `ability`,
  `special`, `ultimate`). Le moteur joue le créneau, la fiche dit la matière. Un
  projectile peut nommer la sienne (`projectiles.x.sound`), et une fiche peut
  ajouter un créneau que son seul module lit (l'Hoplite : `strike`).
- **Chaque combattant a son jeu de bruitages** — demandé, chantier clos. Plus
  aucun créneau n'est partagé, sauf `bounce` (`thud`, le mur, qui n'appartient à
  personne) et `impact` (le projectile générique). Les recettes restent nommées
  par **matière**, jamais par combattant : c'est la fiche qui les attribue.
- **Deux combattants qui partagent une recette se font taire l'un l'autre** —
  `MIX.repeatGap` est indexé par recette, pas par combattant.
- **Deux familles de recettes, et la seconde dit un *état*.** `SOUNDS` joue des
  **événements** ; `LOOPS` tient une voix tant qu'un état dure et en module la
  matière image par image (`sfx.swing`, déclaré par `sound.swing`). Le régime est
  **mesuré sur `weaponAngle`**, jamais lu dans `weapon.spin`, qui n'en porte que
  le plancher.
- **Le son ne lit que de l'état déjà calculé** et n'écrit rien — même contrat que
  `flair.js`. Il ne tire ni dans `game.rng` ni dans `viewRng` (invariant 2) : sa
  dérive de hauteur passe par `Math.random`, exprès.
- **Trois créneaux n'ont demandé aucune ligne dans les modules** parce que le
  moteur voyait déjà passer l'événement : le tir (`Projectiles.spawn`), la touche
  (`Match.damage`) et l'ultime (la bascule de `f.ult.active`). Seuls `ability` et
  `special` sont appelés par les modules, une ligne chacun.
- **L'annonceur parle la langue de l'écran** (clés `speech*`), et les noms lui
  sont passés **en minuscules** : une voix de synthèse épelle volontiers un mot
  tout en capitales.
- **Le son s'ouvre à un geste** et pas avant (`sfx.unlock()`) : sans geste, `sfx`
  n'a pas de contexte et **tous ses appels sont des `return`** — c'est ce qui le
  rend gratuit pour `matrix.mjs` et `shot.mjs`.
- **La vidéo exportée porte les bruitages** : le graphe se sépare après le
  compresseur, une branche aux enceintes, l'autre dans le flux du canvas. D'où :
  le **MIME se choisit à chaque `start()`** (un conteneur qui ne nomme aucun
  codec audio donne un fichier muet) ; **couper le son ne coupe que les
  enceintes**, le robinet étant après la dérivation ; et **un duel lancé sur
  `?a=…&b=…` est filmé muet**, personne n'ayant cliqué — la ligne d'export le dit.
- **La voix n'entre pas dans l'export et ne le pourra pas** : `speechSynthesis`
  sort hors de tout graphe `AudioContext`. Ce que la voix dit, **l'image le dit
  aussi** — titre d'arène, bandeau de parade.

---

## Invariants — à ne jamais casser

1. **Fiches gelées.** `deepFreeze` + `assertFrozen()` à chaque duel. Un duel ne
   peut pas déteindre sur le suivant.

2. **Déterminisme.** `?seed=` doit rejouer un duel à l'identique, et le bouton
   « Revoir ce duel » en dépend.
   - `game.rng` = simulation. **Tout appel consomme le flux** : ajouter un
     `fx.burst()` dans un chemin de simulation décale tout ce qui suit et change
     les vainqueurs. Déjà arrivé deux fois.
   - `game.viewRng` = rendu seul. Toute décoration passe par lui, ou par un
     hachage pur (`hash01`).
   - `render/audio.js` a son propre aléa, et c'est **`Math.random`** : le premier
     flux changerait les vainqueurs, le second déplacerait le tremblement de
     caméra — donc l'image d'un duel rejoué à la même graine.
   - `render/flair.js` est **la** porte d'entrée du spectacle : aléa `viewRng`,
     banc de particules séparé, aucun accès à `game.rng`. Sa règle de
     composition : **rien entre le spectateur et les combattants** — remplir le
     cadre par le fond, les bords ou l'arrière, jamais par une nuée flottante.

3. **Équilibrage.** Après **tout** changement, comparer la matrice : un
   changement visuel doit la laisser **identique au fichier près**.
   `tools/matrix-reference.txt` ne se régénère que quand un changement
   d'équilibrage est **voulu et assumé**, et il faut alors le justifier.
   - **`ROSTER` décide qui est le camp A**, et le camp A pèse lourd : un nouveau
     venu s'ajoute **en queue**, preuve à vérifier — le diff de la matrice ne
     contient **que des ajouts**.
   - **Un changement confiné à un combattant ne doit déplacer que *ses*
     affrontements.** Une ligne déplacée ailleurs est un bug.

4. **Le décor ne bouge jamais** (cahier des charges) — rasterisé une fois dans
   `scene.js`, blitté en un `drawImage`.

5. **Deux rotations d'arme, à ne jamais confondre.** `weaponAngle` est la
   direction dans laquelle l'arme **pointe depuis le corps** (la faire tourner
   fait *orbiter* l'arme) ; `weaponTwirl` est sa rotation **propre** autour du
   milieu de sa carte (elle *vrille sur place*). Le centre de vrille est **déduit
   de la portée** (`(handle.length + reach) / 2`), pas mesuré sur le sprite.

6. **Convention de commentaire dans les fiches** : chaque valeur porte `mesuré`
   (relevé vidéo), `calé` (ajusté par simulation) ou `déduit`. Ne jamais changer
   un `mesuré` sans nouveau relevé, et ne pas caler par réflexe : un `calé` se
   justifie par une mesure, pas par une intuition.

7. **Les compteurs génériques du `Fighter`.** `offstage`, `invulnerable`,
   `boost`, `ghosting`, `weaponLateral`, `weaponTwirl` et `sizeFactor` ont la
   même forme : un module les allume, le moteur les décompte ou s'en sert, et le
   moteur **ne sait pas pourquoi**. Forme à reprendre pour tout nouvel effet.
   - **`sizeFactor` multiplie `look.radius` dans `get radius()`**, et ce seul
     getter suffit à tout : les 81 lecteurs du moteur y passent déjà — murs,
     séparation des corps, verrou de mêlée, aura, contour, chiffre de PV, et le
     sprite de corps. À 1, `x * 1` est exact en IEEE 754.

8. **`alive` ≠ `onStage`.** Un combattant peut être vivant *et absent*
   (`Fighter.offstage`). **Toute boucle qui teste `f.alive` pour décider de le
   *voir* doit tester `f.onStage`** : `flair.js`, `physics.js`, `projectiles.js`,
   le rendu de `match.js`. Un oubli laisse un ruban ou une hitbox fantôme.

9. **Une clé de fiche que plus personne ne lit ne crie pas.** Deux régressions :
   une clé supprimée que le module lisait encore (NaN dès la première touche),
   puis une écriture perdue laissant la clé sans lecteur — **le premier plante,
   le second jamais**. `tools/fiche-check.mjs` recoupe les deux sens, sur
   `weapon.lunge` et `special` seulement : `ability` criait à tort dix-neuf fois,
   et un garde-fou qui crie à tort n'est plus lu.

10. **Un ancrage d'arme se pose, il ne s'interpole pas.** `weaponLateral` bascule
    **dans l'image même** où la phase change ; interpoler fait *glisser* l'arme
    pendant la charge. Le saut est ce qu'on veut voir.

11. **Un décalage de dessin doit passer par le pivot, jamais par le seul
    `translate`.** `weaponPivot()` est lu par `drawWeapon()` **et** par
    `bladeSegment()` : décaler seulement le dessin ferait mentir le sprite sur
    l'endroit où il coupe.

12. **Le moteur ne connaît aucun combattant.** `fighter.js`, `physics.js` et
    `projectiles.js` lisent la fiche, jamais un `if (id === …)`. La hitbox en
    disque du Shinobi, le guidage des orbes du Druide et la couronne de huit
    rayons du Soleil (`weapon.spokes`) l'ont éprouvé : **la forme se dit
    entièrement dans la fiche**, et la branche n'existe pas pour ceux qui ne la
    déclarent pas — clé absente, le chemin est celui d'avant, expression par
    expression. Corollaire : un module qui code en dur une clé de sprite se ferme
    à sa propre réutilisation.

13. **Le moteur accepte *n* combattants répartis en camps**, et leur nombre peut
    changer **en cours de partie**.
    - `Match({ elements, teams })` ; omis, chacun a son camp.
    - Le moteur ne connaît **que « même camp » ou « camp adverse »** : ni équipe
      nommée, ni notion de format.
    - Les corps se bousculent entre **tous**, alliés compris ; armes et
      projectiles ne touchent que le camp adverse.
    - `f.opponent` = l'**ennemi vivant le plus proche**, recalculé une fois par
      pas. Les modules le lisent sans le tester.
    - `Match.join()` inscrit un combattant après le départ. **L'entrée est
      différée d'un pas** (`flushArrivals()` en fin de pas) : une `Map` de
      JavaScript **visite les entrées ajoutées pendant l'itération**, donc le
      nouveau venu tournerait dans l'image de sa naissance.
    - **Le duel garde ses expressions, littéralement** : partout où la
      généralisation aurait réécrit le chemin à deux, la branche `length === 2`
      reprend le code d'origine mot pour mot — la multiplication flottante n'est
      pas associative. Preuve exigée à chaque étape : **matrice identique au
      caractère près**.

---

## Outils (dans `tools/`)

```bash
python3 -m http.server 8085 &            # requis par les outils Playwright

node tools/fiche-snapshot.mjs            # empreinte des fiches + cartes, SANS
                                         # serveur : le garde-fou des
                                         # refactorisations de `src/data/`
node tools/fiche-check.mjs               # câblage, clé de sprite absente de
                                         # PIXEL_MAPS, fiche ↔ module
node tools/lang-check.mjs                # clés des deux tables + champs `Ref`
node tools/sound-check.mjs               # action muette, recette refusée
node tools/layout-check.mjs              # les écrans DOM tiennent-ils dans la
                                         # scène ? (pile réelle × formats ×
                                         # tailles × fiches, iPhone 16 Pro)
node tools/export-check.mjs              # la vidéo exportée sonne-t-elle ?
                                         # (redécodage PCM : octets + RMS)
node tools/matrix.mjs                    # tous les affrontements × 3 seeds
node tools/matrix.mjs > /tmp/a.txt && diff tools/matrix-reference.txt /tmp/a.txt
node tools/probe.mjs outlaw              # durée, touches et coups/s sur tout
                                         # le roster

node tools/shot.mjs "?a=wind&b=outlaw&seed=5" /tmp/s 3,9,20
FORCE=bladesman:ult node tools/shot.mjs "?a=bladesman&b=outlaw" /tmp/s 8
                                         # instants en secondes de DUEL :
                                         # l'outil divise par `MATCH.timeScale`

python3 tools/frames.py <video.mp4> <dossier> <pas_s> [t0] [t1]
python3 tools/montage.py <dossier> <sortie.jpg> <cols> <lignes> <largeur> [début]
python3 tools/crop.py <image> <sortie.png> x0 y0 x1 y1 [zoom]
```

**Lequel pour quoi.** `fiche-snapshot` prouve qu'une **réorganisation** n'a rien
changé : il sérialise **les valeurs**, y compris celles qu'aucun duel n'exerce.
`matrix` prouve qu'un changement **visuel** n'a rien changé — il couvre le
**comportement**, que l'empreinte ne voit pas. Aucun ne remplace l'autre.

Vérification syntaxique (pas d'ESLint dans le dépôt) :
`for f in $(find src tools -name '*.js' -o -name '*.mjs'); do node --check "$f"; done`
— **insuffisant seul** : `node --check` analyse en script, pas en module, et a
déjà laissé passer un `};` orphelin qu'a trouvé le navigateur.

Poignée de debug exposée en page : `globalThis.__match`.

---

## Pièges déjà rencontrés — l'index

**Une ligne par piège, et c'est la règle seule** — le chiffre qui l'a produite
est dans `docs/PIEGES.md`, sous le même intitulé.

**Mesurer**

- Angle mesuré contre la mauvaise référence : échantillonner **toute** la vidéo,
  et mettre les hypothèses **en concurrence** dans le même script.
- Un détecteur qui *sélectionne* ce qu'il mesure rapporte ce qu'on y a mis.
- Une orientation demande une **ACP, jamais un barycentre**.
- Un mécanisme juste rend des chiffres qu'on n'a pas calés ; une hypothèse qui
  réclame un paramètre par comportement observé est fausse.
- Une cadence n'a de sens qu'en **nommant l'adversaire**.
- Une maquette ne contient pas toujours ce qu'on y cherche : transcrire si
  possible, **composer** sinon, et le dire en commentaire.

**Équilibrer**

- **Une arme braquée touche en permanence** : chacune porte son garde-fou.
- Une visée réécrite à chaque image touche toujours ; `ability.spread` est raide,
  au banc jamais à l'estime.
- Cadence trop haute : c'est la **fréquence** ou le **taux de réussite** ? Caler
  par le temps mort donne un personnage planté.
- Un banc qui plafonne = mauvais levier → **mesurer d'où vient le dégât**
  (`opts.kind`) avant de balayer.
- La source du dégât dit *quoi* regarder, pas *quelle poignée tourner*.
- **Deux leviers qui marchent ne s'additionnent pas** : un, remesurer, puis l'autre.
- **Le levier d'un combattant faible est parfois chez un autre.**
- **Une grosse barre de vie décide de la *forme* des affrontements** ; la forme,
  elle, ne se règle pas sur la fiche.
- **Lire le banc ligne par ligne** : un total stable cache une redistribution.
- Un balayage **non monotone** est du bruit, et son commentaire doit le dire.
- Un changement de formule (seuil d'arrondi) repasse par la matrice.
- **Regrouper autrement les mêmes produits change le résultat** : le garde-fou
  n'est pas la relecture, c'est la matrice.
- Rééquilibrer : ne toucher que les `calé` et `déduit`.
- **Une arme à plusieurs branches touche dans toutes les directions** : verrou de
  mêlée **une fois pour toutes**, avant les branches.
- **`melee.damage: 0` ne rend pas une arme inerte** : recul propre et décollement
  des corps sont *hors* de `damage`.
- **Un boss n'est pas un déséquilibre à corriger.**
- **Un duel de boss se joue dans la rampe de mort subite** : l'esquive n'y défend
  plus, le seul levier monotone est la **barre de vie**.
- **Satisfaire sa spécification au chiffre près n'empêche pas d'être injouable à
  regarder** : aucun garde-fou du dépôt ne *regarde*.
- **Une orbite doit rester hors du corps quand le corps enfle.**
- **Le taux de touche d'une zone annoncée est gouverné par la *cible*** : dégâts
  et rayon plafonnent. Relever **adversaire par adversaire**, corriger asymétrique.
- **Supprimer une arme peut rendre *plus* fort** : plus aucune raison d'approcher.
- **Retirer la source principale retourne un combattant** : ce qui le rattrape
  est la **fréquence** de ce qui reste, pas sa taille.
- **Rallonger une annonce sans ralentir le suivi *supprime* l'esquive.**

**Déterminisme et ordre d'exécution**

- **Une décoration qui tire dans `game.rng` fait mentir un balayage**, sans planter.
- **Corriger à la source, pas au symptôme** — une moitié corrigée ne se voit pas.
  *Reste à faire : `fx.burst` tire encore dans le flux de simulation.*
- Un garde-fou du moteur réutilisé depuis un module hérite de **l'ordre d'appel**
  (corps → mêlée → pouvoirs → projectiles). Ça ne se lit pas, **ça se compte**.
- Les minuteurs sont **figés** pendant `offstage`, pas suspendus : une chute doit
  reposer le verrou de mêlée comme le ferait `resolveMelee`.
- `offstage` ne doit pas expirer avant le module (marge de 0,1 s).
- `Fighter.step()` tourne **avant** `mod.update()` : le module lit un cap déjà
  intégré et déjà réfléchi par les rebonds du pas.

**Éditer les données**

- Un `re.sub` de calage déborde sans rien casser : `assert` que l'ancre est
  **unique**, et relire le `git diff` avant de croire un chiffre.
- **La hauteur d'une carte d'arme ne coûte rien, la largeur déplace la pointe** —
  et sous override PNG c'est `map.h × scale × (img.w / img.h)` qui fait `reach`.
- **`handle.length` + largeur dessinée = la portée** ; négatif démarre en arrière
  de la bille (voulu : Hoplite, Shinobi).
- Un sprite **se transcrit** de la maquette : une formule interpole ce qu'on ne
  lui a pas demandé.
- Une icône redessinée à la main diverge de son arme : l'échantillonner dessus.
- **Un détourage ne se fait pas toujours à la couleur** : détourer par
  **topologie**. Un masque faux rend une mesure juste sur la mauvaise forme.
- **Réduire mécaniquement une maquette en carte texte** s'essaie et se regarde,
  ça ne se suppose pas.
- **Une arme répétée *N* fois doit être un *N*-ième de la forme visée**, pas le
  motif : répéter le plus bel exemplaire fabrique une forme absente du dessin.
- Pour un **éventail**, `reach` est l'extension **le long de l'axe**, pas le rayon
  de la silhouette.

**Interface et rendu**

- **Une moitié d'écran dans chaque langue** : tout passe par `ui/lang.js`, et un
  garde-fou sur l'**existence** d'un champ ne dit rien de son **usage**.
- La fiche de sélection lit des valeurs qui peuvent être des **fonctions**, et des
  cas limites qui ressemblent à des bugs (`spin: 0`, `cooldown: Infinity`).
- Le chiffre de PV n'a **pas** de contour ; les nombres de dégâts en **ont** un.
- **Assombrir un corps rend illisible ce qui était déjà sombre** : vérifier à
  l'écran après tout changement de `look.body`.
- **Un corps blanc sur l'arène blanche demande quatre compensations** — contour,
  chiffre de PV, aura permanente, `bodyHit` qui **rougit**. Un corps clair, trois.
- **Un corps peut être un sprite** (`look.sprite` + `spriteScale`,
  `spriteFlash`) : dimensionné sur son **disque plein**, jamais cerné, et le
  flash se **pose par-dessus** au lieu de remplacer la couleur.
- **Un chiffre de PV posé sur un dessin demande un contour** (`look.hpStroke`) :
  aucun aplat ne tient sur un dessin ; sur un corps uni, une encre suffit.
- **Corps, arme et pouvoirs doivent être de la même matière** pour se lire comme
  un objet.
- **Un module qui code ses couleurs en dur les fait dériver** du dessin :
  `look.palette`, et aucun littéral de couleur dans le module.
- **Un test de chevauchement de deux corps est toujours faux et ne crie pas** :
  `resolveBodies` les sépare. Une zone « au contact » porte une **marge explicite**.
- **Une zone dessinée au sol se mesure de *centre à centre*** — seul écart du
  dépôt : sinon le cercle ment et un gros corps gagne de la surface gratuitement.
- **Une hauteur de chute simulée doit tenir dans le clip de l'arène.**
- **La densité fait l'impression, pas la puissance** : le nombre d'objets
  simultanés se **calcule** (`durée / intervalle`, `intervalle / chute`).
- **Un format dont un seul camp est nombreux casse une mise en page** : mesurer le
  débordement contre la **fenêtre**, pas contre le parent.
- **La vignette de sélection lit le sprite, pas la carte texte** (donc les
  overrides PNG), et montre `look.sprite` + `weapon.head.sprite`, **jamais `icon`**.
- **Une icône doit remplir son cadre** : elle est dimensionnée sur la hauteur de
  sa carte, pas sur sa matière.
- **Un dessin trop pâle pour un corps fait un excellent petit objet** : c'est la
  **taille** qui décide de la lisibilité.
- **Une ambiance de plein cadre découvre un liseré d'arène nue quand ça tremble**
  (invariant 4) : un pouvoir qui se répète vite ne se secoue pas comme un ultime.
- **La maquette décide de la palette**, pas l'inverse : l'échantillonner par
  bandes de luminance.
- **Un sprite sur damier de transparence a sa trame *cuite* dans les pixels** :
  couper là où le dessin est franchement opaque, peindre le reste au moteur.
- **Une ambiance d'arène se règle sur les bords, pas sur le centre**, et monte en
  **carré**.
- **Mesurer une couleur sur une capture, c'est mesurer un instant qu'on n'a pas
  choisi** : interroger `__match` et attendre la fenêtre voulue.
- **Un trait clair seul n'existe pas sur l'arène blanche** : le doubler d'un
  liseré large et saturé.
- **Un ruban de pointe d'arme ne suit qu'une branche** : une arme à couronne n'en
  déclare pas.
- **Une passe de couleur incomplète n'en est pas une** : tout le bloc `look`,
  `flair` compris.
- Une ruée a **un seul point de sortie** : vitesse, pilotage et ouverture y sont
  remis ensemble.
- L'éventail est borné **en angle, jamais en nombre d'images**.
- **Un pouvoir s'ajoute sur un troisième créneau** (`special` + `f.state.spec` +
  `specialBar`), il ne remplace pas l'ultime ; même tracé de jauge pour les deux.
- Sans `head.sprite` : chaîne de repli sprite → projectile → icône, et un **garde
  dans `drawWeapon`**.
- **Un combattant sans dégâts ne finit jamais son duel** : pas de limite de temps.
- `imageSmoothingQuality` reste en `'low'` (72 % du fil principal sinon), et
  `captureStream()` ne s'appelle **qu'une fois par session**.
- **Un recul se règle en direction, pas en force** : l'ampleur est un levier plat.
- **Un combattant à plusieurs corps ne se nomme qu'une fois** : dédoublonner par
  `el.id`.
- **Un écran DOM déborde la scène 9:16 dans la même proportion partout** : le
  mesurer (pile réelle × formats × tailles × fiches), pas le régler par média.
- **`justify-content: center` déborde des deux côtés** — le haut est perdu, et
  le défilement n'y mène pas.
- **Un `gap` en pourcentage vertical se résout sur la hauteur**, pas sur la
  largeur comme les `padding`.
- Un pouvoir dessiné dans `drawOver` peut **recouvrir le chiffre de PV**, qui est
  repassé après la boucle (`globalAlpha` remis à 1 avant).

**Sonoriser**

- **Un son ne s'ouvre qu'à un geste** : sinon l'`AudioContext` naît suspendu et
  reste muet tout le duel, **sans une erreur**.
- **Compter des échéances, pas des voix** : un plafond décrémenté dans un rappel
  finit par ne plus redescendre.
- **Le même bruitage deux fois en 50 ms sature** : garde-fou de répétition.
- **La synthèse vocale ne passe par aucun graphe audio** : ce que la voix dit,
  l'image doit le dire aussi.
- **Une piste audio dans le flux ne fait pas un fichier sonore** : le MIME doit
  nommer le codec, et seul un **redécodage PCM** prouve le contenu.
- **Un robinet de coupure avant la dérivation d'enregistrement livre une vidéo
  muette** sans que rien ne le dise.
- **Chercher où l'image lit déjà l'événement** avant d'ajouter un état pour le son.
- **Une arme que le moteur ne connaît pas doit dire qu'elle en est une**
  (`opts.sound`), sinon elle sonne comme un projectile perdu.
- **Une voix est une *couche*, pas un bruitage** : enrichir une recette se paie
  sur les autres sons, et un son refusé ne plante pas — il manque.
- **Un garde-fou de couverture ne voit que ce qu'il exerce** (`sound-check` ne
  joue que des duels).
- **« Aucun instant à sonoriser » ≠ « rien à sonoriser »** : demander quel **état**
  le joueur doit entendre.
- **Piloter une voix tenue par la valeur de fiche la fait sonner plate** : mesurer
  la grandeur réelle, la fiche n'en porte que le plancher.
- **Une voix tenue n'a pas d'échéance** : hors du compteur de voix, démarrée au
  silence, arrêtée six constantes de lissage après sa consigne.
- **Un pouvoir qui emprunte le son d'un accident devient un accident** : regarder
  ce que le combattant joue **déjà**.
- **Une recette meurt quand le créneau qui la nommait cesse d'être joué**, pas
  quand on l'efface.
- **Une recette accordée à une valeur de fiche doit bouger avec elle**, et rien ne
  crie si on l'oublie.

**Refactoriser**

- **Une refactorisation se mesure à ce qu'elle retire.**
- **Recompter avant de factoriser** : la duplication n'est pas là où on la dit.
- **Supprimer un combattant ≠ effacer ses fichiers** : rapatrier ce qu'il partage,
  vérifier la matrice, supprimer ensuite.
- **Le code mort d'un combattant supprimé ne se voit pas dans son dossier.**
- **Prouver une réorganisation demande son propre garde-fou** : la matrice reste
  verte sur des valeurs qu'aucun duel ne lit — c'est `fiche-snapshot` qui les couvre.
- **Généraliser une expression du moteur se prouve *avant* d'en avoir besoin** :
  clé posée, absente partout, matrice identique — **puis** le combattant.

**Écrire la doc**

- **Ce fichier se paie à chaque session, les autres à l'ouverture** : une leçon va
  dans `docs/PIEGES.md`, un chiffre d'équilibrage dans `docs/FICHES.md`, et il
  n'en reste **qu'une ligne** ici. Redire ici ce qu'un `docs/` porte déjà, c'est
  le facturer à toutes les sessions qui ne le demandent pas.


## Habitudes attendues

- **Français** dans le code, les commentaires, la doc et les réponses — mais
  **anglais dans l'application**. Un nouveau combattant apporte ses champs `Ref`
  et son bloc `sound` en même temps que sa fiche : sans lui il est **muet**, et
  rien ne crie à part `tools/sound-check.mjs`.
- Commentaires qui expliquent **pourquoi** (et citent la mesure), pas quoi.
- Après un changement **visuel** : capture de contrôle + matrice inchangée. Si la
  matrice bouge, le changement n'était pas visuel.
- Après un changement de **gameplay** : matrice régénérée + justification.
- Après une **réorganisation de `src/data/`** : `fiche-snapshot` identique.
- Tenir `README.md`, `docs/PIEGES.md`, `docs/FICHES.md` et
  `docs/AJOUTER-UN-COMBATTANT.md` à jour ; régénérer `docs/capture-*.png` quand
  le rendu change. Après un ajout de section dans `docs/PIEGES.md` ou
  `docs/FICHES.md`, recaler leur sommaire (`grep -n '^#\+ ' <fichier>`).
- **Tout se développe directement sur `main`.** Pas de branche `claude/*` : on
  commite sur `main` et on y pousse. Le dépôt **n'a plus qu'une branche** — les
  quatre branches de travail portaient trois rosters divergents qu'aucune fusion
  ne pouvait réconcilier. N'en recrée pas.
- Commits en français, corps détaillé, puis push sur `main`, et attendre que
  Pages ait publié.
