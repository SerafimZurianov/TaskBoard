import { it, describe, expect, beforeEach } from "vitest";
import request from 'supertest';
import app from '../app';
import { prisma } from '../prisma';

describe ('GET /tasks', () => {
    beforeEach(async () => {
        prisma.task.deleteMany();
        prisma.user.deleteMany();
    });

    it ('отклоняет запрос без токена', async () => {
        const response = await request(app).get('/tasks');

        expect(response.status).toBe(401);
    });

    it ('возвращает только задачи текущего пользователя', async () => {
        const register  = await request(app)
            .post('/auth/register')
            .send({ email: 'test@test.com', password: '123456' });
        const token = register.body.token;

        await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ taskName: 'Имя', taskInfo: 'Описание', taskDeadline: '2027-01-01T12:00:00.000Z'});

        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].taskName).toBe('Имя');
    });
});