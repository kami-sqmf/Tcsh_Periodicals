import { webInfo } from '@/utils/config';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.index.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.ebook.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.postIt.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.ideaUrStory.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.member.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.accounts.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.accounts.child.signIn.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.policy.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.policy.child.cookie.href}`,
      lastModified: new Date(),
    },
    {
      url: `https://${webInfo.subdomian}.${webInfo.domain}${webInfo.webMap.policy.child.privacy.href}`,
      lastModified: new Date(),
    },
  ];
}