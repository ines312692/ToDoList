const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const DATA_PATH = path.join(__dirname, '..', 'data', 'db.json');

app.use(cors());
app.use(express.json());

// DB logic
const initDB = async () => {
    await fs.ensureFile(DATA_PATH);
    const data = await fs.readJson(DATA_PATH).catch(() => ({
        users: [
            { id: 'u1', name: 'Monsieur X', avatar: 'user.png' },
            { id: 'u2', name: 'Monsieur Y', avatar: 'user.png' },
            { id: 'u3', name: 'Monsieur Z', avatar: 'user.png' }
        ],
        tasks: []
    }));
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
};

const readDB = async () => await fs.readJson(DATA_PATH).catch(() => ({ users: [], tasks: [] }));
const writeDB = async (data) => await fs.writeJson(DATA_PATH, data, { spaces: 2 });

// Routes
app.get('/api/users', async (req, res) => {
    const db = await readDB();
    res.json(db.users);
});

app.get('/api/tasks', async (req, res) => {
    const db = await readDB();
    const { userId } = req.query;
    const tasks = userId ? db.tasks.filter(t => t.userId === userId) : db.tasks;
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const db = await readDB();
    const { title, summary, date, userId } = req.body;
    const newTask = {
        id: 't' + Date.now(),
        userId,
        title,
        summary,
        dueDate: date
    };
    db.tasks.push(newTask);
    await writeDB(db);
    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
    const db = await readDB();
    const taskId = req.params.id;
    const initialLength = db.tasks.length;
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    await writeDB(db);
    res.status(db.tasks.length < initialLength ? 204 : 404).send();
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Todo Backend API',
        version: '1.0.0'
    });
});

module.exports = { app, initDB };