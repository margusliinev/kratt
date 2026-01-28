import z from 'zod';

const schema = z.object({
    PORT: z.coerce.number().min(1).max(65535),
    NODE_ENV: z.enum(['development', 'production']),
});

export const env = schema.parse(process.env);
