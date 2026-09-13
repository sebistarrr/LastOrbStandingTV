# Fiches des combattants

**Dix combattants.** Cinq repris de la chaîne « ballthingsim » — **Pistolero**
et **Ronin** du duel *Outlaw vs Bladesman*, **Hoplite** de *Dragoon vs Outlaw*,
**Druide** construit sur la mécanique de Magia dans *Dragoon vs Magia*, et
**Shinobi**, reskin du Vent des vidéos *Elemental Armory League*. Les cinq
autres sont **inventés** : pas de vidéo, donc pas un seul `mesuré`. Le
**Golem** encaisse là où personne n'encaissait ; le **Mannequin** est une
**cible d'entraînement** sans arme ni dégâts, faite pour qu'on regarde les
mécaniques des autres ; le **Soleil** et la **Lune** sont les deux **boss**,
demandés pour gagner contre tous les autres en 1 contre 1 et ne se départager
qu'entre eux ; la **Comète** n'a pas d'arme non plus et frappe **avec son
corps**, à proportion de sa vitesse.

**Trois d'entre eux sont hors barème, aux deux bouts** : le Mannequin ne peut
pas gagner, les deux boss ne peuvent pas perdre contre les sept. Les écarts
d'équilibrage se lisent sur les sept autres.

Ces fiches sont la **transcription lisible** de `src/data/fighters/`. Le code
est la source de vérité : toute valeur ci-dessous existe telle quelle dans la
fiche gelée correspondante.

Les huit éléments d'origine ont été supprimés ; ce qui en subsiste est
rassemblé dans l'**archive** en tête de document, juste après ces règles.

**Sommaire.** Ce fichier est long et ne se lit jamais en entier : ouvre-le sur
la section qui te concerne (`offset` / `limit`), pas d'un bloc. Les numéros sont
**indicatifs** — ils dérivent à chaque ajout ; `grep -n '^## ' docs/FICHES.md`
les recale en une commande.

| Section | Ligne |
| --- | --- |
| Comment lire une valeur | 58 |
| 📦 Archive — les huit éléments supprimés | 107 |
| 🥷 SHINOBI — `wind` (affiché « SHINOBI » ; c'est l'ancien Vent reskiné) | 181 |
| 🤠 PISTOLERO — `outlaw` (affiché « PISTOLERO ») | 972 |
| ⚔ RONIN — `bladesman` (affiché « RONIN ») | 1127 |
| 🐲 HOPLITE — `lancer` (affiché « HOPLITE ») | 1384 |
| 🌿 DRUIDE — `mage` (affiché « DRUIDE » en français, « DRUID » en anglais) | 1949 |
| 🗿 GOLEM — `golem` (affiché « GOLEM » dans les deux langues) | 2440 |
| 🎯 MANNEQUIN — `dummy` (cible d'entraînement : sans arme, sans dégâts) | 2654 |
| ☀ SOLEIL — `sun` (le boss : il est fait pour gagner contre tous) | 2740 |
| 🌙 LUNE — `lunar` (le second boss : il est fait pour matcher le Soleil) | 3074 |
| ☄ COMÈTE — `comet` (sans arme : son corps est l'arme) | 3275 |
| La norme passe à 200 PV, le Golem à 400 (historique) | 3424 |
| Neon Shadow supprimé, la norme redescend à 100 PV | 3479 |
| Les dégâts de tous les combattants, divisés par deux | 3547 |
| Rééquilibrage confiné au Golem et au Ronin | 3657 |
| Nerf confiné au Shinobi et au Pistolero, les deux qui dominaient | 3744 |
| Le son de chacun | 3794 |
| **Équilibrage du roster** — c'est ici que vivent les chiffres | 3912 |
| &nbsp;&nbsp;· Relevé courant (les dix, 27 duels chacun) | 3922 |
| &nbsp;&nbsp;· Le sommet n'est plus partagé | 3952 |
| &nbsp;&nbsp;· Le banc de DPS contre le Mannequin | 3983 |
| &nbsp;&nbsp;· Deux conventions avant de juger un écart | 4025 |
| Règles communes (moteur) | 4119 |
| Comment les mesures ont été prises | 4143 |

## Comment lire une valeur

- `mesuré` = relevé sur les vidéos de référence, par échantillonnage d'images
  et analyse des pixels :

  | Vidéo | Combattants observés | Format |
  | --- | --- | --- |
  | `Outlaw vs Bladesman` | Pistolero, Ronin | 576 × 1024, 30 fps, 1159 images, 38,6 s |
  | `Dragoon vs Outlaw` | Hoplite, Pistolero | 576 × 1024, 30 fps, 33,6 s |
  | `Dragoon vs Magia` | Druide (d'après Magia) | 576 × 1024, 30 fps, 24,4 s |
  | *Elemental Armory League* (18 vidéos) | les huit éléments, dont le Vent devenu Shinobi | 720 × 1280 pour la première, 576 × 1024 pour les autres |

  **Le facteur de conversion n'est pas le même partout.** Les vidéos 576 se
  convertissent ×1,25 vers le repère 720 × 1280 du jeu — **sauf celle de
  Magia, ×1,275** : son arène mesure 502 px de bord extérieur contre 640 dans
  le jeu, et la bille le confirme (32 px de rayon × 1,275 = 40,8 ≈ 41). Ne pas
  supposer le facteur : le mesurer sur l'arène, le vérifier sur la bille.

- `calé` = ajusté par simulation pour retrouver le rythme observé (durée de
  duel, progression des compteurs du HUD).
- `déduit` = calculé à partir d'une autre valeur, sans relevé propre.

Les fiches sont **immuables** : `deepFreeze` les gèle au chargement du module et
`assertFrozen()` le revérifie au lancement de chaque duel. Un duel ne peut donc
pas déteindre sur le suivant.

**Les dégâts cités dans les sections par combattant ci-dessous sont ceux
d'origine, avant la division par deux demandée sur tout le roster** (voir
« Les dégâts de tous les combattants, divisés par deux », après les sept
sections de combattant) : reformuler chaque citation aurait demandé de rouvrir
des dizaines de tableaux figés depuis leur relevé, pour des chiffres qu'un seul
tableau récapitule déjà. Deux exceptions, patchées sur place parce qu'elles
citaient une formule comme un fait actuel et non comme une mesure : le corps à
corps et la brûlure au contact du Ronin, section RONIN. Pour toute autre valeur
de dégât **actuelle**, diviser par deux ce qui est écrit ici, ou lire
directement la fiche (`src/data/fighters/<id>.js`), qui reste la seule source
de vérité.

**Un seul écart volontaire au relevé de scène** : le fond hors-arène. La vidéo
est sur papier crème `rgb(249,241,218)`, le site l'a remplacé par une encre
sombre `#1c1a26` (`STAGE.paper`), et le filigrane de la chaîne n'est pas
reproduit. L'arène, elle, reste blanche : tout le pixel-art garde donc
exactement ses contours noirs mesurés. Seul le « chrome » posé sur le fond
sombre change de liseré — titre et lignes de stat passent au crème
`STAGE.outline`, et les jauges d'ultime gardent une **plaque crème** pour que
leur intérieur reste celui de la vidéo, libellé noir compris.

---

## 📦 Archive — les huit éléments supprimés

Le dépôt a longtemps porté huit **éléments** relevés sur les vidéos *Elemental
Armory League* : Ombre, Glace, Feu, Eau, Lumière, Foudre, Vent, Plante. Sept
ont été gelés puis **supprimés** — fiche, module et sprites. Le huitième, le
Vent, survit sous les traits du **Shinobi** et garde sa section complète
ci-dessous.

Leurs relevés complets sont dans l'historique git. Ce qui suit est ce qui
**sert encore** : les mesures d'origine des pouvoirs greffés sur les
survivants, qui restent la justification des valeurs de leurs fiches.

### Champ de givre (Glace) → Pistolero

| Propriété          | Valeur                                                 | Source |
| ------------------ | ------------------------------------------------------ | ------ |
| Durée              | 5,2 s                                                  | mesuré |
| Onde de choc       | anneau cyan 40 → 900 px en 0,95 s, déborde de l'arène   | mesuré |
| Champ              | rayon 130 px, **suit le porteur**                      | mesuré |
| Effet du champ     | −35 % de vitesse, 1 PV toutes les 0,7 s                | calé   |
| Neige              | 90 flocons/s sur toute l'arène                         | mesuré |
| Salve d'éclats     | 7 en étoile (360°) ; 10 par salve toutes les 1,2 s pendant le Champ de givre | mesuré |

**Éclat de givre** (`iceShard`, carte rapatriée dans `pixelart/outlaw.js`) :
sprite ×2,4, 380 px/s, 2 PV (`calé`), rayon 10 px (`déduit`), 3,4 s et
**2 rebonds** sur les murs, −12 % de vitesse pendant 1,6 s, traînée en
pointillé bleu pâle toutes les 35 ms.

### Aura de braise (Feu) → Ronin

6 s : nova de **90 cubes orange**, ailes de flammes battantes, aura brûlante de
150 px (2 PV / 0,6 s + brûlure), vitesse ×1,2. Cycle de jauge mesuré à **25-27 s**.

**La brûlure fait les deux à la fois** : elle **colore** la victime *et* la
**cercle d'un gros anneau orange**. Vérifié au zoom sur FIRE vs WATER — c'est ce
que reproduisent `statusTint` et `statusRing` dans `fighter.js`.

### Dôme de drain (Ombre) → Hoplite

| Propriété          | Valeur                                             | Source |
| ------------------ | -------------------------------------------------- | ------ |
| Durée              | **5,65 s** — chronométrée deux fois : 5,66 et 5,63  | mesuré |
| Dôme               | rayon 265 px, **figé** au point d'incantation, `rgba(30,24,45,.88)` | mesuré |
| Débordement        | le dôme **n'est pas clippé à l'arène** : il recouvre le bas de l'écran jusqu'au HUD | mesuré |
| Poussière          | 120 particules en dérive dans le dôme              | mesuré |
| Drain              | **1 PV toutes les 0,4 s** — 10 PV en 4,5 s, soit 2,2 PV/s | mesuré |
| Ralentissement     | −15 % sur la cible tant que le lien tient          | déduit |

Le suivi automatique confirme qu'il est bien **ancré** : sur ses 5,6 s, la
distance entre son centre et son lanceur passe de 71 px à 324 px.

### Tempête de fleurs (Plante) → Druide

5 s : la cible est clouée sur place (−70 %) et battue par une nuée de pétales,
pendant que le lanceur regagne 1 PV/s.

**Aspect** : des grappes de **carrés plats et opaques**, toujours alignés sur
les axes, sans contour ni dégradé, denses au point de masquer la cible, mêlées
de quelques corolles. **Aucun cerceau** sur les vidéos. Le rose d'origine
(`rgb(248,120,184)`) est passé au vert chez le Druide.

**Corolle** : 11 × 11 ×3,6 (≈ 40 px), contour noir épais et cœur clair.

### Ce qui est parti avec eux

Le **Semis** de la Plante (bulbes posés au sol) avait été greffé sur le Druide
puis retiré à sa demande. L'Égide de la Lumière, les tourbillons de l'Eau et
les bornes de la Foudre n'ont été greffés nulle part : leur code a disparu avec
leur fiche, y compris le crochet `onDamage` du moteur qui n'existait que pour
le bouclier.

---


## 🥷 SHINOBI — `wind` (affiché « SHINOBI » ; c'est l'ancien Vent reskiné)

> Harcèlement — le plus rapide, tornades et lames d'air.

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon 41 px, `#bcbf9e`, contour noir 5 px | mesuré |
| Déplacement | **500 px/s**, virage 2,2 rad/s — le plus mobile du roster | mesuré |
| Arme | *Shuriken de bourrasque* — portée 105 px, **aucun manche** (le losange est posé à même la boule), sprite `windShuriken` 17 × 17 ×4,35 soit **74 × 74 px** | mesuré |
| Détail du shuriken | anneau en losange évidé : **double contour noir** (extérieur *et* pourtour du trou), corps crème dégradé — clair côté intérieur, chaud côté extérieur — et **quatre ergots gris** qui dépassent aux pointes | mesuré |
| Rotation d'arme | 6,34 rad/s (× 1,1 par rapport au reste du roster) | mesuré |
| Corps à corps | 3 PV / 1 s (la cadence la plus rapide), ralentit de 12 % | calé |
| **Tornade** | **rafale de 0,2 s, rayon 125 px, centrée sur le Vent lui-même** — pas un vortex lancé au loin ni une zone qui dure | mesuré |
| Aspect de la rafale | **disque flou couleur sable** fait de 9 larges pales en éventail qui rayonnent du centre et se chevauchent, cœur plus dense (`rgb(168,152,124)`), bord franc — pas des cercles concentriques | mesuré |
| Effet de la rafale | `stat / 2` PV et une projection de 430 à qui se trouve dedans | calé |
| Cadence | part sur 4 s et **s'accélère à chaque rafale** (−0,15 s), jusqu'à un plancher de 0,5 s | mesuré |
| **Double progression** | une rafale **qui touche** : dégâts +2 (10 → 24, plafond) **et** recharge −0,5 s de plus | mesuré |
| Ultime | *Salve de tempête* (`TEMPEST VOLLEY`) : jauge pleine toutes les ~9 s, puis décharge **courte et dense** de 1,5 s (2 croissants toutes les 0,3 s) + vitesse ×1,25 | mesuré |
| Projectile | *Lame d'air* — `windCrescent` 16 × 16 ×3,6 (≈ 58 px), 430 px/s, 3 PV, 1 rebond. **Vrai croissant sans contour** (deux cercles décalés), corne sombre côté traînée, ventre crème, liseré clair sur le dos convexe | mesuré |
| HUD | `Tornado Damage: N` **et** `Cooldown: X.Xs` (deux lignes) | mesuré |

### Comment la tornade a été établie

Détection automatique image par image sur trois duels (`WIND vs LIGHT`,
`WIND vs LIGHTNING`, `WIND vs PLANT`), en isolant les pixels bruns du
tourbillon puis en comparant son centre à celui des deux combattants :

1. **Durée** — 4 à 6 images à chaque fois, soit 0,13 à 0,20 s. Ce n'est pas
   une zone qui persiste : c'est une rafale.
2. **Position** — sur 18 déclenchements, le centre du tourbillon est à moins
   de 30 px du Vent (souvent moins de 10). Il l'invoque autour de lui.
3. **Cadence** — les intervalles mesurés descendent régulièrement :
   4,8 · 4,1 · 4,2 · 3,4 · 2,7 · 2,4 · 2,1 · 1,9 · 2,2 · 2,1 · 1,9 · 1,7 ·
   1,3 · 1,4 · 1,4 · 1,5 s. Deux vidéos donnent la même courbe.
4. **Progression** — 17 rafales pour seulement 7 avancées du couple affiché
   (10/4 s → 24/0,5 s, par pas de +2 / −0,5). Les incantations qui ne
   rapportent rien sont celles où l'adversaire était loin : ce sont donc les
   rafales **qui touchent** qui font progresser.

Ces deux rythmes distincts — la cadence qui s'accélère à chaque rafale, le
couple affiché qui n'avance qu'aux rafales réussies — sont reproduits par deux
décréments séparés dans la fiche (`cooldownStepOnCast` et `cooldownStep`).

### Reskin — Shinobi

**Réactivé et redessiné à la demande, comme le Ronin avant lui.** Le Vent
était gelé ; il est réactivé, déplacé en queue de `ROSTER` (après
Hoplite, pas à sa place d'origine) pour ne pas déplacer le camp A des six
duels déjà établis entre le Pistolero, Ronin et l’Hoplite — voir `CLAUDE.md`
pour le détail. `id: 'wind'` ne change pas ; seuls `name`/`nameRef`
(`VENT`/`WIND` → `SHINOBI`/`SHINOBI`), l'arme et les projectiles bougent.

| Ce qui change | Détail | Source |
| --- | --- | --- |
| Arme | *Shuriken de bourrasque* → *Shuriken de flamme* (`Flame Shuriken`) — huit branches de métal sombre cerclées de flamme continue, crâne de dragon au centre | maquette |
| Projectile | `crescent` (lancé par `ultimate.volley`) : sprite `windCrescent` → `windShuriken`, `scale` 3,6 → 4,35, `radius` 12 → 15 | demandé, calé |

**L'arme et le projectile partagent maintenant le même sprite, à la même
échelle (4,35).** « Des shurikens de la même taille » : le projectile lancé a
exactement la taille dessinée de l'arme en main (~74 px), pas une taille
propre — contrairement à l'ancien croissant (58 px). Le rayon de collision du
projectile suit la même proportion (12 → 15) pour que la hitbox ne mente pas
sur un projectile devenu plus grand.

**Un vrai PNG, directement — pas de pixel-art texte intermédiaire.**
`head.sprite: 'windShuriken'` est servi par
`assets/sprites/shinobi-shuriken.png` (déclaré dans
`assets/sprites/manifest.json`), un recadrage de la maquette fournie sur sa
plus grande composante connexe — même méthode que la lame du Ronin.
Différence notable : cette maquette isolait mal l'objet du damier de
transparence sur ses zones sombres (le disque derrière le crâne, les creux
entre les branches) — un simple retrait de fond y laissait des poches de
damier visibles, contrairement à la lame dont le fond se retirait proprement.
`cv2.inpaint` (méthode Telea) a rebouché ces poches à partir des pixels
voisins, sans toucher au reste de l'image.

**Reach et hitbox de l'arme inchangés : c'est un reskin, pas un
rééquilibrage.** Le PNG recadré (198 × 200) est quasi carré, comme l'était
déjà `WIND_SHURIKEN` (17 × 17, resté en repli texte) : `handle.length` et
`head.scale` retombent donc sur la même taille dessinée (~74 px) sans le
moindre recalcul.

**Corps passé au noir, à la demande.** `look.body` `#bcbf9e` → `#141414`.
Le contour (`outline`) et le chiffre de PV (`hpColor`) étaient déjà proches du
noir (`#0a0a0a`) : laissés tels quels, ils auraient disparu **noir sur noir**
sur le nouveau corps — le même piège déjà payé sur le Ronin (voir sa
section, « HP au-dessus de la manche »). Contour repassé à l'orange de braise
du shuriken (`#e8621b`), chiffre de PV au crème mesuré du reste du roster
(`#f5f2ea`). Vérifié à l'écran (`tools/shot.mjs`), lisible dans toutes les
configurations testées. Purement visuel, matrice inchangée.

**Relevé de matrice initial : 0/9 contre les trois autres actifs, 3/3 en
miroir.** Aucune valeur de combat n'avait été retouchée à la hausse ou à la
baisse (le rayon de collision du projectile avait même légèrement augmenté) :
c'était le relevé du Vent d'origine, sous la moyenne dans l'historique à onze
combattants (12/30), confronté aux trois invités les plus agressifs du roster
réduit plutôt qu'à dix adversaires variés. Ce résultat a changé depuis — voir
« Corps au noir et Clone d'ombre » ci-dessous.

### Corps au noir, et Clone d'ombre

**Aura et traînée passent au noir, à la demande.** `look.aura.color`
(`rgba(214,205,170,…)` → `rgba(20,20,20,…)`) et `look.trail.color`
(`rgba(207,198,168,…)` → même noir) : dernier vestige khaki-crème du reskin
d'avant le corps noir. `look.flair` (ruban, motes, éclair d'incantation)
n'est pas touché, non demandé. Purement visuel.

**Nouveau pouvoir demandé : un clone de lui-même, 20 PV.** Troisième
créneau greffé (même patron que le Champ de givre/l’Aura de braise/le Dôme de
drain), mais **conçu** pour le Shinobi plutôt que repris d'un autre
combattant — voir `docs/PIEGES.md`, « Invariant 13 », pour le détail technique
(pourquoi il est
stationnaire et incorporel, comment il réutilise `Fighter.prototype` et
`weaponHit()`).

> **Ce qui suit est l'état d'origine du pouvoir, gardé pour l'historique.** Le
> clone se déplace, porte l'arme du Shinobi et ne lance plus de shurikens
> depuis « Le clone marche, porte l'arme, et ne jette plus rien », plus bas
> dans cette section.

En résumé :

| Trait | Valeur |
| --- | --- |
| PV | 20 (demandé) |
| Apparition | 5 s puis toutes les 12 s **sans condition**, à 130 px derrière le Shinobi — plusieurs clones coexistent |
| Durée | **permanente** — demandé ; seuls ses PV le font disparaître |
| Riposte | shuriken vers l'adversaire toutes les 1,1 s, attribué au vrai Shinobi (charge son ultime) |
| Rendu | identique au vrai combattant (même prototype `Fighter`), **sans arme**, 88 % d'opacité |
| Corps | **solide** — bouscule l'adversaire et le vrai Shinobi, personne ne le traverse |
| Jauge | `SHADOW CLONE`, sous `TEMPEST VOLLEY`, mêmes couleurs |

**Relevé de matrice après ajout : 3/9 contre les trois autres actifs
(1/3 Pistolero, 2/3 Ronin, 0/3 Hoplite), 3/3 en miroir inchangé.**
Toutes les lignes n'impliquant pas `wind` restent identiques au caractère
près. `tools/matrix-reference.txt` régénérée.

**Rendu permanent, second relevé : 4/9** (0/3 Pistolero, **3/3** Ronin,
1/3 Hoplite). Le plafond de 6 s (`sp.duration`) est retiré de la fiche — plus
rien n'expire le clone, seuls ses PV le peuvent. Toujours confiné aux seules
lignes `wind` ; `tools/matrix-reference.txt` régénérée une seconde fois.

**Rendu solide, troisième relevé : 5/9** (**1/3** Pistolero, 3/3 Ronin
inchangé, 1/3 Hoplite inchangé). Il réutilise la géométrie de `resolveBodies()`
(`physics.js`) à sens unique — le clone ne bouge jamais, l'autre corps
encaisse tout l'écartement — écrite dans `wind.js` pour rester confinée au
module. Le blocage joue dans les deux sens : le vrai Shinobi peut aussi se
faire bloquer par son propre clone, sans que ça n'ait posé de problème au
banc. `tools/matrix-reference.txt` régénérée une troisième fois.

**Arme retirée du clone, purement visuel.** Il continue de jeter des
shurikens (`throwFromClone`, inchangé) mais n'en porte plus sur lui :
`customWeapon` passe de `null` à un no-op, ce qui coupe `drawWeapon()` sans
toucher au reste du rendu hérité de `Fighter.prototype`. Matrice inchangée
au fichier près.

**Plusieurs clones à la fois, à la demande.** `f.state.clone` devient
`f.state.clones` (tableau) : la minuterie de réapparition tourne en continu
et pose un nouveau clone toutes les 12 s sans attendre la mort des
précédents. Chaque clone garde ses PV et son horloge de riposte propres.
Une même arme ou un même projectile ne peut jamais toucher deux corps au
même pas — `weaponHit()` pose `target.meleeCd` dès le premier clone touché,
et un projectile est retiré de la liste dès qu'il touche — donc aucun
verrou supplémentaire n'a été nécessaire pour garder cette règle avec
plusieurs clones. **Relevé de matrice : 7/9**, contre 5/9 avec un seul
clone à la fois — 3/3 contre le Pistolero (contre 1/3), 3/3 contre le Ronin (inchangé, déjà maximal), 1/3 contre l’Hoplite (inchangé, sa
charge traverse l'écart sans ralentir). `tools/matrix-reference.txt`
régénérée une quatrième fois.

### La bille devient le shuriken

**Demandé : la bille joue le trou du shuriken, les lames rayonnent autour.**
L'arme n'est plus tenue à côté du corps, elle est **centrée dessus** — même
PNG, nouvelle géométrie.

| Bloc | Avant | Après | Source |
| --- | --- | --- | --- |
| `head.scale` | 4,35 (74 px de large) | **8,912656** (**150 px**) | demandé, calé à l'œil |
| `handle.length` | 34 | **−75** | déduit : une demi-largeur, pour centrer |
| `reach` | 105 | **75** | déduit : rayon des pointes dessinées |
| `hitbox` | `from 0,45 → to 1`, `radius 18` | **`from 0` / `to 0`, `radius 75`** | demandé : dégâts tout autour |

`handle.length + largeur dessinée = −75 + 150 = 75 = reach` : l'invariant
« la pointe dessinée retombe sur la portée » tient toujours, en symétrique.

**La hitbox omnidirectionnelle se dit dans la fiche seule.** `from`/`to` à
zéro confondent les deux bouts du segment tranchant sur le pivot ;
`segmentPointDistance` gère déjà ce cas dégénéré, donc `weaponHit()` teste
`distance ≤ rayon adverse + 75`, soit un disque centré sur la bille. Aucune
ligne de `fighter.js` ni de `physics.js` n'a bougé.

**Taille : compromis assumé.** Le vrai moyeu de la maquette fait 30 % du
rayon ; y caler une bille de 82 px aurait demandé un shuriken de 273 px,
presque la moitié de l'arène. À 150 px les lames dépassent de 34 px — la
bille couvre le moyeu et la naissance des lames, ce qui dépasse est la
partie flamme. L'arme reste **sous** le corps, sinon la bille ne boucherait
plus le trou.

**Deux conséquences gratuites.** Le ruban de `flair.js` suit `reach` le long
de `weaponAngle` : il trace désormais un cercle de 75 px autour du
combattant. Et les projectiles (`crescent`, resté à `scale: 4,35`) ne
suivent **pas** la nouvelle taille : la règle « des shurikens de la même
taille que l'arme » valait pour l'arme tenue, un projectile de 150 px serait
illisible.

**Relevé de matrice : 8/9** (3/3 Pistolero, 3/3 Ronin, **2/3** Hoplite
contre 1/3 avant). Une hitbox qui ne dépend plus de l'orientation de l'arme
punit la charge de l’Hoplite, qui passait jusque-là entre deux tours de lame.
Les durées se raccourcissent partout — signature d'une cadence de touche en
hausse. **Le Shinobi devient l'anomalie du roster réduit**, conséquence
directe de la demande, documentée telle quelle. Leviers pour le ramener si
besoin : `hitbox.radius` (75), `melee.damage` (3), `melee.cooldown` (1 s).

### Style sombre ninja

**Demandé, purement visuel.** Matrice **identique au caractère près**.

| Bloc | Avant | Après |
| --- | --- | --- |
| Arme (PNG) | flammes orange/rouge | **`shinobi-shuriken-dark.png`** — même image, luminance remappée en gris (p50 61 → 51, p95 197 → 136), alpha conservé |
| Nom de l'arme | *Shuriken de flamme* | ***Shuriken d'ombre*** (`Shadow Shuriken`) — « de flamme » aurait menti sur ce qu'on voit |
| `look.accent` | `#a89b6f` | **`#1f1f24`** — c'est lui qui remplit le nombre de dégâts, la marque au sol et le sillage |
| `look.aura` / `look.trail` | noir plat | gris-noir (`rgba(38,38,44,…)` / `rgba(42,42,50,…)`) |
| `flair.ribbon` | `#d6cdaa` | `#33333c` |
| `flair.motes` | khaki | `['#3f3f46', '#71717a', '#18181b']` |
| `flair.impact` | crème/blanc/khaki | `['#52525b', '#27272a', '#8b8b93']` |
| `flair.castFlash` | crème | `rgba(30,30,36,0.55)` — l'écran s'assombrit au lieu de blanchir |
| Traînée du projectile | `rgba(207,198,168,…)` | `rgba(58,58,68,…)` |
| `weapon.spin` | `SPIN × 1,1` | **`SPIN × 1,43`** (×1,3 demandé) |

**Deux points de méthode.** La rampe de gris est plafonnée à **168/255** :
l'arène étant blanche, un gris pâle n'y existe pas, mais il faut assez de
clair pour que le dessin des lames reste lisible. Et `accent` vaut `#1f1f24`
plutôt que du noir pur parce que le moteur pose déjà un contour `#0a0a0a`
autour du chiffre de dégâts — un remplissage identique effacerait le relief
du glyphe.

**La rotation est bien sans effet sur le duel** : depuis que la hitbox est un
disque centré, `weaponAngle` ne décide plus d'aucune collision. La matrice
inchangée en est la preuve, pas la relecture du code.

**Restaient chauds à cette étape** : le contour orange de la bille (gris
depuis, voir ci-dessous), le disque de sable de la Tornade (relevé vidéo,
0,2 s) et les jauges du bas d'écran.

### Contour gris, dégâts gris, renommages

| Bloc | Avant | Après |
| --- | --- | --- |
| `look.outline` | `#e8621b` (orange de braise) | **`#8f8f99`** |
| `look.accent` (nombre de dégâts) | `#1f1f24` (noir) | **`#8f8f99`** |
| `hud.stats[0]` | `Tornado Damage` | **`Shuriken Damage`** |
| `ultimate` | `TEMPEST VOLLEY` / *Salve de tempête* | **`SHURIKEN TORNADO`** / *Tornade de shurikens* |

Le gris est choisi entre deux bornes : plus clair que le corps (`#141414`),
plus sombre que le blanc de l'arène, et un cran sous le point le plus clair
du shuriken (168/255) pour que l'anneau reste lisible **par-dessus** les
lames. Le noir des dégâts de l'étape précédente était une erreur : le moteur
pose déjà un contour `#0a0a0a` autour du chiffre, un remplissage noir s'y
noyait. Les `id` internes (`tempestVolley`, `tornado`) ne bougent pas.

### Correctif : le clone n'encaissait jamais un coup de mêlée

Banc instrumenté, pas par pas, sur les instants où un clone est
**géométriquement** dans la portée de l'arme adverse :

| Adversaire | pas à portée | bloqués par `meleeCd` | PV perdus (avant → après) | morts (avant → après) |
| --- | --- | --- | --- | --- |
| Pistolero | 15 | **15 (100 %)** | 22 → **36** | 1 → 1 |
| Ronin | 49 | **49 (100 %)** | 14 → **21** | 0 → **1** |
| Hoplite | 34 | **34 (100 %)** | 14 → **30** | 0 → **2** |

**Cause : un ordre d'exécution.** `weaponHit()` refuse la touche quand
`attacker.meleeCd > 0`, et `Match.resolveMelee` tourne avant les modules :
elle pose ce verrou dès que l'arme atteint le vrai Shinobi, à 130 px du clone
donc à portée aux mêmes instants. La « mutuelle exclusion » documentée
n'était pas une course équitable — le clone la perdait toujours.

**Correctif :** `cloneWeaponHit()` reprend la géométrie de `weaponHit()` mot
pour mot (même `bladeSegment()`, même `segmentPointDistance`) mais la garde
par `clone.hitCd`, propre à chaque clone. Une touche sur un clone ne pose
jamais `opponent.meleeCd` : ça rendrait le vrai Shinobi intouchable dès qu'un
clone traîne à côté, soit une famine remplacée par l'autre.

**Matrice : 8/9 → 7/9**, Hoplite reprend son affrontement (2/3 contre
1/3). C'est un correctif de bug, et il va dans le bon sens pour l'anomalie
signalée à l'étape précédente.

### Couleur des pouvoirs au gris

**Demandé, purement visuel.** Derniers restes khaki-crème du Vent d'origine :

| Bloc | Avant | Après |
| --- | --- | --- |
| Jauges (`ability`/`special` `barFill`/`barText`) | `#b9b295` / `#2a2518` | **`#71717a`** / **`#e0e0e5`** |
| Disque de sable de la Tornade | sable | gris ardoise |
| `hud.color` / `hud.stroke` | `#8a8163` / `#f4eddc` | `#71717a` / `#d0d0d5` |

Aucune de ces clés n'est lue ailleurs que par le rendu — matrice inchangée.

### Rotation ×1,2 de plus, clone allégé à 15 PV

**Rotation :** `SPIN * 1,43` → **`SPIN * 1,716`** (encore ×1,2). Toujours sans
effet de collision (la hitbox reste un disque centré) — matrice identique au
caractère près.

**PV du clone : 20 → 15**, demandé, gameplay assumé. Une seule ligne bouge :

| Duel | Avant | Après |
| --- | --- | --- |
| `outlaw vs wind` | wind 3/3 | **wind 2/3, outlaw 1/3** |
| `bladesman vs wind` | wind 3/3 | inchangé |
| `lancer vs wind` | wind 1/3 | inchangé |

Cohérent avec l'observation déjà faite sur les clones multiples face au
canon asservi du Pistolero : des clones plus fragiles meurent plus vite,
donc gênent son tir moins longtemps. Le Ronin et l’Hoplite ne s'appuyaient pas
sur la durée de vie du clone. **Total Shinobi : 6/9**, contre 7/9 avant.
Lignes sans `wind` identiques au caractère près.

### Dégâts de mêlée 3 → 2 : le Shinobi paie le resserrement du roster

Il n'y avait rien à reprocher au Shinobi — le réglage vient d'ailleurs. Le Pistolero et le Ronin étaient derniers ex æquo (3/12 chacun), et la
question posée était de **les** remonter. Leurs leviers propres n'ont rien
donné :

| Levier essayé | Balayage | Résultat |
| --- | --- | --- |
| Pistolero, `projectiles.shot.radius` | 8 / 10 / 12 / 14 | 10 / 9 / 10 / 9 — **plat et non monotone** |
| Pistolero, `ability.spread` | 0,75 / 0,55 / 0,35 / 0,2 / 0,1 | 10 / 14 / 21 / 22 / 24 — **vrai levier, mais** |
| Ronin, `ability.cooldown` (palier de surchauffe) | 1,8 / 2,6 / 3,5 / 5 | 9 / 7 / 9 / 9 — **plat** |
| Ronin, `movement.speed` | 560 / 600 / 620 / 660 | 11 / 13 / 12 / 10 — **bruit** une fois le Shinobi corrigé |

*(24 duels par combattant, les deux camps.)*

La dispersion du Pistolero marche — c'est le seul levier vivant des deux —
mais elle est **déduite d'une mesure** : 0,75 rad reproduit les 0,60 coup/s
relevés sur sa vidéo, elle-même déduite des 25 paliers de `Damage` en 38,6 s.
La baisser rendrait le pistolero plus précis que le pistolero filmé. Écarté.

**Le levier qui restait était chez le Shinobi**, l'écart d'en haut :
`melee.damage` de 3 à 2 remonte le Pistolero **et** Ronin de 3/12 à
4/12 chacun, sans toucher une ligne de leur fiche.

| | Avant | Après |
| --- | --- | --- |
| Hoplite | 9/12 | 9/12 |
| Druide | 6/12 | 7/12 |
| **Shinobi** | **9/12** | **6/12** |
| Pistolero | 3/12 | 4/12 |
| Ronin | 3/12 | 4/12 |
| **Écart** | **3–9** | **4–9** |

**Écarté : réduire `hitbox.radius` (75).** C'est le levier que `CLAUDE.md`
citait en premier, et au banc il resserre encore mieux (à 50 : écart 9–15 sur
les deux camps). Mais ce rayon est **déduit du shuriken dessiné** — c'est la
demi-largeur du sprite. Le rétrécir ferait mentir le dessin sur l'endroit où il
touche, exactement ce que le dépôt s'interdit depuis `handle.length`. Les
dégâts, eux, ne sont écrits nulle part sur le sprite.

**Un mot sur le chiffre de départ.** À la matrice, Pistolero et le Ronin étaient à 3/12 — mais sur **les deux camps** ils étaient à 10/24 et
9/24, soit presque la moyenne. La matrice ne joue chaque paire qu'une fois,
donc chacun y reste du même côté et le camp A pèse lourd : elle exagère les
écarts. Elle reste le garde-fou de non-régression, pas la mesure de force.

### Le clone marche, porte l'arme, et ne jette plus rien

**Demandé, en trois points :** supprimer les shurikens que le clone lançait ;
le rendre **mobile**, avec le même dessin et la même arme que l'original,
**sans ses pouvoirs** ; et poser **une légère différence de ton** pour dire
lequel est le vrai.

| Trait | Avant | Après |
| --- | --- | --- |
| Déplacement | **aucun** — planté là où il apparaît | `Fighter.step()`, celle des vrais combattants : pilotage vers l'ennemi, vitesse de la fiche, amortissement du recul, rebonds sur les quatre murs |
| Attaque | shuriken lancé toutes les 1,1 s | **l'arme de l'original**, `weaponHit()` du moteur : même disque de 75 px, même cadence, mêmes dégâts |
| Arme portée | aucune (`customWeapon` no-op) | **le shuriken**, dessiné par `drawWeapon()` comme celui du vrai |
| Corps | solide **à sens unique** — il ne bougeait pas, l'autre encaissait tout l'écartement | `resolveBodies()` du moteur, des deux côtés |
| Pouvoirs | aucun | aucun — inchangé, et c'est demandé |
| Ton | 88 % d'opacité | corps **mélangé** à `#6b6b76` (α 0,55) + 82 % d'opacité |
| Apparition | toutes les 12 s | **toutes les 5 s** — voir l'équilibrage ci-dessous |

**Ce qui disparaît du module :** `throwFromClone`, `special.attack`,
`resolveCloneBody` et `c.attackTimer`. Le clone appelle désormais
`Fighter.step()`, `resolveBodies()` et `weaponHit()` **telles quelles** : c'est
ce qui garantit qu'il ne peut pas diverger de l'original. Ne restent écrits à
la main que les deux choses que le moteur ne peut pas servir — le sens
*inverse* de la touche (`cloneWeaponHit`, à cause de la famine de `meleeCd`,
voir plus haut) et les projectiles adverses, que `Projectiles.update()` ne
teste que contre `game.fighters`.

**La différence de ton est faite pour rester légère** — un double repeint ne
serait plus un double. `tint`/`tintAlpha` **mélangent** un gris de la gamme
ninja au corps au lieu de le remplacer : le noir plein `#141414` de l'original
ressort en `#444`-ish sur le clone. Un troisième écart existe sans avoir été
réglé : le clone ne traîne **ni ruban ni sillage**, parce que `render/flair.js`
ne boucle que sur les combattants du tableau. C'est le plus lisible des trois
en mouvement — c'est le vrai qui laisse une traîne derrière lui.

#### La matrice a caché l'écart au lieu de l'exagérer

Premier relevé après le changement, à recharge inchangée : **la matrice ne
bouge que d'un duel** (`wind vs mage` passe de 2/3 à 1/3). De quoi conclure que
le changement était neutre. Il ne l'était pas :

| Banc | Avant | Après |
| --- | --- | --- |
| Matrice (12 duels, un seul camp) | 4/12 | 3/12 |
| **Deux camps** (48 duels, 6 seeds × 8 affrontements) | **23/48** | **4/48** |

Le Shinobi était déjà du mauvais côté de presque toutes ses lignes de matrice :
elle n'avait plus rien à mesurer. C'est le pendant du piège déjà documenté —
la matrice exagère les écarts d'un combattant fort, elle **aveugle** sur un
combattant bas. Repasser les deux camps, toujours.

**La cause :** un clone qui marche va au contact, donc il meurt vite. Ses
15 PV tenaient longtemps quand il restait planté à jeter des shurikens de loin.

**Deux leviers, balayés séparément** (ils ne s'additionnent pas — leçon déjà
payée sur le Druide), sur les deux camps :

| Levier | Balayage | Victoires /48 |
| --- | --- | --- |
| `special.hp` | 15 / 25 / 40 / 60 | 4 / 13 / 15 / 17 — monotone mais **saturant**, et n'atteint jamais le niveau d'avant, même à quatre fois la valeur demandée |
| `special.cooldown` | 12 / 8 / 6 / 5 / 4 s | 4 / 15 / 19 / **22** / 25 — monotone sur tout le balayage, et **traverse** le niveau d'avant |

**Retenu : `cooldown` 12 → 5 s**, un seul levier tourné. 22/48 contre 23/48
avant, soit un duel d'écart ; les PV restent à la valeur demandée. À l'écran,
deux clones vivants au plus en fin de duel — ils meurent trop vite pour
s'accumuler.

**Matrice régénérée.** Seules les cinq lignes du Shinobi bougent (invariant 3),
et l'écart du roster reste **4 à 11** ; c'est le milieu du classement qui se
réordonne : Hoplite 11, **Shinobi 6**, Ronin 5, Pistolero 4, Druide 4.

| Duel | Avant | Après |
| --- | --- | --- |
| `outlaw vs wind` | outlaw 2, wind 1 | inchangé |
| `bladesman vs wind` | bladesman 2, wind 1 | **wind 2, bladesman 1** |
| `lancer vs wind` | lancer 3 | inchangé |
| `wind vs mage` | wind 2, mage 1 | **wind 3** |
| `wind vs wind` | wind 3 (miroir) | inchangé |

### Le clone hérite des PV restants du Shinobi

**Demandé :** le clone naît avec `f.hp`, les points de vie **restants** de son
invocateur à l'instant de l'incantation, au lieu des 15 de la fiche.

**Copie, pas transfert** — le Shinobi ne perd rien en invoquant. Les deux barres
vivent ensuite séparément : le clone n'encaisse que ses propres touches, et rien
ne les resynchronise. La clé `hp` du bloc spécial disparaît de la fiche, sans
quoi elle y traînerait sans lecteur (`fiche-check` la voit, **y compris citée
dans un commentaire** — d'où la formulation contournée dans `wind.js`).

Le pouvoir devient **auto-décroissant** : un clone posé tôt est aussi solide que
l'original, un clone posé en fin de duel arrive aussi entamé que lui. C'est ce
qui rend un plafond inutile.

#### La recharge rend la moitié de ce qu'elle avait pris

Les 5 s de la section précédente compensaient la **fragilité** d'un clone
mobile à 15 PV. Cette fragilité n'existe plus. Nouveau balayage, deux camps :

| `special.cooldown` | 5 s | 7 s | **9 s** | 12 s |
| --- | --- | --- | --- | --- |
| Shinobi /48 | 26 | 22 | **23** | 17 |

**Retenu : 9 s.** C'est le niveau d'avant tout ce chantier au duel près, et la
compensation d'urgence en grande partie rendue. Entre 7 et 9 l'écart est d'un
duel — du bruit ; 9 s l'emporte parce qu'il laisse **moins de corps dans
l'arène** pour le même résultat, et qu'il se rapproche de la valeur d'origine
(12 s) d'aussi près que le banc l'autorise.

#### Le total est stable, le roster s'est creusé

C'est le vrai enseignement de ce changement, et il a failli passer : **22/48 →
23/48**, on aurait pu s'arrêter là. Le banc **ligne par ligne** dit autre chose.

| Ligne (deux camps, 12 duels) | Avant | Après |
| --- | --- | --- |
| `outlaw vs wind` | wind 5 | **wind 10** |
| `bladesman vs wind` | wind 4 | **wind 5** |
| `lancer vs wind` | wind 1 | **wind 0** |
| `wind vs mage` | wind 12 | **wind 8** |

Le Shinobi ne monte pas, il **redistribue** — et le perdant net est un
combattant qui n'a rien demandé :

| Sur 48 duels, deux camps | Avant | Après |
| --- | --- | --- |
| Hoplite | 38 | 39 |
| Ronin | 26 | 25 |
| Shinobi | 22 | **23** |
| Druide | 19 | **23** |
| **Pistolero** | **15** | **10** |

**Le mécanisme était déjà documenté, à l'envers.** La section « clone allégé à
15 PV » notait que des clones plus fragiles meurent plus vite et gênent donc
moins longtemps le canon asservi du Pistolero. L'inverse est vrai et coûte plus
cher : un clone à 100 PV **absorbe un barillet entier** là où un clone à 15 PV
tombait en quatre balles. Le Pistolero tire 62 % de ses dégâts de ses balles ; les
lui faire dépenser sur un leurre le désarme.

**Non corrigé, et c'est délibéré.** Le remonter demanderait de toucher **sa**
fiche à lui — ou de plafonner l'héritage, ce qui contredirait la demande. Les
deux sont un autre chantier que celui qui a produit l'écart. Écart de matrice :
**2 à 11**, contre 4 à 11 avant.

### Le clone devient un combattant à part entière — le duel passe en 2 contre 1

**Demandé, en trois points :** que les clones aient **les mêmes pouvoirs que le
principal, avec le même cooldown** ; qu'une invocation fasse **passer le duel en
2 contre 1**, le clone étant **considéré comme un Shinobi à part** ; et que
leurs **PV descendent à 25**.

Le clone n'est plus une entité du module : c'est un **`Fighter` inscrit dans
`game.fighters`**, dans le camp du Shinobi.

| | Avant | Après |
| --- | --- | --- |
| Nature | objet du module coiffé de `Fighter.prototype` | **`Fighter` du tableau**, construit par le même constructeur |
| Pouvoirs | aucun | **tous** — Tornade et Salve de shurikens comprises |
| Recharge | — | celle **courante** de l'original, pas celle de la fiche (voir plus bas) |
| PV | ceux restants du Shinobi | **25**, valeur de fiche |
| HUD | rien | **sa plaque de PV, sa jauge d'ultime, sa ligne de stat** |
| Fin de partie | invisible | il compte : la partie continue si le vrai Shinobi tombe pendant qu'un clone tient |
| Classement | absent | il y figure |

#### Ce que ça retire du module, et ce que ça a coûté au moteur

Le module perd, d'un coup : le pas de déplacement recopié, les collisions
corporelles, la frappe, le verrou de touche subie (`cloneWeaponHit` et la
famine de `meleeCd` qu'il contournait), l'encaisse des projectiles adverses, la
disparition à zéro PV, et le tracé dans `drawOver`. **Sept mécanismes** que le
moteur servait déjà.

Le moteur, lui, gagne `Match.join()` — et **rien d'autre que la tenue à jour
des six choses indexées par rang** (`fighters`, `teams`, `hp`, `modules`, les
deux tableaux de statistiques) plus `flair.attach()`. Collisions, mêlée,
ciblage, HUD, condition de victoire et classement travaillaient déjà sur
`this.fighters`.

**L'entrée est différée d'un pas, et c'est le seul piège.** L'appelant est un
module, or `Match.update()` itère `this.modules` quand il appelle `join()` : une
`Map` de JavaScript **visite les entrées ajoutées pendant l'itération**. Le
nouveau venu verrait donc son `update()` tourner dans l'image de sa naissance,
avant son premier pas et après les boucles de corps et de mêlée du pas courant.
D'où la file d'attente, vidée par `flushArrivals()` en fin de pas.

Deux conséquences de bord, assumées :

- **`drawOver` devient facultatif** dans `Match.draw()` (comme `drawUnbounded`
  et `specialBar`) : le Shinobi n'a plus rien à poser par-dessus, et un module
  ne doit pas déclarer une méthode vide pour ça ;
- **l'incantation consomme le flux de simulation.** `new Fighter(...)` écarte
  le cap de départ de `rng.spread(0.35)`. C'était précisément ce qu'évitait la
  version d'avant — mais elle n'inscrivait rien dans le tableau. Un combattant
  qui entre en jeu est un événement de simulation, pas une décoration.

#### « Le même cooldown » : celui de l'instant, pas celui de la fiche

La recharge de la Tornade du Shinobi **se raccourcit à l'usage** (4 s → 0,5 s),
et ses dégâts de Tornade montent avec. Un clone parti des chiffres de la fiche
aurait donc été plus lent et plus faible que celui qui l'invoque, et « le même
cooldown » aurait été faux. Le clone reprend `ability.cooldown` et `stacks`
**tels qu'ils sont à l'instant de l'incantation**.

La jauge d'ultime, elle, part de **zéro** : c'est une charge, pas une recharge,
et la recopier laisserait un clone lâcher sa Salve à la seconde où il apparaît.

**Un clone n'invoque pas de clone.** Seule limite posée, et délibérée : le
pouvoir se déclencherait chez lui comme chez l'original, donc le nombre de
doubles doublerait toutes les `cooldown` secondes — un duel de 25 s finirait à
huit corps. Le marqueur `estClone` est lu à un seul endroit ; l'enlever
suffirait à ouvrir la récursion.

#### Équilibrage : de 40/48 à 23/48 par la seule recharge

Trois Shinobis complets contre un adversaire, c'est **40/48** sur les deux
camps — contre 23/48 de référence. Balayage de `special.cooldown`, deux camps :

| recharge | 9 s | 14 s | 20 s | **22 s** | 24 s | 26 s | 28 s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shinobi /48 | 40 | 28 | 29 | **23** | 20 | 19 | 19 |

**Retenu : 22 s**, pile sur la référence. Et le chiffre a un sens au-delà du
banc : avec `first: 5` et des duels de 20 à 30 s, il pose **un** clone, deux
dans un duel qui s'éternise. C'est ce qui garde le **2 contre 1** demandé au
lieu d'un 4 contre 1 — à 9 s l'arène portait trois Shinobis, trois jauges
d'ultime et trois lignes de stat, ce qui ne se lit plus.

#### Le roster se resserre, et le Pistolero remonte

Contrepartie inattendue, dans le bon sens : les 25 PV fixes retirent l'héritage
qui avait fait décrocher le Pistolero, et le camp à deux mord l'Hoplite.

| Matrice, 12 duels hors miroir | Avant | Après |
| --- | --- | --- |
| Hoplite | 11 | **9** |
| Ronin | 6 | 6 |
| Druide | 6 | 6 |
| Pistolero | **2** | **5** |
| Shinobi | 6 | **4** |

**Écart 2–11 → 4–9**, le plus resserré depuis longtemps. Le Shinobi paraît
dernier à la matrice alors que le banc des deux camps le donne à 23/48, soit la
médiane : c'est l'exagération connue de la matrice, qui ne joue chaque paire
qu'une fois. Seules les cinq lignes du Shinobi bougent.

### Un clone invoque des clones

**Demandé** : « un clone étant un personnage à part, peut invoquer un clone ».
Le garde-fou de la section précédente saute, et avec lui la dernière ligne de
traitement à part — `tickClone` tourne désormais sur tout ce que le module
pilote, sans savoir qui est l'original. Le marqueur `estClone` a disparu, il
n'avait plus de lecteur.

#### Ce qui borne la population, c'est la mortalité, pas une limite

Je m'attendais à devoir poser un plafond. **Mesure d'abord** : au réglage
retenu, les 48 duels du banc ne portent jamais plus de **quatre corps vivants**
en même temps, cinq créés dans le pire duel. Un clone naît à 25 PV contre 100
pour un vrai combattant : la chaîne s'arrête d'elle-même dès que les doubles
meurent plus vite qu'ils n'invoquent. Aucun plafond n'a été ajouté.

#### `first` prend la main sur `cooldown`

`first` est le délai avant la **première** invocation d'un combattant. Tant
qu'un clone ne pouvait pas invoquer, il ne concernait que l'original. Depuis la
récursion, **chaque nouveau-né attend `first` avant de poser le suivant** :
c'est donc lui, et non `cooldown`, qui fixe la pente de la chaîne. Balayés dans
cet ordre (référence : 23/48 sur les deux camps) :

| `first` | 5 s | 8 s | 10 s | 11 s | **12 s** | 16 s |
| --- | --- | --- | --- | --- | --- | --- |
| Shinobi /48 | 39 | 33 | 34 | 29 | **20** | 18 |
| corps vivants au pire | 5 | 5 | 4 | 4 | **4** | 3 |

Puis `cooldown`, `first` figé à 12 s : 12 s → 31, 16 → 26, **17 → 21**,
19 → 20, 22 → 20. Les trois derniers sont plats à un duel près — du bruit ;
17 s est le premier qui remonte franchement.

**Retenu : `first` 12 s, `cooldown` 17 s.** 21/48 contre 23 de référence.

**Le seuil entre 11 et 12 s est une falaise** (29 → 20), et c'est attendu :
c'est là que la chaîne bascule entre « les clones naissent plus vite qu'ils ne
meurent » et l'inverse. Un réglage posé juste à côté d'une falaise n'est pas
robuste ; celui-ci est du bon côté, sur le plateau.

#### Le HUD était calé sur un maximum qui n'existe plus

Les deux bandeaux étaient dimensionnés pour le pire cas connu à leur écriture :
cinq combattants en bataille royale, donc trois rangées de deux. La récursion
fait sauter cette borne — une colonne de camp peut porter quatre plaques, et
personne ne sait combien à l'avance. À quatre rangées, la ligne de stat du
dernier bloc tombait à l'ordonnée 1279 pour une scène qui en fait 1280, et le
bandeau de PV mordait sur le haut de casse du titre.

`pasDeRangee()` remplace le pas fixe par `Math.min(pas nominal, place
disponible / rangées)` : les dispositions déjà réglées — duel, 2 contre 2,
royale à cinq — retombent sur le pas d'origine **au pixel près**, et seules les
colonnes plus chargées se resserrent. C'est le `Math.min` qui le garantit, pas
une exception écrite à la main. Vérifié à l'écran en poussant volontairement le
pouvoir à onze doubles : illisible, mais rien ne déborde.

#### Le roster se rouvre, et c'est encore le Pistolero qui paie

| | Matrice (12 duels) | | Deux camps (48 duels) | |
| --- | --- | --- | --- | --- |
| | avant | après | avant | après |
| Hoplite | 9 | **11** | 35 | 34 |
| Druide | 6 | **7** | 21 | **27** |
| Ronin | 6 | **5** | 24 | 24 |
| Shinobi | 4 | 4 | 23 | **21** |
| Pistolero | 5 | **3** | 17 | **14** |

Écart de matrice **4–9 → 3–11**, deux camps **17–35 → 14–34**. Le mécanisme est
le même que celui déjà documenté deux fois : le canon asservi du Pistolero vide
son barillet sur des leurres, et il y en a plus qu'avant. C'est la **troisième
fois de suite** que ce pouvoir décide du classement d'un troisième combattant
sans que sa fiche ne bouge.

Non corrigé : le remonter demanderait de toucher **sa** fiche, ou de réduire le
nombre de clones — donc de reprendre d'une main ce que la demande donne.

### Un groupe, une plaque, une horloge

**Demandé, en deux points :** que les points de vie des Shinobi **se cumulent**
dans le bandeau du haut ; et que **le Shinobi et ses clones partagent la même
jauge de pouvoirs, qui s'activent en même temps**.

#### Le HUD lit le groupe, pas les corps

Les clones sont de vrais combattants du tableau, donc le bandeau en montrait un
par corps : trois plaques SHINOBI, trois jauges d'ultime, trois lignes de stat,
pour ce que le joueur lit comme **un** adversaire.

`grouper()` réunit les combattants par **(camp, fiche)** :

| | Avant | Après |
| --- | --- | --- |
| Plaque de PV | une par corps | **une par groupe**, `hp` cumulés |
| Barre | `hp / maxHp` du corps | somme des `hp` / somme des `maxHp`, **morts compris au dénominateur** |
| Bloc de pouvoirs | un par corps | un par groupe, lu chez son **chef** |

Le dénominateur compte les morts, et c'est délibéré : invoquer fait **monter**
la barre (40/100 → 65/125), perdre un double la fait **descendre** (65/125 →
40/125). C'est bien ce que le camp vaut à cet instant.

La règle ne change rien à qui n'a pas de double : dans un duel, un 2 contre 2 ou
une royale à cinq, chaque couple (camp, fiche) est unique et le regroupement
rend exactement la liste d'entrée.

#### Les horloges sont partagées PAR RÉFÉRENCE, pas synchronisées

C'est le point qui simplifie tout. Plutôt que de recopier des valeurs d'un corps
à l'autre à chaque pas — et de devoir se demander laquelle fait foi — le clone
reçoit **les objets eux-mêmes** :

```js
clone.ability = chef.ability;   // recharge de Tornade
clone.ult = chef.ult;           // charge d'ultime
f.state.horloge = deja.state.horloge;  // recharge de Clone d'ombre
```

Elles ne *peuvent* plus diverger, et le HUD n'a qu'une valeur à lire. C'est plus
fort que la version d'avant, qui donnait au clone la recharge courante de
l'original **à sa naissance** puis les laissait vivre séparément.

**Un seul membre avance les compteurs.** `update()` sort tout de suite si `f`
n'est pas le premier du groupe dans `game.fighters` : les décompter chez chacun
les ferait tourner N fois plus vite. Le chef avance, puis déclenche l'effet
**sur tout le monde à la fois** — c'est l'activation simultanée demandée.

Le chef n'est stocké nulle part : il se déduit à chaque pas (`groupe()[0]`),
donc l'original tant qu'il vit, puis le clone le plus ancien. Ça supprime tout
un état à tenir à jour — promotion à la mort du chef, nettoyage en fin de duel,
cas du chef hors du plateau.

Deux choses restent **propres à chaque corps**, et il fallait les repérer :

- **les rafales de Tornade** (`state.gusts`), qui sont du rendu : chacun porte
  et dessine les siennes. Les laisser au seul chef les figerait à l'écran chez
  les autres — d'où leur décompte **avant** le garde ;
- **`boost`**, le bonus de vitesse de l'ultime, que `Fighter.step` décompte par
  corps. Il est posé et éteint membre par membre.

#### Le nombre de corps baisse, la puissance monte

Contre-intuitif, et c'est le vrai enseignement du réglage. Avec une horloge
commune, le groupe invoque **en bloc** : la population double d'un coup au lieu
de croître en escalier, et comme le second doublement tombe après la fin du duel
(18 + 17 = 35 s), elle plafonne à **deux Shinobis** — moins qu'avec les horloges
séparées, qui en donnaient jusqu'à quatre.

Et pourtant le pouvoir est **plus fort** : 29/48 contre 21 avant, à réglage
inchangé. La cause n'est pas le nombre de corps, c'est la **jauge commune** —
`chargeOnHit` monte à chaque touche de *chaque* membre, donc l'ultime part
environ deux fois plus souvent, et il part sur tous les corps à la fois.

Balayage de `first`, deux camps, `cooldown` figé à 17 s (référence : 23/48) :

| `first` | 12 s | 14 s | 16 s | **18 s** | 19 s | 20 s | 22 s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shinobi /48 | 29 | 31 | 29 | **25** | 16 | 17 | 13 |

**Falaise entre 18 et 19 s** (25 → 16) : c'est là que la seconde entrée tombe
trop tard pour peser sur des duels de 20 à 30 s. **18 s est le dernier point du
plateau**, donc le réglage robuste ; se poser à 19 s serait se poser sur
l'arête. `cooldown` n'a pas rebougé : il ne décide plus que d'un doublement qui
n'arrive presque jamais.

#### Le roster, et encore le Pistolero

| | Matrice (12 duels) | | Deux camps (48) | |
| --- | --- | --- | --- | --- |
| | avant | après | avant | après |
| Hoplite | 11 | 11 | 34 | 35 |
| Shinobi | 4 | **8** | 21 | **25** |
| Ronin | 5 | 5 | 24 | **26** |
| Druide | 7 | **4** | 27 | **22** |
| Pistolero | 3 | **2** | 14 | **12** |

Écart de matrice 3–11 → **2–11**, deux camps 14–34 → **12–35**. Le Pistolero
paie une quatrième fois, par le même mécanisme : son canon asservi vide son
barillet sur des leurres, et deux Shinobis qui lâchent leur ultime ensemble le
saturent. Non corrigé — le remonter demanderait de toucher **sa** fiche, ou de
défaire ce que la demande donne.

---

## 🤠 PISTOLERO — `outlaw` (affiché « PISTOLERO »)

> Pistolero — vise, tire, recule, et affûte ses dégâts balle après balle.

Relevé sur *Outlaw vs Bladesman*, en 576 × 1024 : **toute mesure ci-dessous est
convertie ×1,25** vers le repère 720 × 1280 du jeu, et la valeur d'origine est
citée entre parenthèses.

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon 41 px (32), `#8a5934` — pipette (138,89,52), médiane érodée sur titre + bille + jauge | mesuré |
| Flash d'encaissement | `#e4e4e6` — mesuré aux images 223/224/225 : le disque touché blanchit **une image entière**, contour compris | mesuré |
| Chiffre de PV | crème `#f5f2ea` : le seul ton lisible sur le brun sombre | mesuré |
| Déplacement | 546 px/s. Calé à 455 (relevé 483 → 604 après conversion), sinon il traverse le cadre plus vite qu'il ne recharge ; **écart assumé, demandé** ensuite : ×1,2 → 546, toujours sous le 604 mesuré | mesuré + calé + demandé |
| **Arme** | *Revolver* — portée 122 px (pointe du canon à 97). **Seule arme du roster qui ne tourne pas** : `weapon.spin = 0`, et le module écrit `weaponAngle` à chaque image. Le relevé est explicite — « le canon est asservi à l'adversaire à chaque image, sans lissage » | mesuré |
| Sprite | 34 × 15 cellules ×2,5 : crosse brune côté bille, carcasse et barillet en acier bleuté-violine, puis un **canon fin** de 6 cellules sur 15. C'est le contraste corps épais / canon fin qui identifie l'arme | mesuré |
| Corps à corps | pile courante en PV, toutes les **3 s** — le verrou le plus long du roster, parce que le canon est **toujours** aligné. À 1,5 s le pistolero gagnait 27 duels sur 27 | calé |
| **Barillet** | 6 coups, ~0,6 s entre deux (≈ 18 images à 30 fps), puis un rechargement de 1,4 s — le trou observé entre `0/6` et `6/6` | mesuré + calé |
| **Recul** | 119 px/s par coup (95), **988 px/s (790) sous LEAD HAIL**. C'est lui qui produit le pic de 1 380 px/s relevé à l'image 1011 : chaque coup de la rafale le propulse violemment | mesuré |
| **Dispersion** | ±0,75 rad. **Déduite d'une mesure** : la vidéo montre 25 paliers de +0,10 en 38,6 s pour ~50 tirs, soit une balle sur deux et **0,65 coup/s**. Sans dispersion, une visée réécrite à chaque image touche toujours — le banc donnait 1,30 coup/s, exactement le double | déduit |
| Ultime | *Main du mort* (`DEAD MAN’S HAND`, anciennement *Pluie de plomb* / `LEAD HAIL`, renommé sur demande) — horloge **pure** de 7,0 s (charge de 1,13 px/image sur 238 px utiles), effet 6,2 s (vidage à 1,28 px/image) : cadence doublée, +22 % de vitesse, recul ×8,3 | mesuré |
| Rendu de l'ultime | la vidéo fait virer **toute l'arène** au crème `#FDF7ED`. Ici le décor ne bouge jamais : la lumière se pose **au sol, sous le pistolero** | écart assumé |
| Projectile | *Balle* — `outlawShot` 9 × 3 ×3,2, 720 px/s, dégâts = la pile courante. Sillage **pâle** de 2 px, (213,182,153) à (236,206,177) : les cinq taches alignées de l'image 224 sont ce sillage en tirets, pas cinq projectiles | mesuré + calé |
| HUD | `Damage: 3.00 → 5.50` (+0,10 **au coup au but**, pas au coup tiré) et `Ammo: n/6` | mesuré |

---

### Cadence divisée par deux, barillet de 6 à 10 — et le retour arrière sur les dégâts

**Deux demandes successives, dont la première a été défaite.** Un premier essai
multipliait sa production par 1,5 en gonflant tous ses dégâts (pile ×1,78,
éclats de givre 2 → 3, tic du Champ de givre 1 → 1,5). Il a été **entièrement
défait à la valeur près** : ses dégâts sont revenus à leur relevé. Le levier
retenu est la **cadence**.

**Le barillet ne change presque rien au DPS.** 6 → 10 balles : 4,222 → 4,199
PV/s contre le Mannequin, soit rien du tout. Le calcul le confirme — à 0,6 s
entre deux tirs et 0,7 s de rechargement, un cycle de six balles dure 4,3 s
(1,40 tir/s) et un cycle de dix en dure 6,7 (1,49 tir/s) : **+6 % de cadence**,
noyés dans sa dispersion. Il fallait le mesurer seul, sinon on aurait cumulé
deux hausses en croyant n'en faire qu'une.

C'est un **écart assumé au relevé** : la vidéo montre « Ammo: n/6 », et le nom
même de l'arme (`Six-Shooter`) le dit. Le HUD écrivait « /6 » en dur à deux
endroits — il lit désormais `ability.magazine`, sans quoi il aurait menti.

**Le vrai levier est le délai entre deux tirs** : `ability.cooldown` 0,6 → 0,3 s,
autre écart assumé (mesuré à ~18 images entre deux décréments d'`Ammo` à 30 fps).
Et **les deux réglages se répondent enfin** : à 0,3 s entre deux tirs, un
chargeur de six se viderait en 1,8 s et il passerait son duel à recharger. C'est
la cadence qui rend le barillet utile, pas l'inverse.

| Mesure sur 20 duels contre le Mannequin | Avant | Après |
| --- | --- | --- |
| Production | 3,752 PV/s | **5,074 PV/s** |
| Rapport | — | **×1,35** |
| Temps pour tuer 200 PV | 53,3 s | 39,4 s |

Moins que le doublement de la cadence, parce que sa dispersion lui fait manquer
une balle sur deux et que ni le Champ de givre ni les éclats ne suivent le
rythme du barillet.

**Ce que l'essai abandonné a appris, et qui reste vrai.** En montant tous ses
dégâts à ×1,5, le DPS n'était monté que de ×1,377 — à cause d'une **boucle de
rétroaction** : ses dégâts croissent avec sa pile, donc un duel plus court lui
laisse moins de temps pour monter en puissance. Il avait fallu ×1,78 sur les
dégâts pour obtenir ×1,48 sur le DPS, et le levier saturait visiblement (sur la
fin, +1,7 % de dégâts ne rendaient que +0,4 % de DPS). **La cadence n'a pas ce
défaut** : elle ne dépend pas de la durée du duel.

**Conséquence d'équilibrage.** Il passe de **20 victoires sur 60** — le dernier
du roster — à **105 sur 120**, et de 12 à 17 sur la matrice officielle. C'est
moins que les 117/120 qu'avait produits la voie des dégâts, mais il domine
toujours. Le constat de fond ne change pas : **il ne manquait à ce personnage
que du rythme, pas de la survie** — il ne mourait pas, il n'arrivait pas à
conclure. L'écart du roster passe de 8-14 à **8-17**, assumé et non corrigé.

### Le recul de tir : direction corrigée, force laissée telle quelle

**Signalé** : « chaque tir a un petit effet de recul léger dans le sens inverse
du tir, j'ai l'impression que le personnage se propulse vers l'adversaire ».

Trois mesures ont été nécessaires, dont **deux lectures fausses**, et elles
valent d'être gardées.

1. **Mesurer à l'image du tir ne dit rien.** `Match` appelle `Fighter.step()`
   **avant** `mod.update()` : le déplacement de cette image-là est déjà intégré,
   et le recul n'agit qu'à la suivante. Mesuré au mauvais endroit, il semblait
   pousser le Pistolero **vers** sa cible — ce qui aurait « confirmé » le
   symptôme et envoyé chercher un bug de signe qui n'existe pas.
2. **À la bonne image, il pousse vers l'arrière, et fort** : **+415 px/s**
   projetés sur l'axe opposé à la cible, et il recule effectivement après
   **70 %** de ses tirs. Le code était juste.
3. **Mais sur un cycle de tir complet, il ne rapporte que +2 px de distance** —
   et toujours +2 à ±8 px qu'on le règle à 200, 300 ou 420, ou qu'on ajoute un
   arrêt franc de 0,18 s après le coup. C'est le mur déjà rencontré sur le Tir
   enraciné du Druide : `Fighter.step` calcule `v = cap × vitesse + impulsion`,
   donc l'impulsion se retranche d'un pilotage qui, lui, ne s'arrête jamais.
   **L'ampleur du recul est un levier plat.**

**Ce qui se réglait, c'était la direction.** Le recul suivait `angle`, la
trajectoire réelle de la balle — dispersion comprise, et `spread` vaut 0,75 rad,
soit **±43°**. Il le poussait donc de côté aussi souvent que vers l'arrière : ça
bouscule (le commentaire d'origine l'assumait, « le déplacement erratique de la
vidéo ») mais ça ne **se lit** pas comme un recul de tir.

Appliqué sur `aim`, chaque coup le repousse franchement dans le dos de sa cible.
La balle garde toute sa dispersion : c'est elle qui porte la précision relevée
(0,60 coup/s), et elle n'est pas touchée.

**Effet mesuré** : le recul passe de +392 à **+438 px/s** sur l'axe opposé, et
surtout il devient **cohérent d'un tir à l'autre**. Son DPS ne bouge quasiment
pas (6,3 → 6,1 PV/s) et il passe de 17 à 16 sur la matrice.

**Ce qui reste vrai et n'a pas été corrigé** : sur la durée, il ne s'éloigne
pas — son pilotage referme la distance dans le même cycle, et le banc dit que
ni la force du recul ni un temps d'arrêt n'y changent rien. Il *tient sa
distance*, il ne fuit pas.

### Son propre jeu de bruitages — le premier du roster

Demandé : « pour chaque personnage, je veux des bruits associés », en
commençant par lui. Le banc de `data/sound.js` avait été écrit en **matières
partagées**, ce qui était le bon départ (une recette par matière, la fiche
l'attribue) mais laissait le roster se ressembler : quatre combattants sur
`blade`, cinq sur `riser`, et le Pistolero **cinq créneaux sur sept** empruntés
— dont son rechargement, qui jouait littéralement `click`, le son des boutons
de l'interface. Seule la transposition (`pitch`) les séparait.

| Créneau | Avant | Après | Pourquoi |
| --- | --- | --- | --- |
| `shot` | `gunshot` (2 couches) | `gunshot` **enrichi** (4) | il manquait le **claquement** — un coup de feu s'identifie à son transitoire, pas à son grave — et la **queue** en retard de 55 ms, le renvoi de la rue déserte |
| `hit` | `blade` | `pistolwhip` | c'est la lame du Ronin qu'il empruntait ; le Peacemaker frappe **de la crosse** : même matière deux fois plus bas, sans queue métallique |
| `impact` | `impact` | `frostbite` | sa balle **gèle** (`onHit.slow`, −30 % pendant 1,6 s) : seule recette du banc dont le corps **monte** (1760 → 2640 Hz), parce que le gel continue après le choc |
| `ability` | `click` | `cylinder` | le rechargement dure **0,7 s** et le pistolet vrille pendant tout ce temps ; trois crans, la roue, le verrou — là où le clic d'interface tenait 45 ms |
| `special` | `frost` (2) | `frost` **enrichi** (4) | le Champ de givre part en **onde de 40 à 900 px** avant de se poser : le son ne disait que le disque. Les deux couches ajoutées sont l'onde, un balayage qui **s'ouvre** de 600 à 7000 Hz |
| `ultimate` | `riser` | `knell` | `riser` dit « quelque chose arrive » à cinq combattants, jamais *quoi*. MAIN DU MORT est un duel à midi : **une cloche** (311/622 Hz, accordées à l'octave pour sonner comme *une* cloche), le battant sur le bronze, puis la tension et le vent en retard de 120 ms |

`bounce` reste sur `thud`, partagé par tout le monde : c'est un corps contre un
mur, pas une signature.

**Ce que ça a coûté ailleurs, et qui ne criait pas.** Une voix de
`MIX.maxVoices` est une **couche**, pas un bruitage, et `play()` refuse le son
entier quand le plafond est atteint : ces couches en plus se paient donc sur
**les autres sons**. Mesuré sur quinze duels, en rejouant l'algorithme de
`play()` sur l'horloge du duel : **0 % de sons perdus avant, 2,3 % après** — des
rechargements et des impacts, exactement ce qu'on venait d'écrire. Le plafond
est passé de 14 à **20**, où il ne reste que 0,4 %, et ce qui saute encore n'est
plus que `thud`. Le détail, et le piège de mesure qui a d'abord annoncé 90 % de
pertes, sont dans `docs/PIEGES.md`, section « Le son ».

**Les six autres ont suivi**, et le prix attendu n'est pas venu : voir « Le son
de chacun », plus bas — le plafond n'a pas bougé, et il passe même *plus* de
sons qu'avant.

## ⚔ RONIN — `bladesman` (affiché « RONIN »)

> Duelliste — sa lame accélère jusqu'à la surchauffe, puis fond sur sa cible.

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon 41 px (32), `#dcc462` — pipette (220,196,98) | mesuré |
| Chiffre de PV | encre sombre `#2a2007`. **Écart assumé** : la vidéo l'écrit en crème avec un contour, ce moteur ne pose aucun contour et le crème sur l'or clair est illisible | écart assumé |
| Déplacement | 560 px/s (relevé 605 → 756 après conversion) — le plus rapide du roster, ce que dit le relevé, sans aller jusqu'aux 756 qu'une lame de 152 px rendrait intenable | mesuré + calé |
| **Arme** | *Sabre dentelé* — portée 152 px : garde à 45–56 (36–45), lame à 56–152 (45–122). La portée **découle** du sprite, jamais écrite en dur | mesuré |
| Sprite | 40 × 16 cellules ×2,68. Garde **orange vif** (232,160,40), petite croix trapue. Lame **asymétrique** — bande gris-brun sur l'arête haute, corps ivoire en bas — et **fuselée** : une lame à côtés parallèles donne un bout carré que le relevé n'a pas. Les deux arêtes sont dentées, d'où l'aspect scie | mesuré |
| **Rotation** | plancher **0,80** tour/s, plafond **3,00**, jamais franchis. Montée passive **+0,21/s**, sauts discrets de **+0,15** — un par coup porté. Au plafond : palier d'environ **1,8 s** (55 images), puis effondrement à **−3,0/s** jusqu'au plancher, et le cycle repart. Quatre cycles visibles : plafonds aux images 231, 441, 681, 951 | mesuré |
| Ce qui déclenche l'effondrement | **non identifiable sur la vidéo** : il ne coïncide ni avec BLADE RUSH, ni avec LEAD HAIL. Le modèle de surchauffe après palier reproduit exactement la courbe — c'est un `calé`, pas un `mesuré` | calé |
| Corps à corps | `Damage = 2,00 × Spin Speed`, **exact et sans exception**, soit 2 à 6 PV — le multiplicateur mesuré ; **divisé par deux en jeu, demandé** (`1,00 × Spin Speed`, soit 1 à 3 PV), voir « Les dégâts de tous les combattants, divisés par deux ». Verrou de 1 000 ms entre deux touches. **Ajout demandé** : brûlure d'un tic à l'impact — voir « Brûlure et Aura de braise » | mesuré + demandé |
| Ultime | *Ruée de lame* (`BLADE RUSH`) — horloge de 9 s **+ 6 % par coup porté** : les cycles relevés font 273, 214 et 333 images, donc pas une simple horloge. Ruée de 1,5 s minutée, vitesse ×1,55 (939 px/s contre 605), verrou de touche à **115 ms** | mesuré |
| Deux régimes de la ruée | **loin**, cap asservi sur l'adversaire à pleine vitesse ; **à portée** (120 px), la lame **orbite**. Foncer droit dessus traverse la zone utile en une centaine de millisecondes — au banc d'origine la lame n'y restait que 57 % de la ruée pour un seul coup porté | mesuré + calé |
| **Éventail vert** | `#B1C404` à 55 % — mesuré image 643 : le cœur rend (211,219,109) sur l'arène crème. Ouverture bornée **en angle** : 1,6 rad en régime normal, 3,0 rad pendant la ruée, où il vire au vert fluo. L'aire verte passe de ~3 500 px² à 18 488 px² au pic, un facteur 5,3 : l'éventail **s'ouvre**, il ne fait pas que changer de teinte | mesuré |
| Rendu de l'éventail | en régime normal c'est le **ruban de pointe d'arme** (`look.flair.ribbon`), qui est exactement le secteur balayé par la lame ; le surcroît d'ouverture de la ruée est un secteur plein tracé par le module | — |
| Projectile | aucun — tout passe par la lame | mesuré |
| HUD | `Spin Speed: 0.80 → 3.00` et `Damage: 1.6 → 6.0`, ce dernier **jamais stocké** : il est dérivé de la pile à l'affichage, deux valeurs séparées finissant toujours par diverger | mesuré |

### Reskin — lame de braise

**Réactivé et redessiné, à la demande.** Le Ronin était gelé ; il est
réactivé, entre le Pistolero et l’Hoplite (queue de
`ROSTER`, comme l'exige `tools/matrix.mjs`). Trois écarts assumés au relevé,
tous purement visuels — aucune valeur `mesuré`, `calé` ou `déduit` de gameplay
n'a bougé :

| Ce qui change | Détail | Source |
| --- | --- | --- |
| Corps | `#dcc462` (or clair) → `#e8621b` (orange de braise) | écart assumé |
| Aura passive | `rgba(172,226,22,0.42)` (vert-jaune) → `rgba(255,69,0,0.45)` (rouge flamme) | écart assumé |
| Arme | *Sabre dentelé* → *Lame de braise* (`Ember Blade`), transcrite d'une maquette fournie — garde ailée sombre à gemme rouge, lame en flamme continue. `BLADESMAN_FLAMEBLADE` dans `pixelmaps.js`, méthode identique à `LANCER_SPEAR` (réduction par blocs, quantification, pas un dessin reconstruit) | maquette |

**La portée ne bougeait pas, à ce stade.** `head.scale` est recalculé pour le
nouveau sprite (96 cellules contre 40) afin que `handle.length + sprite ×
scale` retombe exactement sur les 152 px relevés — un reskin ne change pas la
hitbox. (Elle bouge en revanche à la vague suivante, où l'agrandissement de la
lame *est* la demande — voir « Lame agrandie, cendres et bas d'écran orange ».)

**L'éventail vert de BLADE RUSH n'a pas été touché.** Il reste `#B1C404`,
mesuré image 643 : c'est un effet vidéo, pas une couleur de thème, et rien
dans la demande ne portait dessus. Le combattant affiche donc un corps et une
aura en rouge-orangé avec un swing d'ultime resté vert — assumé, pas oublié.

**Bilan de matrice, au moment du reskin.** Rejoindre le roster jouable fait
passer `tools/matrix.mjs` de 3 à 6 affrontements (3 combattants, paires
`i ≤ j`, 3 seeds — 18 duels). Le Ronin perdait alors ses six duels contre le Pistolero et l’Hoplite (0/6) — le relevé de sa fiche d'origine (9/30 dans
l'historique à onze combattants), inchangé par ce reskin purement visuel.
Aucun paramètre `calé` n'avait été retouché pour le remonter : ce n'était pas
demandé, et le toucher aurait signifié s'écarter du relevé sans nouvelle
mesure. **Ce qui suit — brûlure au contact et Aura de braise — est un ajout
ultérieur, distinct du reskin, qui touche cette fois au gameplay : voir
« Brûlure et Aura de braise » ci-dessous.**

### Brûlure et Aura de braise

**Deux ajouts demandés, après le reskin — cette fois du gameplay, pas
seulement du visuel.** Contrairement au reskin ci-dessus, dont le bilan de
matrice était resté à l'identique, ces deux-là déplacent la matrice — c'est
attendu et documenté, pas une dérive.

| Ajout | Détail | Source |
| --- | --- | --- |
| Brûlure au contact | `weapon.melee.onHit.dot` — chaque coup de lame marque la cible d'un tic de brûlure, `Math.max(1, round(Spin Speed))` à l'ajout, **divisé par deux en jeu depuis** (`Math.max(0.5, round(Spin Speed × 0,5))`), sur 1 s | demandé, calé |
| Aura de braise | pouvoir **greffé** en troisième créneau (`special.infernalRage`), même patron que le Champ de givre et le Dôme de drain — voir la section suivante | demandé |
| Aura et sillage | `look.aura` et `look.trail` passent du vert-jaune/or terne aux teintes exactes de l'aura du Feu (`#f97316`) | écart assumé |

**La brûlure est le vrai levier, l’Aura de braise presque pas.** Premier
essai à 2 s de durée (deux tics par coup porté) : Ronin balayait les
deux autres actifs, 5/6 contre 0/6 avant l'ajout — la brûlure s'additionnait à
des dégâts au contact déjà mesurés (`Damage = 2 × Spin`) sans que sa cadence de
touche n'ait bougé. Isoler l’Aura de braise seule (brûlure quasi neutralisée,
`duration: 0.01`) reproduisait quasi exactement la matrice d'avant l'ajout —
la preuve que l'aura de l’Aura de braise (`tickDamage: 1` toutes les 0,6 s)
ne pesait presque rien à côté. Ramener la brûlure à **1 s (un seul tic)**
donne 2/6 : Ronin gagne un vrai avantage sur son relevé d'origine, sans
en devenir le plus fort du roster réduit.

**L’Aura de braise n'utilise ni `f.boost` ni `f.boostFactor`.** BLADE RUSH
s'en sert déjà pour son propre sprint (vitesse ×1,55 pendant la ruée) ; lui
faire partager le même compteur générique aurait fait qu'une ruée qui se
termine coupe une Aura de braise encore active, ou l'inverse. Les deux
horloges (`f.ult.active` et `f.state.spec`) tournent donc indépendamment, et
peuvent être actives en même temps — l'aura brûlante se dessine alors
**avant** l'éventail de BLADE RUSH dans `drawUnder`, comme la lumière de HIGH
NOON passe par-dessus le champ de givre du Champ de givre chez le Pistolero.

**Relevé de matrice, après ces deux ajouts :** le Ronin perd toujours 0/3
contre le Pistolero (le duel par défaut reste donc à l'image de son relevé
d'origine), mais gagne 2/3 contre l’Hoplite — soit **2/6**, contre 0/6 avant.
`tools/matrix-reference.txt` a été régénérée ; seules les quatre lignes qui
impliquent le Ronin ont bougé.

### Lame agrandie, cendres et bas d'écran orange

**Quatrième vague, demandée.** Trois ajouts sur le Ronin, un sur le Pistolero (vitesse, voir sa fiche plus haut) :

| Ajout | Détail | Source |
| --- | --- | --- |
| Lame ×1,3 | `weapon.reach` 152 → 197,6 ; `handle.length` 45 → 58,5 ; `head.scale` 1,114583 → 1,448958 ; `hitbox.radius` 17 → 22,1. Les quatre bougent dans la même proportion : la pointe dessinée retombe exactement sur la nouvelle portée (invariant 5), ce n'est pas un agrandissement visuel seul | demandé, calé |
| Cendres sur l'arme | `look.flair.weaponArc` (absent jusqu'ici), en mode `powder` — grains gris (`glow: '#3a332c'`) et braises ponctuelles (`core: '#fbbf24'`) le long de la lame, `jitter: 30` pour dépasser la demi-épaisseur du sprite agrandi (≈25,4 px) | demandé, écart assumé |
| Cendres en traînée | `look.flair.smear` (absent jusqu'ici) : Ronin n'avait aucun fuseau de vitesse ; il en gagne un en cendre, distinct du ruban de lame (orange) | demandé, écart assumé |
| Bas d'écran orange | `ultimate.barFill` (or `#dcc462` → orange `#f97316`), `special.barFill` (rouge `#dc2626` → orange sombre `#ea580c`), `hud.color` (or sombre `#a8912f` → orange `#f97316`) | écart assumé, demandé |

Les deux effets de cendre passent par `render/flair.js` (`weaponArc.powder`,
`smear.powder`, même mécanisme que le givre du Pistolero) : purement
décoratifs, aucun tirage dans `game.rng`, ne peuvent rien changer au duel.
L'agrandissement de la lame, en revanche, est un vrai changement de gameplay :
une lame plus longue touche de plus loin.

**Relevé de matrice, après l'agrandissement de la lame et la vitesse de
Pistolero :** le total du Ronin reste **2/6**, mais la répartition
s'inverse — il gagne désormais 1/3 contre le Pistolero (contre 0/3 avant) et
seulement 1/3 contre l’Hoplite (contre 2/3 avant). Hoplite, déjà l'écart le
plus marqué du roster réduit, monte de 4/6 à 5/6 ; le Pistolero descend de
3/6 à 2/6 contre le Ronin mais reste imbattu en mirroir et contre l’Hoplite. `tools/matrix-reference.txt` a été régénérée en conséquence.

### Manche : du rectangle au PNG

**Trois passages avant d'aboutir, chacun corrigeant le précédent.**

| Passage | Approche | Ce qui clochait |
| --- | --- | --- |
| 1 | Rectangle plein (`handle.width: 9`), tons de la garde | Comblait le vide (17,5 px entre le bord de bille et le sprite) mais ne rendait aucun motif : la maquette montre une manche tressée noire à pommeau doré et gemme rouge |
| 2 | Manche dessinée en pixel-art texte, 40 colonnes ajoutées devant la garde dans `BLADESMAN_FLAMEBLADE` (`w: 96 → 136`) | Motif d'abord en bandes diagonales — un tressage plausible mais **pas** celui de la maquette, qui est un **chevron** (chaque bande forme un « V » vers le pommeau). Corrigé une fois (`u = colonne + 0,9 × \|ligne − centre\|`, replié en chevron), mais restait une **modélisation** — demande explicite : « il ne faut pas modéliser l'arme » |
| 3 | **PNG réel**, recadré directement dans la maquette | Retenu |

**Le troisième passage remplace tout le sprite, pas seulement la manche.**
Un sprite ne peut avoir qu'une seule source (texte *ou* image, jamais les
deux mélangées), et la maquette montre l'arme entière — lame, garde, manche,
pommeau — comme un seul dessin. `weapon.head.sprite` de `bladesman` est donc
servi par `assets/sprites/bladesman-flameblade.png`, un recadrage direct de
la maquette (composante connexe la plus grande de l'image, pour exclure les
braises détachées du fond ; fond rendu transparent ; rotation pour que la
pointe regarde vers la droite, la convention du dépôt), déclaré dans
`assets/sprites/manifest.json`. `BLADESMAN_FLAMEBLADE` (`pixelmaps.js`) reste
en place comme **repli automatique** si le PNG venait à manquer — le
mécanisme existait déjà dans `render/sprites.js`, aucune arme ne s'en servait
jusqu'ici.

**Écart assumé à l'invariant « aucun binaire dans le dépôt ».** C'est le
premier — et seul — sprite du roster à en sortir. Demandé explicitement,
documenté dans `CLAUDE.md`.

**Le pommeau à gemme est maintenant dans l'image, mais reste en grande
partie derrière la bille.** Rayon de bille 41 ; le PNG est dessiné de
`handle.length` (18,71) à `reach` (197,6), donc son extrémité pommeau
(la plus proche du pivot) est hors champ jusqu'à x = 41 — environ 22 px de
l'image sur 179 dessinés, soit la manche jusqu'à un peu avant la bague
dorée. C'est le pommeau doré à gemme lui-même qui ne dépasse jamais ; la
manche tressée, elle, se voit sur une longueur un peu plus généreuse
qu'avec les deux passages précédents, sans qu'aucun réglage ne l'ait visé
— c'est la conséquence directe d'utiliser l'image entière plutôt qu'un
segment découpé à la main.

**`handle.length` recalé, `reach` et la hitbox inchangés.** `head.scale`
fixe toujours la hauteur dessinée (`35 × scale`, `35` venant du repli texte) ;
la largeur dessinée suit le **ratio réel du fichier PNG** (486 × 140, mesuré
sur le fichier final) plutôt que celui du pixel-art texte. `handle.length`
est recalé pour que largeur dessinée + `handle.length` retombe exactement sur
197,6 — la pointe ne ment toujours pas sur la hitbox (invariant 5). Purement
visuel : `reach`, `hitbox` et toutes les valeurs de gameplay sont inchangées,
`tools/matrix.mjs` rend une matrice identique au caractère près.

### Lame regrandie, manche par-dessus la bille, roue de flamme

**Trois demandes supplémentaires, toutes en écart visuel assumé — aucune ne
touche `reach`, la hitbox ou une valeur de dégâts.**

**Lame ×1,3 de plus.** `head.scale` repasse ×1,3 (1,448958 → 1,8836454, le
même facteur que le premier agrandissement). `handle.length` est recalé avec
le ratio exact du PNG (486 × 140) pour que la largeur dessinée retombe sur
`reach` (197,6, inchangé) : il devient négatif (−31,26). Au-delà de la valeur
qui posait le pommeau pile au centre de la bille (0), grandir encore ne peut
que le faire déborder **derrière** le pivot — jamais au-delà du bord de la
bille (rayon 41 > 31,26), donc le pommeau reste sur la silhouette de la
bille, il ne la transperce pas.

**`weapon.overBody: true` — même drapeau que l’Hoplite.** La manche, jusque
là en grande partie masquée par la bille (`Fighter.draw()` peint l'arme
**avant** le corps par défaut), passe désormais par-dessus : bille, contour,
anneaux d'état et chiffre de PV compris, comme documenté dans `fighter.js`
pour l’Hoplite. C'est ce qui rend le `handle.length` négatif ci-dessus sans
conséquence : la portion qui déborde derrière le pivot se voit maintenant
**sur** la bille au lieu d'être coupée par elle. Purement visuel — ni
`bladeSegment()` ni la hitbox ne lisent ce drapeau, seul l'ordre de dessin
en dépend.

**Roue de flamme au déclenchement de BLADE RUSH.** Remplace l'anneau plein
(`game.fx.ring`) par un sprite pixel-art dédié, `BLADESMAN_FLAMEWHEEL`
(`pixelmaps.js`, 48 × 48) : un moyeu à rayons et gemme centrale, cerné de
treize langues de flamme irrégulières et de grains de cendre. **Conçu, pas
transcrit** — il n'y a pas de maquette pour cet effet, contrairement à
l'arme — mais dessiné sur la même grille de pixels que le reste du roster.
L'irrégularité des langues vient d'une graine fixe au moment de la
conception (treize angles, longueurs et largeurs tirés une fois), pas d'un
tirage en jeu : la carte ne change jamais, seules l'échelle et l'opacité
l'animent (`abilities/bladesman.js`, `_drawRushWheel`) — 0,5 s, montée
franche puis fondu.

Les cendres qui l'accompagnent (`_spawnRushAsh`) sont posées via
`game.viewRng`, jamais `game.rng` : `Effects.burst()` aurait tiré dans le
flux de simulation (voir sa note dans `render/effects.js`, un piège déjà payé
sur le Champ de givre) — `_spawnRushAsh` appelle `game.fx.spawn()` directement avec
des valeurs déjà tirées côté rendu, donc rien n'est consommé côté simulation.

Purement décoratif : `render/flair.js` et ce nouvel effet passent tous deux
par `viewRng`, `tools/matrix.mjs` rend une matrice identique au caractère
près.

### Chiffre de PV au-dessus de la manche

**La manche, désormais par-dessus la bille (`overBody`), recouvrait le
chiffre de PV — resté, lui, sur l'ordre de dessin par défaut (avant l'arme).**
Le chiffre disparaissait sous elle, en plus d'être sombre (`#2a0e05`) sur une
manche elle-même sombre — noir sur noir, illisible dans les deux cas à la
fois.

**Nouveau drapeau `look.hpOverWeapon`, opt-in.** `fighter.js` (`draw()`) pose
le chiffre de PV **après** l'arme quand ce drapeau est vrai, au lieu
d'avant — l'ordre par défaut, gardé pour les dix autres combattants. L’Hoplite (qui a aussi `overBody`) ne le porte pas : sa lance ne recouvre le
centre qu'en charge, et `CLAUDE.md` documente déjà ce compromis comme voulu ;
le poser sur les onze aurait défait un choix qui n'était pas remis en cause.

**`hpColor` revient au crème mesuré (`#f5f2ea`).** Il avait été assombri
uniquement parce que la manche était alors masquée par la bille et que le
chiffre se lisait sur l'orange du corps — un crème mesuré s'y noyait. Avec
`overBody`, c'est l'inverse : le chiffre se lit maintenant sur la manche,
sombre, donc c'est le crème mesuré qui redevient le bon choix.

Purement visuel — aucune valeur de gameplay ne bouge, matrice inchangée.

### Jauges d'ultime et de pouvoir spécial, même couleur

**Demandé pour les trois combattants qui portent les deux jauges** (Pistolero,
Ronin, Hoplite) : la jauge d'ultime (la première) reprend désormais
exactement la couleur de la jauge de pouvoir spécial (la seconde) juste en
dessous.

| Combattant | Jauge d'ultime | Couleur reprise de |
| --- | --- | --- |
| Pistolero | DEAD MAN’S HAND : `#3f97c9` → `#3fbde0` / texte `#fdf7ed` → `#f2fdff` | Champ de givre |
| Ronin | BLADE RUSH : `#f97316` → `#ea580c` / texte `#2a0e05` → `#fff1f0` | Aura de braise |
| Hoplite | BOND : `#5d3d8e` → `#7c3aed` / texte `#ffffff` → `#f3e8ff` | Dôme de drain |

**Taille et police l'étaient déjà.** `HUD.special` (`tuning.js`) recopie
`HUD.bar` à l'ordonnée près, et les deux passent par la **même fonction**
(`drawGauge` dans `render/hud.js`) : seule la couleur restait propre à
chaque jauge, par choix — pour qu'on les distingue au premier coup d'œil.
C'est ce choix qui est renversé ici, sur demande explicite.

Purement visuel — aucune valeur de gameplay ne bouge, matrice inchangée.

---

## 🐲 HOPLITE — `lancer` (affiché « HOPLITE »)

### Le Pistolero passe au type glace

| Ce qui change | Détail |
| --- | --- |
| Arme et munitions | même dessin, **teinte de glace** : chaque couleur des deux cartes est convertie à teinte fixe (~199°) en **conservant sa luminosité**, qui porte tout le modelé. Le revolver reste celui de la maquette, seule sa gamme bouge |
| Bille et chrome | `#3f97c9`, un bleu **moyen** et non pâle : le chiffre de PV est crème (mesuré), et un bleu clair le noierait — c'est la leçon du cuivre clair de l’Hoplite, qui avait forcé son chiffre en brun sombre |
| Gel à la touche | `onHit.slow: 0.30` pendant 1,6 s. Le moteur savait déjà le faire : `Match.damage` lit `slow`/`slowDuration` et appelle `Fighter.applySlow`, comme pour l'Ombre et la Glace. `slowFactor` retient le **pire** ralentissement actif et le plafonne à 0,75, donc deux balles coup sur coup prolongent au lieu de s'empiler |
| Rechargement | le pistolet **reste où il est** et fait **un tour complet sur lui-même**, en sens antihoraire, sur les 1,4 s de recharge. L'angle est calculé depuis l'avancement et non incrémenté image par image : une accumulation dériverait et le tour ne se refermerait pas exactement sur zéro |
| Tir | **déjà linéaire, déjà détruit au contact et au mur** — rien à écrire. `projectiles.js` intègre `vx`/`vy` sans pilotage, `bounces: 0` tue la balle au mur, et le contact d'un combattant la tue aussi |

**Ce que le tour de rechargement coûte, et ce n'est pas le gel.** Pistolero
passe de 15 à **9 victoires sur 30**. Pendant 1,4 s l'arme n'est plus asservie à
la cible, or le bout du canon porte la hitbox de mêlée (`hitbox.from: 0,62`) :
il balaie au lieu de pointer, et perd ses touches de contact sur toute la
recharge. Cinq affrontements ont basculé, aucun dans l'autre sens — le
ralentissement ne compense pas. C'est le coût assumé d'un effet demandé ; les
leviers pour le rattraper sont `onHit.slow` et `ability.reload`.

#### Vriller n'est pas orbiter

![Le rechargement du Pistolero](capture-recharge.png)

*Trois instants d'un même rechargement. Le revolver garde sa place par rapport
à la bille — qui traverse pourtant l'arène de x = 162 à x = 509 — et seule son
orientation propre change : −64°, −163°, −261°.*

Le moteur porte maintenant **deux** rotations d'arme, et les confondre donne
deux animations très différentes :

| | `weaponAngle` | `weaponTwirl` |
| --- | --- | --- |
| Ce que c'est | la direction dans laquelle l'arme **pointe depuis le corps** | la rotation **propre** de l'arme, autour du milieu de sa carte |
| Ce que ça donne en tournant | l'arme **orbite** autour de la bille, comme une aiguille d'horloge | l'arme **vrille sur place** |
| Qui l'écrit | `Fighter.step` (rotation de fiche), ou un module pour une arme braquée | un module seulement |

La première version du tour de rechargement utilisait `weaponAngle` : ce
n'était pas un pistolet qu'on recharge, c'était un pistolet qu'on fait
tournoyer au bout d'un bras. `weaponTwirl` est un compteur générique de plus —
le module l'écrit, `drawWeapon()` et `bladeSegment()` s'en servent, le moteur
ne sait pas pourquoi, et à zéro les dix autres combattants ne changent pas.

**Le centre de vrille est déduit, pas mesuré.** La règle du dépôt veut que
`handle.length + carte dessinée = reach` ; le milieu de la carte tombe donc à
`(handle.length + reach) / 2`, soit 79,5 px pour le revolver. `bladeSegment()`
le calcule ainsi sans jamais lire `PIXEL_MAPS` — et si la somme cessait un jour
de retomber sur la portée, le centre serait faux **en même temps** que la
pointe, donc l'erreur resterait cohérente.

**La hitbox vrille avec le sprite**, sinon le dessin mentirait sur l'endroit où
l'arme porte — même discipline que `weaponLateral`. Conséquence de jeu : le
canon balaie désormais un petit cercle de 42,5 px autour de l'arme au lieu d'un
grand cercle de 122 px autour de la bille. Cinq affrontements changent de
score, **tous avec le Pistolero**, et il passe de 15 à 16 victoires sur 30.

### Les pouvoirs greffés — Champ de givre et Dôme de drain

Deux pouvoirs **repris tels quels** d'autres fiches et posés sur les deux
invités : le **Champ de givre** de la Glace sur le Pistolero, le **Dôme de drain**
de l'Ombre sur l’Hoplite. Ni relevés ni mesurés — ce sont des ajouts demandés.

**Ils s'ajoutent, ils ne remplacent pas.** Les deux combattants avaient déjà un
ultime (LEAD HAIL, Foudre tombante) ; il fallait donc un **troisième créneau**. Chaque
fiche porte un bloc `special`, et chaque module un compteur `f.state.spec` qui a
exactement la forme des compteurs génériques du `Fighter` (`offstage`, `boost`,
`ghosting`) : le module l'allume et le décompte, personne d'autre ne
l'interprète. Rien ne passe par `f.ult`, donc ni la jauge, ni la charge, ni la
durée des deux ultimes existants ne sont touchées.

**Ils ont leur propre jauge, collée sous celle de l'ultime.**

![Les deux rangées de jauges](capture-jauges.png)

`HUD.special` recopie `HUD.bar` **à l'ordonnée près** : mêmes largeur, hauteur,
abscisses, cadre, taille et retrait de libellé. Les deux rangées doivent se
lire comme une paire, pas comme une jauge et son petit frère.

Et l'égalité n'est pas une copie de constantes : `render/hud.js` trace les deux
avec **la même fonction** (`drawGauge`), appelée avec deux géométries. Une
retouche de style les touche donc toutes les deux par construction. La première
version en avait deux tracés séparés, et l'un avait déjà dérivé — libellé plus
petit, couleur du texte inversée selon l'état. Retoucher l'un sans l'autre est
exactement le genre d'écart qui ne crie jamais.

**Les lignes de statistique descendent de 1036 à 1076.** C'est un écart assumé
au relevé : la seconde jauge occupe la bande où les glyphes tombaient. Le
décalage vaut exactement la hauteur de la jauge plus son écart (35 + 5), donc
les proportions relevées entre jauge et texte sont conservées — c'est le bloc
entier qui glisse, pas l'espacement qui change.

La jauge dit **deux choses avec le même remplissage**, comme celles d'ultime :
elle se remplit vers la prochaine incantation, puis se vide sur la durée
d'activité. C'est la convention du jeu (`barValue` fait exactement ça), donc
rien de nouveau à apprendre.

Le module l'alimente par `specialBar(f)`, méthode **optionnelle** de la même
forme que `drawUnbounded` : les neuf combattants sans troisième créneau ne
l'implémentent pas, et n'affichent donc pas un cadre vide. L'écran de sélection
les liste en plus sur une ligne « Special ».

| | Champ de givre (Pistolero) | Dôme de drain (Hoplite) |
| --- | --- | --- |
| Origine | ultime de la Glace | ultime de l'Ombre |
| Durée | 5,2 s (mesuré sur la Glace) | 5,65 s (mesuré sur l'Ombre) |
| Horloge | première à 4 s, puis toutes les **11 s** — `calé` | première à 5 s, puis toutes les **11 s** — `calé` |
| Effet | champ de givre de 130 px **qui suit** le porteur : ralentit de 35 % et retire 1 PV toutes les 0,7 s, **plus une salve de 7 éclats toutes les 2,4 s** | dôme de 200 px **figé** au point d'incantation + rayon qui ralentit de 15 % et draine 1 PV toutes les 0,5 s |
| Retouches | aucune | rayon 265 → **200** et drain 0,4 → **0,5 s** |

Les deux retouches du Lien ont la même cause. À 265 px le dôme couvrait plus de
la moitié d'une arène de 640 px de côté : les deux combattants y restaient en
permanence et il cessait d'être un lieu. Et l’Hoplite gagnait déjà 29 duels sur
30 — lui ajouter 2,5 PV/s gratuits n'avait pas besoin d'être mesuré pour qu'on
sache où ça allait.

#### Le piège : une décoration qui tirait dans le flux de simulation

**Le premier balayage de recharge a rendu des chiffres impossibles.** Un
Champ de givre *plus rare* rendait le Pistolero *plus fort* — 19 victoires à 18 s de
recharge contre 17 à 13 s — et la recharge du Lien ne changeait strictement
rien. Aucune mécanique n'a cette forme.

La cause : la **neige** du Champ de givre (90 flocons/s × 2 tirages) et la
**poussière** du dôme (90 grains × 6 tirages, plus une ré-injection continue)
tiraient dans `game.rng`, le flux de **simulation**. Chaque valeur de recharge
décalait donc tout le tirage de tous les duels au lieu de changer la force du
personnage : le balayage mesurait du bruit, pas un levier.

Les deux sont passés à `game.viewRng`. Rien ne lit ces positions à part le
dessin — c'est de la décoration, et la décoration passe par `viewRng` ou par un
hachage pur, jamais par le flux du duel. Après correction, la recharge du
Champ de givre redevient monotone (9 s → 17 victoires, 11 s → 15, 18 s → 14), et
celle du Lien se révèle n'être **pas un levier du tout** : à 15 s et à 24 s les
matrices ne diffèrent que par des **durées**, jamais par un vainqueur — l’Hoplite gagne ses trente duels de toute façon.

> **Cette correction était incomplète, et la suite le prouve.** Seules les
> **positions** passées en argument avaient changé de flux. `Effects.snow`, lui,
> continuait de tirer **quatre** fois dans `game.rng` par flocon — 360 tirages
> par seconde de Champ de givre. La monotonie observée avait fait croire l'affaire
> réglée : elle ne prouvait rien, elle était seulement moins erratique qu'avant.
>
> `Effects` reçoit maintenant un second flux à la construction
> (`new Effects(rng, viewRng)`), dont les générateurs purement décoratifs se
> servent. Corriger cela a déplacé **cinq affrontements**, dont trois de la
> **Glace** — son propre Champ de givre sème la même neige. Le Pistolero passe de 26
> à 25, la Glace de 13 à 15.
>
> La leçon : **vérifier une correction à la source, pas au symptôme.** Un
> balayage redevenu monotone n'est pas une preuve que le flux est propre.
>
> Reste au tableau : `fx.burst` tire encore 4 fois par particule dans le flux de
> simulation, et cela vaut pour tout le roster. Le corriger déplacerait
> toutes leurs matrices d'un coup — c'est un chantier à part, pas un oubli.

*La Glace et l'Ombre font encore l'inverse dans leurs propres modules. Le
corriger là-bas déplacerait leur matrice ; c'est un autre chantier.*

#### Les éclats de givre, et ce que l'ablation a montré

Les **éclats de givre** (`frostShards` de la Glace) sont greffés sur le
Champ de givre — avec une différence : chez la Glace c'est un pouvoir *permanent* que
le Champ de givre accélère, ici il n'existe **que** pendant le Champ de givre. Un pistolero
qui tire des éclats en continu n'est plus un pistolero.

Les projectiles étant lus dans la fiche du **porteur**
(`owner.el.projectiles[key]`), l'`iceShard` est **recopié** dans la fiche de
Pistolero, pas référencé.

Trois changements sont arrivés ensemble — rechargement ×2 plus rapide, vitesse
de balle ×1,3, éclats — et le Pistolero est passé de 16 à 26 victoires sur
30. Une ablation, un changement à la fois, dit lequel pèse :

| Configuration | Pistolero |
| --- | --- |
| référence du tour précédent | 16 / 30 |
| rechargement ×2 seul | **23 / 30** |
| vitesse de balle ×1,3 seule | 14 / 30 |
| éclats seuls | 28 / 30 |
| les trois ensemble | 28 / 30 |

Deux enseignements. D'abord, **la vitesse de balle n'apporte rien de mesurable**
— 14 contre 16, soit deux victoires sur trente réparties sur dix
affrontements à trois graines : c'est dans le bruit du banc, pas un effet.
Ensuite, **le rechargement est le vrai moteur**, et c'est cohérent avec
l'historique du personnage : le tour de rechargement lui coûtait ses touches de
mêlée (le bout du canon porte la hitbox de contact, et pendant la recharge
l'arme n'est plus asservie), ce qui l'avait fait tomber de 15 à 9. Diviser la
recharge par deux lui rend l'essentiel de ce qu'elle lui coûtait.

**Aucun levier ne ramène la bande sans défaire ce qui a été demandé.** Ce qui a
été essayé, mesuré :

| Levier | Résultat |
| --- | --- |
| cadence du Champ de givre, 11 → 26 s | **plate** : 25–26 quel que soit le réglage |
| cadence des éclats, 10×1,2 s → 5×5 s | 28 → 23, jamais en dessous |
| dispersion, 0,75 → 1,35 rad | 26 → 16, mais 1,35 rad = un cône de 77° |
| `ability.cooldown`, `magazine` | **mesurés** — hors d'atteinte (invariant 5) |

La dispersion plafonne parce qu'une part croissante des touches vient des
**éclats**, qu'elle n'affecte pas : le banc tombe de 1,11 à 0,86 coup/s et pas
plus bas, contre 0,65 relevé. Et à 1,35 rad le canon asservi à la cible cesse
de se lire comme une visée — le personnage devient un fusil à pompe. C'est un
prix de conception payé pour masquer un changement demandé ; il n'a pas été
payé, et le 26 / 30 est **documenté plutôt que caché**, comme le 30 / 30 de
Hoplite.

Pour le rentrer dans la bande si on le souhaite : `ability.spread` à **1,35** et
`special.shards` à **5 éclats toutes les 5 s** donnent 16 / 30.

#### De l'éclair de glace à la poudre de glace

![Poudre de glace](capture-poudre.png)

*Les deux balles laissent une bouffée granuleuse au lieu d'un chapelet de
points ; Pistolero (à droite) traîne son propre sillage de poudre, et le
canon porte une poussière au lieu d'arcs.*
Le Pistolero avait la suite d'effets de l’Hoplite **recolorée** en bleu : un
tracé électrique, des arcs le long du canon. Le dessin disait donc la foudre là
où le personnage gèle. Un mode `powder` remplace le mode `electric`, et chacune
de ses règles est **l'inverse** d'une règle du tracé électrique :

| | `electric` | `powder` |
| --- | --- | --- |
| Forme | un **trait** continu, cassé | des **grains isolés**, non reliés |
| Écart | s'annule au point le plus récent | **s'ouvre en s'éloignant** du combattant |
| `rate` | 11–16 paliers/s : ça doit grésiller | 5–6 : ça doit **tenir en place** |
| Liant | aucun | une **nappe** large et très transparente sous les grains |

Relier des points écartés était l'exigence du tracé électrique — un chemin dont
les points sont espacés de 200 px se referme en chapelet de perles s'il est
dessiné segment par segment. Pour la poudre, c'est exactement l'inverse : les
grains **doivent** être séparés. Et une poudre se disperse en retombant, donc
l'écart s'ouvre vers l'arrière au lieu de s'annuler au combattant.

La nappe n'est pas un ornement : sans elle les grains se lisent comme des taches
détachées, et c'est elle qui les rassemble en sillage.

Le long du canon, les arcs deviennent une **poussière** (`weaponArc.powder`) —
même ancrage sur `bladeSegment()`, même hachage pur, mais des grains isolés au
lieu de polylignes, dont le panache s'ouvre vers la pointe.

**Deux erreurs commises, et toutes deux déjà au tableau.**

D'abord l'aura : la largeur des passes était calculée en `1/k`, donc la
**dernière** passe — celle qui porte le cœur à pleine opacité — faisait 54 px au
lieu de 8. Elle délavait tout autour de l'arme au lieu de la cerner, ce qui est
mot pour mot le défaut de « gélule » déjà corrigé sur la lance. La passe la plus
large vient en premier, le noyau étroit en dernier.

Ensuite la gamme : premier réglage en `#e8f7ff` sur `#7cc3e4`, **invisible**.
L'arène est blanche, et un grain quasi blanc de 3 px n'y existe pas. C'est la
leçon des jaunes clairs de l’Hoplite, refaite à l'envers — « poudre » avait
suggéré « pâle », alors que la contrainte de fond n'a pas changé. La gamme est
en bleus **tenus** (`#2f8ec6`, `#1d78ad`), le cœur en `#8fd0ee` et non en blanc.

#### La traînée des projectiles

Un projectile n'émettait qu'un point isolé toutes les 30 ms. À 936 px/s, cela
laisse 28 px entre deux marques : un chapelet de perles, pas un sillage.

`trail.puff` transforme chaque émission en **bouffée** — plusieurs grains
dispersés perpendiculairement à la vitesse et traînant vers l'arrière — et
`every` descend en même temps (0,03 → 0,018). Les deux comptent : c'est
l'espacement des émissions qui décide de la continuité, pas leur richesse.

**Ce code est dans le chemin de simulation** (`projectiles.update`), donc la
dispersion vient d'un **hachage pur** de (compteur d'émission, indice de grain),
jamais d'un tirage — et `fx.dot` ne consomme aucun aléa non plus. C'est ce qui
rend l'enrichissement gratuit : la matrice est **identique au fichier près**
après l'ajout, ce qui a été vérifié.

À cette occasion `hash01` est remonté de `render/flair.js` vers `core/math.js`,
d'où `flair.js` et `projectiles.js` l'importent tous deux — plutôt qu'une
troisième copie de la même fonction.

#### La traînée de glace du Pistolero
Le Pistolero reprend **la suite d'effets de l’Hoplite en mode glace** : ruban et
fuseau `electric`, aura d'arme, arcs le long du canon. Le code est partagé —
c'est tout l'intérêt de `render/flair.js` : seule la gamme change, et la matrice
reste identique au fichier près.

Deux réglages appris à l'image :

- **l'amplitude des arcs doit dépasser la demi-épaisseur du sprite.** Le
  revolver fait 46 px de haut dessiné, soit 23 de demi-épaisseur — d'où 32,
  le même rapport que les 38 de la lance sur ses 55 px ;
- **c'est la teinte qui descend, pas l'opacité.** Les alphas sont ceux de
  Hoplite (0,55 / 0,40) ; au premier réglage (`#bfeaff` sur `#2a7fae`) la
  traînée se lisait comme une volute grise, parce que sur l'arène blanche un
  bleu porte moins qu'un ambre à luminosité égale. Les deux tons sont
  descendus d'un cran.

**Pas de `pierce`.** L'onde de pénétration est conditionnée à `Fighter.boost`,
que le Pistolero allume pendant LEAD HAIL : un coin de charge planté devant un
pistolero qui recule à chaque tir se lirait comme un bug. C'est le seul effet de
la suite qui ne se transpose pas.

> Chargeur — pointe en avant, frappe de plus en plus fort, et tombe du ciel.
>
> *Anciennement « Dragoon ». Renommé, redessiné d'après une maquette d'arme,
> et remécanisé — voir « L'angle d'arme » plus bas.*

Relevé sur `Dragoon vs Outlaw` (576 × 1024, 33,6 s) — la vidéo dont le Pistolero est déjà tiré, vue depuis l'autre camp. Toutes les cotes `mesuré`
sont converties ×1,25 vers le repère 720 × 1280.

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon 41 px, contour `#181008` 5 px. La pipette donne l'indigo `#574a84` ; le jeu met la bille en **violet `#7046ac`**, la teinte de la hampe de la lance électrique — la bille suit l'arme, comme elle suivait le cuivre avant elle. C'est donc un retour tout près du relevé : le détour par le cuivre était l'écart, pas celui-ci. Corollaire, le crème `#f5f2ea` **mesuré** du chiffre de PV revient, après avoir dû passer en brun sombre le temps où le cuivre clair le noyait | mesuré, écart réduit |
| Traînée | **trois effets distincts** : les boucles roses autour de la lance, tracées par la **pointe d'arme** (`flair.ribbon`) ; le **fuseau cramoisi derrière la bille** (`flair.smear`) ; et les **images fantômes de la charge** (`flair.ghost`) — une bande de billes qui se recouvrent, lance comprise, visible image par image entre 8,60 et 8,83 s. Les deux derniers ont dû être ajoutés à `render/flair.js`. Mesuré `#a32b4a` au cœur, `#df8692` sur les bords | mesuré |
| Déplacement | **540 px/s**, virage 1,85 rad/s. Mesuré 432 px/s sur la vidéo 576 et **gardé tel quel**, contrairement aux deux autres invités : au banc il fait 15 victoires sur 30 à 540 contre 16 à 470 — sa vitesse n'est pas ce qui le rend fort | mesuré |
| **Arme** | *Lance de dragon* — **portée 164 px, la plus longue du jeu**. Talon qui dépasse de **42 px derrière le pivot**, longueur totale 206 px | mesuré |
| Forme de la lame | **en feuille** : plus large au milieu qu'à ses deux bouts. Relevé en aplatissant la lance sur trois images nettes (t = 0 / 4,5 / 7,8 s) — la bille est localisée au sous-pixel, l'image tournée pour mettre la lance à l'horizontale, puis la demi-épaisseur mesurée colonne par colonne. Les trois profils concordent : **24 px de large à la bille, 32 au ventre, 21 près de la pointe**. Le premier portage l'affinait de façon monotone, ce que la vidéo dément | mesuré |
| Silhouette de la lame | **c'est ici que le relevé cède la place à une maquette.** La vidéo montre une lame *en feuille* crantée ; l'arme retenue est la **lance électrique** d'une maquette fournie — pommeau doré, hampe violette parcourue de fissures blanches, garde, tête hérissée à gemme centrale et barbelures. Elle n'est pas *dessinée d'après* la maquette : elle **est** la maquette, transcrite (voir la ligne suivante) | maquette |
| Rendu de la lance | une seule carte de **208 × 43 à `scale: 1`**, obtenue par réduction de la maquette en blocs **3 × 3 exacts** (624/208 = 3, 129/43 = 3) : aucun rééchantillonnage, donc rapport d'aspect conservé au pixel près, et la médiane par bloc rend les aplats que le JPEG source avait bruités. **La portée ne bouge pas** : 208 × 1 = 208 px logiques comme 104 × 2 auparavant, donc la pointe reste à −44 + 208 = 164. C'est aussi pourquoi la carte est préférée à l'override PNG que le dépôt propose pourtant : `headH = map.h × scale` se lit sur la **carte** et `w = headH × img.w / img.h` sur l'**image**, si bien qu'un PNG d'un autre rapport d'aspect décale la largeur dessinée sans toucher la hitbox — le 624 × 129 posait la pointe à 168,8 px, une arme qui ment de 5 px sur son allonge | maquette, encombrement mesuré |
| **Orientation de la lance** | `weapon.spin: 0`, et `abilities/lancer.js` recopie `heading` — **par défaut, faute de mieux établi.** Le chiffre « 6,6° au cap contre 37,9° à l'adversaire » qui figurait ici est **retiré** : voir la rétractation ci-dessous | non tranché |
| **Charge** | viser → verrouiller → foncer. En croisière la bille tient 400–450 px/s vidéo (soit les 540 de la fiche) ; pendant une charge (t = 8,70 → 8,84 s) elle monte à 1 125–1 160 px/s vidéo, soit **~1 400 en repère jeu**, sur **~0,15 s** | mesuré |
| Garde | **aucune**. Ce qui ressemblait à un losange de garde sur les premières captures est derrière la bille, donc invisible en jeu : au-delà du bord de la bille le profil ne montre aucun renflement | mesuré |
| Hitbox | de 0,32 à 1 de la portée (la lame commence à 52 px du centre), rayon 12 px | déduit du sprite |
| **Corps à corps** | la stat « Damage » du HUD, **+2 à chaque touche portée**. Relevé image par image sur la bande de stat : elle passe 10 → 12 → 14 → 16 → 18 → 20 aux instants **12,53 / 13,63 / 14,77 / 16,37 / 21,00 s**, et l'Outlaw descend de 100 à 30 PV. 10+12+14+16+18 = 70 : le compte tombe au PV près sur **cinq touches** | mesuré |
| Ce que le duel donne | **5 touches en 27,6 s = 0,181 coup/s**, pour un budget de **2,54 PV/s**. Deux de ces cinq touches sont des chutes de la Foudre tombante (12,53 et 21,00) ; les trois touches de lance tombent à 13,63 / 14,77 / 16,37 s | mesuré |
| Cadence | **1,1 s entre deux touches**, la valeur que donnent les trois touches de lance consécutives. Elle a longtemps valu 6 s, et c'était alors le seul écart au relevé qui subsistait : une lance de 164 px qui *balaie en tournant* accroche 0,34 fois par seconde contre 0,181 relevé. Le mécanisme était faux, pas le chiffre — la charge l'a rendu, et le verrou avec | mesuré |
| Fenêtre d'engagement | la charge ne part qu'entre **265 et 470 px** de l'adversaire, et seulement si l'adversaire est à moins de **0,15 rad du cap courant** (donc dans l'axe de la lance). C'est le paramètre de cadence du personnage, et il a remplacé une rustine : allonger la pause entre deux charges ramenait bien la cadence à 0,181 coup/s, mais à 2,5 s de temps mort, là où la vidéo montre *une charge par seconde environ dont une sur cinq porte*. La géométrie tranche — la charge couvre 224 px et la lance en ajoute 164, donc engagée sous ~250 px elle touche presque à coup sûr, et au-delà de ~430 elle n'arrive jamais | calé |
| Garde-fou | **la lance ne blesse qu'en charge.** Hors charge elle est *portée*, pas poussée. Sans cette règle, une arme de 164 px braquée dans l'axe du déplacement, chez un combattant qui se déplace *vers* son adversaire, l'embroche en permanence : au banc, **0,42 coup/s** et 30 duels gagnés en 19 s. C'est le piège du Pistolero, dont le canon asservi gagnait 27 duels sur 27 avant sa dispersion | calé |
| Plafond de pile | **15**, déduit. La vidéo n'en montre aucun : elle s'arrête à 20 parce que l’Hoplite meurt, pas parce que la stat bute. Mais *tous* les combattants à stat croissante du roster en ont un (Araignée 14, Serpent 14, Pistolero 8, Ronin 3), et sans plafond la montée est quadratique en durée de duel. Il valait 16 du temps de la visée, où le mécanisme donnait peu de touches ; la charge sur cap en donne davantage — à 16 Hoplite monte à 19 victoires sur 30, à 14 il tombe à 12, à **15** il rend 2,43 PV/s et tient 13 | déduit |
| Pouvoir | *Charge de lance* — **passif**. L’Hoplite n'a aucun pouvoir actif dans la vidéo : sa seule ligne de stat est « Damage », et elle ne bouge qu'aux touches | mesuré |
| **Ultime** | *Foudre tombante* (`THUNDERFALL`). Jauge pleine en ~10 s (+0,10 de remplissage par seconde), marches de ~8 % à chaque touche | mesuré |
| Déroulé de la Foudre tombante | jauge vidée → **0,45 s d'élan** au sol → **1,5 s hors de l'arène** → chute. Chronométré deux fois : 10,60 / 11,02 / 12,53 s, puis 19,03 / 19,50 / 21,00 s | mesuré |
| Pendant le vol | Hoplite **n'est plus dans l'arène** : ni touché, ni touchant, ni dessiné. Un disque gris suit l'adversaire, enfle jusqu'à 2,5 × le rayon au sommet du bond puis se resserre à 1,35 × — c'est le resserrement qui annonce la chute | mesuré |
| Impact | il retombe **collé à l'adversaire** — le marqueur, décalé de 0,9 × la somme des deux rayons pour que les billes se touchent sans s'interpénétrer : posé pile dessus, `resolveBodies` le séparait aussitôt et la chute devenait illisible. Il frappe dans un rayon de 110 px pour les dégâts courants de la lance, recul 520. L'arène blanchit d'un coup, une onde grise part jusqu'à 225 px en 0,35 s | mesuré |
| Décollage | une **onde de choc grise au sol** part du point de départ, jusqu'à 190 px en 0,4 s. L’Hoplite disparaît d'une image à l'autre : sans elle, rien ne dit d'où il est parti. Les deux bouts du bond se répondent — même disque gris au départ qu'à l'arrivée | déduit |
| Comptabilité de l'impact | la chute compte comme une touche : sur la vidéo l'Outlaw passe de 100 à 90 PV alors que le HUD affiche « Damage: 10.00 », et la stat monte ensuite à 12 | mesuré |
| Projectile | aucun — tout passe par la lance et la Foudre tombante | mesuré |
| HUD | `Damage: 10` | mesuré |

**L'angle d'arme, et les trois relevés qu'il a fallu.** C'est la mécanique
centrale du personnage, et les deux premiers portages l'avaient manquée chacun
à sa façon.

| Relevé | Conclusion | Ce qui clochait |
| --- | --- | --- |
| 1 | rotation libre à 327 °/s | le détecteur prenait le barycentre des pixels indigo les plus lointains ; pendant une charge, ce sont les **images fantômes**, pas la lance |
| 2 | « elle vise l'adversaire, à ±5° » | mesuré sur les seules plages où l’Hoplite fonçait *sur* l'adversaire, là où cap de déplacement et cap adverse se confondent — un sous-ensemble biaisé |
| 3 | **elle suit le cap de déplacement** | tient sur 141 images réparties sur toute la vidéo, et à tous les régimes de vitesse |
| 4 | **rien** — les deux hypothèses tombent ensemble | voir la rétractation ci-dessous |

**Rétractation du relevé n° 3.** Une quatrième mesure, faite sur les *deux*
vidéos avec un détecteur corrigé, ne tranche pas — et c'est le résultat
honnête :

| Méthode | A (vs Magia) | B (vs Outlaw) |
| --- | --- | --- |
| ACP, composante connexe, > 300 px/s | cap 31,7° / adversaire 12,4° | cap 26,6° / adversaire 12,9° |
| Vecteur bille → pointe | cap 44,7° / adversaire 27,6° | cap 41,4° / adversaire 38,1° |
| Corrélation des variations | r = +0,06 / −0,09 | r = −0,04 / +0,26 |

Aucune des deux hypothèses ne descend sous 25° avec la méthode du vecteur
pointe, les corrélations sont nulles, et les verdicts par bande de vitesse
s'inversent d'une bande à l'autre. **Une mécanique ne fait pas ça, une mesure
polluée si.** Le détecteur du relevé n° 3 prenait tous les pixels sombres dans
un rayon de 130 px **sans exclure le cadre noir de l'arène** — une droite
parfaite, que l'ACP privilégie précisément parce qu'elle cherche la direction
la plus allongée, et que le test d'allongement *sélectionnait* au lieu de
filtrer. Il ne tournait en outre que sur les images où un détecteur global
retrouvait la bille : 490 sur 747 dans la vidéo B.

Pour trancher il faudrait une lecture image par image sur un jeu d'images
choisies à la main, ou une source de meilleure définition. En attendant,
`weaponAngle = heading` reste en place **par défaut**, pas comme un relevé.

**Ce qui, lui, est mesuré — et concorde sur les deux vidéos.**

| Mesure | A (vs Magia) | B (vs Outlaw) | Le jeu |
| --- | --- | --- | --- |
| Vitesse de croisière | 423 px/s | 413 px/s | **432** |
| Une charge toutes les | 1,7 s | 0,9 s | **2,3 s** |
| Distance parcourue par charge | 137 px logiques | (bruitée) | **136** |
| Pic de vitesse en charge | 1 392 px/s | 1 770 px/s | **1 555** |
| Cadence de touche | 0,181 coup/s | — | **0,184** |

Ces cinq-là sont pris avec le **même code** des deux côtés, la conversion ×1,25
appliquée, et un **suivi temporel** de la bille — pas une détection image par
image, qui la perdait 257 fois sur 747 pendant les charges.

**Mesurer contre le bon adversaire.** `tools/probe.mjs` fait affronter à
L’Hoplite, lui, a les dix autres, qui **pilotent vers lui** et entrent donc d'eux-mêmes
dans le couloir de charge : il y rend 0,506 coup/s. Dans le **miroir** — le
duel le plus proche de la vidéo, où l'adversaire se déplace de son côté — il
rend **0,202 coup/s pour 2,43 PV/s**, contre 0,181 et 2,54 relevés. Le même
personnage, deux chiffres qui diffèrent d'un facteur 2,5 : **la cadence d'un
combattant n'a de sens qu'en nommant l'adversaire.**

Ce que la comparaison a révélé, et qui était le vrai défaut : le Dragoon de la
vidéo **charge souvent et rate souvent** — une charge toutes les 1 à 1,7 s,
dont environ une sur trois porte. Le portage chargeait toutes les 4,3 s et
touchait presque à chaque fois. Les deux rendaient la **même cadence de
touche**, ce qui masquait l'écart au chiffre, mais rien à voir à l'œil.

**L'arrêt avant la charge n'est pas mesuré non plus.** Le « 163 px/s une image
avant le déclenchement » venait d'un détecteur qui ne retenait un déclenchement
que si `v[i-1] < 0,35 × v[i]` — il *sélectionnait* les images précédées d'un
creux, puis rapportait qu'il y avait un creux. Avec un seuil neutre, la vitesse
avant charge vaut 732 px/s (A) et 413 (B) : pas d'arrêt. La phase `brace` est
conservée parce qu'elle a été **demandée** comme effet de jeu, pas parce
qu'elle est relevée.

**Ce qui suit était l'argument du relevé n° 3.** Il garde sa valeur de méthode
— un mécanisme juste rend des chiffres qu'on n'a pas eu à caler — même si la
mesure qui l'accompagnait est retirée. Ce qui l'établissait n'était pas
seulement la statistique
mais **ce qu'il explique gratuitement**. `weaponAngle = heading` produit tout
seul les trois comportements visibles image par image :

- l'angle **figé une demi-seconde** quand il va tout droit (2,13 → 2,67 s,
  moins de 10° d'écart) — c'est une trajectoire rectiligne ;
- un **saut de 85° en une image** au rebond mural (2,667 → 2,700 s) — c'est
  `Fighter.step` qui réfléchit `heading` sur les murs, et l'arme suit ;
- une rotation lente le reste du temps, |ω| médian **33 °/s**, 88 % des images
  sous 100 °/s — c'est le pilotage, à 1,85 × 0,4 = 0,74 rad/s.

Aucun de ces trois nombres n'est écrit dans la fiche. Une hypothèse qui demande
un paramètre par comportement observé est fausse ; celle-ci n'en demande aucun.

**La charge, en quatre phases.** Toujours ni visée ni verrouillage : la lance
suivant le cap, elle est *déjà* dans l'axe de la charge.

| Phase | Ce qui s'y passe |
| --- | --- |
| `seek` | déplacement normal ; s'engage si l'adversaire est dans la fenêtre de distance **et** dans le cône du cap |
| `windup` | **moulinet d'élan** : le corps continue, seule l'arme tourne, à 26 rad/s |
| `brace` | **le corps se cloue sur place**, cap gelé, l'arme est verrouillée d'autorité sur le cap et **saute** du flanc vers l'axe — sans interpolation |
| `dash` | le corps file à 2,6 × sa vitesse en ligne droite, cap gelé — donc angle d'arme gelé aussi, sans avoir à le geler |
| `recover` | temps mort ; l'arme se replace sur le flanc |

**Trois ajouts de mise en scène, distincts du relevé.** Le **moulinet** (0,10 s
à 14 rad/s, soit ~80°) est le seul moment où l'arme ne suit pas le cap ; la
vidéo n'en montre aucun, et le garde-fou « la lance ne blesse qu'en charge » le
couvre gratuitement. Le **recul** passe de 300/95 relevés à 460/200 : c'est
l'amplitude qui monte et non l'amortissement, celui-ci étant global
(`PHYSICS.speedRecovery`) et donc partagé par les onze. Et la **charge est
strictement linéaire** — l'impulsion est remise à zéro au départ, sans quoi un
recul encaissé juste avant l'incurverait sans que rien dans le module ne
l'explique.

Le moulinet coûte de la cadence, et pour la même raison que l'arrêt : pendant
qu'il tourne, l'adversaire dérive. 0,18 s → 2,02 PV/s, 0,14 → 2,15, **0,10 →
2,31**. À 0,10 s le moteur rend **0,180 coup/s** contre 0,181 relevés — la
cadence tombe juste, et c'est le budget de dégâts (2,39 avec `stackMax` 16) qui
reste 6 % sous la vidéo.

**Le mécanisme, tel qu'il est décrit et implémenté.** Le corps va **tout
droit** (`movement.seek: 0`, seul du roster) ; la **lance balaie** à 5,5 rad/s,
indépendamment du déplacement ; dès que son axe croise l'adversaire elle se
verrouille, marque 0,04 s, et le corps part en ligne droite **jusqu'au bord du
terrain**. Puis ça recommence.

C'est ce mécanisme qui rend compte des trois relevés d'angle contradictoires :
les deux hypothèses testées — « suit le cap », « vise » — étaient fausses toutes
les deux, donc aucune ne pouvait ressortir d'une mesure, si soignée soit-elle.
Une lance qui balaie n'est corrélée qu'à elle-même.

**Le sprite est 1,5 fois plus épais**, sans être plus long : la maquette est
ré-échantillonnée en blocs 3 × **2** au lieu de 3 × 3, donc 208 × 64 au lieu de
208 × 43. La largeur dessinée vaut `map.w × scale` et ne bouge pas ; la hauteur
vaut `map.h × scale`. On ne dilate pas un sprite existant, on retourne à la
source et on l'échantillonne plus fin en vertical — ce qui ajoute du détail au
lieu d'en étirer.

**Le rythme de charge, mesuré sur les deux vidéos.** Une charge toutes les
**1,0 à 1,7 s**, parcourant **137 px logiques**, à un pic de **1 392 à
1 770 px/s vidéo**, pour une cadence de touche de 0,181 coup/s. Autrement dit
le Dragoon **charge souvent et rate souvent** : environ une charge sur trois
porte. L’Hoplite chargeait toutes les 4,3 s et touchait presque à chaque fois —
même cadence de touche, comportement sans rapport. C'est cet écart-là qui
faisait « mou et désynchronisé », et il était invisible tant qu'on ne comparait
que la cadence.

**L'arrêt avant la charge n'est pas relevé — cette mesure est retirée.** Le
« 163 px/s une image avant le déclenchement » venait d'un détecteur qui ne
retenait un déclenchement que si la vitesse précédente valait moins de 35 % de
la suivante : il sélectionnait les images précédées d'un creux, puis rapportait
qu'il y avait un creux. Avec un seuil neutre, la vitesse avant charge vaut
732 px/s (A) et 413 (B). La phase est gardée parce qu'elle a été demandée comme
effet de jeu.

**Ce que disait l'ancienne version :** La vitesse tombe à **163 px/s une image
avant le déclenchement**, contre ~1 700 juste avant et ~3 100 juste après : Hoplite se plante, puis part. L'échantillon est mince — deux déclenchements
nets sur la vidéo — et c'est la lecture du mouvement qui le corrobore plutôt
que la statistique seule.

Il se paie sur le **taux de réussite**, pas sur le temps mort : il coûtait
0,52 PV/s en arrivant, et retoucher `recover` n'y changeait rien (2,00 → 2,07
de 0,55 à 0,40). Pendant l'arrêt l'adversaire continue d'avancer, donc la
charge part vers où il **était**. Le seul levier est la durée de l'arrêt —
0,10 s → 2,00 PV/s, 0,05 → 2,25, 0,033 → 2,29 — et à la valeur relevée
(0,033 s) le moteur rend 0,181 coup/s, exactement la cadence mesurée. L'arrêt
est réglé à 0,05 s, dans l'incertitude d'un échantillonnage à 30 fps et plus
lisible à l'œil.

**L'ancrage est binaire.** Il était d'abord rapproché à vitesse bornée
(420 px/s) pour éviter un saut — une erreur de lecture : une interpolation, si
rapide soit-elle, fait *glisser* l'arme pendant la charge, donc elle court après
la bille au lieu de former un bloc avec elle. Le saut est exactement ce qu'on
veut voir, et il tombe dans l'image même où la phase change.

**L'arme est ancrée sur le flanc, et se recentre pour charger.** Mesuré :
distance signée du centre de la bille à l'axe de la lance (rayon 33 px vidéo) —
**+20 px au repos**, **+38 en croisière**, **+1 en pleine charge**, c'est-à-dire
pile au centre ; 74 % des images du même côté. Le décalage est un compteur
générique de plus, `Fighter.weaponLateral`, et `weaponPivot()` est lu par le
dessin **et** par la hitbox : décaler seulement le dessin ferait mentir le
sprite sur l'endroit où il coupe.

**L'arme passe au-dessus du corps** (`weapon.overBody`), et **sous le chiffre de
PV** — dans un miroir Hoplite contre Hoplite ce chiffre est le seul repère qui
distingue les deux camps.

**Cinq effets de traînée, tous dans `render/flair.js`.** Les trois d'origine —
boucles de pointe, fuseau, images fantômes — passent du cramoisi mesuré au
**violet électrique**, pour ne pas lire comme deux personnages superposés
derrière une lance violette. S'y ajoutent une **aura d'arme** tracée sur
`bladeSegment()`, donc solidaire de la portée et du décalage latéral, et une
**onde de pénétration** conditionnée à `Fighter.boost` : un sillage en coin
ouvert vers l'arrière depuis la pointe — ouvert vers l'avant il se lirait comme
un projectile — plus un arc de proue devant elle.

Aucun des deux ne touche la simulation : `flair.js` a son propre aléa et son
propre banc de particules, et la matrice est vérifiée **identique** après
l'ajout. C'est précisément ce que cette porte d'entrée sert à garantir.

La charge a **un seul point de sortie**, `endDash()`, qui remet ensemble
vitesse, facteur de vitesse et traînée — c'est le piège du Ronin, dont la
ruée avait déjà laissé un éventail large accroché derrière la lame pour les
avoir dispersés.

**Les deux paramètres de cadence se règlent à contre-intuition.** `lunge.cone`
(0,15) : **le serrer améliore la cadence** — 0,15 → 0,157 coup/s, 0,30 →
0,149, 0,60 → 0,120 — parce qu'un cône large laisse partir des charges mal
alignées, qui manquent, et le temps mort qui suit est perdu. `lunge.minRange`
(265) : rouvert depuis 320, la charge sur cône étroit s'engageant moins souvent
que l'ancienne charge sur angle corrigé — 320 → 2,04 PV/s, 300 → 2,26, 280 →
2,35, **265 → 2,52**, 200 → 3,29. Dans les deux cas le levier est le **taux de
réussite** des charges, jamais leur fréquence.

**Ce que le moteur rend.** **0,195 coup/s** et **2,52 PV/s**, contre 0,181 et
2,54 relevés : le budget de dégâts — ce qui décide les duels — tombe à 0,02
près.

**Le piège du verrou figé pendant le vol.** Pendant la Foudre tombante, `Fighter.step`
sort avant de décompter `meleeCd` : le verrou de touche est donc **figé** pour
toute la durée du vol, à la valeur qu'il avait au décollage. Si la Foudre tombante partait
en pleine charge — la seule phase où le garde-fou ne s'applique pas — cette
valeur était zéro, et l’Hoplite touchait gratuitement à l'atterrissage, lance
pointée sur une cible à 74 px. Une touche garantie tous les ~8 s, invisible au
relevé, qui portait à elle seule dix victoires sur trente. `land()` pose
maintenant le verrou comme le ferait `resolveMelee`.

la Foudre tombante est le seul pouvoir du jeu qui **retire son porteur du plateau**. Côté
moteur c'est `Fighter.offstage` : générique comme `invulnerable`, il ne dit pas
*pourquoi* le combattant est parti. Toute boucle qui teste `f.alive` pour
décider de le *voir* doit tester `f.onStage` — sinon il reste un ruban, une
nappe de sol ou une hitbox au dernier point connu.

---

## 🌿 DRUIDE — `mage` (affiché « DRUIDE » en français, « DRUID » en anglais)

Quatrième invité, **demandé** : un mage vert, armé du sceptre d'une maquette
fournie, qui **attaque à distance** avec des **orbes guidées**, dont l'arme est
**posée sur le côté** et **vise** l'adversaire, sans mécanique propre par
ailleurs, **construit sur la mécanique de Magia**, et **portant les pouvoirs de
la Plante**.

### Le repère de mesure n'est pas celui des autres

Piège d'entrée, et il aurait faussé toutes les cotes. *Dragoon vs Magia* est en
576 × 1024 comme les deux autres vidéos ballthingsim, **mais son cadrage
diffère** : l'arène y mesure **502 px de bord extérieur** contre 640 dans le
jeu, soit **×1,275** et non ×1,25.

Vérifié par un objet dont on connaît déjà la taille : la bille fait 32 px de
rayon (29,5 mesurés sur le masque de couleur, plus la moitié du contour sombre
que le masque exclut), et 32 × 1,275 = **40,8**, soit les 41 px du roster. Deux
mesures indépendantes qui tombent sur le même facteur : c'est ce qui l'établit.

**Règle qui en sort :** ne pas supposer le facteur de conversion d'après le
format de la vidéo. Le mesurer sur l'arène, le vérifier sur un objet connu.

### Ce que Magia rend, et comment

| Mesure | Valeur | Comment |
| --- | --- | --- |
| **Stat de HUD** | **« Attack Speed »**, une cadence de tir qui **monte toute seule** | lue image par image sur la bande de stat |
| Départ | **1,00** | t = 0 |
| Paliers | **1,10** à t≈1,2 s · **1,15** à 2,2 s · **1,25** à 3,2 s · **1,30** à 3,8 s | tous multiples de **0,05** |
| Plus tard | **2,00** à t≈13 s, **~3,7** en fin de duel | premier chiffre lisible malgré le filigrane |
| Loi déduite | **+0,05 par orbe tirée**, à la cadence courante | six paliers en 4,5 s pour une cadence moyenne de 1,15/s ; donne `e^(0,05 t)`, soit 1,92 à 13 s |
| Ultime | **HEARTBREAK FINALE** | non porté : Druide prend celui de la Plante, demandé |
| Déplacement | **548 px/s** de médiane (p25 507, p75 629) | 258 couples d'images |
| Arme | baguette **posée sur le flanc**, ~100 px vidéo entre les deux bouts | soit **128 px** en repère jeu |
| Projectiles | des cœurs roses, à trajectoire **courbe** | ~600-780 px/s en repère jeu selon la portion de vol |

**Le filigrane TikTok couvrait la stat à partir de t = 5 s.** Le dépôt le
savait déjà (« binariser la zone de texte avant de hacher une bande de
stats ») ; ici la solution est plus simple et plus sûre : **ne garder que les
pixels roses** du texte (`R − G > 45`). Le filigrane est blanc-gris neutre,
donc il disparaît entièrement, et les chiffres restent lisibles là où il ne les
recouvre pas.

**La vitesse se recale toute seule.** Le Dragoon est dans la même vidéo, et on
sait par ailleurs qu'il vaut ~540 px/s dans le jeu : il y mesure 521 avec le
même code. L'écart de 4 % dit que le facteur ×1,275 est bon, et que les 548 de
Magia valent bien ~550 en repère jeu. **Mesurer un personnage connu dans la
même vidéo est le meilleur étalon disponible.**

### Le sceptre

Transcrit de la maquette fournie, pas dessiné.

| | |
| --- | --- |
| Résolution de la maquette | **6,5 px par pixel d'art** — le damier de transparence fait 13 px, soit exactement deux pixels d'art. Confirmé par un balayage : l'erreur de reconstruction a un minimum net à 6,5 (15,2) contre 17-21 aux valeurs voisines |
| Grille native | 72 × 158 pour l'image entière, **33 × 139** pour le sceptre seul |
| Carte livrée | **70 × 17**, la native réduite de moitié, dessinée à `scale: 2` |
| Portée | **128 px**, `handle.length` = −12, largeur dessinée 140 → la somme retombe sur la portée |
| Hitbox | **0,87 → 1** de la portée, rayon 15 : **seul le cristal blesse** |

**Pourquoi la moitié de la résolution.** Livré à `scale: 1`, le sceptre faisait
139 px d'écran avec **un pixel d'art par pixel d'écran** : la hampe se
réduisait à un trait et le cristal à une tache, là où tout le roster dessine
ses armes à 2 ou 3 et y gagne son grain. La réduction est un **vote majoritaire
par bloc 2 × 2**, le cristal l'emportant sur le bois — sans cette priorité ses
quelques cellules brillantes disparaissaient sous la majorité de brun.

**L'icône et l'orbe ne sont pas redessinées.** L'icône échantillonne la carte
du sceptre (même vote majoritaire, même priorité au cristal) et l'orbe est
composée des seules teintes de ce cristal. C'est la leçon d'`ICON_LANCE`, qui
avait divergé deux fois de l'arme qu'elle annonçait. La corolle verte, elle,
**partage le tableau `rows` de celle de la Plante** et n'en change que la
palette : le dessin ne peut pas diverger puisqu'il n'existe qu'une fois.

### L'arme braquée, troisième fois

`weapon.spin: 0`, et `abilities/mage.js` recopie l'angle vers l'adversaire à
chaque image. Le dépôt avait déjà payé deux fois « une arme braquée touche en
permanence » — Pistolero puis l’Hoplite. Ici le garde-fou est **géométrique**
et tient tout entier dans la fiche :

- la hitbox ne couvre que les 17 derniers pixels (`hitbox.from: 0.87`) ;
- l'arme est **décalée de 34 px sur le flanc** via `weaponLateral`, le compteur
  générique du `Fighter` — donc le segment tranchant **ne passe pas par l'axe
  qui vise**.

34 px est réglé à l'image : à 20 le sceptre chevauche la bille et ne se lit
plus, à 50 il flotte à côté sans lien avec le corps.

Ça n'a pas suffi à le rendre inoffensif au contact — la mêlée pèse encore 17,8
PV par duel, soit 20 % de ses dégâts — mais ça l'a rendu **rare**, ce qui est
le point : ses touches de contact ne sont pas bornées par la recharge (voir
plus bas).

### Le guidage

`projectiles.orb.homing = { turnRate: 2.6, delay: 0.1 }`, lu par
`game/projectiles.js`. Le moteur ne nomme personne : il vise « le premier
combattant en scène qui n'est pas le tireur », exactement le test que fait déjà
sa boucle de touche. La branche n'existe pas pour les projectiles qui ne
déclarent pas `homing`, et les dix affrontements d'avant sont restés
**identiques au caractère près**.

Le `delay` de 0,1 s laisse l'orbe sortir du sceptre avant de virer : sans lui,
une orbe tirée vers l'arrière pivote dans l'arme même.

### L'équilibrage : le levier évident n'était pas le bon

Livré tel quel, Druide gagnait **11 duels sur 12**. Le guidage semblait être
son levier :

| `turnRate` | 3,4 | 2,6 | 1,8 | 1,2 | 0,8 | 0,4 |
| --- | --- | --- | --- | --- | --- | --- |
| victoires / 24 | 22 | 20 | 22 | 19 | 18 | 16 |

**Plat.** Un banc qui plafonne dit que le levier n'est pas le bon — le dépôt
l'avait déjà appris sur la dispersion du Pistolero. L'ablation a tranché en
comptant les dégâts **par source** (`opts.kind` dans `game.damage`) :

| Source | PV par duel | Part |
| --- | --- | --- |
| projectiles | 61,1 | **68 %** |
| mêlée | 17,8 | 20 % |
| tempête | 7,2 | 8 % |
| bulbes | 3,8 | 4 % |

C'est donc la **valeur** des orbes, pas leur trajectoire. Et elle est raide :

| `orb.damage` | 3 | 2 | 1 |
| --- | --- | --- | --- |
| victoires / 24 | 20 | 15 | **0** |

Deux choses apprises au passage :

- **Deux leviers qui marchent chacun ne s'additionnent pas.** Orbe à 2 **et**
  mêlée à 1 faisaient tomber le Druide à **8/24**, alors que chacun seul le
  posait vers 15. Près du seuil, un point de dégât bascule des courses déjà
  serrées.
- **Le verrou de mêlée n'est pas un levier ici**, contrairement à
  Pistolero : balayé à 1,4 / 1,7 / 2,2 s il rend 15 / 12 / 14 victoires,
  non monotone, donc du bruit. Il reste à 1,7 s parce que c'est la
  configuration sur laquelle la matrice a été relevée, et son commentaire le
  dit — pas parce qu'il équilibre.

**Réglage retenu :** `orb.damage: 2`, mêlée 2 PV / 1,7 s → **12 victoires sur
24** au banc des deux camps, **5 sur 12** dans la matrice d'alors — avec le
Semis encore en place (voir la section suivante pour son retrait, qui a depuis
changé ce chiffre à 6/12).

Profil obtenu à ce stade, et il était cohérent : Druide **bat les deux
combattants à portée courte** (Pistolero 3-0, Ronin 2-1) et **perd contre
les deux qui referment vite** (Hoplite 0-3, Shinobi 0-3). Un tireur se fait
battre par qui arrive au contact — ça reste vrai après le retrait du Semis,
seul le score contre le Ronin et le Shinobi a un peu bougé.

### Les pouvoirs de la Plante — délégués, pas recopiés

**Historique : à la sortie, deux pouvoirs.** La fiche du Druide portait les
**mêmes blocs** `ability.bulb` et `ultimate.storm`, et `abilities/mage.js`
appelait `plantAbilities.update`, `.init`, `.drawUnder`, `.drawOver` et
`.barValue`. Aucune ligne en double : une copie aurait divergé au premier
réglage, exactement la duplication que le dépôt a déjà payée sur `drawGauge`.

Trois écarts, tous volontaires :

- **dégâts et soin constants** au lieu de suivre `self.stacks`. Chez la Plante
  la pile est « Bulb Damage/Heal » ; ici elle est la cadence de tir, et la
  faire piloter aussi les bulbes empilerait deux montées sur une seule stat ;
- **`bulb.max: 3`** au lieu de 4 : Druide sème en tirant, il ne se replie pas
  sur ses bulbes ;
- **tout est reteinté en vert**, corolle comprise.

**Ce dernier point a demandé une correction dans `plant.js`, conservée après
le retrait du Semis** (section suivante) parce que l’Orage de ronces en a
toujours besoin. Le module codait `'flower'` en dur dans `drawSwarm`, et la
couleur rose de la gerbe d'un bulbe qui éclate en littéral : la tempête verte
du Druide faisait donc voler des corolles **roses**. Les deux littéraux sont
passés en clés de fiche (`swarm.flowerSprite`, `bulb.burstColors`) **avec le
littéral d'origine en repli** — la Plante ne change pas d'un pixel, et la
matrice le confirme.

### Le Semis retiré, et le sceptre par-dessus la bille

Deux demandes, purement indépendantes l'une de l'autre.

**Le Semis (les bulbes posés au sol) a été retiré.** Un tireur qui vise et
guide ses orbes n'a pas besoin d'une mine plantée par terre — c'était le seul
morceau du Druide qui se jouait **au sol** plutôt qu'en l'air, et il tranchait
avec le reste de sa fiche.

Retrait propre, pas un simple masquage visuel : `ability.bulb` a disparu de la
fiche, `ability.cooldown` passe à `Infinity` (même patron que la Furie de
Hoplite — un cooldown jamais décompté, que `ui/select.js` affiche « passif »),
et `abilities/mage.js` ne délègue plus que `updateStorm` / `drawOver` /
`barValue`, jamais `updateBulbs` / `updateSemis` / `drawUnder`.

**Ça a demandé de scinder `plantAbilities.update()` et `.init()`**, qui
enchaînaient jusque-là bulbes, tempête et minuterie de semis dans une seule
méthode. Découpés en `updateBulbs` / `updateStorm` / `updateSemis` (et
`initBulbs` / `initStorm`), appelés dans le même ordre par `update()` — la
Plante ne perd donc pas un pas de simulation, c'est une réorganisation pure.

Le `projectile.flower` de la fiche du Druide a suivi : il n'était tiré que par
les bulbes (`ability.bulb.projectile`), donc il ne sert plus à rien — et une
clé de fiche que plus personne ne lit ne crie pas (invariant 9), y compris
dans `ui/select.js`, qui l'aurait affichée dans la ligne « Projectile » de la
carte sans qu'elle corresponde à quoi que ce soit en jeu. Retiré. La corolle de
la Tempête, elle, ne dépend pas de ce registre : `flowerSprite: 'mageFlower'`
est lue directement dans `PIXEL_MAPS` par `drawSwarm`.

**C'est un changement de jeu**, pas un simple nettoyage : le Semis pesait des
dégâts, du soin et un ralentissement. Seules les lignes du Druide bougent dans la
matrice, le reste au caractère près :

| | Avant (avec Semis) | Après |
| --- | --- | --- |
| vs Pistolero | 3-0 | 3-0 |
| vs Ronin | 2-1 | 1-2 |
| vs Hoplite | 0-3 | 0-3 |
| vs Shinobi | 0-3 | 2-1 |
| **Total** | **5/12** | **6/12** |

*(Correction : une première version de ce tableau inversait le score « après »
contre le Shinobi — 1-2 au lieu de 2-1. La ligne ci-dessus est la bonne, et
c'est elle que confirme `tools/matrix-reference.txt`.)*
Le Druide bat toujours Pistolero et perd toujours contre l’Hoplite ; ce qui
bouge nettement, c'est le Shinobi — une défaite sèche (0-3) devient une victoire
nette (2-1). C'est plus que ce que le retrait des bulbes explique à lui seul :
retirer toute une mécanique retire aussi ses propres décorations (gerbes de
plantation, de touche, anneau de soin), et celles-ci **consomment `game.rng`**
comme le reste des particules du dépôt — un chantier connu et non résolu (voir
« Déterminisme et ordre d'exécution » dans `docs/PIEGES.md`). Une part de ce
basculement est donc probablement un remaniement du tirage plutôt qu'un effet
mécanique direct du Semis sur ce duel précis ; sans ablation dédiée, impossible
de trancher la part de chaque cause. Aucun levier n'a été retouché pour
autant : le retrait suffit à rester dans la bande, sans nouveau réglage.

**Le sceptre se dessine maintenant par-dessus la bille**, `weapon.overBody:
true` — même drapeau que l’Hoplite et le Ronin, purement visuel : il ne
pèse sur aucune hitbox (`bladeSegment()` ne le consulte pas), seul l'ordre de
peinture dans `fighter.js` en dépend. Vérifié en isolant les deux changements :
`overBody` seul laisse la matrice **identique au caractère près**, c'est le
retrait du Semis qui la fait bouger.

### Le sceptre centré sur le pivot — une demande visuelle qui a coûté de la portée

**Demandé : la même longueur devant et derrière le point d'attache.** À la
sortie du personnage, le sceptre ne l'était pas du tout — `handle.length: -12`
pour une carte dessinée sur 140 px (70 cellules × `scale: 2`), donc **128 px
devant** le pivot (jusqu'au cristal) contre **12 px derrière**. Le sceptre
tenait presque tout entier en avant de la bille, un talon microscopique dans
son dos.

Recentré à largeur dessinée inchangée : `handle.length: -70`, donc 70 px de
chaque côté. C'est un simple partage en deux de la largeur du sprite (140 / 2
= 70), aucun redessin.

**Mais l'invariant du dépôt ne laisse pas ce choix gratuit.** `handle.length` +
largeur dessinée doit toujours valoir `reach` — sinon la pointe du sprite ment
sur la hitbox. Avec `handle.length: -70` et 140 px dessinés, la pointe tombe à
70, donc `reach` **doit** passer de 128 à 70 : centrer le sceptre sans le
redessiner plus grand réduit mécaniquement sa portée de près de moitié. Il n'y
avait pas de troisième voie à largeur de sprite inchangée — grossir la carte
pour garder `reach: 128` en symétrique (donc 256 px dessinés) aurait demandé un
`scale` non entier (~3,66) et un sceptre visuellement disproportionné par
rapport à la bille.

**Même patron que le Shinobi**, seul autre combattant à porter une arme
centrée sur son pivot : `handle.length: -75, reach: 75`, sa portée mesurée
elle aussi ramenée par la symétrie et jamais recalée depuis. Le Druide suit le
même choix — la portée `reach: 70` n'est plus la baguette mesurée sur Magia
(128 px), elle est **déduite** de la symétrie demandée.

`fireOrb()` (`abilities/mage.js`) n'a pas eu besoin d'être touché : il lit
`f.el.weapon.reach` pour placer le point de tir, donc l'orbe part toujours du
cristal — mécaniquement plus proche de la bille qu'avant, puisque le cristal
lui-même l'est. `hitbox.from: 0,87` n'a pas bougé non plus : le cristal reste
les 13 % derniers de l'arme, seule l'arme entière a raccourci.

**C'est un changement de jeu, pas seulement un ajustement visuel**, et il a été
accepté comme tel plutôt que compensé par un autre réglage. Seules les lignes
du Druide bougent dans la matrice :

| | Avant (reach 128, asymétrique) | Après (reach 70, centré) |
| --- | --- | --- |
| vs Pistolero | 3-0 | 2-1 |
| vs Ronin | 1-2 | 1-2 |
| vs Hoplite | 0-3 | 0-3 |
| vs Shinobi | 2-1 | 1-2 |
| **Total** | **6/12** | **4/12** |

Deux victoires perdues, une contre le Pistolero et une contre le Shinobi —
ses deux adversaires les plus rapides à revenir au contact une fois la portée
raccourcie. Le score contre le Ronin et l’Hoplite ne bouge pas. Druide
descend dans la bande basse du roster réduit, aux côtés du Pistolero et de
Ronin (4/12 chacun), sans tomber en dessous. Rien
d'autre n'a été retouché pour compenser : la demande portait sur l'apparence,
pas sur l'équilibre, et le nouvel équilibre est *le* résultat de la demande,
pas un accident à corriger. Si la portée doit revenir, les deux leviers
disponibles sont d'agrandir le sprite (en acceptant un sceptre plus grand pour
retrouver `reach: 128` en symétrique) ou de renoncer au centrage.

### Le chiffre de PV repassé par-dessus l’Orage de ronces

**Signalé : pendant l'ultime, on ne voit plus combien de PV il reste à la
cible.** La nuée de cubes verts (`drawSwarm`, dessinée par `drawOver`) est
opaque et recouvre toute la bille — chiffre de PV compris, puisque
`Match.draw()` trace les combattants (`f.draw()`, chiffre inclus) **avant**
d'appeler `drawOver` sur les modules de pouvoirs. Le Druide n'invente rien de
nouveau ici : c'est un trou générique du pipeline, juste jamais remarqué avant
qu'un pouvoir ne pose quelque chose d'aussi opaque et aussi grand sur sa cible.

Corrigé au niveau du moteur, pas de la fiche : `Fighter.drawHpNumber()`
factorise le tracé du chiffre (jusque-là un closure local à `draw()`), et
`Match.draw()` le rappelle pour tous les combattants en scène, juste après la
boucle `drawOver` — `globalAlpha` remis à 1 d'abord, pour ne pas hériter d'un
fondu mal restauré par un module. Un second `fillText` opaque au même endroit
ne change rien à l'écran pour les neuf combattants qu'aucun `drawOver` ne
recouvre : vérifié sur le Ronin (Aura de braise) et le Pistolero
(LEAD HAIL) sans aucun artefact de double-tracé, et la matrice reste
**identique au caractère près** — c'est un second passage de rendu, rien qui
touche à `game.rng` ou à l'état d'un combattant.

### Tir enraciné — le troisième créneau, et le seul pouvoir original du Druide

**Demandé : un pouvoir spécial à lui.** Le Druide était le seul des cinq
combattants actifs sans troisième créneau. Les quatre autres en portent un
**emprunté** à un élément gelé — Champ de givre (Glace) pour le Pistolero, Aura de
braise (Feu) pour le Ronin, Dôme de drain (Ombre) pour l’Hoplite — sauf
le Clone d'ombre du Shinobi, conçu pour lui. Celui-ci est du second type :
original, rien ne le porte ailleurs.

**Le marché : il s'immobilise pour frapper fort.**

| | |
| --- | --- |
| Cycle | premier à **3,5 s**, puis toutes les **7 s** — trois enracinements dans un duel moyen de 20 à 25 s |
| Ancrage | **1 s** à l'arrêt complet (`f.boost` / `f.boostFactor: 0`, le compteur générique, exactement la phase `brace` de l’Hoplite) |
| Pendant la charge | les orbes ordinaires **s'interrompent** — c'est ce qui fait *attendre* le grand coup au lieu de l'ajouter par-dessus le reste |
| Récompense | une **orbe majeure** : 6 PV contre 2, 44 px contre 24, 620 px/s contre 470, guidage 3,4 rad/s contre 2,6 |

C'est la seule dimension de risque de tout son jeu : partout ailleurs Druide
tire en fuyant, sans jamais rien exposer. Enraciné, il ne peut plus esquiver.
La contrepartie devait donc être franche — une orbe à peine meilleure n'aurait
jamais valu le risque, et le pouvoir n'aurait servi qu'à se faire toucher.

**Pas de zone posée au sol.** Les racines sont accrochées à lui et disparaissent
avec le tir : c'est délibérément l'inverse du Semis, retiré précisément parce
qu'il laissait des bulbes plantés dans l'arène.

#### Ce que le rendu a demandé

- **Les racines partent du bord de la bille, pas de son centre.** Première
  version : 58 px mesurés depuis le centre, or le corps en fait 41 de rayon —
  elles restaient donc invisibles sous lui pendant les deux premiers tiers de
  la charge, et on ne voyait rien venir. Elles sortent maintenant du corps dès
  la première image.
- **La jauge se remplit, elle ne se vide pas.** Reprise telle quelle du
  Champ de givre, elle décomptait le temps restant — donc elle partait pleine et
  tombait à zéro au moment du tir, ce qui se lit comme un pouvoir qui se
  termine à l'instant où il commence. Un tir qu'on charge veut l'inverse.
- **Les racines sont en bois, pas en vert.** En vert uni (`#1f964d`) elles se
  lisaient comme un astérisque, sept piques identiques plantées autour de la
  bille. Passées au brun de la hampe (`#4a3b2f`) avec la pointe verte, elles se
  rattachent au sceptre et se lisent comme des racines.
- **`duration`, pas `charge`.** La clé portait d'abord le nom qui décrit ce
  qu'elle fait ; mais `ui/select.js` lit `special.duration` pour la ligne
  « Special » de la carte, comme pour les quatre autres pouvoirs greffés, et la
  carte affichait donc « Rooted Shot — **undefineds**, every 7s ». Le nom
  générique gagne : c'est celui que le reste du dépôt attend.

#### Un piège évité de justesse

`Projectiles` garde son `owner` **par identité** pour savoir qui ne pas
toucher. La première version du tir passait une **copie** du combattant
(`{ ...f, x: tip.x, y: tip.y }`) pour placer l'orbe au bout du sceptre — l'orbe
majeure aurait alors frappé son propre tireur. Le tir emprunte donc la position
du cristal le temps du `spawn` puis la rend, exactement comme `plant.js` le
fait pour tirer depuis un bulbe.

#### Équilibrage

Aucun réglage n'a été nécessaire : les valeurs de départ tombent juste.

| | Avant | Après |
| --- | --- | --- |
| vs Pistolero | 2-1 | 3-0 |
| vs Ronin | 1-2 | 2-1 |
| vs Hoplite | 0-3 | 1-2 |
| vs Shinobi | 1-2 | 0-3 |
| **Total** | **4/12** | **6/12** |
Le Druide revient exactement à la médiane, et **le roster entier se resserre** :
9/9/6/3/3 contre 10/8/4/4/4, le relevé le plus serré depuis la réduction à cinq
combattants.

Deux résultats se lisent tout seuls dans la mécanique :

- **il prend une victoire à l’Hoplite** (0-3 → 1-2), alors qu'il ne lui en avait
  jamais pris une seule. L’Hoplite charge en ligne droite ; une orbe guidée à
  6 PV est exactement ce qui punit une trajectoire prévisible ;
- **il en perd une contre le Shinobi** (1-2 → 0-3). L'immobilité d'une seconde
  est précisément ce que le combattant le plus rapide du roster sait punir.
  C'est le risque du pouvoir qui se voit dans la matrice, pas un défaut de
  réglage.

Curseurs si l'équilibre doit bouger : `special.duration` (le temps
d'immobilité, donc le risque), `projectiles.greatOrb.damage` (la récompense) ou
`special.cooldown` (la fréquence).

### Ce qui n'a pas été repris de Magia

- **Sa couleur** — le personnage est vert, demandé. Vert `#1f7a3d`, plus sombre
  et plus bleu que celui de la Plante (`#15c701`, un vert acide), pris sur la
  sève du sceptre. Le chiffre de PV est en crème : sur un vert de cette
  luminance il tranche mieux qu'un noir.
- **Son arme** — remplacée par le sceptre de la maquette.
- **Son ultime** *HEARTBREAK FINALE* — remplacé par l’Orage de ronces.
- **Ses cœurs** — remplacés par les orbes de sève.
- **Sa vitesse** telle quelle : 548 mesurés, **520 retenus**, `calé` comme
  toutes les vitesses du dépôt.

### Comme le Shinobi : le chiffre de PV disparaît pendant le flash

`bodyHit` est blanc et `hpColor` est crème : à l'image où le Druide encaisse, son
chiffre de PV s'efface. Trait partagé avec le Shinobi (`hpColor: '#f5f2ea'`,
`bodyHit: '#ffffff'`), connu et assumé — le flash dure une ou deux images.
Le corriger demanderait un `hpColor` sombre, qui se lirait moins bien le reste
du temps sur un corps de cette luminance.

---

### Le recul du Tir enraciné — il part à l'opposé de sa cible

**Demandé** : « au lieu de propulser vers l'adversaire après le tir, propulse
dans le côté opposé ». Deux constats avant le correctif.

1. **Rien ne le propulsait.** `releaseRootedShot` ne poussait pas du tout. Ce
   qu'on voyait, c'était le Druide qui repartait *vers* sa cible à la
   libération, parce que `movement.seek` avait passé toute la seconde
   d'ancrage à tourner son cap dessus — pendant l'enracinement,
   `boostFactor: 0` annule la **vitesse**, pas la rotation.
2. **Une impulsion seule ne suffisait pas.** `Fighter.step` calcule
   `v = cap × vitesse + impulsion` : le recul se **retranche** du pilotage au
   lieu de s'y ajouter. Avec 420 d'impulsion contre 624 px/s de vitesse
   nominale, le solde net restait de **+204 px/s vers l'adversaire**, et la
   mesure donnait −100 px sur l'axe opposé en 0,3 s. Le pouvoir faisait
   exactement l'inverse de la demande.

Le correctif écrit donc **les deux** : le cap est retourné
(`heading = weaponAngle + π`) *et* l'impulsion de 420 est appliquée. Vérifié au
banc sur 9 duels — vitesse projetée sur l'axe opposé à l'instant du tir :

| Adversaire | seed 1 | seed 2 | seed 3 |
| --- | --- | --- | --- |
| Mannequin | +1044 px/s | +1044 px/s | +1048 px/s |
| Pistolero | +756 px/s | +728 px/s | +732 px/s |
| Ronin | +1160 px/s | +1051 px/s | +1044 px/s |

**9 sur 9.** Le déplacement net à 0,15 s est parfois plus faible que cette
vitesse ne le laisse croire : lancé à ~1 000 px/s dans une arène de 640 px, il
atteint souvent un mur dans la fenêtre et **rebondit** (`Fighter.wall` est armé
dans les 9 cas). C'est le comportement voulu — un bond en arrière, dont `seek`
le ramène ensuite.

**Effet mesuré sur l'équilibrage** (10 seeds × les deux camps × 6 adversaires,
120 duels) : total quasi inchangé, **64 → 61**, mais la *forme* bouge — vs
Pistolero 11 → 16, vs Ronin 10 → 7, vs Shinobi 4 → 1, vs Golem 15 → 11. Se
projeter en arrière l'éloigne des mêlées rapides qui le punissaient, et le sort
de portée de ses propres orbes guidées contre ceux qui restent au loin.

### Dégâts du shuriken d'ultime : 4 → 3

**Demandé.** `projectiles.crescent.damage`, le projectile que tire la Tornade
de shurikens (`ultimate.volley.projectile`) — et rien d'autre ne le tire, donc
le changement ne touche **que** la décharge d'ultime. La Tornade ordinaire
(`ability.tornado.damage`, la stat « Shuriken Damage » qui monte de 10 à 24)
n'est pas concernée.

Effet mesuré sur la matrice officielle (3 seeds) : le Shinobi passe de 11 à
**7** victoires sur 18, et devient le dernier des six qui frappent. Sa
production contre le Mannequin descend de 6,1 à **5,9 PV/s** — le Ronin (5,8)
le rattrape presque, alors qu'il était seul en tête depuis la création du banc.

Sur 10 parties par affrontement, le détail est plus parlant que le total : il
tient encore le Druide (8/10) et le Golem (6/10), mais tombe à 2/10 contre le
Pistolero et l'Hoplite. C'est cohérent avec ce que retire le changement — la
décharge d'ultime est ce qui lui permettait de conclure sur les adversaires
qu'il ne peut pas user au contact.

## 🗿 GOLEM — `golem` (affiché « GOLEM » dans les deux langues)

**Le premier combattant inventé du dépôt.** Les cinq autres sont transcrits
d'une vidéo ; celui-ci n'en a pas. Conséquence directe sur la lecture de sa
fiche : **aucune de ses valeurs ne porte `mesuré`**, tout y est `calé` (posé
puis vérifié au banc) ou `déduit` (calculé d'une autre). C'est le régime du Tir
enraciné du Druide, étendu à un personnage entier.

### Ce qu'il apporte, et pourquoi il fallait le penser autrement

Les cinq existants tiennent sur deux axes : vite et fragile (Shinobi, Ronin), ou
à distance et fuyant (Pistolero, Druide). **Personne n'encaisse.** Le Golem est
l'inverse de tous sur les quatre chiffres qui comptent.

| | Golem | le reste du roster |
| --- | --- | --- |
| Vitesse | **370 px/s** | 430 (Hoplite) à 655 (Pistolero) |
| Portée d'arme | **100 px** | 70 (Druide) à 197,6 (Ronin) |
| Rayon du corps | **50 px** | 41 pour les cinq |
| Points de vie | **200** | 100 pour les cinq |

**Sa défense, c'est sa barre de vie, et rien d'autre — demandé.** Pas de
réduction de dégâts, pas d'armure qui absorbe, pas d'invulnérabilité cyclique :
il encaisse chaque coup en entier, il en encaisse simplement deux fois plus. Un
seul chiffre porte toute sa résistance, donc le banc n'a qu'un levier à tourner.
Le corps plus large est le prix de ces PV : il est **plus facile à toucher**.

### Le piège de conception, nommé avant d'être payé

Un corps à corps de 370 px/s avec 100 px de portée **ne touche jamais** un
tireur de 655 px/s : il perdrait 10 duels sur 10 sans qu'aucun chiffre ne soit
« faux ». Ses deux pouvoirs existent pour cette raison précise, pas pour le
décor :

- **Onde sismique** (`ability`) — horloge de 6 s, aucune visée, tout ennemi dans
  170 px prend 6 dégâts, un recul de 340 et un ralentissement de 0,35 pendant
  1,4 s. C'est l'allonge que ses jambes ne lui donnent pas ;
- **Éclats de roche** (`special`, troisième créneau) — trois éclats en éventail
  toutes les 8 s, pour qu'on ne puisse pas se contenter de reculer indéfiniment.
  Contrairement aux trois pouvoirs greffés du dépôt (Champ de givre, Aura de
  braise, Dôme de drain), il n'est **repris de personne** ;
- **Séisme** (`ultimate`) — horloge de 12 s. La secousse est **instantanée**
  (10 dégâts, 600 de recul, 260 px de rayon) ; ce que dure `duration`, c'est le
  **bonus de vitesse de +35 %** qui la suit. Sans lui, frapper fort une fois ne
  changerait rien : il replongerait aussitôt dans son problème de fond.

### Valeurs

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon **50** (le seul du roster hors 41), granit `#6e6558`, contour `#1c1712`, chiffre de PV crème | calé |
| Points de vie | **200**, portés par `maxHp` dans la fiche et lus par `Match` (`el.maxHp ?? MATCH.maxHp`) | demandé |
| Déplacement | **370 px/s**, virage 1,3 rad/s, `seek` 0,34 | calé |
| Arme | *Amas de roche*, portée **100** = `handle.length` 36 + 64 px dessinés. Servie par un **vrai PNG** (`assets/sprites/golem-rock.png`) | maquette, encombrement déduit |
| Rotation d'arme | `SPIN × 0,45`, **la plus lente du roster** — une arme qui balaie vite touche souvent | calé |
| Hitbox | de 0,5 à 1 de la portée (le tranchant démarre pile au bord de la bille), rayon **24** | déduit |
| Corps à corps | **8** dégâts fixes, verrou 1,6 s, recul infligé **500** (le plus fort du roster), recul propre **60** | calé au banc |
| Onde sismique | 6 s, rayon 170, 6 dégâts, recul 340, ralentissement 0,35 / 1,4 s | calé |
| Éclats de roche | 8 s (première à 3 s), 3 éclats, ouverture 0,34 rad, projectile à 380 px/s et 4 dégâts | calé |
| Séisme | jauge en 12 s (+6 % par touche), impact 260 px / 10 dégâts / recul 600, puis 3 s à +35 % de vitesse | calé au banc |
| HUD | ses **deux horloges** (`Shockwave`, `Shards`) — il n'a aucune stat qui monte | déduit |

**Dégâts fixes, et fixes est le point.** Trois combattants du roster montent en
dégâts au fil du duel (Pistolero 3→8, Ronin 1,6→6, Hoplite 8→16) ; celui-ci
frappe pareil à la première et à la dernière seconde. Un colosse ne
« s'échauffe » pas — profil exactement inverse de l'Hoplite.

**Le poids se dit par l'asymétrie du recul, pas par une masse.** Il inflige 500
et n'encaisse que 60 quand il frappe. Le moteur n'a aucune notion de masse —
`Fighter.push` applique la même impulsion à tout le monde, et `movement.mass`,
déclaré dans `FICHE_DEFAULTS`, **n'est lu nulle part**. Aucune ligne de physique
n'a eu à bouger.

### Équilibrage : quatre leviers, dont deux qui ont menti

Banc : **10 seeds × les deux camps × 5 adversaires = 100 duels**, plus une
**ablation par source** (`opts.kind` dans `game.damage`) pour savoir d'où
viennent ses dégâts avant de balayer quoi que ce soit.

Première version : **89 victoires sur 100**. La suite, un levier à la fois.

| Levier | Essai | Total /100 | Ce que ça a appris |
| --- | --- | --- | --- |
| Dégâts de mêlée | 14 → 9 | 89 → 72 | levier **raide**, ~11 duels par point |
| Dégâts de l'onde | 6 → 3 | 72 → 66 | **presque plat** — l'ablation lui donne 4 à 10 % des dégâts seulement |
| Verrou de mêlée | 1,6 → 2,2 s | 66 → 62 | **élargit l'écart** : Ronin 20/20 pendant que Shinobi tombe à 7/20 |
| Impact du Séisme | 18 → 10 | — | 27 % des dégâts à l'ablation : la vraie deuxième source |
| Dégâts de mêlée | 9 → 8 | 61 → **54** | le seul point de la bande (7 donne 43) |
| Recul de mêlée | 500 → 300 | 54 → 42 | **porteur** : le Shinobi passe de 7/20 à 2/20 |

**L'ablation a démenti l'intuition, et c'est tout son intérêt.** L'Onde sismique
*paraît* être son levier n° 1 — elle ne rate jamais, elle ralentit, elle
repousse. La mesure dit **9,7 %** de ses dégâts, contre 44 % au poing, 28 % aux
éclats et 18 % au Séisme : la moitié de ses déclenchements tombe dans le vide,
l'adversaire n'étant pas dans les 170 px quand l'horloge sonne. Elle avait été
descendue à 3 sur cette intuition ; elle est remontée à 6.

### L'écart qui reste, et pourquoi il ne se corrige pas chez lui

Configuration retenue, 100 duels :

| Adversaire | Golem gagne |
| --- | --- |
| Ronin | 18/20 |
| Pistolero | 14/20 |
| Hoplite | 10/20 |
| Shinobi | 7/20 |
| Druide | 5/20 |
| **Total** | **54/100** |

Le total est juste, la **forme** ne l'est pas : il écrase les faibles DPS
(Ronin, Pistolero) et perd contre les gros (Shinobi, Druide). C'est la
conséquence directe des 200 PV — contre un adversaire qui ne place que 2 ou
3 dégâts par seconde, doubler la barre de vie double le temps qu'il faut pour le
tuer, et ce temps-là, le Golem le passe à frapper.

**Aucun levier de sa fiche ne corrige cette forme**, et c'est mesuré, pas
supposé : chacun de ceux essayés remonte un camp *et* descend l'autre. Baisser
sa mêlée pénalise le Ronin (trop fort) mais aussi le Shinobi (déjà trop
faible) ; baisser son recul rend le Ronin jouable et effondre le Shinobi à
2/20. Le corriger demanderait de toucher **les autres fiches** — c'est le
rééquilibrage complet que le dépôt a déjà refusé une fois, pas un réglage de
plus sur celle-ci.

### L'arme passe du poing à l'amas de roche

**Demandé**, maquette fournie. Même montage que la lame du Ronin et le shuriken
du Shinobi : un **vrai PNG** (`assets/sprites/golem-rock.png`) déclaré dans
`manifest.json`, la carte texte restant en repli — c'est l'écart assumé à
« aucun binaire dans le dépôt ».

Deux gestes sur l'image, et un calcul.

1. **Recadrage** sur les pixels non transparents (350 × 350 → 210 × 237) : la
   maquette arrive centrée dans un grand carré vide, et ce vide compterait dans
   l'encombrement dessiné.
2. **Quart de tour.** L'amas pousse vers le haut dans l'image ; l'axe d'une arme
   est l'**horizontale** dans ce moteur (`drawSpriteLeft` étale le sprite le
   long de la direction de l'arme). Sans rotation, les pointes seraient couchées
   au lieu de s'éloigner du corps. Après rotation : 237 × 210.
3. **L'échelle ne se lit plus sur la carte texte** — c'est le piège déjà payé
   sur la lance de l'Hoplite. `drawSpriteLeft` dimensionne par la **hauteur**
   (`map.h × scale`, prise sur la carte) puis applique le **rapport d'aspect du
   PNG** (1,128571). La largeur dessinée vaut donc `10 × scale × 1,128571`, et
   non `map.w × scale`. D'où :

   `scale = 64 × 210 / (10 × 237) = 5,670886`

   qui rend exactement 64 px de large, donc une pointe à 36 + 64 = **100**, la
   portée inchangée.

**C'est ce calcul qui fait de ce changement d'arme un changement purement
visuel** : `reach`, `hitbox` et tout ce que lit `bladeSegment()` sont
inchangés, et la matrice est restée identique au caractère près. Une échelle
posée à l'estime aurait déplacé la pointe, donc la hitbox, donc l'équilibrage —
sans qu'aucune valeur de dégâts n'ait bougé.

**L'amas passe par-dessus la bille, et sous le chiffre de PV** (demandé) :
`weapon.overBody` + `look.hpOverWeapon`, la combinaison du Ronin. Le premier
drapeau seul ne suffit pas — il peint l'arme **en dernier**, donc aussi au-dessus
du chiffre, ce qui est le compromis assumé de l'Hoplite. Le second remet le
chiffre au-dessus. À noter : avec la géométrie actuelle l'effet du second n'est
pas visible, le sprite étant blitté de 36 à 100 px du centre quand « 200 » tient
dans ~31 px. Il ne corrige donc pas un défaut, il garantit la règle si l'un des
deux bouge.

Suivent le nom affiché (*Poing de pierre* → *Amas de roche*, `Stone Fist` →
`Rock Cluster`) et la clé de sprite interne (`golemFist` → `golemRock`, montrée
à personne). La carte de repli est redessinée en amas pointu : elle n'est pas
que décorative, `map.h` sert au calcul ci-dessus **même avec l'override**, et
`ui/select.js` dessine toujours la carte texte, jamais le PNG — c'est elle
qu'on voit sur l'écran de sélection.

### Les Éclats de roche passent en anneau complet

**Demandé** : « envoyer des rocks tout autour du Golem ». Ils partaient en
éventail de trois éclats vers l'adversaire (ouverture 0,34 rad) ; ils partent
maintenant **tout autour**, régulièrement répartis sur le tour complet — même
géométrie que les éclats de givre du Blizzard du Pistolero.

Le nombre monte de **3 à 8** : trois éclats répartis sur 360° ne se lisent pas
comme un anneau, ils se lisent comme trois éclats qui partent n'importe où.
Huit, c'est un éclat tous les 45°. La clé `spread` disparaît — il n'y a plus
d'ouverture d'éventail à régler, la géométrie est fixée par `count` — et
l'angle de départ de l'anneau reste tiré dans `game.rng` (il décide où partent
huit projectiles, donc qui prend des dégâts : c'est de la simulation), ce qui
évite en plus que deux anneaux successifs suivent les mêmes huit rayons.

Ce que ça change au jeu : **il ne vise plus**. Chaque éclat porte moins souvent,
mais il en part presque trois fois plus, et surtout il en part **derrière lui** —
ce qui, pour le combattant le plus lent du roster, est le seul recours contre un
adversaire qui le contourne.

**Effet mesuré** (120 duels) : **74 → 82**, soit +8. Hors Mannequin (qu'il gagne
toujours), 54/100 → 62/100. C'est un renforcement net, dont l'essentiel vient du
duel contre le Druide (5 → 9).

### Dégâts des éclats : 4 → 3

**Demandé**, en contrepartie de l'anneau ci-dessus. Le résultat est bien plus
fort que le gain qu'il compense : **82 → 65** sur 120 duels, soit **−17 points**
là où le passage à huit éclats n'en avait rendu que 8. Hors Mannequin :
62/100 → **45/100**, donc en dessous des 54/100 d'avant l'anneau.

C'est la même raideur que celle déjà relevée sur ses dégâts de mêlée (~11 duels
par point) : chez un combattant dont les touches sont rares et les duels longs,
**un point de dégât par projectile pèse énormément** — huit éclats toutes les
8 s sur des duels de 35 à 75 s, cela fait beaucoup d'occurrences où 3 remplace 4.

Sa production contre le Mannequin tombe de 2,76 à **2,5 PV/s**. En revanche
l'écart du roster se resserre : **9 à 12** victoires sur 18, le plus serré
qu'ait connu le dépôt.


## 🎯 MANNEQUIN — `dummy` (affiché « MANNEQUIN » en français, « DUMMY » en anglais)

**Le seul combattant du dépôt dont l'utilité n'est pas d'être joué, mais d'être
frappé.** Demandé comme tel : sans arme, sans dégâts, blanc, 200 PV, pour servir
de partenaire de démonstration. On le met en face d'un combattant et on voit
enfin *ce que ce combattant fait*, sans qu'un duel ne se joue par-dessus.

Comme le Golem, il est **inventé** : pas de vidéo, donc pas un seul `mesuré`.

### Valeurs

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | **blanc pur `#ffffff`**, contour noir de **6 px** (5 partout ailleurs), chiffre de PV **noir** | demandé + déduit |
| Corps touché | **`#ff8a8a`, il rougit** — partout ailleurs le corps *blanchit*, ce qui sur un corps blanc serait un coup invisible | déduit |
| Aura | grise, **permanente** (`showWhen` sans condition) — seul cas du roster | déduit |
| Points de vie | **200** | demandé |
| Déplacement | 430 px/s, virage 1,6, **`seek: 0`** — il dérive, il ne poursuit personne | calé |
| Arme | **aucune** : pas de `head.sprite`, `reach: 0`, hitbox `from`/`to`/`radius` à 0, `melee.damage: 0` | demandé |
| Pouvoir / ultime / spécial | aucun. `ability.cooldown: Infinity` (affiché « passif »), jauge d'ultime **plate** et libellée `NO ULTIMATE` | demandé |
| HUD | **les dégâts qu'il a subis**, pas une stat à lui | déduit |

### Pourquoi ces valeurs-là, et pas d'autres

- **Blanc sur arène blanche.** C'est frontalement le piège que le dépôt
  documente depuis les jaunes pâles du Lancier — *ce qui est clair n'existe pas
  sur fond clair*. Trois compensations, toutes assumées : contour porté à 6 px,
  chiffre de PV passé au noir (le crème `#f5f2ea` du reste du roster
  disparaîtrait), et **aura permanente** pour poser un cerne gris autour du
  disque. Le corps touché rougit au lieu de blanchir, pour la même raison.
- **`seek: 0`, il ne poursuit pas.** Une cible *mobile* montre les mécaniques de
  poursuite qu'une cible plantée ne montrerait pas (orbes guidées du Druide,
  charge de l'Hoplite, canon asservi du Pistolero) ; une cible qui *chargerait*
  fausserait la lecture en allant au-devant des coups. Il dérive en ligne
  droite et rebondit, comme l'Hoplite.
- **Un module vide, et c'est une garantie de déterminisme.** Le Mannequin ne
  consomme **aucune valeur de `game.rng`** : le mettre en face d'un combattant
  ne décale pas le flux de simulation de celui-ci. Ce qu'on voit l'adversaire
  faire ici, il le ferait pareil ailleurs — sans quoi le banc d'observation
  mentirait sur ce qu'il observe.
- **La ligne de HUD mesure l'adversaire**, pas lui : `maxHp − hp`, donc la
  production réelle de l'autre depuis le début du duel. C'est la donnée qu'on
  vient chercher en le posant sur le terrain.

### Les deux cas limites qu'il a ouverts dans le moteur

Aucune des six fiches précédentes ne les exerçait.

1. **Un combattant sans arme.** `ui/select.js` prévoyait déjà le repli d'icône
   (`head.sprite ?? projectile ?? icon`) — il n'avait simplement jamais servi.
   `fighter.js`, lui, lisait `PIXEL_MAPS[undefined].h` et **plantait au premier
   rendu** : il a fallu un garde d'une ligne dans `drawWeapon` (`if (!map)
   return;`), générique, sans nom de combattant.
2. **Un duel qui ne finit pas.** Le moteur n'a **aucune limite de temps** : une
   partie ne s'arrête que par un mort (`knockout`). Deux Mannequins ne se
   départagent donc jamais — c'est la seule ligne de `matrix-reference.txt` qui
   porte `timeout`, à 200 s de simulation. Ce n'est pas un bug à corriger chez
   lui : ajouter une limite de temps changerait le déroulé de **tous** les
   duels du roster.

Il ne peut pas non plus toucher, et c'est **structurel plutôt qu'inoffensif** :
avec `from`/`to` à 0 et `radius: 0`, le segment tranchant se réduit au pivot et
la condition de `weaponHit` devient « le centre adverse est à moins de son
propre rayon du centre du Mannequin » — or `resolveBodies` maintient les deux
corps séparés d'au moins la somme des rayons. `melee.damage: 0` n'est là qu'en
ceinture et bretelles.

### Ce que sa ligne de matrice mesure vraiment

Les six lignes `… vs dummy` ne relèvent aucun équilibrage — le résultat est
connu d'avance. En revanche, **200 PV divisés par la durée donnent la production
de chacun contre une cible qui ne riposte pas**, ce qu'aucun autre banc du dépôt
ne montre aussi directement :

| Combattant | Durée moyenne | Production |
| --- | --- | --- |
| Shinobi | 32,8 s | **6,09 PV/s** |
| Ronin | 34,5 s | 5,79 PV/s |
| Hoplite | 36,5 s | 5,48 PV/s |
| Druide | 38,2 s | 5,23 PV/s |
| Pistolero | 47,4 s | 4,22 PV/s |
| Golem | 72,5 s | **2,76 PV/s** |

Le Golem produit **2,2 fois moins** que le Shinobi — l'exact contrepoids de ses
200 PV, et la confirmation chiffrée du compromis décrit dans sa propre section.

## ☀ SOLEIL — `sun` (le boss : il est fait pour gagner contre tous)

> Astre-roi — huit rayons, cinq cents points de vie, et tout son temps.

**Demandé** : « un personnage soleil de type boss, deux fois plus grand qu'un
personnage classique, plus de PV, en 1v1 il est censé gagner contre tous les
personnages actuels ; se déplace lentement ; mécanique de base : 8 rayons de
soleil autour ; un pouvoir qui charge puis libère un rayon solaire vers une
direction ; un deuxième pouvoir : réchauffement solaire, brûle les ennemis dans
son périmètre ».

Troisième combattant **inventé** du dépôt après le Golem et le Mannequin :
aucune vidéo, donc **pas un seul `mesuré`** — tout est `calé` ou `déduit`.

**Il est hors barème, et c'est la spécification.** Les sept autres sont taillés
pour s'affronter entre eux, dans une bande de 4 à 13 victoires sur 21 ; lui est
demandé pour les battre tous. Sa ligne de matrice à **21/21** n'est donc pas un
défaut d'équilibrage. Le dépôt a maintenant deux combattants hors barème, aux
deux bouts : le Mannequin ne peut pas gagner, le Soleil ne peut pas perdre.

| Bloc | Valeur | Source |
| --- | --- | --- |
| Corps | rayon **82** — exactement le double de la norme (41), et le plus gros du roster devant le Golem (50) | calé (demandé) |
| Points de vie | **500**, cinq fois la norme et deux fois et demie le Golem. Aucune réduction de dégâts : un seul chiffre porte toute sa résistance | calé (demandé) |
| **Corps** | **Un sprite, le seul du roster — demandé** (`assets/sprites/sun-core.png`, maquette d'astre fournie). Les huit autres sont des cercles vectoriels ; `assets/sprites/README.md` §6 décrivait le mécanisme depuis toujours sans que personne l'ait fait. Détouré de son fond blanc **et de son halo pêche** — le halo est déjà fait en jeu par `look.aura`, qui bat, alors qu'un halo cuit dans l'image serait figé et en ferait trois superposés | calé (demandé) |
| `spriteScale` | **Absent, et c'est une mesure.** La clé existe (défaut 1) pour corriger un dessin qui déborde de son disque plein — l'astre en avait besoin à 1,1236 tant que ses pointes étaient dans son sprite. Depuis que le PNG est coupé à la sphère (344 × 344, soit 2 × 172), il remplit exactement son cadre : la correction vaudrait 1, et une clé qui recopie son défaut est une occasion de divergence silencieuse, pas une intention | déduit |
| Chiffre de PV | **Crème `#fff4d0` cerné d'encre `#3a0b05`** — le premier du dépôt à porter un contour. Sous l'empreinte exacte des digits, 53 % des pixels sont clairs et 40 % sombres : aucun aplat ne tient (2,28 au mieux dans son pire cas, 1,08 pour une encre claire). Le contour isole le chiffre au lieu d'essayer de composer | mesuré sur la maquette |
| Palette | `look.palette` — les cinq teintes de la maquette d'astre, relevées par bandes de luminance : `edge` `#5d0100` · `shadow` `#c00803` · `body` `#f9993c` · `light` `#fbcf55` · `core` `#fdf17f`. **Source unique de tout ce qui est orange chez lui** : le bloc `look`, mais aussi le module, qui codait ses propres orange en dur — d'où la dérive du Rayon solaire. Il a été jaune vif (`#fbbf24`), puis orange plat (`#de7f3a`, échantillonné sur les rayons) avant d'être un dessin | relevé sur la maquette |
| Faisceau | **C'est le PNG de la maquette — demandé**, « comme pour la balle et l'arme ». Trois états successifs : cinq bandes inventées (monotones, le rayon se terminait sur son trait le plus sombre et se lisait comme une barre peinte), puis sept bandes **relevées** au profil transversal plus des filaments redessinés — fidèle au relevé, et malgré tout une transcription —, puis **l'image**, posée d'un bloc. Ce qu'elle apporte et qu'aucune reconstruction n'atteignait : ses filaments sont **irréguliers** (l'autocorrélation ne trouve aucune période, ils sont tracés à la main). Ce qu'on perd, assumé : le faisceau ne s'anime plus | relevé sur la maquette |
| `spriteHalf` | **1,3137** — demi-hauteur du sprite (134 px) ÷ demi-largeur de son **encre brûlée** (102 px). C'est lui qui fait tomber l'encre exactement sur `halfWidth`, donc sur **le bord de ce qui blesse** : même discipline que `handle.length + largeur = reach` pour une arme. La coupe s'arrête là parce que la lueur au-delà est *semi-transparente dans la maquette* et que le JPEG l'a aplatie sur son damier — trame cuite dans les pixels, phase irrécupérable (séparation mesurée 1 sur 97). Ce qui déborde est peint au moteur | relevé sur la maquette || Filaments et braises | Les **zigzags** qui courent dans le faisceau, et les **braises** qui le remontent depuis l'émetteur — la seule chose qui dise qu'il *coule* plutôt qu'il n'est allumé, un rayon de 2,5 s étant sinon une image fixe. Longueurs en multiples de `halfWidth`, donc tout suit si on élargit. **Aucun tirage** : les sommets sont posés aux pointes (échantillonner une onde triangulaire ferait *respirer* l'amplitude au lieu de la faire défiler) et l'ensemble glisse avec le temps | calé sur la maquette |
| **Ambiance d'arène** | **Le décor chauffe à mesure que le Réchauffement approche de zéro — demandé.** Le seul signe de l'horloge était une ligne de HUD et un halo de 240 px : le pouvoir arrivait *sur* l'adversaire sans que rien, dans l'image, n'ait dit qu'il montait. Deux couches dans `drawUnder`, donc **sous** les billes : un lavis chaud sur tout le sol (0,38) et une braise qui monte **des quatre bords** (0,64). L'asymétrie est mesurée — la vignette ne coûte pas de lisibilité, puisque les combattants vivent au centre. Montée en **carré** : une rampe droite se lit comme un fondu d'écran, `t²` reste froid puis bascule sur la dernière seconde. Le décor, lui, n'a pas bougé (invariant 4) : on peint par-dessus | calé (demandé) || Déplacement | **230 px/s, le plus lent du roster et de très loin** (420 Golem, 430 Hoplite, 655 Pistolero) et `turnRate` 1, le plus bas aussi. Il va **moitié moins vite que la moyenne**. C'est **la** contrepartie de tout le reste : il ne rattrape personne — et n'aurait rien à en faire s'il y arrivait | calé (demandé) |
| **Arme** | *Couronne de rayons* — **un huitième de la couronne du dessin, demandé** : `spokes: 8` répète la carte tous les 45°, et 8 × 45° = 360°, donc les huit copies **pavent l'anneau**. La couronne du jeu n'imite plus la maquette, elle en est le remontage | calé (demandé) |
| Découpe du rayon | Le secteur **225° → 270°**, pris **depuis 168 px** — 10 px en deçà de la sphère, pour que sa base chevauche la balle — puis tourné bissectrice vers la droite au plus proche voisin (c'est du pixel-art, il ne doit pas flouter). L'angle de coupe est **balayé au demi-degré** pour minimiser la matière traversant les deux rayons frontières : plusieurs coupes sortent à zéro (les deux bords dans des creux, aucune langue sectionnée), et celle-ci est parmi elles la plus représentative du dessin. Il contient **deux** langues, une longue et une courte — donc la couronne en porte seize, contre treize à la maquette | relevé sur la maquette |
| Portée | **160 → 104,42 → 145,41 → 123,15.** La chute finale est une correction : les 145,41 prenaient la **plus longue** langue du dessin et la plantaient sur l'axe des huit branches, ce qui donnait une couronne à **1,773 × le rayon de la sphère — plus longue que la plus longue langue de la maquette** (1,629). Le secteur, lui, porte ce qu'il porte : 1,525 ×, entre la médiane du dessin (1,292) et son maximum. Échelle `82 / 178 = 0,460674` : base 168 px → `handle.length` **71,55** ; bout sur l'axe 267 px → `reach` **123,15**. ⚠ `reach` mesure désormais l'extension **le long de l'axe**, pas le rayon de la silhouette : l'arme est un éventail, ses langues en biais vont un peu plus loin (125,3 en jeu) | déduit |
| Échelle du sprite | `scale = 51,60 / (17 × 0,881890) = 3,441507` : sous override PNG la largeur vient du **rapport d'aspect de l'image** (112 × 127), pas de `map.w` — piège déjà payé sur la lance de l'Hoplite puis sur l'arme du Golem. La carte texte est passée à 15 × 17 pour tomber à 0,05 % de ce rapport | déduit |
| ⚠ Ce que ça a coûté | **Changer la portée déplace la matrice**, alors que l'arme ne fait aucun dégât : `resolveMelee` applique le **recul propre** et le **décollement des corps** hors de `damage`, donc la géométrie d'une arme sans dégâts reste du gameplay. Les deux premières fois, seules les durées bougeaient. La troisième — la couronne raccourcie de 145,41 à 123,15 — **coûte un duel**, et c'est la seule ligne de vainqueur que le Soleil ait jamais perdue : `lancer vs sun` passe à 2/3. Voir la section dédiée pour la mesure : 139/140 au banc, et trois balayages non monotones qui disent que ce duel ne s'équilibre par aucun paramètre de couronne | mesuré |
| **Huit branches** | `weapon.spokes: 8` — la même arme répétée tous les 45°, sans aucun angle mort. **Elle ne blesse plus** (voir ci-dessous) : c'est aujourd'hui sa silhouette et son bruit, plus son arme | calé (demandé) |
| Rotation | `SPIN × 0,55` (3,17 rad/s), entre le Golem (0,45) et le reste (1,0) | calé |
| **Corps à corps** | **0 — annulé, demandé.** La couronne portait 67,3 % de ses dégâts ; elle n'en porte plus aucun. `Match.damage` sort avant tout effet à montant nul, donc plus de son de touche ni de gerbe — le bruitage `scorch` est rebranché sur le faisceau par `opts.sound`. **Mais l'arme n'est pas inerte pour autant** : `resolveMelee` pose le verrou de mêlée, applique `melee.selfRecoil` et **décolle les deux corps** *hors* de `damage`. Ces clés sont donc bien lues, et toucher la portée déplace la matrice | calé (demandé) |
| **Pouvoir** | *Réchauffement solaire* — horloge de 5 s, rayon **240 px** (plus du tiers de l'arène), 2 de dégât puis **brûlure de 2/s pendant 4 s**, rafraîchie à chaque cycle. La brûlure est le vrai contenu : le pouvoir ne tue pas, il **impose de bouger** | calé |
| **Ultime** | *Rayon solaire* — horloge de **7 s**, **2 s de charge annoncée à l'écran** puis **2,5 s** de faisceau (900 px de long, **124 de large**), 6 dégâts toutes les 0,15 s, soit jusqu'à **96 PV** par tir. De très loin l'attaque la plus lourde du dépôt — le précédent pic était le Séisme du Golem, à 5 | calé (demandé) |
| Animation de charge | Trois anneaux qui **se referment** sur le foyer (un anneau qui s'ouvre dirait qu'une onde part, pas qu'on ramasse de l'énergie), huit éclats qui convergent — un par rayon de la couronne, pour raccrocher l'effet au personnage — et un foyer dont le battement **accélère** avec la charge. Aucun tirage : tout est fonction du temps et de l'index | calé (demandé) |
| Visée de l'ultime | Elle **suit** la cible pendant la charge (**0,55 rad/s**) puis **se fige au tir**. Figer dès le déclenchement rendait l'esquive triviale, suivre jusqu'au bout la rendait impossible | calé |
| Bridage | Il tombe à **25 % de sa vitesse** pendant les **4,5 s** de manœuvre (`f.boost` / `f.boostFactor`, les compteurs génériques du `Fighter`). Il passe désormais une bonne moitié du duel presque arrêté. Pas zéro : un combattant totalement figé se lit comme un bug | calé |
| HUD | l'horloge du Réchauffement et l'état du Rayon (`charging` / `FIRING` / le pourcentage). Aucune stat évolutive : ses dégâts sont fixes | — |

### Le boss retourné — la couronne cesse de blesser

**Demandé**, après coup : « ralentir le déplacement ; le laser plus gros et plus
long, avec une animation de chargement, et un chargement plus long aussi ;
annuler les dégâts au corps à corps ».

Le troisième point est le seul qui compte vraiment : la couronne portait
**67,3 %** de sa production. La supprimer ne l'a pas diminué, elle l'a
**retourné** — deux personnages différents avec la même fiche à un chiffre près.

| | Avant | Après |
| --- | --- | --- |
| Couronne | 5 dégâts, **67,3 %** de sa production | **0**, 0 % |
| Rayon solaire | 18,9 % | **78,7 %** |
| Réchauffement | 13,7 % | 21,3 % |
| Déplacement | 300 px/s | **230** |
| Horloge d'ultime | 13 s | **7 s** |
| Charge | 1,1 s | **2 s** |
| Tir | 1 s | **2,5 s** |
| Largeur du faisceau | 68 px | **124** |
| Dégâts max d'un tir | 42 PV | **96** |
| Suivi pendant la charge | 0,8 rad/s | **0,55** |

**Le levier qui l'a rattrapé n'est pas celui qu'on croit.** Élargir et rallonger
le faisceau ne suffisait pas : à une horloge de 13 s, il passait onze secondes
sur treize sans **aucun** moyen de tuer. C'est `chargeRate` (13 s → 7) qui l'a
remis debout — la **fréquence**, pas la taille. C'est le piège « un banc qui
plafonne dit que le levier n'est pas le bon » dans sa version la plus fine :
l'ablation désignait bien l'ultime, elle ne disait pas quelle poignée tourner.

**Rallonger l'annonce sans ralentir le suivi aurait supprimé l'esquive.** À
0,8 rad/s sur 1,1 s, le rayon rattrapait 0,9 rad de cap — un compromis. Sur 2 s
de charge, il en rattrapait **1,6** et ne ratait plus personne : une annonce
plus longue, censée laisser plus de temps pour sortir de l'axe, l'aurait rendue
*inesquivable*. D'où 0,55, qui ramène le cap rattrapé à 1,1 rad.

**Ce que ça change au jeu, et c'est le personnage aujourd'hui** : le coller ne
coûte plus rien, et c'est précisément de près que le faisceau est inesquivable.
Le duel contre lui ne se joue plus sur la distance mais sur **le moment** — les
deux secondes d'annonce sont toute la fenêtre.

**Deux effets de bord, tous deux signalés par les garde-fous :**

- `scorch`, son son de touche d'arme, est devenu une **recette morte** sans
  qu'une ligne de `data/sound.js` ait bougé — `Match.damage` sort avant
  `hitSound` quand le montant vaut zéro. `sound-check` l'a vue. La correction
  n'était pas de la supprimer mais de la **rebrancher** : le faisceau passe
  `sound: 'hit'` dans `game.damage`, et il sonnait jusque-là comme un projectile
  perdu alors qu'il est devenu le geste principal du personnage. Une panne
  signalée a livré une amélioration. Prix mesuré : sons perdus au plafond de 6 à
  9 sur quinze duels (0,1 % → 0,2 %), le faisceau jouant `scorch` dix-sept fois
  par tir. Sous le coude, plafond inchangé.
- `ultimate.windup` passant de 1,1 s à 2 s, les durées de la recette `flare` et
  le `delay` de sa dernière couche (1,05 → 1,95) ont dû suivre. C'est le seul
  couplage son ↔ fiche du dépôt, documenté des deux côtés — et il vient de se
  payer, ce qui prouve qu'il était réel.

### D'où viennent ses dégâts

Ablation par `opts.kind` dans `Match.damage`, 70 duels (chaque adversaire,
5 seeds × les deux camps) :

| Source | PV | Part |
| --- | --- | --- |
| Rayon solaire | 6 522 | **78,7 %** |
| Réchauffement — brûlure | 1 287 | 15,5 % |
| Réchauffement — coup | 480 | 5,8 % |
| Couronne de 8 rayons | 0 | 0 % |

**Il est entièrement porté par son ultime.** À sa création c'était l'inverse
exact (couronne 67,3 %, rayon 18,9 %) — voir la section précédente. Le piège
« mesurer d'où vient le dégât avant de conclure » a servi deux fois sur ce seul
combattant, et dans les deux sens.

### Le banc

6 seeds × **les deux camps** (le camp A pèse lourd, piège documenté du Golem —
une mesure sur un seul camp ne dirait rien) :

| Adversaire | Victoires | Durée moyenne | (avant le retournement) |
| --- | --- | --- | --- |
| Pistolero | 12/12 | 35,2 s | 25,4 s |
| Ronin | 12/12 | 31,5 s | 24,2 s |
| Hoplite | 12/12 | 48,3 s | 25,7 s |
| Shinobi | 12/12 | 40,2 s | 27,6 s |
| Druide | 12/12 | 38,7 s | 23,7 s |
| Golem | 12/12 | 62,2 s | 42,1 s |
| Mannequin | 12/12 | 42,1 s | 27,3 s |
| **Total** | **84/84** | | |

**Il gagne toujours tout, mais les duels durent ~50 % plus longtemps** : des
dégâts continus sont devenus des fenêtres de rafale, et entre deux tirs il ne
produit plus que la brûlure. C'est visible aussi dans la matrice officielle, où
seules ses lignes ont bougé — un changement confiné à un combattant ne doit
déplacer que **ses** affrontements (invariant 3), et c'est vérifié.

### Ce que son ajout a demandé au moteur

**Une clé, et la preuve qu'elle ne change rien.** `weapon.spokes` est lu par
`Fighter.bladeSegment(k)`, `weaponHit` et `drawWeapon` — donc une retouche au
cœur du calcul de collision, celui-là même dont `bladeSegment` documente qu'un
regroupement différent des mêmes produits a déjà déplacé deux affrontements.

Le geste s'est fait **en deux temps**, et c'est la leçon : poser la clé, la
laisser absente de toutes les fiches, exiger la **matrice identique au caractère
près** — puis seulement ajouter le combattant qui s'en sert. En un seul temps,
un vainqueur déplacé se serait imputé au Soleil et aurait été « corrigé » sur sa
fiche, là où le défaut n'était pas.

Ce qui rend le chemin à une branche exactement l'ancien : `bladeSegment(0)`
n'écrit **pas** `weaponAngle + 0` mais `weaponAngle` lui-même.

Le diff de `tools/matrix-reference.txt` après l'ajout ne contient **que des
ajouts** (invariant 3), et les six autres combattants gardent leur compte
**absolu** de victoires au chiffre près — 13, 13, 12, 11, 10, 4.

### Trois choix de rendu qui ne se devinent pas

- **Aucun ruban de pointe d'arme.** `flair.js` trace le ruban sur
  `f.bladeSegment()`, qui rend **une** branche. Sur une couronne de huit, il
  désignerait un rayon au hasard et ferait croire que les sept autres ne
  comptent pas. La couronne se lit d'elle-même.
- **L'axe d'annonce du Rayon est doublé** : un liseré orange large sous un cœur
  crème fin. En crème simple, il était à peine visible sur la capture de
  contrôle — c'est la leçon du corps clair sur fond clair, appliquée à une
  ligne. Et c'est la seule information dont l'adversaire dispose pour esquiver
  ce qui est, de loin, l'attaque la plus lourde du dépôt.
- **La balle est un dessin, pas un aplat — le premier corps en sprite du
  dépôt.** Elle a d'abord été jaune vif, puis repeinte de l'orange échantillonné
  sur les rayons (parce qu'une bille unie au milieu de huit flammes se lisait
  comme une bille *plus* huit décorations), puis remplacée par sa propre
  maquette. Trois conséquences que le cercle vectoriel n'avait pas : elle se
  dimensionne sur son **disque plein** pour ne pas mentir sur sa hitbox, elle ne
  se cerne pas, et son flash d'encaissement se **pose par-dessus** au lieu de
  remplacer sa couleur — le remplacer effacerait le dessin à chaque coup.
  Toute la palette du personnage est relevée sur cette maquette, repli texte et
  icône compris, ce qui les empêche de diverger.

### La balle ne contient que la sphère — et la couronne y gagne 40 % de portée

**Demandé** : « je veux que la balle contient uniquement la sphère de l'image »,
à la suite de « que l'arme reprenne ce qui y a autour de la balle de l'image ».
Les deux sprites viennent donc de la **même illustration**, coupée en deux : la
sphère est la balle, une de ses langues est l'arme, et les huit langues qui
tournent reconstituent la silhouette du dessin.

**La demande était une correction, et il a fallu comprendre de quoi.** La coupe
précédente tombait à 245 px et gardait autour de la sphère un anneau de halo
pêche. Deux détourages successifs l'avaient laissé passer, et **le resserrer ne
pouvait pas marcher** : la pêche qui touche l'astre (`#f9bf75`, saturation 132)
est aussi saturée que la flamme pâle qu'il faut garder. Le masque se prend par
**topologie**, pas par couleur — remplissage depuis le bord de l'image, les
pixels sombres (luminance < 100) faisant mur : la flamme est exactement ce que
son propre contour brûlé enferme, le halo n'est enfermé par rien.

**Ce que ça change à la mesure, et c'est le vrai enseignement.** Le contour
retracé sur 720 directions donne, avant et après :

| | masque pollué | masque propre |
| --- | --- | --- |
| creux (la sphère) | 245 px | **172 px** |
| pics (les langues) | 278 px | **262 px** (297 au plus long) |
| longueur d'une langue | 33 px, **14 %** du rayon | 90 px, **52 %** |

Le premier relevé était rigoureux et reproductible ; il décrivait fidèlement
« la flamme *plus* son halo ». Il avait produit une balle trop généreuse, une
portée de 104 px, et un commentaire de fiche expliquant très bien pourquoi la
couronne devait être courte. La leçon est dans `docs/PIEGES.md` : **un masque
faux ne rend pas une mesure fausse, il rend une mesure juste sur la mauvaise
forme.**

**La géométrie qui en découle**, à l'échelle `82 / 172 = 0,476744` (rayon du
corps ÷ rayon de la sphère source) :

| source | jeu |
| --- | --- |
| sphère, 172 px (PNG 344 × 344) | `look.radius` 82, `spriteScale` absent |
| base de la langue, 162 px | `handle.length` **77,23** |
| bout de la langue, 305 px | `reach` **145,41** |
| PNG de la langue, 143 × 124 | `head.scale` **4,547406**, `hitbox.from` 0,5311 |

La découpe de l'arme est le secteur de ±18° autour de la plus longue langue
(313,6°), prise **depuis 162 px** — 10 px en deçà de la sphère, pour que la base
chevauche la balle et qu'aucune couture ne se voie — puis tournée pointe vers la
droite au plus proche voisin.

**Et ça déplace la matrice, ce qui est attendu depuis qu'on sait pourquoi.**
`melee.damage` vaut 0, mais `resolveMelee` pose le verrou de mêlée, applique
`selfRecoil` et **décolle les deux corps** *hors* de `Match.damage` : la portée
de la couronne reste de la géométrie de jeu. Le diff tient en **8 lignes, les
huit `… vs sun`** (sept adversaires plus le miroir), **durées seulement** — tous
les vainqueurs sont inchangés, Soleil 21/21, et les six autres gardent leur
compte absolu au chiffre près : 13, 13, 12, 11, 10, 4. Zéro ligne déplacée hors
du Soleil : le changement est confiné, comme l'invariant 3 l'exige.

**Les deux replis texte ont été refaits, et pas de la même façon** — la langue
est une **réduction mécanique** du PNG (15 × 13, à 0,05 % du rapport d'aspect de
l'image contre 2,5 % pour l'ancienne 4 × 9), la sphère est **composée** en
dégradé radial parce que la même réduction y rend du bruit : la maquette dessine
un tourbillon, pas un dégradé, et à 16 px il n'en reste que du grain. L'icône de
sélection, elle, portait encore l'échantillonnage de palette précédent
(`#6f1e12`…) et a été ramenée sur `look.palette` avec les deux autres cartes.

### L'arme devient un huitième de couronne — et coûte au Soleil son premier duel

**Demandé** : « ne modifie plus la balle / modifie l'arme pour que le rendu final
soit comme le png ».

**Le raisonnement tient en une ligne d'arithmétique.** `spokes: 8` répète la même
carte tous les **45°**, et 8 × 45° = 360°. Si la carte est *une langue*, on
obtient huit flammes détachées séparées par huit fentes d'arène blanche — ce
qu'on avait, et ce qui ne ressemblait pas au dessin. Si la carte est le **secteur
de 45° de la couronne**, les huit copies **pavent exactement l'anneau** : la
couronne du jeu n'imite plus la maquette, elle en est le remontage.

Le secteur retenu contient **deux** langues (une longue, une courte), donc la
couronne en porte **seize** là où la maquette en compte treize — infiniment plus
proche que huit, et l'alternance longue/courte vient avec, puisqu'elle est dans
le morceau découpé. Superposés à échelle égale (normalisés sur le rayon de la
sphère), le jeu et la maquette se lisent comme le même objet.

**Où couper est mesuré, pas choisi.** Une frontière de secteur qui tombe au
milieu d'une langue la coupe en deux et la couture se voit tourner. On balaie
donc l'angle de départ au demi-degré en minimisant la matière traversant les
**deux** rayons frontières ; plusieurs coupes sortent à **zéro** — les deux bords
dans des creux, aucune langue sectionnée — et **225° → 270°** est celle dont le
contenu ressemble le plus au reste du dessin.

**La maquette de travail vient de l'historique.** Le PNG de la balle est coupé à
sa sphère : il n'a plus de couronne à découper. Le dessin entier a donc été repris
au commit qui l'a introduit (`assets/sprites/sun-core.png` à `bcfb52d`), et son
masque refait par remplissage depuis le bord. Sa sphère y vaut 178 px là où la
balle est coupée à 172 : deux rendus de la même illustration à deux échelles, sans
conséquence tant que **chacun est ramené par son propre rayon de sphère**.

**La portée tombe de 145,41 à 123,15, et c'est une correction.** Les 145,41
prenaient la plus longue langue du dessin et la plantaient sur l'axe des huit
branches — une couronne à **1,773 × le rayon de la sphère, plus longue que la plus
longue langue de la maquette** (1,629 ×). Le secteur porte 1,525 ×, entre la
médiane du dessin (1,292) et son maximum. Aucun autre secteur ne rend les 145 :
ceux qui contiennent la plus longue langue sont pollués à 9-11 % par le halo
pêche, et donnent de toute façon 124.

#### Ce que ça coûte, et pourquoi rien n'a été calé pour le masquer

**C'est le premier duel que le Soleil perde.** La matrice passe de 21/21 à
**20/21** : `lancer vs sun` devient 2/3, et l'Hoplite monte de 11 à 12. Confinement
respecté — **zéro ligne déplacée hors du Soleil**.

Le mécanisme est connu : `melee.damage` vaut 0, mais `resolveMelee` applique le
**recul propre** hors de `damage`. La seule chose que fasse la couronne, c'est
**reculer le Soleil** quand elle touche. Plus courte, elle le fait moins souvent.

**Mesuré des deux côtés**, 10 seeds × les deux camps sur tout le roster :

| | ancienne couronne | nouvelle |
| --- | --- | --- |
| tout le roster | **140/140** | **139/140** |
| contre l'Hoplite seul, 20 seeds × 2 camps | 40/40 | 39/40 |

Un duel sur 140. Et le duel perdu n'est pas une photo-finish : sur la graine 33,
l'Hoplite gagne en 81 s avec **32/100 PV** restants.

**Trois leviers ont été balayés pour le récupérer. Les trois sont non monotones**,
sur le banc Hoplite à 40 duels :

| levier | valeurs → victoires du Soleil |
| --- | --- |
| `hitbox.radius` | 15 → 39 · 20 → 36 · 25 → **40** · 29 → 36 |
| `melee.cooldown` | 0,8 → 39 · 0,7 → 35 · 0,6 → **40** · 0,5 → 40 |

Le dépôt a une règle pour ça : *un balayage non monotone est du bruit, le
paramètre n'équilibre pas*. Prendre `radius: 25` ou `cooldown: 0,6` parce qu'ils
sortent 40/40 serait **caler sur les graines du banc**, la faute que ce dépôt
surveille — d'autant que la valeur voisine, juste à côté, fait pire que ce qu'on
prétend corriger. **Rien n'a donc été touché** : `hitbox.radius` reste 15,
`melee.cooldown` reste 0,8, et seules les quatre valeurs de géométrie du dessin
ont bougé.

Ce que ça dit du personnage : **le duel Soleil / Hoplite a une queue fragile vers
80 s**, où l'Hoplite esquive assez de faisceaux pour que sa pile de dégâts fasse
le reste. N'importe quelle perturbation de la géométrie du Soleil rejoue quelles
graines y tombent. Si la spécification « il gagne contre tous » doit être rendue
absolue, le levier n'est pas la couronne — c'est **l'horloge de l'ultime**, celle
qui porte 79 % de ses dégâts et dont l'effet, lui, est monotone et documenté
(13 s → 7 à sa création). Ce serait un changement d'équilibrage à part entière, et
il n'a pas été fait ici.

## 🌙 LUNE — `lunar` (le second boss : il est fait pour matcher le Soleil)

> Astre criblé — elle ne touche à rien, c'est le ciel qui tombe.

**Demandé** trois fois, et la troisième a tout tranché :

1. « imagine un nouveau boss LUNAR », « second boss invaincu qui peut match avec
   sun », deux maquettes à départager ;
2. « j'aime pas trop moon, revois-la complètement, conserve sa taille » ;
3. **« remplace le design de la balle par celui de l'arme / supprime l'arme /
   revois l'ultime météorite pour le rendre plus impressionnant, effet chute de
   météorites »**, avec une planche de lune et d'astéroïdes.

Quatrième combattant **inventé** du dépôt. Aucune vidéo, donc **pas un seul
`mesuré`** — tout est `calé` ou `déduit`.

### Ce qu'elle est : le seul combattant sans arme qui gagne

Un corps de **rayon 88, fixe** — la lune criblée de la planche fournie, découpée
à son disque. **Aucune arme** : `reach: 0`, `hitbox.radius: 0`, pas de
`head.sprite`. Elle est le second combattant du roster dans ce cas après le
**Mannequin**, qui est une cible d'entraînement. Elle ne peut pas toucher,
jamais, et **100 % de sa production tombe du ciel**.

| | ☀️ SOLEIL | 🌙 LUNE |
| --- | --- | --- |
| arme | couronne à 8 branches qui ne blesse pas | **aucune** |
| d'où vient le dégât | le faisceau, 79 % | **le ciel, 100 %** (49 % pouvoir, 51 % ultime) |
| ce qui s'annonce | *une ligne*, 2 s | *des zones au sol*, 0,45 s chacune |
| déplacement | 230 px/s, le plus lent | 430 px/s |
| points de vie | **500** — une forteresse | **500** aussi, demandé — et elle ne s'expose jamais |
| face au Mannequin | 3,0 PV/s | **8,4 PV/s**, deux fois et demie le deuxième du roster |

**Météores** (pouvoir, 2,6 s) : trois pierres quittent l'orbite et tombent sur la
cible, annoncées 0,45 s au sol par une ombre qui grossit et un cercle qui se
resserre sur le rayon d'explosion. **Pluie de météores** (ultime, horloge 9 s) :
1,1 s d'annonce pendant laquelle la nuit tombe, le corps gonfle de 12 % et des
pierres se détachent de lui, puis **3,2 s d'averse — vingt-cinq pierres, une
toutes les 0,13 s**, trois ou quatre en l'air en permanence.

### Les valeurs

| Valeur | Détail | Source |
| --- | --- | --- |
| Points de vie | **500** — demandé (« hp à 500 »). 480 → 460 → 280 → 500 ; 280 était le point d'équilibre mesuré, voir plus bas | demandé |
| Corps | `lunar-ball.png`, la lune de la planche fournie, découpée à son **disque** (262 × 262). Contraste médian sur l'arène blanche **5,32**, 9 % de pixels sous le seuil — contre 6,51 pour l'éclipse qu'elle remplace et **1,54 / 48 %** pour la pleine lune cyan, qui était le dessin de l'arme et n'aurait donc *pas* pu servir de corps telle quelle | relevé sur la maquette |
| Taille | `look.radius` **88, fixe**. Sans arme, son corps ne sert plus qu'à occuper l'espace : il bouscule, il bloque, il encaisse. `f.sizeFactor` reste écrit par l'ultime (× 1,12) — de la mise en scène, plus du gameplay | déduit |
| Palette | Cinq bandes de luminance sur `lunar-ball.png` (`edge #1a2632` · `shadow #2f3c48` · `body #5f6d77` · `light #98aab3` · `core #d8f8fc`) **plus une sixième** : le halo de glace `#9df6fb`, relevé à part parce qu'il a été coupé du sprite exprès. La lune est grise ; sa couleur est autour d'elle | relevé sur la maquette |
| **Arme** | **aucune** — demandé. Géométrie vide (`reach`/`hitbox` à 0), ce qui est plus sûr que des dégâts à zéro : la condition de touche devient structurellement impossible, `resolveBodies` maintenant les corps séparés | déduit |
| **Pouvoir** | *Météores* — 2,6 s, trois pierres, 14 par pierre, **explosion de 115 px** (demandée, 78 avant) sur un semis de 150, chute de 0,45 s. **67 % de ses dégâts** | demandé + calé |
| **Ultime** | *Pluie de météores* — 1,1 s d'annonce + 3,2 s d'averse, une pierre toutes les 0,13 s à 8 par pierre, explosion de 86 px, sur une arène passée à la nuit | calé |
| Anticipation | `lead: 0,5` — la pierre vise là où la cible **sera**, sur son cap et sa vitesse courante (`currentSpeed`) | calé |
| Semis | **Aucun tirage** (invariant 2) : chaque pierre est tournée de l'angle d'or par rapport à la précédente | déduit |

### Le banc : trois leviers essayés, deux qui plafonnent

Supprimer l'arme retirait **60,5 %** de sa production. Le personnage s'est donc
retrouvé à **50/50 contre le Soleil** dès la première écriture — c'est-à-dire
imbattable. Trois leviers ont été balayés pour le ramener ; **deux plafonnent**,
et c'est le piège que le dépôt nomme déjà : *un banc qui plafonne dit que le
levier n'est pas le bon.*

| levier | balayage (elle gagne, sur 30) | verdict |
| --- | --- | --- |
| dégâts par pierre | 6/7 → 28 · 8/9 → 29 · 9/10 → 30 · 11/12 → 30 | **plafonne** : même à moitié moins, elle gagne |
| rayon d'explosion | 40/46 → 29 · 48/54 → 30 · 58/64 → 30 · 70/76 → 30 | **plafonne** |
| vitesse | 260 → 30 · 300 → 30 · 360 → 30 · 430 → 30 | **plat** : ce n'est pas du kiting |
| **points de vie** | 250 → 13 · 285 → 16 · 320 → 21 · 380 → 26 | **monotone** — le seul vrai |

**Pourquoi les deux premiers plafonnent, et c'est la vraie découverte.** Son taux
de touche ne dépend de rien d'autre que de **la vitesse et la taille de la
cible**. Relevé par adversaire, avant correction :

| adversaire | ses PV/s | touches par duel |
| --- | --- | --- |
| Hoplite | 2,1 | 8,9 |
| Pistolero | 2,4 | 8,9 |
| Golem | 4,3 | 18,0 |
| **Soleil** | **13,0** | **44,1** |

Le Soleil est le plus **lent** du roster (230 px/s) *et* le plus **gros** après
elle (rayon 82). Un pouvoir qui tombe sur une zone le touche donc toujours —
et n'importe quel affaiblissement global la faisait perdre contre les six
**avant** de la faire perdre contre lui. Deux corrections asymétriques ont été
nécessaires :

- **la zone se mesure de centre à centre** et non de bord à bord (le seul écart
  du dépôt, voir `docs/PIEGES.md`) : en bord à bord, la surface de capture vaut
  `(blast + rayon)²`, donc **deux fois plus grande** pour le Soleil que pour la
  norme. 13,0 → 7,4 PV/s contre lui ;
- **le temps de chute passe de 0,75 s à 0,45 s** : la fenêtre d'esquive ne suffit
  plus à un rapide qui ne regarde pas le sol. Contre les six, 1,3–3,0 → 3,0–5,6
  PV/s ; contre le Soleil, qui ne l'esquivait déjà pas, presque rien.

Alors seulement `maxHp` est devenu un levier utilisable, et **280 PV** donne
**27/50** sur 25 graines × les deux camps. Le chiffre est bas pour un boss et
c'est cohérent : *elle ne prend aucun risque*, donc elle ne peut pas aussi porter
la barre du Soleil.

**Ce qu'elle garde : 167 duels sur 168** contre les sept autres (12 graines × les
deux camps, chaque adversaire), une seule graine perdue au Shinobi. Le Soleil est
à 139/140 et en perd une à l'Hoplite : **chaque boss lâche exactement une graine
à un des six**, ce qui est le partage le plus symétrique que le dépôt ait eu.

### Le réglage demandé après coup : 500 PV et une zone de 115

**Deux demandes, et la seconde était une observation juste** : « hp à 500 /
augmente la zone de météorite pour les attaques de base, ça ne touche quasiment
jamais ». Le relevé du taux de touche **par pierre** le confirmait au chiffre
près — 8 graines × les deux camps :

| cible | `blast: 78` | **`blast: 115`** |
| --- | --- | --- |
| Pistolero · Druide | 10–12 % | **22 %** |
| Ronin · Shinobi · Hoplite | 11–14 % | **22–27 %** |
| Golem | 15 % | **40 %** |
| Mannequin (immobile ou presque) | 19 % | **44 %** |
| Soleil | 45 % | **56 %** |

Une pierre sur dix, c'était en effet « quasiment jamais ». C'était le prix de la
mesure **de centre à centre**, adoptée pour que le cercle dessiné ne mente pas :
elle avait retiré d'un coup toute la marge que le rayon de la cible offrait
gratuitement. Le cercle grandit, il continue de dire la vérité. `spread` suit de
92 à **150**, sinon les trois cercles se recouvrent presque entièrement et on lit
une tache au lieu de trois cratères.

**Ce que les deux ensemble ont coûté, et c'est à savoir.** Le duel des boss
passe de **27/50 à 50/50** : LUNE ne le perd plus jamais, et la spécification
« les deux boss ne se départagent qu'entre eux » n'est plus vraie — il y a
désormais un vainqueur. Elle reste par ailleurs à **140/140** contre les sept
autres, et le Soleil n'a pas bougé (139/140 contre les six) : ce n'est pas lui
qui a baissé, c'est elle qui est passée devant.

La répartition de ses dégâts bascule avec : **Météores 67 % / Pluie 33 %**, là
où c'était 49/51. Le pouvoir est devenu sa source principale, ce qui est
exactement ce que la demande visait.

**Le retour à un partage tient en un chiffre**, et le balayage est monotone :
`maxHp` 280 → 27/50, 500 → 50/50. Rien d'autre n'est à toucher — les deux autres
leviers plafonnent, c'est mesuré juste au-dessus.

### L'image : la densité fait l'impression, pas la puissance

Première écriture de l'averse : **treize pierres, une toutes les 0,26 s, 15 de
dégâts**. À l'écran, une seule pierre en l'air à la fois — ça se lisait comme un
pouvoir un peu plus rapide, pas comme une chute de météorites. Doublées en nombre
et divisées par deux en dégâts (**0,13 s / 8**), la production est la même au banc
et l'image n'a rien à voir : trois ou quatre pierres en vol en permanence.

Deux autres réglages sont **purement d'image** et ne touchent aucun chiffre de
combat :

- **la hauteur de chute** est passée de 330/400 à 210/250. `drawOver` est clippé
  au cadre de l'arène : à 400, la pierre passait les trois quarts de sa chute
  **hors du cadre**, donc invisible. On ne voyait qu'un cercle au sol et un
  caillou qui apparaît ;
- **la traînée est doublée** — un liseré large en `light` et un cœur fin en
  `glow`. C'est le piège du trait clair sur arène blanche, celui de l'axe du
  Rayon solaire : le liseré porte de jour, le cœur porte de nuit, aucun des deux
  ne suffit aux deux fonds.

### Les trois dessins, et ce qu'ils sont devenus

La planche fournie porte une lune criblée et cinq astéroïdes dans le même trait.
Quatre en sont tirés — le corps et **trois silhouettes de météore**, choisies par
compteur : une seule forme, répétée vingt-cinq fois, se lit comme un motif et non
comme une averse.

Le détourage est fait **par topologie et non à la couleur** : masque `luminance
< 215` moins les pixels de halo (bleus *et* clairs), plus grande composante,
trous rebouchés. Le halo cyan est donc coupé de tous les sprites — et rendu au
jeu par `look.aura` et par les traînées, comme le halo pêche du Soleil. Contrôle
du dépôt appliqué : composition sur fond clair **et** sur fond sombre avant de
déclarer le détourage propre.

**Les deux maquettes précédentes sont supprimées** (`lunar-dark.png` et
`lunar-lit.png`) : la demande remplace le corps par le dessin de l'arme, et
l'arme par rien. Plus aucune clé ne les lit.

### Les versions précédentes (historique)

**Version 1 — le cycle de phases.** Un nombre invisible, `f.state.ill`, de 0 à 1
et retour sur 12 s, qui réécrivait rayon (44 → 96), vitesse (600 → 250) et
contact (1 → 7). *Marée* attirait tout le monde ; *Éclipse* était le seul ultime
du dépôt **sans annonce**. Elle était à 22/24 et **sans silhouette** — arme
invisible, pouvoirs réduits à un anneau. Deux mesures en restent :

- **la Marée a infligé 0 PV sur 24 duels** — écrite « écrase ceux que l'onde
  trouve *dans* le corps », condition vraie **aucune fois sur 45 pulsations**,
  parce que `resolveBodies` sépare les corps à chaque pas. Trouvée par ablation
  (`opts.kind`), pas à l'œil ;
- **le chiffre de PV a forcé `hpStroke`** : sous les digits, la proportion
  clair/sombre traversait tout le cycle (6/91 %, 44/44 %, 89/0 %).

**Version 2 — l'anneau de débris.** Corps d'éclipse, trois satellites de 44 px en
orbite à 154 px (`spokes: 3`), Météores en pouvoir, Éclipse en ultime. 460 PV.
Elle a tenu une session, et tout ce qu'elle a appris sert encore : le semis par
angle d'or, la chute simulée par une hauteur au-dessus de l'ombre, la nuit
d'arène, et le fait qu'une orbite doit rester **hors du corps quand le corps
enfle** — qui ne s'applique plus, faute d'orbite.

## ☄ COMÈTE — `comet` (sans arme : son corps est l'arme)

> Sans arme — son élan est tout ce qu'elle a, et il se dépense.

**Demandé** : « je veux créer un nouveau personnage sans arme qui peut se
déplacer très vite ».

Cinquième combattant **inventé** du dépôt. Aucune vidéo, donc **pas un seul
`mesuré`** — tout est `calé` ou `déduit`.

### Les deux moitiés de la demande n'en font qu'une

« Sans arme » et « très vite » auraient pu être deux traits indépendants : un
combattant rapide dont les dégâts viennent d'ailleurs (c'est LUNE, mobile et
dont tout tombe du ciel). Le parti pris ici est l'inverse : **puisqu'elle n'a
pas d'arme, sa vitesse doit en être une.** Tout le reste en découle, y compris
ce qui la rend difficile à équilibrer.

**Le troisième combattant sans arme, et le premier dont le corps frappe.**

| | 🎯 MANNEQUIN | 🌙 LUNE | ☄ COMÈTE |
| --- | --- | --- | --- |
| pourquoi pas d'arme | il ne doit rien faire | tout tombe du ciel | **son corps est l'arme** |
| d'où vient le dégât | nulle part | le ciel, 100 % | **le contact, 100 %** |
| qui appelle `game.damage` | personne | son module | **son module** |
| vitesse | 430 px/s | 430 px/s | **700 à 1 610 px/s** |
| rayon | 41 | 88 | **34, le plus petit** |

### Les valeurs

| Valeur | Détail | Source |
| --- | --- | --- |
| Corps | rayon **34** — le plus petit du roster (41 la norme, 50 le Golem, 82 le Soleil). Un corps étroit est **plus dur à toucher**, et c'est sa seule défense : elle suit la norme de 100 PV, sans aucune réduction. **Pas plus petit** : la police du chiffre de PV fait 34 px, donc « 100 » déborderait d'une bille de moins de 68 px | calé |
| Palette | `look.palette` — quatre teintes (`edge #3d0b2a` · `body #d63b8f` · `light #ff8ad0` · `core #fff0fa`). Le magenta est la **seule famille libre** du roster : orange pris deux fois (Ronin, Soleil), bleu au Pistolero, vert au Druide, violet à l'Hoplite, gris au Golem et à LUNE, noir au Shinobi, blanc au Mannequin. Vérifié teinte par teinte — deux corps de la même famille qui se croisent à 700 px/s sont indiscernables | calé |
| Déplacement | **700 px/s**, le plus rapide du roster (655 au Pistolero, précédent record) — et ce n'est que son **plancher** : multiplié par l'élan, il monte à **1 050** en pointe ordinaire et **1 610** pendant la Rentrée, sur une arène de 628 px. `turnRate: 2.8`, le plus haut aussi : à cette vitesse, un cap qui pivote lentement décrit des courbes si larges qu'elle **manquerait sa cible en tournant autour** | calé |
| **Arme** | **aucune** — `reach: 0`, `hitbox.radius: 0`, pas de `head.sprite`. La géométrie **vide** du Mannequin : la condition de `weaponHit` devient structurellement impossible, et `resolveMelee` ne tourne donc **jamais** pour elle | déduit |
| **Choc cinétique** | sa mécanique de base et sa seule source de dégâts : au contact, `kinetic.damage × f.state.rush`, verrou de **1,15 s**, recul de 240 porté **dans son sens de marche**, et un contrecoup de 130 sur elle-même | calé |
| Marge de contact | **8 px explicites**, et c'est un piège déjà payé : un test `distance <= r1 + r2` est **toujours faux et ne crie pas**, `resolveBodies` séparant les corps à chaque pas. La Marée de la première LUNE a infligé **0 PV sur 24 duels** pour cette exacte raison | déduit |
| **L'élan** | `f.state.rush`, **un seul nombre** qui est à la fois facteur de vitesse et facteur de dégâts : il monte de 1 à **1,5** en 6 s tant qu'elle ne touche personne, et **chaque choc lui en retire 0,3**. Elle est donc la plus dangereuse quand elle vient de **rater** | calé |
| Le rapport qui fait le personnage | la rampe rend 0,083/s, donc les 0,3 d'un choc se regagnent en **3,6 s**, soit trois verrous sur quatre. C'est ce qui l'empêche de rester au plafond en frappant — changer l'un des trois sans recalculer les autres casse la boucle **sans rien dire** | déduit |
| **Pouvoir** | *Coup de fouet* — toutes les 6 s, l'élan **saute à 1,9**, au-dessus de son propre plafond. **Aucune durée** : ce qu'il donne, elle le garde jusqu'au prochain choc. `Math.max` et non une affectation, sinon il **redescendrait** l'élan tenu de la Rentrée | calé |
| **Ultime** | *Rentrée* — 4,5 s : élan **tenu** à 2,3, verrou à 0,4 s, et surtout **les chocs ne coûtent plus rien**. Un ultime qui **retire une contrainte** au lieu d'ajouter une attaque, ce qui est exactement ce qu'appelle un personnage bâti sur une ressource. Horloge de 12 s, +4 par touche | calé |
| Pas d'annonce | assumé : le Rayon solaire s'annonce 2 s parce qu'il est inesquivable une fois parti ; la Rentrée n'est qu'une suite de chocs, chacun esquivable. Une annonce n'aurait rien donné à esquiver, elle aurait retardé | déduit |
| Son | trois recettes, **aucune partagée** : `slam` (le choc — transitoire large puis corps grave court), `surge` (la relance — l'exacte inversion : aucun transitoire, bornes qui **montent**), `boom` (la Rentrée — détonation dont l'aigu meurt le premier). `pitch: 1.15`, le plus haut après le Shinobi | calé |
| Pas de `swing` | et ce n'est pas un oubli : une voix tenue se pilote sur `weaponAngle`, or son arme n'existe pas — `weapon.spin` vaut 0, l'angle ne bouge jamais, la voix resterait collée au silence. Ce qu'il faudrait entendre chez elle est son **élan**, que le banc ne sait pas encore jouer | déduit |
| Mise en scène | le **fuseau** (`flair.smear`, 34 px de large) est sa queue — c'est le seul mécanisme qu'un combattant sans arme puisse porter, `ribbon` suivant une pointe d'arme qui serait ici le centre de sa bille. Les **images fantômes** ne s'allument que pendant la Rentrée (`f.ghosting`, compteur générique lu par `flair.js` seul, donc sans effet possible sur un vainqueur) | calé |
| HUD | `Momentum: ×1.42` et `Impact: 4` — le dégât est affiché **calculé**, seule façon de rendre visible une puissance qui bouge en continu là où les autres montent par paliers | — |

### L'équilibrage : un levier raide, et deux façons de le tirer

**Première écriture : beaucoup trop forte.** `kinetic.damage: 4`, verrou 0,9 s →
**63 victoires sur 72** contre les six (8 graines × les deux camps), et
**4,2 PV/s** face au Mannequin, record du roster devant le Ronin (3,3).

Le balayage du dégât est **monotone et très raide** — c'est la conséquence
directe de sa mécanique : un dégât multiplié par un facteur continu **amplifie**
chaque réglage au lieu de l'amortir.

| `kinetic.damage` | 4 | 3 | 2,8 | 2,5 | 2 |
| --- | --- | --- | --- | --- | --- |
| victoires contre les six | **88 %** | 63 % | 37 % | 32 % | **2 %** |

**Un point de dégât couvre presque toute la bande du roster.** À 2, elle ne
gagne plus un seul duel contre cinq des six ; à 4, elle les gagne tous sauf
contre le Golem.

Le verrou de touche déplace autant, à dégât égal (3) :

| `kinetic.cooldown` | 0,9 s | 1,05 s | 1,15 s |
| --- | --- | --- | --- |
| victoires contre les six | 63 % | 56 % | **51 %** |

Les deux ont été balayés **séparément puis remesurés ensemble** (*deux leviers
qui marchent ne s'additionnent pas*). Le verrou a été retenu pour la dernière
marche, et c'est un choix de **lisibilité** autant que d'équilibrage : baisser
le dégât rendait ses coups illisibles (3 PV affichés sur un corps à 100), alors
qu'espacer les chocs garde des coups qui **se voient** et laisse l'adversaire
respirer entre deux passages.

### Le banc final — 8 graines × les deux camps

`kinetic.damage: 3`, `kinetic.cooldown: 1.15` :

| Adversaire | Victoires | Durée moyenne |
| --- | --- | --- |
| Ronin | **14/16** | 28,7 s |
| Druide | **14/16** | 31,4 s |
| Shinobi | 9/16 | 32,6 s |
| Hoplite | 8/16 | 37,1 s |
| Pistolero | 3/16 | 29,9 s |
| Golem | **1/16** | 40,5 s |
| **Total contre les six** | **49/96 — 51 %** | |
| Mannequin | 16/16 | 29,1 s → **2,9 PV/s** |
| Soleil | 0/16 | 40,0 s |
| LUNE | 0/16 | 26,3 s |

**Sa ligne est structurellement dispersée, et c'est le personnage.** De 1/16 à
14/16 selon l'adversaire, là où les six autres se tiennent dans une fourchette
bien plus serrée. La raison tient en une phrase : **elle doit venir au contact
pour exister**. Contre un tireur qui recule (Pistolero), elle passe son duel à
traverser l'arène ; contre un duelliste qui vient à elle (Ronin), elle ne rate
rien.

**Le Golem à 1/16 est le cas extrême**, et il est structurel plutôt que mal
calé : son dégât ne s'adapte pas à la barre d'en face, or le Golem en a le
double (200 PV) et punit la proximité de deux façons (onde sismique, éclats).
Il lui faudrait environ **soixante-six chocs réussis** pour l'abattre. À ne pas
« corriger » chez elle : le levier qui la remonterait contre lui la rendrait
imbattable contre les quatre autres — le balayage ci-dessus le montre au
chiffre près.

**Les deux boss la battent 16 fois sur 16 chacun** : leur spécification tient,
son ajout ne l'a pas entamée.

### Ce que son ajout a demandé au moteur

**Rien.** Pas une ligne dans `game/`, pas une clé générique nouvelle. C'est la
preuve que l'invariant 12 tenait : la géométrie vide venait du Mannequin, les
compteurs `boost`/`boostFactor` et `ghosting` de l'invariant 7, le fuseau de
`flair.js` existait pour le Dragoon, et `opts.sound` — qui fait sonner une arme
que le moteur ne reconnaît pas — avait été ouvert pour le Rayon solaire.

Deux choses méritent d'être connues avant d'y revenir :

- **`f.boost` est utilisé comme un bail, pas comme une durée.** Le module le
  remet à 0,2 s **à chaque image** au lieu de poser une longue durée une fois :
  le moteur le décompte dans `Fighter.step()` (invariant 7, il ne sait pas
  pourquoi), donc le bail se referme tout seul en deux dixièmes de seconde dès
  que le module cesse de tourner — mort, fin de duel, parade. Une durée longue
  posée une fois aurait laissé la Comète lancée bien après qu'elle a cessé
  d'exister.
- **Son verrou de touche est à elle.** `resolveMelee` ne tournant jamais pour
  elle, le moteur ne pose **aucun** `meleeCd` : sans `f.state.hitCd`, un contact
  qui dure trois images ferait trois coups. C'est la même leçon que la couronne
  à huit branches du Soleil — le garde-fou se pose **une fois pour toutes**,
  avant la recherche de cible.

### La matrice

Ajoutée **en queue de `ROSTER`**, comme le veut l'invariant 3 : le diff de
`tools/matrix-reference.txt` ne contient **que des ajouts** — dix lignes, zéro
suppression. Les neuf combattants existants gardent chacune de leurs lignes au
caractère près ; leurs comptes ne montent que des lignes neuves (+2 au
Pistolero, +3 au Golem, +1 aux quatre autres).

Sa ligne de matrice vaut **12/27**. Elle y est **camp B partout sauf contre
elle-même**, et le camp A pèse lourd : cette ligne **sous-estime** sa force,
c'est le banc sur les deux camps qui la mesure.

## La norme passe à 200 PV, le Golem à 400 (historique)

**Demandé, à l'époque — voir la section suivante pour l'état courant.**
`MATCH.maxHp` : 100 → 200, et `GOLEM.maxHp` : 200 → 400. Une seule
constante et une seule fiche — rien d'autre n'a eu à bouger, parce que le dépôt
s'interdit depuis longtemps de diviser par une constante de PV : tout ce qui
affiche une proportion de vie lit `Fighter.maxHp` (plaque du HUD, cerclage rouge
de danger à un quart des PV).

**Deux valeurs ont suivi, et il fallait y penser :**

- **Le Clone d'ombre, 25 → 50 PV.** Sa fiche documente le chiffre comme « un
  quart d'un vrai combattant », et c'est ce **rapport** qui borne le pouvoir —
  le laisser à 25 en aurait fait un huitième de combattant, donc un Clone
  d'ombre bien plus faible qu'il n'a jamais été voulu, sans qu'aucune valeur du
  Shinobi n'ait changé.
- **Le Mannequin perd son `maxHp` explicite.** Il portait 200 quand la norme
  était 100 ; la norme étant passée à 200, cette clé ne faisait plus que
  recopier le défaut. Une valeur de fiche qui recopie le défaut est une occasion
  de divergence silencieuse, pas une intention. Son banc de DPS est intact : il
  a toujours 200 PV, donc « 200 PV ÷ durée » reste la bonne lecture.

### Ce que ça a fait à l'équilibrage, et c'est considérable

Les duels durent **40,6 s en moyenne au lieu de ~26**, et **les 28 lignes de la
matrice ont bougé** — c'est le seul changement du dépôt à ce jour qui ne soit
confiné à personne.

| | Avant | Après |
| --- | --- | --- |
| Pistolero | 16 | **19** |
| Shinobi | 8 | **17** |
| Druide | 12 | 12 |
| Golem | 14 | 12 |
| Hoplite | 10 | 9 |
| Ronin | 12 | **5** |

**Deux basculements, et tous deux s'expliquent par la durée :**

- **Le Ronin s'effondre (12 → 5).** Ses dégâts plafonnent — `2 × spin`, avec
  surchauffe au sommet — donc il a un **débit maximum** qu'aucune durée ne
  relève. Doubler les barres de vie double le temps qu'il lui faut pour tuer
  sans rien lui donner en échange. C'est le combattant du roster le plus
  pénalisé par une partie longue.
- **Le Shinobi bondit (8 → 17).** Ses clones **s'invoquent entre eux** : la
  population double à chaque tour d'horloge partagée. Un duel plus long n'est
  pas linéairement meilleur pour lui, il est **exponentiellement** meilleur — un
  doublement de plus.

Le banc de DPS contre le Mannequin, lui, ne bouge pas d'un dixième (Pistolero
6,1, Shinobi 5,9, Ronin 5,8, Hoplite 5,5, Druide 5,3, Golem 2,5 PV/s) : le
Mannequin ne riposte pas, donc doubler les PV des deux camps n'y change rien.
**C'est ce qui prouve que le bouleversement vient de la durée, pas de la
production.**

## Neon Shadow supprimé, la norme redescend à 100 PV

**Deux changements demandés au même relevé.** Neon Shadow (fiche, module,
pixel-art, override PNG, recettes de son `warp`/`eclipse` devenues orphelines)
a été **retiré du dépôt** — ni fiche, ni liste `DISABLED`, même traitement que
les sept éléments de l'archive. Il était en **queue de `ROSTER`** : sa
suppression ne déplace donc **aucune autre ligne** de la matrice, elle la
raccourcit seulement (invariant 3).

En même temps, `MATCH.maxHp` repasse à **100** et `GOLEM.maxHp` à **200** — la
division inverse de la section précédente, chiffre pour chiffre : la norme
double reste le double, le Clone d'ombre reste un quart d'un combattant
(50 → 25).

### L'effet, mesuré sur les six mêmes combattants

Comparaison **à composition égale** : les six affrontements qui existaient déjà
avant l'ajout de Neon Shadow, rejoués aux deux normes. Rien d'autre n'a changé
entre les deux colonnes.

| | 200 PV (avant) | 100 PV (après) |
| --- | --- | --- |
| Pistolero | 16 | 15 |
| Druide | 10 | 11 |
| Golem | 9 | 11 |
| **Ronin** | **4** | **10** |
| Hoplite | 9 | 9 |
| **Shinobi** | **15** | **7** |

Les duels durent **26,3 s en moyenne au lieu de ~41,9** — et les deux mêmes
combattants rebasculent, dans l'**autre sens** que la section précédente :

- **Le Ronin remonte (4 → 10).** Ses dégâts plafonnent (`2 × spin`, avec
  surchauffe au sommet), donc il profite de tout raccourcissement : le duel se
  termine avant que la barre adverse n'ait eu le temps de dépasser son débit.
- **Le Shinobi s'effondre (15 → 7).** Ses clones s'invoquent entre eux à chaque
  tour d'horloge partagée — un duel deux fois plus court n'a plus le temps de
  laisser la population doubler autant de fois.

C'est la **même mécanique que dans l'autre sens** (voir ci-dessus) : ce n'est
pas la production de l'un ou de l'autre qui a changé, c'est la fenêtre de temps
dont chacun dispose pour la faire valoir.

**Le banc de DPS contre le Mannequin, lui, ne suit pas la division — et c'est
instructif.** L'intuition dit que diviser les deux PV par deux ne change rien à
un rapport production/durée ; la mesure dit le contraire pour qui n'a pas une
production **constante** :

| | 200 PV | 100 PV | Écart |
| --- | --- | --- | --- |
| **Ronin** | 5,79 | 5,61 | **−0,18** |
| Golem | 2,55 | 2,25 | −0,30 |
| Pistolero | 6,11 | 5,31 | −0,80 |
| Druide | 5,27 | 4,19 | −1,08 |
| Hoplite | 5,48 | 4,27 | −1,21 |
| **Shinobi** | 5,87 | 3,96 | **−1,90** |

Les deux extrêmes sont les deux combattants **à production non constante** de
tout le roster, et pour des raisons opposées : le Ronin (dégâts plafonnés,
`2 × spin` avec surchauffe) est celui qui bouge le **moins**, parce qu'un
combat plus court le prend avant que son plafond ne pèse ; le Shinobi (clones
qui s'invoquent entre eux) est celui qui bouge le **plus**, parce qu'un combat
plus court lui laisse **moins de temps pour doubler sa population**. Golem et
Pistolero, à production plus régulière, se rapprochent d'un rapport constant
sans y être tout à fait. **Le banc de DPS n'est donc pas un invariant** : il
mesure la production **dans la fenêtre de temps qu'un adversaire donné lui
laisse**, pas une constante du combattant.

## Les dégâts de tous les combattants, divisés par deux

**Demandé, sur les six combattants qui frappent** (le Mannequin en est déjà à
zéro). Contrairement à la norme de PV, il n'y a **aucune constante à toucher**
côté moteur : `Match.damage()` ne connaît aucun combattant, chaque dégât vient
d'une valeur de fiche (invariant 12). La division s'est donc faite **fiche par
fiche**, une par une, sur chaque source de dégâts.

### Ce qui a été divisé, combattant par combattant

| Combattant | Source | Avant | Après |
| --- | --- | --- | --- |
| Pistolero | mêlée/balle (`f.stacks`, plancher et cadre) | 3,00 → 8,00 | 1,50 → 4,00 |
| | Éclat de givre (Champ de givre) | 2 | 1 |
| | Tic du Champ de givre | 1 | 0,5 |
| Ronin | mêlée (`Damage = 2 × Spin`) | `2 × Spin` | `1 × Spin` |
| | Brûlure au contact (`onHit.dot`) | `1 × Spin`, plancher 1 | `0,5 × Spin`, plancher 0,5 |
| | Tic de l'Aura de braise | 1 | 0,5 |
| | Brûlure de l'Aura de braise (code du module, pas la fiche — voir plus bas) | `1 × Spin`, plancher 1 | `0,5 × Spin`, plancher 0,5 |
| Hoplite | mêlée/chute (`f.stacks`, plancher et cadre) | 8,00 → 16,00 | 4,00 → 8,00 |
| | Tic du Dôme de drain | 1 | 0,5 |
| Shinobi | mêlée | 2 | 1 |
| | Rafale de tornade (`f.stacks`, ramené à l'échelle des PV) | `stacks / 2`, plancher 2 | `stacks / 4`, plancher 1 |
| | Shuriken de SHURIKEN TORNADO | 3 | 1,5 |
| Druide | mêlée | 2 | 1 |
| | Tic de l'Orage de ronces | 1 | 0,5 |
| | Orbe de ronce | 2 | 1 |
| | Orbe majeure | 6 | 3 |
| Golem | mêlée | 8 | 4 |
| | Onde sismique | 6 | 3 |
| | Impact du Séisme | 10 | 5 |
| | Éclat de roche | 3 | 1,5 |

**Le Ronin est le seul cas où la division ne touche pas un nombre, mais un
multiplicateur.** Sa Spin Speed (0,80 à 3,00 tour/s) est **mesurée** et pilote
aussi le rendu (vitesse de rotation de la lame) : la diviser aurait changé ce
que l'œil voit, pas seulement ce que la cible encaisse. `Damage = 2 × Spin`
devient donc `Damage = 1 × Spin` — le multiplicateur porte toute la division,
la Spin Speed ne bouge pas d'un chiffre.

**Le Pistolero et l'Hoplite divisent trois valeurs ensemble, pas une seule.**
Leur dégât est `f.stacks` (plancher compris), et `f.stacks` part d'une valeur
de départ (`progression.stack`) qui grimpe par paliers (`onHit.stackGain`)
jusqu'à un plafond (`onHit.stackMax`) : diviser seulement le départ aurait
laissé un plafond deux fois trop haut ; diviser aussi le plafond sans le gain
aurait fait grimper deux fois moins de coups pour l'atteindre. Départ, gain et
plafond sont donc divisés **ensemble**, pour que le nombre de coups nécessaires
pour plafonner reste le même — exactement la règle déjà posée quand l'Hoplite
était passé de +2,00 à +1,00 par touche. Le Pistolero tire aussi par un
**second** `onHit` (celui de la balle, dupliqué de celui du corps à corps
parce que les deux nourrissent la même pile) : les deux ont dû suivre.

**Une brûlure du Ronin est codée dans son module, pas dans sa fiche — le seul
cas du roster.** `game/abilities/bladesman.js` pose une seconde brûlure
(distincte de `weapon.melee.onHit.dot`) directement dans son code, avec la
même formule `Math.max(1, Math.round(f.stacks))` recopiée en dur. Ce n'est pas
une exception voulue à l'invariant 12 — c'est un writeoff qui traîne depuis
l'ajout de l'Aura de braise — mais elle inflige de vrais dégâts, donc elle a dû
être divisée comme le reste : `Math.max(0.5, Math.round(f.stacks * 0.5))`.

### L'effet sur la matrice — le même levier que les PV, dans l'autre sens

Diviser les dégâts a le même effet que diviser les PV en sens inverse : les
duels s'**allongent**, exactement comme les diviser les avait raccourcis à la
section précédente. Comparaison à composition égale, sur les six mêmes
combattants :

| | Dégâts pleins (avant) | Dégâts divisés par deux (après) |
| --- | --- | --- |
| **Shinobi** | 7 | **16** |
| Pistolero | 13 | 13 |
| Druide | 11 | 12 |
| Hoplite | 9 | 10 |
| Golem | 11 | 8 |
| **Ronin** | 10 | **4** |

Les duels durent **41,2 s en moyenne au lieu de 26,3** — presque le retour à la
durée de l'ère à 200 PV (41,9 s), et c'est cohérent : diviser les dégâts par
deux à PV constants revient, pour le temps que met un duel à se conclure, à peu
près à doubler les PV à dégâts constants. **Les deux mêmes combattants
rebasculent, mais cette fois dans le même sens qu'avant** (pas en miroir comme
lors du changement de norme de PV) : un duel plus long, quelle qu'en soit la
cause, profite toujours au Shinobi et coûte toujours au Ronin.

- **Le Shinobi bondit (7 → 16).** Ses clones s'invoquent entre eux : un duel
  deux fois plus long lui laisse deux fois plus d'occasions de faire doubler sa
  population, et la population, elle, ne dépend d'aucun dégât — seulement du
  temps.
- **Le Ronin s'effondre (10 → 4).** Son débit plafonne (`Damage = Spin`, avec
  surchauffe) : un duel deux fois plus long ne lui donne pas deux fois plus de
  dégâts, seulement deux fois plus de temps pour se faire toucher.

### Le banc de DPS, encore une fois pas un invariant

| | Dégâts pleins | Dégâts divisés par deux | Écart |
| --- | --- | --- | --- |
| Pistolero | 5,31 | 3,26 | −2,05 |
| **Ronin** | 5,61 | 3,11 | **−2,50** |
| Shinobi | 3,96 | 3,11 | **−0,85** |
| Hoplite | 4,27 | 2,99 | −1,28 |
| Druide | 4,19 | 2,76 | −1,43 |
| Golem | 4,49 | 2,59 | −1,90 |

Même leçon que pour les PV, rejouée en miroir : aucun n'a exactement perdu la
moitié de son DPS contre le Mannequin, parce que le DPS mesure une production
**dans la fenêtre que le combat lui laisse**, pas une constante. Le Ronin, à
débit plafonné, perd le plus en valeur absolue mais dans un rapport proche de
la moitié attendue ; le Shinobi, dont la production compose avec le temps,
perd le moins — la fenêtre plus longue compense une bonne part de la division.

## Rééquilibrage confiné au Golem et au Ronin

Demandé après la division des dégâts par deux ci-dessus : les deux plus
faibles du roster réduit à six actifs (Golem 8/18, Ronin 4/18) restaient les
deux plus faibles. Confiné aux deux, sur un banc dédié — dix duels par
adversaire, cinq avec la cible au camp A et cinq au camp B, pour retirer le
biais de camp déjà documenté plus haut — plutôt que sur la matrice officielle
à 3 seeds, trop grossière pour un réglage fin.

### Golem : la vitesse ne suffit pas seule, le dégât si — et les deux combinés font mieux que leur somme

`movement.speed` était le premier levier nommé dans le commentaire de la
fiche elle-même : « le premier chiffre à remonter si le banc montre qu'il ne
touche jamais un tireur ». Balayé seul, contre les cinq autres actifs :

| `movement.speed` | Total /50 | vs Pistolero | vs Shinobi |
| --- | --- | --- | --- |
| 370 (avant) | 12 | 0/10 | 0/10 |
| 420 | 13 | 0/10 | 0/10 |
| 500 | 14 | 0/10 | 0/10 |

Plat — piège déjà nommé, « un banc qui plafonne dit que le levier n'est pas
le bon ». Remonter la vitesse le fait rattraper ses cibles, mais ne le fait
pas gagner une fois arrivé : sans plus de dégât au contact, il perd quand même
la course aux PV. `weapon.melee.damage`, en revanche, reprend exactement la
pente documentée avant la division par deux (~11 victoires/100 par point) :

| `weapon.melee.damage` | Total /50 |
| --- | --- |
| 4 (avant) | 12 |
| 5 | 15 |
| 6 | 20 |
| 7 | 26 |
| 8 | 27 |

Rendements décroissants passé 7 : le Ronin et l'Hoplite sont déjà proches du
plafond (10/10 et 9/10 à ce palier) — pousser à 8 ne fait plus que les
écraser un peu plus, sans faire bouger le Pistolero ni le Shinobi. Arrêté à
**7**.

Les deux leviers combinés (`speed: 420`, `damage: 7`) donnent **26/50**,
contre 20/50 pour le dégât seul à vitesse inchangée — la vitesse, plate quand
elle est testée seule, redevient utile une fois que le Golem a de quoi
punir le rattrapage. Piège inverse de celui qu'elle semblait montrer seule :
« deux leviers qui marchent chacun ne s'additionnent pas » vaut aussi à
l'envers, un levier qui ne marche pas seul peut en débloquer un autre.

Le Pistolero (2/10) et le Shinobi (1/10) restent hors de portée à tous les
paliers testés — rapides, armés à distance, contre le plus lent et le plus
court du roster : écart structurel, connu et non corrigé.

### Ronin : la brûlure, encore, mais elle plafonne vite

Même lecture qu'à l'introduction de la brûlure elle-même (`onHit.dot`,
section RONIN) : `duration` est le seul levier de ce mécanisme qui n'ait
jamais servi qu'à caler la cadence, pas la puissance brute. Balayé contre les
cinq autres actifs, Golem inclus dans sa version rééquilibrée ci-dessus :

| `dot.duration` | Total /50 | vs Hoplite | vs Druide |
| --- | --- | --- | --- |
| 1 (avant) | 5 | 5/10 | 0/10 |
| 1,5 | 8 | 7/10 | 1/10 |
| 2 | 8 | 7/10 | 1/10 |

Plafonne dès 1,5 : au-delà, un tic de plus ne change rien parce que la
brûlure a déjà eu le temps de courir jusqu'à son terme avant la touche
suivante. Arrêté à **1,5**. Le Pistolero, le Shinobi et le Golem restent à
0/10 à chaque palier — les deux premiers pour la même raison que ci-dessus
(rapides, à distance), le troisième parce qu'un duelliste au contact n'a
justement plus d'avantage de portée sur un adversaire qui vient d'être
rapproché.

### Ce que ça change sur la matrice officielle, et ce que ça ne change pas

Régénérée à 3 seeds (`tools/matrix.mjs`), stable sur un second passage, le
diff ne touche que les lignes où le Golem ou le Ronin apparaissent —
invariant 3 respecté. Mais le résultat en victoires **ne suit pas le banc à
10 seeds à la lettre** : le Golem reste à 8/18 (il gagne un affrontement de
plus au Hoplite, en perd un au Pistolero — net nul sur ces trois seeds-là), et
le Ronin reste à 4/18 (le gain qu'il montre au banc, entièrement contre
l'Hoplite et le Druide, ne tombe simplement pas dans les trois seeds que joue
`matrix.mjs`). Ce n'est pas une contradiction : c'est la limite déjà nommée
plus haut dans ce document — une matrice à seed unique par paire peut cacher
un écart aussi bien qu'elle peut l'exagérer. Le banc à 10 seeds × deux camps
reste la mesure la plus fiable de l'effet réel ; la matrice officielle reste
le garde-fou de non-régression, pas l'instrument de réglage fin.

## Nerf confiné au Shinobi et au Pistolero, les deux qui dominaient

Demandé en deux valeurs directes, sans banc de calage préalable : le Shinobi
(16/18, meilleur du roster) et le Pistolero (14/18, deuxième) étaient les
deux qui dominaient le plus après le rééquilibrage Golem/Ronin ci-dessus.

- **Clone d'ombre : `special.aura.hp` 25 → 15.** Le clone était déjà borné à
  « un quart d'un vrai combattant » (25/100) par construction ; il descend
  **sous** ce quart. Le garde-fou de rapport (25 → 50 → 25 aux deux passages
  de la norme de PV) est rompu par cette demande précise — 15 est désormais un
  chiffre absolu, à réévaluer si la norme de PV bouge encore.
- **Pistolero : `weapon.cooldown` 0,3 → 0,345 (+15 %).** Même levier que celui
  qui avait divisé ce délai par deux à l'origine (section PISTOLERO plus
  haut) : il rallonge le temps entre deux tirs sans toucher au barillet ni
  aux dégâts de la balle.

### Effet sur la matrice officielle

Régénérée à 3 seeds, stable sur un second passage, diff confiné aux lignes où
le Shinobi ou le Pistolero apparaissent (invariant 3 respecté — 12 lignes sur
28, toutes portant l'un des deux) :

| | Avant | Après |
| --- | --- | --- |
| **Shinobi** | 16 | **12** |
| Pistolero | 14 | 13 |
| Druide | 12 | 13 |
| Hoplite | 9 | 11 |
| Golem | 8 | 10 |
| Ronin | 4 | 4 |

Le Shinobi encaisse le plus gros coup (−4) : il perd l'affrontement à
l'Hoplite, au Druide et au Golem qu'il gagnait tous les trois avant — le clone
à 15 PV meurt avant d'avoir eu le temps de peser sur l'issue, ce qui est
précisément l'effet recherché sur un pouvoir qui donne un combattant complet
de plus. Le Pistolero perd net 1 : il cède l'Hoplite mais reprend le Shinobi
(déjà affaibli par son propre nerf) — la cadence plus lente coûte davantage
qu'elle ne rapporte contre un adversaire qui, lui, encaissait déjà l'autre
changement.

**Le Ronin ne bouge pas (toujours 4/18)** : aucun des deux nerfs ne touche à
ses affrontements — ni le Shinobi ni le Pistolero ne figurent parmi les
adversaires où il tenait un espoir.

Sans qu'aucune de leurs propres fiches n'ait changé, **l'Hoplite (9 → 11) et
le Golem (8 → 10) remontent**, et le **Druide (12 → 13) gagne un point** —
tous trois profitent directement de l'affaiblissement du Shinobi sur leur
propre ligne. Encore le piège déjà nommé plusieurs fois dans ce document :
« le levier d'un combattant faible est parfois chez un autre. »

## Le son de chacun

**Demandé** : des bruitages, une annonce d'ouverture (« qui affronte qui »), une
annonce du vainqueur, et **un son par action**.

Chaque fiche porte donc un bloc `sound` : une **transposition** (`pitch`) et un
nom de recette par créneau. Les recettes sont dans `src/data/sound.js` — de la
synthèse, **aucun fichier audio** — et le mécanisme est décrit dans la section
« Son » de `CLAUDE.md`.

| | `pitch` | Tir | Touche | Pouvoir | **Voix tenue** | Spécial | Ultime |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Pistolero | 1 | `gunshot` | `pistolwhip` | `cylinder` (le rechargement) | — | `frost` | `knell` |
| Ronin | 0,92 | — | `blade` | — (passif) | **`swish` 5 → 19 rad/s** | `fire` | `whirl` |
| Hoplite | 0,95 | — | `pierce` | `dash` | — | `hum` | `vault` + `zap` à l'impact |
| Shinobi | 1,20 | `whoosh` | `razor` | `gust` | `swish` 5 → 19, gain 0,4 | `summon` | `cyclone` |
| Druide | 1,05 | `orb` | `bough` | — (passif) | — | `bloom` | `thorns` |
| Golem | **0,72** | `pebble` | `crunch` | `tremor` | `grind` 0,5 → 4 rad/s | `crunch` | `quake` |
| Mannequin | 0,85 | — | — | — | — | — | — |
| Soleil | 0,78 | — | `scorch` **(le faisceau)** | `blaze` | `furnace` 0,5 → 5 | — | `flare` |

**Plus aucun créneau n'est partagé** entre deux combattants, sauf `bounce`
(`thud` — le mur n'appartient à personne) et `impact` (le projectile générique,
que seul le Pistolero surcharge, en `frostbite`). Le banc est passé par un état
intermédiaire où quatre combattants partageaient `blade` et **cinq `riser`** ;
`riser` n'existe plus.

Six choix qui ne se devinent pas :

- **Le `pitch` fait tout le travail d'identité.** Le Golem est à 0,72 — presque
  une demi-octave sous le roster, murs compris — et c'est le pendant sonore de
  ce que sa fiche fait partout ailleurs : rayon 50 contre 41, 200 PV contre 100,
  370 px/s contre 430. Il est plus lourd, il s'entend plus lourd, et **aucune
  ligne de code ne le sait**.
- **Un pouvoir passif n'a pas de son — mais il peut avoir une voix.** La Danse
  d'acier du Ronin et la Sève montante du Druide sont des montées continues :
  aucun instant à sonoriser, et un son sur une pente serait un son sans geste.
  Le raisonnement tient toujours, la conclusion non : la Danse d'acier est
  `Damage = Spin`, donc **la courbe la plus importante du personnage**, et elle
  était muette. Elle passe désormais par une **voix tenue** (`sound.swing`),
  pilotée par la rotation réellement mesurée sur `weaponAngle` — plancher =
  silence, plafond = plein régime, et le cycle de surchauffe s'entend avant de
  se lire sur la jauge. La Sève montante, elle, n'a rien à tenir : sa montée est
  une **cadence** (+0,05 orbe par tir), qui s'entend d'elle-même dans
  l'espacement des `orb`.
- **Les trois voix tenues ne racontent pas la même chose.** Seul le Ronin
  *varie* (régime relevé 0,00 → 1,00 par `sound-check`). Le Shinobi et le Golem
  tournent à vitesse fixe : leur voix est un régime constant (0,35 et 0,60), et
  leur `gain` est volontairement bas — ce qui ne raconte rien de nouveau ne doit
  pas peser sur ce qui raconte. Ce qu'elles apportent est ailleurs : elles sont
  panoramiques, donc on entend **où** est le combattant, ce qui compte pour le
  plus rapide du roster et ses clones dispersés.
- **Le pouvoir du Pistolero sonne au *rechargement*, pas au tir.** La rafale
  s'entend déjà, une détonation par balle ; le barillet qu'on réarme était le
  seul moment du personnage qui ne s'entendait pas — et c'est justement le
  moment où il ne fait rien.
- **L'Hoplite est le seul à avoir deux sons pour un pouvoir** (`vault` au
  décollage, `zap` à la chute), par un créneau `strike` que son seul module lit.
  La Foudre tombante a deux instants séparés par une seconde et demie ; un seul
  son n'aurait pas pu dire les deux.
- **Le Soleil est le seul dont une recette soit accordée à une valeur de
  fiche.** `flare` est jouée au déclenchement de l'ultime, mais le faisceau ne
  part qu'après `ultimate.windup` (2 s) : ses trois premières couches tiennent
  exactement cette annonce, et la quatrième, **en retard de 1,95 s**, *est* le
  départ du rayon. Le couplage s'est déjà payé une fois — `windup` est passé de
  1,1 s à 2 s et tout a dû suivre. Changer l'un sans l'autre désaccorde le son
  de l'image sans que rien ne crie.
- **Le Soleil est aussi le seul dont le créneau `hit` ne serve pas son arme.**
  Sa couronne ne blesse plus, donc `Match.damage` sort avant `hitSound` et
  `scorch` serait morte ; c'est son **faisceau** qui la réclame, via
  `sound: 'hit'` dans `game.damage` — le mécanisme prévu pour une arme que le
  moteur ne reconnaît pas comme telle. Sans ça, le geste principal du
  personnage sonnait comme un projectile perdu.
- **`blaze` est `fire` à l'envers, et c'est tout ce qui les sépare.** La braise
  du Ronin referme son passe-bas (1500 → 380 Hz), le Réchauffement du Soleil
  l'ouvre (400 → 2600). Deux souffles de feu, deux **gestes** opposés : une
  braise se consume, un astre monte en température. Le banc se lit en gestes,
  pas seulement en matières.
- **Deux ultimes sont la grande sœur d'un pouvoir du même combattant** :
  `cyclone` de `gust` chez le Shinobi, `thorns` de `bloom` chez le Druide, et
  `quake` de `tremor` chez le Golem. Un ultime se lit mieux quand il est la
  version large de ce que le personnage fait déjà en petit — c'est ce rapport
  qui le rend reconnaissable, pas son volume.

**Ce que la séparation a coûté, et le contre-sens.** Une voix de
`MIX.maxVoices` est une **couche**, pas un bruitage, et sonoriser le Pistolero
avait fait passer les sons perdus de 0 % à 2,3 % (d'où le plafond relevé de 14 à
20). On attendait donc le même prix, six fois. Mesuré sur le même banc — quinze
duels, l'algorithme de `play()` rejoué sur l'horloge du duel — il n'a rien
coûté : **6 sons perdus avant, 6 après** (0,1 % à `maxVoices: 20`), et
**4393 → 4409 sons effectivement joués**, donc seize de plus. Deux raisons, dont
la seconde ne se devine pas :

1. les couches ajoutées sont sur des **ultimes**, qui partent une poignée de
   fois par duel — là où le Pistolero avait enrichi son *tir*, joué des
   centaines de fois ;
2. `MIX.repeatGap` est indexé **par recette, pas par combattant** : tant que
   trois personnages frappaient avec `blade`, deux touches simultanées de deux
   d'entre eux n'en produisaient **qu'une**. Leur donner chacun la sienne a levé
   ce bâillon.

Le plafond reste donc à 20 — mais c'est la mesure qui le dit, pas le
raisonnement, et elle est à refaire au prochain jeu de bruitages.

L'annonceur, lui, passe par la **synthèse vocale du navigateur** et parle la
langue de l'écran (clés `speech*` de `ui/lang.js`) : « pistolero versus ronin »
puis « pistolero wins ». Les noms lui sont donnés **en minuscules**, parce
qu'une voix de synthèse épelle volontiers un mot tout en capitales.

**Il est la seule chose du jeu qui n'entre pas dans la vidéo exportée** : les
bruitages y sont (piste audio dérivée du mixage), la voix ne peut pas l'être —
`speechSynthesis` sort hors de tout graphe `AudioContext`. C'est pourquoi le
titre d'arène et le bandeau de parade comptent : ils disent à l'image ce que la
voix dit à l'oreille.

**La matrice est restée identique au caractère près** après tout cela : le son
ne lit que de l'état déjà calculé.

## Équilibrage du roster

Vérifié par simulation sans rendu sur les **55 affrontements** du roster
(10 × 10 avec miroirs), 3 seeds chacun — c'est `tools/matrix.mjs`, et sa sortie
est figée dans `tools/matrix-reference.txt`.

**C'est ici que vivent les chiffres.** `CLAUDE.md` n'en garde que le relevé
courant et les leviers, parce qu'il est relu à chaque session ; tout ce qui
suit ne se paie qu'à l'ouverture de ce fichier.

### Relevé courant

Sur les **27 duels hors miroir** de chacun (`tools/matrix-reference.txt`) :

| | victoires | |
| --- | --- | --- |
| **Lune** | 27/27 | boss — hors barème |
| **Soleil** | 23/27 | boss — hors barème |
| Pistolero | 15/27 | |
| Druide | 14/27 | |
| Hoplite | 13/27 | |
| Golem | 13/27 | |
| Shinobi | 13/27 | |
| **Comète** | 12/27 | |
| Ronin | 5/27 | |
| Mannequin | 0/27 | c'est sa définition |

Écart **5 à 15** entre les sept qui se jugent entre eux, connu et non corrigé.
Les deux boss et le Mannequin sont hors barème : leur ligne est une
**spécification**, pas un défaut.

**Le compte absolu est le garde-fou de l'invariant 3.** Il valait
**13, 13, 12, 12, 10, 4** sur 24 duels et n'avait pas bougé d'un chiffre à
travers les trois refontes de LUNE. L'ajout de la Comète l'a fait monter à
**15, 14, 13, 13, 13, 5** — mais uniquement parce que chacun joue **trois duels
de plus** : le diff de la matrice ne contient **que des ajouts**, zéro
suppression, donc pas une ligne existante n'a bougé. C'est la bonne façon de
lire ce garde-fou à l'ajout d'un combattant : ce ne sont pas les comptes qu'on
compare, c'est le **diff**.

### Le sommet n'est plus partagé

La spécification dit que les deux boss battent les six autres et **ne se
départagent qu'entre eux**. **Aucune des deux moitiés n'est vraie au chiffre
près, et c'est assumé** : la première à une graine près (le Soleil lâche
`lancer vs sun`, voir plus bas), la seconde franchement — leur duel a un
vainqueur.

| | contre les six | duel des boss |
| --- | --- | --- |
| **Lune** | 140/140 (sept autres) | **50/50** |
| **Soleil** | 139/140 | 0/50 |

Bancs à 25 graines × les deux camps pour le duel des boss, 10 × les deux camps
pour le reste. Le Soleil **n'a pas bougé** — c'est elle qui est passée devant,
et c'est le prix de deux demandes : **500 PV** (la barre du Soleil, alors
qu'elle ne s'expose jamais) et une **zone de météore portée de 78 à 115 px**.
Le duel des boss était mesuré à **27/50** juste avant, à 280 PV.

**Le retour à un partage tient en un chiffre, et le balayage est monotone :**
`LUNAR.maxHp`, 280 → 27/50, 500 → 50/50. Rien d'autre n'est à toucher — les
dégâts par pierre et le rayon d'explosion **plafonnent** au banc, voir
`docs/PIEGES.md`.

**La seule ligne que le Soleil ait jamais perdue est `lancer vs sun`**, à une
graine sur trois, et rien n'a été calé pour la masquer : **trois balayages de
couronne sont non monotones** — deux valeurs rendent 40/40 avec une voisine
immédiate à 36/40. Aucun paramètre de couronne n'équilibre ce duel. Si la
spécification doit redevenir absolue, le levier est **l'horloge de son ultime**
(79 % de ses dégâts, effet monotone), et c'est un rééquilibrage à part entière.

### Le banc de DPS contre le Mannequin

Les lignes `… vs dummy` de la matrice **ne sont pas un relevé d'équilibrage** :
le Mannequin ne rend pas les coups, donc sa durée mesure la **production
réelle** de l'adversaire. 100 PV ÷ la durée moyenne des trois graines :

| | PV/s | durées des trois graines |
| --- | --- | --- |
| **Lune** | **8,4** | 11,9 · 11,9 · 11,9 |
| Ronin | 3,3 | 28,2 · 28,0 · 33,6 |
| Shinobi | 3,1 | 34,9 · 28,8 · 32,8 |
| Hoplite | 3,0 | 31,0 · 37,6 · 31,7 |
| Soleil | 3,0 | 23,7 · 33,2 · 43,8 |
| **Comète** | 2,9 | 29,9 · 35,7 · 39,2 |
| Druide | 2,8 | 35,8 · 37,7 · 35,3 |
| Pistolero | 2,5 | 37,3 · 39,2 · 43,3 |
| Golem | 1,8 | 62,0 · 46,5 · 55,0 |

Trois choses à en lire, et une seule est une conclusion d'équilibrage :

- **La Lune est à elle seule deux fois et demie le deuxième du banc**, depuis que
  sa zone de météore est passée à 115 px. Un banc de DPS ne dit pas qui gagne ;
  celui-ci, exceptionnellement, le dit — c'est aussi pourquoi elle est passée
  au-dessus du Soleil. Ses trois durées sont **identiques au dixième** : sans
  arme, elle ne dépend pas de la trajectoire, seulement de son horloge.
- **La Comète est au milieu du banc et 12e sur 27 à la matrice**, ce qui est la
  bonne place — mais son écart-type est le plus élevé du roster : elle gagne 14
  duels sur 16 contre le Ronin et 1 sur 16 contre le Golem. Un banc de DPS ne
  peut pas dire ça, et c'est le rappel utile : **il mesure une production, pas
  un appariement**. Sa production, elle, dépend entièrement de qui est en face,
  puisqu'il faut le toucher.
- **Le Soleil est au milieu et gagne quand même 23 duels sur 27** : il encaisse
  cinq fois plus qu'il ne frappe vite. Sa ligne est la **plus dispersée du
  banc** (23,7 · 33,2 · 43,8) parce que tout ce qu'il produit passe par une
  horloge d'ultime de 7 s : sa durée dépend de *combien de tirs* il lui a fallu,
  jamais d'un débit.
- **`dummy vs dummy` finit en `timeout`** : deux combattants sans dégâts ne se
  départagent jamais, le moteur n'ayant aucune limite de temps.

Ces chiffres se recalculent sur `tools/matrix-reference.txt` à chaque
régénération, sans quoi ils vieillissent en silence — c'est déjà arrivé.

### Deux conventions à garder en tête avant de juger un écart

1. **La matrice ne joue chaque paire qu'une fois**, donc chacun y reste toujours
   du même côté et le camp A pèse lourd (`ROSTER` décide). Elle **exagère les
   écarts** : le Pistolero et le Ronin y étaient à 3/12 quand le banc des deux
   camps les donnait à 10/24 et 9/24, presque la moyenne. Le Golem le montre en
   grand — 5/15 à un relevé, mais **54/100** sur un banc à 10 graines × les deux
   camps, parce qu'il est en queue de `ROSTER` donc toujours camp B. **Et elle
   peut aussi *cacher* un écart** : voir `docs/PIEGES.md`. C'est un garde-fou de
   **non-régression**, pas une mesure de force — avant de conclure qu'un
   « dernier » doit remonter, le remesurer **sur les deux camps**.
2. **Le levier d'un combattant faible est parfois chez un autre.** Les leviers
   propres du Pistolero (rayon de balle) et du Ronin (palier de surchauffe) sont
   plats ; c'est baisser les dégâts de mêlée du Shinobi qui les a remontés tous
   les deux. Le relevé complet de ces balayages est dans la section du Shinobi.

Deux garde-fous de fond, indépendants du relevé :

- **mort subite** : au-delà de 55 s, tous les dégâts sont multipliés par
  `1 + (t − 55) / 18` (plafond ×4). Aucun duel ne peut s'éterniser ;
- **fidélité du Pistolero** : `tools/probe.mjs outlaw` mesure ~0,60 coup/s contre
  les 0,65 relevés sur la vidéo, et sa stat `Damage` finit autour de 5,0 contre
  5,50 mesurés.

Le banc est reproductible : chaque duel se rejoue à l'identique avec
`index.html?a=…&b=…&seed=…`.

### Relevé à cinq combattants (historique)

| | victoires |
| --- | --- |
| Hoplite | 11/12 |
| Ronin | 6/12 |
| Druide | 5/12 |
| Pistolero | 4/12 |
| Shinobi | 4/12 |

Écart **4 à 11**, creusé depuis un 4 à 9. **Ce n'est pas un réglage qui l'a
déplacé, c'est le gel de l'attente d'avant-combat.** Les combattants se
déplaçaient pendant la seconde d'ouverture ; les figer était demandé, et c'est
aussi plus juste au regard du relevé — mais partir vraiment des deux points de
départ mesurés profite à l'Hoplite, dont la charge aime les longues lignes de
vue, et coûte au Shinobi. Déséquilibre connu et non corrigé.

### Dernier relevé à onze combattants (historique)

Le roster est réduit à cinq depuis, et les sept éléments gelés ont été
supprimés : ce relevé n'est plus régénérable. Il est gardé parce qu'il porte
des **leviers**, qui eux restent vrais — trois d'entre eux ont resservi
depuis.
L’Hoplite 30, **Pistolero 25**, Ombre 15, Lumière 15, Glace 15, Feu 13,
Vent 12, Plante 11, Foudre 10, Eau 10, Ronin 9 — sept hors de la bande
13–17. Ce qu'il faut en retenir :

- **Hoplite à 30/30 gagnait tous ses duels.** C'est le piège de l'arme
  braquée dans sa forme la plus pure : une charge qui traverse l'arène contre
  dix adversaires qui **pilotent vers lui** et entrent donc dans le couloir. Le
  rayon de hitbox n'est pas le levier (de 12 à 3 px il ne descend que de 0,506
  à 0,439 coup/s — les charges ne frôlent pas, elles traversent) : les leviers
  sont `lunge.scanSpin` et le retour à une charge de longueur bornée. **À
  traiter avant toute réactivation du roster complet.**
- **Pistolero à 25–26 est un écart assumé**, conséquence directe de trois
  demandes (rechargement ×2 plus rapide, balle ×1,3, éclats de givre).
  L'ablation dit lequel pèse : rechargement seul **23**, éclats seuls **28**,
  vitesse de balle seule 14 — soit rien de mesurable. Aucun levier disponible
  ne le ramène dans la bande sans défaire la demande : la cadence du Champ de givre
  est plate (25–26 de 11 s à 26 s), celle des éclats ne descend pas sous 23, et
  `ability.cooldown` comme `magazine` sont `mesuré`. La dispersion y arrive
  (1,35 rad → 16) mais un cône de 77° fait cesser le canon asservi de se lire
  comme une visée.
- **La Lumière à 21/30 puis 15** : son Égide grandit quand elle **encaisse**,
  et les trois invités frappent rarement pour beaucoup — le profil exact que le
  bouclier absorbe. Elle les bat 9-0. Couplage de fiches, pas dérive ; aucune
  valeur de la Lumière n'a jamais été touchée.
- **L'Eau tenait la bande de justesse, à 13**, en perdant 0-3 contre l'Ombre,
  la Lumière et l’Hoplite. C'est elle que la moindre retouche de l’Hoplite
  faisait sortir : à `lunge.minRange` 220 il la balayait 3-0 (12), à 240 elle
  revenait. Ces 20 px coûtaient 0,13 PV/s de fidélité (2,53 contre 2,40) — la
  bande passe avant.
- **Le tour de rechargement du Pistolero lui coûtait ses touches de mêlée.**
  Pendant 1,4 s l'arme n'est plus asservie, or le bout du canon porte la
  hitbox de contact (`hitbox.from: 0,62`) : il balaie au lieu de pointer. Il
  était tombé de 15 à **9/30**. Porter le gel de 0,30 à **0,50** l'a ramené à
  **16/30** — plus que compensé. Levier à retenir :
  `projectiles.shot.onHit.slow`.
- **Les deux pouvoirs greffés** (Champ de givre, Dôme de drain) ont déplacé sept
  affrontements sur 66 et n'ont fait sortir personne de la bande.
- **Le recul symétrique a ramené l’Hoplite de 19 à 17 tout seul**, sans
  qu'aucun levier d'équilibrage ne soit touché : un attaquant repoussé aussi
  fort que sa cible met plus longtemps à revenir au contact. Un réglage de mise
  en scène qui rend un équilibre — l'inverse arrive plus souvent.

---

## Règles communes (moteur)

| Règle                     | Valeur                                                    |
| ------------------------- | --------------------------------------------------------- |
| Points de vie             | 100, le premier à 0 perd                                   |
| Pas de simulation         | 1/120 s, boucle à accumulateur                             |
| Collision corps/corps     | élastique, séparation 50/50, impulsion 130                 |
| Collision arme/corps      | segment tranchant contre cercle + recharge d'arme          |
| Murs                      | rebond parfait, l'arme change de sens de rotation          |
| Flash d'encaissement      | 0,2 s en blanc                                             |
| Intro / K.O.              | **1 s d'attente, combattants immobiles** ; K.O. au ralenti (×0,25) pendant 1,8 s |
| Mort subite               | dégâts ×`1 + (t − 55)/18`, plafonné à ×4                   |
| Dégâts sur la durée       | un DoT par source, rafraîchi à chaque nouvelle application |
| Absorption                | le module de la cible peut absorber avant les PV (bouclier) |
| Soin                      | `Match.heal()`, plafonné aux 100 PV de départ              |
| Absorption totale         | un coup entièrement absorbé fait clignoter sans coûter de PV |
| Teinte d'état             | `onHit.tint` avec alpha de mélange (givre, piège, brûlure) |
| Rendu d'arme              | un module peut fournir son propre `drawWeapon` (liane)     |
| Arme sans manche          | `handle.width: 0` → seul le sprite est tracé (shuriken, lame ardente) |
| Bouclier                  | `look.shield` : liseré et halo aux couleurs de l'élément    |
| Rendu hors cadre          | passe `drawUnbounded` pour les effets qui débordent (dôme) |
| Parade du vainqueur       | phase `victory` : 1 s, arène vidée, le vainqueur au centre |
| Export vidéo              | `render/recorder.js` : canvas 1080 × 1920 + MediaRecorder  |

## Comment les mesures ont été prises

1. Décodage de la vidéo image par image (PyAV) ;
2. relevé des couleurs à la pipette sur les images fixes (fond, corps, dôme) ;
3. détection des bords noirs pour la géométrie exacte de l'arène et du HUD ;
4. suivi des corps par fenêtre glissante sur masque colorimétrique → vitesses ;
5. suivi du centroïde de la tête de hache → vitesse de rotation
   (≈ 11,5 °/image à 30 fps, soit 330 °/s, avec inversions de sens) ;
6. lecture des compteurs du HUD au fil de chaque duel pour caler les
   progressions : `3 s → 0,7 s` et `1 → 13` (Ombre/Glace), `1 → 5,5` (Feu),
   `1 → 14` et `1500 → 5400` (Lumière), `10 → 22` et `4 s → 1 s` (Vent),
   `1 → 4,5` (Foudre), `1 → 7` et `70 → 100` (Eau), `1 → 8` (Plante).

Pour rejouer une mesure : `index.html?seed=6&debug=1` affiche vitesses, charges
et hitboxes en direct.
