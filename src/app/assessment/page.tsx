import type { Metadata } from 'next';
import Link from 'next/link';
import AssessmentCard from '@/components/assessment/AssessmentCard';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import { getAllAssessments } from '@/lib/assessments';
import { COHORT } from '@/lib/cohort-config';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/lib/seo/site';
import styles from './assessment.module.css';

const DESCRIPTION =
  'Four seven-question AI skill checks for working professionals: AI Foundation, Prompt Engineering, Agentic AI, and Vibe Coding. See where you lose time, then get a recommended next step.';

export const metadata: Metadata = buildPageMetadata({
  title: 'AI Assessments',
  description: DESCRIPTION,
  path: '/assessment',
  ogImageAlt: 'Free AI skill assessments from Approachable',
});

export default function AssessmentPage() {
  const assessments = getAllAssessments();

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Assessments',
    description: DESCRIPTION,
    itemListElement: assessments.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${a.title} Assessment`,
      url: absoluteUrl(`/assessment/quiz/${a.slug}`),
    })),
  };

  return (
    <>
      <JsonLd data={listSchema} />
      <Header navVariant="course" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.eyebrow}>Seven-question skill check</div>
            <h1>
              See which AI skill is costing you <em>time at work.</em>
            </h1>
            <p>
              Not a certification — a short check on foundations, prompt engineering, agentic AI, and
              building with AI. You get a score, a review of your answers, and one recommended
              program.
            </p>
            <div className={styles.buttons}>
              <Link
                className={`${styles.btn} ${styles.btnPrimary}`}
                href="/assessment/quiz/ai-foundation"
              >
                Start with AI Foundation
              </Link>
              <a className={`${styles.btn} ${styles.btnSecondary}`} href="#assessments">
                See all four
              </a>
            </div>
            <p className={styles.heroProof}>
              Built for working professionals. {COHORT.studentsTotal} have already gone through
              Approachable programs.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <b>4</b>
                <span>skill checks</span>
              </div>
              <div className={styles.heroStat}>
                <b>7</b>
                <span>questions each</span>
              </div>
              <div className={styles.heroStat}>
                <b>~7 min</b>
                <span>to finish one</span>
              </div>
              <div className={styles.heroStat}>
                <b>Free</b>
                <span>no sign-up</span>
              </div>
            </div>
          </div>
        </section>

        <section id="assessments">
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>Pick a skill</div>
              <h2>Which one do you want to test?</h2>
              <p>Each check stands alone. Start anywhere — most people begin with AI Foundation.</p>
            </div>

            <div className={styles.quizGrid}>
              {assessments.map((a) => (
                <AssessmentCard
                  key={a.slug}
                  href={`/assessment/quiz/${a.slug}`}
                  tag={a.topic}
                  title={a.title}
                  description={a.description}
                  questionCount={a.questions.length}
                  minutes={a.minutes}
                  level={a.level}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.journey}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>What you walk away with</div>
              <h2>A score, a review, and a next program.</h2>
              <p>No timer. Nothing is saved on this page.</p>
            </div>

            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.num}>01 — SCORE</span>
                <h3>Where you stand</h3>
                <p>Seven work-context questions. Honest read, not a grade to feel bad about.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.num}>02 — REVIEW</span>
                <h3>See why</h3>
                <p>Open any answer to see what was correct and the reasoning behind it.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.num}>03 — NEXT STEP</span>
                <h3>A recommended program</h3>
                <p>
                  Your score maps to the live cohort or a focused course — not a generic catalog.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.final}>
          <div className={styles.container}>
            <div className={styles.sectionLabel}>Not sure where to begin?</div>
            <h2>Start with AI Foundation.</h2>
            <p>
              It&apos;s the base everything else at Approachable builds on. Seven questions, then a
              clear next step.
            </p>
            <div className={styles.buttons}>
              <Link
                className={`${styles.btn} ${styles.btnPrimary}`}
                href="/assessment/quiz/ai-foundation"
              >
                Take the AI Foundation check →
              </Link>
              <Link className={`${styles.btn} ${styles.btnSecondary}`} href="/courses">
                Browse courses
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
