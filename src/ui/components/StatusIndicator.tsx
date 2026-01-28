import { TextAttributes } from '@opentui/core';
import { useEffect, useState } from 'react';
import { colors, spacing } from '../theme';

type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'warning' | 'info';

interface StatusIndicatorProps {
    status: StatusType;
    message?: string;
    showIndicator?: boolean;
}

const SPINNER_FRAMES = ['◐', '◓', '◑', '◒'];

const statusConfig: Record<StatusType, { icon: string; color: string; label: string }> = {
    idle: { icon: '◇', color: colors.fg.muted, label: 'Ready' },
    loading: { icon: '◐', color: colors.accent.primary, label: 'Thinking' },
    success: { icon: '◆', color: colors.semantic.success, label: 'Done' },
    error: { icon: '✕', color: colors.semantic.error, label: 'Error' },
    warning: { icon: '◈', color: colors.semantic.warning, label: 'Warning' },
    info: { icon: '○', color: colors.semantic.info, label: 'Info' }
};

export function StatusIndicator({ status, message, showIndicator = true }: StatusIndicatorProps) {
    const [spinnerFrame, setSpinnerFrame] = useState(0);
    const config = statusConfig[status];
    const displayMessage = message || config.label;

    useEffect(() => {
        if (status !== 'loading') return;

        const interval = setInterval(() => {
            setSpinnerFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
        }, 120);

        return () => clearInterval(interval);
    }, [status]);

    const icon = status === 'loading' ? SPINNER_FRAMES[spinnerFrame] : config.icon;

    return (
        <box flexDirection='row' alignItems='center' gap={spacing.xs}>
            {showIndicator && (
                <text fg={config.color} attributes={status === 'idle' ? TextAttributes.DIM : 0}>
                    {icon}
                </text>
            )}
            <text fg={status === 'idle' ? colors.fg.muted : config.color} attributes={status === 'idle' ? TextAttributes.DIM : 0}>
                {displayMessage}
            </text>
        </box>
    );
}
