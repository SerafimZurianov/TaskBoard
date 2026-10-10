import { prisma } from "../prisma";
import { Router, Response } from "express";
import { AuthRequest, requreAuth } from '../middleware/auth'
import { createTaskSchema } from "../schemas/task.schema";
import { validateBody } from "../middleware/validate";

const router = Router();

router.use(requreAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
    const  tasks = await prisma.task.findMany({
        where: { userId: req.userId as string },
    });
    res.json(tasks);
});

router.post('/',validateBody(createTaskSchema), async (req: AuthRequest, res: Response) => {

    const { taskName, taskInfo, taskDeadline } = req.body;

    const task = await prisma.task.create({
        data: {
            taskName,
            taskInfo,
            taskDeadline,
            userId: req.userId as string
        },
    });

    res.status(201).json(task)
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const task = await prisma.task.findUnique({ where: {id}});

    if (!task || task.userId !== req.userId) {
        res.status(404).json({ error: 'Task not fount'});
    }

    await prisma.task.delete({ where: {id} });
    res.status(204).send();
});

router.patch('/:id/freeze', async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const task = await prisma.task.findUnique({ where: {id}});

    if (!task || task.userId !== req.userId) {
        return res.status(404).json({ error: 'Task not fount'});
    }

    let updatetTask;

    if (task.isFrozen) {
        const frothenDuration = Date.now() - task.frozenAt!.getTime();
        const newDatetime = new Date(task.taskDeadline.getTime() + frothenDuration); 

        updatetTask = await prisma.task.update({
            where: {id},
            data: { isFrozen: false, frozenAt: null, taskDeadline: newDatetime}
        });
    } else {
        updatetTask = await prisma.task.update({
            where: {id},
            data: { isFrozen: true, frozenAt: new Date() }
        });
    }

    

    res.json(updatetTask);
});

export default router;