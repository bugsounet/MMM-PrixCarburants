# MMM-PrixCarburants

Ce module permet d'afficher les prix des carburants des stations selon votre code postal

## Screenshot
![](https://raw.githubusercontent.com/bugsounet/MMM-PrixCarburants/dev/screenshot.png)

## Installation

```sh
cd ~/MagicMirror/modules
git clone https://github.com/bugsounet/MMM-PrixCarburants
cd MMM-PrixCarburants
npm install
```

## Configuration

```js
{
  module: "MMM-PrixCarburants",
  position: "top_center",
  config: {
    debug: false,
    CodePostaux: [
      "08320",
      "59610"
    ],
    Carburants: [
      1, // Gazole
      2, // SP95
      3, // E85
      4, // GPLc
      5, // E10
      6  // SP98
    ],
    Affiche: 5, // nombre de stations à afficher
    width: "450px", // largeur du module
    startDelay: 30*1000
  }
},
```

| Option | Description | Type | Défaut |
| --- | ---- | ----- | ---- |
| CodePostaux | Permets de scanner les stations selon les codes postaux | Tableau de code postaux | [ "08320", "59610" ] |
| Carburants | Permet d'afficher uniquement le type de carburant voulu.<br>Type de Carburant:<br>* 1: Gazole<br>* 2: SP95<br>* 3: E85<br>* 4: GPLc<br>* 5: E10<br>* 6: SP98<br>  | Tableau de valeur | [ 1,2,3,4,5,6 ] |
| Affiche | Nombre maximum de stations à afficher | Nombre | 5 |
| width | Largeur du module (pour ajuster si besoin) | chaine de caractère  | "450px" |
| startDelay | Delai avant le démarrage du module en ms (30 sec par default --conseillé--) | Nombre | 30000

## Mise à jour du module
### Mise à jour manuelle
Utilisez cette commande depuis un terminal:
```sh
cd ~/MagicMirror/modules/MMM-PrixCarburants
npm run update
```

### Mise à jour automatique depuis le module [updatenotification](https://develop.docs.magicmirror.builders/modules/updatenotification.html)

Depuis MagicMirror² v2.27.x, vous pouvez appliquer automatiquement les mises à jours des modules depuis `updatenotification`.<br>
Voici la règle a ajouter pour `MMM-PrixCarburants`

```js
  {
    module: "updatenotification",
    position: "top_center",
    config: {
      updateAutorestart: true, // restart MagicMirror automaticaly after update
      updates: [
        // MMM-PrixCarburants rule
        {
          "MMM-PrixCarburants": "npm run update"
        },
      ]
    }
  },
```

## Remerciements
 * kelly97129 pour son idée

## Sources
 * Ce module reprend plus ou moins le meme principe que le plugin [prixcarburants](https://github.com/floman321/prixcarburants) pour jeedom
 * Ce module utilise la base de donnée [nationale du prix carburants](https://www.prix-carburants.gouv.fr/)

## Notes:
 * Afin de ne pas perturber le chargement des autres modules, ce module va mettre environ 30 secondes environ pour s'afficher lors du premier démarrage (démarrage différé via startDelay)
