CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE note_tags (
    note_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY(note_id) REFERENCES notes(rowid),
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    PRIMARY KEY (note_id, tag_id)
);

-- Migration ( Remplissage des tags )
BEGIN TRANSACTION;
INSERT INTO tags (name) SELECT tag FROM notes WHERE tag IS NOT NULL;
INSERT INTO note_tags (note_id, tag_id)
SELECT rowid, (SELECT id FROM tags WHERE name = notes.tag) FROM notes WHERE tag IS NOT NULL;
UPDATE notes SET tag = NULL;
COMMIT;



/* REMOVED BECAUSE WE CAN DO IT IN STEP3
BEGIN TRANSACTION;
ALTER TABLE notes RENAME TO old_notes;
CREATE TABLE notes (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    dateCreated DATETIME,
    dateUpdated DATETIME,
    title TEXT,
    content TEXT,
    board_id INTEGER,
    FOREIGN KEY(board_id) REFERENCES boards(id)
);
INSERT INTO notes (rowid, dateCreated, dateUpdated, title, content, board_id)
SELECT rowid, dateCreated, dateUpdated, title, content, board_id FROM old_notes;
DROP TABLE old_notes;
COMMIT;
*/
