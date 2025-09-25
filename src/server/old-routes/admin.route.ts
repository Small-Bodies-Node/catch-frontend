import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const r = Router();

r.get('/', requireAuth, requireRole('admin'), (_req, res) => {
  return res.json({
    section: 'admin',
    items: [
      { id: 1, name: 'Alpha', status: 'ok' },
      { id: 2, name: 'Beta', status: 'ok' },
      { id: 3, name: 'Gamma', status: 'ok' }
    ],
    ts: Date.now()
  });
});

r.get('/example', requireAuth, requireRole('admin'), (_req, res) => {
  return res.json({ message: 'Admin-only example data', ts: Date.now() });
});

export default r;
