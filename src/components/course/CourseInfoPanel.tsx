'use client';

import type { CourseContent } from '@/lib/course-content';

interface CourseInfoPanelProps {
  course: CourseContent;
}

export default function CourseInfoPanel({ course }: CourseInfoPanelProps) {
  const price = course.pricing.inr;
  const isFree = course.isFree ?? false;

  return (
    <aside className="course-info-panel card-elevated">
      <div className="panel-body">
        <a className="btn-primary btn-block" href={course.purchaseUrl}>
          {isFree ? 'Start learning' : 'Enroll Now'}
        </a>
        <ul className="panel-details">
          <li>
            <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></svg>
            <span className="panel-label">Skill Level</span>
            <strong className="panel-value">{course.metadata.skillLevel}</strong>
          </li>
          <li>
            <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></svg>
            <span className="panel-label">Language</span>
            <strong className="panel-value">{course.metadata.language}</strong>
          </li>
          <li>
            <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
            <span className="panel-label">Certificate</span>
            <div className="panel-value-stack">
              <strong className="panel-value">{course.metadata.certificateAvailable ? 'Available' : 'Not available'}</strong>
              {course.metadata.sampleCertificateUrl && (
                <a href={course.metadata.sampleCertificateUrl} target="_blank" rel="noopener noreferrer" className="panel-sample-link">
                  View sample certificate
                </a>
              )}
            </div>
          </li>
          <li>
            <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></svg>
            <span className="panel-label">Fees</span>
            <strong className="panel-value">
              {isFree ? (
                'Free'
              ) : (
                <>
                  {price.original !== price.current && <s>{price.original}</s>} {price.current}
                </>
              )}
            </strong>
          </li>
          <li>
            <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
            <span className="panel-label">Type</span>
            <strong className="panel-value">{course.metadata.type}</strong>
          </li>
        </ul>
        <div className="panel-summary">
          <h3 className="panel-summary-title">What&apos;s Included</h3>
          <ul className="panel-summary-list">
            {course.inclusions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="panel-summary">
          <h3 className="panel-summary-title">Tools we will use in this course</h3>
          <ul className="panel-summary-list">
            {course.tools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
