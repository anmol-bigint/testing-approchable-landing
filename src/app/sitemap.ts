import type { MetadataRoute } from 'next';
import { ALL_CATALOG_SLUGS } from '@/lib/course-content';
import { getGlossaryEntries } from '@/lib/glossary';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { absoluteUrl } from '@/lib/seo/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const posts = getAllPosts();
  const tags = getAllTags();
  const glossaryEntries = getGlossaryEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/courses'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/team-ai-training'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/about'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/ai-glossary'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/archive'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/privacy'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/data-security'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    {
      url: absoluteUrl('/help'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: absoluteUrl('/case-studies'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const courseRoutes: MetadataRoute.Sitemap = ALL_CATALOG_SLUGS.map((slug) => ({
    url: absoluteUrl(`/courses/${slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = new Date(post.date);
    return {
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: Number.isNaN(postDate.getTime()) ? lastModified : postDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  const blogTagRoutes: MetadataRoute.Sitemap = tags
    .filter(({ count }) => count > 1)
    .map(({ tag }) => ({
      url: absoluteUrl(`/blog/tag/${encodeURIComponent(tag)}`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

  const glossaryTermRoutes: MetadataRoute.Sitemap = glossaryEntries.map((entry) => ({
    url: absoluteUrl(`/ai-glossary/${entry.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes, ...blogTagRoutes, ...glossaryTermRoutes];
}
