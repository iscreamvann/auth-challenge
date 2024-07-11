import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from './routers/user.js';
import movieRouter from './routers/movie.js';

app.use('/user', userRouter);
app.use('/movie', movieRouter);

app.get('*', (req, res) => {
    res.json({ ok: true });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
});

const port = process.env.VITE_PORT || 4000;
app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});
