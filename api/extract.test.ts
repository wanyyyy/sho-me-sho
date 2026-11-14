import { spawnSync } from "node:child_process";
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

describe("Vercel 런타임 import", () => {
  it("별칭 없이 순수 Node ESM 으로 불러와진다 (@/ 나 확장자 없는 import 가 있으면 배포에서 500)", () => {
    const result = spawnSync(
      process.execPath,
      [
        "--experimental-transform-types",
        "--no-warnings",
        "-e",
        'import("./api/extract.ts").then((m) => { if (typeof m.POST !== "function") process.exit(1); })',
      ],
      { encoding: "utf8" },
    );
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });
});
