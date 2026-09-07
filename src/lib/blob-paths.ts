/** Blog newsletter subscribers — single JSON array file */
export const SUBSCRIBERS_BLOB_PATH = 'subscribers/emails.json';

export const BLOB_FOLDERS = {
  contact: 'contact',
  corporate: 'submissions/corporate',
  legacy: 'submissions',
} as const;

/** Pre-migration contact path; read/delete only, not a write target */
export const LEGACY_CONTACT_FOLDER = 'submissions/contact';

export type SubmissionFolder = keyof typeof BLOB_FOLDERS;

export function submissionBlobPath(folder: SubmissionFolder, id: string): string {
  if (folder === 'legacy') {
    return `${BLOB_FOLDERS.legacy}/${id}.json`;
  }
  return `${BLOB_FOLDERS[folder]}/${id}.json`;
}

export function contactDeleteCandidates(id: string): string[] {
  return [
    `${BLOB_FOLDERS.contact}/${id}.json`,
    `${LEGACY_CONTACT_FOLDER}/${id}.json`,
  ];
}

export function corporateDeleteCandidates(id: string): string[] {
  return [
    `${BLOB_FOLDERS.corporate}/${id}.json`,
    `${BLOB_FOLDERS.legacy}/${id}.json`,
  ];
}

/** Legacy flat files saved before folder separation, e.g. submissions/uuid.json */
export function isLegacyFlatBlobPath(pathname: string): boolean {
  return /^submissions\/[^/]+\.json$/.test(pathname);
}
