import { createHash } from "node:crypto";
import { accessCodeHash, verifyAccessCode } from "./access";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

describe("verifyAccessCode (server)", () => {
  it("해시가 없으면 게이트가 꺼져 누구나 통과", () => {
    expect(verifyAccessCode(null, "")).toBe(true);
    expect(verifyAccessCode("아무거나", "")).toBe(true);
  });

  it("해시가 있으면 코드 없는 요청은 거절", () => {
    expect(verifyAccessCode(null, sha("비밀"))).toBe(false);
    expect(verifyAccessCode("", sha("비밀"))).toBe(false);
  });

  it("코드가 해시와 맞을 때만 통과 (앞뒤 공백 무시)", () => {
    expect(verifyAccessCode("  비밀 ", sha("비밀"))).toBe(true);
    expect(
      verifyAccessCode(
        "비밀",
        accessCodeHash({ ACCESS_CODE_HASH: sha("비밀").toUpperCase() }),
      ),
    ).toBe(true);
    expect(verifyAccessCode("틀림", sha("비밀"))).toBe(false);
  });

  it("서버 전용 해시가 있으면 그것을, 없으면 클라이언트 해시를 쓴다", () => {
    expect(accessCodeHash({ VITE_ACCESS_CODE_HASH: "ab" })).toBe("ab");
    expect(
      accessCodeHash({ ACCESS_CODE_HASH: "cd", VITE_ACCESS_CODE_HASH: "ab" }),
    ).toBe("cd");
    expect(accessCodeHash({})).toBe("");
  });
});
