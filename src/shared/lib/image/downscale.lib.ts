import { canvasToJpegFile } from "./canvas.lib";

/** 모델에 보낼 긴 변 최대 픽셀. 이보다 크면 모델 쪽에서 어차피 줄이므로 토큰·전송량만 늘어난다 */
export const UPLOAD_MAX_EDGE = 1568;

/** 긴 변이 maxEdge 를 넘는 이미지만 JPEG 로 줄인다. 작으면 원본 그대로 */
export async function downscaleImage(
  file: File,
  maxEdge: number = UPLOAD_MAX_EDGE,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = maxEdge / Math.max(bitmap.width, bitmap.height);
    if (scale >= 1) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 를 만들 수 없습니다");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvasToJpegFile(canvas, file.name);
  } finally {
    bitmap.close();
  }
}
