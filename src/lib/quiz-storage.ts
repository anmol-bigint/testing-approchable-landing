import type { Assessment } from '@/lib/assessments';

const STORAGE_PREFIX = 'approachable.quiz.';

export interface StoredQuiz {
  v: 1;
  slug: string;
  answers: number[];
  completedAt: string;
}

export function storageKey(slug: string): string {
  return `${STORAGE_PREFIX}${slug}`;
}

export function encodeAnswers(answers: number[]): string {
  return answers.join('');
}

export function validateAnswers(
  answers: unknown,
  assessment: Assessment,
): number[] | null {
  if (!Array.isArray(answers) || answers.length !== assessment.questions.length) {
    return null;
  }

  const parsed: number[] = [];
  for (let i = 0; i < answers.length; i++) {
    const n = answers[i];
    if (
      typeof n !== 'number' ||
      !Number.isInteger(n) ||
      n < 0 ||
      n >= assessment.questions[i].options.length
    ) {
      return null;
    }
    parsed.push(n);
  }
  return parsed;
}

export function decodeAnswersParam(
  param: string | null | undefined,
  assessment: Assessment,
): number[] | null {
  if (!param || !/^\d+$/.test(param)) return null;
  return validateAnswers(
    param.split('').map((digit) => Number(digit)),
    assessment,
  );
}

export function loadQuiz(assessment: Assessment): number[] | null {
  try {
    const raw = localStorage.getItem(storageKey(assessment.slug));
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredQuiz;
    if (data.v !== 1 || data.slug !== assessment.slug) return null;
    return validateAnswers(data.answers, assessment);
  } catch {
    return null;
  }
}

export function saveQuiz(assessment: Assessment, answers: number[]): void {
  try {
    const payload: StoredQuiz = {
      v: 1,
      slug: assessment.slug,
      answers,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey(assessment.slug), JSON.stringify(payload));
  } catch {
    // private browsing / quota
  }
}

export function clearQuiz(slug: string): void {
  try {
    localStorage.removeItem(storageKey(slug));
  } catch {
    // ignore
  }
}

export function readAnswersFromUrl(assessment: Assessment): number[] | null {
  if (typeof window === 'undefined') return null;
  return decodeAnswersParam(new URLSearchParams(window.location.search).get('a'), assessment);
}

export function writeAnswersToUrl(answers: number[]): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('a', encodeAnswers(answers));
  window.history.replaceState(window.history.state, '', url);
}

export function clearAnswersFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('a')) return;
  url.searchParams.delete('a');
  window.history.replaceState(window.history.state, '', url);
}
