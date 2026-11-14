import { waitUntil } from "@vercel/functions";
import { type Sql, sqlFromEnv } from "./db.ts";
import type { EngineUsage } from "./engine.ts";

export type RequestLog = {
  requestId: string;
  ip: string;
  engine: string;
  status: number;
  ms: number;
  documentType?: string;
  pages?: number;
  bytes?: number;
  usage?: EngineUsage;
  /** 500 일 때만. 내부 에러 메시지라 응답에는 싣지 않는다 */
  error?: string;
};

export type LogRow = RequestLog & { at: string; env: string };

const MAX_ERROR_LENGTH = 500;

export function toLogRow(
  entry: RequestLog,
  env: NodeJS.ProcessEnv = process.env,
  now: Date = new Date(),
): LogRow {
  return {
    at: now.toISOString(),
    env: env.VERCEL_ENV ?? "local",
    ...entry,
    error: entry.error?.slice(0, MAX_ERROR_LENGTH),
  };
}

export async function insertLog(sql: Sql, row: LogRow): Promise<void> {
  await sql`
    insert into request_logs (
      at, env, request_id, ip, document_type, pages, bytes,
      engine, status, ms, input_tokens, output_tokens, error
    ) values (
      ${row.at}, ${row.env}, ${row.requestId}, ${row.ip}, ${row.documentType ?? null},
      ${row.pages ?? null}, ${row.bytes ?? null}, ${row.engine}, ${row.status}, ${row.ms},
      ${row.usage?.inputTokens ?? null}, ${row.usage?.outputTokens ?? null}, ${row.error ?? null}
    )`;
}

/**
 * 호출 1건당 한 줄. 누가(IP)·언제·무엇을·얼마나(토큰) 썼는지만 남기고
 * 이미지·추출 결과·접근 코드는 절대 기록하지 않는다.
 * 콘솔(Vercel 로그)에는 항상 남기고, DATABASE_URL 이 있으면 request_logs 에도 쌓는다.
 * DB 저장은 응답을 늦추지 않도록 waitUntil 로 응답 뒤에 끝내고, 실패해도 요청에는 영향이 없다
 */
export function logRequest(
  entry: RequestLog,
  sql: Sql | null = sqlFromEnv(),
): void {
  const row = toLogRow(entry);
  console.log(JSON.stringify(row));
  if (!sql) return;
  waitUntil(
    insertLog(sql, row).catch((error: unknown) =>
      console.error("로그 DB 저장 실패", error),
    ),
  );
}
