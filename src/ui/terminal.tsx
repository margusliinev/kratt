import { streamChat, type Message } from '../common/chat';
import { Logo, InputPrompt, HelpBar, ConversationPanel, Divider } from './components';
import { useTerminalDimensions, useKeyboard } from '@opentui/react';
import { MainLayout, ChatLayout } from './layouts';
import { useCallback, useState, useRef } from 'react';
import { colors, spacing } from './theme';

type View = 'welcome' | 'chat';

export function Terminal() {
    const { width: termWidth } = useTerminalDimensions();
    const [view, setView] = useState<View>('welcome');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingContent, setStreamingContent] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const abortRef = useRef(false);

    const inputWidth = Math.min(Math.max(termWidth - 6, 30), 100);

    const handleSubmit = useCallback(async () => {
        const prompt = inputValue.trim();
        if (!prompt || isLoading) return;

        const userMessage: Message = { role: 'user', content: prompt };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);
        setStreamingContent('');
        abortRef.current = false;

        if (view === 'welcome') {
            setView('chat');
        }

        try {
            let fullResponse = '';
            for await (const chunk of streamChat(updatedMessages)) {
                if (abortRef.current) break;
                fullResponse += chunk;
                setStreamingContent(fullResponse);
            }

            if (!abortRef.current) {
                setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
        } finally {
            setStreamingContent(undefined);
            setIsLoading(false);
        }
    }, [inputValue, messages, isLoading, view]);

    const handleNewChat = useCallback(() => {
        abortRef.current = true;
        setMessages([]);
        setStreamingContent(undefined);
        setInputValue('');
        setIsLoading(false);
        setView('welcome');
    }, []);

    useKeyboard((key) => {
        if (key.ctrl && key.name === 'l') {
            handleNewChat();
        }
    });

    const welcomeHints = [
        { keys: 'Enter', action: 'Send' },
        { keys: 'Ctrl+C', action: 'Exit' }
    ];

    const chatHints = [
        { keys: 'Enter', action: 'Send' },
        { keys: 'Ctrl+L', action: 'New Chat' },
        { keys: 'Ctrl+C', action: 'Exit' }
    ];

    if (view === 'welcome') {
        return (
            <MainLayout
                header={<Logo showTagline={true} size='md' />}
                footer={
                    <box flexDirection='column' alignItems='center' gap={spacing.sm}>
                        <Divider length={50} variant='solid' />
                        <HelpBar hints={welcomeHints} />
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
            conversation={<ConversationPanel messages={messages} streamingContent={streamingContent} />}
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
            footer={<HelpBar hints={chatHints} />}
        />
    );
}
