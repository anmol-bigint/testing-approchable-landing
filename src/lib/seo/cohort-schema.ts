import { COHORT } from '@/lib/cohort-config';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo/site';

export interface FaqItem {
  q: string;
  a: string;
}

const COURSE_TITLE = 'Claude AI Cohort — Master AI Foundations & the Claude Ecosystem in 3 Weeks';
const COURSE_DESCRIPTION =
  'A small-group, mentor-led cohort on AI Foundations, Claude Chat, Agentic AI with Claude Cowork, and Vibe Coding. 20 seats. Live sessions. Real projects.';

function parsePrice(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return cleaned || '0';
}

export function buildCohortSchema(faq: FaqItem[]) {
  const startDate = new Date(COHORT.date).toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl('/logo.png'),
      },
      {
        '@type': 'Course',
        name: COURSE_TITLE,
        description: COURSE_DESCRIPTION,
        url: SITE_URL,
        provider: { '@id': `${SITE_URL}/#organization` },
        instructor: {
          '@type': 'Person',
          name: 'Ranbeer Makin',
          url: 'https://www.linkedin.com/in/ranbeer/',
        },
        courseMode: 'online',
        offers: [
          {
            '@type': 'Offer',
            price: parsePrice(COHORT.priceIndia),
            priceCurrency: 'INR',
            url: COHORT.formUrl,
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            price: parsePrice(COHORT.priceIntl),
            priceCurrency: 'USD',
            url: COHORT.formUrl,
            availability: 'https://schema.org/InStock',
          },
        ],
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          startDate,
          instructor: {
            '@type': 'Person',
            name: 'Ranbeer Makin',
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };
}
