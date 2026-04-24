'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { type UrlRecord, readCache, writeCache } from '@/lib/historyCache';
import { useHistory } from '@/lib/historyContext';

export function UserDashboard() {
  const { data: session } = useSession();
  // @ts-expect-error - id is added in callbacks
  const userId = String(session?.user?.id ?? '');

  const { history, setHistory, removeLink } = useHistory();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchHistory = useCallback(async (isBackground = false) => {
    if (!userId) return;
    if (isBackground) setSyncing(true);
    try {
      const response = await fetch('/api/history', { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        const records: UrlRecord[] = data.history || [];
        setHistory(records);
        writeCache(userId, records);
      } else {
        if (!isBackground) setError(data.error || 'An error occurred');
      }
    } catch {
      if (!isBackground) setError('An error occurred while fetching history');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [userId, setHistory]);

  useEffect(() => {
    if (!userId) return;
    const cached = readCache(userId);
    if (cached) {
      setHistory(cached.data);
      setLoading(false);
      // Only background-sync if the cache is stale (older than half the TTL)
      if (cached.stale) {
        fetchHistory(true);
      }
    } else {
      fetchHistory(false);
    }
  }, [userId, fetchHistory]);

  const handleDelete = async (id: string) => {
    // Optimistically remove from context state + cache
    removeLink(userId, id);

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        // Revert on failure by re-fetching
        fetchHistory(true);
      }
    } catch {
      fetchHistory(true);
    }
  };

  const filtered = history.filter(
    (h) =>
      h.longUrl.toLowerCase().includes(search.toLowerCase()) ||
      h.shortUrl.toLowerCase().includes(search.toLowerCase())
  );

  const count = history.length;
  const LIMIT = 10;
  const totalViews = history.reduce((sum, h) => sum + (h.clicks ?? 0), 0);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="card mb-6 overflow-x-auto">
        <div className="flex min-w-[480px] sm:min-w-0 items-center divide-x divide-[var(--border)]">
          <div className="flex-1 px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide mb-0.5">Total Links</p>
            <p className="text-xl font-bold text-[var(--text)]">
              <span className="text-brand">{count}</span>
              <span className="text-[var(--text-muted)] font-normal text-sm"> / {LIMIT}</span>
            </p>
          </div>
          <div className="flex-1 px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide mb-0.5">Tracked Views</p>
            <p className="text-xl font-bold text-[var(--text)]">
              <span className="text-brand">{totalViews}</span>
              <span className="text-[var(--text-muted)] font-normal text-sm"> / 100</span>
            </p>
          </div>
          <div className="flex-1 px-5 py-4">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide mb-0.5">Total Views</p>
            <p className="text-xl font-bold text-[var(--text)]">
              <span className="text-brand">{totalViews}</span>
              <span className="text-[var(--text-muted)] font-normal text-sm"> / 100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-[var(--text)]">Recent links</h2>
        {syncing && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <span className="inline-block w-3 h-3 border border-brand border-t-transparent rounded-full animate-spin-slow" />
            Syncing…
          </span>
        )}
      </div>

      <div className="relative mb-4 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search links…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-[var(--border)] bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-[var(--brand-glow)] transition-all"
        />
      </div>

      <div className="card overflow-hidden hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-[#f8fafc] border-b border-[var(--border)]">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-muted)] w-[45%]">Original URL</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-muted)]">Short link</th>
              <th className="text-left px-5 py-3 font-semibold text-[var(--text-muted)]">Created</th>
              <th className="text-right px-5 py-3 font-semibold text-[var(--text-muted)]">Views</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-[var(--text-muted)]">
                <span className="inline-block w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin-slow mr-2 align-middle" />
                Loading…
              </td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center py-10 text-red-500">{error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-[var(--text-muted)]">No links found.</td></tr>
            ) : (
              filtered.map((hs) => (
                <tr key={hs.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 max-w-0 w-[45%]">
                    <a href={hs.longUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[var(--text)] no-underline hover:text-brand truncate block" title={hs.longUrl}>
                      {hs.longUrl}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <a href={hs.shortUrl} target="_blank" rel="noopener noreferrer"
                      className="text-brand no-underline hover:underline underline-offset-2">
                      {hs.shortUrl}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-muted)] whitespace-nowrap">
                    {hs.createdAt ? new Date(hs.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">{hs.clicks ?? 0}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      aria-label="Delete link"
                      onClick={() => handleDelete(hs.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none ml-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {loading ? (
          <div className="card p-6 text-center text-[var(--text-muted)]">
            <span className="inline-block w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin-slow mr-2 align-middle" />
            Loading…
          </div>
        ) : error ? (
          <div className="card p-6 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="card p-6 text-center text-[var(--text-muted)]">No links found.</div>
        ) : (
          filtered.map((hs) => (
            <div key={hs.id} className="card p-4 flex flex-col gap-2 animate-fade-up">
              <div className="flex justify-between items-start gap-2">
                <a href={hs.shortUrl} target="_blank" rel="noopener noreferrer"
                  className="text-brand font-semibold text-sm no-underline hover:underline truncate">
                  {hs.shortUrl}
                </a>
                <button
                  aria-label="Delete link"
                  onClick={() => handleDelete(hs.id)}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
              <a href={hs.longUrl} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] text-xs no-underline hover:text-brand truncate">
                {hs.longUrl}
              </a>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>{hs.createdAt ? new Date(hs.createdAt).toLocaleDateString() : '—'}</span>
                <span>{hs.clicks ?? 0} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
