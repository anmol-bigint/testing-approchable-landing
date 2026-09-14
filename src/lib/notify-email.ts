import { Resend } from 'resend';
import { enquiryTypeLabel, type ContactInquiryRecord } from '@/lib/contact-inquiry';
import type { CorporateInquiryRecord } from '@/lib/corporate-inquiry';
import type { BlogSubscriber } from '@/lib/subscribers';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '—';
  return escapeHtml(trimmed).replace(/\n/g, '<br>');
}

function rowsToTable(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td><b>${escapeHtml(label)}</b></td><td>${formatValue(value)}</td></tr>`,
    )
    .join('\n');

  return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;max-width:640px;">\n${body}\n</table>`;
}

async function sendNotificationEmail(subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set; skipping notification email');
    return;
  }

  if (!to) {
    console.error('RESEND_TO is not set; skipping notification email');
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Approachable Leads <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend notification failed:', error);
    }
  } catch (error) {
    console.error('Resend notification failed:', error);
  }
}

export async function notifyContactInquiry(record: ContactInquiryRecord): Promise<void> {
  await sendNotificationEmail(
    `New contact inquiry from ${record.name}`,
    rowsToTable([
      ['Name', record.name],
      ['Email', record.email],
      ['Phone', record.phone],
      ['Organization', record.organization],
      ['Enquiry type', enquiryTypeLabel(record.enquiryType)],
      ['Message', record.message],
      ['Submitted at', record.submittedAt],
      ['ID', record.id],
    ]),
  );
}

export async function notifyCorporateInquiry(record: CorporateInquiryRecord): Promise<void> {
  await sendNotificationEmail(
    `New team training inquiry from ${record.contactName} (${record.company})`,
    rowsToTable([
      ['Company', record.company],
      ['Contact name', record.contactName],
      ['Email', record.email],
      ['Phone', record.phone],
      ['Team size', record.teamSize],
      ['Industry', record.industry],
      ['Timing', record.timing],
      ['Requirements', record.requirements],
      ['Submitted at', record.submittedAt],
      ['ID', record.id],
    ]),
  );
}

export async function notifyNewSubscriber(subscriber: BlogSubscriber): Promise<void> {
  await sendNotificationEmail(
    `New blog subscriber: ${subscriber.email}`,
    rowsToTable([
      ['Email', subscriber.email],
      ['Subscribed at', subscriber.subscribedAt],
    ]),
  );
}
