import Head from 'next/head';
import { langCode } from '../language/lang';
import { Global } from '../types/global';

const url = `https://${Global.subdomian ? Global.subdomian + "." : ""}${Global.domain}`

function HeadUni({
  title, description, pages, lang, imagePath
}: { title: string, description: string; pages: string, lang: langCode, imagePath?: string }) {
  const data = {
    description: description,
    url: `${url}/${lang}${pages}`,
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
      <meta property="og:image" content={imagePath ? imagePath : `${url}/logo.jpg`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={`${Global.subdomian ? Global.subdomian + "." : ""}${Global.domain}`} />
      <meta property="twitter:url" content={data.url} />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={imagePath ? imagePath : `${url}/logo.jpg`} />

      <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      <link rel="alternate" href={`${url}/zh${pages}`} hrefLang="x-default" />
      <link rel="alternate" href={`${url}/zh${pages}`} hrefLang="zh-Hant" />
      <link rel="alternate" href={`${url}/en${pages}`} hrefLang="en" />
      <link rel="alternate" href={`${url}/de${pages}`} hrefLang="de" />
      <link rel="canonical" href={data.url}></link>
    </Head>
  );
}

export default HeadUni;
