'use client';

import { useState } from 'react';
import { DemoAlert } from './demoAlert';
import { useSession } from "next-auth/react";
import { useHistory } from '@/lib/historyContext';

export function DashboardInput() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session } = useSession();
  const isAuth = !!session;
  // @ts-expect-error - id is added in callbacks
  const userId = String(session?.user?.id ?? '');
  const { prependLink } = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShortUrl('');

    if (!longUrl.trim()) {
      setError('Please enter a valid URL.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
        setTimeout(() => setShortUrl(''), 30000);
        if (isAuth && userId && data.id) {
          prependLink(userId, {
            id: data.id,
            longUrl,
            shortUrl: data.shortUrl,
            createdAt: data.createdAt,
            clicks: 0,
          });
        }
      } else {
        setError(data.error || 'Something went wrong while shortening the URL.');
      }
    } catch {
      setError('Failed to shorten URL. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  return (
    <section className="w-full flex flex-col items-center px-4">
      <div className="w-full bg-gradient-to-b from-[var(--brand-light)] via-[#f4f6f9] to-transparent pb-12 pt-16 flex flex-col items-center">
        <div className="max-w-2xl w-full flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-3 leading-tight tracking-tight">
            Kutt your links{' '}
            <span className="text-brand underline decoration-dotted decoration-2 underline-offset-4">
              shorter
            </span>
            .
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg mb-8 max-w-md">
            Free, fast and privacy-first link shortening. No trackers. No spam.
          </p>

          <form onSubmit={handleSubmit} className="w-full relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Paste your long URL here…"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="w-full h-[3.75rem] sm:h-16 pl-5 pr-[5rem] text-base sm:text-lg rounded-full bg-white border border-[var(--border)] shadow-[0_8px_32px_rgba(109,40,217,0.08)] focus:outline-none focus:border-brand focus:ring-2 focus:ring-[var(--brand-glow)] transition-all"
              />

              <button
                type="submit"
                disabled={isLoading}
                aria-label="Shorten URL"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_4px_14px_var(--brand-glow)] hover:bg-[var(--brand-mid)] disabled:opacity-60 transition-all cursor-pointer border-none"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin-slow" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 2v4m0 12v4M5 5l2.8 2.8m8.4 8.4 2.9 2.9M2 12h4m12 0h4M5 19l2.8-2.8m8.4-8.4 2.9-2.9" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="m2 21 21-9L2 3v7l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 text-left pl-4 animate-fade-up">{error}</p>
            )}
          </form>

          {shortUrl && (
            <div className="w-full mt-5 card p-4 flex items-center justify-between gap-3 animate-fade-up">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Your short link</span>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand font-medium text-sm sm:text-base truncate max-w-[calc(100%-2rem)] hover:underline"
                >
                  {shortUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
                className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-all cursor-pointer border-none ${copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[var(--brand-light)] text-brand hover:bg-brand hover:text-white'
                  }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="1.8" /><path strokeLinecap="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="1.8" /></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          {shortUrl && !isAuth && (
            <div className="w-full mt-3">
              <DemoAlert />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
