import { fileKind } from "@/shared/lib/file";

const JPEG_QUALITY = 0.92;

/**
 * 아이폰 HEIC/HEIF 사진 → JPEG. 브라우저가 HEIC 를 그리지 못하므로 업로드 직후 변환한다.
 * HEIC 가 아니면 그대로 돌려주고, 변환 라이브러리는 필요할 때만 로드한다
 */
export async function normalizeImage(file: File): Promise<File> {
  if (fileKind(file) !== "heic") return file;
  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: JPEG_QUALITY,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
