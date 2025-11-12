import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { configureAPI } from './index';

const app = express();
app.use(express.json());
app.use('/api', configureAPI());

const PORT = 3000; // Fixed dev API port
const server = createServer(app);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Dev API port ${PORT} is already in use. Stop the conflicting process or update PORT.`);
  } else {
    console.error('Dev API failed to start:', error);
  }
  process.exit(1);
});

server.listen(PORT, () => console.log(`Dev API listening on http://localhost:${PORT}`));
