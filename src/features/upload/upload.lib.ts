import {
  fileKind,
  FORMAT_LABELS,
  MAX_FILE_BYTES,
  MAX_FILE_MB,
} from "@/shared/lib/file";

export type UploadError = "unsupported" | "tooLarge";

export const UPLOAD_ERROR_MESSAGES: Record<UploadError, string> = {
  unsupported: `${FORMAT_LABELS} 파일만 올릴 수 있습니다.`,
  tooLarge: `${MAX_FILE_MB}MB 이하 파일만 올릴 수 있습니다.`,
};

export function validateUpload(file: File): UploadError | null {
  if (fileKind(file) === null) return "unsupported";
  if (file.size > MAX_FILE_BYTES) return "tooLarge";
  return null;
}
