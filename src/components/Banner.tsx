'use client';

import { COHORT } from '@/lib/cohort-config';
import { trackCTA } from '@/lib/analytics';

export default function Banner() {
  let content: React.ReactNode;

  if (COHORT.state === 'soldout') {
    content = (
      <>
        🛑 {COHORT.dateShort} Cohort is full &nbsp;•&nbsp; Join the waitlist for the next batch{' '}
        <a href="#signup">Join Waitlist</a>
      </>
    );
  } else if (COHORT.state === 'early') {
    content = (
      <>
        {COHORT.prevCohortDate} cohort filled all {COHORT.seatsTotal} seats &nbsp;•&nbsp; Early seats open for{' '}
        {COHORT.dateShort} cohort{' '}
        <a href="#pricing" onClick={() => trackCTA('Banner', 'Top')}>
          Reserve Seat →
        </a>
      </>
    );
  } else {
    content = (
      <>
        🔥 Cohort 8 starts {COHORT.dateShort} &nbsp;•&nbsp; Only {COHORT.seatsLeft} seats left{' '}
        <a href="#pricing" onClick={() => trackCTA('Banner', 'Top')}>
          Reserve Seat →
        </a>
      </>
    );
  }

  return <div id="topBanner">{content}</div>;
}
