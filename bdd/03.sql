
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'active', 'rgpd')) NOT NULL DEFAULT 'pending'
);

-- ONE USER PER note
ALTER TABLE notes ADD COLUMN user_id INTEGER;
-- ONE USER PER board
ALTER TABLE boards ADD COLUMN user_id INTEGER;

-- FK to notes and boards table
-- ALSO REMOVE TAG because of step 2
BEGIN TRANSACTION;
ALTER TABLE notes RENAME TO old_notes;
CREATE TABLE notes (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    dateCreated DATETIME,
    dateUpdated DATETIME,
    title TEXT,
    content TEXT,
    board_id INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(board_id) REFERENCES boards(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
INSERT INTO notes (rowid, dateCreated, dateUpdated, title, content, board_id, user_id)
SELECT rowid, dateCreated, dateUpdated, title, content, board_id, 1 FROM old_notes;
DROP TABLE old_notes;
COMMIT;

-- Same as notes migration for FK user
BEGIN TRANSACTION;
ALTER TABLE boards RENAME TO old_boards;
CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
INSERT INTO boards (id, name, user_id)
SELECT id, name, 1 FROM old_boards;
DROP TABLE old_boards;
COMMIT;
