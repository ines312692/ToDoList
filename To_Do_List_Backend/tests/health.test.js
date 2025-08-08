const request = require('supertest');
const { app, initDB } = require('../src/app');

let server;

beforeAll(async () => {
    await initDB();
    server = app.listen(0);
});

afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
});

describe('GET /health', () => {
    it('should return health info', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
    });
});