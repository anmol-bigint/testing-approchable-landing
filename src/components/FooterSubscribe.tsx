'use client';

import { useState } from 'react';

export default function FooterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong');
    }
  }

  return (
    <div className="footer-subscribe">
      <h4 className="footer-col-heading">AI Insights for Professionals</h4>
      <p className="footer-subscribe-desc">Get notified about new posts, courses, and AI insights.</p>

      {status === 'success' ? (
        <p className="footer-subscribe-success">You&apos;re in! Thanks for subscribing.</p>
      ) : (
        <form onSubmit={handleSubmit} className="footer-subscribe-form">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="footer-subscribe-input"
          />
          <button type="submit" disabled={status === 'loading'} className="footer-subscribe-btn">
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
          {status === 'error' && <p className="footer-subscribe-error">{errorMsg}</p>}
        </form>
      )}
      <div className="footer-subscribe-legal">
        <span className="footer-static-link">Privacy Policy</span>
        <span className="footer-static-link">Terms of Service</span>
      </div>
    </div>
  );
}
