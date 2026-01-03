import express from 'express';
import authRouter from './routes/auth.route.js';

const app = express();
app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});