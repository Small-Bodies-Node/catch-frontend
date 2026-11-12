import { createServer } from 'node:net';

export function assertPortAvailable(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (error: NodeJS.ErrnoException) =>
      reject(
        new Error(
          error.code === 'EADDRINUSE'
            ? `Port ${port} is in use. Stop the existing dev server before starting dev:images.`
            : `Cannot listen on port ${port}: ${error.message}`,
        ),
      ),
    );
    server.listen(port, () => server.close((error) => (error ? reject(error) : resolve())));
  });
}
