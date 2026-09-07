import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QuizRunner from '@/components/assessment/QuizRunner';
import Header from '@/components/Header';
import {
  ASSESSMENT_SLUGS,
  RELATED_COURSE_BY_ASSESSMENT,
  catalogDisplayTitle,
  getAssessment,
  getAssessmentConfig,
  type QuizRec,
} from '@/lib/assessments';
import { getCourseContent } from '@/lib/course-content';
import { buildPageMetadata } from '@/lib/seo/metadata';

interface QuizPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ASSESSMENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { slug } = await params;
  const assessment = getAssessment(slug);
  if (!assessment) return {};

  return buildPageMetadata({
    title: `${assessment.title} Assessment`,
    description: assessment.lede,
    path: `/assessment/quiz/${slug}`,
    ogImageAlt: `${assessment.title} skill assessment from Approachable`,
  });
}

async function getRelatedCourse(assessmentSlug: string): Promise<QuizRec | null> {
  const courseSlug = RELATED_COURSE_BY_ASSESSMENT[assessmentSlug];
  if (!courseSlug) return null;

  const course = await getCourseContent(courseSlug);
  if (!course) return null;

  return {
    tag: course.isFree ? 'Free course' : 'Self-paced',
    title: catalogDisplayTitle(course.slug, course.title),
    desc: course.ogDescription,
    url: `/courses/${course.slug}`,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const assessment = getAssessment(slug);
  if (!assessment) notFound();

  const config = getAssessmentConfig();
  const relatedCourse = await getRelatedCourse(slug);

  return (
    <>
      <Header navVariant="course" />
      <QuizRunner assessment={assessment} config={config} relatedCourse={relatedCourse} />
    </>
  );
}
