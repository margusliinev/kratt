import type { ReactNode } from 'react';
import { colors, spacing } from '../theme';

interface MainLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
}

export function MainLayout({ children, header, footer }: MainLayoutProps) {
    return (
        <box width='100%' height='100%' flexDirection='column' backgroundColor={colors.bg.primary}>
            {header && (
                <box width='100%' paddingTop={spacing.lg} paddingBottom={spacing.md} justifyContent='center' alignItems='center'>
                    {header}
                </box>
            )}

            <box flexGrow={1} flexDirection='column' justifyContent='center' alignItems='center' padding={spacing.md}>
                {children}
            </box>

            {footer && (
                <box width='100%' paddingTop={spacing.sm} paddingBottom={spacing.md} justifyContent='center' alignItems='center'>
                    {footer}
                </box>
            )}
        </box>
    );
}
