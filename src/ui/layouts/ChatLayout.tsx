import type { ReactNode } from 'react';
import { colors, spacing } from '../theme';

interface ChatLayoutProps {
    header: ReactNode;
    conversation: ReactNode;
    input: ReactNode;
    footer: ReactNode;
}

export function ChatLayout({ header, conversation, input, footer }: ChatLayoutProps) {
    return (
        <box
            width='100%'
            height='100%'
            flexDirection='column'
            backgroundColor={colors.bg.primary}
            paddingLeft={spacing.md}
            paddingRight={spacing.md}
            paddingTop={spacing.sm}
            paddingBottom={spacing.sm}
        >
            <box width='100%' justifyContent='center' alignItems='center'>
                {header}
            </box>

            <box flexGrow={1} width='100%' paddingTop={spacing.xs} paddingBottom={spacing.xs}>
                {conversation}
            </box>

            <box width='100%' flexDirection='column' alignItems='center'>
                {input}
                <box paddingTop={spacing.sm} paddingBottom={spacing.xs}>
                    {footer}
                </box>
            </box>
        </box>
    );
}
