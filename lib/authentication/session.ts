import { User } from '@prisma/client';
import type { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_SECRET as string,
  cookieName: 'iron-session-token',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User & { isLoggedIn: boolean };
  }
}
