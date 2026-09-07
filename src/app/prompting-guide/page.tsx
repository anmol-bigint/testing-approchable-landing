import type { Metadata } from 'next';
import Link from 'next/link';
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
          <div className="container-max">
            <section className="pg-cta" aria-labelledby="pg-cta-heading">
              <div className="pg-cta-inner">
                <div className="pg-cta-copy">
                  <span className="pg-cta-label">Next step</span>
                  <h2 id="pg-cta-heading">
                    You&apos;ve practiced the prompts. <span>Now see where you stand.</span>
                  </h2>
                  <p>Free seven-question skill checks on AI foundations, prompt engineering, agentic AI, and more.</p>
                  <ul className="pg-cta-stats" aria-label="Assessment summary">
                    <li>4 assessments</li>
                    <li>7 questions each</li>
                    <li>Free</li>
                  </ul>
                  <Link href="/assessment" className="btn-primary pg-cta-btn">
                    See all assessments →
                  </Link>
                </div>
                <ul className="pg-cta-topics" aria-label="Available assessments">
                  <li>AI Foundation</li>
                  <li>Prompt Engineering</li>
                  <li>Agentic AI</li>
                  <li>Vibe Coding</li>
                </ul>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
