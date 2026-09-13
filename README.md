# Elemental Duel — dix combattants, quatre formats

Duels **à deux, en 2 contre 2, en 1 contre X ou en bataille royale** (jusqu'à
huit, chacun pour soi), avec cinq combattants repris de la chaîne
**« ballthingsim »** et cinq inventés — dont **deux boss**, le Soleil et la
Lune —, en **HTML + CSS + JavaScript** avec un rendu **Canvas 2D**.
Aucune dépendance, aucun build : le dépôt se publie tel quel sur GitHub Pages.

Les cinq premiers sont relevés image par image sur leur vidéo — couleurs à la
pipette, portées au pixel, cadences chronométrées. Ce qui n'a pas pu être
mesuré est calé au banc d'essai, et le dit. Les cinq derniers — le **Golem**,
le **Mannequin**, le **Soleil**, la **Lune** et la **Comète** — n'ont pas de
vidéo : **tout chez eux est calé**, et leurs fiches ne portent pas un seul
`mesuré`.

Trois d'entre eux sont **hors barème, aux deux bouts** : le Mannequin ne peut
pas gagner (c'est une cible d'entraînement), les **deux boss** battent tous les
autres et ne se départagent qu'entre eux. L'équilibrage se lit sur les sept
autres.

| Personnage | Arme | Signature | Ultime |
| --- | --- | --- | --- |
| **Pistolero** | Pacificateur | **canon asservi à la cible** — il ne tourne pas ; barillet de **10** et **un tir toutes les 0,345 s** (six balles et 0,6 s mesurés, tous deux changés sur demande), balles qui gèlent, et **un tour du pistolet sur lui-même** au rechargement | Main du mort / DEAD MAN’S HAND (cadence doublée, recul ×8) |
| **Ronin** | Lame de braise (transcrite d'une maquette) | rotation qui monte de 0,80 à 3,00 tour/s puis **surchauffe** ; `Damage = Spin` (mesuré `2 × Spin`, divisé par deux sur demande avec tout le roster) | Ruée de lame / BLADE RUSH (verrou de touche à 115 ms, éventail vert grand ouvert) |
| **Hoplite** | Lance d'orage (**164 px, la plus longue portée du jeu**) — **elle suit son cap de déplacement**, elle ne vise pas | **charge** en ligne droite à 2,6 × sa vitesse, pointe en avant, en semant des images fantômes ; dégâts qui montent de **+0,5 par touche portée** (mesuré +2, demandé +1, puis divisé par deux avec tout le roster) | Foudre tombante / THUNDERFALL — il **quitte l'arène** 1,5 s, un marqueur suit sa cible, puis il retombe dessus |
| **Shinobi** | Shuriken d'ombre — **la bille *est* l'arme**, sprite centré dessus | hitbox en **disque** de 75 px tout autour, le seul du roster ; palette sombre | Tornade de shurikens / SHURIKEN TORNADO |
| **Druide** | Bâton de ronce (transcrit d'une maquette) — **braqué sur la cible, centré sur son pivot et dessiné par-dessus la bille** | **tireur** : des **orbes guidées** qui virent vers l'adversaire, à une **cadence qui monte toute seule** (+0,05 par orbe, de 1,00 à 4,00 par seconde) | Orage de ronces / THORN STORM |
| **Golem** (inventé) | Amas de roche (maquette servie par un vrai PNG, **par-dessus la bille**) — **la portée la plus courte du jeu** (100 px), et la rotation d'arme la plus lente | **le plus lent** (420 px/s), **le plus gros** (rayon 50 contre 41) et **200 PV** quand tout le monde en a 100 : il encaisse chaque coup en entier, il en encaisse simplement deux fois plus. Onde sismique sur horloge, éclats de roche pour qui reste au loin | Séisme / EARTHQUAKE (secousse sur 260 px, puis +35 % de vitesse) |
| **Soleil** (inventé, **boss**) | Couronne de rayons (maquette de flamme servie par un vrai PNG) — **huit rayons à la fois**, un tous les 45°, et **ils ne blessent pas** : c'est sa silhouette, plus son arme. La bille est elle-même une maquette servie en PNG — **le seul corps du jeu qui ne soit pas un cercle vectoriel** | **fait pour gagner contre tous les autres en 1 contre 1**, et il le fait à une graine près — **139 duels sur 140** contre les six autres, la seule perdue à l'Hoplite ; son duel avec la Lune, lui, il le perd : depuis qu'elle est passée à 500 PV, elle le gagne 50 fois sur 50. **Deux fois plus grand** que la norme (rayon 82 contre 41), **500 PV**, et **le plus lent du jeu de très loin** (230 px/s). Tout passe par son ultime : le coller ne coûte rien, mais c'est de près que le faisceau est inesquivable. Réchauffement solaire : brûle qui reste dans 240 px | Rayon solaire / SOLAR BEAM — **2 s de charge annoncée à l'écran** (anneaux qui se referment, foyer qui bat), puis **2,5 s** d'un faisceau de 124 px qui traverse l'arène, jusqu'à 96 PV |
| **Lune** (inventée, **boss**) | **aucune** — le second du jeu après le Mannequin, et le seul qui gagne quand même. Portée 0, hitbox de rayon 0, pas de sprite d'arme : elle ne peut pas toucher. Son corps est une lune criblée servie en PNG, **le second corps du jeu qui ne soit pas un cercle vectoriel** | **le second boss, et l'opposé du premier** : lui est planté (230 px/s) et produit par un faisceau annoncé sur *une ligne* ; elle est **mobile** (430 px/s) et **100 % de ce qu'elle produit tombe du ciel**, sur des zones dessinées au sol. Rayon **88, fixe** — le plus gros corps du jeu — et **500 PV**, la barre du Soleil. Elle bat les sept autres 140 fois sur 140 **et le Soleil aussi** : depuis qu'elle porte 500 PV et une zone de météore élargie, le sommet n'est plus partagé. Météores : toutes les 2,6 s, trois pierres tombent sur la cible dans une zone de 115 px, annoncées 0,45 s à l'avance | Pluie de météores / METEOR STORM — 1,1 s pendant lesquelles **la nuit tombe sur l'arène** et des pierres se détachent d'elle, puis **3,2 s d'averse : vingt-cinq météores, une toutes les 0,13 s**, trois ou quatre en l'air en permanence |
| **Mannequin** (inventé) | **aucune** | **cible d'entraînement** : il ne fait aucun dégât, n'a aucun pouvoir, et porte les PV de la norme, en blanc. On le choisit pour **regarder l'autre combattant** : sa ligne de HUD compte les dégâts qu'il a subis, donc ce que l'adversaire produit vraiment | aucun (jauge vide, « NO ULTIMATE ») |
| **Comète** (inventée) | **une ceinture de débris qui ne touche pas** — sa hitbox est nulle sur ses trois clés, donc `resolveMelee` ne tourne jamais pour elle : la ceinture est un **dessin**, découpé de la même maquette que son corps (le tourbillon est la sphère, tout ce qui l'entoure est l'arme). C'est son module qui inflige les dégâts, au contact | **la plus rapide et la plus petite** (700 px/s de base et rayon 34, contre 655 et 41 au précédent record) : **son élan est son arme**. Un facteur continu monte tout seul de 1 à 1,5 tant qu'elle ne touche personne, multiplie sa vitesse *et* ses dégâts, et **chaque choc le dépense** — elle est donc la plus dangereuse juste après avoir raté. Coup de fouet : toutes les 6 s, l'élan saute à 1,9, au-dessus de son propre plafond. **Rebond** : chaque mur touché lui rend de l'élan (plafond 1,7) — son temps mort devient de l'accumulation. **Fragmentation** : toutes les 10 s, huit éclats de sa propre ceinture partent en anneau complet, et la salve lui **coûte** 0,2 d'élan — le seul pouvoir du jeu qui se paie dans la ressource de son porteur | Rentrée / REENTRY — 4,5 s où l'élan est tenu à 2,3 (1 610 px/s), le verrou de touche tombe de moitié et **les chocs ne coûtent plus rien** |

### Quatre formats

| Format | Ce que c'est |
| --- | --- |
| **Duel** | un contre un, le format d'origine — c'est lui, et lui seul, dont l'équilibrage est relevé |
| **2 contre 2** | deux équipes de deux. Les armes ne touchent que le camp adverse, mais les **corps se bousculent entre tous** : un coéquipier reste un obstacle |
| **1 contre X** | un combattant **seul contre tous les autres**, de **1 contre 2 à 1 contre 4**. Les X forment un seul camp : ils s'épaulent, se bousculent entre eux, et ne visent que le solitaire |
| **Bataille royale** | **3 à 5** combattants à l'écran de sélection, chacun pour soi, dernier debout. Le moteur, lui, en accepte autant qu'il y a de combattants — le plafond est un choix de lisibilité, pas une limite technique |

Le moteur ne connaît aucun de ces quatre noms : il reçoit une liste de
combattants et **un camp pour chacun**. « 2 contre 2 », « 1 contre X » et
« chacun pour soi » sont trois façons de remplir la même liste de camps —
`[0,0,1,1]`, `[0,1,1,1]` et `[0,1,2,3]`. Ajouter un format ne demande donc pas
une ligne de moteur : le 1 contre X a été **joué par l'URL avant d'avoir une
seule ligne d'interface**, et il tournait déjà.

Au-delà de deux combattants, chacun vise l'**ennemi vivant le plus proche** et
peut changer de cible d'un pas à l'autre, un **mort quitte le terrain
immédiatement**, et l'écran de fin affiche un classement.

Le HUD se sépare alors en deux bandeaux : les **points de vie en haut** de
l'écran, une plaque par combattant, et en bas ce que le duel y met déjà — jauge
d'ultime, jauge de pouvoir spécial et ligne de stat, pour chacun. Plusieurs
corps d'un même combattant dans un même camp — les clones du Shinobi — tiennent
**une seule plaque, points de vie cumulés**, et un seul bloc de pouvoirs. Les deux
bandeaux gardent le même ordre, donc un combattant est à la même place dans les
deux.

Chaque combat s'ouvre par **une seconde d'attente, combattants immobiles** :
l'arène s'éclaircit, les armes tournent, mais personne n'avance.

### Points de vie

Les points de vie ne se règlent pas : la norme est de **100**, le chiffre du
cahier des charges (elle est passée à 200 le temps d'une session, puis a été
redivisée par deux sur demande). Une fiche peut porter les siens — le Golem en
a **200**, sa seule défense — et un pouvoir peut faire entrer un combattant
avec les siens : les clones du Shinobi naissent à **15** (25, sous le quart
d'un combattant, demandé), et c'est ce rapport qui borne le pouvoir.

Chacun porte en plus un **pouvoir spécial**, sur horloge propre, avec sa jauge
juste sous celle de l'ultime. Il s'ajoute à l'ultime, il ne le remplace pas —
voir [`docs/FICHES.md`](docs/FICHES.md).

| | Pouvoir spécial |
| --- | --- |
| **Pistolero** | **Champ de givre** — il le suit partout, ralentit et grignote ce qui entre dedans |
| **Ronin** | **Aura de braise** — il sème des braises, et tout ce qui l’approche brûle |
| **Hoplite** | **Dôme de drain** — l’adversaire est figé sous un dôme, un rayon le vide |
| **Shinobi** | **Clone d'ombre** — des doubles à **15 PV** (sous le quart d'un combattant) qui entrent dans la partie comme de **vrais combattants**, dans son camp et avec **tous ses pouvoirs**, Clone d'ombre compris : un clone invoque des clones, et le duel passe en 2 contre 1. Au HUD le groupe ne fait qu'un — **une plaque, points de vie cumulés**, une seule paire de jauges — et **ses pouvoirs partent tous en même temps**. Un ton plus clair que lui |
| **Druide** | **Tir enraciné** — des racines le clouent au sol une seconde, il cesse de bouger *et* de tirer, puis lâche une **orbe majeure** à trois fois les dégâts |

<sup>[Le Champ de givre du Pistolero](docs/capture-blizzard.png) · [le Dôme de drain de l’Hoplite](docs/capture-lien.png) · [le Clone d'ombre du Shinobi](docs/capture-clone.png) · [les orbes guidées du Druide](docs/capture-mage.png) · [son Orage de ronces](docs/capture-mage-tempete.png) · [son Tir enraciné](docs/capture-mage-enracine.png).</sup>

![L’Hoplite contre le Ronin](docs/capture-duel.png)

<sup>Les deux boss : [**LUNE et ses météores**](docs/capture-lune.png) — trois pierres en chute, annoncées au sol par une ombre qui grossit et un cercle qui se resserre ; [**sa Pluie de météores**](docs/capture-lune-pluie.png), qui fait tomber la nuit sur l'arène et vingt-cinq pierres avec ; et [**le duel des deux**](docs/capture-boss.png), le Soleil pris sous l'averse.</sup>

<sup>Les autres formats : [un 2 contre 2](docs/capture-2v2.png) (les camps groupés dans le titre et dans le HUD) · [**un 1 contre 4**](docs/capture-1vx.png), le Soleil seul contre quatre — il gagne 1 duel sur 3 dans cette configuration, là où il en gagne 20 sur 21 en 1 contre 1 · [une bataille royale à cinq](docs/capture-royale.png) · [la parade à deux vainqueurs](docs/capture-fin-2v2.png).</sup>

<sup>L’Hoplite (charge, Dôme de drain) contre le Ronin (surchauffe, Aura de braise). Voir aussi [l'écran de sélection](docs/capture-selection.png), [le Pistolero sous DEAD MAN’S HAND](docs/capture-horsloi.png), [la ruée du Ronin](docs/capture-bretteur.png), [la Foudre tombante de l’Hoplite](docs/capture-lancer.png), [sa charge de lance](docs/capture-lancer-charge.png) et [l'écran de fin avec l'export Short](docs/capture-fin.png). Le boss : [le Rayon solaire du Soleil](docs/capture-soleil.png), relevé au profil de sa maquette — liseré clair *à l'extérieur* de l'encre brûlée, filaments qui remontent le faisceau — sur [une arène qui chauffe](docs/capture-soleil-chaleur.png) à mesure que son Réchauffement approche de zéro, huit rayons en couronne et un faisceau qui traverse l'arène — et [ses deux secondes de chargement](docs/capture-soleil-charge.png), la seule fenêtre pour en sortir.</sup>

---

## Démarrer

```bash
# n'importe quel serveur statique (les modules ES nécessitent http://, pas file://)
python3 -m http.server 8080
# puis http://localhost:8080
```

### Publier sur GitHub Pages

Le dépôt est configuré en *Settings → Pages → Source = GitHub Actions* : chaque
push sur `main` déclenche `.github/workflows/pages.yml`, qui publie la racine
telle quelle (site en ligne : <https://sebistarrr.github.io/test2/>). Le workflow
se lance aussi à la main depuis l'onglet *Actions*.

Pour un déploiement « depuis une branche » plutôt que par Actions, choisis la
branche et le dossier `/ (root)` : le fichier `.nojekyll` (déjà présent)
empêche Jekyll d'ignorer les dossiers.

### Paramètres d'URL

| Paramètre    | Effet                                                             |
| ------------ | ----------------------------------------------------------------- |
| `?a=&b=`     | lance directement un duel sans écran de sélection — `outlaw`, `bladesman`, `lancer`, `wind` (le Shinobi), `mage` |
| `?f=`        | une liste de combattants, pour une partie à plusieurs : `?f=outlaw,mage,lancer,wind` |
| `?teams=`    | les camps, dans le même ordre que `?f=` : `0,0,1,1` fait un 2 contre 2, `0,1,1,1` un 1 contre 3. Omis, chacun pour soi |
| `?seed=1234` | rejoue **exactement** le même duel (déterminisme complet)          |
| `?lang=fr`   | **toute l'interface** en français — HUD, titre d'arène et écrans DOM (par défaut : l'anglais de la vidéo) |
| `?debug=1`   | hitboxes, vitesses, charge d'ultime, seed                          |
| `?rec=0`     | n'enregistre pas le duel : pas d'export possible, mais pas un cycle dépensé pour lui |
| `?sound=0`   | duel muet d'emblée — bruitages **et** annonces (le bouton 🔊 de la page fait la même chose à tout moment) |

Exemple : `index.html?a=lancer&b=mage&seed=6&debug=1`

### À la fin d'un duel

| Action | Effet |
| --- | --- |
| **Revanche** | même affiche, **nouveau** tirage |
| **Revoir ce duel** | même affiche **et** même seed : la simulation étant déterministe, le duel se rejoue coup pour coup — vérifié automatiquement (mêmes touches, mêmes dégâts, même durée à la milliseconde) |
| **Exporter en Short** | télécharge la vidéo du duel qu'on vient de regarder, en **vertical 1080 × 1920, avec le son**, prête à publier en YouTube Short. La ligne sous le bouton dit ce que porte le fichier : format, poids, et « with sound » ou « no sound » |

La seed du duel est affichée sous le vainqueur : elle suffit à le refaire jouer
plus tard avec `?seed=`.

Chaque combattant a sa **signature à l'écran** (`look.flair`) : ruban de couleur
derrière la pointe de l'arme, nappe de sol à ses teintes, frémissement collé au
corps, gerbe d'impact et éclat d'incantation. S'y ajoutent les **nombres de
dégâts** qui s'envolent à chaque touche, les **ondes qui courent le long des
murs** à chaque rebond, le **sillage** derrière une boule projetée, la
**convergence de matière** dès 85 % de jauge d'ultime et le **cerclage rouge
pulsé** sous le quart des points de vie.

Tout cela suit une règle de composition : **rien ne se pose entre le spectateur
et les combattants**. Ce qui remplit le cadre est au fond, sur les bords, ou
derrière la boule. Tout vit dans `src/render/flair.js`, avec son propre aléa :
la mise en scène ne peut pas déplacer une virgule de l'équilibrage.

### Le son

Le duel s'entend autant qu'il se voit, et **sans un seul fichier audio** :
`src/data/sound.js` porte une trentaine de **recettes de synthèse** — de une à
cinq couches d'oscillateur et de bruit blanc filtré, avec leur enveloppe — que
`src/render/audio.js` monte à la volée dans un `AudioContext`.

- **Chaque action a son bruit** : le tir (quel que soit le projectile), la
  touche d'arme, l'impact d'un projectile, le tic d'une brûlure, le rebond sur
  un mur, le choc de deux corps, les trois créneaux de pouvoir, le K.O., la
  fanfare de victoire.
- **Et chaque personnage a le sien** : aucune recette de touche ni d'ultime
  n'est partagée par deux combattants. Le Ronin frappe d'une lame, le Druide
  d'un bâton de bois, le Shinobi d'une plaque lancée à plat — trois recettes,
  trois matières.
- **Les armes qui tournent sifflent en continu**, et le sifflement suit leur
  **vitesse de rotation réelle**, image par image : la lame du Ronin va de 0,80
  à 3,00 tour/s puis s'effondre en surchauffe, et on l'entend monter et
  retomber. Une lame ralentie par le givre siffle plus bas. Les armes braquées
  sur leur cible (Pistolero, Hoplite, Druide) ne tournent pas, donc ne sifflent
  pas.
- **C'est la fiche qui décide de la matière**, comme pour les sprites et les
  couleurs : elle nomme une recette par créneau et une transposition. Le Golem
  sonne une demi-octave sous le roster (`pitch: 0.72`), le Shinobi au-dessus —
  sans une ligne de code qui les distingue.
- **Un annonceur nomme les combattants** : « pistolero versus ronin » à
  l'ouverture, « pistolero wins » à la parade. Il passe par la synthèse vocale
  du navigateur et parle **la langue de l'écran** (donc l'anglais par défaut,
  le français avec `?lang=fr`).
- Le son s'ouvre au **premier clic** — les navigateurs interdisent de sonner
  avant un geste — et le bouton 🔊 en haut à droite le coupe à tout moment
  (`?sound=0` pour démarrer muet).
- **La vidéo exportée porte le son** — c'est tout l'objet de l'export : le
  mixage est dérivé vers une piste audio ajoutée au flux du `MediaRecorder`, et
  le fichier téléchargé sonne. Deux choses à savoir avant de publier :
  - **couper le son ne coupe que les enceintes.** On regarde en silence, on
    publie avec le son ;
  - **un duel lancé directement sur `?a=…&b=…` est filmé muet** : le navigateur
    exige un geste avant d'ouvrir le son, et personne n'a cliqué. Passer par
    l'écran de sélection suffit. La ligne d'export le dit dans les deux cas
    (« with sound » / « no sound »), plutôt que de le laisser découvrir après
    publication.
- **La voix de l'annonceur n'entre pas dans le fichier**, et ne le pourra pas :
  la synthèse vocale du navigateur sort hors de tout graphe audio, aucune API ne
  permet de la router. Ce qu'elle dit, l'image le dit aussi : le titre d'arène
  nomme les deux camps pendant tout le duel, le bandeau de parade nomme le
  vainqueur.

Comme la mise en scène visuelle, le son ne fait que **lire** : il ne touche à
aucun état, ne tire pas dans l'aléa de simulation, et la matrice d'équilibrage
est restée identique au caractère près après son ajout.

La partie se termine par **deux secondes de parade** : les perdants quittent
l'arène, le ou les vainqueurs glissent au centre, grandissent, leur arme
s'emballe et ils poussent des anneaux à leur couleur — et **un bandeau les
nomme**. Un 2 contre 2 se gagne à deux, donc les deux paradent côte à côte.

C'est la dernière image de la vidéo exportée, et c'est pour elle que le bandeau
existe : le nom du gagnant n'apparaissait qu'à l'écran de résultat, qui n'est
pas filmé. La mise en place (glissement, agrandissement) garde sa seconde
d'origine ; la seconde ajoutée ne sert qu'à laisser le temps de lire.

---

## Architecture

```
index.html                 page unique : canvas + écrans DOM
styles/style.css           mise à l'échelle de la scène + écrans de sélection/fin
assets/
├── fonts/                 Archivo Black + Oswald auto-hébergées (OFL)
└── sprites/               overrides PNG facultatifs + manifeste
src/
├── main.js                bootstrap : ressources, écrans, boucle
├── core/
│   ├── loop.js            boucle à pas fixe 120 Hz + rendu rAF
│   ├── math.js            vecteurs, angles, distance segment/point
│   ├── rng.js             aléa déterministe (mulberry32) piloté par seed
│   └── fonts.js           attente des webfonts avant la 1re frame
├── data/                  ← LES DONNÉES, séparées du moteur
│   ├── fighters/<id>.js   **une fiche par combattant** (gelée) : apparence,
│   │                      vitesse, arme, pouvoir, ultime, projectiles, HUD
│   ├── pixelart/<id>.js   ses sprites pixel-art, en texte
│   ├── elements.js        registre : ELEMENTS, ROSTER, getElement
│   ├── pixelmaps.js       registre des sprites (PIXEL_MAPS)
│   ├── defaults.js        valeurs universelles + helper `fiche()`
│   ├── format.js          formatage des lignes de stat du HUD
│   ├── tuning.js          géométrie de scène mesurée sur la vidéo
│   ├── sound.js           **le banc de bruitages** : des recettes de synthèse,
│   │                      aucun fichier audio. SOUNDS = des événements,
│   │                      LOOPS = des voix tenues (armes qui tournent)
│   └── freeze.js          deepFreeze + garde-fou d'immutabilité
├── render/
│   ├── canvas.js          repère logique 720x1280, DPR, pixel-perfect
│   ├── scene.js           décor statique (fond, titre, arène) mis en cache
│   ├── sprites.js         banque de sprites + overrides PNG
│   ├── pixelart.js        compilation pixel-map → canvas
│   ├── hud.js             jauges d'ultime + ligne de stat
│   ├── recorder.js        film du duel → vidéo verticale 1080x1920 (Shorts)
│   ├── effects.js         particules de jeu (étincelles, neige, fantômes)
│   ├── flair.js           mise en scène : rubans, nappes, ondes de mur, nombres
│   ├── audio.js           **le son** : synthèse des bruitages + l'annonceur
│   └── text.js            texte ajusté pour ne jamais déborder du HUD
├── game/
│   ├── match.js           machine à états du duel + dégâts + rendu global
│   ├── fighter.js         entité combattant (état runtime + dessin)
│   ├── physics.js         collisions corps/corps et arme/corps
│   ├── projectiles.js     projectiles génériques pilotés par la fiche
│   └── abilities/
│       ├── index.js       registre
│       ├── outlaw.js      Visée asservie + Barillet + Main du mort + Champ de givre
│       ├── bladesman.js   Courbe de rotation (surchauffe) + Ruée + Rage
│       ├── lancer.js      Charge + Foudre tombante + Dôme de drain
│       ├── wind.js        Tornade de shurikens + Clone d'ombre
│       └── mage.js        Orbes guidées + Orage de ronces + Tir enraciné
└── ui/
    ├── lang.js            libellés d'interface, anglais et français
    ├── select.js          écran de sélection (lit les fiches)
    └── result.js          écran de fin
tools/                     outillage de vérification (non chargé par la page)
├── matrix.mjs             15 affrontements x 3 seeds, sans rendu
├── matrix-reference.txt   sortie de référence, à differ après tout changement
├── fiche-snapshot.mjs     empreinte des 5 fiches + 15 cartes, sans serveur :
│                          le garde-fou des réorganisations de `src/data/`
├── fiche-check.mjs        câblage, clés de sprite, fiche ↔ module
├── probe.mjs              durée, touches et coups/s d'un combattant sur tout
│                          le roster — garde-fou chiffré du Pistolero
├── lang-check.mjs         garde-fou de la langue (tables et champs `Ref`)
├── sound-check.mjs        banc du son : quelle action fait quel bruit, et
│                          chaque recette réellement montée dans un AudioContext
├── export-check.mjs       banc de l'export : le fichier produit est relu **et
│                          redécodé en PCM**, seul moyen de distinguer une piste
│                          audio vivante d'une piste silencieuse
├── layout-check.mjs       les écrans DOM tiennent-ils dans la scène ? hauteur
│                          réelle de la pile, balayée sur les quatre formats,
│                          leurs tailles et les dix fiches
├── shot.mjs               captures d'écran, avec déclenchement de pouvoir
├── frames.py              extraction d'images d'une vidéo de référence
├── montage.py             planche-contact des images extraites
└── crop.py                recadrage/zoom pour mesurer au pixel
```

### Pourquoi ce découpage

- **Le moteur ne connaît aucun combattant.** `fighter.js`, `physics.js` et
  `projectiles.js` lisent la fiche. Ajouter un combattant = une fiche dans
  `data/fighters/` + un module dans `abilities/`, sans toucher au reste.
- **Un combattant, trois fichiers du même nom.** `wind` c'est
  `data/fighters/wind.js`, `game/abilities/wind.js` et `data/pixelart/wind.js`.
  `elements.js` et `pixelmaps.js` ne sont que des registres : ils ne portent
  aucune valeur de combattant, et on n'a pas à les ouvrir pour en modifier un.
- **Les fiches sont gelées** (`deepFreeze`) et le duel travaille sur un état
  séparé : impossible qu'une partie modifie les stats d'un combattant pour la
  suivante. `assertFrozen()` le vérifie au lancement de chaque duel.
- **Le décor est rasterisé une fois** dans un canvas hors écran, puis blitté :
  le fond ne bouge jamais (cahier des charges) et coûte un seul `drawImage`.

### Choix du langage d'animation

**JavaScript ES modules + Canvas 2D**, pas de TypeScript ni de framework :

| Option              | Verdict                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| CSS/DOM animations  | ✗ 200+ particules en DOM = saccades, pas de contrôle du pas de temps       |
| SVG + SMIL          | ✗ coût de layout à chaque frame, pas fait pour une simulation physique     |
| WebGL / PixiJS      | ✗ surdimensionné ici (2 entités + particules), et ajoute une dépendance    |
| **Canvas 2D + ESM** | ✓ 60 fps large, code lisible, zéro build, déployable en glisser-déposer    |
| TypeScript          | ✗ imposerait une étape de compilation avant chaque publication Pages       |

Le typage n'est pas perdu pour autant : les modules sont annotés en **JSDoc**,
donc VS Code fait la vérification de types (`// @ts-check` suffit à l'activer).

La boucle est à **pas fixe (120 Hz)** avec accumulateur : la simulation est
identique sur un écran 60 Hz ou 144 Hz, et les collisions arme/corps ne
« traversent » pas à haute vitesse.

---

## Langue

**L'application est en anglais** — c'est la langue de la vidéo de référence
(`DARK`, `BLADE RUSH`, `Damage: 5.50`), donc celle du HUD et du titre d'arène
depuis toujours ; les écrans de sélection et de fin ont suivi. `?lang=fr`
bascule l'ensemble, chrome DOM compris.

Le dépôt, lui, reste en français : code, commentaires, documentation et
messages d'erreur console. Ce sont deux publics différents. Tout l'affichage
passe par [`src/ui/lang.js`](src/ui/lang.js), deux tables aux clés identiques.

---

## Fidélité à la vidéo

Toutes les constantes de mise en page proviennent d'un relevé image par image
(720 × 1280, 30 fps) ; elles sont regroupées dans `src/data/tuning.js` et
`src/data/fighters/`, chacune commentée `mesuré`, `calé` ou `déduit`.

| Ce qui est mesuré             | Valeur relevée                    |
| ----------------------------- | --------------------------------- |
| Fond hors-arène               | `rgb(249,241,218)` sur la vidéo — **le site l'a remplacé par une encre sombre `#1c1a26`**, seul écart volontaire au relevé ; l'arène reste blanche |
| Arène                         | carré 640 × 640 à (40, 320), bord noir 6 px |
| Boule                         | rayon 41 px, contour noir 5 px    |
| Jauges du HUD                 | 268 × 35 px, en x = 39 et x = 412, y = 965 |
| Ligne de stat                 | ligne de base y = 1036            |
| Dôme du Dôme de drain        | rayon ≈ 265 px, `rgb(52,46,70)`, 5,65 s, non clippé |
| Champ de Champ de givre             | rayon ≈ 130 px                    |
| Orage de ronces               | grappes de cubes de 11 à 26 px, aucun cerceau |
| Brûlure du Ronin           | teinte du corps **et** anneau orange sur la victime |

Ces quatre dernières lignes viennent des vidéos *Elemental Armory League*, dont
les huit éléments ont depuis été supprimés — les pouvoirs, eux, ont été
**greffés sur les survivants** et gardent leurs cotes d'origine.

Le roster vient de vidéos en **576 × 1024** : toute mesure prise dessus se
convertit en **×1,25** vers ce repère 720 × 1280 — **sauf celle de Magia,
×1,275**, son cadrage n'étant pas le même (voir `docs/PIEGES.md`).

| Élément mesuré                | Valeur relevée (convertie)        |
| ----------------------------- | --------------------------------- |
| Boule Pistolero / Ronin  | `#8a5934` / mesurée `#dcc462` ; le jeu met le Ronin en **orange `#e8621b`**, avec sa lame de braise (écart assumé, voir `docs/FICHES.md`) |
| Portée d'arme                 | revolver 122 px, sabre/lame 152 px |
| Rotation du sabre             | 0,80 → 3,00 tour/s, palier de 1,8 s au plafond, effondrement à −3,0/s |
| Recul du revolver             | 119 px/s, **988 px/s sous DEAD MAN’S HAND** |
| Progression « Damage » (Pistolero) | 3,00 → 5,50 par pas de 0,10, **au coup au but** |
| « Damage » du Ronin        | `2,00 × Spin Speed`, exact, jamais stocké |
| DEAD MAN’S HAND                | horloge de 7,0 s, effet 6,2 s, cadence doublée |
| BLADE RUSH                    | horloge de 9 s + 6 % par coup, ruée de 1,5 s, verrou à 115 ms |
| Précision du Pistolero      | 25 coups au but en 38,6 s = **0,65 coup/s** |
| Boule Hoplite                 | mesurée `#574a84` indigo ; le jeu la met en **violet `#7046ac`**, la teinte de la lance électrique — donc tout près du relevé. Traînée cramoisie `#a32b4a` conservée |
| Lance de l’Hoplite              | centre → pointe 164 px, talon 42 px **derrière** le pivot. Le **dessin** ne vient pas de la vidéo mais d'une maquette : une **lance électrique** violette — pommeau doré, hampe fissurée de blanc, garde, tête hérissée à gemme. Elle est *transcrite* et non redessinée : réduction par blocs 3 × 3 exacts, 624 × 129 → 208 × 43. L'encombrement, lui, reste celui du relevé |
| Progression « Damage » (Hoplite) | 10,00 → 20,00 par pas de **2,00**, à la touche portée ; 5 touches en 27,6 s, soit 0,181 coup/s et 2,54 PV/s (le moteur rend 0,195 et **2,52**) |
| Angle de lance (Hoplite)      | **elle suit le cap de déplacement**, `weapon.spin: 0`. Le chiffre qui figurait ici a été **retiré** après un quatrième relevé qui ne tranche pas — voir `docs/FICHES.md` |
| Charge de l’Hoplite             | le corps file à ~1 400 px/s pendant ~0,15 s contre 540 en croisière, lance dans l'axe |
| Foudre tombante de l’Hoplite               | jauge pleine en 10 s, 0,45 s d'élan, **1,5 s hors de l'arène**, impact de rayon 110 px |

Le rythme est calé pour retrouver ces compteurs en fin de duel : sur les
**15 affrontements** du roster (3 seeds chacun), un duel dure **13 à 29 s**, et
Le Pistolero termine autour de 5,0 de dégâts, comme sur sa vidéo. Une **mort
subite** amplifie les dégâts au-delà de 55 s pour qu'aucun duel ne s'éternise.
Détail de l'équilibrage dans [`docs/FICHES.md`](docs/FICHES.md).

---

## Ajouter un combattant

Marche à suivre complète, avec les vérifications :
[`docs/AJOUTER-UN-COMBATTANT.md`](docs/AJOUTER-UN-COMBATTANT.md). En résumé,
**un combattant = trois fichiers du même nom**, plus trois lignes de registre :

1. **Les sprites** dans `src/data/pixelart/<id>.js` (texte), recensés dans
   `src/data/pixelmaps.js` — ou en PNG via `assets/sprites/manifest.json`, voir
   [`assets/sprites/README.md`](assets/sprites/README.md).
2. **La fiche** dans `src/data/fighters/<id>.js` (copie une existante et
   adapte). Tout y passe : couleurs, vitesse, arme, dégâts, pouvoir, ultime,
   projectiles, libellés du HUD. **Les deux langues sont dans la fiche** :
   `name`/`nameRef`, `tagline`/`taglineRef`, `weapon.name`/`weapon.nameRef`,
   `hud.statFr`/`hud.stat`… L'application affiche l'anglais ; oublier un champ
   `Ref` fait retomber une ligne en français au milieu d'un écran anglais (le
   repli est silencieux). `fiche()` pose les huit valeurs universelles.
3. **Les pouvoirs** : un module dans `src/game/abilities/<id>.js` exposant
   `init / update / drawUnder / drawOver / barValue`, puis une ligne dans
   `abilities/index.js`.
4. **Trois lignes dans `src/data/elements.js`** : l'import, l'entrée dans
   `ELEMENTS`, et l'id **en queue de `ROSTER`**. Les paires de la matrice sont
   formées en `[liste[i], liste[j]]` : insérer un nouveau venu ailleurs qu'à la
   fin changerait le camp A d'affrontements existants, et avec lui leur issue,
   sans qu'aucune valeur de fiche n'ait bougé. Il apparaît alors dans l'écran de
   sélection avec sa fiche générée automatiquement.

`node tools/fiche-check.mjs` attrape les oublis de câblage et les clés de
sprite inconnues, qui ne lèvent aucune erreur par eux-mêmes.

Rien d'autre à modifier : HUD, sélection, physique et projectiles sont
pilotés par les données.

---

## Documentation

La documentation est **découpée par ce qu'elle coûte à lire**, pas par thème :
`CLAUDE.md` est relu en entier à chaque reprise de travail, les trois autres
s'ouvrent à la demande et seulement sur la bonne section.

- [`CLAUDE.md`](CLAUDE.md) — mémoire du projet : carte des fichiers, roster,
  invariants (déterminisme, fiches gelées, matrice d'équilibrage), outils et
  index des pièges. **Les règles seules, une ligne chacune** — c'est le point
  d'entrée pour reprendre le travail, et il reste court pour cette raison.
- [`docs/PIEGES.md`](docs/PIEGES.md) — le détail long : la mesure, le balayage
  et l'histoire derrière chaque règle de `CLAUDE.md`, sous le même intitulé,
  plus la méthode de relevé vidéo et les écarts volontaires au relevé.
- [`docs/FICHES.md`](docs/FICHES.md) — fiches complètes des combattants
  (apparence, vitesse, pouvoirs, projectiles), méthode de mesure, et **tous les
  chiffres d'équilibrage** : relevé courant, bancs, balayages, historique.
- [`docs/AJOUTER-UN-COMBATTANT.md`](docs/AJOUTER-UN-COMBATTANT.md) — la marche
  à suivre pour ajouter ou modifier un personnage.
- [`assets/sprites/README.md`](assets/sprites/README.md) — remplacer les
  sprites par les tiens.
- [`assets/fonts/LICENSE.md`](assets/fonts/LICENSE.md) — polices embarquées.

## Licence

Code sous licence MIT. Les polices sont sous SIL OFL (voir `assets/fonts/`).
La vidéo de référence appartient à ses auteurs : ce dépôt n'en redistribue
aucun extrait, les sprites sont redessinés en pixel-art.
