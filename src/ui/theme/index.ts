export { colors } from './colors';
export { spacing, gap, padding, margin, widths, heights } from './spacing';
export { fonts, textStyles } from './typography';
export { borderStyles, defaultBorderStyle } from './borders';

export type { Colors } from './colors';
export type { Spacing, Widths, Heights } from './spacing';
export type { Fonts, TextStyles } from './typography';
export type { BorderStyles } from './borders';

import { colors } from './colors';
import { spacing, gap, padding, margin, widths, heights } from './spacing';
import { fonts, textStyles } from './typography';
import { borderStyles, defaultBorderStyle } from './borders';

export const theme = {
    colors,
    spacing,
    gap,
    padding,
    margin,
    widths,
    heights,
    fonts,
    textStyles,
    borderStyles,
    defaultBorderStyle
} as const;

export type Theme = typeof theme;
