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

describe('GET /health', () => {
    it('should return health info', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});