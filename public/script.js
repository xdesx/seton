
// Au chargement get les notes + mettre listener sur les bouttons create
document.addEventListener("DOMContentLoaded", () => {
    list();

    document.querySelectorAll('.new').forEach(btn => {
        btn.addEventListener('click', (e) => {
            createNote();
        }); 
    });
});


function insertNoteBlock(id, title, content, tagNote, dateCreated, dateUpdated) {
    const note = copyTpl();
    note.dataset.noteid = id; // pour getNoteBlock    FIXED
    //const li = note.querySelector('li'); // PROBLEM HERE  
    //li.dataset.noteid = id;

    const titleInput = note.querySelector('.title');
    titleInput.value = title;
    titleInput.addEventListener('input', () => flagAsUnsaved(id));

    const contentTextarea = note.querySelector('.content');
    contentTextarea.value = content;
    contentTextarea.addEventListener('input', () => flagAsUnsaved(id));

    note.querySelector('.save').addEventListener('click', (e) => {
        e.preventDefault(); // Bloquer le comportement par defaut (form post)
        change(id, titleInput.value, contentTextarea.value);
    });

    note.querySelector('.delete').addEventListener('click', (e) => {
        e.preventDefault();
        remove(id);
    });

    note.querySelector('.tag').addEventListener('click', (e) => {
        e.preventDefault();
        if (isTagged(id)) {
            untag(id);
        } else {
            tag(id, 'important');
        }
    });

    if (tagNote) note.dataset.tag = tagNote;
    note.querySelector('.dateCreated').textContent = formatDate(dateCreated);
    note.querySelector('.dateUpdated').textContent = formatDate(dateUpdated);

    document.querySelector('#notes').appendChild(note);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

async function create(title, content) {
    return fetch('/api/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    }).then(response => response.json());
}

function remove(id) {
    fetch('/api/' + id, {
        method: 'DELETE'
    }).then(() => {
        const note = getNoteBlock(id);
        note.remove();
    });
}

function change(id, title, content) {
    fetch('/api/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    }).then(() => {
        flagAsSaved(id);
        const note = getNoteBlock(id);
        note.querySelector('.dateUpdated').textContent = formatDate(new Date().toISOString());
    });
}

function retrieve(id) {
    fetch('/api/' + id)
        .then(response => response.json())
        .then(data => {
            const note = getNoteBlock(id);
            note.querySelector('.title').value = data.note.title;
            note.querySelector('.content').textContent = data.note.content;
            note.querySelector('.dateCreated').textContent = formatDate(data.note.dateCreated);
            note.querySelector('.dateUpdated').textContent = formatDate(data.note.dateUpdated);
        });
}

// FLAGS

function flagAsUnsaved(id) {
    const note = getNoteBlock(id);
    note.classList.add('unsaved');
}

function flagAsSaved(id) {
    const note = getNoteBlock(id);
    note.classList.remove('unsaved');
}



// CODE FOURNI
function copyTpl() {
    return document.querySelector('#tpl_notes').content.lastElementChild.cloneNode(true);
}

function createNote() {
    const t = window.prompt('Titre de la note ?');
    create(t, null).then((res) => {
        const id = res.result.id;    // EDIT : Ajout des dates
        insertNoteBlock(id, t, '', null, new Date().toISOString(), new Date().toISOString());
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