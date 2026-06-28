const TTL_MS = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export interface MarketCacheMeta {
  fetchedAt: string;
  cacheHit: boolean;
  expiresAt: string;
}

export function withMarketCache<T>(key: string, loader: () => T): { data: T; meta: MarketCacheMeta } {
  const now = Date.now();
  const existing = store.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return {
      data: existing.data,
      meta: {
        fetchedAt: new Date(existing.fetchedAt).toISOString(),
        cacheHit: true,
        expiresAt: new Date(existing.expiresAt).toISOString(),
      },
    };
  }

  const data = loader();
  const entry: CacheEntry<T> = {
    data,
    fetchedAt: now,
    expiresAt: now + TTL_MS,
  };
  store.set(key, entry);

  return {
    data,
    meta: {
      fetchedAt: new Date(now).toISOString(),
      cacheHit: false,
      expiresAt: new Date(entry.expiresAt).toISOString(),
    },
  };
}

export function clearMarketCache() {
  store.clear();
}
