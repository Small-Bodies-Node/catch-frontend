import { Router } from 'express';
import { hello } from './routes/hello';
import { horizons } from './routes/horizons';
import { panstarrs } from './routes/panstarrs';

export function configureAPI(router = Router()) {
  router.use('/hello', hello);
  router.use('/horizons', horizons);
  router.use('/panstarrs', panstarrs);
  return router;
}
