import { SECRET_KEY } from '@/config';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verify(token, SECRET_KEY, { algorithms: ['HS256'] });

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        data: [],
        message: 'Auth expired or invalid. Please log in again.',
        status: 403,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};
