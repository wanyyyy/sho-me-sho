import { MAX_FILE_BYTES } from "@/shared/lib/file";
import { validateUpload } from "./upload.lib";

const make = (name: string, type: string, size = 1000) => {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
};

describe("validateUpload", () => {
  it("사진·PDF 는 통과", () => {
    expect(validateUpload(make("a.jpg", "image/jpeg"))).toBeNull();
    expect(validateUpload(make("a.pdf", "application/pdf"))).toBeNull();
    expect(validateUpload(make("IMG_1.HEIC", ""))).toBeNull();
  });

  it("지원하지 않는 형식은 거부", () => {
    expect(validateUpload(make("a.txt", "text/plain"))).toBe("unsupported");
    expect(validateUpload(make("a.gif", "image/gif"))).toBe("unsupported");
  });

  it("용량 초과는 거부", () => {
    expect(
      validateUpload(make("a.jpg", "image/jpeg", MAX_FILE_BYTES + 1)),
    ).toBe("tooLarge");
  });
});
