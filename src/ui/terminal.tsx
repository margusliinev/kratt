import { ConversationList, ConversationPanel, Divider, HelpBar, InputPrompt, Logo } from './components';
import { useKeyboard, useTerminalDimensions } from '@opentui/react';
import { useChatSession, useConversations } from './hooks';
import { ChatLayout, MainLayout } from './layouts';
import { useCallback, useState } from 'react';
import { colors, spacing } from './theme';

type View = 'welcome' | 'chat' | 'history';

const WELCOME_HINTS = [
    { keys: 'Enter', action: 'Send' },
    { keys: 'Ctrl+H', action: 'History' },
    { keys: 'Ctrl+C', action: 'Exit' }
];

const CHAT_HINTS = [
    { keys: 'Enter', action: 'Send' },
    { keys: 'Ctrl+N', action: 'New Chat' },
    { keys: 'Ctrl+H', action: 'History' },
    { keys: 'Ctrl+C', action: 'Exit' }
];

const HISTORY_HINTS = [
    { keys: '↑↓', action: 'Navigate' },
    { keys: 'Enter', action: 'Open' },
    { keys: 'Ctrl+N', action: 'New Chat' },
    { keys: 'Ctrl+D', action: 'Delete' },
    { keys: 'Esc', action: 'Back' }
];

function computeInputWidth(termWidth: number): number {
    return Math.min(Math.max(termWidth - 6, 30), 100);
}

export function Terminal() {
    const { width: termWidth } = useTerminalDimensions();
    const [view, setView] = useState<View>('welcome');
    const [inputValue, setInputValue] = useState('');
    const [historyIndex, setHistoryIndex] = useState(0);

    const { conversations, selectedId, select, create, remove, refresh } = useConversations();
    const { messages, streamingContent, toolEvents, isLoading, submit } = useChatSession(selectedId);

    const inputWidth = computeInputWidth(termWidth);

    const handleSubmit = useCallback(async () => {
        const prompt = inputValue.trim();
        if (!prompt || isLoading) return;

        const targetId = selectedId ?? create();

        setInputValue('');

        if (view === 'welcome') {
            setView('chat');
        }

        await submit(prompt, targetId);
        refresh();
    }, [inputValue, isLoading, selectedId, view, create, submit, refresh]);

    const handleNewChat = useCallback(() => {
        select(null);
        setInputValue('');
        setView('welcome');
    }, [select]);

    const handleOpenConversation = useCallback(
        (id: string) => {
            select(id);
            setView('chat');
        },
        [select]
    );

    const handleDeleteSelected = useCallback(() => {
        if (conversations.length === 0) return;
        const conv = conversations[historyIndex];
        if (conv) {
            remove(conv.id);
            setHistoryIndex(Math.max(0, Math.min(historyIndex, conversations.length - 2)));
        }
    }, [conversations, historyIndex, remove]);

    useKeyboard((key) => {
        if (key.ctrl && key.name === 'n' && (view === 'chat' || view === 'history')) {
            handleNewChat();
        }
        if (key.ctrl && key.name === 'h') {
            if (view === 'history') {
                if (selectedId) {
                    setView('chat');
                } else {
                    setView('welcome');
                }
            } else {
                refresh();
                setHistoryIndex(0);
                setView('history');
            }
        }
        if (key.ctrl && key.name === 'd' && view === 'history') {
            handleDeleteSelected();
        }
        if (key.name === 'escape' && view === 'history') {
            if (selectedId) {
                setView('chat');
            } else {
                setView('welcome');
            }
        }
    });

    if (view === 'history') {
        return (
            <MainLayout header={<Logo showTagline={false} size='sm' />} footer={<HelpBar hints={HISTORY_HINTS} />}>
                <box flexDirection='column' alignItems='center' gap={spacing.md}>
                    <text fg={colors.fg.secondary}>Conversation History</text>
                    <Divider length={40} variant='solid' />
                    <ConversationList
                        conversations={conversations}
                        selectedIndex={historyIndex}
                        onSelectIndex={setHistoryIndex}
                        onOpen={handleOpenConversation}
                        width={50}
                    />
                    {conversations.length === 0 && <text fg={colors.fg.muted}>Press Ctrl+N to start a new conversation</text>}
                </box>
            </MainLayout>
        );
    }

    if (view === 'welcome') {
        return (
            <MainLayout
                header={<Logo showTagline={true} size='md' />}
                footer={
                    <box flexDirection='column' alignItems='center' gap={spacing.sm}>
                        <Divider length={50} variant='solid' />
                        <HelpBar hints={WELCOME_HINTS} />
                    </box>
                }
            >
                <box flexDirection='column' alignItems='center' gap={spacing.lg} width={inputWidth}>
                    <text fg={colors.fg.secondary}>What do you want to build?</text>
                    <InputPrompt
                        value={inputValue}
                        placeholder='Ask anything...'
                        focused={true}
                        loading={false}
                        disabled={false}
                        onInput={setInputValue}
                        onSubmit={handleSubmit}
                        width={inputWidth}
                    />
                </box>
            </MainLayout>
        );
    }

    return (
        <ChatLayout
            header={<Logo showTagline={false} size='sm' />}
            conversation={<ConversationPanel messages={messages} streamingContent={streamingContent} toolEvents={toolEvents} />}
            input={
                <InputPrompt
                    value={inputValue}
                    placeholder={isLoading ? '' : 'Continue the conversation...'}
                    focused={true}
                    loading={isLoading}
                    disabled={isLoading}
                    onInput={setInputValue}
                    onSubmit={handleSubmit}
                    width={inputWidth}
                />
            }
            footer={<HelpBar hints={CHAT_HINTS} />}
        />
    );
}
