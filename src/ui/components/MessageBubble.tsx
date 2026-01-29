import type { MessageRole } from '../../core';
import { colors, spacing, syntaxStyle } from '../theme';
import { TextAttributes } from '@opentui/core';

type MessageBubbleProps = {
    role: MessageRole;
    content: string;
    streaming?: boolean;
};

export function MessageBubble({ role, content, streaming = false }: MessageBubbleProps) {
    const label = role === 'user' ? 'You' : role === 'assistant' ? 'Kratt' : 'System';
    const labelColor = role === 'user' ? colors.fg.secondary : role === 'assistant' ? colors.accent.primary : colors.fg.muted;

    return (
        <box width='100%' flexDirection='column' paddingBottom={spacing.sm}>
            <box flexDirection='row' gap={spacing.sm} paddingBottom={spacing.xs}>
                <text fg={labelColor} attributes={TextAttributes.BOLD}>
                    {label}
                </text>
            </box>

            <box width='100%' paddingLeft={spacing.sm}>
                <markdown content={content + (streaming ? '▊' : '')} syntaxStyle={syntaxStyle} width='100%' />
            </box>
        </box>
    );
}
