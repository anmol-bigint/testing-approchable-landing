'use client';

import { useState } from 'react';

interface PromptFlipCardProps {
  badPrompt: string;
  goodPrompt: string;
  whyBetter: string;
  additionalTips?: string[];
  stepTitle: string;
  stepExplanation: string;
  stepNumber?: number;
  onBack: () => void;
  onNext: () => void;
  backDisabled: boolean;
  nextDisabled: boolean;
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1.1 2H15c.1-.8.5-1.5 1.1-2A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function PromptFlipCard({
  badPrompt,
  goodPrompt,
  whyBetter,
  additionalTips,
  stepTitle,
  stepExplanation,
  stepNumber,
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
}: PromptFlipCardProps) {
  const [userAttempt, setUserAttempt] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedGood, setCopiedGood] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(goodPrompt);
      setCopiedGood(true);
      setTimeout(() => setCopiedGood(false), 1800);
    } catch {
      setCopiedGood(false);
    }
  };

  return (
    <div className="pg-step">
      <div className="pg-step-head">
        {typeof stepNumber === 'number' && <span className="pg-step-index">Step {stepNumber}</span>}
        <h2>{stepTitle}</h2>
        <p>{stepExplanation}</p>
      </div>

      <div className="pg-grid">
        <div className="pg-column">
          <p className="pg-column-label">Reference</p>
          <section className="pg-card pg-card-bad">
            <span className="pg-badge pg-badge-bad">Bad Prompt</span>
            <pre>{badPrompt}</pre>
          </section>

          {additionalTips && additionalTips.length > 0 && (
            <section className="pg-tips">
              <h3>
                <LightbulbIcon />
                <span>Tips</span>
              </h3>
              <ul>
                {additionalTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="pg-column">
          <p className="pg-column-label">{isRevealed ? 'Suggested answer' : 'Your turn'}</p>
          {!isRevealed ? (
            <section className="pg-card">
              <span className="pg-badge pg-badge-neutral">Your Attempt</span>
              <label htmlFor="pg-attempt-input" className="pg-sr-only">
                Improve this prompt
              </label>
              <textarea
                id="pg-attempt-input"
                className="pg-textarea"
                rows={7}
                value={userAttempt}
                onChange={(event) => setUserAttempt(event.target.value)}
                placeholder="How would you improve this prompt? Type your version here..."
              />
              <button type="button" className="btn-primary pg-action" onClick={() => setIsRevealed(true)}>
                Reveal Suggested Prompt
              </button>
            </section>
          ) : (
            <div className="pg-reveal is-visible">
              {userAttempt.trim() && (
                <section className="pg-card">
                  <span className="pg-badge pg-badge-neutral">Your Version</span>
                  <pre>{userAttempt}</pre>
                </section>
              )}

              <section className="pg-card pg-card-good">
                <div className="pg-card-head">
                  <span className="pg-badge pg-badge-good">Good Prompt</span>
                  <button type="button" className="pg-copy" onClick={handleCopy}>
                    {copiedGood ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedGood ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre>{goodPrompt}</pre>
              </section>

              <section className="pg-card pg-card-why">
                <span className="pg-badge pg-badge-why">Why It Is Better</span>
                <p>{whyBetter}</p>
              </section>

              <button
                type="button"
                className="btn-secondary pg-try-again"
                onClick={() => {
                  setIsRevealed(false);
                  setUserAttempt('');
                  setCopiedGood(false);
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pg-nav">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={backDisabled}>
          <ChevronLeftIcon />
          <span>Previous</span>
        </button>
        <button type="button" className="btn-primary" onClick={onNext} disabled={nextDisabled}>
          <span>Next exercise</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
