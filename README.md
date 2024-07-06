
# SETON

Ou "notes" à l'envers.

## Installation

- [installer nodejs](https://nodejs.org/en/download/prebuilt-installer)
- télécharger une copie du code de ce dépôt
- à la racine du code télécharger, effectuer un `npm install`

## Utilisation

Tous les fichiers à développer sont dans /public/
Le fichier app.js est le back-end.
Le fichier package.json est la liste des packages nécessaires pour le fonctionnement.
Le dossier node_modules et le fichier package-lock.json sont des éléments techniques qui peuvent être omis et sont recréés automatiquement via `npm install` au besoin.

## Documentation API

GET /api/
Obtient la liste des notes.

GET /api/:id
Obtient la note :id

PUT /api/
Crée une nouvelle note

PATCH /api/:id
Modifie la note :id

DELETE /api/:id
Supprime la note :id

POST /api/:id
Tagge la note :id
