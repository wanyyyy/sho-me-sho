import { sha256Hex } from "./sha256.lib";

describe("sha256Hex", () => {
  it("알려진 값과 일치한다", async () => {
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});
