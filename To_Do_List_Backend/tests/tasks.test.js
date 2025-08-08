const request = require('supertest');
const { app, initDB } = require('../src/app');

let server;

beforeAll(async () => {
    await initDB();
    server = app.listen(0); // Use port 0 to let the OS assign a random port
});

afterAll(async () => {
    await new Promise(resolve => server.close(resolve)); // Properly close the server
});

describe('Tasks API', () => {
    let taskId;

    it('should fetch all tasks', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new task', async () => {
        const res = await request(app).post('/api/tasks').send({
            title: 'Test Task',
            summary: 'This is a test',
            userId: 'u1',
            date: '2025-01-01'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        taskId = res.body.id;
    });

    it('should delete the task', async () => {
        // Ensure taskId is defined before running delete test
        if (!taskId) {
            const res = await request(app).post('/api/tasks').send({
                title: 'Test Task',
                summary: 'This is a test',
                userId: 'u1',
                date: '2025-01-01'
            });
            taskId = res.body.id;
        }

        const res = await request(app).delete(`/api/tasks/${taskId}`);
        expect(res.statusCode).toBe(204);
    });
});