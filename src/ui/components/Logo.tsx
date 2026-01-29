import { colors, spacing } from '../theme';

interface LogoProps {
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Logo({ showTagline = true, size = 'md' }: LogoProps) {
    const font = size === 'sm' ? 'tiny' : 'block';

    return (
        <box flexDirection='column' alignItems='center' gap={size === 'sm' ? spacing.none : spacing.md}>
            <ascii-font font={font} text='KRATT' color={colors.accent.primary} />

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
