import { Request, Response, NextFunction } from 'express';

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const providedKey = req.headers['x-api-key'];

  if (providedKey !== process.env.PAYMENTS_API_KEY) {
    return res.status(403).json({ message: 'Invalid API Key' });
  }

  next();
}
