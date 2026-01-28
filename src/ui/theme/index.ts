import { spacing, gap, padding, margin, widths, heights } from './spacing';
import { borderStyles, defaultBorderStyle } from './borders';
import { fonts, textStyles } from './typography';
import { colors } from './colors';

export type { Colors } from './colors';
export type { Spacing, Widths, Heights } from './spacing';
export type { Fonts, TextStyles } from './typography';
export type { BorderStyles } from './borders';

export { spacing, gap, padding, margin, widths, heights } from './spacing';
export { borderStyles, defaultBorderStyle } from './borders';
export { fonts, textStyles } from './typography';
export { colors } from './colors';

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
