import { parseJapaneseDate, toKoreanDate } from "./wareki.lib";

describe("wareki", () => {
  it("令和 연호를 서기로 바꾼다", () => {
    expect(toKoreanDate("令和7年9月6日")).toBe("2025년 9월 6일");
  });

  it("元年은 1년으로 본다", () => {
    expect(parseJapaneseDate("令和元年5月1日")).toEqual({
      year: 2019,
      month: 5,
      day: 1,
    });
  });

  it("平成·昭和도 변환한다", () => {
    expect(toKoreanDate("平成31年4月30日")).toBe("2019년 4월 30일");
    expect(toKoreanDate("昭和64年1月7日")).toBe("1989년 1월 7일");
  });

  it("서기 표기도 받는다", () => {
    expect(toKoreanDate("2025年9月6日")).toBe("2025년 9월 6일");
  });

  it("공백이 섞여도 인식한다", () => {
    expect(toKoreanDate("令和 7 年 9 月 6 日")).toBe("2025년 9월 6일");
  });

  it("인식 못 하면 원문을 돌려준다", () => {
    expect(toKoreanDate("山田 太郎")).toBe("山田 太郎");
    expect(parseJapaneseDate("")).toBeNull();
  });
});

describe("wareki: 실제 증명서 표기", () => {
  it("전각 숫자를 인식한다", () => {
    expect(toKoreanDate("令和８年１０月２日")).toBe("2026년 10월 2일");
  });

  it("西暦 접두어가 붙은 서기 표기를 인식한다", () => {
    expect(toKoreanDate("西暦１９９２年２月２０日")).toBe("1992년 2월 20일");
  });
});
