import Link from 'next/link';
import { marked } from 'marked';
import Header from '@/components/Header';
import { getTermsOfService } from '@/lib/legal';
import { buildPageMetadata } from '@/lib/seo/metadata';

const TERMS_DESCRIPTION =
  'Terms of service for Approachable — eligibility, payments, usage rules, and legal terms.';

export const metadata = buildPageMetadata({
  title: 'Terms of Service',
  description: TERMS_DESCRIPTION,
  path: '/terms',
  ogImageAlt: 'Approachable Terms of Service',
});

export default async function TermsPage() {
  const termsOfService = getTermsOfService();
  const html = await marked(termsOfService.body);

  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="container-max">
          <article className="legal-page-article prose-content" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="legal-page-links">
            <Link href="/privacy">Read Privacy Policy</Link>
            <Link href="/">Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
