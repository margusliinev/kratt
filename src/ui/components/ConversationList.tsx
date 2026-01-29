import type { ConversationSummary } from '../../core';
import { TextAttributes } from '@opentui/core';
import { colors, spacing } from '../theme';
import { useKeyboard } from '@opentui/react';

type ConversationListProps = {
    conversations: ConversationSummary[];
    selectedIndex: number;
    onSelectIndex: (index: number) => void;
    onOpen: (id: string) => void;
    width?: number;
};

function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
}

function ConversationItem({
    conversation,
    isSelected,
    width = 40
}: {
    conversation: ConversationSummary;
    isSelected: boolean;
    width?: number;
}) {
    const titleMaxLen = width - 10;
    const displayTitle =
        conversation.title.length > titleMaxLen ? conversation.title.slice(0, titleMaxLen - 3) + '...' : conversation.title;

    return (
        <box
            width={width}
            flexDirection='row'
            justifyContent='space-between'
            paddingLeft={spacing.sm}
            paddingRight={spacing.sm}
            paddingTop={spacing.xs}
            paddingBottom={spacing.xs}
            backgroundColor={isSelected ? colors.bg.interactiveFocused : colors.bg.secondary}
        >
            <text fg={isSelected ? colors.accent.primary : colors.fg.primary} attributes={isSelected ? TextAttributes.BOLD : 0}>
                {isSelected ? '> ' : '  '}
                {displayTitle}
            </text>
            <text fg={colors.fg.muted}>{formatTime(conversation.updatedAt)}</text>
        </box>
    );
}

export function ConversationList({ conversations, selectedIndex, onSelectIndex, onOpen, width = 40 }: ConversationListProps) {
    useKeyboard((key) => {
        if (conversations.length === 0) return;

        if (key.name === 'up' || key.name === 'k') {
            onSelectIndex(Math.max(0, selectedIndex - 1));
        }
        if (key.name === 'down' || key.name === 'j') {
            onSelectIndex(Math.min(conversations.length - 1, selectedIndex + 1));
        }
        if (key.name === 'return') {
            const conv = conversations[selectedIndex];
            if (conv) {
                onOpen(conv.id);
            }
        }
    });

    if (conversations.length === 0) {
        return (
            <box width={width} paddingTop={spacing.md} justifyContent='center' alignItems='center'>
                <text fg={colors.fg.muted}>No conversations yet</text>
            </box>
        );
    }

    return (
        <box width={width} flexDirection='column'>
            {conversations.map((conv, index) => (
                <ConversationItem key={conv.id} conversation={conv} isSelected={index === selectedIndex} width={width} />
            ))}
        </box>
    );
}
