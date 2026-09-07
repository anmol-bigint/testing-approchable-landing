'use client';

import { useState } from 'react';
import DeleteSubmissionConfirmModal from '@/components/admin/DeleteSubmissionConfirmModal';
import type { BlogSubscriber } from '@/lib/subscribers';

function formatSubscribedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function SubscribersList({
  subscribers,
  deletingEmail = null,
  onDelete,
}: {
  subscribers: BlogSubscriber[];
  deletingEmail?: string | null;
  onDelete?: (email: string) => Promise<void>;
}) {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const handleDelete = onDelete ?? (async () => {});
  const deleteDisabled = Boolean(deletingEmail) || pendingEmail !== null;

  const handleConfirmDelete = async () => {
    if (!pendingEmail) return;

    try {
      await handleDelete(pendingEmail);
      setPendingEmail(null);
    } catch {
      setPendingEmail(null);
    }
  };

  if (subscribers.length === 0) {
    return <p className="admin-empty">No blog subscribers yet.</p>;
  }

  return (
    <>
      <ul className="admin-submissions-list">
        {subscribers.map((subscriber, index) => {
          const isDeleting = deletingEmail === subscriber.email;

          return (
            <li key={subscriber.email} className="admin-submission-card">
              <div className="admin-submission-header">
                <div className="admin-submission-num">{index + 1}</div>
                <div className="admin-submission-summary">
                  <div className="admin-submission-title-row">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="admin-submission-company admin-submission-email"
                    >
                      {subscriber.email}
                    </a>
                    <span className="admin-submission-badge">Blog Subscriber</span>
                  </div>
                </div>
                <div className="admin-submission-actions">
                  <button
                    type="button"
                    className="admin-delete-btn"
                    title="Remove subscriber"
                    disabled={deleteDisabled}
                    onClick={() => setPendingEmail(subscriber.email)}
                    aria-label={`Delete subscriber ${subscriber.email}`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <time className="admin-submission-date" dateTime={subscriber.subscribedAt}>
                    {formatSubscribedAt(subscriber.subscribedAt)}
                  </time>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <DeleteSubmissionConfirmModal
        open={pendingEmail !== null}
        label={pendingEmail ?? ''}
        loading={pendingEmail !== null && deletingEmail === pendingEmail}
        onCancel={() => setPendingEmail(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
