import { colors, spacing, widths, borderStyles } from '../theme';
import { TextAttributes } from '@opentui/core';

type MessageType = 'assistant' | 'user' | 'system' | 'error';

interface ResponsePanelProps {
    content: string;
    type?: MessageType;
    width?: number;
    showLabel?: boolean;
}

const messageConfig: Record<MessageType, { label: string; labelColor: string; borderColor: string; contentColor: string }> = {
    assistant: {
        label: 'KRATT',
        labelColor: colors.accent.primary,
        borderColor: colors.border.default,
        contentColor: colors.fg.primary
    },
    user: {
        label: 'YOU',
        labelColor: colors.fg.secondary,
        borderColor: colors.border.muted,
        contentColor: colors.fg.secondary
    },
    system: {
        label: 'SYS',
        labelColor: colors.fg.muted,
        borderColor: colors.border.muted,
        contentColor: colors.fg.muted
    },
    error: {
        label: 'ERR',
        labelColor: colors.semantic.error,
        borderColor: colors.semantic.errorMuted,
        contentColor: colors.semantic.error
    }
};

export function ResponsePanel({ content, type = 'assistant', width = widths.input, showLabel = true }: ResponsePanelProps) {
    const config = messageConfig[type];

    return (
        <box
            width={width}
            borderStyle={borderStyles.single}
            borderColor={config.borderColor}
            backgroundColor={colors.bg.secondary}
            flexDirection='column'
            paddingLeft={spacing.sm}
            paddingRight={spacing.sm}
            paddingTop={spacing.xs}
            paddingBottom={spacing.xs}
            gap={spacing.xs}
        >
            {showLabel && (
                <text fg={config.labelColor} attributes={TextAttributes.BOLD}>
                    {config.label}
                </text>
            )}
            <text fg={config.contentColor}>{content}</text>
        </box>
    );
}
