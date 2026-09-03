import type { Metadata } from 'next';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import GlossaryView from '@/components/glossary/GlossaryView';
import { getGlossaryEntries } from '@/lib/glossary';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildGlossaryIndexSchema } from '@/lib/seo/glossary-schema';

const GLOSSARY_ENTRIES = getGlossaryEntries();
const GLOSSARY_TERM_COUNT = GLOSSARY_ENTRIES.length;
const GLOSSARY_DESCRIPTION = `Plain-English AI definitions for ${GLOSSARY_TERM_COUNT} essential terms, including agents, tokens, RAG, MCP, LLMs, and fine-tuning.`;

export const metadata: Metadata = buildPageMetadata({
  title: `AI Glossary: Plain-English Definitions (${GLOSSARY_TERM_COUNT} Terms)`,
  description: GLOSSARY_DESCRIPTION,
  path: '/ai-glossary',
  ogImageAlt: 'AI Glossary from Approachable',
});

export default function GlossaryPage() {
  const glossarySchema = buildGlossaryIndexSchema(GLOSSARY_ENTRIES);

  return (
    <>
      <JsonLd data={glossarySchema} />
      <main className="glossary-page">
        <Header navVariant="blog" />

        <section className="gl-page-hero">
          <span className="gl-page-label">AI Glossary - {GLOSSARY_TERM_COUNT} terms</span>
          <h1 className="gl-page-title">
            Every AI term, <span>in plain English</span>
          </h1>
          <p className="gl-page-subtitle">
            Tokens, agents, RAG, MCP, fine-tuning. Here is what each one actually means - no maths, no hype.
          </p>
        </section>

        <GlossaryView entries={GLOSSARY_ENTRIES} />
      </main>
    </>
  );
}
