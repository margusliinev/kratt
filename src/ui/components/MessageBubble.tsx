import { colors, spacing, syntaxStyle } from '../theme';
import { TextAttributes } from '@opentui/core';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    streaming?: boolean;
}

export function MessageBubble({ role, content, streaming = false }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <box width='100%' flexDirection='column' paddingBottom={spacing.sm}>
            <box flexDirection='row' gap={spacing.sm} paddingBottom={spacing.xs}>
                <text fg={isUser ? colors.fg.secondary : colors.accent.primary} attributes={TextAttributes.BOLD}>
                    {isUser ? 'You' : 'Kratt'}
                </text>
            </box>

            <box width='100%' paddingLeft={spacing.sm}>
                <markdown content={content + (streaming ? '▊' : '')} syntaxStyle={syntaxStyle} width='100%' />
            </box>
        </box>
    );
}
