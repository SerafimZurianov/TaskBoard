import { prisma } from "../prisma";
import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest, requreAuth } from '../middleware/auth'
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { validateBody } from "../middleware/validate";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;

router.post('/register',validateBody(registerSchema), async (req, res) => {

    const { email, password} = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: 'A user with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, passwordHash },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
    
});

router.post('/login',validateBody(loginSchema), async (req, res) => {

    const { email, password} = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(409).json({ error: 'Invalid email or password' });
    }

    const isPassworValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPassworValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email } });
    
});

router.get('/me', requreAuth, async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.userId as string},
        select: {id: true, email: true}
    });

    if (!user) {
        res.status(404).json({ error: 'User not found'})
    }

    res.json(user);
});

export default router;