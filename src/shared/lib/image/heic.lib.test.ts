import { normalizeImage } from "./heic.lib";

vi.mock("heic2any", () => ({
  default: vi.fn(async () => new Blob(["jpeg"], { type: "image/jpeg" })),
}));

describe("normalizeImage", () => {
  it("HEIC 는 같은 이름의 JPEG File 로 바꾼다", async () => {
    const out = await normalizeImage(
      new File(["x"], "IMG_0001.HEIC", { type: "image/heic" }),
    );
    expect(out.type).toBe("image/jpeg");
    expect(out.name).toBe("IMG_0001.jpg");
  });

  it("type 이 비어 있어도 확장자로 HEIC 를 알아본다", async () => {
    const out = await normalizeImage(new File(["x"], "a.heif", { type: "" }));
    expect(out.type).toBe("image/jpeg");
  });

  it("HEIC 가 아니면 그대로 돌려준다", async () => {
    const jpg = new File(["x"], "a.jpg", { type: "image/jpeg" });
    expect(await normalizeImage(jpg)).toBe(jpg);
  });
});
