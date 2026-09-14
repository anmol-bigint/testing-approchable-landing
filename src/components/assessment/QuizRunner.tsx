'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Assessment, AssessmentConfig, QuizRec } from '@/lib/assessments';
import { getScoreBand } from '@/lib/assessments';
import { COHORT } from '@/lib/cohort-config';
import {
  clearAnswersFromUrl,
  clearQuiz,
  loadQuiz,
  readAnswersFromUrl,
  saveQuiz,
  validateAnswers,
  writeAnswersToUrl,
} from '@/lib/quiz-storage';
import styles from '@/app/assessment/quiz/[slug]/quiz.module.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const RING = 2 * Math.PI * 66;

interface QuizRunnerProps {
  assessment: Assessment;
  config: AssessmentConfig;
  relatedCourse: QuizRec | null;
}

function isCohortRec(rec: QuizRec): boolean {
  return rec.tag.toLowerCase().includes('cohort') || rec.url === COHORT.formUrl || rec.url === '/';
}

function getNextIntro(): string {
  return 'Recommended: live cohort — close the gap with a mentor and a small group.';
}

function RecCard({ rec, primary }: { rec: QuizRec; primary: boolean }) {
  const cohort = isCohortRec(rec);
  const href = cohort ? (COHORT.state === 'soldout' ? '/' : COHORT.formUrl) : rec.url;
  const external = href.startsWith('http');
  const cta = cohort
    ? COHORT.state === 'soldout'
      ? 'See the cohort →'
      : 'Reserve a seat →'
    : rec.tag.toLowerCase().includes('free')
      ? 'View free course →'
      : 'View course →';

  const className = `${styles.rec} ${primary ? styles.recPrimary : ''}`;
  const inner = (
    <>
      <span className={styles.tag}>{rec.tag}</span>
      <h3>{rec.title}</h3>
      <p>{rec.desc}</p>
      {cohort && (
        <ul className={styles.recMeta}>
          <li>{COHORT.priceIndia} · {COHORT.priceTaglineIndia}</li>
          <li>
            Next session {COHORT.dateShort}
            {COHORT.state === 'soldout' ? ' · currently waitlist' : ` · ${COHORT.seatsLeft} seats left`}
          </li>
        </ul>
      )}
      <span className={primary ? styles.recCta : styles.recLink}>{cta}</span>
    </>
  );

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {inner}
    </Link>
  );
}

export default function QuizRunner({ assessment, config, relatedCourse }: QuizRunnerProps) {
  const total = assessment.questions.length;
  const [ready, setReady] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(total).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [openReview, setOpenReview] = useState<number | null>(null);
  const [ringOffset, setRingOffset] = useState(RING);
  const ringAnimated = useRef(false);

  const currentQuestion = assessment.questions[questionIndex];

  const animateRing = useCallback((pct: number) => {
    if (ringAnimated.current) return;
    ringAnimated.current = true;
    requestAnimationFrame(() => {
      setTimeout(() => {
        setRingOffset(RING * (1 - pct / 100));
      }, 120);
    });
  }, []);

  const applyCompleted = useCallback(
    (completed: number[]) => {
      const correct = completed.reduce<number>(
        (sum, answer, n) =>
          sum + (answer === assessment.questions[n].answer ? 1 : 0),
        0,
      );
      setAnswers(completed);
      setQuestionIndex(total - 1);
      setPicked(completed[total - 1] ?? null);
      setShowResults(true);
      animateRing(Math.round((correct / total) * 100));
    },
    [animateRing, assessment.questions, total],
  );

  useEffect(() => {
    const fromUrl = readAnswersFromUrl(assessment);
    const restored = fromUrl ?? loadQuiz(assessment);

    if (restored) {
      if (fromUrl) saveQuiz(assessment, fromUrl);
      else writeAnswersToUrl(restored);
      applyCompleted(restored);
    }

    setReady(true);
    // Restore once per quiz mount; slug changes remount via key on QuizRunner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment.slug]);

  const resetQuiz = useCallback(() => {
    clearQuiz(assessment.slug);
    clearAnswersFromUrl();
    setQuestionIndex(0);
    setPicked(null);
    setAnswers(new Array(total).fill(null));
    setShowResults(false);
    setOpenReview(null);
    setRingOffset(RING);
    ringAnimated.current = false;
    window.scrollTo(0, 0);
  }, [assessment.slug, total]);

  const finishQuiz = useCallback(
    (finalAnswers: (number | null)[]) => {
      const completed = validateAnswers(finalAnswers, assessment);
      if (completed) {
        saveQuiz(assessment, completed);
        writeAnswersToUrl(completed);
      }

      const correct = finalAnswers.reduce<number>(
        (sum, answer, n) =>
          sum + (answer === assessment.questions[n].answer ? 1 : 0),
        0,
      );
      setShowResults(true);
      animateRing(Math.round((correct / total) * 100));
    },
    [animateRing, assessment, total],
  );

  const handleNextClick = useCallback(() => {
    if (picked === null || showResults) return;

    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = picked;
    setAnswers(nextAnswers);

    if (questionIndex === total - 1) {
      finishQuiz(nextAnswers);
    } else {
      setQuestionIndex((i) => i + 1);
      setPicked(null);
    }
  }, [picked, showResults, answers, questionIndex, total, finishQuiz]);

  useEffect(() => {
    if (showResults) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= currentQuestion.options.length) {
        setPicked(n - 1);
      } else if (e.key === 'Enter' && picked !== null) {
        e.preventDefault();
        handleNextClick();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showResults, currentQuestion, picked, handleNextClick]);

  const results = useMemo(() => {
    if (!showResults) return null;
    const correct = answers.reduce<number>(
      (sum, answer, n) =>
        sum + (answer === assessment.questions[n].answer ? 1 : 0),
      0,
    );
    const pct = Math.round((correct / total) * 100);
    const band = getScoreBand(pct, config.bands);
    return { correct, pct, band };
  }, [showResults, answers, assessment.questions, total, config.bands]);

  const getTickClass = (n: number) => {
    if (showResults && answers[n] !== null) {
      return answers[n] === assessment.questions[n].answer
        ? styles.tickRight
        : styles.tickWrong;
    }
    if (answers[n] !== null) return styles.tickDone;
    if (n === questionIndex) return styles.tickCurrent;
    return '';
  };

  const nextButtonLabel =
    questionIndex === total - 1 ? 'See results →' : 'Next question →';

  return (
    <main className={styles.page}>
      <div className={styles.quizBar}>
        <div className={styles.quizBarInner}>
          <span className={styles.quizBarName}>
            {assessment.title} <span>assessment</span>
          </span>
          <span className={styles.ticks}>
            {Array.from({ length: total }, (_, n) => (
              <i key={n} className={`${styles.tick} ${getTickClass(n)}`} />
            ))}
          </span>
          {!showResults && (
            <span className={styles.quizCount}>
              {questionIndex + 1} / {total}
            </span>
          )}
          <Link className={styles.quizExit} href="/assessment">
            Exit
          </Link>
        </div>
      </div>

      {ready && currentQuestion && (
        <section className={styles.stage}>
          <div className={styles.narrow}>
            <p className={styles.qIndex}>
              Question {questionIndex + 1} of {total}
            </p>
            <h2 className={styles.qText}>{currentQuestion.q}</h2>
            <div className={styles.options}>
              {currentQuestion.options.map((text, n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.opt} ${picked === n ? styles.optPicked : ''}`}
                  disabled={showResults}
                  aria-label={`Option ${LETTERS[n]}: ${text}`}
                  onClick={() => !showResults && setPicked(n)}
                >
                  <span className={styles.optKey}>{LETTERS[n]}</span>
                  <span>{text}</span>
                </button>
              ))}
            </div>

            {!showResults && (
              <div className={styles.buttons}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  type="button"
                  disabled={picked === null}
                  onClick={handleNextClick}
                >
                  {nextButtonLabel}
                </button>
                <span className={styles.hint}>Tip: press 1–4 to choose, Enter to continue.</span>
              </div>
            )}

            {showResults && results && (
              <div className={styles.resultsBelow}>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreRing}>
                    <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
                      <circle className={styles.track} cx="75" cy="75" r="66" fill="none" strokeWidth="10" />
                      <circle
                        className={styles.fill}
                        cx="75"
                        cy="75"
                        r="66"
                        fill="none"
                        strokeWidth="10"
                        strokeDasharray={RING.toFixed(1)}
                        strokeDashoffset={ringOffset.toFixed(1)}
                      />
                    </svg>
                    <div className={styles.scoreVal}>{results.pct}%</div>
                  </div>
                  <div className={styles.scoreCopy}>
                    <div className={styles.sectionLabel}>{results.band.label}</div>
                    <h2>{results.band.title}</h2>
                    <p>{results.band.text}</p>
                    <p className={styles.scoreLine}>
                      {results.correct} of {total} correct on the {assessment.title} assessment.
                    </p>
                  </div>
                </div>

                <div className={styles.resultBlock}>
                  <h2>What to do next</h2>
                  <p className={styles.sub}>{getNextIntro()}</p>
                  <div className={styles.recs}>
                    {[assessment.recs[results.band.key]?.[0], relatedCourse]
                      .filter((rec): rec is QuizRec => Boolean(rec))
                      .map((rec, index) => (
                        <RecCard key={rec.url} rec={rec} primary={index === 0} />
                      ))}
                  </div>
                </div>

                <div className={styles.resultBlock}>
                  <h2>Your answers</h2>
                  <p className={styles.sub}>Open any question to see the correct answer and why.</p>
                  <div className={styles.review}>
                    {assessment.questions.map((q, n) => {
                      const ok = answers[n] === q.answer;
                      const isOpen = openReview === n;
                      return (
                        <div key={n} className={`${styles.rev} ${isOpen ? styles.revOpen : ''}`}>
                          <button
                            type="button"
                            className={styles.revBtn}
                            aria-expanded={isOpen}
                            onClick={() => setOpenReview(isOpen ? null : n)}
                          >
                            <span
                              className={`${styles.revFlag} ${ok ? styles.revFlagOk : styles.revFlagNo}`}
                            >
                              {ok ? '✓' : '✕'}
                            </span>
                            <span>{q.q}</span>
                            <span className={styles.revChev}>▾</span>
                          </button>
                          {isOpen && (
                            <div className={styles.revBody}>
                              <p>
                                <b>Correct answer:</b> {LETTERS[q.answer]} — {q.options[q.answer]}
                              </p>
                              {!ok && (
                                <p>
                                  <b>You chose:</b>{' '}
                                  {answers[n] === null
                                    ? 'nothing'
                                    : `${LETTERS[answers[n]!]} — ${q.options[answers[n]!]}`}
                                </p>
                              )}
                              {q.why && <p>{q.why}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.buttons}>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    type="button"
                    onClick={resetQuiz}
                  >
                    Retake this assessment
                  </button>
                  <Link className={`${styles.btn} ${styles.btnSecondary}`} href="/assessment">
                    Try another assessment
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
