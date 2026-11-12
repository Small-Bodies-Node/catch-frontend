import { setTimeout as delay } from 'node:timers/promises';

export async function waitForLocalServer(
  url: string,
  timeoutMs: number,
  signal: AbortSignal,
  isReady: (response: Response) => Promise<boolean> = async (response) => response.ok,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    signal.throwIfAborted();
    try {
      const response = await fetch(url, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(1000)]),
      });
      if (await isReady(response)) return;
    } catch {
      // A closed port or unfinished build is expected until the child is ready.
      signal.throwIfAborted();
    }
    await delay(250, undefined, { signal });
  }
  throw new Error(`${url} did not become ready within ${timeoutMs / 1000} seconds.`);
}
