import type { EchoResponse } from '../common/types';
import { Logo, InputPrompt, StatusIndicator, HelpBar, ResponsePanel, Divider } from './components';
import { colors, spacing, widths } from './theme';
import { useCallback, useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { MainLayout } from './layouts';
import { api } from '../common/client';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export function Terminal() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState('');
    const [state, setState] = useState<AppState>('idle');

    const handleSubmit = useCallback(() => {
        if (!inputValue.trim() || state === 'loading') return;

        setState('loading');
        setResponse('');

        api.post<EchoResponse>('/api/echo', { message: inputValue })
            .then((data) => {
                setResponse(data.message);
                setState('success');
            })
            .catch((error) => {
                setResponse(error instanceof Error ? error.message : 'Connection failed');
                setState('error');
            });
    }, [inputValue, state]);

    useKeyboard((key) => {
        if (key.name === 'escape' && response) {
            setResponse('');
            setInputValue('');
            setState('idle');
        }
    });

    const helpHints = [
        { keys: 'Enter', action: 'Send' },
        { keys: 'Esc', action: 'Clear' },
        { keys: 'Ctrl+C', action: 'Exit' }
    ];

    return (
        <MainLayout
            header={<Logo showTagline={true} size='md' />}
            footer={
                <box flexDirection='column' alignItems='center' gap={spacing.sm}>
                    <Divider length={50} variant='solid' />
                    <HelpBar hints={helpHints} />
                </box>
            }
        >
            <box flexDirection='column' alignItems='center' gap={spacing.lg} width={widths.input}>
                {state === 'idle' && !response && <text fg={colors.fg.secondary}>What do you want to build?</text>}

                {(state === 'loading' || response) && (
                    <ResponsePanel
                        content={state === 'loading' ? 'Thinking...' : response}
                        type={state === 'error' ? 'error' : 'assistant'}
                        width={widths.input}
                    />
                )}

                <InputPrompt
                    value={inputValue}
                    placeholder='Ask anything...'
                    focused={true}
                    loading={state === 'loading'}
                    disabled={state === 'loading'}
                    onInput={setInputValue}
                    onSubmit={handleSubmit}
                    width={widths.input}
                />

                <StatusIndicator status={state} />
            </box>
        </MainLayout>
    );
}
