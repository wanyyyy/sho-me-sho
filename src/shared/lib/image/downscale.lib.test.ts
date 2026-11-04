import { downscaleImage } from "./downscale.lib";

const sizes: { width: number; height: number }[] = [];

beforeEach(() => {
  sizes.length = 0;
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = function (cb) {
    sizes.push({ width: this.width, height: this.height });
    cb(new Blob(["jpeg"], { type: "image/jpeg" }));
  };
});

const stubBitmap = (width: number, height: number) =>
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn(async () => ({ width, height, close: vi.fn() })),
  );

describe("downscaleImage", () => {
  it("긴 변이 한도 이하면 원본을 그대로 돌려준다", async () => {
    stubBitmap(1200, 800);
    const png = new File(["x"], "a.png", { type: "image/png" });
    expect(await downscaleImage(png, 1568)).toBe(png);
    expect(sizes).toHaveLength(0);
  });

  it("긴 변이 한도를 넘으면 비율을 지켜 JPEG 로 줄인다", async () => {
    stubBitmap(4000, 3000);
    const out = await downscaleImage(
      new File(["x"], "scan.png", { type: "image/png" }),
      1568,
    );
    expect(sizes).toEqual([{ width: 1568, height: 1176 }]);
    expect(out.type).toBe("image/jpeg");
    expect(out.name).toBe("scan.jpg");
  });
});
