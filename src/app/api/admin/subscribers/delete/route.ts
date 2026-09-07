import { NextRequest, NextResponse } from 'next/server';
import { getProvidedAdminSecret, isAdminAuthorized } from '@/lib/admin-auth';
import { deleteBlogSubscriber } from '@/lib/subscribers';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const secret = getProvidedAdminSecret(req);
  if (!isAdminAuthorized(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await deleteBlogSubscriber(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Subscriber not found';
    if (message === 'Subscriber not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('delete subscriber error:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
