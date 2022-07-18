import { NotificationsProvider } from '@mantine/notifications';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode, useState } from 'react';
import Layout from '../components/ui/layout';
import fetchJson from '../lib/common/fetch-json';
import '../styles/globals.css';
import { Chart, ArcElement, Legend } from 'chart.js';
import { Tooltip } from 'chart.js';
import 'dayjs/locale/de';
import { MantineProvider } from '@mantine/core';
import { SWRConfig } from 'swr';
import AppHeader from '../components/ui/header';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  Chart.register(ArcElement, Tooltip, Legend);
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <MantineProvider theme={{ colorScheme: 'light' }}>
        <NotificationsProvider position='top-right'>
          {Component.getLayout ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </NotificationsProvider>
      </MantineProvider>
    </SWRConfig>
  );
}

export default MyApp;
