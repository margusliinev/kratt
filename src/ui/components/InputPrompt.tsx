import { colors, spacing, widths, borderStyles } from '../theme';
import { TextAttributes } from '@opentui/core';

type InputPromptProps = {
    value: string;
    placeholder?: string;
    focused?: boolean;
    onInput?: (value: string) => void;
    onSubmit?: () => void;
    width?: number;
    disabled?: boolean;
    loading?: boolean;
};

function computeInnerWidth(width: number): number {
    if (width < 60) return width;
    if (width < 80) return width + 5;
    if (width < 100) return width + 10;
    return width + 15;
}

export function InputPrompt({
    value,
    placeholder = 'Ask anything...',
    focused = true,
    onInput,
    onSubmit,
    width = widths.input,
    disabled = false,
    loading = false
}: InputPromptProps) {
    const promptColor = loading ? colors.fg.muted : focused ? colors.accent.primary : colors.fg.muted;
    const innerWidth = computeInnerWidth(width);

    return (
        <box
            width={width}
            borderStyle={borderStyles.single}
            borderColor={focused ? colors.border.focused : colors.border.muted}
            backgroundColor={colors.bg.secondary}
            flexDirection='row'
            alignItems='center'
            paddingLeft={spacing.sm}
            paddingRight={spacing.sm}
            gap={spacing.sm}
        >
            <text fg={promptColor} attributes={TextAttributes.BOLD}>
                {'>'}
            </text>

            <input
                value={value}
                width={innerWidth}
                placeholder={disabled ? '' : placeholder}
                backgroundColor={colors.bg.secondary}
                focusedBackgroundColor={colors.bg.secondary}
                textColor={colors.fg.primary}
                cursorColor={colors.special.cursor}
                focused={focused && !disabled}
                onInput={onInput}
                onSubmit={onSubmit}
            />
        </box>
    );
}
