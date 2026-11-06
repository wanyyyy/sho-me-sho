import { useMutation } from "@tanstack/react-query";
import { fileKind } from "@/shared/lib/file";
import { downscaleImage, normalizeImage } from "@/shared/lib/image";
import { renderPdfPages } from "@/shared/lib/pdf";
import {
  CertificateTemplate,
  ExtractionResult,
  extractor,
  IS_MOCK_EXTRACTOR,
  MAX_PAGES,
  useCertificateStore,
} from "@/entities/certificate";

/** 실제 파일들(쪽 순서), 또는 샘플 체험 (서버를 거치지 않고 샘플 결과를 연다) */
export type ExtractInput = {
  template: CertificateTemplate;
  sample: ExtractionResult;
  files: File[] | "sample";
};

const SAMPLE_NAME = "sample.jpg";

/** 파일들 → 브라우저가 그릴 수 있는 JPEG 쪽 목록 (HEIC 변환, PDF 는 쪽마다 렌더). 최대 MAX_PAGES */
async function toPages(inputs: File[]): Promise<File[]> {
  const pages: File[] = [];
  for (const input of inputs) {
    if (pages.length >= MAX_PAGES) break;
    const file = await normalizeImage(input);
    const remaining = MAX_PAGES - pages.length;
    if (fileKind(file) === "pdf")
      pages.push(...(await renderPdfPages(file, remaining)));
    else pages.push(file);
  }
  return pages;
}

/**
 * 업로드 → 쪽 이미지 정규화 → (크면 축소해서) 읽기·번역 → 스토어에 새 문서 열기.
 * 미리보기는 축소 전 이미지를 쓴다. mock 모드에서는 서버 대신 샘플을 연다
 */
export function useExtractCertificate() {
  const open = useCertificateStore((s) => s.open);
  return useMutation({
    mutationFn: async ({ template, sample, files }: ExtractInput) => {
      if (files === "sample") {
        return {
          template,
          name: SAMPLE_NAME,
          previewUrls: [] as string[],
          result: sample,
        };
      }
      const pages = await toPages(files);
      const previewUrls = pages.map((p) => URL.createObjectURL(p));
      const name =
        files.length === 1
          ? files[0].name
          : `${files[0].name} 외 ${files.length - 1}`;
      if (IS_MOCK_EXTRACTOR)
        return { template, name, previewUrls, result: sample };
      const uploads = await Promise.all(pages.map((p) => downscaleImage(p)));
      const result = await extractor.extract(uploads, template.type);
      return { template, name, previewUrls, result };
    },
    onSuccess: ({ template, name, previewUrls, result }) =>
      open(template, { name, previewUrls }, result),
  });
}
