// export async function generateStaticParams() {
//   return Object.keys(languages).map((locale) => ({ locale }))
// }

export default async function RootLayout(
  props: {
    children: React.ReactNode,
    params: Promise<{ locale: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <html lang={await params.locale}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <meta property="fb:app_id" content="5964310810278637" />
      <body >
        {children}
      </body>
    </html>
  )
}