import { z } from 'zod';

export const createTaskSchema = z.object({
    taskName: z.string().min(1, 'Enter the name').max(30, 'The name is too long.'),
    taskInfo: z.string().min(1, 'Enter the info').max(300, 'The info is too long.'),
    taskDeadline: z.coerce.date().refine(
        (date) => date.getTime() > Date.now(),
        'The deadline should be in the future'
    )
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;