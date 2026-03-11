import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    // 60000ms window, 100 requests max — hardcoded magic numbers
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return next();
  }

  record.count++;

  if (record.count > 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
}
