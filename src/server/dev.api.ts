import 'dotenv/config';
import express from 'express';
import { configureAPI } from './routes/index';

const app = express();
app.use(express.json());
app.use('/api', configureAPI());

const PORT = Number(process.env['PORT'] || 3000);
app.listen(PORT, () => console.log(`Dev API listening on http://localhost:${PORT}`));
