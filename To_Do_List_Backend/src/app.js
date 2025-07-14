const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

const initDB = async () => {
    try {
        await fs.ensureFile(DATA_PATH);
        const data = await fs.readJson(DATA_PATH).catch(() => ({
            users: [
                { id: 'u1', name: 'Monsieur X', avatar: 'user.png' },
                { id: 'u2', name: 'Monsieur Y', avatar: 'user.png' },
                { id: 'u3', name: 'Monsieur Z', avatar: 'user.png' }
            ],
            tasks: [
                {
                    id: 't1',
                    userId: 'u1',
                    title: 'Master Angular',
                    summary: 'Learn all the basic and advanced features of Angular & how to apply them.',
                    dueDate: '2025-12-31'
                },
                {
                    id: 't2',
                    userId: 'u3',
                    title: 'Build first prototype',
                    summary: 'Build a first prototype of the online shop website',
                    dueDate: '2024-05-31'
                },
                {
                    id: 't3',
                    userId: 'u3',
                    title: 'Prepare issue template',
                    summary: 'Prepare and describe an issue template which will help with project management',
                    dueDate: '2024-06-15'
                }
            ]
        }));
        await fs.writeJson(DATA_PATH, data, { spaces: 2 });
        console.log('Base de données initialisée');
    } catch (error) {
        console.error(' Erreur lors de l\'initialisation de la DB:', error);
    }
};


const readDB = async () => {
    try {
        return await fs.readJson(DATA_PATH);
    } catch (error) {
        console.error('Erreur lecture DB:', error);
        return { users: [], tasks: [] };
    }
};

const writeDB = async (data) => {
    try {
        await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    } catch (error) {
        console.error('Erreur écriture DB:', error);
    }
};

app.get('/api/users', async (req, res) => {
    console.log('GET /api/users');
    const db = await readDB();
    res.json(db.users);
});

app.get('/api/tasks', async (req, res) => {
    console.log('GET /api/tasks');
    const db = await readDB();
    const { userId } = req.query;

    if (userId) {
        const userTasks = db.tasks.filter(task => task.userId === userId);
        console.log(`Found ${userTasks.length} tasks for user ${userId}`);
        res.json(userTasks);
    } else {
        res.json(db.tasks);
    }
});

app.post('/api/tasks', async (req, res) => {
    console.log('➕ POST /api/tasks');
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

    console.log('Task created:', newTask.id);
    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
    console.log('DELETE /api/tasks/' + req.params.id);
    const db = await readDB();
    const taskId = req.params.id;

    const initialLength = db.tasks.length;
    db.tasks = db.tasks.filter(task => task.id !== taskId);
    await writeDB(db);

    if (db.tasks.length < initialLength) {
        console.log('Task deleted:', taskId);
        res.status(204).send();
    } else {
        console.log('Task not found:', taskId);
        res.status(404).json({ error: 'Task not found' });
    }
});

// Health check
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
        version: '1.0.0',
        endpoints: [
            'GET /api/users',
            'GET /api/tasks',
            'POST /api/tasks',
            'DELETE /api/tasks/:id',
            'GET /health'
        ]
    });
});

app.use((err, req, res, next) => {
    console.error(' Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


const startServer = async () => {
    await initDB();
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
};

startServer();