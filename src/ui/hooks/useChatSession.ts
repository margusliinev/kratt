import type { Message, ToolUseEvent } from '../../core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatService } from '../../core';

export type ChatSessionState = {
    messages: Message[];
    streamingContent: string | undefined;
    toolEvents: ToolUseEvent[];
    isLoading: boolean;
};

export type ChatSessionActions = {
    submit: (_prompt: string, _targetConversationId?: string) => Promise<void>;
    reset: () => void;
};

export type UseChatSessionReturn = ChatSessionState &
    ChatSessionActions & {
        conversationId: string | null;
    };

export function useChatSession(conversationId: string | null): UseChatSessionReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingContent, setStreamingContent] = useState<string | undefined>(undefined);
    const [toolEvents, setToolEvents] = useState<ToolUseEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            setStreamingContent(undefined);
            setToolEvents([]);
            setIsLoading(false);
            return;
        }

        const data = chatService.loadConversation(conversationId);
        if (data) {
            setMessages(data.messages);
        } else {
            setMessages([]);
        }
        setStreamingContent(undefined);
        setToolEvents([]);
        setIsLoading(false);
    }, [conversationId]);

    const submit = useCallback(
        async (prompt: string, targetConversationId?: string) => {
            const trimmedPrompt = prompt.trim();
            const convId = targetConversationId ?? conversationId;
            if (!trimmedPrompt || isLoading || !convId) return;

            setIsLoading(true);
            setStreamingContent('');
            setToolEvents([]);

            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const stream = chatService.streamAssistantReply(convId, trimmedPrompt, { signal });

                for await (const chunk of stream) {
                    if (signal.aborted) break;

                    if (chunk.type === 'user_message') {
                        setMessages((prev) => [...prev, chunk.message]);
                    } else if (chunk.type === 'text') {
                        setStreamingContent(chunk.fullText);
                    } else if (chunk.type === 'text_end') {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: `streaming-${Date.now()}`,
                                conversationId: convId,
                                role: 'assistant',
                                content: chunk.fullText,
                                status: 'final',
                                createdAt: Date.now(),
                                updatedAt: Date.now()
                            }
                        ]);
                        setStreamingContent('');
                    } else if (chunk.type === 'tool_use') {
                        setToolEvents((prev) => {
                            const existingIndex = prev.findIndex((e) => e.toolUseId === chunk.event.toolUseId);
                            if (existingIndex >= 0) {
                                const existing = prev[existingIndex]!;
                                const updated = [...prev];
                                updated[existingIndex] = { ...chunk.event, timestamp: existing.timestamp };
                                return updated;
                            }
                            return [...prev, { ...chunk.event, timestamp: Date.now() }];
                        });
                    }
                }

                const updatedMessages = chatService.getMessages(convId);
                setMessages(updatedMessages);
            } catch {
                const updatedMessages = chatService.getMessages(convId);
                setMessages(updatedMessages);
            } finally {
                setStreamingContent(undefined);
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [conversationId, isLoading]
    );

    const reset = useCallback(() => {
        abortControllerRef.current?.abort();
        setMessages([]);
        setStreamingContent(undefined);
        setToolEvents([]);
        setIsLoading(false);
    }, []);

    return {
        conversationId,
        messages,
        streamingContent,
        toolEvents,
        isLoading,
        submit,
        reset
    };
}
