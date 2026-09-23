import Link from 'next/link';
import { marked } from 'marked';
import Header from '@/components/Header';
import { getPrivacyPolicy } from '@/lib/legal';
import { buildPageMetadata } from '@/lib/seo/metadata';

const PRIVACY_DESCRIPTION =
  'Privacy policy for Approachable — how we collect, use, share, and protect your data.';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description: PRIVACY_DESCRIPTION,
  path: '/privacy',
  ogImageAlt: 'Approachable Privacy Policy',
});

export default async function PrivacyPage() {
  const privacyPolicy = getPrivacyPolicy();
  const html = await marked(privacyPolicy.body);

  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="container-max">
          <article className="legal-page-article prose-content" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="legal-page-links">
            <Link href="/terms">Read Terms of Service</Link>
            <Link href="/">Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
