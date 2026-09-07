import { NextRequest, NextResponse } from 'next/server';
import { getProvidedAdminSecret, isAdminAuthorized } from '@/lib/admin-auth';
import {
  deleteSubmissionBlob,
  isDeletableFormType,
  isValidSubmissionId,
} from '@/lib/submission-delete';

export async function POST(req: NextRequest) {
  const secret = getProvidedAdminSecret(req);
  if (!isAdminAuthorized(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id.trim() : '';
  const formType = typeof body?.formType === 'string' ? body.formType.trim() : '';

  if (!isValidSubmissionId(id)) {
    return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 });
  }

  if (!isDeletableFormType(formType)) {
    return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
  }

  try {
    const deletedPath = await deleteSubmissionBlob(id, formType);
    return NextResponse.json({ success: true, deletedPath });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submission not found';
    if (message === 'Submission not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('delete submission error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
