import { ACCESS_CODE_HASH } from "@/shared/env";
import { sha256Hex } from "@/shared/lib/crypto";

/** 해시가 설정돼 있을 때만 게이트가 켜진다 */
export const GATE_ENABLED = ACCESS_CODE_HASH.length > 0;

export async function verifyAccessCode(code: string): Promise<boolean> {
  if (!GATE_ENABLED) return true;
  return (await sha256Hex(code.trim())) === ACCESS_CODE_HASH;
}
