import { Request, Response } from 'express';

/** Fixed upstream route: client input cannot select an arbitrary host or path. */
export async function imagePreview(req: Request, res: Response) {
  if (req.method !== 'GET' || !['/skymapper', '/panstarrs'].includes(req.path))
    return res.sendStatus(404);
  const skymapper = req.path === '/skymapper';
  const image = String(req.query['image'] ?? '');
  const ra = Number(req.query['ra']);
  const dec = Number(req.query['dec']);
  const size = Number(req.query['size']);
  const validImage = skymapper
    ? /^\d{14}-\d{2}$/.test(image)
    : /^\/rings\.v3\.skycell\/\d{4}\/\d{3}\/rings\.v3\.skycell\.\d{4}\.\d{3}\.[A-Za-z0-9_.]+\.fits$/.test(
        image,
      );
  const validSize = skymapper
    ? size > 0 && size < 1 / 6
    : Number.isInteger(size) && size > 0 && size <= 2048;
  if (
    !validImage ||
    !Number.isFinite(ra) ||
    ra < 0 ||
    ra >= 360 ||
    !Number.isFinite(dec) ||
    dec < -90 ||
    dec > 90 ||
    !validSize
  ) {
    return res.status(400).json({ error: 'Invalid preview cutout parameters.' });
  }
  const base =
    process.env['SURVEY_IMAGE_SERVICE_BASE_URL'] ?? 'https://sbnsurveys.astro.umd.edu/api/';
  const url = new URL(`previews${req.path}`, `${base.replace(/\/+$/, '')}/`);
  url.search = new URLSearchParams({
    image,
    ra: String(ra),
    dec: String(dec),
    size: String(size),
  }).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const disconnect = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.on('close', disconnect);
  try {
    const upstream = await fetch(url, { signal: controller.signal });
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'image/png');
    if (process.env['CATCH_LOCAL_IMAGES'] === 'true') {
      res.setHeader('Cache-Control', 'no-store');
      for (const header of [
        'X-CATCH-Image-Renderer',
        'X-CATCH-Image-Mode',
        'X-CATCH-Image-Cache',
      ]) {
        const value = upstream.headers.get(header);
        if (value) res.setHeader(header, value);
      }
    } else if (upstream.ok) res.setHeader('Cache-Control', 'public, max-age=604800');
    return res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    if (!res.destroyed) return res.status(502).json({ error: 'Image preview is unavailable.' });
    return;
  } finally {
    clearTimeout(timeout);
    res.off('close', disconnect);
  }
}
