import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { initDatabase } from './core';
import { Terminal } from './ui/terminal';
import { colors } from './ui/theme';

initDatabase();

const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 30,
    backgroundColor: colors.bg.primary
});

createRoot(renderer).render(<Terminal />);
