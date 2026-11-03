import { cn } from "./cn.utils";

describe("cn", () => {
  it("falsy 값을 제외하고 결합한다", () => {
    expect(cn("a", false, null, undefined, "b", ["c", ["d"]])).toBe("a b c d");
  });

  it("충돌하는 Tailwind 클래스는 뒤의 것이 이긴다", () => {
    expect(cn("h-12 px-4", "h-auto")).toBe("px-4 h-auto");
  });
});
