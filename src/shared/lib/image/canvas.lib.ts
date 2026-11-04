export const JPEG_QUALITY = 0.9;

/** canvas 내용을 JPEG File 로. 이름은 원본 이름에서 확장자만 .jpg 로 바꾼다 */
export async function canvasToJpegFile(
  canvas: HTMLCanvasElement,
  name: string,
  quality: number = JPEG_QUALITY,
): Promise<File> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("이미지를 만들 수 없습니다");
  return new File([blob], jpegName(name), { type: "image/jpeg" });
}

export function jpegName(name: string): string {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}
