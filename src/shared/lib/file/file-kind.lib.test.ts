import { ACCEPT_ATTR, fileKind, FORMAT_LABELS } from "./file-kind.lib";

const make = (name: string, type: string) => new File(["x"], name, { type });

describe("fileKind", () => {
  it("MIME 으로 판별한다", () => {
    expect(fileKind(make("a.jpg", "image/jpeg"))).toBe("jpeg");
    expect(fileKind(make("a.pdf", "application/pdf"))).toBe("pdf");
    expect(fileKind(make("a.heic", "image/heif"))).toBe("heic");
  });

  it("MIME 이 비어 있으면 확장자로 판별한다", () => {
    expect(fileKind(make("IMG_1.HEIC", ""))).toBe("heic");
    expect(fileKind(make("a.PDF", ""))).toBe("pdf");
  });

  it("모르는 형식은 null", () => {
    expect(fileKind(make("a.gif", "image/gif"))).toBeNull();
    expect(fileKind(make("a.txt", ""))).toBeNull();
  });

  it("accept 속성과 안내 문구를 표에서 파생한다", () => {
    expect(ACCEPT_ATTR).toBe(".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf");
    expect(FORMAT_LABELS).toBe("JPG, PNG, WEBP, HEIC, PDF");
  });
});
