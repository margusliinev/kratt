import type { ConversationSummary, ConversationWithMessages, LlmMessage, Message, ToolUseEvent } from '../types';
import { conversationRepository, messageRepository } from '../repositories';
import { streamChat } from './anthropic';

const THROTTLE_MS = 100;

function generateId(): string {
    return crypto.randomUUID();
}

function deriveTitle(content: string): string {
    const trimmed = content.trim().slice(0, 50);
    return trimmed.length < content.trim().length ? `${trimmed}...` : trimmed;
}

export type StreamChunk =
    | {
          type: 'text';
          delta: string;
          fullText: string;
      }
    | {
          type: 'text_end';
          fullText: string;
      }
    | {
          type: 'tool_use';
          event: ToolUseEvent;
      }
    | {
          type: 'user_message';
          message: Message;
      };

export const chatService = {
    listConversations(limit = 50, offset = 0): ConversationSummary[] {
        return conversationRepository.list(limit, offset);
    },

    createConversation(title?: string): { id: string } {
        const id = generateId();
        conversationRepository.create(id, title ?? 'New Conversation');
        return { id };
    },

    loadConversation(id: string): ConversationWithMessages | null {
        const conversation = conversationRepository.get(id);
        if (!conversation) return null;

        const messages = messageRepository.listByConversation(id);
        return { conversation, messages };
    },

    deleteConversation(id: string): void {
        conversationRepository.delete(id);
    },

    async *streamAssistantReply(conversationId: string, userText: string, options?: { signal?: AbortSignal }): AsyncGenerator<StreamChunk> {
        const userMessageId = generateId();
        const userMessage = messageRepository.insert({
            id: userMessageId,
            conversationId,
            role: 'user',
            content: userText,
            status: 'final'
        });

        yield { type: 'user_message', message: userMessage };

        const conversationMessages = messageRepository.listByConversation(conversationId);
        const isFirstMessage = conversationMessages.length === 1;

        if (isFirstMessage) {
            conversationRepository.updateTitle(conversationId, deriveTitle(userText));
        }

        const assistantMessageId = generateId();
        messageRepository.insert({
            id: assistantMessageId,
            conversationId,
            role: 'assistant',
            content: '',
            status: 'streaming'
        });

        const chatMessages: LlmMessage[] = conversationMessages
            .filter((m): m is Message & { role: 'user' | 'assistant' } => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content }));

        let fullText = '';
        let lastPersistTime = 0;
        const signal = options?.signal;

        try {
            for await (const event of streamChat(chatMessages)) {
                if (signal?.aborted) {
                    messageRepository.updateContent(assistantMessageId, fullText, 'aborted');
                    conversationRepository.touch(conversationId);
                    return;
                }

                if (event.type === 'text_delta') {
                    fullText += event.text;

                    const now = Date.now();
                    if (now - lastPersistTime >= THROTTLE_MS) {
                        messageRepository.updateContent(assistantMessageId, fullText);
                        lastPersistTime = now;
                    }

                    yield { type: 'text', delta: event.text, fullText };
                } else if (event.type === 'text_end') {
                    yield { type: 'text_end', fullText: event.fullText };
                } else if (event.type === 'tool_use') {
                    yield { type: 'tool_use', event };
                }
            }

            messageRepository.updateContent(assistantMessageId, fullText, 'final');
            conversationRepository.touch(conversationId);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            const errorContent = fullText ? `${fullText}\n\nError: ${errorMessage}` : `Error: ${errorMessage}`;
            messageRepository.updateContent(assistantMessageId, errorContent, 'error');
            conversationRepository.touch(conversationId);
            throw error;
        }
    },

    getMessages(conversationId: string): Message[] {
        return messageRepository.listByConversation(conversationId);
    }
};
