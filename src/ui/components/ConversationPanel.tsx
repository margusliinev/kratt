import type { Dimension, Message, ToolUseEvent } from '../../core';
import { colors, spacing } from '../theme';
import { MessageBubble } from './MessageBubble';
import { ToolBubble } from './ToolBubble';

type ConversationPanelProps = {
    messages: Message[];
    streamingContent?: string;
    toolEvents?: ToolUseEvent[];
    width?: Dimension;
    height?: Dimension;
};

export function ConversationPanel({
    messages,
    streamingContent,
    toolEvents = [],
    width = '100%',
    height = '100%'
}: ConversationPanelProps) {
    const hasMessages = messages.length > 0 || streamingContent || toolEvents.length > 0;
    const messagesToRender = messages.filter((m) => m.status !== 'streaming');

    const lastAssistantIndex = messagesToRender.findLastIndex((m) => m.role === 'assistant');
    const hasToolEvents = toolEvents.length > 0;

    const messagesBeforeLastAssistant =
        hasToolEvents && lastAssistantIndex >= 0 ? messagesToRender.slice(0, lastAssistantIndex) : messagesToRender;

    const lastAssistantMessage = hasToolEvents && lastAssistantIndex >= 0 ? messagesToRender[lastAssistantIndex] : null;

    return (
        <scrollbox
            width={width}
            height={height}
            stickyScroll={true}
            stickyStart='bottom'
            scrollY={true}
            viewportCulling={true}
            rootOptions={{ backgroundColor: colors.bg.primary }}
            viewportOptions={{ backgroundColor: colors.bg.primary }}
            contentOptions={{
                flexDirection: 'column',
                paddingLeft: spacing.md,
                paddingRight: spacing.md,
                paddingTop: spacing.sm,
                paddingBottom: spacing.sm
            }}
        >
            {!hasMessages && (
                <box width='100%' height='100%' justifyContent='center' alignItems='center'>
                    <text fg={colors.fg.muted}>Start a conversation...</text>
                </box>
            )}

            {messagesBeforeLastAssistant.map((message) => (
                <MessageBubble key={message.id} role={message.role} content={message.content} />
            ))}

            {toolEvents.map((event) => (
                <ToolBubble key={event.toolUseId} event={event} />
            ))}

            {lastAssistantMessage && (
                <MessageBubble key={lastAssistantMessage.id} role={lastAssistantMessage.role} content={lastAssistantMessage.content} />
            )}

            {streamingContent !== undefined && <MessageBubble role='assistant' content={streamingContent} streaming={true} />}
        </scrollbox>
    );
}
