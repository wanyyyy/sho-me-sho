import {
  createMemoryRateLimiter,
  dailyLimit,
  DEFAULT_DAILY_LIMIT,
} from "./rate-limit.ts";

describe("createMemoryRateLimiter", () => {
  it("한도까지만 허용하고 남은 횟수를 돌려준다", () => {
    const limiter = createMemoryRateLimiter(2, 1000);
    expect(limiter.hit("a", 0)).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.hit("a", 1)).toEqual({ allowed: true, remaining: 0 });
    expect(limiter.hit("a", 2)).toEqual({ allowed: false, remaining: 0 });
  });

  it("키마다 따로 세고, 창이 지나면 다시 센다", () => {
    const limiter = createMemoryRateLimiter(1, 1000);
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("b", 0).allowed).toBe(true);
    expect(limiter.hit("a", 999).allowed).toBe(false);
    expect(limiter.hit("a", 1000).allowed).toBe(true);
  });
});

describe("dailyLimit", () => {
  it("양의 정수만 받고 아니면 기본값", () => {
    expect(dailyLimit({ DAILY_LIMIT_PER_IP: "5" })).toBe(5);
    expect(dailyLimit({ DAILY_LIMIT_PER_IP: "0" })).toBe(DEFAULT_DAILY_LIMIT);
    expect(dailyLimit({ DAILY_LIMIT_PER_IP: "abc" })).toBe(DEFAULT_DAILY_LIMIT);
    expect(dailyLimit({})).toBe(DEFAULT_DAILY_LIMIT);
  });
});
