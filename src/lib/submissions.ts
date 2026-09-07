import { get, list } from '@vercel/blob';
import type { CorporateInquiryRecord } from '@/lib/corporate-inquiry';
import type { ContactInquiryRecord } from '@/lib/contact-inquiry';
import {
  BLOB_FOLDERS,
  isLegacyFlatBlobPath,
  LEGACY_CONTACT_FOLDER,
  type SubmissionFolder,
} from '@/lib/blob-paths';
import type { SubmissionRecord } from '@/lib/submissions-types';
import { isContactSubmission, isCorporateSubmission } from '@/lib/submissions-types';
import { blobOptions } from '@/lib/blob-client';

async function readSubmission(pathname: string): Promise<SubmissionRecord | null> {
  const result = await get(pathname, { access: 'private', ...blobOptions() });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as SubmissionRecord;
}

function sortByNewest(submissions: SubmissionRecord[]): SubmissionRecord[] {
  return submissions.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
}

async function listFromPrefix(
  prefix: string,
  filterBlob?: (pathname: string) => boolean,
): Promise<SubmissionRecord[]> {
  const { blobs } = await list({ prefix, ...blobOptions() });
  const relevantBlobs = blobs.filter(
    (blob) => blob.pathname.endsWith('.json') && (!filterBlob || filterBlob(blob.pathname)),
  );

  const submissions = await Promise.all(
    relevantBlobs.map(async (blob) => {
      const record = await readSubmission(blob.pathname);
      if (record) return record;

      return {
        id: blob.pathname,
        formType: 'corporate-training-inquiry',
        submittedAt: blob.uploadedAt.toISOString(),
        company: '',
        contactName: '',
        email: '',
        phone: '',
        teamSize: '',
        industry: '',
        timing: '',
        requirements: '',
        meta: { source: 'unknown' },
      } satisfies CorporateInquiryRecord;
    }),
  );

  return sortByNewest(submissions);
}

async function listFromFolder(folder: SubmissionFolder): Promise<SubmissionRecord[]> {
  const prefix = `${BLOB_FOLDERS[folder]}/`;
  const filterBlob =
    folder === 'legacy' ? (pathname: string) => isLegacyFlatBlobPath(pathname) : undefined;
  return listFromPrefix(prefix, filterBlob);
}

export async function getContactSubmissions(): Promise<ContactInquiryRecord[]> {
  const [fromFolder, fromLegacyContact] = await Promise.all([
    listFromFolder('contact'),
    listFromPrefix(`${LEGACY_CONTACT_FOLDER}/`),
  ]);

  const byId = new Map<string, ContactInquiryRecord>();
  for (const record of [...fromFolder, ...fromLegacyContact]) {
    if (isContactSubmission(record)) {
      byId.set(record.id, record);
    }
  }

  return sortByNewest([...byId.values()]) as ContactInquiryRecord[];
}

export async function getCorporateSubmissions(): Promise<CorporateInquiryRecord[]> {
  const [fromFolder, legacy] = await Promise.all([
    listFromFolder('corporate'),
    listFromFolder('legacy'),
  ]);

  const legacyCorporate = legacy.filter(isCorporateSubmission);
  return sortByNewest([
    ...fromFolder.filter(isCorporateSubmission),
    ...legacyCorporate,
  ]) as CorporateInquiryRecord[];
}

export async function getSubmissions(): Promise<SubmissionRecord[]> {
  const [contact, corporate] = await Promise.all([getContactSubmissions(), getCorporateSubmissions()]);
  return sortByNewest([...contact, ...corporate]);
}

export type { SubmissionRecord, ContactInquiryRecord, CorporateInquiryRecord };
