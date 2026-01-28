import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { validate } from './common/validate';
import { Terminal } from './ui/terminal';
import { env } from './common/env';
import { z } from 'zod';

const server = Bun.serve({
    port: env.PORT,
    development: env.NODE_ENV === 'development',
    routes: {
        '/api/echo': {
            POST: async (req) => {
                const body = validate(z.object({ message: z.string() }), await req.json());
                const message = body.message;

                return Response.json({
                    message: 'Server received: ' + message
                });
            }
        }
    }
});

const renderer = await createCliRenderer({ exitOnCtrlC: true });
createRoot(renderer).render(<Terminal />);

console.log(`Server is listening on ${server.url}`);
