import 'dotenv/config';
import express from 'express';
import { configureAPI } from './routes/index';

const app = express();
app.use(express.json());
app.use('/api', configureAPI());

const PORT = 3000; // Fixed dev API port
app.listen(PORT, () => console.log(`Dev API listening on http://localhost:${PORT}`));
