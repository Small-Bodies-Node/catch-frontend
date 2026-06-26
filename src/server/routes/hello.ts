import { Request, Response } from 'express';

/**
 *
 */
export const hello = async (req: Request, res: Response) => {
  const requestId = res.locals['catchRequestId'] || req.get('x-catch-request-id') || 'no-request-id';
  console.log(`[CATCH API hello ${requestId}] ${req.method} ${req.originalUrl}`);
  res.send('Hello World from API!!!');
};
