/** 업로드 가능한 파일 종류. MIME·확장자·안내 문구를 한 표에서 파생한다 */
export const FILE_FORMATS = [
  { kind: "jpeg", mime: "image/jpeg", exts: ["jpg", "jpeg"], label: "JPG" },
  { kind: "png", mime: "image/png", exts: ["png"], label: "PNG" },
  { kind: "webp", mime: "image/webp", exts: ["webp"], label: "WEBP" },
  { kind: "heic", mime: "image/heic", exts: ["heic", "heif"], label: "HEIC" },
  { kind: "pdf", mime: "application/pdf", exts: ["pdf"], label: "PDF" },
] as const;

export type FileKind = (typeof FILE_FORMATS)[number]["kind"];

const HEIF_ALIASES = ["image/heif"];

function extensionOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** MIME 으로 먼저, 비어 있으면 확장자로 종류를 판별. 모르면 null */
export function fileKind(file: File): FileKind | null {
  const mime = file.type.toLowerCase();
  if (mime) {
    if (HEIF_ALIASES.includes(mime)) return "heic";
    return FILE_FORMATS.find((f) => f.mime === mime)?.kind ?? null;
  }
  const ext = extensionOf(file.name);
  return (
    FILE_FORMATS.find((f) => (f.exts as readonly string[]).includes(ext))
      ?.kind ?? null
  );
}

/** <input accept> 용 ".jpg,.jpeg,…" */
export const ACCEPT_ATTR = FILE_FORMATS.flatMap((f) => f.exts)
  .map((ext) => `.${ext}`)
  .join(",");

/** 사람이 읽는 형식 목록 "JPG, PNG, WEBP, HEIC, PDF" */
export const FORMAT_LABELS = FILE_FORMATS.map((f) => f.label).join(", ");

export const MAX_FILE_MB = 20;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
