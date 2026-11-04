import { useMutation } from "@tanstack/react-query";
import { fileKind } from "@/shared/lib/file";
import { downscaleImage, normalizeImage } from "@/shared/lib/image";
import { renderPdfFirstPage } from "@/shared/lib/pdf";
import {
  extractor,
  mockExtractor,
  useCertificateStore,
} from "@/entities/certificate";

/** 실제 파일, 또는 "sample" (샘플 체험: 서버를 거치지 않고 브라우저 안 샘플을 연다) */
export type ExtractInput = File | "sample";

const SAMPLE_NAME = "sample-juri.jpg";

/** 파일 → 브라우저가 그릴 수 있는 JPEG 한 장 (HEIC 변환, PDF 는 첫 페이지 렌더) */
async function toImage(input: File): Promise<File> {
  const file = await normalizeImage(input);
  return fileKind(file) === "pdf" ? renderPdfFirstPage(file) : file;
}

/**
 * 업로드 → 이미지 정규화 → (크면 축소해서) 읽기·번역 → 스토어에 새 문서 열기.
 * 미리보기는 축소 전 이미지를 쓴다
 */
export function useExtractCertificate() {
  const open = useCertificateStore((s) => s.open);
  return useMutation({
    mutationFn: async (input: ExtractInput) => {
      if (input === "sample") {
        const result = await mockExtractor.extract(new File([], SAMPLE_NAME));
        return { name: SAMPLE_NAME, previewUrl: "", result };
      }
      const image = await toImage(input);
      const result = await extractor.extract(await downscaleImage(image));
      return {
        name: input.name,
        previewUrl: URL.createObjectURL(image),
        result,
      };
    },
    onSuccess: ({ name, previewUrl, result }) =>
      open({ name, previewUrl }, result),
  });
}
