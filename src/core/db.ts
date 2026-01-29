import { Database } from 'bun:sqlite';

const DB_PATH = 'kratt.db';

function createDatabase(): Database {
    const db = new Database(DB_PATH);

    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA foreign_keys = ON');

    db.run(`
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
            content TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'final' CHECK(status IN ('final', 'streaming', 'aborted', 'error')),
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_messages_conv_created
        ON messages(conversation_id, created_at)
    `);

    return db;
}

export const db = createDatabase();
