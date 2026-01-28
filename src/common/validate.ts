import { z } from 'zod';

export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const error = result.error.message;
        throw new Error(error);
    }

    return result.data;
};
