import { MetadataRoute } from 'next';
import { DigiDb } from '@/lib/db';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://stardigiloans.com';

  // Dynamic blogs links
  const blogs = DigiDb.getBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs?slug=${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Static site paths
  const staticPaths = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
  ];

  return [...staticPaths, ...blogUrls];
}
