import {
  accessCodeHeader,
  readAccessCode,
  writeAccessCode,
} from "./access-code.lib";

beforeEach(() => sessionStorage.clear());

describe("access code storage", () => {
  it("저장 전에는 빈 문자열", () => {
    expect(readAccessCode()).toBe("");
  });

  it("저장한 코드를 돌려주고 헤더용으로 인코딩한다", () => {
    writeAccessCode("비밀 코드");
    expect(readAccessCode()).toBe("비밀 코드");
    expect(accessCodeHeader()).toBe(encodeURIComponent("비밀 코드"));
    expect(decodeURIComponent(accessCodeHeader())).toBe("비밀 코드");
  });
});
