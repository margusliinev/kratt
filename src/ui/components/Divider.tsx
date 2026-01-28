import { TextAttributes } from '@opentui/core';
import { colors } from '../theme';

interface DividerProps {
    length?: number;
    variant?: 'solid' | 'dashed' | 'dotted' | 'rough';
    color?: string;
}

const dividerChars = {
    solid: '─',
    dashed: '╌',
    dotted: '·',
    rough: '░'
};

export function Divider({ length = 40, variant = 'solid', color = colors.border.muted }: DividerProps) {
    return (
        <text fg={color} attributes={TextAttributes.DIM}>
            {dividerChars[variant].repeat(length)}
        </text>
    );
}
