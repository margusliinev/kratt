import { colors, spacing, widths, borderStyles } from '../theme';
import { TextAttributes } from '@opentui/core';

interface InputPromptProps {
    value?: string;
    placeholder?: string;
    focused?: boolean;
    onInput?: (value: string) => void;
    onSubmit?: () => void;
    width?: number;
    disabled?: boolean;
    loading?: boolean;
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
                placeholder={disabled ? '' : placeholder}
                width={width - 8}
                backgroundColor={colors.bg.secondary}
                focusedBackgroundColor={colors.bg.secondary}
                textColor={disabled ? colors.fg.muted : colors.fg.primary}
                cursorColor={colors.special.cursor}
                focused={focused && !disabled}
                onInput={onInput}
                onSubmit={onSubmit}
            />
        </box>
    );
}
