import { useState } from "react";
import { useCertificateStore } from "@/entities/certificate";
import { PanelHeader } from "./panel-header.ui";

/** 왼쪽: 원본 미리보기 (사진은 그대로, PDF 는 첫 페이지 렌더 이미지) */
export function SourcePanel() {
  // 칸을 고칠 때마다 다시 그리지 않도록 원본 정보만 구독
  const source = useCertificateStore((s) => s.document?.source);
  const [broken, setBroken] = useState(false);
  if (!source) return null;

  return (
    <section aria-label="원본" className="flex min-w-0 flex-col gap-3">
      <PanelHeader
        title="원본"
        aside={<span className="block truncate font-mono">{source.name}</span>}
      />
      <div className="border-paper-200 bg-paper-50 flex min-h-40 items-center justify-center overflow-auto rounded-lg border lg:min-h-80">
        {broken ? (
          <p className="text-ink-400 px-6 text-center text-sm">
            미리보기를 표시할 수 없는 형식입니다.
          </p>
        ) : (
          <img
            src={source.previewUrl}
            alt="업로드한 증명서"
            className="max-h-[50dvh] w-full object-contain lg:max-h-[75vh]"
            onError={() => setBroken(true)}
          />
        )}
      </div>
    </section>
  );
}
