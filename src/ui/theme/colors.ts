export const colors = {
    bg: {
        primary: '#0a0c10',
        secondary: '#10131a',
        tertiary: '#161a24',
        interactive: '#0d1018',
        interactiveFocused: '#181d28',
        overlay: '#080a0e'
    },

    fg: {
        primary: '#e4e8f0',
        secondary: '#a8b0c0',
        muted: '#606878',
        inverse: '#0a0c10'
    },

    accent: {
        primary: '#38bdf8',
        primaryHover: '#5ccbfa',
        primaryMuted: '#1a6a8f',
        secondary: '#f87171',
        secondaryHover: '#fa9090',
        secondaryMuted: '#8f3a3a'
    },

    border: {
        default: '#2a3040',
        focused: '#404860',
        accent: '#38bdf8',
        muted: '#1a2030'
    },

    semantic: {
        success: '#4ade80',
        successMuted: '#2a7a48',
        error: '#f87171',
        errorMuted: '#8f3a3a',
        warning: '#fbbf24',
        warningMuted: '#8f6a14',
        info: '#38bdf8',
        infoMuted: '#1a6a8f'
    },

    special: {
        cursor: '#38bdf8',
        selection: '#1a3a50',
        codeBlock: '#0d1018',
        shimmer: '#404860'
    }
} as const;

export type Colors = typeof colors;
