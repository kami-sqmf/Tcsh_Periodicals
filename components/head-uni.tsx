import Head from 'next/head';
import { langCode } from '../language/lang';
import { Global } from '../types/global';

const url = `https://${Global.subdomian ? Global.subdomian + "." : ""}${Global.domain}/`

function HeadUni({
  title, description, pages, lang
}: { title: string, description: string; pages: string, lang: langCode }) {
  const data = {
    description: description,
    url: `${url}/${pages}`,
    title: `${title} • ${lang == "zh" ? "慈中後生-文學季刊" : "Tzuchi Senior Periodicals"}`,
  };
  return (
    <Head>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />

      <meta property="og:url" content={data.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={`${url}/logo.jpg`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={`${Global.subdomian ? Global.subdomian + "." : ""}${Global.domain}`} />
      <meta property="twitter:url" content={data.url} />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={`${url}/logo.jpg`} />

      <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
    </Head>
  );
}

export default HeadUni;
