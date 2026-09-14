import { randomUUID } from 'crypto';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import {
  FORM_TYPE,
  isHoneypotTriggered,
  validateCorporateInquiry,
  type CorporateInquiryRecord,
} from '@/lib/corporate-inquiry';
import { blobOptions } from '@/lib/blob-client';
import { submissionBlobPath } from '@/lib/blob-paths';
import { notifyCorporateInquiry } from '@/lib/notify-email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ success: true, message: 'Submission received' });
    }

    const validation = validateCorporateInquiry(body);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 },
      );
    }

    const id = randomUUID();
    const record: CorporateInquiryRecord = {
      id,
      formType: FORM_TYPE,
      submittedAt: new Date().toISOString(),
      ...validation.data,
      meta: {
        source: 'team-ai-training/inquiry',
        userAgent: req.headers.get('user-agent') ?? undefined,
      },
    };

    await put(submissionBlobPath('corporate', id), JSON.stringify(record, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      ...blobOptions(),
    });

    await notifyCorporateInquiry(record);

    return NextResponse.json({ success: true, message: 'Submission received' });
  } catch (error) {
    console.error('Error in submit-form handler:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' },
      { status: 500 },
    );
  }
}
