import { Analytics } from '@vercel/analytics/react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps<{ session: Session; }>) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
      <RecoilRoot>
        <Component {...pageProps} />
        <Analytics />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;