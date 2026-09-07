import { del, list } from '@vercel/blob';
import { blobOptions } from '@/lib/blob-client';
import {
  BLOB_FOLDERS,
  contactDeleteCandidates,
  corporateDeleteCandidates,
  isLegacyFlatBlobPath,
  LEGACY_CONTACT_FOLDER,
} from '@/lib/blob-paths';

export const CONTACT_FORM_TYPE = 'contact-inquiry';
export const CORPORATE_FORM_TYPE = 'corporate-training-inquiry';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type DeletableFormType = typeof CONTACT_FORM_TYPE | typeof CORPORATE_FORM_TYPE;

type ListedBlob = {
  pathname: string;
  url: string;
  downloadUrl: string;
};

export function isValidSubmissionId(id: string): boolean {
  return UUID_RE.test(id);
}

export function isDeletableFormType(formType: string): formType is DeletableFormType {
  return formType === CONTACT_FORM_TYPE || formType === CORPORATE_FORM_TYPE;
}

export function submissionDeleteCandidates(id: string, formType: DeletableFormType): string[] {
  return formType === CONTACT_FORM_TYPE
    ? contactDeleteCandidates(id)
    : corporateDeleteCandidates(id);
}

function searchPrefixesForFormType(formType: DeletableFormType): string[] {
  if (formType === CONTACT_FORM_TYPE) {
    return [`${BLOB_FOLDERS.contact}/`, `${LEGACY_CONTACT_FOLDER}/`];
  }
  return [`${BLOB_FOLDERS.corporate}/`, `${BLOB_FOLDERS.legacy}/`];
}

async function listBlobsWithPrefix(prefix: string): Promise<ListedBlob[]> {
  const options = blobOptions();
  const blobs: ListedBlob[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix, cursor, ...options });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function findSubmissionBlob(
  id: string,
  formType: DeletableFormType,
): Promise<ListedBlob | null> {
  const candidates = new Set(submissionDeleteCandidates(id, formType));
  const searchPrefixes = searchPrefixesForFormType(formType);

  for (const prefix of searchPrefixes) {
    const blobs = await listBlobsWithPrefix(prefix);
    const match = blobs.find((blob) => {
      if (!candidates.has(blob.pathname)) return false;
      if (formType === CORPORATE_FORM_TYPE && prefix === `${BLOB_FOLDERS.legacy}/`) {
        return isLegacyFlatBlobPath(blob.pathname);
      }
      return true;
    });
    if (match) return match;
  }

  return null;
}

export async function deleteSubmissionBlob(
  id: string,
  formType: DeletableFormType,
): Promise<string> {
  const blob = await findSubmissionBlob(id, formType);
  if (!blob) {
    throw new Error('Submission not found');
  }

  const deleteUrl = blob.url || blob.downloadUrl;
  await del(deleteUrl, blobOptions());

  return blob.pathname;
}
