import { borderStyles, defaultBorderStyle } from './borders';
import { colors } from './colors';
import { spacing, gap, padding, margin, widths, heights } from './spacing';
import { syntaxStyle } from './syntax';
import { fonts, textStyles } from './typography';

export type { Spacing, Widths, Heights } from './spacing';
export type { Fonts, TextStyles } from './typography';
export type { BorderStyles } from './borders';
export type { Colors } from './colors';

export { spacing, gap, padding, margin, widths, heights } from './spacing';
export { borderStyles, defaultBorderStyle } from './borders';
export { fonts, textStyles } from './typography';
export { syntaxStyle } from './syntax';
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
    defaultBorderStyle,
    syntaxStyle
} as const;

export type Theme = typeof theme;
