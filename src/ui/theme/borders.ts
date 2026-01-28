export const borderStyles = {
    none: undefined,
    single: 'single' as const,
    rounded: 'rounded' as const,
    double: 'double' as const,
    heavy: 'heavy' as const
} as const;

export const defaultBorderStyle = borderStyles.single;

export type BorderStyles = typeof borderStyles;
