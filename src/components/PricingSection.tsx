'use client';

import { useEffect, useState } from 'react';
import { COHORT } from '@/lib/cohort-config';
import { getCohortDisplay } from '@/lib/cohort-price';
import { trackCTA } from '@/lib/analytics';
import { usePricingCurrency } from '@/components/PricingCurrencyProvider';

function getTimeLeft(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
    mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
  };
}

const BONUS_STRIKES = {
  mastery: { INR: '₹1,500', USD: '$70' },
  n8n: { INR: '₹3,000', USD: '$99' },
} as const;

export default function PricingSection() {
  const { currency } = usePricingCurrency();
  const target = new Date(COHORT.priceIncreaseAt).getTime();
  const [isLate, setIsLate] = useState(() => Date.now() >= target);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));
  const display = getCohortDisplay(currency, isLate);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(target);
      setTimeLeft(tl);
      if (!tl) {
        setIsLate(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <section id="pricing">
      <div className="container-max" style={{ maxWidth: 680 }}>
        <div className="section-label" style={{ textAlign: 'center' }}>Pricing</div>
        <div className="section-title" style={{ textAlign: 'center' }}>One cohort. One price.</div>
        <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
          Small non-refundable fee keeps the group serious. Every seat is reserved only after payment.
        </p>

        <div className="pricing-card">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span
              className={`price-tagline${isLate ? ' price-tagline--expired' : ''}`}
              style={{ display: 'inline-block' }}
            >
              🚀 EARLY BIRD price — save 50%
            </span>
          </div>

          <div className="price-countdown">
            {timeLeft ? (
              <>
                Price goes up on {COHORT.priceIncreaseDateShort} in{' '}
                <strong>
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
                </strong>
              </>
            ) : (
             ''
            )}
          </div>

          <div className="pricing-head">
            <div>
              <span className="price-original">{display.original}</span>
              <span className="price-main">{display.current}</span>
            </div>
            {display.tagline ? <div className="price-sub">{display.tagline}</div> : null}
          </div>

          <div className="pricing-bonus">
            <span className="pricing-bonus-icon" aria-hidden="true">🎁</span>
            <div>
              <span className="pricing-bonus-label">Free bonus</span>
              <div className="pricing-bonus-title">
                <span className="pricing-bonus-strike">{BONUS_STRIKES.mastery[currency]}</span>AI Mastery for Working Professionals
              </div>
              <div className="pricing-bonus-desc">
                A self-paced course on weaving AI into your daily work &mdash; included free with this cohort, yours to keep even after it ends.
              </div>
            </div>
          </div>

          <div className="pricing-bonus">
            <span className="pricing-bonus-icon" aria-hidden="true">🎁</span>
            <div>
              <span className="pricing-bonus-label">Free bonus live session</span>
              <div className="pricing-bonus-title">
                <span className="pricing-bonus-strike">{BONUS_STRIKES.n8n[currency]}</span>Build AI Apps & AI Agents with n8n
              </div>
              <div className="pricing-bonus-desc">
                A live session on adding intelligence to your applications, and building AI agents with n8n&mdash; included free with this cohort.
              </div>
            </div>
          </div>

          <div className="pricing-divider" />

          <div className="pricing-also-included-label" style={{ marginBottom: 10 }}>What you&rsquo;ll walk away with</div>
          <ul className="pricing-benefits">
            <li className="pricing-benefit">
              <span className="pricing-benefit-check">✓</span>
              <div className="pricing-benefit-title">AI workflows for your actual work</div>
            </li>
            <li className="pricing-benefit">
              <span className="pricing-benefit-check">✓</span>
              <div className="pricing-benefit-title">A real project built with mentor guidance</div>
            </li>
            <li className="pricing-benefit">
              <span className="pricing-benefit-check">✓</span>
              <div className="pricing-benefit-title">Practical Claude skills you can use immediately</div>
            </li>
          </ul>

          <div className="pricing-callout">
            <span className="pricing-callout-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <path d="M2 13h20" />
              </svg>
            </span>
            <div>
              <div className="pricing-callout-title">Bring your own use case</div>
              <div className="pricing-callout-desc">Your work becomes your classroom. We&rsquo;ll help you turn it into an AI workflow.</div>
            </div>
          </div>

          <div className="pricing-also-included-label">Also included</div>
          <p className="pricing-also-included">
            Session recordings &nbsp;·&nbsp; Templates &amp; guides &nbsp;·&nbsp; Learning platform &nbsp;·&nbsp; WhatsApp community &nbsp;·&nbsp; Mentor access
          </p>

          <a
            href={COHORT.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pricing-cta"
            onClick={() => trackCTA('Pricing CTA', 'Pricing')}
          >
            Claim My Seat + Free Bonus Courses →
          </a>
          <p className="pricing-note">
            Only {COHORT.seatsLeft} seats · Starts {COHORT.date} · {COHORT.time}
          </p>
        </div>
      </div>
    </section>
  );
}
