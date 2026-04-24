export interface UrlRecord {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt?: string;
  clicks?: number;
}

interface CacheEntry {
  data: UrlRecord[];
  fetchedAt: number;
}

export const CACHE_TTL_MS = 120_000; // 2 minutes

export function getCacheKey(userId: string) {
  return `kutt_history_${userId}`;
}

export interface CacheResult {
  data: UrlRecord[];
  stale: boolean;
}

export function readCache(userId: string): CacheResult | null {
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - entry.fetchedAt;
    if (age > CACHE_TTL_MS) return null;
    return { data: entry.data, stale: age > CACHE_TTL_MS / 2 };
  } catch {
    return null;
  }
}

export function writeCache(userId: string, data: UrlRecord[]) {
  try {
    const entry: CacheEntry = { data, fetchedAt: Date.now() };
    localStorage.setItem(getCacheKey(userId), JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

export function clearCache(userId: string) {
  try {
    localStorage.removeItem(getCacheKey(userId));
  } catch {
    // ignore
  }
}

export function prependToCache(userId: string, record: UrlRecord) {
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    if (!raw) {
      writeCache(userId, [record]);
      return;
    }
    const entry: CacheEntry = JSON.parse(raw);
    const already = entry.data.some((r) => r.id === record.id);
    if (!already) {
      entry.data = [record, ...entry.data];
      localStorage.setItem(getCacheKey(userId), JSON.stringify(entry));
    }
  } catch {
    // ignore
  }
}
