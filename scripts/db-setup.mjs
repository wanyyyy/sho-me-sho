// 사용: pnpm db:setup   (.env.local 의 DATABASE_URL 로 db/schema.sql 을 적용)
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL 이 없습니다. .env.local 에 넣어 주세요.");
  process.exit(1);
}

const sql = neon(url);
const schema = await readFile(
  new URL("../db/schema.sql", import.meta.url),
  "utf8",
);
const statements = schema
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const statement of statements) await sql.query(statement);
console.log(`적용 완료: ${statements.length}개 문`);
