import type { Metadata } from 'next';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import PromptingGuideView from '@/components/prompting-guide/PromptingGuideView';
import { promptingGuideData } from '@/data/promptingGuide';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildPromptingGuideSchema } from '@/lib/seo/prompting-guide-schema';

const GUIDE_CATEGORY_COUNT = promptingGuideData.length;
const GUIDE_STEP_COUNT = promptingGuideData.reduce((total, category) => total + category.steps.length, 0);

export const metadata: Metadata = buildPageMetadata({
  title: `Prompting Guide: ${GUIDE_STEP_COUNT} Interactive AI Prompt Exercises`,
  description:
    `Practice prompt engineering with ${GUIDE_STEP_COUNT} interactive exercises across ${GUIDE_CATEGORY_COUNT} categories. Learn few-shot prompting, clearer instructions, and iterative refinement to write better AI prompts.`,
  path: '/prompting-guide',
  ogImageAlt: 'Prompting Guide from Approachable',
});

export default function PromptingGuidePage() {
  const promptingGuideSchema = buildPromptingGuideSchema(promptingGuideData);

  return (
    <>
      <JsonLd data={promptingGuideSchema} />
      <main className="prompting-guide-page">
        <Header navVariant="blog" />

        <section className="pg-page-hero">
          <span className="pg-page-label">Prompting Guide</span>
          <h1 className="pg-page-title">
            Learn to write prompts that <span>get better results</span>
          </h1>
          <p className="pg-page-subtitle">
            Practice with {GUIDE_STEP_COUNT} interactive exercises. Review a weak prompt, draft your own upgrade, and compare
            it with a high-quality version.
          </p>
          <ul className="pg-hero-stats" aria-label="Prompting guide summary">
            <li>{GUIDE_CATEGORY_COUNT} categories</li>
            <li>{GUIDE_STEP_COUNT} exercises</li>
            <li>Interactive practice</li>
          </ul>
          <ol className="pg-hero-steps" aria-label="How the guide works">
            <li>Read the weak prompt</li>
            <li>Write your version</li>
            <li>Reveal the expert answer</li>
          </ol>
        </section>

        <section className="pg-page-content">
          <PromptingGuideView />
        </section>
      </main>
    </>
  );
}
