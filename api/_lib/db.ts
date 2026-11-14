import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export type Sql = NeonQueryFunction<false, false>;

let cached: { url: string; sql: Sql } | undefined;

/** DATABASE_URL 이 없으면 null. 로컬 pnpm dev 는 DB 없이도 돈다 */
export function sqlFromEnv(env: NodeJS.ProcessEnv = process.env): Sql | null {
  const url = env.DATABASE_URL?.trim();
  if (!url) return null;
  if (cached?.url !== url) cached = { url, sql: neon(url) };
  return cached.sql;
}
