import configData from '@/data/assessments/config.json';
import foundationData from '@/data/assessments/ai-foundation.json';
import agentsData from '@/data/assessments/agents.json';
import promptingData from '@/data/assessments/prompting.json';
import vibeCodingData from '@/data/assessments/vibe-coding.json';

export type ScoreBandKey = 'low' | 'mid' | 'high';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  why?: string;
}

export interface QuizRec {
  tag: string;
  title: string;
  desc: string;
  url: string;
}

export interface Assessment {
  slug: string;
  topic: string;
  title: string;
  lede: string;
  level: string;
  minutes: number;
  description: string;
  questions: QuizQuestion[];
  recs: Record<ScoreBandKey, QuizRec[]>;
}

export interface ScoreBand {
  max: number;
  key: ScoreBandKey;
  label: string;
  title: string;
  text: string;
}

export interface AssessmentConfig {
  instantFeedback: boolean;
  bands: ScoreBand[];
}

const ASSESSMENTS: Assessment[] = [
  foundationData as Assessment,
  promptingData as Assessment,
  agentsData as Assessment,
  vibeCodingData as Assessment,
];

const ASSESSMENT_BY_SLUG = new Map(ASSESSMENTS.map((a) => [a.slug, a]));

export const ASSESSMENT_SLUGS = ASSESSMENTS.map((a) => a.slug);

export function getAssessmentConfig(): AssessmentConfig {
  return configData as AssessmentConfig;
}

export function getAllAssessments(): Assessment[] {
  return ASSESSMENTS;
}

export function getAssessment(slug: string): Assessment | undefined {
  return ASSESSMENT_BY_SLUG.get(slug);
}

export function getScoreBand(
  percent: number,
  bands: ScoreBand[],
): ScoreBand {
  return bands.find((b) => percent <= b.max) ?? bands[bands.length - 1];
}

/** Closest /courses catalog slug for each assessment (same course at every score). */
export const RELATED_COURSE_BY_ASSESSMENT: Record<string, string> = {
  'ai-foundation': 'claude-ecosystem---chat-code-cowork',
  prompting: 'ai-mastery-for-working-professionals',
  agents: 'no-code-ai-agents-mastery-for-working-professionals',
  'vibe-coding': 'vibe-coding-mastery-for-working-professionals',
};

const CATALOG_DISPLAY_TITLES: Record<string, string> = {
  'claude-ecosystem---chat-code-cowork': 'Claude Ecosystem',
  'ai-mastery-for-working-professionals': 'AI Mastery for Working Professionals',
  'no-code-ai-agents-mastery-for-working-professionals': 'No-Code AI Agents Mastery',
  'vibe-coding-mastery-for-working-professionals': 'Vibe Coding Mastery',
};

export function catalogDisplayTitle(slug: string, fallback: string): string {
  return CATALOG_DISPLAY_TITLES[slug] ?? fallback;
}
