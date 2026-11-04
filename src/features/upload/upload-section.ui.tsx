import { useNavigate } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { Button } from "@/shared/ui";
import { type ExtractInput, useExtractCertificate } from "./extract.mutation";
import { UploadDropzone } from "./upload-dropzone.ui";

/** 홈: 업로드 → 읽기·번역 → 편집 화면으로 이동 */
export function UploadSection() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useExtractCertificate();

  const run = (input: ExtractInput) =>
    mutate(input, { onSuccess: () => navigate(routePaths.editor()) });

  return (
    <section className="flex flex-col gap-4">
      <UploadDropzone onSelect={run} disabled={isPending} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-ink-600 text-sm" aria-live="polite">
          {isPending
            ? "증명서를 읽고 번역하는 중…"
            : isError
              ? `읽기에 실패했습니다. 다시 시도해 주세요. (${error.message})`
              : "읽기·번역은 10초 안팎 걸립니다. 아이폰 HEIC 사진도 올릴 수 있습니다."}
        </p>
        <Button
          variant="ghost"
          onClick={() => run("sample")}
          disabled={isPending}
        >
          샘플로 체험하기
        </Button>
      </div>
    </section>
  );
}
