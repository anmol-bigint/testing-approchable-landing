'use client';

import { useState, type MouseEvent } from 'react';
import DeleteSubmissionConfirmModal from '@/components/admin/DeleteSubmissionConfirmModal';
import { enquiryTypeLabel } from '@/lib/contact-inquiry';
import type { SubmissionRecord } from '@/lib/submissions-types';
import { isContactSubmission, isCorporateSubmission } from '@/lib/submissions-types';

type PendingDelete = {
  id: string;
  formType: string;
  label: string;
};

function formatSubmittedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="admin-field">
      <dt className="admin-field-label">{label}</dt>
      <dd className="admin-field-value">{value}</dd>
    </div>
  );
}

function SubmissionBadge({ label }: { label: string }) {
  return <span className="admin-submission-badge">{label}</span>;
}

function SubmissionChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`admin-submission-chevron${expanded ? ' is-expanded' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteSubmissionButton({
  label,
  deletingId,
  submissionId,
  disabled,
  onRequestDelete,
}: {
  label: string;
  deletingId: string | null;
  submissionId: string;
  disabled: boolean;
  onRequestDelete: () => void;
}) {
  const isDeleting = deletingId === submissionId;

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onRequestDelete();
  };

  return (
    <button
      type="button"
      className="admin-delete-btn"
      title="Delete submission"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Delete submission for ${label}`}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

function ContactSubmissionCard({
  submission,
  index,
  isExpanded,
  deletingId,
  deleteDisabled,
  onToggle,
  onRequestDelete,
}: {
  submission: Extract<SubmissionRecord, { formType: 'contact-inquiry' }>;
  index: number;
  isExpanded: boolean;
  deletingId: string | null;
  deleteDisabled: boolean;
  onToggle: () => void;
  onRequestDelete: (pending: PendingDelete) => void;
}) {
  const label = submission.name || submission.email || 'this contact';

  return (
    <li className={`admin-submission-card${isExpanded ? ' is-expanded' : ''}`}>
      <div
        className="admin-submission-header"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="admin-submission-num">{index + 1}</div>
        <div className="admin-submission-summary">
          <div className="admin-submission-title-row">
            <span className="admin-submission-company">{submission.name || 'Unknown contact'}</span>
            <SubmissionBadge label={enquiryTypeLabel(submission.enquiryType)} />
          </div>
          <div className="admin-submission-meta">
            {submission.organization && <span>{submission.organization}</span>}
            {submission.email && (
              <a
                href={`mailto:${submission.email}`}
                className="admin-submission-email"
                onClick={(event) => event.stopPropagation()}
              >
                {submission.email}
              </a>
            )}
          </div>
        </div>
        <div className="admin-submission-actions">
          <DeleteSubmissionButton
            label={label}
            submissionId={submission.id}
            deletingId={deletingId}
            disabled={deleteDisabled}
            onRequestDelete={() =>
              onRequestDelete({
                id: submission.id,
                formType: submission.formType,
                label,
              })
            }
          />
          <time className="admin-submission-date" dateTime={submission.submittedAt}>
            {formatSubmittedAt(submission.submittedAt)}
          </time>
          <SubmissionChevron expanded={isExpanded} />
        </div>
      </div>

      {isExpanded && (
        <div className="admin-submission-details">
          <dl className="admin-submission-body">
            <Field label="Phone" value={submission.phone} />
            <Field label="Organization" value={submission.organization} />
            <Field label="Enquiry type" value={enquiryTypeLabel(submission.enquiryType)} />
          </dl>

          {submission.message && (
            <div className="admin-submission-requirements">
              <div className="admin-field-label">Message</div>
              <p>{submission.message}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function CorporateSubmissionCard({
  submission,
  index,
  isExpanded,
  deletingId,
  deleteDisabled,
  onToggle,
  onRequestDelete,
}: {
  submission: Extract<SubmissionRecord, { formType: 'corporate-training-inquiry' }>;
  index: number;
  isExpanded: boolean;
  deletingId: string | null;
  deleteDisabled: boolean;
  onToggle: () => void;
  onRequestDelete: (pending: PendingDelete) => void;
}) {
  const label = submission.company || submission.contactName || 'this inquiry';

  return (
    <li className={`admin-submission-card${isExpanded ? ' is-expanded' : ''}`}>
      <div
        className="admin-submission-header"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="admin-submission-num">{index + 1}</div>
        <div className="admin-submission-summary">
          <div className="admin-submission-title-row">
            <span className="admin-submission-company">{submission.company || 'Unknown company'}</span>
            <SubmissionBadge label="Team Training" />
          </div>
          <div className="admin-submission-meta">
            {submission.contactName && <span>{submission.contactName}</span>}
            {submission.email && (
              <a
                href={`mailto:${submission.email}`}
                className="admin-submission-email"
                onClick={(event) => event.stopPropagation()}
              >
                {submission.email}
              </a>
            )}
          </div>
        </div>
        <div className="admin-submission-actions">
          <DeleteSubmissionButton
            label={label}
            submissionId={submission.id}
            deletingId={deletingId}
            disabled={deleteDisabled}
            onRequestDelete={() =>
              onRequestDelete({
                id: submission.id,
                formType: submission.formType,
                label,
              })
            }
          />
          <time className="admin-submission-date" dateTime={submission.submittedAt}>
            {formatSubmittedAt(submission.submittedAt)}
          </time>
          <SubmissionChevron expanded={isExpanded} />
        </div>
      </div>

      {isExpanded && (
        <div className="admin-submission-details">
          <dl className="admin-submission-body">
            <Field label="Phone" value={submission.phone} />
            <Field label="Team size" value={submission.teamSize} />
            <Field label="Industry" value={submission.industry} />
            <Field label="Timing" value={submission.timing} />
          </dl>

          {submission.requirements && (
            <div className="admin-submission-requirements">
              <div className="admin-field-label">Requirements</div>
              <p>{submission.requirements}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function SubmissionsList({
  submissions,
  variant,
  deletingId = null,
  onDelete,
}: {
  submissions: SubmissionRecord[];
  variant: 'contact' | 'corporate';
  deletingId?: string | null;
  onDelete?: (id: string, formType: string) => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const handleDelete = onDelete ?? (async () => {});
  const deleteDisabled = Boolean(deletingId) || pendingDelete !== null;

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await handleDelete(pendingDelete.id, pendingDelete.formType);
      setPendingDelete(null);
    } catch {
      setPendingDelete(null);
    }
  };

  if (submissions.length === 0) {
    return (
      <p className="admin-empty">
        {variant === 'contact'
          ? 'No contact form submissions yet.'
          : 'No team training inquiries yet.'}
      </p>
    );
  }

  return (
    <>
      <ul className="admin-submissions-list">
        {submissions.map((submission, index) => {
          const isExpanded = expandedId === submission.id;
          const onToggle = () => setExpandedId(isExpanded ? null : submission.id);

          if (variant === 'contact' && isContactSubmission(submission)) {
            return (
              <ContactSubmissionCard
                key={submission.id}
                submission={submission}
                index={index}
                isExpanded={isExpanded}
                deletingId={deletingId}
                deleteDisabled={deleteDisabled}
                onToggle={onToggle}
                onRequestDelete={setPendingDelete}
              />
            );
          }
          if (variant === 'corporate' && isCorporateSubmission(submission)) {
            return (
              <CorporateSubmissionCard
                key={submission.id}
                submission={submission}
                index={index}
                isExpanded={isExpanded}
                deletingId={deletingId}
                deleteDisabled={deleteDisabled}
                onToggle={onToggle}
                onRequestDelete={setPendingDelete}
              />
            );
          }
          return null;
        })}
      </ul>

      <DeleteSubmissionConfirmModal
        open={pendingDelete !== null}
        label={pendingDelete?.label ?? ''}
        loading={pendingDelete !== null && deletingId === pendingDelete.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
