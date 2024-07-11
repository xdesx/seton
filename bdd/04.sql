-- Update notes for new type
ALTER TABLE notes ADD COLUMN type TEXT CHECK(type IN ('note', 'list')) NOT NULL DEFAULT 'note';

CREATE TABLE list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER,
    content TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY(note_id) REFERENCES notes(rowid)
);