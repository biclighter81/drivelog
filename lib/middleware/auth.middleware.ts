import {
  createMiddlewareDecorator,
  NextFunction,
} from '@storyofams/next-api-decorators';
import { getIronSession } from 'iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../authentication/session';

const AuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const session = await getIronSession(req, res, sessionOptions);
    if (!session.user) {
      res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
    next();
  }
);
export default AuthGuard;
