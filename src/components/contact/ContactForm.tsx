'use client';

import { useState, type FormEvent } from 'react';
import styles from '@/components/corporate-training/inquiry-form.module.css';
import {
  ENQUIRY_TYPES,
  type ContactInquiryFields,
  type EnquiryType,
  validateContactInquiry,
} from '@/lib/contact-inquiry';

const CONTACT_EMAIL = 'ranbeer@bigintsolutions.com';

type FormErrors = Partial<Record<keyof ContactInquiryFields, string>>;

type ContactFormProps = {
  defaultEnquiryType?: EnquiryType | '';
};

function buildInitial(defaultEnquiryType: EnquiryType | '' = ''): ContactInquiryFields {
  return {
    name: '',
    email: '',
    phone: '',
    organization: '',
    enquiryType: defaultEnquiryType,
    message: '',
  };
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className={styles.formError} role="alert">
      {error}
    </p>
  );
}

export default function ContactForm({ defaultEnquiryType = '' }: ContactFormProps) {
  const [form, setForm] = useState<ContactInquiryFields>(() => buildInitial(defaultEnquiryType));
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactInquiryFields>(key: K, value: ContactInquiryFields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (submitError) setSubmitError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError('');

    const validation = validateContactInquiry(form);
    if (!validation.ok) {
      setErrors(validation.errors as FormErrors);
      const firstKey = Object.keys(validation.errors)[0];
      if (firstKey) {
        document.getElementById(firstKey)?.focus();
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _honeypot: honeypot }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors as FormErrors);
        }
        setSubmitError(
          typeof data?.error === 'string'
            ? data.error
            : 'Something went wrong. Please try again or email us directly.',
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.formRoot}>
        <div className={styles.formSuccess} role="status">
          <h3>Thanks — we received your message.</h3>
          <p>
            We&apos;ll get back to you within a few business days. If you need to reach us directly,
            email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => {
              setForm(buildInitial(defaultEnquiryType));
              setHoneypot('');
              setErrors({});
              setSubmitError('');
              setSubmitted(false);
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formRoot}>
      <form className={styles.inquiryForm} onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className={styles.formSubmitError} role="alert">
            {submitError}
          </p>
        )}

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="_honeypot">Leave this field empty</label>
          <input
            id="_honeypot"
            type="text"
            name="_honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="enquiryType">What can we help you with?</label>
          <select
            id="enquiryType"
            required
            value={form.enquiryType}
            disabled={loading}
            aria-invalid={errors.enquiryType ? true : undefined}
            aria-describedby={errors.enquiryType ? 'enquiryType-error' : undefined}
            onChange={(e) => updateField('enquiryType', e.target.value as ContactInquiryFields['enquiryType'])}
          >
            <option value="">Select an option</option>
            {ENQUIRY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError id="enquiryType-error" error={errors.enquiryType} />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              disabled={loading}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <FieldError id="name-error" error={errors.name} />
          </div>
          <div className={styles.formField}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              disabled={loading}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <FieldError id="email-error" error={errors.email} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+1 555 000 0000"
              value={form.phone}
              disabled={loading}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <FieldError id="phone-error" error={errors.phone} />
          </div>
          <div className={styles.formField}>
            <label htmlFor="organization">Organization</label>
            <input
              id="organization"
              type="text"
              required
              placeholder="Company or team name"
              value={form.organization}
              disabled={loading}
              aria-invalid={errors.organization ? true : undefined}
              aria-describedby={errors.organization ? 'organization-error' : undefined}
              onChange={(e) => updateField('organization', e.target.value)}
            />
            <FieldError id="organization-error" error={errors.organization} />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={5}
            placeholder="Tell us what you're looking for — team training, joining a cohort, course questions, or anything else."
            value={form.message}
            disabled={loading}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-error' : undefined}
            onChange={(e) => updateField('message', e.target.value)}
          />
          <FieldError id="message-error" error={errors.message} />
        </div>

        <button type="submit" className={`${styles.btn} ${styles.btnAccent}`} disabled={loading}>
          {loading ? 'Sending…' : 'Send message →'}
        </button>
      </form>
    </div>
  );
}
