import {
  AppShell,
  Burger,
  Footer,
  Header,
  MediaQuery,
  Navbar,
  useMantineTheme,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import AppFooter from './footer';
import AppHeader from './header';
import AppNavbar from './navbar';

export default function Layout({ children }: any) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint='sm'
        asideOffsetBreakpoint='sm'
        fixed
        navbar={
          <Navbar
            p='md'
            hiddenBreakpoint='sm'
            hidden={!opened}
            width={{ sm: 250, lg: 300 }}
          >
            <AppNavbar />
          </Navbar>
        }
        aside={<></>}
        footer={
          <Footer height={60} p='md'>
            <AppFooter />
          </Footer>
        }
        header={
          <Header height={70} p='none'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size='sm'
                  color={theme.colors.gray[6]}
                  mr='xs'
                  ml='xl'
                />
              </MediaQuery>

              <AppHeader></AppHeader>
            </div>
          </Header>
        }
      >
        <div className='mx-4 my-4'>
          <main>{children}</main>
        </div>
      </AppShell>
    </>
  );
}
