const SCALE = 2;
const JPEG_QUALITY = 0.9;

/**
 * PDF 첫 페이지를 JPEG 로 렌더해 object URL 로 돌려준다 (미리보기용).
 * pdf.js 는 무거우므로 PDF 를 실제로 올렸을 때만 로드한다
 */
export async function renderPdfFirstPage(file: File): Promise<string> {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
  const pdf = await task.promise;
  try {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 를 만들 수 없습니다");
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("미리보기 이미지를 만들 수 없습니다");
    return URL.createObjectURL(blob);
  } finally {
    await task.destroy();
  }
}
