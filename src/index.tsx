import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { validate } from './common/validate';
import { Terminal } from './ui/terminal';
import { colors } from './ui/theme';
import { env } from './common/env';
import { z } from 'zod';

const server = Bun.serve({
    port: env.PORT,
    development: env.NODE_ENV === 'development',
    routes: {
        '/api/echo': {
            POST: async (req) => {
                const body = validate(z.object({ message: z.string() }), await req.json());
                return Response.json({ message: 'received: ' + body.message });
            }
        }
    }
});

const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 30,
    backgroundColor: colors.bg.primary
});

createRoot(renderer).render(<Terminal />);

console.log(`server running on ${server.url}`);
