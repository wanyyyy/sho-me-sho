import { MARRIAGE_SAMPLE } from "@/features/marriage";
import { EXTRACT_ENDPOINT, remoteExtractor } from "./remote-extractor.lib";

const file = new File(["x"], "a.jpg", { type: "image/jpeg" });

const respond = (body: unknown, status = 200) => {
  const fetchMock = vi.fn(
    async (_url: string, _init: RequestInit) =>
      new Response(JSON.stringify(body), { status }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("remoteExtractor", () => {
  it("파일과 접근 코드를 보내고 결과를 계약대로 받는다", async () => {
    sessionStorage.setItem("access-code", "코드");
    const fetchMock = respond(MARRIAGE_SAMPLE);
    const result = await remoteExtractor.extract([file, file], "marriage");
    expect(result).toEqual(MARRIAGE_SAMPLE);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(EXTRACT_ENDPOINT);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["x-access-code"]).toBe(
      encodeURIComponent("코드"),
    );
    expect((init.body as FormData).getAll("file")).toHaveLength(2);
    expect((init.body as FormData).get("documentType")).toBe("marriage");
  });

  it("서버가 준 오류 문구를 그대로 올린다", async () => {
    respond({ error: "접근 코드가 맞지 않습니다." }, 401);
    await expect(
      remoteExtractor.extract([file, file], "marriage"),
    ).rejects.toThrow("접근 코드가 맞지 않습니다.");
  });

  it("오류 본문이 없으면 상태별 기본 문구", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 429 })),
    );
    await expect(
      remoteExtractor.extract([file, file], "marriage"),
    ).rejects.toThrow(/횟수/);
  });

  it("계약과 다른 응답은 거부한다", async () => {
    respond({ documentType: "marriage" });
    await expect(
      remoteExtractor.extract([file, file], "marriage"),
    ).rejects.toThrow();
  });
});
