import { SECRET_KEY } from '@/config';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Auth = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : '';
    if (!Auth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await verify(
      Auth,
      SECRET_KEY,
      { algorithms: ['HS256'] },
      (err, decoded)=>{
        if (err) {
          return res.status(403).json({data:[], message: 'Auth expire you need to login again', status:403 });
        }
        req.user = decoded;
        next();
      }
    );
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err });
  }
};
