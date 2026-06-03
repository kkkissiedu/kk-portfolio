import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kkkissiedu.com';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/work/structural-engineering`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work/ml-research`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work/3d-design`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
