// 사용: pnpm access:hash <접근 코드>
// 출력된 해시를 .env.local 의 VITE_ACCESS_CODE_HASH 에 넣는다.
import { createHash } from "node:crypto";

const code = process.argv[2];
if (!code) {
  console.error("사용: pnpm access:hash <접근 코드>");
  process.exit(1);
}
console.log(createHash("sha256").update(code, "utf8").digest("hex"));
