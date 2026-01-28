import type { EchoResponse } from '../common/types';
import { TextAttributes } from '@opentui/core';
import { useCallback, useState } from 'react';
import { api } from '../common/client';

export function Terminal() {
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(() => {
        if (!inputValue.trim()) return;

        setIsLoading(true);
        setResponse('');

        api.post<EchoResponse>('/api/echo', { message: inputValue })
            .then((data) => setResponse(data.message))
            .catch((error) => setResponse(`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`))
            .finally(() => setIsLoading(false));
    }, [inputValue]);

    return (
        <box flexDirection='column' alignItems='center' justifyContent='center' flexGrow={1} gap={2}>
            <box justifyContent='center' alignItems='flex-end'>
                <ascii-font font='tiny' text='Kratt' />
                <text attributes={TextAttributes.DIM}>AI Coding Agent</text>
            </box>

            <box flexDirection='column' gap={1} padding={1} borderStyle='rounded' width={60}>
                <text fg='#888888'>Type a message and press Enter:</text>
                <input
                    placeholder='Enter your message...'
                    width={56}
                    backgroundColor='#1a1a1a'
                    focusedBackgroundColor='#2a2a2a'
                    textColor='#ffffff'
                    cursorColor='#00ff00'
                    focused={true}
                    onInput={setInputValue}
                    onSubmit={handleSubmit}
                />
            </box>

            {(isLoading || response) && (
                <box padding={1} borderStyle='rounded' width={60} title='Response'>
                    <text fg={response.startsWith('Error') ? '#ff6666' : '#66ff66'}>{isLoading ? 'Sending...' : response}</text>
                </box>
            )}
        </box>
    );
}
