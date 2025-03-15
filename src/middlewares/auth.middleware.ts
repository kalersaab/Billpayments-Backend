import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authorization =
      req.headers.authorization || req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization') : null);

    if (authorization) {
      const token = await new Promise((resolve, reject) => {
        verify(authorization, SECRET_KEY, (error, decoded) => {
          if (error) {
            reject(new HttpException(401, 'Wrong authentication token'));
          } else {
            resolve(decoded);
          }
        });
      }) as DataStoredInToken;
      req.user = token;
      next();
    } else {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

