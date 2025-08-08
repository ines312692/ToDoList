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

describe('GET /api/users', () => {
    it('should return list of users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });
});