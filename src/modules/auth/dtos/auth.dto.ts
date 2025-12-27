import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(6),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3),
        email: z.email(),
        password: z.string().min(6),
    }),
});

export const logoutSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token requerido'),
    }),
});
    