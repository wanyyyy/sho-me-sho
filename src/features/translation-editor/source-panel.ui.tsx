import { useCertificateStore } from "@/entities/certificate";
import { PanelHeader } from "./panel-header.ui";

/** 왼쪽: 원본 미리보기. 쪽마다 이미지 하나 (사진은 그대로, PDF 는 쪽 렌더) */
export function SourcePanel() {
  // 칸을 고칠 때마다 다시 그리지 않도록 원본 정보만 구독
  const source = useCertificateStore((s) => s.document?.source);
  if (!source) return null;

  return (
    <section aria-label="원본" className="flex min-w-0 flex-col gap-3">
      <PanelHeader
        title="원본"
        aside={<span className="block truncate font-mono">{source.name}</span>}
      />
      <div className="border-paper-200 bg-paper-50 flex min-h-40 flex-col gap-3 overflow-auto rounded-lg border p-2 lg:max-h-[80vh] lg:min-h-80">
        {source.previewUrls.length === 0 ? (
          <p className="text-ink-400 m-auto px-6 text-center text-sm">
            샘플 데이터라 원본 이미지가 없습니다.
          </p>
        ) : (
          source.previewUrls.map((url, i) => (
            <figure key={url} className="flex flex-col gap-1">
              <img
                src={url}
                alt={`업로드한 증명서 ${i + 1}쪽`}
                className="w-full object-contain"
              />
              {source.previewUrls.length > 1 && (
                <figcaption className="text-ink-400 text-center text-xs">
                  {i + 1}쪽
                </figcaption>
              )}
            </figure>
          ))
        )}
      </div>
    </section>
  );
}
