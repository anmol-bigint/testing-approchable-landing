'use client';

import { useEffect, useRef, useState } from 'react';
import type { CourseContent } from '@/lib/course-content';

interface CourseStickyBarProps {
  course: CourseContent;
}

export default function CourseStickyBar({ course }: CourseStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const observerTarget = useRef<string>('course-hero');

  useEffect(() => {
    const hero = document.getElementById(observerTarget.current);
    if (!hero) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const price = course.pricing.inr;
  const isFree = course.isFree ?? false;

  return (
    <div id="sticky-pay" className={`sticky-pay${visible ? ' visible' : ''}`} aria-hidden={!visible}>
      <div className="sticky-pay-inner">
        <div className="sticky-pay-text">
          <p className="sticky-pay-title">{course.title}</p>
          <div className="price-row">
            {isFree ? (
              <span className="price-new">Free</span>
            ) : (
              <>
                {price.original !== price.current && <span className="price-old">{price.original}</span>}
                <span className="price-new">{price.current}</span>
                {course.pricing.discountPercent > 0 && (
                  <span className="discount-tag">{course.pricing.discountPercent}% off</span>
                )}
              </>
            )}
          </div>
        </div>
        <a className="btn-primary" href={course.purchaseUrl}>
          {isFree ? 'Start learning' : 'Enroll Now'}
        </a>
      </div>
    </div>
  );
}
