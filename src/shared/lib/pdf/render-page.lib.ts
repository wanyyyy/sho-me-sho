import { canvasToJpegFile } from "@/shared/lib/image";

const SCALE = 2;

/**
 * PDF 첫 페이지를 JPEG File 로 렌더한다 (미리보기와 서버 전송에 같이 쓴다).
 * pdf.js 는 무거우므로 PDF 를 실제로 올렸을 때만 로드한다
 */
export async function renderPdfFirstPage(file: File): Promise<File> {
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
    return canvasToJpegFile(canvas, file.name);
  } finally {
    await task.destroy();
  }
}
