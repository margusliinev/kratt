import type { ConversationSummary, ConversationWithMessages, Message } from '../types';
import { conversationRepo, messageRepo } from '../repos';
import { streamChat } from '../../common/chat';

const THROTTLE_MS = 100;

function generateId(): string {
    return crypto.randomUUID();
}

function deriveTitle(content: string): string {
    const trimmed = content.trim().slice(0, 50);
    return trimmed.length < content.trim().length ? `${trimmed}...` : trimmed;
}

export type StreamChunk = {
    delta: string;
    fullText: string;
};

export const chatService = {
    listConversations(limit = 50, offset = 0): ConversationSummary[] {
        return conversationRepo.list(limit, offset);
    },

    createConversation(title?: string): { id: string } {
        const id = generateId();
        conversationRepo.create(id, title ?? 'New Conversation');
        return { id };
    },

    loadConversation(id: string): ConversationWithMessages | null {
        const conversation = conversationRepo.get(id);
        if (!conversation) return null;

        const messages = messageRepo.listByConversation(id);
        return { conversation, messages };
    },

    deleteConversation(id: string): void {
        conversationRepo.delete(id);
    },

    async *streamAssistantReply(
        conversationId: string,
        userText: string,
        options?: { signal?: AbortSignal }
    ): AsyncGenerator<StreamChunk> {
        const userMessageId = generateId();
        messageRepo.insert({
            id: userMessageId,
            conversationId,
            role: 'user',
            content: userText,
            status: 'final'
        });

        const existingMessages = messageRepo.listByConversation(conversationId);
        const isFirstMessage = existingMessages.length === 1;

        if (isFirstMessage) {
            conversationRepo.updateTitle(conversationId, deriveTitle(userText));
        }

        const assistantMessageId = generateId();
        messageRepo.insert({
            id: assistantMessageId,
            conversationId,
            role: 'assistant',
            content: '',
            status: 'streaming'
        });

        const chatMessages = existingMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
        }));

        let fullText = '';
        let lastPersistTime = 0;
        const signal = options?.signal;

        try {
            for await (const chunk of streamChat(chatMessages)) {
                if (signal?.aborted) {
                    messageRepo.updateContent(assistantMessageId, fullText, 'aborted');
                    conversationRepo.touch(conversationId);
                    return;
                }

                fullText += chunk;

                const now = Date.now();
                if (now - lastPersistTime >= THROTTLE_MS) {
                    messageRepo.updateContent(assistantMessageId, fullText);
                    lastPersistTime = now;
                }

                yield { delta: chunk, fullText };
            }

            messageRepo.updateContent(assistantMessageId, fullText, 'final');
            conversationRepo.touch(conversationId);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            const errorContent = fullText ? `${fullText}\n\nError: ${errorMessage}` : `Error: ${errorMessage}`;
            messageRepo.updateContent(assistantMessageId, errorContent, 'error');
            conversationRepo.touch(conversationId);
            throw error;
        }
    },

    getMessages(conversationId: string): Message[] {
        return messageRepo.listByConversation(conversationId);
    }
};
