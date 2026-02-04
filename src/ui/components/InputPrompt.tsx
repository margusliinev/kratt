import { borderStyles, colors, spacing, widths } from '../theme';
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
    return Math.max(width - 4, 20);
}

export function InputPrompt({
    value: inputValue,
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
                value={inputValue}
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
