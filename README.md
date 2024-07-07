
# SETON

Ou "notes" à l'envers.

## Installation

- [installer nodejs](https://nodejs.org/en/download/prebuilt-installer)
- télécharger une copie du code de ce dépôt
- à la racine du code télécharger, effectuer un `npm install`

## Utilisation

Tous les fichiers à développer sont dans `/public/`
Le fichier `app.js` est le back-end.
Le fichier `package.json` est la liste des packages nécessaires pour le fonctionnement.
Le dossier `node_modules` et le fichier `package-lock.json` sont des éléments techniques qui peuvent être omis et sont recréés automatiquement via `npm install` au besoin.

## Documentation API

`GET /api/`
Obtient la liste des notes.

`GET /api/:id`
Obtient la note `:id`

`PUT /api/`
Crée une nouvelle note
Paramètres :
- `title` (optionnel) : titre de la note
- `content` (optionnel) : contenu de la note

`PATCH /api/:id`
Modifie la note `:id`
Paramètres :
- `title` (optionnel)
- `content` (optionnel)

`DELETE /api/:id`
Supprime la note `:id`

`POST /api/:id`
Tagge la note `:id`
Paramètres :
- `tag` (optionnel) : type de tag, si négligé, null est utilisé

## Consignes

L'objectif est de réaliser le front-end d'une application de gestion de notes.
Nous ne gérerons pas l'authentification.

### HTML / CSS

**Il est interdit de modifier le fichier index.html.**

__Consignes obligatoires__

- un style doit être appliqué si un tag est effectif
- un style doit être appliqué pour indiquer des changements non-sauvegardés sur une note
- on ne doit pas voir les bullets des éléments de listes

__Consignes à charge__

Vous pouvez appliquer les différents styles CSS que vous souhaitez - l'originalité et le travail déployé seront pris en compte dans la notation.

### Javascript

Certaines fonctions sont données, afin de vous aider à démarrer.

```js
function copyTpl() {
    return document.querySelector('#tpl_notes').content.lastElementChild.cloneNode(true);
}

function createNote() {
    const t = window.prompt('Titre de la note ?');
    create(t, null).then((res) => {
        const id = res.result.id;
        insertNoteBlock(id, t, '', null, null, null);
        retrieve(id);
    });
}

function list() {
    fetch('/api/')
        .then((e) => { return e.json(); })
        .then((r) => {
            for (let l of r.notes) {
                insertNoteBlock(l.rowid, l.title, l.content, l.tag, l.dateCreated, l.dateUpdated);
            }
        });
}

function getNoteBlock(id) {
    return document.querySelector('li[data-noteid="' + id + '"]');
}

function tag(id, tag) {
    fetch('/api/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'tag': tag })
    })
        .then((e) => { return e.json(); })
        .then((r) => {
            if(null === tag) {
                delete getNoteBlock(id).dataset.tag;
            } else {
                getNoteBlock(id).dataset.tag = tag;
            }
        });
}

function untag(id) {
    tag(id, null);
}

function isTagged(id) {
    return ('important' == getNoteBlock(id).dataset.tag);
}
```

Certaines signatures de fonction sont également indiquées, dans le même objectif.

*RAPPEL : on ne peut typer, en Javascript, des arguments ou des retours, les types indiqués dans les signatures ici ne sont que des aides pour votre compréhension*

```js
insertNoteBlock(id, title, content, tag, dateCreated, dateUpdated): void
list(): void
retrieve(id): void
async create(title, content): void
change(id, title, content): void
remove(id): void
flagAsUnsaved(id): void
flagAsSaved(id): void
isFlaggedAsUnsaved(id): boolean
```

Vous pouvez, en plus de ces diverses fonctions, créer autant de fonctions et variables que nécessaire.

## Base de données

**ATTENTION** dans cette partie, aucune modification du fichier `app.js` n'est demandée.
Pour chaque élément est demandé un fichier SQL de migration (du schéma et des données).

### Gestion des boards

Ajouter un concept de board : une board possède un nom, et rassemble des notes. Une note peut - ou non - être dans une board (mais pas plusieurs).

### Gestion des étiquettes

Le concept d'étiquettes (tags) est actuellement limité. Il faut l'étendre :
- une note peut posséder plusieurs étiquettes
- une note peut aussi ne posséder aucune étiquette
- on doit pouvoir choisir parmi des étiquettes existantes
- les étiquettes existantes avant la migration doivent être portées

### Gestion des users

Ajouter la gestion des utilisateurs (login unique, email, mot de passe chiffré).
Un compte utilisateur a plusieurs statut potentiels : en attente, actif, rgpd.
Les comptes en statut "RGPD" ont été purgées de leur données personnelles.
Une note est forcément rattachée à un utilisateur, de même qu'une board et une étiquette.

### Gestion des listes

Ajouter un nouveau type de note : les listes.
Ce sont des notes classiques, mais au lieu de contenir un contenu textuel, elles contiennent une liste d'éléments, qui peuvent être "cochés" ou non.
