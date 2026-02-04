import type { ToolUseEvent } from '../../core';
import { TextAttributes } from '@opentui/core';
import { colors, spacing } from '../theme';

type ToolBubbleProps = {
    event: ToolUseEvent;
};

function getToolIcon(toolName: string): string {
    switch (toolName) {
        case 'list_directory':
            return '📁';
        case 'read_file':
            return '📖';
        case 'edit_file':
            return '✏️';
        default:
            return '🔧';
    }
}

function getToolDisplayName(toolName: string): string {
    switch (toolName) {
        case 'list_directory':
            return 'List Directory';
        case 'read_file':
            return 'Read File';
        case 'edit_file':
            return 'Edit File';
        default:
            return toolName;
    }
}

function formatInput(input: unknown): string {
    if (typeof input !== 'object' || input === null) {
        return String(input);
    }

    const inputObj = input as Record<string, unknown>;

    if ('path' in inputObj) {
        return String(inputObj.path);
    }

    return JSON.stringify(input, null, 2);
}

export function ToolBubble({ event }: ToolBubbleProps) {
    const icon = getToolIcon(event.toolName);
    const displayName = getToolDisplayName(event.toolName);
    const inputSummary = formatInput(event.input);

    const statusColor =
        event.status === 'running'
            ? colors.semantic.warning
            : event.status === 'completed'
              ? event.result?.success
                  ? colors.semantic.success
                  : colors.semantic.error
              : colors.semantic.error;

    const statusText =
        event.status === 'running'
            ? 'Running...'
            : event.status === 'completed'
              ? event.result?.success
                  ? 'Completed'
                  : 'Failed'
              : 'Error';

    return (
        <box width='100%' flexDirection='column' paddingBottom={spacing.sm} paddingTop={spacing.xs}>
            <box flexDirection='row' gap={spacing.sm} paddingBottom={spacing.xs} alignItems='center'>
                <text fg={colors.accent.secondary}>{icon}</text>
                <text fg={colors.accent.secondary} attributes={TextAttributes.BOLD}>
                    {displayName}
                </text>
                <text fg={colors.fg.muted}>{inputSummary.length > 40 ? inputSummary.slice(0, 40) + '...' : inputSummary}</text>
                <text fg={statusColor} attributes={TextAttributes.ITALIC}>
                    [{statusText}]
                </text>
            </box>

            {event.status === 'completed' && event.result && (
                <box width='100%' paddingLeft={spacing.md} flexDirection='column'>
                    {event.result.success ? (
                        <box
                            width='100%'
                            borderStyle='rounded'
                            borderColor={colors.border.muted}
                            paddingLeft={spacing.sm}
                            paddingRight={spacing.sm}
                            paddingTop={spacing.xs}
                            paddingBottom={spacing.xs}
                        >
                            <text fg={colors.fg.secondary}>
                                {event.result.output.length > 500
                                    ? event.result.output.slice(0, 500) + '\n... (truncated)'
                                    : event.result.output}
                            </text>
                        </box>
                    ) : (
                        <box width='100%' paddingLeft={spacing.sm}>
                            <text fg={colors.semantic.error}>Error: {event.result.error}</text>
                        </box>
                    )}
                </box>
            )}

            {event.status === 'running' && (
                <box paddingLeft={spacing.md}>
                    <text fg={colors.fg.muted} attributes={TextAttributes.ITALIC}>
                        Executing tool...
                    </text>
                </box>
            )}
        </box>
    );
}
