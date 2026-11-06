import {
  formatJapaneseDate,
  parseKoreanDate,
  toJapaneseDate,
} from "./korean-date.lib";

describe("korean-date", () => {
  it("한국어 날짜를 읽는다", () => {
    expect(parseKoreanDate("1992년 02월 20일")).toEqual({
      year: 1992,
      month: 2,
      day: 20,
    });
    expect(parseKoreanDate("날짜 아님")).toBeNull();
  });

  it("자릿수를 지켜 일본어 날짜로 바꾼다", () => {
    expect(toJapaneseDate("2008년 01월 01일")).toBe("2008年 01月 01日");
    expect(toJapaneseDate("2026년 9월 10일")).toBe("2026年 9月 10日");
    expect(toJapaneseDate("부")).toBe("부");
  });

  it("오늘 날짜 표기", () => {
    expect(formatJapaneseDate({ year: 2026, month: 1, day: 10 })).toBe(
      "2026年 1月 10日",
    );
  });
});
