import { sha256Hex } from "@/shared/lib/crypto";

const load = async (hash: string) => {
  vi.resetModules();
  vi.doMock("@/shared/env", () => ({ ACCESS_CODE_HASH: hash }));
  return import("./access.lib");
};

describe("verifyAccessCode", () => {
  it("해시가 없으면 게이트가 꺼져 누구나 통과", async () => {
    const { GATE_ENABLED, verifyAccessCode } = await load("");
    expect(GATE_ENABLED).toBe(false);
    expect(await verifyAccessCode("아무거나")).toBe(true);
  });

  it("코드가 해시와 맞을 때만 통과 (앞뒤 공백 무시)", async () => {
    const { verifyAccessCode } = await load(await sha256Hex("비밀번호"));
    expect(await verifyAccessCode("  비밀번호 ")).toBe(true);
    expect(await verifyAccessCode("틀림")).toBe(false);
  });
});
