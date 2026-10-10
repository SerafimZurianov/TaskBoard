import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Wrong email'),
    password: z.string().min(6, 'The password must be at least 6 characters long')
});

export const loginSchema = z.object({
    email: z.string().email('Wrong email'),
    password: z.string().min(1, 'Wrong password')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;