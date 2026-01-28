export const spacing = {
    none: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 8,
    '3xl': 12
} as const;

export const gap = spacing;
export const padding = spacing;
export const margin = spacing;

export const widths = {
    input: 64,
    panelSm: 50,
    panelMd: 70,
    panelLg: 90,
    full: '100%'
} as const;

export const heights = {
    inputSingle: 1,
    inputBox: 3,
    panelSm: 10,
    panelMd: 20,
    panelLg: 30,
    full: '100%'
} as const;

export type Spacing = typeof spacing;
export type Widths = typeof widths;
export type Heights = typeof heights;
