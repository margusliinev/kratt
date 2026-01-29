import type { Message, MessageRole, MessageStatus } from '../types';
import { db } from '../db';

type MessageRow = {
    id: string;
    conversation_id: string;
    role: MessageRole;
    content: string;
    status: MessageStatus;
    created_at: number;
    updated_at: number;
};

function rowToMessage(row: MessageRow): Message {
    return {
        id: row.id,
        conversationId: row.conversation_id,
        role: row.role,
        content: row.content,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export const messageRepo = {
    insert(params: {
        id: string;
        conversationId: string;
        role: MessageRole;
        content: string;
        status?: MessageStatus;
    }): Message {
        const now = Date.now();
        const status = params.status ?? 'final';
        db.run(
            `INSERT INTO messages (id, conversation_id, role, content, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [params.id, params.conversationId, params.role, params.content, status, now, now]
        );
        return {
            id: params.id,
            conversationId: params.conversationId,
            role: params.role,
            content: params.content,
            status,
            createdAt: now,
            updatedAt: now
        };
    },

    listByConversation(conversationId: string): Message[] {
        const rows = db.query<MessageRow, [string]>(
            `SELECT id, conversation_id, role, content, status, created_at, updated_at 
             FROM messages 
             WHERE conversation_id = ? 
             ORDER BY created_at ASC`
        ).all(conversationId);
        return rows.map(rowToMessage);
    },

    updateContent(id: string, content: string, status?: MessageStatus): void {
        if (status) {
            db.run(
                'UPDATE messages SET content = ?, status = ?, updated_at = ? WHERE id = ?',
                [content, status, Date.now(), id]
            );
        } else {
            db.run(
                'UPDATE messages SET content = ?, updated_at = ? WHERE id = ?',
                [content, Date.now(), id]
            );
        }
    },

    updateStatus(id: string, status: MessageStatus): void {
        db.run(
            'UPDATE messages SET status = ?, updated_at = ? WHERE id = ?',
            [status, Date.now(), id]
        );
    },

    get(id: string): Message | null {
        const row = db.query<MessageRow, [string]>(
            `SELECT id, conversation_id, role, content, status, created_at, updated_at 
             FROM messages WHERE id = ?`
        ).get(id);
        return row ? rowToMessage(row) : null;
    },

    delete(id: string): void {
        db.run('DELETE FROM messages WHERE id = ?', [id]);
    }
};
