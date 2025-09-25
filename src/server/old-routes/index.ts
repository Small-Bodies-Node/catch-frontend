import { Router } from 'express';
import health from './health.route';
import users from './users.route';
import auth from './auth.route';
import admin from './admin.route';

export function configureAPI(router = Router()) {
  router.use('/health', health);
  router.use('/auth', auth);
  router.use('/users', users);
  router.use('/admin', admin);
  return router;
}
