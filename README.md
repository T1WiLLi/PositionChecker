# Position Checker

**Position Checker** est un outil web permettant de gérer et manipuler des formes sur un canvas. Les utilisateurs peuvent créer, déplacer, pivoter et modifier diverses propriétés de formes telles que des rectangles, des cercles et des triangles. Cet outil offre également un système de grille, des contrôles de rotation et un panneau d'information pour ajuster les formes avec précision.

## Fonctionnalités

- **Création de formes** : Ajouter des formes (Rectangles, Cercles, Triangles) sur le canevas.

- **Manipulation des formes** : Déplacer, redimensionner, pivoter et changer la couleur des formes.

- **Système de grille** : Aligner les formes sur une grille personnalisable pour un placement précis.

- **Panneau d'informations dynamiques** : Visualiser et mettre à jour les propriétés des formes (ex : position, rotation, taille).

- **Suppression de formes** : Supprimer des formes sélectionnées du canevas.

- **Redimensionnement du canevas** : Ajuster la largeur et la hauteur du canevas.

- **Contrôles rapides de rotation** : Faire pivoter les formes selon des angles prédéfinis (0°, 90°, 180°, 270°).

## Table des matières

- [Installation](#installation)

- [Utilisation](#utilisation)

- [Structure du projet](#structure-du-projet)

- [Personnalisation](#personnalisation)

- [Licence](#licence)

## Installation

Vous n'avez **pas besoin de télécharger** l'application pour l'utiliser. Rendez-vous directement sur le site hébergé via GitHub Pages :

**[Utiliser Position Checker en ligne](https://t1willi.github.io/PositionChecker/)**

Si vous souhaitez télécharger le projet pour l'héberger ou le modifier localement, suivez les étapes ci-dessous :

1\. Clonez ou téléchargez ce dépôt GitHub.

2\. Ouvrez le fichier `index.html` dans un navigateur web moderne pour démarrer l'application.

### Pré-requis

- Navigateur web moderne (Chrome, Firefox, etc.).

- Connexion Internet (pour charger des ressources externes comme les icônes).

## Utilisation

- **Utilisation en ligne** : Accédez directement à l'application via GitHub Pages [ici](https://t1willi.github.io/PositionChecker/) sans avoir à la télécharger.

- **Créer des formes** : Utilisez les boutons dans la section "Contrôles" pour ajouter des formes (Rectangle, Cercle, Triangle) sur le canevas.

- **Redimensionner le canevas** : Saisissez les dimensions souhaitées pour le canevas, puis cliquez sur le bouton "Redimensionner le canevas".

- **Taille de la grille** : Ajustez la taille de la grille pour l'alignement en saisissant la valeur en pixels.

- **Propriétés des formes** : Sélectionnez une forme dans la liste ou directement sur le canevas pour modifier ses propriétés (position, taille, rotation, couleur).

- **Supprimer une forme** : Appuyez sur la touche "Supprimer" pour effacer la forme sélectionnée.

## Structure du projet

```

|-- index.html         # Structure HTML principale

|-- style.css          # Style de l'application

|-- script.js          # Logique JavaScript pour la gestion des formes

|-- assets/            # (Optionnel) Dossier pour des ressources supplémentaires comme des images/icônes

```

### Principaux composants

1\. **Canevas** : Où les formes sont dessinées et manipulées.

2\. **Liste des formes** : Affiche la liste des formes créées avec un accès rapide aux propriétés.

3\. **Panneau des éléments** : Affiche les informations détaillées sur la forme sélectionnée, permettant de modifier ses propriétés telles que la taille, la rotation et la couleur.

4\. **Contrôles** : Outils pour créer des formes, redimensionner le canevas et ajuster la taille de la grille.

## Personnalisation

### Ajouter de nouvelles formes

Pour ajouter de nouveaux types de formes :

1\. Étendez la classe `Shape` pour définir une nouvelle forme.

2\. Implémentez les méthodes `draw` et `contains` pour la nouvelle forme dans `script.js`.

3\. Mettez à jour la fonction `createShape` pour gérer le nouveau type de forme.

### Modifier les propriétés des formes

Vous pouvez personnaliser les propriétés des formes telles que :

- **Taille par défaut** (largeur, hauteur, rayon).

- **Couleur par défaut** et transparence.

- **Sensibilité de l'alignement sur la grille** en changeant la taille par défaut de la grille.

### Style

Vous pouvez modifier l'apparence visuelle en éditant le fichier `style.css` :

- Changez le fond, les styles de police ou la disposition.

- Personnalisez le panneau d'informations ou les boutons de contrôle pour un style différent.

## Licence

**Position Checker** est développé par **William Beaudin** dans le cadre du projet de cours **POO-2** pour l'année **2024-2025**.

Sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Lien GitHub Pages

L'application est disponible en ligne via GitHub Pages à l'adresse suivante : **[Utiliser Position Checker](https://t1willi.github.io/PositionChecker/)**.
