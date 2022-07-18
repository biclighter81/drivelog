import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../lib/authentication/session';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user || !(await compare(password, user.hash))) {
      throw new Error('User not found');
    }

    req.session.user = { isLoggedIn: true, ...user } as User & {
      isLoggedIn: boolean;
    };
    await req.session.save();
    res.json({ isLoggedIn: true, ...user });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

async function compare(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
