import type { Conversation, ConversationSummary } from '../types';
import { db } from '../db';

type ConversationRow = {
    id: string;
    title: string;
    created_at: number;
    updated_at: number;
};

type ConversationSummaryRow = ConversationRow & {
    message_count: number;
};

function rowToConversation(row: ConversationRow): Conversation {
    return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function rowToSummary(row: ConversationSummaryRow): ConversationSummary {
    return {
        id: row.id,
        title: row.title,
        updatedAt: row.updated_at,
        messageCount: row.message_count
    };
}

export const conversationRepo = {
    create(id: string, title: string): Conversation {
        const now = Date.now();
        db.run(
            'INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)',
            [id, title, now, now]
        );
        return { id, title, createdAt: now, updatedAt: now };
    },

    get(id: string): Conversation | null {
        const row = db.query<ConversationRow, [string]>(
            'SELECT id, title, created_at, updated_at FROM conversations WHERE id = ?'
        ).get(id);
        return row ? rowToConversation(row) : null;
    },

    list(limit = 50, offset = 0): ConversationSummary[] {
        const rows = db.query<ConversationSummaryRow, [number, number]>(`
            SELECT 
                c.id, 
                c.title, 
                c.updated_at,
                COUNT(m.id) as message_count
            FROM conversations c
            LEFT JOIN messages m ON m.conversation_id = c.id
            GROUP BY c.id
            ORDER BY c.updated_at DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset);
        return rows.map(rowToSummary);
    },

    updateTitle(id: string, title: string): void {
        db.run(
            'UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?',
            [title, Date.now(), id]
        );
    },

    touch(id: string): void {
        db.run('UPDATE conversations SET updated_at = ? WHERE id = ?', [Date.now(), id]);
    },

    delete(id: string): void {
        db.run('DELETE FROM conversations WHERE id = ?', [id]);
    }
};
