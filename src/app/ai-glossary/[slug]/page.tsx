import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import { getGlossaryEntries, getGlossaryEntryBySlug, slugify } from '@/lib/glossary';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildGlossaryTermSchema } from '@/lib/seo/glossary-schema';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getGlossaryEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntryBySlug(slug);
  if (!entry) return {};

  return buildPageMetadata({
    title: `${entry.t}: Plain-English AI Definition`,
    description: `${entry.t}: ${entry.d}`,
    path: `/ai-glossary/${entry.slug}`,
    ogImageAlt: `${entry.t} definition in the Approachable AI Glossary`,
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const entry = getGlossaryEntryBySlug(slug);
  if (!entry) notFound();

  const termSchema = buildGlossaryTermSchema(entry);

  return (
    <>
      <JsonLd data={termSchema} />
      <main className="glossary-page">
        <Header navVariant="blog" />

        <section className="gl-page-hero">
          <span className="gl-page-label">AI Glossary term</span>
          <h1 className="gl-page-title">{entry.t}</h1>
          <p className="gl-page-subtitle">{entry.d}</p>
        </section>

        <div className="container-max">
          <article className="gl-card">
            {entry.a ? <p className="gl-aka">Also called: {entry.a}</p> : null}
            <p className="gl-def">{entry.d}</p>
            <p className="gl-why">
              <strong>Why it matters</strong>
              {entry.w}
            </p>
            {entry.s.length ? (
              <p className="gl-see">
                See also{' '}
                {entry.s.map((term, index) => (
                  <span key={term}>
                    <Link href={`/ai-glossary/${slugify(term)}`}>{term}</Link>
                    {index < entry.s.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            ) : null}
          </article>

          <section className="gl-cta">
            <h2>Explore more AI terms</h2>
            <p>Browse the full glossary for plain-English definitions across models, agents, data, and safety.</p>
            <Link href="/ai-glossary" className="gl-btn-primary">
              Back to all terms
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
