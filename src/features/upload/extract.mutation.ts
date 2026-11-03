import { useMutation } from "@tanstack/react-query";
import { fileKind } from "@/shared/lib/file";
import { normalizeImage } from "@/shared/lib/image";
import { renderPdfFirstPage } from "@/shared/lib/pdf";
import { extractor, useCertificateStore } from "@/entities/certificate";

/**
 * 파일 → (HEIC 면 JPEG 변환) → 읽기·번역 → 스토어에 새 문서 열기.
 * PDF 는 첫 페이지를 이미지로 렌더해 미리보기로 쓴다
 */
export function useExtractCertificate() {
  const open = useCertificateStore((s) => s.open);
  return useMutation({
    mutationFn: async (input: File) => {
      const file = await normalizeImage(input);
      const [result, previewUrl] = await Promise.all([
        extractor.extract(file),
        fileKind(file) === "pdf"
          ? renderPdfFirstPage(file)
          : URL.createObjectURL(file),
      ]);
      return { file, result, previewUrl };
    },
    onSuccess: ({ file, result, previewUrl }) =>
      open({ name: file.name, previewUrl }, result),
  });
}
