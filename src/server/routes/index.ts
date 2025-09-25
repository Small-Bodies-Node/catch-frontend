import { Router } from 'express';
import { hello } from './hello';
import { horizons } from './horizons';
import { panstarrs } from './panstarrs';

export function configureAPI(router = Router()) {
  router.use('/hello', hello);
  router.use('/horizons', horizons);
  router.use('/panstarrs', panstarrs);
  return router;
}
