import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { hello } from './api-routes/hello';
import { panstarrs } from './api-routes/panstarrs';
import { horizons } from './api-routes/horizons';
import { horizons2 } from './api-routes/horizons2';

// Validate and get environment variables
const DIST_PATH = process.env['DIST'];
const SERVER_PORT_ENV_STR = process.env['PORT']; // Renamed variable for clarity
let SERVER_PORT: number; // Declared to hold the final port value

if (!DIST_PATH) {
  console.error('Error: DIST environment variable is not set. Please define it in your .env file.');
  process.exit(1); // Exit if DIST is not set
}

// Updated PORT logic
if (SERVER_PORT_ENV_STR) {
  SERVER_PORT = parseInt(SERVER_PORT_ENV_STR, 10);
  if (isNaN(SERVER_PORT)) {
    // If PORT is provided in .env but is not a valid number, it's an error.
    console.error(`Error: Invalid PORT value "${SERVER_PORT_ENV_STR}" in .env file. PORT must be a number.`);
    process.exit(1);
  }
} else {
  // If PORT is not provided in .env, default to 4000.
  console.log('Info: PORT environment variable not set. Using default port 4000.');
  SERVER_PORT = 4000;
}

const app = express();
const angularAppPath = path.resolve(DIST_PATH);

// Middleware to log requests (optional, for debugging)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// --- API Routes ---
// Example: Simple JSON API endpoint
app.get('/api/greet', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

// Add more /api/* routes here as needed
// For example:
// app.get('/api/items', (req: Request, res: Response) => { /* logic to fetch items */ });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors()); // Allow preflight for all routes

// Example Express Rest API endpoints
app.get('/api/hello', hello);
app.get('/api/stars', panstarrs);
app.post('/api/horizons', cors(), horizons);
app.post('/api/horizons2', cors(), horizons2);
app.get('/api/panstarrs', cors(), panstarrs);

// Catch-all for API routes that are not found
app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

// --- Serve Angular Application ---
// Serve static files (CSS, JS, images, etc.) from the Angular app's build directory
app.use(express.static(angularAppPath));

// For all other GET requests that are not API calls and not static files,
// serve the Angular app's index.html.
// This is crucial for client-side routing in SPAs to work correctly.
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(angularAppPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html is not found, or another error occurs,
      // respond with a 404 or a more specific error.
      // This basic handler sends a 404 if the file isn't found.
      // You might want to check err.status for a more specific response.
      if (!res.headersSent) {
        // Check if headers are already sent to avoid errors
        res
          .status(404)
          .send(
            'Angular app index.html not found. Ensure the app is built and path is correct.'
          );
      }
      console.error(`Error sending file ${indexPath}:`, err);
    }
  });
});

// --- Error Handling ---
// Basic error handling middleware (optional, but good practice)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Something went wrong on the server!' });
  }
});

// --- Start Server ---
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on http://localhost:${SERVER_PORT}`);
  console.log(`Serving Angular app from: ${angularAppPath}`);
  console.log(`API endpoints available under /api/*`);
});
