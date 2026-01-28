import { TextAttributes } from '@opentui/core';

export const fonts = {
    logo: 'block' as const,
    logoAlt: 'huge' as const,
    compact: 'tiny' as const
} as const;

export const textStyles = {
    normal: 0,
    bold: TextAttributes.BOLD,
    dim: TextAttributes.DIM,
    italic: TextAttributes.ITALIC,
    underline: TextAttributes.UNDERLINE,
    emphasis: TextAttributes.BOLD | TextAttributes.UNDERLINE,
    hint: TextAttributes.DIM | TextAttributes.ITALIC
} as const;

export type Fonts = typeof fonts;
export type TextStyles = typeof textStyles;
