'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COHORT } from '@/lib/cohort-config';
import { trackCTA } from '@/lib/analytics';

export default function FloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      const pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct >= 0.55) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (pathname !== '/' || dismissed) return null;

  return (
    <div id="floatingCta" className={visible ? 'visible' : ''}>
      <div className="floating-inner">
        <div className="floating-text">
          🔥 Only {COHORT.seatsLeft} seats left · Cohort 8 starts {COHORT.dateShort}
        </div>
        <div className="floating-actions">
          <Link
            href="/#pricing"
            className="floating-cta-btn"
            onClick={() => trackCTA('Floating CTA', 'Float')}
          >
            Get One of {COHORT.seatsLeft} Seats →
          </Link>
          <button className="floating-close" onClick={() => setDismissed(true)}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
