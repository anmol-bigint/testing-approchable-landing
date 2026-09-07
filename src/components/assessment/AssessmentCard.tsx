import Link from 'next/link';
import styles from '@/app/assessment/assessment.module.css';

interface AssessmentCardProps {
  href: string;
  tag: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: number;
  level: string;
}

export default function AssessmentCard({
  href,
  tag,
  title,
  description,
  questionCount,
  minutes,
  level,
}: AssessmentCardProps) {
  return (
    <Link className={styles.quizCard} href={href}>
      <span className={styles.tag}>{tag}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.quizMeta}>
        <div>
          <span>Questions</span>
          <span>{questionCount}</span>
        </div>
        <div>
          <span>Time</span>
          <span>About {minutes} minutes</span>
        </div>
        <div>
          <span>Level</span>
          <span>{level}</span>
        </div>
      </div>
      <span className={styles.quizStart}>Start assessment →</span>
    </Link>
  );
}
