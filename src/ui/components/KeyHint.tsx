import { colors, spacing } from '../theme';

type KeyHintProps = {
    keys: string;
    action: string;
};

export function KeyHint({ keys, action }: KeyHintProps) {
    return (
        <box flexDirection='row' alignItems='center' gap={spacing.none}>
            <text fg={colors.accent.primary}>{keys}</text>
            <text fg={colors.fg.secondary}> {action}</text>
        </box>
    );
}

type HelpBarProps = {
    hints: Array<{ keys: string; action: string }>;
};

export function HelpBar({ hints }: HelpBarProps) {
    return (
        <box flexDirection='row' gap={spacing.xl} justifyContent='center'>
            {hints.map((hint, index) => (
                <KeyHint key={index} keys={hint.keys} action={hint.action} />
            ))}
        </box>
    );
}
