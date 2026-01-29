import type { ReactNode } from 'react';
import type { Dimension } from '../../common/types';
import { colors, borderStyles, spacing, widths } from '../theme';

type PanelProps = {
    children: ReactNode;
    title?: string;
    width?: keyof typeof widths | Dimension;
    height?: Dimension;
    variant?: 'default' | 'accent' | 'subtle' | 'none';
    padded?: boolean | 'sm' | 'md' | 'lg';
    direction?: 'row' | 'column';
    gap?: number;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
};

const VARIANT_STYLES = {
    default: {
        borderColor: colors.border.default,
        backgroundColor: colors.bg.tertiary
    },
    accent: {
        borderColor: colors.accent.primary,
        backgroundColor: colors.bg.tertiary
    },
    subtle: {
        borderColor: colors.border.muted,
        backgroundColor: colors.bg.secondary
    },
    none: {
        borderColor: undefined,
        backgroundColor: 'transparent'
    }
};

function resolvePadding(padded: boolean | 'sm' | 'md' | 'lg'): number {
    if (padded === true || padded === 'md') return spacing.md;
    if (padded === 'sm') return spacing.sm;
    if (padded === 'lg') return spacing.lg;
    return 0;
}

export function Panel({
    children,
    title,
    width = widths.panelMd,
    height,
    variant = 'default',
    padded = true,
    direction = 'column',
    gap: gapSize = spacing.sm,
    align = 'stretch',
    justify = 'flex-start'
}: PanelProps) {
    const styles = VARIANT_STYLES[variant];
    const resolvedWidth: Dimension | undefined =
        typeof width === 'string' && width in widths
            ? (widths[width as keyof typeof widths] as Dimension)
            : (width as Dimension | undefined);

    return (
        <box
            width={resolvedWidth}
            height={height}
            borderStyle={variant !== 'none' ? borderStyles.single : undefined}
            borderColor={styles.borderColor}
            backgroundColor={styles.backgroundColor}
            title={title}
            padding={resolvePadding(padded)}
            flexDirection={direction}
            gap={gapSize}
            alignItems={align}
            justifyContent={justify}
        >
            {children}
        </box>
    );
}
