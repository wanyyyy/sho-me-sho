export const DAY_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_DAILY_LIMIT = 20;

export type RateLimitHit = { allowed: boolean; remaining: number };

export interface RateLimiter {
  hit(key: string, now?: number): RateLimitHit;
}

/**
 * 프로세스 메모리에 IP 별 횟수를 센다. 서버리스는 인스턴스마다 따로 세므로
 * "대략의 상한"이고, 정확히 막으려면 같은 인터페이스로 KV(Redis) 구현을 붙인다
 */
export function createMemoryRateLimiter(
  limit: number,
  windowMs: number = DAY_MS,
): RateLimiter {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  const prune = (now: number) => {
    for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
  };

  return {
    hit(key, now = Date.now()) {
      if (buckets.size > 1000) prune(now);
      const bucket = buckets.get(key);
      const current =
        bucket && bucket.resetAt > now
          ? bucket
          : { count: 0, resetAt: now + windowMs };
      if (current.count >= limit) return { allowed: false, remaining: 0 };
      current.count += 1;
      buckets.set(key, current);
      return { allowed: true, remaining: limit - current.count };
    },
  };
}

export function dailyLimit(env: NodeJS.ProcessEnv = process.env): number {
  const n = Number(env.DAILY_LIMIT_PER_IP);
  return Number.isInteger(n) && n > 0 ? n : DEFAULT_DAILY_LIMIT;
}
