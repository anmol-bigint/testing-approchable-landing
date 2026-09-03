import type { GuideCategory } from '@/data/promptingGuide';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

const PROMPTING_GUIDE_PATH = '/prompting-guide';

export function buildPromptingGuideSchema(categories: GuideCategory[]) {
  const totalSteps = categories.reduce((total, category) => total + category.steps.length, 0);

  let position = 1;
  const itemListElement = categories.flatMap((category) =>
    category.steps.map((step) => {
      const listItem = {
        '@type': 'ListItem',
        position,
        item: {
          '@type': 'HowToStep',
          name: `${category.label}: ${step.title}`,
          text: step.explanation,
        },
      };
      position += 1;
      return listItem;
    })
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(`${PROMPTING_GUIDE_PATH}#webpage`),
        url: absoluteUrl(PROMPTING_GUIDE_PATH),
        name: `Prompting Guide | ${SITE_NAME}`,
        description: `Interactive prompt engineering guide with ${totalSteps} practical exercises.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': absoluteUrl('/#website'),
          url: absoluteUrl('/'),
          name: SITE_NAME,
        },
      },
      {
        '@type': 'LearningResource',
        '@id': absoluteUrl(`${PROMPTING_GUIDE_PATH}#learningresource`),
        name: 'Prompting Guide',
        url: absoluteUrl(PROMPTING_GUIDE_PATH),
        description:
          'A free interactive guide to practice writing better AI prompts with side-by-side weak and improved examples.',
        learningResourceType: 'Interactive exercise',
        educationalLevel: 'Beginner to intermediate',
        isAccessibleForFree: true,
        teaches: [
          'Prompt engineering',
          'Few-shot prompting',
          'Prompt clarity and specificity',
          'Iterative prompt refinement',
        ],
        provider: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
      },
      {
        '@type': 'ItemList',
        '@id': absoluteUrl(`${PROMPTING_GUIDE_PATH}#itemlist`),
        name: 'Prompting guide exercises',
        numberOfItems: totalSteps,
        itemListElement,
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
            name: 'Prompting Guide',
            item: absoluteUrl(PROMPTING_GUIDE_PATH),
          },
        ],
      },
    ],
  };
}
