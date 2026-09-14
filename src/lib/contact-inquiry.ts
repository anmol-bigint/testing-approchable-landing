export const FORM_TYPE = 'contact-inquiry';

export const ENQUIRY_TYPES = [
  { value: 'team-training', label: 'Team Training' },
  { value: 'cohort', label: 'Live AI Cohort' },
  { value: 'courses', label: 'Courses' },
  { value: 'general', label: 'General Enquiry' },
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number]['value'];

export type ContactInquiryFields = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  enquiryType: EnquiryType | '';
  message: string;
};

export type ContactInquiryRecord = Omit<ContactInquiryFields, 'enquiryType'> & {
  enquiryType: EnquiryType;
  id: string;
  formType: typeof FORM_TYPE;
  submittedAt: string;
  meta: {
    source: string;
    userAgent?: string;
  };
};

type ValidationSuccess = { ok: true; data: Omit<ContactInquiryFields, 'enquiryType'> & { enquiryType: EnquiryType } };
type ValidationFailure = { ok: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ENQUIRY_TYPES = new Set<string>(ENQUIRY_TYPES.map((t) => t.value));

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function enquiryTypeFromTopic(topic: string | undefined): EnquiryType | '' {
  if (!topic) return '';
  return VALID_ENQUIRY_TYPES.has(topic) ? (topic as EnquiryType) : '';
}

export function enquiryTypeLabel(value: EnquiryType): string {
  return ENQUIRY_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function validateContactInquiry(body: unknown): ValidationSuccess | ValidationFailure {
  if (!body || typeof body !== 'object') {
    return { ok: false, errors: { form: 'Invalid submission payload' } };
  }

  const raw = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = asString(raw.name);
  const email = asString(raw.email);
  const phone = asString(raw.phone);
  const organization = asString(raw.organization);
  const enquiryType = asString(raw.enquiryType);
  const message = asString(raw.message);

  if (!name) errors.name = 'Full name is required';
  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address';
  if (!phone) errors.phone = 'Phone number is required';
  if (!organization) errors.organization = 'Organization is required';
  if (!enquiryType) errors.enquiryType = 'Select what we can help you with';
  else if (!VALID_ENQUIRY_TYPES.has(enquiryType)) errors.enquiryType = 'Select a valid enquiry type';
  if (!message) errors.message = 'Please enter your message';

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      organization,
      enquiryType: enquiryType as EnquiryType,
      message,
    },
  };
}
