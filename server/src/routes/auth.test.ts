import { it, describe, expect, beforeEach } from "vitest";
import request from 'supertest';
import app from '../app';
import { prisma } from '../prisma';

describe ('POST /auth/register',  () => {
    beforeEach(async () => {
        await prisma.task.deleteMany();
        await prisma.user.deleteMany();
    });

    it ('регистрирует нового пользователя и возвращает токен', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ email: 'test@test.com', password: '123456' });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe('test@test.com');
    });

    it ('отклоняет повторную регистрацию с тем же email', async () => {
        await request(app)
            .post('/auth/register')
            .send({ email: 'test@test.com', password: '123456' });

        const response = await request(app)
            .post('/auth/register')
            .send({ email: 'test@test.com', password: '111111' });

        expect(response.status).toBe(409);
    });

    it ('отклоняет слишком короткий пароль', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ email: 'test@test.com', password: '1234' });

        expect(response.status).toBe(400);
    });
});