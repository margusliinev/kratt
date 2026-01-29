import type { Message } from '../../core';
import { useCallback, useState, useRef, useEffect } from 'react';
import { chatService } from '../../core';

export type ChatSessionState = {
    messages: Message[];
    streamingContent: string | undefined;
    isLoading: boolean;
};

export type ChatSessionActions = {
    submit: (prompt: string, targetConversationId?: string) => Promise<void>;
    reset: () => void;
};

export type UseChatSessionReturn = ChatSessionState &
    ChatSessionActions & {
        conversationId: string | null;
    };

export function useChatSession(conversationId: string | null): UseChatSessionReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingContent, setStreamingContent] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            setStreamingContent(undefined);
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
        setIsLoading(false);
    }, [conversationId]);

    const submit = useCallback(
        async (prompt: string, targetConversationId?: string) => {
            const trimmedPrompt = prompt.trim();
            const convId = targetConversationId ?? conversationId;
            if (!trimmedPrompt || isLoading || !convId) return;

            setIsLoading(true);
            setStreamingContent('');

            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const stream = chatService.streamAssistantReply(convId, trimmedPrompt, { signal });

                setMessages((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        conversationId: convId,
                        role: 'user',
                        content: trimmedPrompt,
                        status: 'final',
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    }
                ]);

                for await (const chunk of stream) {
                    if (signal.aborted) break;
                    setStreamingContent(chunk.fullText);
                }

                const updatedMessages = chatService.getMessages(convId);
                setMessages(updatedMessages);
            } catch (error) {
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
        setIsLoading(false);
    }, []);

    return {
        conversationId,
        messages,
        streamingContent,
        isLoading,
        submit,
        reset
    };
}
