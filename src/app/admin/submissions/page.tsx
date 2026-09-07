import type { Metadata } from 'next';
import Header from '@/components/Header';
import AdminSecretForm from '@/components/admin/AdminSecretForm';
import SubmissionsTabs from '@/components/admin/SubmissionsTabs';
import { adminSecretRequired, isAdminAuthorized } from '@/lib/admin-auth';
import { getContactSubmissions, getCorporateSubmissions } from '@/lib/submissions';
import { getBlogSubscribers } from '@/lib/subscribers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Form submissions',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ secret?: string }>;
};

export default async function AdminSubmissionsPage({ searchParams }: PageProps) {
  const { secret } = await searchParams;
  const authorized = isAdminAuthorized(secret);

  if (adminSecretRequired() && !authorized) {
    return (
      <>
        <Header coursePage />
        <main>
          <section className="courses-page admin-submissions-page">
            <div className="container-max">
              <div className="courses-hero">
                <div className="section-label">Admin</div>
                <h1 className="section-title">Form submissions</h1>
                <p className="section-sub" style={{ margin: '0 auto' }}>
                  Contact and team training inquiries, plus blog subscribers.
                </p>
              </div>

              <div className="admin-gate">
                <p className="admin-gate-text">Enter the admin secret to view form submissions.</p>
                <AdminSecretForm />
                {secret ? <p className="admin-error">Invalid secret. Try again.</p> : null}
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  let contactSubmissions: Awaited<ReturnType<typeof getContactSubmissions>> = [];
  let corporateSubmissions: Awaited<ReturnType<typeof getCorporateSubmissions>> = [];
  let blogSubscribers: Awaited<ReturnType<typeof getBlogSubscribers>> = [];
  let loadError: string | null = null;

  try {
    [contactSubmissions, corporateSubmissions, blogSubscribers] = await Promise.all([
      getContactSubmissions(),
      getCorporateSubmissions(),
      getBlogSubscribers(),
    ]);
  } catch (error) {
    console.error('Failed to load submissions:', error);
    loadError =
      'Could not load submissions. Connect Vercel Blob to this project (Storage → Blob → Connect), or set BLOB_READ_WRITE_TOKEN in Vercel environment variables.';
  }

  return (
    <>
      <Header coursePage />
      <main>
        <section className="courses-page admin-submissions-page">
          <div className="container-max">
            <div className="courses-hero">
              <div className="section-label">Admin</div>
              <h1 className="section-title">Form submissions</h1>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                Contact and team training inquiries, plus blog subscribers.
              </p>
            </div>

            {loadError ? (
              <p className="admin-error">{loadError}</p>
            ) : (
              <div className="admin-submissions-wrap">
                <SubmissionsTabs
                  contactSubmissions={contactSubmissions}
                  corporateSubmissions={corporateSubmissions}
                  blogSubscribers={blogSubscribers}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
