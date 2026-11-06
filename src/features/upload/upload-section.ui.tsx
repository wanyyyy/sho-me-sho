import { useNavigate } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { Button } from "@/shared/ui";
import { CertificateTemplate, ExtractionResult } from "@/entities/certificate";
import { type ExtractInput, useExtractCertificate } from "./extract.mutation";
import { UploadDropzone } from "./upload-dropzone.ui";

type UploadSectionProps = {
  template: CertificateTemplate;
  /** "샘플로 체험하기" 가 여는 결과 */
  sample: ExtractionResult;
};

/** 업로드 → 읽기·번역 → 편집 화면으로 이동 */
export function UploadSection({ template, sample }: UploadSectionProps) {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useExtractCertificate();

  const run = (files: ExtractInput["files"]) =>
    mutate(
      { template, sample, files },
      { onSuccess: () => navigate(routePaths.editor()) },
    );

  return (
    <section className="flex flex-col gap-4">
      <UploadDropzone onSelect={run} loading={isPending} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p role="alert" className="text-danger-500 text-sm">
          {isError &&
            `읽기에 실패했습니다. 다시 시도해 주세요. (${error.message})`}
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
