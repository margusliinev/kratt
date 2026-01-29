import type { Message } from '../../common/chat';
import { MessageBubble } from './MessageBubble';
import { colors, spacing } from '../theme';

type Dimension = number | 'auto' | `${number}%`;

interface ConversationPanelProps {
    messages: Message[];
    streamingContent?: string;
    width?: Dimension;
    height?: Dimension;
}

export function ConversationPanel({
    messages,
    streamingContent,
    width = '100%' as Dimension,
    height = '100%' as Dimension
}: ConversationPanelProps) {
    const hasMessages = messages.length > 0 || streamingContent;

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

            {messages.map((message, index) => (
                <MessageBubble key={index} role={message.role} content={message.content} />
            ))}

            {streamingContent !== undefined && <MessageBubble role='assistant' content={streamingContent} streaming={true} />}
        </scrollbox>
    );
}
