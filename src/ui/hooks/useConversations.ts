import type { ConversationSummary } from '../../core';
import { useCallback, useEffect, useState } from 'react';
import { chatService } from '../../core';

export type UseConversationsReturn = {
    conversations: ConversationSummary[];
    selectedId: string | null;
    isLoading: boolean;
    select: (_id: string | null) => void;
    create: () => string;
    remove: (_id: string) => void;
    refresh: () => void;
};

export function useConversations(): UseConversationsReturn {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useCallback(() => {
        const list = chatService.listConversations();
        setConversations(list);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const select = useCallback((id: string | null) => {
        setSelectedId(id);
    }, []);

    const create = useCallback(() => {
        const { id } = chatService.createConversation();
        refresh();
        setSelectedId(id);
        return id;
    }, [refresh]);

    const remove = useCallback(
        (id: string) => {
            chatService.deleteConversation(id);
            if (selectedId === id) {
                setSelectedId(null);
            }
            refresh();
        },
        [selectedId, refresh]
    );

    return {
        conversations,
        selectedId,
        isLoading,
        select,
        create,
        remove,
        refresh
    };
}
