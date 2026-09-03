import type { GlossaryEntry } from '@/lib/glossary';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

export function buildGlossaryIndexSchema(entries: GlossaryEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': absoluteUrl('/ai-glossary#webpage'),
        url: absoluteUrl('/ai-glossary'),
        name: `AI Glossary | ${SITE_NAME}`,
        description: 'Plain-English definitions for AI terms, from agents and tokens to RAG and MCP.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': absoluteUrl('/#website'),
          url: absoluteUrl('/'),
          name: SITE_NAME,
        },
      },
      {
        '@type': 'ItemList',
        '@id': absoluteUrl('/ai-glossary#itemlist'),
        name: 'AI glossary terms',
        numberOfItems: entries.length,
        itemListElement: entries.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'DefinedTerm',
            name: entry.t,
            description: entry.d,
            url: absoluteUrl(`/ai-glossary/${entry.slug}`),
            ...(entry.a && { alternateName: entry.a }),
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI Glossary',
            item: absoluteUrl('/ai-glossary'),
          },
        ],
      },
    ],
  };
}

export function buildGlossaryTermSchema(entry: GlossaryEntry) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTerm',
        '@id': absoluteUrl(`/ai-glossary/${entry.slug}#definedterm`),
        name: entry.t,
        description: entry.d,
        inDefinedTermSet: absoluteUrl('/ai-glossary'),
        url: absoluteUrl(`/ai-glossary/${entry.slug}`),
        ...(entry.a && { alternateName: entry.a }),
      },
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(`/ai-glossary/${entry.slug}#webpage`),
        url: absoluteUrl(`/ai-glossary/${entry.slug}`),
        name: `${entry.t} definition | ${SITE_NAME}`,
        description: entry.d,
        mainEntity: {
          '@id': absoluteUrl(`/ai-glossary/${entry.slug}#definedterm`),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI Glossary',
            item: absoluteUrl('/ai-glossary'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: entry.t,
            item: absoluteUrl(`/ai-glossary/${entry.slug}`),
          },
        ],
      },
    ],
  };
}
