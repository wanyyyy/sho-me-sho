import { canvasToJpegFile, jpegName } from "@/shared/lib/image";

const SCALE = 2;

/**
 * PDF 앞쪽 maxPages 쪽을 JPEG File 로 렌더한다 (미리보기와 서버 전송에 같이 쓴다).
 * pdf.js 는 무거우므로 PDF 를 실제로 올렸을 때만 로드한다
 */
export async function renderPdfPages(
  file: File,
  maxPages: number,
): Promise<File[]> {
  const [pdfjs, { default: workerUrl }] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
  const pdf = await task.promise;
  try {
    const count = Math.min(pdf.numPages, maxPages);
    const pages: File[] = [];
    for (let n = 1; n <= count; n++) {
      const page = await pdf.getPage(n);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas 를 만들 수 없습니다");
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      const base = jpegName(file.name).replace(/\.jpg$/, "");
      pages.push(await canvasToJpegFile(canvas, `${base}-${n}.jpg`));
    }
    return pages;
  } finally {
    await task.destroy();
  }
}

/** 첫 쪽만 */
export async function renderPdfFirstPage(file: File): Promise<File> {
  const [first] = await renderPdfPages(file, 1);
  return first;
}
