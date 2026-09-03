import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import LatestPosts from '@/components/LatestPosts';
import TagCounts from '@/components/TagCounts';
import ArchiveWidget from '@/components/ArchiveWidget';
import SubscribeForm from '@/components/SubscribeForm';
import JsonLd from '@/components/JsonLd';
import { getAllPosts } from '@/lib/posts';
import { buildBlogIndexSchema } from '@/lib/seo/blog-schema';
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo/site';

// revalidate every 60 s so new CMS posts appear without a full redeploy
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `Blog | ${SITE_NAME} — AI & Claude Insights` },
  description: 'The Approachable blog with insights on AI, Claude, learning, and practical workflows.',
  keywords: ['Approachable blog', 'AI blog', 'Claude AI', 'approachable.dev'],
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    title: `Blog | ${SITE_NAME} — AI & Claude Insights`,
    description: 'Insights on AI, Claude, learning, and practical workflows from Approachable.',
    url: '/blog',
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${SITE_NAME} — AI & Claude Insights`,
    description: 'Insights on AI, Claude, learning, and practical workflows from Approachable.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const blogSchema = buildBlogIndexSchema(posts);

  return (
    <>
      <JsonLd data={blogSchema} />
      <Header navVariant="blog" />
      <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 min-w-0">
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Blog
              </h1>
              <p className="mb-12 text-lg" style={{ color: 'var(--text-secondary)' }}>
                Thoughts on AI, learning, and the Claude ecosystem.
              </p>

              {posts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No posts yet. Check back soon.</p>
              ) : (
                <ul className="flex flex-col gap-10">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <div
                        className="rounded-xl overflow-hidden border"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {post.coverImage && (
                          <Link href={`/blog/${post.slug}`} className="block relative w-full" style={{ aspectRatio: '16/7' }}>
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </Link>
                        )}
                        <div className="p-6" style={{ backgroundColor: 'var(--bg-warm)' }}>
                          <time
                            className="text-sm"
                            style={{ color: 'var(--text-muted)' }}
                            dateTime={post.date}
                          >
                            {post.date}
                          </time>
                          <h2
                            className="text-xl font-semibold mt-1 mb-2"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <Link href={`/blog/${post.slug}`} className="hover:underline">
                              {post.title}
                            </Link>
                          </h2>
                          <p style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.map((tag) => (
                                <Link
                                  key={tag}
                                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                                  className="inline-block rounded-full px-3 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: 'var(--bg-accent-light)', color: 'var(--accent)' }}
                                >
                                  {tag}
                                </Link>
                              ))}
                            </div>
                          )}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-block mt-4 text-sm font-medium"
                            style={{ color: 'var(--accent)' }}
                          >
                            Read more →
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="lg:w-72 shrink-0 flex flex-col gap-6">
              <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-warm)' }}>
                <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  New to AI terms?
                </h2>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Use our plain-English glossary for quick definitions while you read.
                </p>
                <Link href="/ai-glossary" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Open AI Glossary →
                </Link>
              </div>
              <SubscribeForm />
              <LatestPosts />
              <TagCounts />
              <ArchiveWidget />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
