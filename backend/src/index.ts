import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import feedRouter from './routes/feed.route.js';
import likeRouter from './routes/like.route.js';

const app = express();
app.use(
  cors({
    origin: [
      "https://social.shubhamsharma.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/feed', feedRouter);
app.use('/api/like', likeRouter)


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});