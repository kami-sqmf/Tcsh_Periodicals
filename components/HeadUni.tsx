import Head from 'next/head';
import { Global } from './global';

const url = `https://${Global.subdomian ? Global.subdomian + "." : "" }${Global.domain}/`

function HeadUni({
  title, description, pages
}: {title: string, description: string; pages: string}) {
  const data = {
    description: description,
    url: `${url}/${pages}`,
    title: `${title} • 慈中後生-文學季刊`,
  };
  return (
        <Head>
            <title>{data.title}</title>
            <meta name="description" content={data.description} />

            <meta property="og:url" content={data.url} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={data.title} />
            <meta property="og:description" content={data.description} />
            <meta property="og:image" content={`${url}/${Global.logo}`} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content={`${Global.subdomian ? Global.subdomian + "." : "" }${Global.domain}`} />
            <meta property="twitter:url" content={data.url} />
            <meta name="twitter:title" content={data.title} />
            <meta name="twitter:description" content={data.description} />
            <meta name="twitter:image" content={`${url}/${Global.logo}`} />

            <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        </Head>
  );
}

export default HeadUni;
