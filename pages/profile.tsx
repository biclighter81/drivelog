import { Button } from '@mantine/core';
import useUser from '../lib/authentication/useUser';

export default function Profile({}) {
  const { user } = useUser({
    redirectTo: '/auth/login',
    redirectIfFound: false,
  });
  return (
    <>
      {true && (
        <div>
          <h1 className='text-2xl font-black mb-12'>Hallo {user?.prename}</h1>
        </div>
      )}
    </>
  );
}
