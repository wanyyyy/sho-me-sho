import type { Sql } from "./db.ts";
import { logRequest, type RequestLog, toLogRow } from "./log.ts";

const entry: RequestLog = {
  requestId: "req-1",
  ip: "1.2.3.4",
  engine: "sample",
  status: 200,
  ms: 120,
  documentType: "family",
  pages: 2,
  bytes: 2048,
  usage: { inputTokens: 10, outputTokens: 20 },
};

/** 태그드 템플릿으로 불린 값만 모으는 가짜 sql */
function fakeSql(result: Promise<unknown> = Promise.resolve([])) {
  const calls: unknown[][] = [];
  const sql = ((_strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push(values);
    return result;
  }) as unknown as Sql;
  return { sql, calls };
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("toLogRow", () => {
  it("VERCEL_ENV 가 없으면 env 는 local", () => {
    expect(toLogRow(entry, {}).env).toBe("local");
    expect(toLogRow(entry, { VERCEL_ENV: "production" }).env).toBe(
      "production",
    );
  });

  it("에러 메시지는 500자로 자른다", () => {
    const row = toLogRow({ ...entry, error: "x".repeat(800) }, {});
    expect(row.error).toHaveLength(500);
  });
});

describe("logRequest", () => {
  it("DB 가 없으면 콘솔에만 남긴다", () => {
    logRequest(entry, null);
    expect(console.log).toHaveBeenCalledOnce();
  });

  it("DB 가 있으면 request_logs 에 한 행을 넣는다 (null 은 그대로 null)", async () => {
    const { sql, calls } = fakeSql();
    logRequest({ ...entry, documentType: undefined }, sql);
    await vi.waitFor(() => expect(calls).toHaveLength(1));
    const values = calls[0];
    expect(values).toContain("req-1");
    expect(values).toContain("1.2.3.4");
    expect(values).toContain(2048);
    expect(values[4]).toBeNull();
  });

  it("DB 저장이 실패해도 던지지 않고 에러만 남긴다", async () => {
    const { sql } = fakeSql(Promise.reject(new Error("down")));
    expect(() => logRequest(entry, sql)).not.toThrow();
    await vi.waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "로그 DB 저장 실패",
        expect.any(Error),
      ),
    );
  });
});
