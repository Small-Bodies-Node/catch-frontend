import { Router } from 'express';

const r = Router();

r.get('/', (_req, res) => {
  return res.json({ ok: true, uptime: process.uptime() });
});

export default r;
