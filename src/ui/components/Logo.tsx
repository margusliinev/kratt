import { colors, spacing } from '../theme';

interface LogoProps {
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Logo({ showTagline = true, size = 'md' }: LogoProps) {
    if (size === 'sm') {
        return (
            <box flexDirection='row' alignItems='center' gap={spacing.xs}>
                <text fg={colors.border.default}>{'['}</text>
                <text fg={colors.accent.primary}>KRATT</text>
                <text fg={colors.border.default}>{']'}</text>
            </box>
        );
    }

    return (
        <box flexDirection='column' alignItems='center' gap={spacing.md}>
            <ascii-font font='block' text='KRATT' color={colors.accent.primary} />

            {showTagline && (
                <box flexDirection='row' gap={spacing.sm}>
                    <text fg={colors.fg.primary}>CODE</text>
                    <text fg={colors.accent.primary}>{'·'}</text>
                    <text fg={colors.fg.primary}>CREATE</text>
                    <text fg={colors.accent.primary}>{'·'}</text>
                    <text fg={colors.fg.primary}>SHIP</text>
                </box>
            )}
        </box>
    );
}
