import { ChildProcess, spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { assertPortAvailable } from './assertPortAvailable';
import { waitForLocalServer } from './waitForLocalServer';

/** Start the local renderer and existing GUI, and own their processes/cache until exit. */
async function startLocalImages(): Promise<void> {
  const gui = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const survey = resolve(
    process.env['CATCH_SURVEY_IMAGE_SERVICE_DIR'] ??
      join(gui, '../sbn-survey-image-service-NON-aws'),
  );
  const rendererPort = 5010;
  await access(join(survey, '_develop_previews'));
  await Promise.all([4000, 3000, rendererPort].map(assertPortAvailable));
  // Keep image files on the checkout's filesystem: /tmp can be tiny in devcontainers.
  const cacheRoot = join(gui, 'tmp');
  await mkdir(cacheRoot, { recursive: true });
  const cache = await mkdtemp(join(cacheRoot, 'catch-local-images-'));
  const base = `http://127.0.0.1:${rendererPort}/`;
  const env = {
    ...process.env,
    CATCH_LOCAL_IMAGES: 'true',
    SURVEY_IMAGE_SERVICE_BASE_URL: base,
    // The preview demo does not start CAT or submit calibration jobs to production.
    CAT_BASE_URL: process.env['CAT_BASE_URL'] ?? 'http://127.0.0.1:8000',
  };
  const children: ChildProcess[] = [];
  const startup = new AbortController();
  let stopping = false;

  const stop = async (code: number) => {
    if (stopping) return;
    stopping = true;
    startup.abort();
    const waits = children.map((child) => {
      if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
      return new Promise<void>((done) => {
        child.once('exit', () => done());
        try {
          if (process.platform === 'win32') child.kill('SIGTERM');
          else if (child.pid) process.kill(-child.pid, 'SIGTERM');
        } catch {
          done();
        }
      });
    });
    await Promise.race([Promise.all(waits), delay(5000)]);
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null && child.pid) {
        try {
          if (process.platform === 'win32') child.kill('SIGKILL');
          else process.kill(-child.pid, 'SIGKILL');
        } catch {
          /* Child may have exited while shutting down. */
        }
      }
    }
    await rm(cache, { recursive: true, force: true });
    console.log(`Local image session stopped; removed ${cache}`);
    process.exit(code);
  };
  process.once('SIGINT', () => void stop(0));
  process.once('SIGTERM', () => void stop(0));

  const run = (command: string, args: string[], cwd: string): ChildProcess => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: 'inherit',
      detached: process.platform !== 'win32',
    });
    children.push(child);
    child.once('error', (error) => {
      console.error(`Cannot start ${command}: ${error.message}`);
      void stop(1);
    });
    child.once('exit', (code, signal) => {
      if (!stopping) {
        console.error(`${command} exited (${signal ?? code}); stopping the local image session.`);
        void stop(code ?? 1);
      }
    });
    return child;
  };

  try {
    console.log(`Local preview cache: ${cache}`);
    console.log(
      'Existing mock search rows are unchanged. Native image cutouts are downloaded on demand.',
    );
    run(
      join(survey, '_develop_previews'),
      ['--port', String(rendererPort), '--cache-dir', cache],
      survey,
    );
    await waitForLocalServer(
      `${base}health`,
      180_000,
      startup.signal,
      async (response) => response.ok && (await response.json()).mode === 'local-preview',
    );
    run(process.execPath, ['--import', 'tsx', '--watch', 'src/server/local.api.ts'], gui);
    run(
      process.execPath,
      [
        'node_modules/@angular/cli/bin/ng.js',
        'serve',
        '--port',
        '4000',
        '--configuration',
        'local-images',
      ],
      gui,
    );
    await waitForLocalServer('http://127.0.0.1:3000/api/hello', 30_000, startup.signal);
    // Probe Vite itself; a readiness check should not start an SSR application render.
    await waitForLocalServer('http://localhost:4000/@vite/client', 120_000, startup.signal);
    console.log(
      'Fixed samples:  http://localhost:4000/data?ra=83.63333333333331&dec=22.013333333333332',
    );
    console.log('Moving samples: http://localhost:4000/data?target=65P');
    console.log(`CAT target: ${env.CAT_BASE_URL} (CAT is not started by this command).`);
  } catch (error) {
    if (stopping) return;
    console.error(error instanceof Error ? error.message : error);
    await stop(1);
  }
}

startLocalImages().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
