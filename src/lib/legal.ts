import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const LEGAL_DIR = path.join(process.cwd(), 'content/legal');

export type LegalDocument = {
  title: string;
  description: string;
  body: string;
};

function loadLegalDocument(filename: string, fallbackTitle: string, fallbackDescription: string): LegalDocument {
  const filePath = path.join(LEGAL_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    title: typeof data.title === 'string' ? data.title : fallbackTitle,
    description: typeof data.description === 'string' ? data.description : fallbackDescription,
    body: content,
  };
}

export function getPrivacyPolicy(): LegalDocument {
  return loadLegalDocument(
    'privacy.md',
    'Privacy Policy',
    'Privacy policy for Approachable — how we collect, use, and protect your data.',
  );
}

export function getTermsOfService(): LegalDocument {
  return loadLegalDocument(
    'terms.md',
    'Terms of Service',
    'Terms of service for Approachable — eligibility, payments, usage rules, and legal terms.',
  );
}
