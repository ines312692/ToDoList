const { app, initDB } = require('./app');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await initDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
};

startServer();