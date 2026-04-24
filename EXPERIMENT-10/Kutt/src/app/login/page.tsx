'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Failed to connect to Google authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-[0.07]"
        style={{ background: 'var(--brand)', filter: 'blur(60px)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-[0.06]"
        style={{ background: '#f5c842', filter: 'blur(50px)' }}
      />

      <div className="w-full max-w-sm animate-fade-up relative z-10">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-[3px_3px_0_var(--brand-deep,#3b0764)] group-hover:rotate-6 transition-transform duration-300">
              <Image src="/logo.svg" alt="Kutt" width={16} height={22} className="brightness-0 invert" />
            </div>
            <span
              className="font-extrabold text-2xl text-[var(--text)]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Kutt
            </span>
          </Link>

          <h1
            className="text-3xl font-extrabold text-[var(--text)] leading-tight mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back
            <span className="inline-block ml-1 text-[var(--brand)]">.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Sign in to manage your links, view analytics, and more.
          </p>
        </div>

        <div className="bg-white border-2 border-[var(--border)] rounded-2xl shadow-[0_4px_24px_rgba(26,23,20,0.07)] p-8 flex flex-col gap-5">

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-up text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            aria-label="Continue with Google"
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white text-[var(--text)] text-sm font-semibold border-2 border-[var(--border)] shadow-[2px_2px_0_#e2e8f0] hover:shadow-[3px_3px_0_#e2e8f0] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin-slow" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium">secure sign-in</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[var(--text-muted)] bg-[#f8fafc] rounded-xl px-4 py-3 border border-[var(--border)]">
            <svg className="w-4 h-4 shrink-0 mt-0.5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>We only use your Google account to identify you. No passwords are stored.</span>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-5">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[var(--brand)] hover:underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-[var(--brand)] hover:underline underline-offset-2">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
