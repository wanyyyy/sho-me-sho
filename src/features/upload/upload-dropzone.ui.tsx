import { useId, useState } from "react";
import { ACCEPT_ATTR, FORMAT_LABELS, MAX_FILE_MB } from "@/shared/lib/file";
import { cn } from "@/shared/lib/utils";
import { MAX_PAGES } from "@/entities/certificate";
import {
  UPLOAD_ERROR_MESSAGES,
  UploadError,
  validateUpload,
} from "./upload.lib";

type UploadDropzoneProps = {
  /** 검증을 통과한 파일들 (쪽 순서). 여러 쪽 서류는 사진 여러 장이나 PDF 한 개 */
  onSelect: (files: File[]) => void;
  /** 읽기·번역 진행 중: 상자 안에 로딩 표시, 입력은 막는다 */
  loading?: boolean;
};

const LOADING_LABEL = "증명서를 읽고 번역하는 중…";

/** 드래그 앤 드롭 + 파일 선택. 검증 통과한 파일 1개를 onSelect 로 넘긴다 */
export function UploadDropzone({ onSelect, loading }: UploadDropzoneProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);

  const handleFiles = (list: FileList | null | undefined) => {
    const files = [...(list ?? [])].slice(0, MAX_PAGES);
    if (files.length === 0) return;
    const err = files.map(validateUpload).find((e) => e !== null) ?? null;
    setError(err);
    if (!err) onSelect(files);
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        aria-busy={loading}
        onDragOver={(e) => {
          e.preventDefault();
          if (!loading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!loading) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 text-center transition-colors sm:min-h-56",
          loading
            ? "border-accent-500 bg-accent-100 cursor-wait"
            : dragging
              ? "border-accent-500 bg-accent-100 cursor-pointer"
              : "border-paper-200 bg-paper-50 hover:border-ink-400 cursor-pointer",
        )}
      >
        {loading ? (
          <>
            <span
              aria-hidden
              className="border-accent-500 h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
            />
            <span role="status" className="text-base font-medium">
              {LOADING_LABEL}
            </span>
          </>
        ) : (
          <>
            <span className="text-base font-medium">
              증명서 사진이나 PDF 를 여기에 끌어다 놓으세요
            </span>
            <span className="text-ink-600 text-sm">
              또는 클릭해서 파일 선택 · {FORMAT_LABELS} · {MAX_FILE_MB}MB 이하
            </span>
            <span className="text-ink-400 text-xs">
              여러 쪽이면 사진을 한 번에 여러 장 고르거나 PDF 로 (최대{" "}
              {MAX_PAGES}
              쪽)
            </span>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          disabled={loading}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="text-danger-500 mt-2 text-sm">
          {UPLOAD_ERROR_MESSAGES[error]}
        </p>
      )}
    </div>
  );
}
