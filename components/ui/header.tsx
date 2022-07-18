import Image from 'next/image';
import { useRouter } from 'next/router';
import { Logout, User, UserCircle } from 'tabler-icons-react';
import useUser from '../../lib/authentication/useUser';
import fetchJson from '../../lib/common/fetch-json';
import logo from '../../public/svg/logoipsum.svg';

export default function AppHeader() {
  const { mutateUser } = useUser();
  const router = useRouter();

  return (
    <>
      <div className='flex relative h-full md:w-48 w-36 mx-6'>
        <Image src={logo} layout={'fill'} />
      </div>
      <div className='w-full flex-row gap-8 justify-end mx-6 hidden md:flex'>
        <div
          className='hover:cursor-pointer'
          onClick={(e) => {
            router.push('profile');
          }}
        >
          <UserCircle className='h-7 w-7 text-gray-700' />
        </div>
        <div
          className='hover:cursor-pointer'
          onClick={async (e) => {
            try {
              mutateUser(
                await fetchJson('/api/auth/logout', {
                  method: 'POST',
                }),
                false
              );
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <Logout className='h-7 w-7 text-gray-700' />
        </div>
      </div>
    </>
  );
}
