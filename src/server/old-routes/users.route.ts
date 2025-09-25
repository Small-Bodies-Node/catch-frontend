import { Router } from 'express';
import { listUsers, mockUsers } from '../handlers/users.handler';
import { requireAuth } from '../middleware/auth';
import { UserSchema } from '../../shared/schemas/user.zod';

const r = Router();

r.get('/', async (_req, res, next) => {
  try {
    const users = await listUsers();
    const parsed = UserSchema.array().parse(users);
    return res.json(parsed);
  } catch (err) {
    return next(err);
  }
});

// Protected user detail endpoint
r.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const user = mockUsers.find(u => u.id === req.params['id']);
    if (!user) return res.status(404).json({ error: 'NotFound' });
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

export default r;
