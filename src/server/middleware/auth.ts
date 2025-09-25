import type { NextFunction, Request, Response } from 'express';
import { verifyToken, type VerifiedUser } from '../utils/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: VerifiedUser;
    token?: string;
  }
}

export function bearer(req: Request): string | null {
  const h = req.header('authorization') || req.header('Authorization');
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = bearer(req);
    if (!token) return res.status(401).json({ error: 'Missing Authorization header' });

    // Try ID token first for groups/email, then fallback to access token
    let user: VerifiedUser | null = null;
    try {
      user = await verifyToken(token, 'id');
    } catch (_) {
      user = await verifyToken(token, 'access');
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid token', detail: err?.message });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const groups = req.user?.groups || [];
    if (!groups.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: missing role', role });
    }
    return next();
  };
}
