import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/favicon/', '/api/', '/assests/', '/banner/', '/language/', '/logo/'],
    },
    sitemap: 'https://periodicals.kami.tw/sitemap.xml',
  };
}