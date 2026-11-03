import { create } from "zustand";
import { normalizeExtraction } from "./certificate.lib";
import {
  CertificateDocument,
  ExtractionResult,
  SourceFile,
} from "./certificate.types";

type CertificateState = {
  document: CertificateDocument | null;
  /** 추출 결과로 새 문서를 연다. 기존 미리보기 URL 은 해제 */
  open: (source: SourceFile, result: ExtractionResult) => void;
  /** 칸 하나를 고친다. 모델 값과 같아지면 edits 에서 제거 */
  edit: (key: string, value: string) => void;
  close: () => void;
};

export const useCertificateStore = create<CertificateState>()((set, get) => ({
  document: null,
  open: (source, result) => {
    get().close();
    const normalized = normalizeExtraction(result);
    set({
      document: {
        id: crypto.randomUUID(),
        documentType: normalized.documentType,
        source,
        extracted: normalized.fields,
        edits: {},
      },
    });
  },
  edit: (key, value) =>
    set((s) => {
      if (!s.document) return s;
      const edits = { ...s.document.edits };
      if (value === (s.document.extracted[key]?.ko ?? "")) delete edits[key];
      else edits[key] = value;
      return { document: { ...s.document, edits } };
    }),
  close: () => {
    const prev = get().document;
    if (!prev) return;
    URL.revokeObjectURL(prev.source.previewUrl);
    set({ document: null });
  },
}));

export const useCertificateDocument = () =>
  useCertificateStore((s) => s.document);
