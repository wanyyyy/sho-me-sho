import { createHash, timingSafeEqual } from "node:crypto";

/**
 * 클라이언트 게이트와 같은 해시(VITE_ACCESS_CODE_HASH)를 쓴다.
 * 서버 전용으로 다른 값을 두고 싶으면 ACCESS_CODE_HASH 가 우선한다
 */
export function accessCodeHash(env: NodeJS.ProcessEnv = process.env): string {
  return (env.ACCESS_CODE_HASH ?? env.VITE_ACCESS_CODE_HASH ?? "")
    .trim()
    .toLowerCase();
}

/** 해시가 비어 있으면 게이트가 꺼진 것. 비교는 길이 포함 상수 시간 */
export function verifyAccessCode(
  code: string | null | undefined,
  hash: string = accessCodeHash(),
): boolean {
  if (!hash) return true;
  if (!code) return false;
  const given = createHash("sha256").update(code.trim()).digest();
  const expected = Buffer.from(hash, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
