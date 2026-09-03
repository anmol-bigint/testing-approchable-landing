import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import { getFreeCourses, getPaidCourses } from '@/lib/course-content';
import { buildCoursesListSchema } from '@/lib/seo/course-schema';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './courses.module.css';

const COURSES_DESCRIPTION =
  'Free Claude 101 courses and recorded AI training on Mastery, No-Code Agents, and Vibe Coding. Hands-on learning for working professionals.';

// Same destination the site's other "explore more" links use — the full
// course catalog on the learning platform.
const EXPLORE_MORE_URLS = {
  paid: 'https://learn.approachable.dev/courses',
  free: 'https://learn.approachable.dev/courses?tab=free',
} as const;

export const metadata: Metadata = buildPageMetadata({
  title: 'Free & Recorded AI Courses',
  description: COURSES_DESCRIPTION,
  path: '/courses',
  ogImageAlt: 'Approachable AI courses for working professionals',
});

// Category label, goal-tile copy and the display title used on the courses
// page for the fixed paid catalog. These are presentational overrides, not
// part of the course data itself — display names match the approved page
// mockup, which is shorter than the full course title used elsewhere (SEO,
// course detail page, footer).
const PAID_CATEGORIES: Record<
  string,
  { tag: string; displayTitle: string; goalNumber: string; goalTitle: string; goalDescription: string }
> = {
  'ai-mastery-for-working-professionals': {
    tag: 'Work with AI',
    displayTitle: 'AI Mastery for Working Professionals',
    goalNumber: '01',
    goalTitle: 'Work with AI',
    goalDescription: 'Use AI effectively for writing, research, analysis and everyday professional work.',
  },
  'no-code-ai-agents-mastery-for-working-professionals': {
    tag: 'Automate',
    displayTitle: 'No-Code AI Agents Mastery',
    goalNumber: '02',
    goalTitle: 'Automate',
    goalDescription: 'Turn repetitive tasks into AI-powered workflows and agents without coding.',
  },
  'vibe-coding-mastery-for-working-professionals': {
    tag: 'Build',
    displayTitle: 'Vibe Coding Mastery',
    goalNumber: '03',
    goalTitle: 'Build',
    goalDescription: 'Turn an idea into a working prototype using modern AI building tools.',
  },
};

// Display title override for the free catalog, matching the mockup.
const FREE_DISPLAY_TITLES: Record<string, string> = {
  'introduction-to-ai-agents': 'Introduction to AI Agents',
  'claude-ecosystem---chat-code-cowork': 'Claude Ecosystem',
  'claude-101-sub-agents-hooks-and-claude-md': 'Claude 101: Build Your Harness',
  'claude-101-skills-connectors-and-more': 'Claude 101: Extend Claude',
};

export default async function CoursesPage() {
  const [freeCourses, paidCourses] = await Promise.all([getFreeCourses(), getPaidCourses()]);
  const allCourses = [...freeCourses, ...paidCourses];
  const coursesListSchema = buildCoursesListSchema(
    allCourses.map((course) => ({ slug: course.slug, title: course.title })),
  );

  const paidCoursesWithMeta = paidCourses.map((course) => ({
    ...course,
    tag: PAID_CATEGORIES[course.slug]?.tag ?? 'Course',
    displayTitle: PAID_CATEGORIES[course.slug]?.displayTitle ?? course.title,
  }));

  const freeCoursesWithMeta = freeCourses.map((course) => ({
    ...course,
    displayTitle: FREE_DISPLAY_TITLES[course.slug] ?? course.title,
  }));

  return (
    <>
      <JsonLd data={coursesListSchema} />
      <Header navVariant="course" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.eyebrow}>AI learning for working professionals</div>
            <h1>
              From AI Curious to <em>AI Capable.</em>
            </h1>
            <p>
              Learn how to use AI to work better, automate repetitive work, make better decisions and
              build useful things — without becoming an AI engineer.
            </p>
            <div className={styles.buttons}>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="#goals">
                Find your path ↓
              </a>
              <a className={`${styles.btn} ${styles.btnSecondary}`} href="#free">
                Start with a free course
              </a>
            </div>
          </div>
        </section>

        <section id="goals">
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>Start with the outcome</div>
              <h2>What do you want to do with AI?</h2>
              <p>Choose the capability you want to build. We&apos;ll point you to the right starting place.</p>
            </div>

            <div className={styles.goals}>
              {paidCourses.map((course) => {
                const category = PAID_CATEGORIES[course.slug];
                if (!category) return null;
                return (
                  <Link key={course.slug} className={styles.goal} href={`/courses/${course.slug}`}>
                    <span className={styles.number}>{category.goalNumber}</span>
                    <h3>{category.goalTitle}</h3>
                    <p>{category.goalDescription}</p>
                  </Link>
                );
              })}
              <Link className={styles.goal} href="#free">
                <span className={styles.number}>04</span>
                <h3>Understand AI</h3>
                <p>Build a practical mental model of LLMs, agents and the modern AI ecosystem.</p>
              </Link>
            </div>
          </div>
        </section>

        <section id="courses" className={styles.pathSection}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>Go deeper</div>
              <h2>Build capabilities that matter at work.</h2>
              <p>Self-paced courses with lifetime access, hands-on projects and practical examples.</p>
            </div>

            <div className={styles.cards}>
              {paidCoursesWithMeta.map((course) => (
                <article className={styles.card} key={course.slug}>
                  <div className={styles.cardImage}>
                    {course.heroImage && <img src={course.heroImage} alt={course.displayTitle} />}
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.tag}>{course.tag}</span>
                    <h3>{course.displayTitle}</h3>
                    <p>{course.shortDescription}</p>
                    <Link className={styles.cardLink} href={`/courses/${course.slug}`}>
                      View course →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <a className={styles.exploreLink} href={EXPLORE_MORE_URLS.paid} target="_blank" rel="noopener noreferrer">
              Explore more courses →
            </a>
          </div>
        </section>

        <section id="free" className={styles.free}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>No cost</div>
              <h2>Not ready for a full course? Start here.</h2>
              <p>Short, practical courses to help you get comfortable with AI.</p>
            </div>

            <div className={styles.freeGrid}>
              {freeCoursesWithMeta.map((course) => (
                <article className={styles.freeCard} key={course.slug}>
                  <div className={styles.freeImage}>
                    {course.heroImage && <img src={course.heroImage} alt={course.displayTitle} />}
                  </div>
                  <span className={styles.tag}>Free</span>
                  <h3>{course.displayTitle}</h3>
                  <p>{course.shortDescription}</p>
                  <Link className={styles.cardLink} href={`/courses/${course.slug}`}>
                    Start learning →
                  </Link>
                </article>
              ))}
            </div>

            <a className={styles.exploreLink} href={EXPLORE_MORE_URLS.free} target="_blank" rel="noopener noreferrer">
              Explore more courses →
            </a>
          </div>
        </section>

        <section id="journey" className={styles.journey}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionLabel}>Your learning journey</div>
              <h2>Start small. Build capability. Go deeper.</h2>
              <p>A simple progression from curiosity to practical AI capability.</p>
            </div>

            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.num}>01 — EXPLORE</span>
                <h3>Start Free</h3>
                <p>Try a short course and understand what&apos;s possible with today&apos;s AI tools.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.num}>02 — BUILD</span>
                <h3>Go Self-Paced</h3>
                <p>Choose a capability and build it through practical, hands-on projects.</p>
              </div>
              <div className={styles.step}>
                <span className={styles.num}>03 — ACCELERATE</span>
                <h3>Learn Live</h3>
                <p>Join a mentor-led cohort, work with peers and build real projects together.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={`${styles.container} ${styles.mentor}`}>
            <div className={styles.mentorCopy}>
              <div className={styles.sectionLabel}>Learn from experience</div>
              <h2>Practical AI. Not AI theory.</h2>
              <p>
                Courses are taught by Ranbeer Makin and designed around the way professionals actually
                work. The focus is on understanding the tools, applying them to real problems and
                building the confidence to keep learning.
              </p>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} href="#courses">
                Explore courses →
              </Link>
            </div>
            <div className={styles.mentorBox}>
              <strong>&ldquo;The goal isn&apos;t to become an AI expert overnight.&rdquo;</strong>
              Learn enough to use AI confidently today — and build the capability to go further
              tomorrow.
            </div>
          </div>
        </section>

        <section id="cohort" className={styles.final}>
          <div className={styles.container}>
            <div className={styles.sectionLabel}>Want more guidance?</div>
            <h2>Learn with a mentor and a cohort.</h2>
            <p>
              Small groups, real projects and direct access to your mentor. The live cohort is for
              professionals who want structure, accountability and hands-on learning.
            </p>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} href="/">
              Explore the AI Cohort →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
