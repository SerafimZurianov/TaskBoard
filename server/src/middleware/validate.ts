import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody (schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parseResult = schema.safeParse(req.body);
        
            if (!parseResult.success) {
                return res.status(400).json({ error: parseResult.error.issues[0]?.message });
            }
        
            req.body = parseResult.data;

            next();
    }
}