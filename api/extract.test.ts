import { createHash } from "node:crypto";
import { GET } from "./extract.ts";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

afterEach(() => vi.unstubAllEnvs());

describe("GET /api/extract (설정 점검)", () => {
  it("해시가 없으면 gate off", async () => {
    vi.stubEnv("VITE_ACCESS_CODE_HASH", "");
    vi.stubEnv("ACCESS_CODE_HASH", "");
    expect(await (await GET()).json()).toMatchObject({ gate: "off" });
  });

  it("64자리 hex 면 on, 아니면 invalid-hash (값은 노출하지 않음)", async () => {
    vi.stubEnv("VITE_ACCESS_CODE_HASH", sha("x"));
    const body = await (await GET()).json();
    expect(body.gate).toBe("on");
    expect(JSON.stringify(body)).not.toContain(sha("x"));

    vi.stubEnv("VITE_ACCESS_CODE_HASH", "wanylog!");
    expect(await (await GET()).json()).toMatchObject({ gate: "invalid-hash" });
  });
});
