import { User } from '@prisma/client';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../lib/authentication/session';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse<Partial<User & { isLoggedIn: boolean }>>
) {
  req.session.destroy();
  res.json({ isLoggedIn: false });
}
