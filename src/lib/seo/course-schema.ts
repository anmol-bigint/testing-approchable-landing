import type { CourseContent } from '@/lib/course-content';
import { SITE_URL } from '@/lib/seo/metadata';

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

function parsePrice(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return cleaned || '0';
}

export function buildCourseSchema(course: CourseContent) {
  const offers = course.isFree
    ? [
        {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/courses/${course.slug}`,
        },
      ]
    : [
        {
          '@type': 'Offer',
          price: parsePrice(course.pricing.inr.current),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: course.purchaseUrl,
        },
      ];

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Course',
      name: course.title,
      description: course.ogDescription,
      url: `${SITE_URL}/courses/${course.slug}`,
      provider: {
        '@type': 'Organization',
        name: 'Approachable',
        url: SITE_URL,
      },
      instructor: {
        '@type': 'Person',
        name: course.instructor.name,
      },
      courseMode: 'online',
      ...(course.heroImage && { image: absoluteUrl(course.heroImage) }),
      offers,
    },
  ];

  if (course.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: course.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildCoursesListSchema(courses: { slug: string; title: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/courses/${course.slug}`,
      name: course.title,
    })),
  };
}
