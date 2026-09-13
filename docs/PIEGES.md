# PIEGES.md — le détail long

Ce fichier porte ce que `CLAUDE.md` ne peut plus porter : il est lu **à chaque
session**, donc tout ce qui s'y trouve est payé en contexte à chaque fois.
`CLAUDE.md` garde la carte, les invariants et la **règle** de chaque piège en une
ligne ; ici se trouvent les mesures, les chiffres et l'histoire qui l'ont
produite — à ouvrir quand on veut savoir *pourquoi*, ou quand on s'apprête à
refaire le geste.

Trois blocs, dans cet ordre : la méthode de relevé, les écarts assumés au
relevé, puis les pièges eux-mêmes.

**Sommaire** (numéros indicatifs ; `grep -n '^#\+ ' docs/PIEGES.md` les recale) :

| Section | Ligne |
| --- | --- |
| **Méthode de relevé vidéo** | 39 |
| &nbsp;&nbsp;· Le repère de mesure n'est pas le même partout | 51 |
| **Écarts volontaires au relevé** | 68 |
| **Pièges déjà rencontrés** | 142 |
| &nbsp;&nbsp;· Mesurer | 144 |
| &nbsp;&nbsp;· Équilibrer | 179 |
| &nbsp;&nbsp;· Déterminisme et ordre d'exécution | 503 |
| &nbsp;&nbsp;· Éditer les données | 542 |
| &nbsp;&nbsp;· Interface et rendu | 671 |
| &nbsp;&nbsp;· Le son | 1028 |
| &nbsp;&nbsp;· Refactoriser | 1541 |
| **Le détail des sections condensées de `CLAUDE.md`** | 1582 |
| &nbsp;&nbsp;· L'écart du roster, et ce que la matrice cache | 1584 |
| &nbsp;&nbsp;· Formats — ce qui change à l'écran au-delà de deux | 1627 |
| &nbsp;&nbsp;· Invariant 12 — corollaire pour les modules de pouvoirs | 1670 |
| &nbsp;&nbsp;· Invariant 13 — comment le moteur a cessé de compter jusqu'à deux | 1689 |
| &nbsp;&nbsp;· Invariant 3 — la preuve que l'arrivée d'un combattant n'a rien déplacé | 1733 |
| &nbsp;&nbsp;· Invariant 9 — les deux régressions qui l'ont écrit | 1750 |
| &nbsp;&nbsp;· Formats — la table, et pourquoi elle a été écrite après coup | 1766 |

---

## Méthode de relevé vidéo

Les vidéos de référence font 576 × 1024, sauf la première en 720 × 1280 —
soit exactement 0,8 ×. **Toute mesure prise sur une vidéo 576 se convertit
en ×1,25** vers le repère logique du jeu (720 × 1280).

Arène : carré 640 × 640 à (40, 320), bord noir 6 px. Boule : rayon 41.

Marche à suivre : `frames.py` → `montage.py` pour repérer les moments →
`crop.py` pour zoomer → masques numpy pour mesurer (tailles, positions,
couleurs par percentile plutôt que par moyenne, le JPEG bruite).

### Le repère de mesure n'est pas le même partout

Les deux premières vidéos se convertissent **×1,25** vers le repère logique
720 × 1280 du jeu. **Celle de Magia, non : ×1,275** — son arène mesure 502 px
de bord extérieur contre 640 dans le jeu, et la bille le confirme (32 px de
rayon × 1,275 = 40,8, soit les 41 du roster). Ne pas supposer le facteur : le
mesurer sur l'arène, le vérifier sur la bille. Chaque valeur convertie cite sa
mesure d'origine en commentaire ; ne jamais « corriger » un commentaire qui
cite un chiffre en 576.

Ce qui **n'a pas** été reporté tel quel : les vitesses et les cadences. Le jeu
d'origine tournait sous Matter.js à pas fixe, celui-ci intègre à la main et
pilote au cap. Ces valeurs-là sont donc `calé`, mesure d'origine en commentaire.

---


## Écarts volontaires au relevé

Les écarts **par combattant** — arme de l’Hoplite remplacée par une maquette,
reskin du Ronin en lame de braise, Shinobi en ninja sombre — sont détaillés
dans `docs/FICHES.md`. Ce qui suit vaut pour tout le dépôt.

- **Trois vrais PNG dans un dépôt « sans binaire »** : la lame du Ronin, le
  shuriken du Shinobi (deux versions, flamme et ombre). `assets/sprites/manifest.json`
  fait pointer une clé de `PIXEL_MAPS` sur un fichier ; la carte pixel-art reste
  comme **repli automatique** (`render/sprites.js`). C'est cette couche
  d'indirection qui rend un changement d'apparence réversible en une ligne de
  JSON.
- **Fond hors-arène** : la vidéo est sur papier crème, le site est en **encre
  sombre `#1c1a26`**. L'arène reste blanche → le pixel-art garde ses contours
  noirs mesurés. Le « chrome » posé sur le fond sombre passe à un liseré crème
  `STAGE.outline` ; les jauges gardent une plaque crème.
- **L'arène est blanche, et ça contraint toutes les palettes.** Un jaune pâle,
  un grain de poudre quasi blanc, un gris clair n'y existent pas. La traînée de
  celle de l’Hoplite est donc en ambres saturés (`#f0b400`) et non en jaunes clairs ; la
  poudre de givre du Pistolero en bleus tenus ; le shuriken sombre du Shinobi
  plafonné à 168/255. Même leçon que le mode additif, qui ne fonctionnait que
  sur le cadre sombre.
- **Deux modes de traînée, `electric` et `powder`, et chaque règle de l'un est
  l'inverse de l'autre.** L'électrique est un **trait** continu et cassé, dont
  l'écart s'annule au point le plus récent, à `rate` élevé pour grésiller. La
  poudre est un nuage de **grains isolés**, dont l'écart **s'ouvre** en
  s'éloignant du combattant, à `rate` bas pour tenir en place, posée sur une
  **nappe** large et transparente sans laquelle les grains se lisent comme des
  taches détachées. Trois choses font tenir l'électrique, chacune payée : le
  trait doit être **continu** (des points très écartés se referment en chapelet
  de perles), la cassure doit être **perpendiculaire** à la trajectoire (sinon
  le trait s'allonge au lieu de zigzaguer), et son amplitude doit **s'annuler au
  point le plus récent** (sinon la traînée se décroche et flotte à côté). Les
  Tout le roster passe par ce code ; seul celui qui déclare le mode prend la
  branche.
- **Les arcs électriques le long d'une lame** (`look.flair.weaponArc`) sont
  tracés par un **hachage pur** de (indice, temps quantifié), pas par un
  tirage : un aléa consommé dans une méthode de *dessin* dépendrait du nombre
  d'images affichées, qui n'est pas le nombre de pas de simulation, et deux
  machines au même `?seed=` verraient des décorations différentes. Deux réglages
  appris à l'image : `rate` décide si c'est de l'électricité ou du bruit (18
  paliers par seconde), et l'amplitude doit **dépasser la demi-épaisseur du
  sprite**, sinon les arcs restent dans la silhouette qui les recouvre.
- **Les largeurs d'aura et de ruban se règlent à l'image, pas au calcul.** Une
  aura à 26 px formait une **gélule** qui délavait la hampe au lieu de la cerner
  (14 la borde) ; un coin de pénétration à 60 × 26 se lisait comme une **boule**
  collée à la pointe (82 × 12 le rend élancé) ; un ruban de 18 px se referme en
  barres pâles détachées pendant une charge, où la pointe parcourt 224 px en
  0,16 s (13 px tient). Et la largeur des passes d'aura calculée en `1/k` mettait
  la passe **la plus large en dernier**, donc le cœur opaque délavait l'arme au
  lieu de la cerner.
- **L'ultime du Pistolero (`DEAD MAN’S HAND`, anciennement `LEAD HAIL`) ne
  teinte pas l'arène.** Sur sa vidéo, l'arène entière vire au crème pendant cet
  ultime. Ici le décor est rasterisé une fois et **ne bouge jamais**
  (invariant 4) : la lumière se pose donc au sol.
- Filigrane `@ElementalArmoryLeague` non reproduit — ni le « ballthing.com » /
  « @ballthingsim » des vidéos des trois invités.
- **Les bruitages de touche sonnent plus fort et plus large que sur la vidéo
  de référence, demandé.** L'audio de *Outlaw vs Bladesman* (le duel qui a
  fourni le relevé visuel du Pistolero et du Ronin) a été mesuré directement :
  crête proche de la saturation (0,7 à 1,0 en amplitude normalisée) et une
  énergie qui déborde largement dans le médium-aigu, contre des recettes de
  `data/sound.js` plus mesurées. `gunshot`, `blade`, `pierce`, `crunch` et
  `impact` ont leur `gain` relevé, et `blade`/`pierce` leur `q` de bandpass
  abaissé (bande plus large, moins « sifflement fin »). Le compresseur de
  `render/audio.js` (seuil −18 dB, ratio 8:1) fait le reste : le gain plus
  haut le sollicite davantage, ce qui *est* le son « à la limite de la
  saturation » entendu sur la vidéo — pas un défaut à corriger derrière. Aucun
  gain de fiche de combattant n'a bougé, la matrice reste identique au
  caractère près.

---


## Pièges déjà rencontrés

### Mesurer

- **Mesurer un angle contre la mauvaise référence donne une conclusion vraie et
  fausse à la fois.** Le deuxième relevé de la lance concluait « elle vise
  l'adversaire, à ±5° ». C'était exact **sur les images mesurées** — mais elles
  avaient toutes été prises pendant que l’Hoplite fonçait *sur* l'adversaire,
  là où cap de déplacement et cap adverse se confondent. Deux gardes-fous en
  sortent : échantillonner **toute** la vidéo et pas les plages où le détecteur
  marche bien ; et mettre les hypothèses **en concurrence** dans le même script
  plutôt que d'en vérifier une seule.
- **Un détecteur qui *sélectionne* ce qu'il mesure rapporte ce qu'on y a mis.**
  Le troisième relevé de la lance retenait les images « bien allongées » — donc
  celles contenant le **cadre noir de l'arène**, une droite parfaite que l'ACP
  privilégie. Le relevé de l'arrêt avant charge ne retenait un déclenchement que
  si `v[i-1] < 0,35 × v[i]`, puis rapportait qu'il y avait un creux. Les deux
  chiffres ont été **retirés** (voir `docs/FICHES.md`).
- **Un détecteur qui suit la traînée, pas l'arme.** Le premier portage donnait
  à l’Hoplite une rotation d'arme de 327 °/s « mesurée » : le relevé prenait le
  barycentre des pixels lointains, et pendant une charge ce sont les **images
  fantômes**. Mesurer une orientation demande une **ACP, jamais un barycentre**
  — un barycentre bascule d'un bout à l'autre d'un objet symétrique, et se
  laisse tirer par tout ce qui traîne.
- **Un mécanisme juste rend des chiffres qu'on n'a pas calés.** C'est le
  meilleur test disponible. `weaponAngle = heading` produit tout seul l'angle
  figé une demi-seconde en ligne droite, le saut de 85° au rebond mural, et les
  33 °/s médians de rotation — aucun de ces trois nombres n'est écrit nulle
  part. Quand une hypothèse demande un paramètre par comportement observé,
  c'est qu'elle est fausse.
- **La cadence d'un combattant n'a de sens qu'en nommant l'adversaire.** L’Hoplite rend 0,506 coup/s contre le panel de `probe.mjs` (qui pilote vers lui)
  et 0,202 dans son miroir. Facteur 2,5, même personnage.
- **Une maquette ne contient pas toujours ce qu'on vient y chercher.** Celle de
  Celle du Pistolero montre ses munitions en **paquet** : aucun recadrage n'en isole
  une, une composante connexe en attrape deux. Transcrire quand c'est possible,
  **composer** quand la source ne s'y prête pas, et le dire dans le commentaire.

### Équilibrer

- **Une arme braquée touche en permanence.** Le piège du Pistolero, repayé à
  l'identique sur l’Hoplite. Dès qu'une arme cesse de tourner pour **viser**,
  elle pointe sur la cible à chaque image, donc elle la touche à chaque fenêtre
  de recharge : Hoplite est monté à **0,42 coup/s** contre 0,181 relevé, et
  gagnait ses 30 duels en 19 s. Chaque arme braquée doit porter **son propre
  garde-fou** — une dispersion pour le canon, « la lance ne blesse qu'en
  charge » pour la lance. Le garde-fou n'est pas un ornement : c'est ce qui rend
  la précision relevée.
- **Une visée réécrite à chaque image touche toujours.** Sans dispersion le Pistolero gagnait 27 duels sur 27. `ability.spread` est **raide** : 0,72 →
  10 victoires, 0,75 → 15, 0,80 → 9. Elle se règle au banc, jamais à l'estime.
- **Caler une cadence par le temps mort donne un personnage planté.** Ramener
  la cadence de l’Hoplite en allongeant la pause entre charges marchait — à 2,5 s
  de temps mort, quand la vidéo montre *beaucoup* de charges dont *peu*
  portent. Quand une cadence est trop haute, se demander d'abord si c'est la
  **fréquence** de l'action ou son **taux de réussite** qui est faux.
  Corollaire, à contre-intuition : **serrer** `lunge.cone` améliore la cadence
  (0,15 → 0,157 coup/s ; 0,60 → 0,120), parce qu'un cône large laisse partir
  des charges mal alignées qui manquent.
- **Un banc qui plafonne dit que le levier n'est pas le bon.** Pousser la
  dispersion du Pistolero de 0,75 à 1,35 rad ne faisait tomber le banc que de
  1,11 à 0,86 coup/s : une part croissante de ses touches venait des **éclats de
  givre**, que la dispersion n'affecte pas. Quand un levier connu cesse de
  répondre, chercher ce qui a changé de *source*.
  **Deuxième instance, sur le Druide, et l'ablation a tranché en une minute.**
  Son guidage semblait être son levier évident : balayé de 3,4 à 0,4 rad/s, il
  ne l'a fait passer que de 22 à 16 victoires sur 24 — plat. Compter les dégâts
  **par source** (`opts.kind` dans `game.damage`) a montré que 73 % venaient
  des projectiles ; `orb.damage` s'est révélé raide au point de rupture (3 →
  20 victoires, 2 → 15, 1 → 0). Avant de balayer un paramètre, **mesurer d'où
  vient réellement le dégât** — c'est plus rapide qu'un balayage à l'aveugle,
  et ça dit *lequel* balayer.

- **Deux leviers qui marchent chacun ne s'additionnent pas.** Orbe à 2 **et**
  mêlée à 1 faisaient tomber le Druide de 20 à 8 victoires sur 24, alors que
  chacun seul le posait autour de 15. Près du seuil, un point de dégât bascule
  des courses déjà serrées. Régler **un** levier, remesurer, et seulement
  ensuite en toucher un autre.

  **L'inverse existe aussi : un levier plat seul peut en débloquer un autre.**
  Rééquilibrage du Golem (voir `docs/FICHES.md`) : `movement.speed` balayé
  seul (370 → 420 → 500) restait plat, 12 → 13 → 14 victoires sur 50, coincé à
  0/10 contre les deux tireurs rapides du roster à chaque palier — la vitesse
  le fait rattraper sa cible, mais sans plus de dégât au contact elle ne le
  fait pas gagner une fois arrivé. `weapon.melee.damage` seul, en revanche,
  suit une pente connue (4 → 20/50 à 6, cf. le banc de damage plus bas dans
  cette section) : 12 → 20/50. Les deux **combinés** (420 + 6) donnent
  24/50 — plus que la somme de leurs gains isolés (respectivement +1 et +8
  sur la base de 12, soit +9 attendu, contre +12 mesuré). Un levier qui ne
  bouge rien seul n'est pas forcément à écarter : il peut être la condition
  qui manque à un autre pour agir.

- **La matrice ne joue chaque paire qu'une fois, donc elle exagère les écarts.**
  Chacun y est toujours du même côté, et le camp A pèse lourd (invariant 3).
  Avant de remonter un « dernier », le remesurer sur **les deux camps** : Pistolero et le Ronin étaient à 3/12 et 3/12 à la matrice, mais à 10/24
  et 9/24 sur les deux camps — presque la moyenne. L'outillage doit servir la
  question posée : la matrice est un garde-fou de **non-régression** (elle doit
  rester identique), pas une mesure de force.

- **Chercher le levier là où l'ablation trouve la source ne suffit pas.** Le Pistolero tire 62 % de ses dégâts de ses balles, et pourtant grossir la
  balle (`radius` 8 → 14) ne bouge rien : 10 / 9 / 10 / 9 victoires. La source
  dit *quoi* regarder, pas *quelle poignée tourner* — ici c'est la dispersion
  qui décide si la balle part sur la ligne, pas sa taille une fois partie.

- **Le levier d'un combattant faible est parfois chez un autre.** Les leviers
  propres du Pistolero et du Ronin étaient morts ou coûtaient une mesure ;
  c'est **baisser les dégâts du Shinobi** qui les a remontés tous les deux,
  sans toucher à leur fiche, et qui a le plus resserré le roster. Quand un
  combattant plafonne, regarder aussi ce qui le bat.

- **Le pouvoir d'un combattant peut peser sur un troisième, et le total ne le
  dit pas.** Suite du précédent, dans l'autre sens. En faisant hériter les
  clones du Shinobi des PV restants de leur invocateur, son **total est resté
  le même** (22/48 → 23/48 sur les deux camps, réglage de recharge compris) —
  de quoi croire l'affaire neutre. Elle ne l'était pas : le total masquait une
  **redistribution**, il gagne contre le Pistolero (5/12 → 10/12) et perd contre
  le Druide (12/12 → 8/12). Et le perdant net est le Pistolero, qui n'a rien
  demandé : **15/48 → 10/48**, dernier et décroché. Le mécanisme est connu et
  documenté à l'envers dans `docs/FICHES.md` — un clone fragile meurt vite et
  gêne peu le canon asservi ; un clone à 100 PV absorbe le barillet entier.
  **Lire le banc ligne par ligne, pas seulement en total** : un total stable
  peut cacher un roster qui s'est creusé.

  **Suite, et confirmation par l'autre bout.** L'héritage des PV a été retiré
  (le clone naît à 25) en même temps que le clone devenait un combattant
  complet : le Pistolero remonte **2 → 5** à la matrice sans qu'on ait touché à
  sa fiche, et l'écart du roster se referme de **2–11 à 4–9**. Le levier du
  dernier était bien chez un autre — et il l'était dans les deux sens.

- **Un paramètre qui ne fait rien doit être documenté comme tel.** Le verrou de
  mêlée du Druide, balayé à 1,4 / 1,7 / 2,2 s, rend 15 / 12 / 14 victoires :
  **non monotone, donc du bruit**. Il est resté à 1,7 s — c'est la
  configuration sur laquelle la matrice a été relevée — mais son commentaire
  dit qu'il n'équilibre pas. Un commentaire qui attribue un résultat au mauvais
  paramètre coûte plus cher que pas de commentaire du tout : le suivant le
  tournera dans le vide.

  **Repayé sur le Soleil, et cette fois pour refuser un correctif.** Raccourcir
  la couronne à la mesure du dessin lui coûte sa première défaite : `lancer vs
  sun` passe à 2/3, la matrice à 20/21. Le banc dit pourtant que ce n'est pas un
  affaiblissement — **139/140** contre 140/140, 10 seeds × les deux camps — et
  les balayages disent pourquoi : `hitbox.radius` rend 39 · 36 · **40** · 36 sur
  40 duels (15 · 20 · 25 · 29), `melee.cooldown` rend 39 · 35 · **40** · 40
  (0,8 · 0,7 · 0,6 · 0,5). Deux valeurs sortent 40/40 — et leur **voisine
  immédiate** fait pire que le point de départ. Les retenir aurait été caler sur
  les graines du banc, avec un chiffre qui aurait ensuite été lu comme un
  réglage d'équilibrage. **Rien n'a été touché**, et c'est écrit dans la fiche :
  ce duel-là a une queue fragile vers 80 s que la couronne ne pilote pas. Le
  levier qui la piloterait est l'horloge de l'ultime — 79 % de ses dégâts, effet
  monotone et déjà documenté —, et ce serait un rééquilibrage à part entière.
- **Seuil d'arrondi.** `Math.round(stat/18)` → `stat/15` a doublé des dégâts
  (round(1,33)=1 vs round(1,6)=2) et fait passer le Vent de 5 à 19 victoires.
  Toujours repasser la matrice après un changement de formule.
- **Regrouper autrement les mêmes produits change le résultat.** En réécrivant
  `bladeSegment()`, `c * reach * hitbox.from` est devenu `c * (reach *
  hitbox.from)`. La multiplication flottante **n'est pas associative** : un bit
  d'écart a fait basculer deux affrontements où le combattant modifié n'était
  même pas. Le garde-fou n'est pas la relecture mais la **matrice**.
- **Rééquilibrer un combattant affaibli** : ne toucher que ses paramètres `calé`
  ou `déduit`, jamais les `mesuré`.
- **Une grosse barre de vie décide de la *forme* des affrontements, et aucun
  levier de la fiche ne la rattrape.** Le Golem naît avec 200 PV au lieu de 100
  (demandé) et gagne d'abord 89 duels sur 100. Le total se règle sans peine —
  8 dégâts de mêlée au lieu de 14 le ramènent à 54/100 — mais **la forme, non** :
  il reste à 18/20 contre le Ronin et 5/20 contre le Druide. La raison est
  arithmétique : contre un adversaire qui place 2 ou 3 dégâts par seconde,
  doubler la barre de vie double le temps qu'il faut pour tuer le Golem, et ce
  temps-là, le Golem le passe à frapper ; contre un gros DPS, les 200 PV ne
  changent presque rien. Chaque levier essayé remonte un camp *et* descend
  l'autre : baisser sa mêlée pénalise le Ronin (trop fort) comme le Shinobi
  (déjà trop faible), baisser son recul de 500 à 300 rend le Ronin jouable
  (18 → 14) et effondre le Shinobi (7 → 2). **Le levier d'un écart de forme est
  chez les autres fiches, pas dans celle qu'on tient** — c'est le rééquilibrage
  complet, pas un réglage de plus.
- **L'ablation par source dit quel levier existe, l'intuition dit le contraire.**
  Toujours sur le Golem : son Onde sismique *paraît* être son levier n° 1 (elle
  ne rate jamais, elle ralentit, elle repousse), et elle a été descendue de 6 à 3
  sur cette conviction. L'ablation (`opts.kind` dans `game.damage`, 100 duels)
  lui donne **9,7 %** des dégâts — contre 44 % au poing, 28 % aux éclats et 18 %
  au Séisme, dont personne ne se méfiait. Elle est remontée à 6. Mesurer d'où
  vient le dégât **avant** de balayer, pas après trois balayages plats.

- **Un combattant blanc sur une arène blanche demande trois compensations, pas
  une.** Le Mannequin est blanc pur (demandé) sur un fond blanc : le contour
  passe de 5 à 6 px, le chiffre de PV du crème au noir, et l'aura devient
  **permanente** pour poser un cerne gris autour du disque. La quatrième est la
  moins évidente : partout ailleurs le corps touché **blanchit** (`#e4e4e6`), ce
  qui sur un corps déjà blanc rendrait chaque coup invisible — le sien
  **rougit**. C'est la leçon des jaunes pâles du Lancier, prise à l'extrême.
- **Un combattant sans arme, et un combattant sans dégâts, sont deux cas limites
  du moteur.** Le Mannequin les a ouverts tous les deux. Sans `head.sprite`,
  `Fighter.drawWeapon` lisait `PIXEL_MAPS[undefined].h` et plantait au premier
  rendu (`ui/select.js`, lui, prévoyait déjà le repli d'icône : il n'avait
  jamais servi) — un garde d'une ligne suffit, et il doit rester **générique**,
  sans nom de combattant. Sans dégâts, le duel **ne se termine jamais** : le
  moteur n'a aucune limite de temps, une partie ne s'arrête que par un mort. La
  ligne `dummy vs dummy` de la matrice finit donc en `timeout` à 200 s. Ce n'est
  pas à corriger chez lui : ajouter une limite de temps changerait le déroulé de
  **tous** les duels.
- **Une cible qui ne riposte pas est un banc de DPS gratuit.** Les lignes
  `… vs dummy` de la matrice ne relèvent aucun équilibrage (le résultat est
  connu d'avance), mais 200 PV divisés par la durée donnent la production réelle
  de chacun : Shinobi 6,09, Ronin 5,79, Hoplite 5,48, Druide 5,23, Pistolero
  4,22, Golem 2,76 PV/s. C'est la mesure que `tools/probe.mjs` approchait par
  les touches, obtenue ici directement — et elle confirme le compromis du
  Golem, qui produit 2,2 fois moins que le Shinobi pour 2 fois plus de PV.

- **Un recul se règle en direction, pas en force — et sa force est un levier
  plat.** Le Pistolero « avait l'air de se propulser vers l'adversaire ». Trois
  mesures ont été nécessaires, dont deux lectures fausses de ma part, avant
  d'arriver au fond :
  1. mesurer la vitesse **à l'image du tir** ne dit rien : `Match` appelle
     `Fighter.step()` **avant** `mod.update()`, donc le déplacement de cette
     image-là est déjà intégré et le recul n'agit qu'à la suivante. Mesuré au
     mauvais endroit, le recul semblait pousser **vers** la cible ;
  2. mesuré à la bonne image, il pousse bien vers l'arrière, et fort :
     **+415 px/s**, et il recule effectivement après 70 % de ses tirs ;
  3. mais sur un **cycle de tir complet** il ne rapporte que **+2 px** de
     distance — et toujours +2 à ±8 px qu'on le règle à 200, 300 ou 420, ou
     qu'on ajoute un arrêt franc de 0,18 s après le tir. C'est le mur déjà
     rencontré sur le Tir enraciné du Druide : `v = cap × vitesse + impulsion`,
     donc l'impulsion se retranche d'un pilotage qui ne s'arrête jamais.

  Ce qui se réglait, c'était la **direction** : le recul suivait la balle
  *dispersée* (`spread` vaut 0,75 rad, soit **±43°**), donc il le poussait de
  côté aussi souvent que vers l'arrière. Aligné sur la **visée**, chaque coup
  le repousse franchement dans le dos de sa cible, et la balle garde toute sa
  dispersion — c'est elle qui porte la précision relevée.

- **Deux boss ne se tuent pas en temps normal : leur duel se joue dans la rampe
  de mort subite.** `MATCH.suddenDeath` vaut `{ after: 55, ramp: 18, max: 4 }` —
  passé 55 s, `damageScale()` multiplie **tous** les dégâts, jusqu'à ×4. Le duel
  Soleil / LUNE a duré 92 à 104 s (il y passait alors **la moitié de son temps**),
  puis 55 à 71 s, et **33 à 54 s** depuis que LUNE tire tout son dégât du ciel :
  il ne touche plus la rampe du tout. La leçon reste vraie de tout duel long ;
  elle ne décrit simplement plus celui-là.

  Ce que ça change, et ce n'était pas prévisible depuis la fiche :
  - **l'esquive cesse de défendre.** Une géométrie qui rend petit et rapide vaut
    beaucoup à ×1 et ne vaut presque rien à ×4, où la moindre touche emporte un
    dixième de barre. LUNE avait 360 PV *parce que* sa défense était
    géométrique ; le banc l'a démentie à 3/24 ;
  - **le levier d'un duel de boss est la barre de vie, pas les dégâts.** Balayage
    de `maxHp` sur 24 duels, version d'alors : 360 → 3, 420 → 3, **480 → 12**,
    540 → 13, 600 → 16. **Monotone**, donc un vrai levier — à comparer aux trois
    balayages non monotones de la couronne du Soleil, où aucun paramètre
    n'équilibrait rien. Rebalayé après le redessin, sur 25 graines × les deux
    camps : 380 → 9, 420 → 17, 440 → 21, **460 → 26**, 480 → 29, 500 → 35,
    540 → 43, 600 → 50. Toujours monotone, et **c'est le seul paramètre du dépôt
    dont ce soit vrai deux personnages de suite** ;
  - **et ça ne déplace qu'une ligne.** LUNE reste à 20/20 contre les sept autres
    à chaque palier : la valeur ne touche que l'affrontement qu'on cherchait à
    régler.

  Avant de conclure qu'un combattant très résistant « manque de dégâts »,
  regarder **combien de temps son duel passe après 55 s**.

- **Un combattant peut satisfaire sa spécification au chiffre près et être
  injouable à regarder — et rien dans le dépôt ne le mesure.** La première LUNE
  était à 22/24, à égalité exacte avec le Soleil, matrice verte, tous les
  garde-fous au vert. Elle a été refaite **en entier** sur un seul grief :
  *« j'aime pas trop moon »*. Ce qui n'allait pas était entièrement du côté de
  l'écran — arme invisible (`head.sprite: null`, le cas du **Mannequin**, qui est
  une cible d'entraînement), pouvoirs qui ne dessinaient qu'un `fx.ring`, corps
  dont la moitié claire recouvrait la couronne d'éclipse de la maquette, dégâts
  qui variaient de 1 à 7 sans que rien ne le dise.

  `matrix` mesure le comportement, `fiche-snapshot` les valeurs,
  `sound-check` les recettes, `lang-check` les libellés. **Aucun ne regarde.**
  Pour un personnage neuf, la question « qu'est-ce qu'on voit de lui, et à quoi
  ça sert » est à poser avant le premier balayage, pas après.

  Preuve par le résultat : le redessin complet (corps, arme, deux pouvoirs,
  palette, icône) a déplacé **neuf lignes de matrice et pas un vainqueur**, en
  divisant ses durées par deux. Ce qui avait changé n'était pas sa force, c'était
  sa lisibilité.

- **Une orbite doit rester hors du corps quand le corps enfle — sinon l'arme se
  tait au pire moment.** L'anneau de LUNE porte à 154 px du centre ; son Éclipse
  porte le corps de 88 à **116**. Or deux corps ne se chevauchent jamais
  (`resolveBodies`), donc un adversaire de rayon 41 est alors à **157 px au
  minimum** : une orbite plus courte enfermerait les trois satellites *dans* le
  corps pendant la totalité, et l'arme deviendrait muette exactement quand elle
  double ses dégâts. Rien ne crierait — c'est la même famille que la Marée
  ci-dessous, vue venir cette fois.

  La vérification tient en une ligne : **la capsule porte de
  `orbite − r_capsule − r_ennemi` à `orbite + r_capsule + r_ennemi`, et la
  séparation minimale doit tomber dedans**, à la taille *enflée*.

  (LUNE n'a plus ni orbite ni arme depuis ; la règle reste, elle vaut pour toute
  arme portée par un corps qui change de taille.)

- **Un pouvoir de zone annoncée a un taux de touche gouverné par la *cible*, pas
  par ses propres chiffres** — et c'est ce qui rend son équilibrage
  contre-intuitif.

  LUNE ne produit que par des pierres qui tombent sur un cercle annoncé. Relevé
  par adversaire : **2,1 à 4,3 PV/s** contre les six (8 à 18 touches par duel) et
  **13,0 PV/s contre le Soleil** (44 touches). Il est le plus **lent** du roster
  (230 px/s, il ne sort pas du cercle) *et* le plus **gros** après elle (rayon 82,
  il en déborde). Elle écrasait donc le seul adversaire qu'elle devait partager,
  et se faisait battre par le plus rapide des six.

  **Aucun levier global ne corrige ça**, et les trois balayages le disent : les
  dégâts par pierre (6/7 → 28 victoires sur 30, 11/12 → 30) et le rayon
  d'explosion (40/46 → 29, 70/76 → 30) **plafonnent**, la vitesse est **plate**
  (260 → 30, 430 → 30). Il faut deux corrections **asymétriques** :

  - mesurer la zone **de centre à centre** (voir « Interface et rendu »), ce qui
    retire au gros corps la surface de capture qu'il gagnait gratuitement :
    13,0 → 7,4 PV/s ;
  - **raccourcir le temps de chute** (0,75 → 0,45 s), ce qui retire au rapide sa
    fenêtre : 1,3–3,0 → 3,0–5,6 PV/s contre les six, et presque rien contre le
    lent, qui ne l'esquivait déjà pas.

  Seulement *ensuite* la barre de vie redevient le levier monotone habituel
  (250 → 13, 285 → 16, 320 → 21, 380 → 26 sur 30). Avant de balayer un pouvoir de
  zone, **relever les touches par duel adversaire par adversaire** : le problème
  s'y lit, le total le cache.

- **Supprimer une arme peut rendre un combattant *plus* fort.** Retirer l'anneau
  de LUNE lui a ôté **60,5 %** de sa production et l'a fait passer de 26/50 à
  **50/50** contre le Soleil : elle n'avait plus aucune raison d'approcher, donc
  plus aucun risque à prendre. Corollaire de « retirer la source principale
  retourne le personnage » — et raison pour laquelle sa barre de vie est passée
  de 460 à **280** : *on ne porte pas la barre d'une forteresse quand on ne
  s'expose jamais.*

- **Un verrou de touche calé en secondes fait de la *cadence*, pas de
  l'anti-double-compte — et il avale des coups sans rien dire.** Le choc
  cinétique de la Comète portait un `kinetic.cooldown` de 1,15 s, écrit comme le
  `meleeCd` que le moteur pose pour les autres, avec cette justification dans la
  fiche : *« sans ce compteur, un contact qui dure trois images ferait trois
  coups »*. Le joueur, lui, voyait la Comète percuter son adversaire et **rien ne
  se passer**.

  Le compte a tranché, et il dit deux choses que la lecture ne pouvait pas
  donner. D'abord **un contact dure 2 à 3 images** (0,017 s en moyenne sur
  24 duels) : un plancher de 0,05 s aurait suffi au travail annoncé, 1,15 s est
  vingt fois trop. Ensuite, en découpant les contacts en **épisodes distincts**
  — une suite de pas consécutifs où un ennemi est dans la fenêtre —, **27 à 44 %
  des épisodes ne produisaient aucun choc** parce que le verrou d'un épisode
  *précédent* tournait encore. Les épisodes perdus arrivaient de 0,03 s à 1,15 s
  après le coup précédent : c'étaient de vrais contacts neufs, pas des rebonds
  du même.

  **La bonne forme n'est pas une horloge, c'est un réarmement** : un drapeau qui
  retombe au coup et ne se relève **qu'à la séparation**. Il interdit le double
  compte exactement, sans supposer une durée ; l'horloge ne reste que comme
  **plancher** contre un contact qui grésille (la mesure a vu des épisodes se
  rouvrir 0,03 s après le précédent, ce qui est la même collision vue deux fois).
  Après correction : **93 à 98 %** des épisodes produisent un choc.

  Deux corollaires qui coûtent cher à retrouver :
  - **la valeur du verrou avait été « calée au banc » trois fois** (0,9 → 1,15 →
    1,9 → 1,15) sans que personne ne remarque qu'elle réglait la mauvaise
    chose. Un balayage qui donne une courbe propre ne prouve pas que le
    paramètre fait ce que son commentaire annonce ;
  - **la correction a rendu 22 points de victoires** (57 → 79 % contre les six),
    qu'il a fallu reprendre sur le dégât (2,5 → 1,6). Corriger un garde-fou trop
    large *est* un rééquilibrage, et il se mesure comme tel.

### Déterminisme et ordre d'exécution

- **Une décoration qui tire dans `game.rng` transforme un levier en bruit.** Un
  balayage de recharge rendait des chiffres impossibles (un Champ de givre *plus rare*
  rendait le Pistolero *plus fort*) : la neige et la poussière du dôme
  tiraient dans le flux de **simulation**, donc chaque valeur rebattait le
  tirage de tous les duels. Passées à `viewRng`, la recharge redevient monotone.
  Ça ne se manifeste pas par un plantage mais par **un balayage qui ment**.
- **Une décoration se corrige jusqu'au bout, sinon elle n'est pas corrigée.**
  Suite directe : seules les **positions** passées en argument avaient été
  déplacées vers `viewRng` ; `Effects.snow` continuait de tirer quatre fois par
  flocon dans le flux de simulation. La monotonie observée après coup avait fait
  croire l'affaire réglée — elle ne prouvait rien. **Vérifier la correction à la
  source, pas au symptôme.** Note pour la suite : `fx.burst` tire encore 4 fois
  par particule dans le flux de simulation, pour tout le roster. Le corriger
  déplacerait toute la matrice d'un coup — chantier à part.
- **Un garde-fou du moteur réutilisé depuis un module hérite de l'ordre d'appel
  du moteur, pas seulement de sa géométrie.** `weaponHit()` refuse la touche
  quand `attacker.meleeCd > 0`, et `Match.resolveMelee` tourne **avant** les
  modules : le verrou était déjà posé quand le module du Shinobi testait ses
  clones, qui n'ont donc **jamais** encaissé un seul coup de mêlée — 100 % des
  occasions bloquées, sur les trois adversaires. Ce que j'avais documenté comme
  une « mutuelle exclusion » était une famine. `Match.update()` fixe l'ordre
  (corps → mêlée → pouvoirs → projectiles) ; tout ce qu'un module teste après
  coup arrive **derrière** les deux vrais combattants. Ça ne se lit pas dans le
  code : **ça se compte.**
- **Les minuteurs sont *figés* pendant `offstage`, pas seulement suspendus.**
  `Fighter.step` sort avant de décompter `meleeCd`, qui garde donc pour toute la
  durée de la Foudre tombante la valeur qu'il avait au décollage. Quand la Foudre tombante partait en
  pleine charge, cette valeur était zéro, et l’Hoplite touchait **gratuitement**
  à l'atterrissage : une touche garantie tous les ~8 s, invisible au relevé, qui
  portait à elle seule **dix victoires sur trente**. Toute chute de la Foudre tombante doit
  poser le verrou comme le ferait `resolveMelee`.
- **`offstage` ne doit pas expirer avant le module.** À l'égalité stricte l’Hoplite réapparaît une image **à son ancienne position** avant que `land()` ne
  le téléporte. D'où la marge de 0,1 s posée au décollage.
- **`Match` appelle `Fighter.step()` avant `mod.update()`.** Le module lit donc
  un cap déjà intégré et déjà réfléchi par les rebonds du pas courant : l'arme
  ne traîne jamais d'une image derrière le corps.

### Éditer les données

- **Un `re.sub` de calage qui déborde sur une autre fiche. Deux fois.** Une
  expression ancrée sur `hitbox: { from: …` a réécrit celle du Pistolero au
  lieu de l’Hoplite ; un `s.index('damage: (f) => Math.max(')` a pris la première
  fiche du fichier au lieu de la bonne — **tout un balayage de mesures était
  faux sans que rien ne plante**. Règle : un setter de balayage doit `assert`
  que son ancre est **unique**, et il faut relire le `git diff` avant de croire
  un chiffre. *La découpe en un fichier par combattant retire l'essentiel de ce
  risque : l'ancre ne peut plus déborder sur un voisin.*
- **La hauteur d'une carte d'arme ne coûte rien.** `fighter.js` pose `headH =
  map.h × scale` et `drawSpriteLeft` en tire `w = headH × map.w/map.h` — la
  hauteur **s'annule**, la largeur dessinée vaut toujours `map.w × scale`.
  Grandir une carte en hauteur ne change ni la portée, ni la hitbox, ni la
  taille du pixel : seulement la place disponible. Grandir en **largeur**, en
  revanche, déplacerait la pointe.
- **`handle.length` + largeur dessinée doit toujours valoir la portée.**
  `drawSpriteLeft` blitte à partir de `handle.length` : une valeur **négative**
  démarre en arrière de la bille (talon de l’Hoplite à −44 ; sprite centré du
  Shinobi à −75). Si la somme ne retombe pas sur `reach`, la pointe ment sur la
  hitbox.
- **Générer un sprite par une formule au lieu de transcrire la maquette.** La
  première lance livrée était une **feuille arrondie** là où la maquette montre
  une **pointe de flèche à bords droits** : le profil était tracé en `(1-u)**1.3`
  (exposant convexe ; des bords droits demandent 1), et le contour tombait hors
  carte. Une formule interpole ce qu'on ne lui a pas demandé ; quand un dessin
  est fourni, les arêtes qui font la silhouette se posent **explicitement**.
- **Une icône redessinée à la main diverge de son arme.** `ICON_LANCE` avait
  lâché deux fois (restée indigo quand l'arme est passée au cuivre, restée une
  lame fine quand la tête est devenue une pointe de flèche). Elle
  **échantillonne maintenant le profil de `LANCER_SPEAR`**, donc elle ne peut
  plus mentir sur l'arme qu'elle annonce.

- **Un détourage ne se fait pas toujours à la couleur — et un masque faux ne
  rend pas une mesure fausse, il rend une mesure *juste sur la mauvaise
  forme*.** Le halo pêche de la maquette du Soleil a survécu à **deux**
  détourages successifs. Le premier seuil (`saturation > 45 | luminance < 200`)
  le gardait ; le resserrer ne pouvait pas marcher, et c'est le point : la pêche
  qui touche l'astre (`#f9bf75`, saturation **132**) est *aussi saturée* que la
  flamme pâle qu'il fallait garder — **aucun seuil de couleur ne les sépare**.
  Pire, `binary_fill_holes` remplissait ensuite les baies entre les langues avec
  du halo, recollant les deux formes.

  Ce qui les sépare est **topologique** : la flamme est exactement ce que son
  propre contour brûlé enferme, le halo n'est enfermé par rien. Le masque se
  prend donc par **remplissage depuis le bord de l'image**, les pixels sombres
  (luminance < 100) faisant mur.

  Le prix de l'erreur ne s'est pas vu comme une erreur, et c'est là qu'est la
  leçon. Le relevé de contour sur le masque pollué donnait des **creux à 245 px
  et des pics à 278** : une pointe de 33 px, **14 %** du rayon. Sur le masque
  propre, les mêmes 720 directions donnent **sphère 172, pics 262** : une langue
  de 90 px, **52 %**. Le premier relevé était rigoureux, reproductible, et
  entièrement faux — il décrivait fidèlement « la flamme *plus* son halo ». Il a
  produit une découpe de balle trop généreuse, une portée à 104 px au lieu de
  145, et un commentaire de fiche expliquant très bien pourquoi la couronne
  devait être courte. **Vérifier le masque avant de croire ce qu'on mesure
  dessus** : un chiffre propre ne dit rien de la forme qu'on a mesurée.

- **Réduire mécaniquement une maquette marche ou ne marche pas selon ce qu'elle
  dessine — donc ça s'essaie, ça ne se suppose pas.** Les deux cartes texte du
  Soleil sont des replis du même dessin, réduits par le même code (Lanczos vers
  la taille de la carte, puis plus proche voisin dans les cinq teintes) :
  - la **langue** (15 × 13) survit très bien — la silhouette réelle passe, y
    compris son irrégularité, et c'est mieux qu'un dessin à la main ;
  - la **sphère** (16 × 16) rend du **bruit rouge** : la maquette y dessine un
    *tourbillon* de feu, pas un dégradé radial, et à 16 px il ne reste du
    tourbillon que du grain. Le repli a donc été **composé** en dégradé radial
    franc, ce qu'un repli doit faire : dire la bonne chose.

  La règle du dépôt (« transcrire quand c'est possible, composer sinon ») ne se
  tranche pas par principe mais **en regardant les deux sorties**. Corollaire
  gratuit : c'est aussi la taille de carte qui s'est décidée là — 15 × 13 tombe
  à **0,05 %** du rapport d'aspect du PNG, là où l'ancienne 4 × 9 laissait 2,5 %
  de dérive sur l'envergure du repli.

- **Une arme répétée *N* fois ne doit pas être le motif visé, mais un *N*-ième de
  la forme visée.** La couronne du Soleil a été faite deux fois. La première :
  découper *une* langue de la maquette et laisser `spokes: 8` la répéter — huit
  flammes détachées, séparées par huit fentes d'arène blanche, là où le dessin
  montre une couronne continue. La seconde : découper le **secteur de 45°** de la
  couronne, parce que 8 × 45° = 360° — les huit copies **pavent l'anneau**, et le
  jeu n'imite plus le dessin, il le remonte.

  Deux corollaires qui ne se devinent pas :
  - **la densité vient avec.** Le secteur contient deux langues, donc la couronne
    en porte seize ; la maquette en compte treize. En répétant un motif, on
    n'avait que huit et aucun réglage ne pouvait corriger ça ;
  - **la coupe se balaie, elle ne se choisit pas.** Une frontière de secteur au
    milieu d'une langue la coupe en deux et la couture se voit tourner. On balaie
    l'angle de départ au demi-degré en minimisant la matière traversant les deux
    rayons frontières ; plusieurs coupes sortent à zéro (les deux bords dans des
    creux). Ensuite seulement on choisit, sur le contenu.

  Et une conséquence sur la lecture de `reach` : pour un **éventail**, il n'est
  plus le rayon de la silhouette mais l'extension **le long de l'axe**, les
  langues en biais allant plus loin. La discipline « `handle.length` + largeur
  dessinée = `reach` » tient toujours ; ce qu'elle garantit, non.

- **Prendre le plus bel exemplaire d'un motif et le répéter fabrique une forme
  que le dessin ne contient pas.** La couronne d'avant plantait la **plus longue**
  langue de la maquette sur les huit axes : elle sortait à **1,773 × le rayon de
  la sphère** quand la plus longue langue du dessin est à 1,629 et la médiane à
  1,292. Personne ne l'a vu, parce que chaque langue *était* fidèle — c'est leur
  assemblée qui ne l'était pas. Un secteur, lui, porte ce qu'il porte.

- **Un test de chevauchement de deux corps est *toujours faux*, et il ne crie
  pas.** La Marée de LUNE écrasait « ceux que l'onde trouve **dans** le corps »,
  écrit `d <= f.radius + g.radius`. Relevé : la condition n'a été vraie **aucune
  fois sur 45 pulsations**, et le pouvoir a infligé **0 PV sur 24 duels** sans
  qu'un garde-fou bronche — `sound-check` ne voit que les recettes, `fiche-check`
  que le câblage, et la matrice ne sait pas qu'un pouvoir devait faire quelque
  chose.

  La raison est structurelle : **deux corps ne se chevauchent jamais ici.**
  `resolveBodies` les sépare à chaque pas, et `resolveMelee` les décolle *en
  plus* à la touche (c'est même écrit dans son commentaire). Au mieux la
  distance vaut exactement la somme des rayons, et le flottant la met
  généralement juste au-dessus. Toute zone d'effet « au contact » doit donc
  porter une **marge explicite** — chez LUNE, c'était `ability.crushMargin`,
  40 px. La Marée a disparu avec le redessin du personnage, donc la clé aussi ;
  la règle, elle, vaut pour toute zone neuve, et elle a resservi immédiatement
  (voir « une orbite doit rester hors du corps quand le corps enfle »).

  Corollaire de méthode : un pouvoir neuf se vérifie par **ablation**
  (`opts.kind` dans `game.damage`), pas à l'œil. Trois lignes de banc ont
  montré `tide 0,0 %` là où la capture d'écran montrait une belle onde violette
  qui partait à chaque cycle.

### Interface et rendu

- **Une moitié d'écran dans chaque langue.** `?lang=fr` ne pilotait que le HUD
  et le titre d'arène ; les écrans DOM étaient français en dur. On lisait
  « CHOISIS TES COMBATTANTS » au-dessus d'un duel « DARK vs ICE ». Tout
  l'affichage passe désormais par `src/ui/lang.js`, un seul interrupteur.
  **Il en restait une ligne, trouvée trois mois plus tard en ajoutant Druide** : la ligne « Projectile » de la fiche de sélection lisait `labelRef`
  sans regarder la langue, donc restait **en anglais pour tout le roster**. Elle a échappé à l'aide `label()` parce que c'est le seul
  endroit du dépôt où le couple des deux langues s'appelle `label`/`labelRef`
  et non `name`/`nameRef` — et à `lang-check`, qui vérifie que les champs
  *existent*, pas qu'ils sont *lus*. Un garde-fou sur l'existence ne dit rien
  sur l'usage.
- **La fiche de sélection lit des valeurs qui peuvent être des fonctions.**
  `melee.damage`, `melee.cooldown` et `projectile.damage` peuvent dépendre de la
  pile courante : affichées telles quelles, elles imprimaient le **code source
  de la fonction**. Même piège pour `weapon.spin = 0` (« rotation 0 °/s » se lit
  comme un bug alors que c'est une arme braquée) et `ability.cooldown: Infinity`
  (« recharge Infinitys » ; `select.js` teste `Number.isFinite` et écrit
  « passif »). Les replis sont dans `ui/select.js`.
- **Le chiffre de PV n'a pas de contour dans ce moteur.** La vidéo d'origine
  écrit les PV en crème avec un contour sombre ; ici `fighter.js` ne fait qu'un
  `fillText`. D'où les `hpColor` sur mesure. Corollaire pour les nombres de
  dégâts, qui eux **ont** un contour `#0a0a0a` posé par le moteur : un
  remplissage noir s'y noie et le chiffre devient une masse sans relief — c'est
  pourquoi l'accent du Shinobi est un gris, pas un noir.
- **Assombrir un corps rend illisible tout ce qui était déjà sombre.** Le
  Shinobi passé au noir aurait gardé un contour `#0a0a0a` et un chiffre de PV
  `#0a0a0a` : noir sur noir. Piège payé une fois sur le Ronin, évité d'entrée
  ici. Vérifier à l'écran (`tools/shot.mjs`) après tout changement de `look.body`.
- **Une passe de couleur incomplète n'est pas une passe de couleur.** « Aura et
  traînée en noir » n'avait touché que `look.aura` et `look.trail`, en laissant
  le bloc `flair` — or c'est lui qui porte ce qu'on voit vraiment traîner
  (ruban, motes, gerbe d'impact, éclair d'incantation). Faire le tour du bloc
  `look` en entier.
- **La ruée du Ronin a un seul point de sortie**, `endRush()`. Vitesse,
  pilotage et ouverture de l'éventail y sont remis **ensemble** : dispersés, une
  fin de duel en pleine ruée laissait l'éventail large accroché derrière la
  lame. Même patron pour `endDash()` de l’Hoplite.
- **L'éventail vert est borné en angle, jamais en nombre d'images.** À 3 tours/s
  un compteur d'images donne trois tours complets de vert. Déjà fait, déjà
  corrigé — dans les deux moteurs.
- **Un pouvoir s'ajoute sur un troisième créneau, il ne remplace pas l'ultime.**
  Champ de givre, Aura de braise, Dôme de drain et Clone d'ombre passent par un bloc
  `special` et un compteur `f.state.spec` de la forme des compteurs génériques —
  rien ne passe par `f.ult`. Le HUD porte **deux rangées** par le **même tracé**
  (`drawGauge` dans `render/hud.js`) : la première version en avait deux copies,
  dont l'une avait déjà dérivé. Un module alimente la seconde par `specialBar(f)`,
  méthode **optionnelle** — les combattants sans troisième créneau n'affichent
  pas un cadre vide.
- Écran de sélection : un élément sans `head.sprite` (la Plante) doit avoir une
  chaîne de repli sprite → projectile → icône.
- **`imageSmoothingQuality = 'high'`** sur le rééchantillonnage de l'export
  coûtait 72 % du fil principal. Rester en `'low'` (`render/recorder.js`).
- **`captureStream()`** ne doit être appelé qu'une fois par session : un appel
  par duel laissait des pistes de capture vivantes.
- Le filigrane TikTok dérive sur les vidéos : binariser la zone de texte avant
  de hacher une bande de stats.
- **Un pouvoir dessiné dans `drawOver` peut recouvrir le chiffre de PV de sa
  cible**, et rien dans le pipeline ne le rattrapait : `f.draw()` (qui trace ce
  chiffre) tourne avant la boucle `drawOver` de `Match.draw()`, donc une nuée
  opaque — l’Orage de ronces du Druide — passait dessus sans recours, comme
  `weaponLateral` couvrait déjà le manche avant `look.hpOverWeapon`. Le chiffre
  est maintenant **repassé** après `drawOver`, pour tout le monde plutôt que
  pour la seule cible touchée (`Fighter.drawHpNumber()`, appelée deux fois :
  dans `draw()`, puis à nouveau à la fin de `Match.draw()`). Un second
  `fillText` opaque au même endroit est invisible à l'écran, donc les neuf
  combattants qu'aucun effet ne recouvre ne changent pas d'un pixel —
  `globalAlpha` est remis à 1 avant ce second passage, sinon un `drawOver` mal
  restauré aurait délavé le chiffre au lieu de le rendre net.

- **Un combattant à plusieurs corps ne se nomme qu'une fois.** Le Shinobi qui
  gagnait avec un clone debout affichait **« SHINOBI + SHINOBI WIN »** sur le
  bandeau de parade, et se retrouvait deux fois dans le classement de fin. Le
  HUD, lui, avait raison depuis toujours : il groupe les plaques de PV par
  `${f.team}\u0000${f.el.id}`. C'est la même clé qu'il fallait au bandeau
  (`match.js`, `drawWinnerBanner`) et au classement (`result()`).
  **Ce sont les *noms* qu'on dédoublonne, pas les vainqueurs** : `this.winners`
  reste complet, donc les deux billes paradent toujours au centre — il y a deux
  corps à l'écran, il n'y a qu'un personnage à nommer. Le pluriel légitime doit
  survivre, et c'est le cas à vérifier : un 2 contre 2 Shinobi + Golem avec un
  clone debout fait bien parader **trois** corps et écrit « SHINOBI + GOLEM ».
  Piège dans le piège : le test `this.fighters.length === 2` qui décide si le
  classement a un sens est lu **à la fin du duel**, clones compris — un duel à
  deux qui a vu naître un clone n'est donc plus « à deux » pour ce test, et
  c'est ce qui rendait le doublon visible jusqu'en 1 contre 1.

- **Un format dont un seul camp est nombreux casse une mise en page qui tenait
  pour tous les autres.** Le 1 contre X est le premier où un camp porte quatre
  emplacements : `.slot-team` était une rangée sans retour, et à cinq elle
  sortait de la page (440 px de large pour 405) — sans que rien ne le signale,
  parce que les emplacements ne débordaient pas *leur conteneur*, c'est le
  conteneur qui débordait *la page*. Mesurer le débordement contre la **fenêtre**,
  pas contre le parent. Correction : le bloc de camp passe à la ligne comme la
  rangée de camps le faisait déjà, et les emplacements se resserrent à cinq. La
  bataille royale à cinq y gagne au passage — elle débordait aussi.

- **Une ambiance d'arène se règle sur les *bords*, pas sur le centre.** Demandé
  que le décor chauffe à mesure que le Réchauffement du Soleil approche de zéro.
  Deux couches, et leurs opacités ne se règlent pas ensemble : le **lavis au
  sol** traverse toute l'aire de jeu, donc chaque dixième coûte de la lisibilité
  sur les combattants ; la **braise des quatre bords** ne coûte rien, parce que
  c'est précisément là que rien ne se passe. Poussées ensemble à 0,45, l'arène
  lisait « tiède » ; poussée la vignette seule à **0,64** contre 0,38 au lavis,
  elle lit « brûlant » — et les deux billes et leurs deux chiffres de PV restent
  aussi lisibles qu'à froid.

  Deux contraintes qui ont décidé de la forme :
  - **`flair.js` interdit la nuée flottante** (« rien entre le spectateur et les
    combattants — remplir par le fond, les bords ou l'arrière »). D'où deux
    remplissages dans `drawUnder`, sous les billes, et rien par-dessus ;
  - **le décor ne bouge pas** (invariant 4) : il reste rasterisé une fois et
    blitté en un `drawImage`. On peint **par-dessus**, ce qui se retire en
    changeant deux nombres de la fiche.

  Et la montée est en **carré**, pas linéaire : une rampe droite se lit comme un
  fondu d'écran, `t²` reste froid longtemps puis bascule sur la dernière seconde
  — ce qui est l'information utile.

- **Mesurer une couleur sur une capture, c'est mesurer un instant qu'on n'a pas
  choisi.** Après avoir relevé le nouveau faisceau du Soleil, son profil rendu
  ne ressemblait pas du tout aux bandes de la fiche : centre `#edba60` au lieu de
  `#fdf17f`, encre brûlée rendue en mauve. Deux heures de suspects — palette,
  ordre des bandes, compositing, l'ambiance elle-même — avant de comprendre que
  **la capture était tombée dans les 0,25 s de fondu du faisceau**, où il est
  translucide et laisse voir le sol au travers. Les bandes étaient justes depuis
  le début : recomposées hors jeu sur un canvas isolé, elles rendent exactement
  les valeurs prévues (`edge` → `#650e09`).

  La règle qui en sort : **lire l'état au moment de la capture**, pas seulement
  l'image. `shot.mjs` attend en temps de montre et le jeu tourne sur `rAF` : deux
  exécutions ne tombent pas sur le même pas de simulation, et un effet qui varie
  dans le temps (fondu, phase, charge) sera échantillonné au hasard. Le banc de
  capture de ce chantier interroge donc `__match` — `ult.active`, `firing`,
  `ability.timer` — et **attend la fenêtre voulue** avant de déclencher.

- **Un sprite fourni sur un damier de transparence a sa trame *cuite* dans les
  pixels, et elle ne s'enlève pas.** La maquette du Rayon solaire porte une lueur
  extérieure **semi-transparente** ; le JPEG l'a aplatie sur le damier avant
  d'arriver. Résultat : dans la zone de lueur, les pixels sont **opaques** au
  sens du fichier mais leur couleur alterne au rythme des carreaux.

  Ce qui a été essayé, et pourquoi ça échoue :
  - *seuil sur la saturation* — le damier passe : il est gris, mais la lueur
    aplatie l'est presque autant ;
  - *seuil sur la luminance* — impossible, les carreaux clairs sont à 208 et les
    sombres à 98, donc le damier occupe toute la plage ;
  - *« démélanger »* (`art = (obs − (1−α)·gris) / α`) — exact sur le papier, mais
    à α faible on divise par 0,02 et la trame est **amplifiée ×50** dans les
    canaux ; c'est ce qui l'a imprimée en jeu la première fois ;
  - *retrouver la phase du damier* — période annoncée 76 px par autocorrélation,
    mais la meilleure séparation obtenue entre cellules claires et sombres est de
    **1 sur 97** : le motif n'est pas régulier au pixel après redimensionnement,
    donc ni un masque calculé ni une extraction de Fourier ne le retrouvent.

  **Ce qui marche : couper.** On garde la partie **franchement opaque** du
  dessin — ici jusqu'à 1,31 fois la demi-largeur de l'encre brûlée — et ce qui
  déborde se peint au moteur, ce qu'une lueur est de toute façon. Le PNG reste
  la source, comme pour la bille et la couronne ; seule la frange que le fichier
  ne peut pas livrer proprement est rendue.

  Corollaire de contrôle : **composer le sprite sur un fond uni clair *et* sur
  un fond uni sombre** avant de le déclarer propre. Sur le damier de
  l'éditeur d'images, une trame résiduelle est invisible — elle se confond avec
  celui de l'aperçu.
- **Un écran DOM sur une scène 9:16 n'a pas la hauteur de l'appareil, et son
  débordement ne dépend d'aucun appareil.** L'écran de sélection débordait sa
  boîte **partout**, depuis toujours, et personne ne l'avait vu parce que le
  débordement est *proportionnel* : `#app` garde le ratio 720/1280, donc sur un
  iPhone 16 Pro (402 × 874 px CSS) la largeur borne et la boîte fait **402 × 715**
  — les 159 px restants de l'écran sont hors scène —, et sur un 1280 × 800 elle
  fait 450 × 800. Toutes les tailles étant en `cqw`, **la même pile déborde de
  la même fraction sur les deux**. Mesuré : 764 px de pile pour 715 px de boîte
  en duel, 793 en bataille royale à cinq.

  Trois choses à en retenir, chacune payée une fois :
  - **`justify-content: center` déborde des deux côtés.** Le titre « CHOOSE YOUR
    FIGHTERS » passait **au-dessus** du bord haut : invisible *et* hors
    d'atteinte du défilement, puisqu'on ne défile pas vers un dépassement
    négatif. Le bouton de départ, lui, passait sous le bord bas. Un seul des
    deux se voyait sur une capture, et c'est le second — d'où un débordement
    lu comme « il manque le bouton » pendant que la moitié du problème était en
    haut.
  - **Un `gap` en pourcentage dans une colonne se résout sur la *hauteur*, pas
    sur la largeur comme les `padding`.** `gap: 2%` valait donc 14,3 px et non
    8 : à sept blocs, **100 px de la pile** n'étaient que de la respiration,
    soit plus que tout le débordement. C'est le premier levier, et le seul
    gratuit.
  - **Ce qui coûte, c'est ce qui se répète.** Le roster fait quatre rangées de
    cartes : chaque `cqw` retiré d'une marge de carte est payé quatre fois
    (10 px de carte = 40 px de pile). Idem pour les huit lignes de la fiche
    détaillée, où l'interligne 1,45 → 1,3 rend 20 px **sans toucher au corps du
    texte**, qui est ce qui se lit. Les tailles de police n'ont donc quasiment
    pas bougé : la compacité s'est prise dans les vides.

  Résultat : 793 → 692 px dans le pire format, 764 → 652 en duel, marge de
  23 px au plus serré. Le garde-fou est une mesure, pas un œil — hauteur réelle
  de la pile (haut du premier bloc → bas du dernier, `padding` compris)
  **balayée sur les quatre formats × trois tailles × les neuf fiches**, la
  largeur de la fiche affichée variant avec le combattant survolé. Et comme le
  débordement est proportionnel, **la corriger sur un écran la corrige sur
  tous** : aucune requête de média n'a été nécessaire, et en ajouter une aurait
  laissé le bug entier sur les appareils non couverts.

#### Un filigrane posé hors de l'aire de jeu ne protège rien

La signature `@LastOrbStandingTV` est là pour qu'une vidéo réuploadée reste
attribuable. Le réflexe est de la poser dans un coin de l'écran — la bande
sombre du haut est vide en duel, c'est la place qui « ne gêne pas ». **C'est
exactement la place qui ne sert à rien.**

La scène fait 720 × 1280, l'aire de jeu 628 × 628 entre 46 et 674 en x, 326 et
954 en y. Tout le reste — bandeau de titre, bande vide du haut, jauges et lignes
de stat du bas — représente **57 % de la hauteur et ne contient aucun duel**.
Quelqu'un qui recadre sur l'arène jette ces 57 % sans rien perdre de ce qu'il
vient voler. Une marque qui y vivait part avec.

D'où la règle : **une signature anti-copie se pose là où le contenu est**, et
nulle part ailleurs. Le seul rectangle irréductible d'une vidéo de duel est
l'aire de jeu.

Trois conséquences, toutes payées par ce raisonnement et pas par un essai :

- **Deux marques, parce qu'il y a deux métiers.** Le *filigrane* (`mark`) fait
  88 % de la largeur intérieure et 5,5 % d'encre : on ne le lit pas, on le
  retrouve. Il traverse un recadrage puisqu'il couvre la moitié de la surface
  utile, et il traverse un réencodage YouTube parce que 5,5 % de noir sur blanc
  — `rgb(241,241,241)` — reste au-dessus de ce qu'un codeur écrase. La *ligne
  lisible* (`tag`), 19 px au coin bas-droit, est celle qu'un spectateur lit pour
  retrouver la chaîne ; elle se recadre, et c'est assumé — le filigrane est ce
  qui reste dans ce cas. Une seule marque aurait dû être à la fois lisible et
  discrète, ce qui n'existe pas.
- **Elle se cuit dans le décor rasterisé** (`render/scene.js`, invariant 4),
  après `drawArena` qui repeint le carré en blanc. Coût nul par image, et
  surtout : le tremblement de caméra ne s'applique **qu'au contenu de l'arène**,
  donc la signature ne bouge pas avec l'image. Une marque qui tremble avec le
  reste se lit comme une incrustation ; celle-ci fait partie du terrain.
- **Tout passe par-dessus** — nappe de sol, zones de pouvoir, combattants. La
  règle de composition du dépôt (rien entre le spectateur et les combattants)
  est donc respectée par construction. En contrepartie, une ambiance d'arène
  opaque la teinterait : aucune ne l'est, elles sont toutes en alpha faible, et
  c'est ce qui rend la place tenable. Vérifié à l'écran sur l'ambiance bleue de
  LUNE en 2 contre 2 — le filigrane survit, légèrement teinté.

Le pseudo **ne passe pas par `ui/lang.js`** : c'est un nom propre, identique
dans les deux langues, comme LAST ORB STANDING. Deux entrées de table aux
valeurs égales n'auraient rien décrit de plus et auraient fait croire à une
traduction possible.

#### Une icône d'application se décide à 60 px, et sous le masque du système

Demande : une icône pour « Ajouter à l'écran d'accueil » sur iPhone. Quatre
compositions ont été rendues en 1024 puis **regardées à 60 px** — la taille
réelle sur la grille d'un iPhone —, parce que c'est la seule taille qui décide.
Le verdict est sans appel, et aucune des quatre ne se jugeait au grand format :

| Candidat | À 1024 | À 60 px |
| --- | --- | --- |
| L'orbe seul, plein cadre | superbe | **trop sombre** : fond d'encre + cœur noir, l'icône disparaît sur un fond d'écran sombre |
| Arène + orbe centré | propre | lisible, mais l'orbe est **noyé** dans le blanc |
| Arène + orbe en vol, traînée | dynamique | la traînée devient une **bavure grise**, on dirait un défaut de rendu |
| Arène + trois orbes, un seul vif | raconte le titre | les deux orbes pâles lisent comme **des yeux** — l'icône fait un visage |

Retenue : **l'arène en miniature**, fond d'encre, carré blanc, liseré noir, un
orbe qui la remplit presque. C'est la composition du jeu lui-même, et c'est ce
qui la rend reconnaissable plutôt que jolie.

Trois écarts à la scène, tous imposés par la taille ou par le masque :

- **Le liseré est à 2,9 % du côté, contre 0,94 % dans le jeu** (6 px sur 640).
  À l'échelle juste, il ferait 0,6 px sur la grille : une proportion fidèle
  donne ici un trait **absent**.
- **L'arène est rentrée de 10 %.** iOS n'affiche pas un carré, il masque par une
  superellipse qui mange les coins. Bord à bord, l'arène perdrait ses angles,
  donc sa forme.
- **L'orbe remplit presque l'arène.** Aux proportions du duel, il serait un
  point.

**`purpose: maskable` a été retiré du manifeste, et c'est le piège le plus
coûteux du lot** parce qu'il se déclare en un mot et se paie en silence. La zone
sûre d'un masque Android est un disque de 80 % du côté **en diamètre** ; les
coins du carré d'arène sont à 0,8 × √2 ≈ 113 % de ce diamètre. Déclarer l'icône
maskable, c'est autoriser Android à rogner exactement ce qu'on a soigné. Sans la
clé, il la pose telle quelle dans sa propre pastille. **Le masque d'iOS mange
bien moins que celui d'Android** : les 10 % d'inset sont calés pour le premier
et ne suffisent pas au second.

Deux choses qui **ne crient nulle part**, d'où `tools/icon-check.mjs` :

- **Un `apple-touch-icon` en 404 ne produit aucune erreur.** iOS pose une
  capture de la page à la place, et on ne l'apprend qu'en ajoutant le site à son
  écran d'accueil. L'outil récupère chaque URL déclarée et lit les dimensions
  dans l'**en-tête IHDR** du PNG, pas dans l'attribut `sizes` — qui n'est qu'une
  promesse.
- **Le libellé vient du `<title>` si on ne le dit pas**, et la grille n'affiche
  qu'une douzaine de caractères : « LAST ORB STANDING — ten fighters… » devenait
  « LAST ORB STANDING — te… ». D'où `apple-mobile-web-app-title` à `LAST ORB`,
  qui tient en entier.

Et deux détails de fabrication : la réduction se fait **par moitiés
successives** (un `drawImage` qui divise par 32 d'un coup n'échantillonne qu'une
poignée de texels et crénelle le liseré), et le fond opaque est peint **avant**
le dessin — iOS compose un `apple-touch-icon` transparent sur du noir, ce qui
poserait un halo noir autour des angles anticrénelés. Vérifié : alpha minimal
255 sur les quatre fichiers.

L'icône est **générée** (`tools/icone.mjs`) et non dessinée : c'est la règle du
dépôt sur les icônes — « une icône redessinée à la main diverge de son arme » —
appliquée un cran plus haut, en l'échantillonnant sur la **scène**. Repalettiser
la Comète ou changer `STAGE.paper`, relancer l'outil, et rien n'a dérivé.

#### Un corps uni se traite, il ne se remplace pas par un dessin

Question posée telle quelle : faut-il donner un dessin aux six billes qui n'en
ont pas (Pistolero, Ronin, Hoplite, Shinobi, Druide, Golem) — ou est-ce que ça
ferait *trop*, avec les armes ?

Le risque n'était pas celui-là. Trois corps du roster sont déjà des sprites — le
Soleil, la Lune, la Comète — et **c'est ce contraste qui les fait lire comme des
objets à part** : habiller les six autres l'aurait effacé bien plus sûrement
qu'il n'aurait encombré l'arme. S'y ajoutait le coût déjà connu d'un corps
dessiné, à payer **six fois** : `hpStroke` (aucun aplat ne tient sur un dessin),
un flash qui se pose au lieu de remplacer, et l'aura à revoir.

D'où la voie retenue : garder l'aplat et le **traiter**. `look.motif`
(`src/render/motifs.js`) pose un modelé et **une** marque, citée sur la fiche du
combattant — les six chambres du barillet, deux arcs pour `Damage = Spin`, des
chevrons braqués sur le cap comme la lance, quatre pointes pour la bille qui
*est* un shuriken, l'anneau d'invocation, trois brisures.

Quatre choses en sont ressorties :

- **Deux réglages de modelé, pas un.** Un corps noir (`#141414`, le Shinobi) ne
  se creuse pas : l'assombrir le rend illisible, piège déjà payé sur
  `look.body`. Il se **glace**. `gloss` et `shade` sont donc séparés, et le
  Shinobi porte `shade: 0`.
- **Le motif se saute pendant le flash et sous une teinte.** Ces deux états sont
  exactement ceux où le corps doit redevenir un aplat franc : c'est à ça qu'on
  lit la touche et le contrôle. Une décoration qui survit à un état de jeu le
  rend illisible.
- **Tout reste au-delà de 0,45 r**, en fractions du rayon jamais en pixels : le
  centre est pris par le chiffre de PV, et `sizeFactor` fait enfler le corps
  (invariant 7). Seule l'épaisseur de trait est en pixels d'écran, comme
  `outlineWidth` dont elle est la voisine.
- **`save()`/`restore()` ne sauvegarde pas le chemin courant.** Le corps était
  tracé, rempli, puis contourné avec le *même* chemin ; le motif intercalé
  ouvrait les siens, et le `stroke()` final contournait la dernière marque au
  lieu de la bille. Il faut retracer l'arc.

La marque du Shinobi est le cas limite assumé : sa bille montre un shuriken sous
un sprite d'arme qui en est un aussi. Ça se lit comme un noyau, et c'est ce qui
rend une bille noire lisible sur l'arène blanche — mais si ça fait trop, le
levier est `alpha`, ou retirer `mark` en gardant `gloss`.

Preuve : matrice **identique au fichier près** (c'est du rendu pur — aucun aléa,
aucune horloge, aucune écriture d'état), `fiche-check`, `lang-check` et
`sound-check` verts, captures de contrôle sur les six.

### Le son

Huit pièges, tous **muets** — c'est leur point commun et c'est ce qui les rend
coûteux : aucun ne plante, aucun ne se voit à l'écran, et une capture ne dit
rien. Les deux derniers sont pires encore, puisqu'ils ne se découvrent qu'après
publication. D'où deux bancs : `tools/sound-check.mjs`, qui joue des duels
entiers et compte les sons, et `tools/export-check.mjs`, qui filme un duel et
**redécode le fichier produit**.

- **Un son ne s'ouvre qu'à un geste.** Un `AudioContext` créé au chargement du
  module naît `suspended` et **le reste tout le duel** : pas d'erreur, pas de
  son, et rien dans la console. Il est donc créé au premier `pointerdown` ou
  `keydown` (`main.js`), et `unlock()` fait aussi le `resume()` — un contexte
  peut retomber en suspens quand l'onglet passe en arrière-plan. Conséquence
  heureuse : sans geste, `sfx.ctx` est `null` et **tous les appels sortent
  immédiatement**, donc `matrix.mjs` et `shot.mjs` ne paient rien.
- **Un plafond de voix qui se décrémente dans un rappel finit par ne plus
  redescendre.** La première version comptait les voix (`this.voices++` puis
  `src.onended = () => this.voices--`). Un seul `onended` manqué — un contexte
  fermé, un `stop()` avalé — et le compteur reste au plafond de `MIX.maxVoices` :
  **le jeu devient muet définitivement**, sans une erreur. Remplacé par une
  **liste d'échéances** (`busy`), purgée à chaque tir contre `ctx.currentTime` :
  l'horloge du contexte ne peut pas oublier de passer.
- **Le même bruitage joué deux fois en 50 ms ne s'entend pas deux fois**, il
  sature. La simulation tourne à 120 Hz : une balle qui touche pendant six pas
  déclenche six détonations en 50 ms, et l'oreille n'entend qu'un seul coup
  écrêté. `MIX.repeatGap` (45 ms, par recette) est à la sortie audio ce que
  `meleeCd` est au moteur. C'est aussi lui qui rend supportable un Shinobi à
  cinq clones : cinq corps qui frappent dans la même image font **un** son.
- **La synthèse vocale ne passe par aucun graphe audio.** `speechSynthesis`
  sort directement sur la carte son : elle ne peut ni se mixer, ni se couper
  autrement que par `cancel()`, ni **entrer dans la vidéo exportée**. Ce n'est
  pas un oubli de l'implémentation, c'est la spécification — il n'existe aucune
  API pour la router. La règle qui en sort : **ce que la voix dit, l'image doit
  le dire aussi**, et c'était déjà le cas (titre d'arène, bandeau de parade).
  Corollaire d'interface : `sfx.silence()` doit être appelé à chaque sortie
  d'écran et quand l'onglet se cache — c'est la seule chose du jeu qui survive à
  `loop.stop()`.
- **Une piste audio dans le flux ne fait pas un fichier sonore.** Trois
  conditions, et chacune manquante donne un fichier muet sans une erreur :
  1. le flux doit **porter** la piste (`stream.addTrack`), et l'ajouter après la
     création d'un `MediaRecorder` ne change rien pour celui-là — il en naît un
     neuf à chaque duel, c'est ce qui rattrape le cas ;
  2. le **MIME doit nommer le codec audio** : `video/webm;codecs=vp9` seul laisse
     le navigateur décider, quand il n'ignore pas la piste. D'où deux listes de
     candidats et un choix fait **à chaque `start()`** — le son peut n'être
     ouvert qu'au deuxième duel, puisqu'il faut un geste ;
  3. le contenu doit être **non silencieux** — et c'est le point que rien ne
     signale : un encodeur à débit constant produit à peu près autant d'octets
     pour du silence que pour un duel entier, donc `webkitAudioDecodedByteCount`
     ne distingue pas les deux. Seul un **redécodage en PCM** le fait, et c'est
     ce que mesure `tools/export-check.mjs` (relevé : 2 canaux, RMS 0,023,
     crête 0,34 sur un duel de 8,9 s).
  Mesure du navigateur du dépôt, à ne pas généraliser :
  `video/mp4;codecs=avc1.42E01E,mp4a.40.2` est **refusé** par le Chromium de
  Playwright (pas de H.264), et c'est `video/mp4` nu qui passe — et qui produit
  bien de l'AAC. Le repli de liste n'est donc pas théorique.
- **Le robinet de coupure se place après la dérivation d'enregistrement.** Le
  graphe est `master → compresseur ┬→ enceintes / └→ piste`. L'inverse — couper
  au master — livrerait une **vidéo muette** à qui a regardé son duel en
  silence, ce qui est exactement le geste de quelqu'un qui monte une vidéo. La
  coupure ne coupe donc que les enceintes (et la voix, qui n'est pas
  enregistrable de toute façon).

- **Une voix, c'est une couche — pas un bruitage.** `MIX.maxVoices` compte des
  couches, et `play()` refuse **le son entier** quand le plafond est atteint :
  enrichir une recette se paie donc sur **les autres sons**, jamais sur elle, et
  un son refusé ne plante pas — il manque. Donner son propre jeu au Pistolero
  (`gunshot` de 2 à 4 couches, `cylinder` et `knell` à 5) a fait passer les sons
  perdus de **0 % à 2,3 %** sur quinze duels : des rechargements et des impacts,
  exactement ce qu'on venait d'écrire. Le plafond est passé à 20, où il ne reste
  que 0,4 % — et ce qui saute encore n'est plus que `thud`, le rebond de mur, le
  son le plus fréquent et le moins porteur de sens.
  **Le banc se mesure sur l'horloge du duel, pas sur celle du contexte audio** :
  en simulation accélérée `ctx.currentTime` n'avance pas avec le duel, tous les
  sons se posent au même instant réel et le plafond crève artificiellement — la
  première mesure annonçait 90 % de pertes, ce qui n'aurait rien voulu dire. On
  enregistre l'instant *du duel* de chaque son, puis on rejoue l'algorithme de
  `play()` sur cette horloge-là. Le même relevé sert d'avant/après sans toucher
  au dépôt, puisque le son ne touche jamais la simulation : la chronologie des
  événements est identique des deux côtés, seules les recettes changent.
  **À remesurer à chaque combattant qu'on sonorise** — six jeux propres
  empileront six fois cette pression.
- **Un garde-fou de couverture ne voit que ce qu'il exerce.**
  `tools/sound-check.mjs` déclare morte toute recette qu'aucun duel ne joue.
  Le jour où le Pistolero a cessé d'emprunter `click` pour son rechargement, le
  banc a crié à la recette morte — alors que `click` est le son des écrans DOM,
  joué par `main.js`, hors de tout duel. Le réflexe (une liste d'exceptions dans
  l'outil) aurait survécu à la disparition de ce qu'elle excuse ; l'outil relit
  donc `src/` et considère vivante une recette **nommée en dur** quelque part.
  Un garde-fou qui crie à tort finit par ne plus être lu — c'est déjà la leçon
  de l'invariant 9, ici payée une seconde fois.

Deux points de conception qui ont bien tenu, notés pour ne pas les défaire :

- **Trois créneaux sur cinq n'ont demandé aucune ligne dans les sept modules**,
  parce que le moteur voyait déjà passer l'événement : le tir dans
  `Projectiles.spawn`, la touche dans `Match.damage`, l'ultime dans la bascule
  de `f.ult.active` que `flair.cast` détectait déjà. Le rebond de mur non plus :
  `f.wall` était posé pour les ondes de `flair.js`. **Chercher l'endroit où
  l'image lit déjà l'événement** avant d'ajouter un état.
- **Une arme qui n'existe pas pour le moteur doit le dire.** `Match.hitSound`
  ne reconnaît une touche d'arme qu'à `kind: 'melee'` ; une arme intégrée
  directement par son module (positions et dégâts gérés en dehors du bloc
  `weapon` de la fiche) sonnerait sinon comme un projectile perdu. Un mot dans
  les options de `damage` (`sound: 'hit'`) suffit — même forme que `opts.kind` :
  un module l'écrit, le moteur s'en sert, et il ne sait pas pourquoi.

**Le son d'un état, pas d'un instant** — la sonorisation des six combattants
restants, et la famille de recettes qu'elle a demandée (`LOOPS`) :

- **« Aucun instant à sonoriser » ne veut pas dire « rien à sonoriser ».** Le
  créneau `ability` du Ronin valait `null`, avec un commentaire qui le
  justifiait : la Danse d'acier est un passif, une rotation qui monte toute
  seule, et « un son sur une montée continue serait un son sans geste ». Le
  raisonnement est juste et la conclusion fausse. Le Ronin porte
  `Damage = Spin` : sa lame va de 0,80 à 3,00 tour/s, plafonne 1,8 s,
  s'effondre à −3,0/s et repart, et **ses dégâts suivent exactement cette
  courbe**. C'était la seule information vitale du roster qui ne s'entendait
  pas. Ce qui manquait n'était pas un événement, c'était une **continuité** —
  et un banc qui ne sait jouer que des événements ne peut pas en dire une. La
  bonne question n'est pas « quel instant sonoriser » mais « quel état le
  joueur doit-il entendre ».
- **Mesurer la grandeur, ne pas la lire dans la fiche.** `weapon.spin` ne porte
  que le **plancher** du Ronin (5,03 rad/s) ; tout ce qui fait l'intérêt du
  personnage — montée, palier, effondrement — est ajouté par son module. Une
  voix pilotée par la fiche aurait donc sonné **plat pendant tout le duel**,
  sans rien qui plante et sans rien qui se voie. Mesurer la variation réelle de
  `weaponAngle` donne en plus, sans une ligne : une lame ralentie par le givre
  qui siffle plus bas (`slowFactor` est déjà dans l'angle) et un ralenti de K.O.
  qui étire le sifflement avec l'image (le `dt` est celui de la simulation).
  Relevé par `sound-check`, passe 3 : régime **0,00 → 1,00** pour le Ronin,
  contre 0,35 constant pour le Shinobi et 0,60 pour le Golem, dont les armes
  tournent à vitesse fixe.
- **Une voix tenue n'a pas d'échéance : elle ne doit pas entrer dans le
  compteur de voix.** `busy` est une **liste d'échéances**, précisément pour ne
  pas dépendre d'un rappel `onended` (voir plus haut : un compteur qui ne
  redescend jamais rend le jeu muet sans une erreur). Y pousser une voix tenue
  serait pire encore — elle n'a aucune échéance, donc elle bloquerait une place
  du plafond **pour toujours**. Les voix tenues vivent dans leur propre `Map`,
  clé sur l'objet `Fighter` et non sur `el.id` : le Clone d'ombre met plusieurs
  corps du même identifiant sur le plateau, et une clé par identifiant les
  aurait fait se voler la voix l'un l'autre.
- **Une voix tenue démarre au silence, et s'arrête six constantes plus tard.**
  Au premier pas, la vitesse de référence est l'angle courant, donc le régime
  mesuré vaut 0 : partir de la vraie vitesse ouvrirait le gain en une image, ce
  qui s'entend comme un claquement. À l'autre bout, `setTargetAtTime`
  **n'atteint jamais sa cible** — c'est une exponentielle asymptotique — donc
  couper les sources à la constante de temps laisse un résidu audible ; six
  constantes plus tard il ne reste que −52 dB. Vérifié à l'analyseur : RMS
  0 → 0,0081 → 0,0170 aux régimes 0 / 0,5 / 1, et **exactement 0 après
  l'arrêt**.
- **Et tout paramètre tenu passe par `setTargetAtTime`**, jamais par une
  écriture directe : la consigne est renvoyée 120 fois par seconde, et l'écrire
  sec s'entend comme un escalier — d'autant plus fort que la valeur bouge vite,
  donc exactement pendant la montée en régime qu'on cherche à faire entendre.
  `MIX.swingGlide` vaut 0,05 s : en dessous l'escalier revient sur
  l'effondrement de surchauffe (−3,0 tour/s, la variation la plus raide du
  jeu) ; au-dessus la lame traîne derrière son ruban à l'image.

**Deux combattants qui partagent une recette se font taire l'un l'autre.** Le
garde-fou `MIX.repeatGap` est indexé **par recette**, pas par combattant : tant
que le Ronin, le Shinobi et le Druide frappaient tous les trois avec `blade`,
deux touches simultanées de deux personnages différents n'en produisaient
qu'une. Séparer leurs recettes (`blade` / `razor` / `bough`) a donc **augmenté**
le nombre de sons qui sortent, alors qu'on s'attendait à l'inverse : sur le banc
à quinze duels, 4393 → **4409** sons joués, à sons perdus constants (6, soit
0,1 % à `maxVoices: 20`). L'intuition disait « plus de matière = plus de
pression sur le plafond » ; la mesure dit que la pression n'a pas bougé, parce
que les couches ajoutées sont sur des **ultimes**, qui sont rares. Le plafond
n'a donc pas eu à changer — mais c'est la mesure qui le dit, pas le
raisonnement, et elle reste à refaire au prochain jeu de bruitages.

**Un ultime qui n'annonce que « quelque chose arrive » n'annonce rien.**
`riser`, un balayage large, a servi d'ultime à **quatre combattants sur sept** :
il disait qu'il se passait quelque chose, jamais *quoi*, et quatre ultimes qui
sonnent pareil ne s'annoncent pas, ils se confondent. Chacun a désormais le
sien (`whirl`, `vault`, `cyclone`, `thorns`), et `riser` a été **retiré du banc**
plutôt que laissé en repli — une recette que plus personne ne joue est du poids
mort, et `sound-check` la signale. Deux d'entre eux sont volontairement la
grande sœur d'un pouvoir du même combattant (`cyclone` de `gust`, `thorns` de
`bloom`) : un ultime se lit mieux quand il est la version large de ce que le
personnage fait déjà en petit.

**Un pouvoir qui emprunte le son d'un accident devient un accident.** L'onde
sismique du Golem jouait `thud` — c'est-à-dire le son de ses **propres rebonds
sur le mur**. Son pouvoir le plus régulier était donc indiscernable d'une
trajectoire ratée, et le commentaire de sa fiche assumait la confusion (« le
même tambour que ses rebonds, en plus gros »). Même erreur chez le Shinobi,
dont la Tornade jouait `whoosh`, le son de son propre lancer de shuriken. Avant
d'attribuer une recette à un créneau, **regarder ce que le combattant joue
déjà** : partager avec un autre personnage est un choix, partager avec son
propre bruit de fond en est rarement un.

**Ajouter un boss** — ce que l'arrivée du Soleil a appris, et qui ne valait pour
aucun des sept autres :

- **Un boss n'est pas un déséquilibre, c'est une spécification.** Les sept
  premiers combattants sont taillés pour s'affronter entre eux, et chaque
  rééquilibrage cherche à resserrer leur bande (4 à 13 victoires sur 21
  aujourd'hui). Le Soleil est demandé pour **gagner contre tous**, ce qui est
  l'intention inverse : sa ligne de matrice à 21/21 n'est pas à corriger. Le
  dépôt a maintenant **deux combattants hors barème, aux deux bouts** — le
  Mannequin ne peut pas gagner, le Soleil ne peut pas perdre — et il faut les
  écarter tous les deux avant de lire un écart entre les autres.
- **Généraliser une expression du moteur se prouve *avant* d'en avoir besoin.**
  Les huit rayons ont demandé une clé nouvelle (`weapon.spokes`) lue par
  `bladeSegment`, `weaponHit` et `drawWeapon` — donc une retouche au cœur du
  calcul de collision, celui-là même dont `bladeSegment` documente qu'un
  regroupement différent des mêmes produits a déjà déplacé deux affrontements.
  Le geste juste tient en deux temps : **poser la clé, la laisser absente de
  toutes les fiches, et exiger la matrice identique au caractère près** ; puis
  seulement ajouter le combattant qui s'en sert. En un seul temps, un vainqueur
  déplacé se serait imputé au nouveau venu et aurait été « corrigé » sur sa
  fiche, où le défaut n'était pas.
  Ce qui rend le chemin à une branche exactement l'ancien : `bladeSegment(0)`
  n'écrit **pas** `weaponAngle + 0` mais `weaponAngle` lui-même. Une addition
  flottante neutre en apparence suffit à changer un dernier bit.
- **Une arme à plusieurs branches touche dans toutes les directions**, et c'est
  l'« arme braquée qui touche en permanence » du dépôt, en pire : contourner un
  combattant est la parade normale contre une arme qui tourne, une couronne la
  supprime. Son garde-fou n'est pas la dispersion (elle ne vise pas) mais le
  **verrou de mêlée**, et il ne tient que parce que `weaponHit` le teste **une
  fois pour toutes, avant** d'essayer les branches. Le déplacer à l'intérieur de
  la boucle donnerait huit touches par pas sans qu'aucune valeur de fiche n'ait
  bougé.
- **`flair.js` ne sait suivre qu'une branche.** Le ruban de pointe d'arme et
  l'aura d'arme lisent `f.bladeSegment()` sans argument, donc la première. Sur
  une couronne, ils désigneraient un rayon au hasard et feraient croire que les
  sept autres ne comptent pas. Le Soleil n'en déclare donc aucun — ce n'est pas
  un manque, c'est le seul choix juste, et la couronne se lit très bien seule.
- **Un corps clair demande trois des quatre compensations du corps blanc.**
  L'arène est blanche ; le personnage *est* le soleil, donc le rendre sombre
  pour esquiver le problème l'aurait dénaturé. Contour à 6 px, chiffre de PV en
  encre brûlée, aura permanente — seule la quatrième (le `bodyHit` qui rougit au
  lieu de blanchir) est inutile ici. Il a été jaune vif (`#fbbf24`) jusqu'à ce
  qu'une maquette de flamme arrive ; l'orange qui l'a remplacé (`#de7f3a`)
  relâche le piège sans le supprimer, et les trois compensations restent.
- **Un trait clair seul n'existe pas sur fond blanc.** L'axe d'annonce du Rayon
  solaire est la seule information dont l'adversaire dispose pour esquiver : en
  crème simple, il était à peine visible sur la capture de contrôle. Il est
  doublé — un liseré orange large sous un cœur crème fin. C'est la leçon du
  corps clair, appliquée à une ligne.
- **Mesurer d'où vient le dégât, même quand on croit savoir.** Ablation par
  `opts.kind` sur 70 duels : couronne **67,3 %**, Rayon solaire 18,9 %,
  Réchauffement 13,7 % (dont 9,9 % de brûlure et 3,8 % de coup). La mécanique de
  base porte donc bien le personnage et les deux pouvoirs sont des appoints —
  ce qui est l'intention, mais qui ne se savait pas avant la mesure : le
  Séisme du Golem avait déjà démenti la même intuition en sens inverse.
- **Un pouvoir qui s'annonce doit s'annoncer *assez tôt et assez fort*.** Le
  Rayon solaire est le seul pouvoir du dépôt qui prévienne avant de frapper, et
  c'est ce qui autorise ses dégâts hors norme. La visée **suit** la cible
  pendant la charge puis **se fige au tir** : figer dès le déclenchement rendait
  l'esquive triviale, suivre jusqu'au bout la rendait impossible.

**Un corps servi par un sprite** — le Soleil est le premier du dépôt, et
`assets/sprites/README.md` §6 décrivait le mécanisme depuis toujours sans que
personne l'ait fait. Trois écarts au cercle vectoriel, chacun imposé par le fait
qu'un dessin n'est pas un aplat :

- **Il se dimensionne sur son disque plein, pas sur son cadre.** Le dessin
  déborde (les pointes de l'astre) : son disque plein s'arrête à **0,89** du
  demi-côté de l'image. Dessiné à la taille brute, il paraîtrait donc **plus
  petit que son rayon de collision** — il serait bousculé « dans le vide ».
  D'où `look.spriteScale` (1/0,89 = 1,1236), qui remettait le disque sur le
  rayon et laissait les pointes déborder. C'est la même discipline que
  `handle.length + largeur = reach` pour une arme : le dessin ne ment pas sur
  la géométrie. Elle se **remesure** à chaque changement de maquette —
  couverture par anneau, dernier rayon encore plein.

  *Depuis, la clé a disparu de la fiche, et c'est le même raisonnement qui l'a
  retirée* : le PNG a été recoupé à la sphère seule (les pointes sont devenues
  l'arme), il remplit donc exactement son cadre et la correction vaudrait 1.
  Une clé qui recopie son défaut est une occasion de divergence silencieuse,
  pas une intention — mais la mesure reste à refaire dans l'autre sens le jour
  où un sprite débordera de nouveau.
- **On ne le cerne pas.** Un cercle net autour d'un dessin découpé se lit comme
  un carcan, et le sprite porte déjà son bord. `look.outline` reste lu par la
  carte de sélection, ce n'est donc pas une clé morte.
- **Le flash et les teintes se posent par-dessus, jamais en remplacement.** Sur
  un aplat, le flash d'encaissement *remplace* la couleur ; sur un dessin, le
  remplacer l'effacerait — on ne verrait qu'une pastille unie à chaque coup.
  `look.spriteFlash` règle l'opacité du voile (0,6 : le coup se voit, l'astre
  reste lisible dessous).

**Et un chiffre de PV posé sur un dessin demande un contour.** Le dépôt notait
que « le chiffre de PV n'a pas de contour dans ce moteur, les nombres de dégâts
en ont un » — vrai tant qu'un corps est un aplat, faux dès qu'il ne l'est plus.
Mesuré sous l'empreinte exacte des digits du Soleil : **53 % de pixels clairs,
40 % de sombres**. Aucun aplat ne tient — la meilleure encre sombre tombe à
**2,28** de contraste dans son pire cas, la meilleure encre claire à **1,08**.
Il n'y a pas de bonne couleur à trouver, il y a un contour à ajouter :
`look.hpStroke`, opt-in, au même traitement que `Flair.drawPops` (deux
traitements différents pour deux nombres de même taille se verraient).

**La vignette de sélection lisait la carte texte, pas le sprite.** Elle
compilait `PIXEL_MAPS` directement au lieu de passer par `getSprite`, donc elle
ignorait `manifest.json` : quatre armes s'affichaient en repli sur l'écran de
sélection et en PNG dans le duel. La divergence était invisible tant que les
replis étaient de fidèles transcriptions ; elle est devenue criante avec le
corps du Soleil, dont le repli est volontairement grossier. Corrigée avec un
garde `hasSprite` — la vignette peut être tracée **avant** `loadSprites()`,
l'écran étant construit au chargement du module et la banque remplie au `boot()`.

**`melee.damage: 0` ne rend pas une arme inerte**, et la fiche du Soleil a
affirmé le contraire pendant deux commits. `Match.damage` sort bien avant tout
effet quand le montant vaut zéro — plus de son de touche, plus de gerbe, et
`melee.knockback` n'est effectivement plus lu. Mais `resolveMelee` fait trois
choses **autour** de cet appel, qui continuent de tourner :

1. il pose `meleeCd` ;
2. il applique le **recul propre** de l'attaquant (`selfRecoil`) ;
3. il **décolle les deux corps** dans l'image même de la touche.

Les deux dernières déplacent des combattants. **La géométrie d'une arme sans
dégâts reste donc du gameplay** : découper le rayon du Soleil dans la maquette a
fait tomber sa portée de 160 à 104, et ça a suffi à déplacer **toutes les durées
de ses affrontements**. Les vainqueurs n'ont pas bougé (21/21, et les six autres
à leur compte au chiffre près), seules ses lignes ont bougé — mais un changement
annoncé comme purement visuel a dû être régénéré et justifié.

La leçon générale : **ce qui sort tôt d'une fonction ne dit rien de ce que fait
son appelant**. Lire `damage` et conclure « rien ne se passe » était une lecture
d'un cran trop profonde ; c'est `resolveMelee` qu'il fallait lire.

**Un module qui code ses couleurs en dur les fait dériver.** Le dépôt documentait
déjà le cas d'une **clé de sprite** en dur (`plant.js` et ses corolles roses),
dont le prix est de se fermer à sa propre réutilisation. Pour des **couleurs**,
le prix est autre et plus insidieux : la **dérive**. Le module du Soleil portait
onze littéraux `rgba(...)`, écrits quand le personnage était jaune vif ; le
corps est passé à l'orange des rayons, puis à sa propre maquette, et le Rayon
solaire est resté sur ses vieux orange — il ne se lisait plus comme sortant de
l'astre qui le tire. Rien n'avait planté, rien n'avait crié.

La correction n'est pas de recolorier le module mais de **lui retirer le droit
de choisir** : `look.palette` porte les cinq teintes relevées sur la maquette,
`ultimate.beam.bands` décrit le faisceau en les nommant, et le module n'a plus
**aucun** littéral de couleur — pas même un blanc pur au cœur du foyer, qui
aurait été la seule couleur du personnage à ne pas venir du dessin, donc la
prochaine à diverger. Repalettiser le Soleil, c'est maintenant toucher cinq
lignes de sa fiche.

Ce que ça a fait apparaître au passage : le faisceau n'avait **pas de bord**. Il
allait d'orange à blanc, alors que tout le dessin de l'astre est signé par son
liseré d'encre brûlée — et un rayon sans bord se dissout en plus sur l'arène
blanche. Reprendre la structure du dessin (liseré, rouge profond, corps, clair,
cœur) l'a réglé sans qu'on ait eu à le chercher : c'est le bénéfice d'une source
unique, elle corrige des choses qu'on n'avait pas nommées.

**Habiller un combattant d'une maquette fournie** — ce qu'a appris le passage
des rayons du Soleil au PNG :

- **Un corps et son arme doivent être de la même matière pour se lire comme un
  objet.** La balle était jaune vif quand la couronne est passée à la flamme
  orange de la maquette : le résultat se lisait comme une bille **plus** huit
  décorations, pas comme un astre. La demande — « je veux que la balle utilise
  le même fond que les rayons » — est donc aussi la bonne réponse graphique, et
  elle ne s'obtient pas en choisissant un orange à côté : elle s'obtient en
  **échantillonnant le PNG**.
- **Une maquette fournie décide de la palette du personnage, pas l'inverse.**
  Cinq bandes de luminance sur les pixels opaques du PNG (3ᵉ, 20ᵉ, 50ᵉ, 80ᵉ et
  97ᵉ centile) donnent contour / ombre / corps / clair / cœur, et ces cinq
  teintes remplissent **tout** le bloc `look` — corps, contour, chiffre de PV,
  aura, motes, impacts, sillage, accent — plus le repli texte et l'icône. C'est
  ce qui empêche l'icône de diverger de son arme, piège déjà payé sur le
  Lancier, et ça évite d'avoir à trancher teinte par teinte.
- **Le contraste du chiffre de PV se calcule, il ne s'estime pas.** Sur
  `#de7f3a`, l'encre du sprite donne **4,15**, le crème du reste du roster
  **2,6**. La référence utile n'est pas une norme d'accessibilité mais le
  **Ronin**, dont le crème sur orange tient à 3,03 et se lit très bien en jeu :
  au-dessus de lui, c'est bon.
- **Détourer un JPEG demande de jeter le halo, pas seulement le blanc.** Le
  fond n'est pas pur (les coins relèvent `#fbfcf7`, `#f0e4e6`) et la compression
  laisse une frange pâle autour de la flamme. Le seuil de détourage est donc
  plus mordant que celui de l'échantillonnage — sans quoi la frange survit en
  alpha et dessine un liseré blanc autour de chaque rayon, sur une arène déjà
  blanche.
- **Recadrer sur la composante principale, pas sur tout ce qui est opaque.** La
  maquette porte des éclats détachés. Ceux qui tiennent dans le cadre de la
  flamme sont gardés (ils font partie du dessin) ; un éclat qui dépasserait la
  pointe la remplacerait comme bord droit du sprite, et **le sprite mentirait
  alors sur la portée de l'arme**.
- **Le repli texte doit garder le rapport du PNG.** `h` sert au calcul de la
  taille dessinée même sous override, donc il ne bouge pas (9) ; mais `w` a été
  porté de 13 à 22 pour retomber sur le rapport de l'image (2,444 contre
  2,4447). Sans ça, le jour où le PNG manque, la couronne se rétracte de moitié
  sans que rien ne le signale.

- **Un dessin trop pâle pour être un corps peut être un excellent petit objet :
  c'est la taille qui décide, pas l'image.** `lunar-lit.png`, la pleine lune
  fournie, tient **1,54** de contraste médian sur l'arène blanche quand elle
  sert de corps à 176 px de diamètre — 48 % de ses pixels sous le seuil de
  visibilité. La première LUNE la peignait donc par-dessus la face d'éclipse,
  découpée au terminateur, et perdait la moitié de son temps à être presque
  invisible. Le redessin n'a pas retouché l'image : il l'a **rétrécie à 44 px**
  pour en faire ses trois satellites, avec un lavis d'encre posé dessous par le
  module. Même fichier, parfaitement lisible.

  La règle est utile dans les deux sens : avant de rejeter une maquette sur un
  relevé de contraste, se demander **à quelle taille** le relevé a été fait, et
  quel autre emploi la même image pourrait avoir dans la même fiche.

- **L'icône de sélection doit remplir son cadre, ou elle paraît deux fois plus
  petite que sa voisine.** `drawElementBadge` dimensionne le sprite sur la
  **hauteur de sa carte** (16 px), pas sur sa matière : une composition qui
  n'occupe que dix pixels sur seize rend à **57 %** de la taille apparente du
  Soleil, dont les rayons touchent les quatre bords. Mesuré sur la première
  icône de LUNE (un disque centré et trois satellites minuscules) ; corrigé en
  poussant les satellites jusqu'au bord.

  Et pour la **carte** de sélection, ne pas confondre les deux dessins : la
  vignette montre `look.sprite` + `weapon.head.sprite`, **pas** `el.icon` —
  l'icône ne sert qu'au bandeau de titre. Changer l'une sans l'autre ne se voit
  qu'en regardant les deux écrans.

- **Une zone dessinée au sol se mesure de *centre à centre*, pas de bord à
  bord** — et c'est le seul écart du dépôt, assumé pour deux raisons qui se
  rejoignent.

  Toutes les autres zones se mesurent en `rayon + g.radius`, ce qui est juste
  pour une onde ou un faisceau : ils balaient un volume, et une bille posée juste
  au bord en fait partie. Un **cratère annoncé par un cercle**, non :

  - **le dessin mentirait.** En bord à bord, un combattant debout à 100 px d'un
    cercle de 78 prend quand même le coup — exactement ce que le dépôt s'interdit
    partout ailleurs (`handle.length + largeur = reach`) ;
  - **un gros corps est puni deux fois.** La surface de capture vaut
    `(blast + rayon)²` : 160² pour le Soleil (rayon 82) contre 119² pour la norme
    (41), soit **1,8 fois plus de surface**, sans qu'il ait rien fait. Relevé
    avant correction : **44 touches par duel** contre lui pour 9 contre tous les
    autres.

  Règle pratique : **si la zone est dessinée avec un bord net, elle se mesure au
  centre ; si elle est dessinée comme une onde, elle se mesure au bord.**

- **Une hauteur de chute simulée doit tenir dans le clip de l'arène.** Un objet
  « en l'air » se fabrique avec deux dessins au même `x` — l'ombre au sol et
  l'objet `height` pixels plus haut. Mais `drawOver` est **clippé au cadre de
  l'arène** : à `height: 400` sur une arène de 628 px, le météore passait les
  trois quarts de sa chute **hors du cadre**, donc invisible. On ne voyait qu'un
  cercle au sol et un caillou qui apparaît. À 210–250, toute la chute est dans
  l'image. Le chiffre est **purement visuel** — il ne touche aucune ligne de
  matrice, ce qui est justement pourquoi personne ne le vérifie.

- **La densité fait l'impression, pas la puissance.** L'averse de LUNE tombait
  d'abord par **treize pierres, une toutes les 0,26 s, à 15 de dégâts** : avec
  0,42 s de chute, **une seule pierre en l'air à la fois**, et ça se lisait comme
  un pouvoir un peu plus rapide. Doublées en nombre et divisées par deux en
  dégâts (**0,13 s / 8**), la production est **la même au banc** (27/50 contre le
  Soleil dans les deux cas) et l'image n'a rien à voir : trois ou quatre pierres
  en vol en permanence. Le nombre d'objets simultanés se calcule —
  `durée_utile / intervalle` et `intervalle / chute` — il ne s'estime pas.

- **Une ambiance de plein cadre découvre un liseré d'arène nue quand ça
  tremble.** Le décor ne bouge jamais (invariant 4, voulu) mais tout son contenu
  est dessiné sous un `translate` de secousse **et** sous un clip qui tremble
  avec lui : un lavis calé sur `ARENA.inner` se décale donc avec le reste, et
  laisse voir le fond blanc d'un côté. C'est vrai de l'ambiance du Soleil autant
  que de la nuit d'Éclipse ; ça ne se voyait pas parce qu'il secoue rarement.

  Les météores de LUNE tombent **par trois, décalés de 0,16 s**, donc la
  secousse devenait continue sur une demi-seconde, toutes les 3,2 s. Descendue
  à `ability.shake: 2,2`, elle reste sous le pixel. Un pouvoir qui se répète
  vite ne se secoue pas comme un ultime.

**Retirer la source principale d'un combattant** — ce qu'a appris la suppression
des dégâts de mêlée du Soleil, demandée après coup :

- **Ça retourne le personnage, ça ne le diminue pas.** La couronne portait
  **67,3 %** de sa production ; après suppression, le Rayon solaire en porte
  **78,7 %** et le Réchauffement 21,3 %. Il est passé de « colosse de contact
  dont l'ultime est le bouquet » à « personnage entièrement porté par son
  ultime » — deux personnages différents avec la même fiche à un chiffre près.
  Le renversement de jeu compte autant que celui des chiffres : **le coller ne
  coûte plus rien**, et c'est précisément de près que le faisceau est
  inesquivable. Le duel contre lui ne se joue plus sur la distance mais sur le
  moment.
- **Le levier qui rattrape n'est pas la taille de ce qui reste, c'est sa
  fréquence.** Élargir le faisceau (34 → 62 de demi-largeur) et le rallonger
  (1 s → 2,5 s de tir) ne suffisait pas : à une horloge de 13 s, le Soleil
  passait onze secondes sur treize sans **aucun** moyen de tuer, et perdait ses
  duels. C'est `chargeRate` (13 s → 7) qui l'a remis debout. Corollaire du
  piège déjà nommé — *un banc qui plafonne dit que le levier n'est pas le
  bon* — dans sa version « quelle poignée tourner » : la source du dégât disait
  bien de regarder l'ultime, elle ne disait pas qu'il fallait le rendre plus
  **fréquent** plutôt que plus **gros**.
- **Rallonger une annonce sans ralentir le suivi *supprime* l'esquive.**
  `trackRate` valait 0,8 rad/s pour une charge de 1,1 s, soit 0,9 rad de cap
  rattrapé — un compromis. Porté à 2 s de charge sans y toucher, il rattrapait
  **1,6 rad** et ne ratait plus personne : allonger l'annonce, censé donner plus
  de temps pour sortir de l'axe, l'aurait rendue *inesquivable*. Descendu à
  0,55, le cap rattrapé revient à 1,1 rad. Les deux valeurs se règlent
  ensemble, toujours.
- **Une recette meurt quand le créneau qui la nommait cesse d'être joué**, pas
  quand on l'efface. `scorch` était le son de touche d'arme du Soleil ; l'arme
  ne blessant plus, `Match.damage` sort avant `hitSound` et la recette n'est
  plus jamais jouée — sans qu'une ligne de `data/sound.js` ait bougé.
  `sound-check` l'a vue, et la correction n'était pas de la supprimer mais de
  la **rebrancher** : le faisceau passe `sound: 'hit'` dans `game.damage`, le
  mécanisme prévu pour une arme que le moteur ne reconnaît pas comme telle. Il
  sonnait jusque-là comme un projectile perdu, alors qu'il est devenu le geste
  principal du personnage. Une panne signalée a livré une amélioration.
  Prix mesuré : les sons perdus au plafond passent de 6 à 9 sur quinze duels
  (0,1 % → 0,2 % à `maxVoices: 20`) — le faisceau joue `scorch` dix-sept fois
  par tir. Sous le coude, plafond inchangé.
- **Le couplage son ↔ fiche s'est payé, et c'est la preuve qu'il était réel.**
  `ultimate.windup` est passé de 1,1 s à 2 s ; les durées de `flare` ont dû
  suivre, ainsi que le `delay` de sa dernière couche (1,05 → 1,95). Laissées en
  place, les trois premières couches se seraient éteintes presque une seconde
  avant le départ du rayon et le « départ » aurait sonné en pleine charge.
  **Rien n'aurait planté, rien ne se serait vu** — le son aurait simplement
  cessé de dire ce que fait l'image.

### Refactoriser

- **Une refactorisation livrée « prête à l'emploi » mais jamais appliquée coûte
  deux fois.** Le dépôt a porté pendant des semaines un `templates.js`, un
  `elements-compact-example.js`, un minificateur, un script de migration et
  1 433 lignes de markdown racine annonçant −60 % — sans qu'une seule fiche soit
  touchée. Résultat net : **plus** de lignes à lire, une doc qui contredisait
  `CLAUDE.md`, et un exemple de référence qui ne compilait pas. Le tout a été
  supprimé et remplacé par la découpe réelle. Une refactorisation se mesure à ce
  qu'elle **retire**, pas à ce qu'elle ajoute.
- **La duplication annoncée n'était pas là où on la cherchait.** Recompter avant
  de factoriser : sur les onze fiches d'alors, **six** clés seulement étaient
  identiques partout (rayon, contour, police et décalage du chiffre de PV,
  masse, `head.anchorY`), soit ~5 % des lignes. Le vrai coût n'était pas la
  répétition mais le **monolithe** : ouvrir 2 995 lignes pour en toucher 130.
- **Supprimer un combattant, ce n'est pas effacer ses fichiers.** Les sept
  éléments gelés partaient avec des morceaux d'eux-mêmes greffés ailleurs : le
  module du Druide **déléguait** sa tempête à `plant.js`, sa corolle *partageait*
  le tableau `rows` de celle de la Plante, et le Pistolero tirait l'éclat de
  givre dessiné dans `pixelart/ice.js`. La méthode qui a marché : **rapatrier
  d'abord, vérifier la matrice inchangée, supprimer ensuite** — deux étapes,
  deux preuves, au lieu d'un `rm` suivi d'une chasse aux imports cassés.

- **Le code mort d'un combattant supprimé ne se voit pas dans son dossier.**
  Retirer les sept fiches laissait derrière : le bouclier de l'Égide dans
  `fighter.js`, le crochet `onDamage` dans `match.js`, le rendu d'arme sur
  mesure (`customWeapon`), `fx.ghost` et trois `clear()` sans appelant. Rien de
  tout ça ne plante ni ne crie — il faut le **chercher**, un crochet à la fois,
  en se demandant qui le fournit encore.

- **Prouver une réorganisation demande son propre garde-fou.** La matrice ne
  couvre que ce qu'un duel exerce : elle serait restée verte avec des fiches
  corrompues sur des valeurs qu'aucun combat ne lit. `tools/fiche-snapshot.mjs`
  sérialise toutes les fiches et toutes les cartes, et c'est lui qui a validé
  chaque étape de la découpe — puis chaque étape de la suppression des sept
  éléments.

---



## Le détail des sections condensées de `CLAUDE.md`

### L'écart du roster, et ce que la matrice cache

Écart **3 à 11**, et il s'est **rouvert** au dernier relevé (il était de 4 à 9).
Toujours sans qu'aucune fiche d'adversaire ne bouge : le Clone d'ombre du
Shinobi peut maintenant s'invoquer lui-même, donc l'arène porte jusqu'à quatre
corps, et **c'est encore le Pistolero qui paie** — son barillet se vide sur des
leurres. Sur les **deux camps**, qui est la mesure moins caricaturale, l'écart
va de 14/48 (Pistolero) à 34/48 (Hoplite), contre 17–35 au relevé précédent.

**Le pouvoir d'un combattant décide du classement des autres**, et c'est la
troisième fois de suite que le Clone d'ombre le démontre — voir le piège du
même nom plus bas.

**D'où vient l'écart : du gel de l'attente d'avant-combat, pas d'un réglage.**
Les combattants se déplaçaient pendant la seconde d'ouverture — ce n'était donc
pas une attente mais un début de course, et aucun duel ne partait vraiment des
deux points de départ mesurés. Les figer était demandé, et c'est aussi plus
juste au regard du relevé ; mais partir des vrais points de départ **profite à
Hoplite** (9 → 11), dont la charge en ligne droite aime les longues lignes de
vue, et a coûté au Shinobi (6 → 4, remonté à 6 depuis).

C'est un déséquilibre connu et non corrigé : le corriger demanderait un
rééquilibrage complet, qui est un autre chantier que celui qui l'a produit.

**Attention à la convention de la matrice quand on juge un écart.** Elle ne
joue chaque paire qu'**une fois**, donc chacun est toujours du même côté, et le
camp A pèse lourd (invariant 3). Le banc des **deux camps** donne une image
sensiblement plus plate : avant ce réglage, Pistolero 10/24 et le Ronin 9/24
là où la matrice officielle disait 3/12 et 3/12. Un combattant « dernier » à la
matrice ne l'est pas forcément au jeu — vérifier sur les deux camps avant de
conclure qu'il faut le remonter.

**Et elle peut aussi *cacher* un écart, pas seulement l'exagérer.** Nouveau
cas, symétrique du précédent et plus dangereux : en passant les clones du
Shinobi au corps à corps, la matrice n'a bougé que d'**un duel** — le Shinobi
y était déjà du mauvais côté de presque toutes ses lignes, donc elle n'avait
plus grand-chose à perdre. Le banc des deux camps disait **23/48 → 4/48**, un
combattant rayé de la carte. Quand un changement touche un combattant que la
matrice montre déjà bas, elle ne peut plus le mesurer : ne pas conclure sans
repasser les deux camps.

---

### Formats — ce qui change à l'écran au-delà de deux

**Ce qui change à l'écran au-delà de deux :**

- **le HUD se sépare en deux bandeaux**. Les points de vie montent **en haut de
  l'écran** — une plaque par **groupe (camp, fiche)** dans la bande vide
  au-dessus du titre ; plusieurs corps d'un même combattant dans un même camp
  (les clones du Shinobi) tiennent **une seule plaque, points de vie cumulés** —
  et le bas garde ce que le duel y met : jauge d'ultime, jauge de pouvoir
  spécial et ligne de stat, pour **chaque** combattant. Les deux bandeaux
  partagent le même ordre de placement (`placer()` dans `render/hud.js`), donc
  un combattant est à la même colonne et à la même rangée dans les deux — sinon
  l'œil cherche deux fois. En duel, rien ne change : les deux grandes jauges
  mesurées restent, et les points de vie restent sur la bille ;
- **un mort quitte le terrain tout de suite**. En duel, la première mort finit
  le combat et le perdant reste en place pendant le K.O. au ralenti, qui est la
  belle image du duel. À plusieurs, le laisser gisant encombrerait l'arène pour
  tout le reste de la partie : il disparaît, et seul le dernier tombé reste le
  temps du K.O. final ;
- **le titre d'arène**. À deux, le bandeau relevé sur la vidéo. Au-delà, les
  noms se suivent, groupés par camp, et les icônes tombent : cinq icônes de
  28 px et quatre « VS » ne tiennent pas dans la largeur de l'arène ;
- **le placement**. Les deux points de départ sont mesurés et ne servent qu'au
  duel ; à trois et plus, un anneau centré, chacun tourné vers le centre — seule
  disposition qui ne donne à personne deux voisins immédiats quand les autres
  n'en ont qu'un ;
- **l'écran de fin** gagne un classement, du vainqueur au premier tombé ;
- **la parade se joue à plusieurs**. Un 2 contre 2 se gagne à deux : les deux
  survivants glissent au centre, écartés de `victory.pairGap`, et grandissent
  ensemble. Ne mettre en scène que `this.winner` laissait son coéquipier figé
  là où il se trouvait, ce qui se lisait comme un bug.

**Deux durées règlent la fin, à ne pas confondre.** `MATCH.victory.settle` est
le temps de **mise en place** — glissement, ressort d'échelle, nappe de
lumière ; `MATCH.victoryDuration` est le temps **total**. Allonger la seconde ne
fait que tenir l'image plus longtemps. Sans cette séparation, ajouter une
seconde d'affichage **ralentissait toute l'animation** au lieu de laisser le
temps de lire — l'inverse de ce qu'on voulait.

**Un bandeau nomme le ou les vainqueurs pendant la parade**, dans l'arène. Le
nom n'apparaissait qu'à l'écran de résultat, qui **n'est pas filmé** : la vidéo
exportée se terminait donc sans jamais dire qui avait gagné.

### Invariant 12 — corollaire pour les modules de pouvoirs

Le cas qui l'a éprouvé : la hitbox en disque du Shinobi. `hitbox.from` et `to`
à zéro **confondent les deux bouts du segment tranchant sur le pivot**, et
`segmentPointDistance` traite déjà ce cas dégénéré — la forme se dit donc
entièrement dans la fiche, sans une ligne de moteur. Second cas, le guidage des
orbes du Druide : `projectiles.orb.homing` décrit un virage borné que
`projectiles.js` applique en visant « le premier combattant en scène qui n'est
pas le tireur », exactement le test que fait déjà sa boucle de touche.


**Corollaire pour les modules de pouvoirs.** Un module qui code en dur une
clé de sprite se ferme à sa propre réutilisation : `plant.js` dessinait
`'flower'` en littéral, ce qui faisait voler des corolles **roses** dans la
tempête verte du Druide. Les deux littéraux concernés (la corolle, la gerbe
d'éclatement d'un bulbe) sont passés en clés de fiche **avec le littéral
d'origine en repli**, donc la Plante ne change pas d'un pixel — matrice
vérifiée identique.

### Invariant 13 — comment le moteur a cessé de compter jusqu'à deux

Cet invariant disait l'inverse (« deux combattants, et ce n'est pas près de
changer »). Il est tombé en ajoutant le 2 contre 2 et la bataille royale, et
la surprise est que ça a coûté peu : le couplage réputé « de bout en bout »
tenait en **vingt lignes de `match.js` et trois de `fighter.js`**.
`physics.js`, `projectiles.js`, `flair.js`, le HUD et le décor prenaient déjà
leurs arguments. **Recompter avant de croire un couplage sur parole** — le
dépôt a déjà payé la leçon inverse en cherchant une duplication qui n'était
pas là où on la disait.

**Et le duel garde ses expressions, littéralement.** Partout où la
généralisation aurait réécrit le chemin à deux — placement, collisions,
mêlée, index de stats, fin de partie — la branche `length === 2` reprend le
code d'origine mot pour mot. Ce n'est pas de la prudence de principe : la
multiplication flottante n'est pas associative, et regrouper autrement les
mêmes produits a déjà déplacé deux affrontements où le combattant modifié
n'était même pas. Preuve exigée à chaque étape : **matrice identique au
caractère près**.

C'est le Clone d'ombre du Shinobi qui s'en sert : ses doubles sont des
`Fighter` du tableau, dans son camp, avec leurs pouvoirs, leurs jauges et
leur place au classement. Le moteur ne sait toujours pas ce qu'est un
clone — il sait qu'un combattant est entré.

Tout le reste — collisions, mêlée, ciblage, HUD, condition de victoire,
classement — travaille déjà sur `this.fighters` et suit sans une ligne.

**L'entrée est différée d'un pas, et c'est le seul piège.** L'appelant est
un module, or `update()` itère `this.modules` quand il appelle `join()` :
une `Map` de JavaScript **visite les entrées ajoutées pendant l'itération**,
donc le nouveau venu verrait son `update()` tourner dans l'image de sa
naissance, avant son premier pas, et après les boucles de corps et de mêlée
du pas courant. D'où la file d'attente et `flushArrivals()` en fin de pas.

Trois versions du même pouvoir ont précédé celle-ci, et **chacune a rendu du
code au moteur** : un double confiné au module et coiffé du prototype
`Fighter` (`Object.setPrototypeOf`) pour hériter du rendu, puis le même
appelant `Fighter.step()`, `resolveBodies()` et `weaponHit()` telles
quelles, puis celui-ci qui n'a plus rien de propre du tout. À chaque étape
la question utile a été « qu'est-ce que le moteur sait déjà faire ? », et à
chaque fois la réponse était « plus que je ne croyais ».


### Invariant 3 — la preuve que l'arrivée d'un combattant n'a rien déplacé

`ROSTER` décide qui est le camp A : les paires sont formées en
`[liste[i], liste[j]]`, et le camp A pèse lourd. Un nouveau venu s'ajoute donc
**en queue**, et la preuve à exiger est mécanique : **le diff de la matrice ne
contient que des ajouts**.

C'est ce qui s'est vérifié à l'arrivée du Soleil — les six autres ont gardé leur
compte **absolu** de victoires au chiffre près (13, 13, 12, 11, 10, 4), et ils
étaient simplement jugés sur 21 duels au lieu de 18, les trois nouveaux étant
perdus par tous. L'Hoplite est passé à 12 depuis, en prenant une graine au
Soleil. Même vérification aux trois refontes de LUNE : neuf lignes déplacées,
toutes les siennes.

Le corollaire vaut aussi dans l'autre sens : **Neon Shadow a pu être supprimé
sans déplacer personne**, précisément parce qu'il était en queue de `ROSTER`.

### Invariant 9 — les deux régressions qui l'ont écrit

Une clé de fiche que plus personne ne lit ne crie pas, et ça s'est payé deux
fois, dans les deux sens :

- `lunge.recoil` et `lunge.hitRing` ont été **supprimés de la fiche** alors que
  le module les lisait encore → `NaN` dès la première touche. Celui-là plante,
  donc il se voit ;
- l'**écriture** de `weaponLateral` a été perdue, `lunge.lateral` restant dans
  la fiche sans lecteur. Celui-là ne plante **jamais** : l'arme cesse simplement
  de se poser sur le flanc, et rien ne le dit.

D'où `tools/fiche-check.mjs`, qui recoupe les **deux sens** — mais seulement sur
`weapon.lunge` et `special`. L'étendre à `ability` a été essayé : il criait à
tort **dix-neuf fois**, et un garde-fou qui crie à tort n'est plus lu.

### Formats — la table, et pourquoi elle a été écrite après coup

Ajouter un format ne demande **qu'une entrée dans la table `FORMATS`** de
`ui/select.js`, pas une ligne de moteur — et ce n'est pas une intention, c'est
un constat : **le 1 contre X a été joué par l'URL avant qu'une seule ligne
d'interface soit écrite**, et il tournait déjà, HUD groupé, titre d'arène et
jauges compris.

C'est à cette occasion que la table a pris sa forme actuelle. Chaque entrée
porte tout ce qui distingue son format (`taille`, `min`/`max` s'il est réglable,
`camps`, `tag`, `bouton`), et les trois chaînes `mode === '…'` qui traînaient
encore dans `select.js` y sont rentrées. Conséquence à retenir : **c'est `min`
qui décide l'affichage du compteur**, pas un nom de format — un format à taille
fixe n'en affiche pas, et il n'y a rien à brancher pour ça.

**Le plafond de 5 de la bataille royale** (`Math.min(5, ROSTER.length)`) est un
choix de lisibilité — le HUD n'a que deux bandeaux —, pas une limite du moteur,
qui accepte *n* combattants. Agrandir le roster ne le déplace donc pas, et le
relever demande de regarder le HUD, pas le moteur.
