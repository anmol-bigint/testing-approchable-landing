'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SubmissionsList from '@/components/admin/SubmissionsList';
import SubscribersList from '@/components/admin/SubscribersList';
import type { CorporateInquiryRecord } from '@/lib/corporate-inquiry';
import type { ContactInquiryRecord } from '@/lib/contact-inquiry';
import type { BlogSubscriber } from '@/lib/subscribers';

type TabId = 'contact' | 'corporate' | 'subscribers';

type SubmissionsTabsProps = {
  contactSubmissions: ContactInquiryRecord[];
  corporateSubmissions: CorporateInquiryRecord[];
  blogSubscribers: BlogSubscriber[];
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'contact', label: 'Contact Us' },
  { id: 'corporate', label: 'Team Training' },
  { id: 'subscribers', label: 'Blog Subscribers' },
];

export default function SubmissionsTabs({
  contactSubmissions,
  corporateSubmissions,
  blogSubscribers,
}: SubmissionsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('contact');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tabCounts: Record<TabId, number> = {
    contact: contactSubmissions.length,
    corporate: corporateSubmissions.length,
    subscribers: blogSubscribers.length,
  };

  const activeCount = tabCounts[activeTab];
  const adminSecret = searchParams.get('secret');

  const authHeaders = (): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (adminSecret) {
      headers['x-admin-secret'] = adminSecret;
    }
    return headers;
  };

  const handleDeleteSubmission = async (id: string, formType: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch('/api/admin/submissions/delete', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ id, formType }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to delete submission');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    setDeletingEmail(email);
    setError(null);

    try {
      const response = await fetch('/api/admin/subscribers/delete', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to delete subscriber');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber');
    } finally {
      setDeletingEmail(null);
    }
  };

  return (
    <div className="admin-submissions-tabs">
      <div className="admin-tabs" role="tablist" aria-label="Submission types">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              className={`admin-tab${isActive ? ' admin-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="admin-tab-count">{tabCounts[tab.id]}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-submissions-count">
        {activeCount} {activeTab === 'subscribers' ? 'subscriber' : 'submission'}
        {activeCount === 1 ? '' : 's'}
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="admin-tab-panel"
      >
        {activeTab === 'subscribers' ? (
          <SubscribersList
            subscribers={blogSubscribers}
            deletingEmail={deletingEmail}
            onDelete={handleDeleteSubscriber}
          />
        ) : (
          <SubmissionsList
            key={activeTab}
            submissions={activeTab === 'contact' ? contactSubmissions : corporateSubmissions}
            variant={activeTab}
            deletingId={deletingId}
            onDelete={handleDeleteSubmission}
          />
        )}
      </div>
    </div>
  );
}
