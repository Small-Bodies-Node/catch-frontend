import { Request, Response } from 'express';
import { localImageUrl } from '../../utils/localImageUrl';

/** Development-only proxy to a loopback renderer with a fixed, validated route. */
export async function localImagePreview(req: Request, res: Response) {
  const source = typeof req.query['url'] === 'string' ? req.query['url'] : '';
  if (req.method !== 'GET' || req.path !== '/owned') return res.sendStatus(404);
  if (!source || localImageUrl(source, true) === source)
    return res.status(400).json({ error: 'Expected an owned image cutout URL.' });

  const base = new URL(process.env['SURVEY_IMAGE_SERVICE_BASE_URL'] ?? 'http://127.0.0.1:5010/');
  if (base.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname))
    return res.status(500).json({ error: 'Local image renderer must use a loopback address.' });
  const url = new URL('images/owned', base);
  url.searchParams.set('url', source);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const disconnect = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.on('close', disconnect);
  try {
    const upstream = await fetch(url, { signal: controller.signal });
    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') ?? 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'no-store');
    for (const header of ['X-CATCH-Image-Renderer', 'X-CATCH-Image-Mode', 'X-CATCH-Image-Cache']) {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    }
    return res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    if (!res.destroyed)
      return res.status(502).json({ error: 'Local image renderer is unavailable.' });
    return;
  } finally {
    clearTimeout(timeout);
    res.off('close', disconnect);
  }
}
