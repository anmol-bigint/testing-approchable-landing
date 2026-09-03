import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { marked } from 'marked';
import Header from '@/components/Header';
import LatestPosts from '@/components/LatestPosts';
import TagCounts from '@/components/TagCounts';
import ArchiveWidget from '@/components/ArchiveWidget';
import SubscribeForm from '@/components/SubscribeForm';
import JsonLd from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import { getAllPosts, getPostBySlug, isSeoExcludedPost } from '@/lib/posts';
import { buildBlogPostSchema } from '@/lib/seo/blog-schema';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo/site';

// allow slugs committed after the last build to be rendered on-demand
export const dynamicParams = true;
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const canonical = `/blog/${slug}`;
  const imageUrl = post.coverImage ?? DEFAULT_OG_IMAGE;
  const isExcluded = isSeoExcludedPost(post);
  const parsedDate = new Date(post.date);
  const publishedTime = Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();

  return {
    title: { absolute: post.title },
    description: post.excerpt,
    authors: [{ name: 'Ranbeer Makin', url: 'https://www.linkedin.com/in/ranbeer/' }],
    alternates: {
      canonical,
    },
    robots: isExcluded ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: canonical,
      siteName: SITE_NAME,
      publishedTime,
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await marked(post.body);
  const blogPostSchema = buildBlogPostSchema(post);

  return (
    <>
      <JsonLd data={blogPostSchema} />
      <Header navVariant="blog" />
      <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <article className="flex-1 min-w-0">
              <Link
                href="/blog"
                className="text-sm mb-8 inline-block"
                style={{ color: 'var(--accent)' }}
              >
                ← All posts
              </Link>

              <time
                className="block text-sm mb-2"
                style={{ color: 'var(--text-muted)' }}
                dateTime={post.date}
              >
                {post.date}
              </time>

              <h1
                className="text-4xl font-bold mb-4 leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {post.title}
              </h1>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
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

              <ShareButtons title={post.title} url={`${SITE_URL}/blog/${slug}`} />

              <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
                {post.excerpt}
              </p>

              {post.coverImage && (
                <div className="relative w-full mb-10 rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
              )}

              <div
                className="prose-content"
                style={{ color: 'var(--text-primary)' }}
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <div
                className="rounded-xl border p-5 mt-10"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-warm)' }}
              >
                <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Need a quick definition?
                </h2>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Browse the AI Glossary for plain-English explanations of common terms in this post.
                </p>
                <Link href="/ai-glossary" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Open AI Glossary →
                </Link>
              </div>

              <ShareButtons title={post.title} url={`${SITE_URL}/blog/${slug}`} variant="full" />
            </article>

            <aside className="lg:w-72 shrink-0 flex flex-col gap-6">
              <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-warm)' }}>
                <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  AI Glossary
                </h2>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Definitions for terms like tokens, RAG, MCP, agents, and more.
                </p>
                <Link href="/ai-glossary" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Browse glossary →
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
