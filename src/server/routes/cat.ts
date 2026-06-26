import { Request, Response } from 'express';
import { environment } from '../../environments/environment.local';

const defaultCatBaseUrl = environment.CAT_BASE_URL;

/**
 * Proxies CAT API requests through the same app origin. The browser calls /api/cat/*, and the
 * Node server forwards to CAT_BASE_URL so browser builds do not need to know the CAT host.
 */
export const cat = async (req: Request, res: Response) => {
  const originalUrl = req.originalUrl || req.url;
  const requestId = getRequestId(req, res);
  console.log(
    `[CAT proxy ${requestId}] inbound ${req.method} ${originalUrl}; payload=${summarizePayload(req.body)}`,
  );

  if (req.method === 'OPTIONS') {
    console.log(`[CAT proxy ${requestId}] preflight accepted ${originalUrl}`);
    return res.sendStatus(204);
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    console.log(`[CAT proxy ${requestId}] rejected unsupported method ${req.method}`);
    return res.status(405).json({ error: 'CAT proxy only supports GET and POST requests.' });
  }

  const baseUrl = (process.env['CAT_BASE_URL'] || defaultCatBaseUrl).replace(/\/+$/, '');
  const catPath = req.url.replace(/^\/+/, '');
  const catUrl = `${baseUrl}/${catPath}`;
  console.log(`[CAT proxy ${requestId}] forwarding ${req.method} ${originalUrl} -> ${catUrl}`);

  try {
    const upstreamStartedAt = Date.now();
    const response = await fetch(catUrl, {
      method: req.method,
      headers: {
        Accept: req.get('accept') || 'text/plain, application/json',
        'X-CATCH-Request-Id': requestId,
        ...(req.method === 'POST' ? { 'content-type': 'application/json' } : {}),
      },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body ?? {}) } : {}),
    });
    const upstreamDurationMs = Date.now() - upstreamStartedAt;
    const contentType = response.headers.get('content-type');
    const body = Buffer.from(await response.arrayBuffer());

    console.log(
      `[CAT proxy ${requestId}] CAT replied status=${response.status} ok=${response.ok} ` +
        `contentType=${contentType || 'none'} bytes=${body.byteLength} ` +
        `in ${upstreamDurationMs}ms`,
    );

    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    res.setHeader('X-CATCH-CAT-Status', String(response.status));
    res.setHeader('X-CATCH-CAT-Duration-Ms', String(upstreamDurationMs));
    console.log(`[CAT proxy ${requestId}] sending status=${response.status} back to GUI`);

    return res.status(response.status).send(body);
  } catch (error) {
    console.error(`[CAT proxy ${requestId}] error fetching data from the CAT API:`, error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching data from the CAT API.' });
  }
};

function getRequestId(req: Request, res: Response): string {
  const requestId =
    req.get('x-catch-request-id') ||
    res.locals['catchRequestId'] ||
    `cat-proxy-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

  res.locals['catchRequestId'] = requestId;
  res.setHeader('X-CATCH-Request-Id', requestId);
  return requestId;
}

function summarizePayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'none';
  }

  const body = payload as Record<string, unknown>;
  const keys = Object.keys(body);
  const imageUrl = typeof body['image_url'] === 'string' ? body['image_url'] : '';
  const imageUrlSummary = imageUrl
    ? `${imageUrl.slice(0, 90)}${imageUrl.length > 90 ? '...' : ''}`
    : 'missing';

  return `keys=[${keys.join(',') || 'none'}] image_url=${imageUrlSummary}`;
}
