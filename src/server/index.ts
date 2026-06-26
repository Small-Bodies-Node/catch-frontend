import { Router } from 'express';
import { hello } from './routes/hello';
import { horizons } from './routes/horizons';
import { panstarrs } from './routes/panstarrs';
import { cat } from './routes/cat';
import { siteBanner } from './routes/site-banner';

export function configureAPI(router = Router()) {
  router.use((req, res, next) => {
    const requestId = req.get('x-catch-request-id') || createRequestId();
    const startedAt = Date.now();

    res.locals['catchRequestId'] = requestId;
    res.setHeader('X-CATCH-Request-Id', requestId);
    console.log(`[CATCH API ${requestId}] inbound ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      console.log(
        `[CATCH API ${requestId}] responded ${res.statusCode} to GUI in ${Date.now() - startedAt}ms`,
      );
    });

    next();
  });

  router.use('/hello', hello);
  router.use('/site-banner', siteBanner);
  router.use('/cat', cat);
  router.use('/horizons', horizons);
  router.use('/panstarrs', panstarrs);
  return router;
}

function createRequestId(): string {
  return `catch-api-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
