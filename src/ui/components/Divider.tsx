import { TextAttributes } from '@opentui/core';
import { colors } from '../theme';

type DividerProps = {
    length?: number;
    variant?: 'solid' | 'dashed' | 'dotted' | 'rough';
    color?: string;
};

const DIVIDER_CHARS = {
    solid: '─',
    dashed: '╌',
    dotted: '·',
    rough: '░'
};

export function Divider({ length = 40, variant = 'solid', color = colors.border.muted }: DividerProps) {
    return (
        <text fg={color} attributes={TextAttributes.DIM}>
            {DIVIDER_CHARS[variant].repeat(length)}
        </text>
    );
}
